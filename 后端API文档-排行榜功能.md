# 销售App排行榜功能 - 后端API开发文档

## 📋 目录

1. [功能概述](#功能概述)
2. [数据库设计](#数据库设计)
3. [API接口文档](#api接口文档)
4. [核心算法实现](#核心算法实现)
5. [业务流程说明](#业务流程说明)
6. [性能优化建议](#性能优化建议)

---

## 功能概述

### 1. 排行榜类型

- **业务员销售排行榜**：展示业务员的销售业绩排名
- **小程序模板排行榜**：展示小程序模板的销售热度排名

### 2. 排名指标

#### 业务员排行榜指标：
- `salesCount` - 销售数量（销售的小程序模板数量）
- `salesAmount` - 销售金额（小程序模板的总销售额）
- `merchantCount` - 绑定商户数
- `rating` - 好评率

#### 小程序模板排行榜指标：
- `salesCount` - 销售数量
- `salesAmount` - 销售额
- `merchantCount` - 使用商户数
- `rating` - 好评率

### 3. 时间维度
- `today` - 今日
- `week` - 本周
- `month` - 本月
- `year` - 全年

### 4. 核心功能
- 多维度排名
- 趋势计算（上升/下降/稳定）
- 搜索和筛选
- 下拉刷新
- 数据对比
- 详情查看

---

## 数据库设计

### 1. 业务员表 (salespersons)

```sql
CREATE TABLE salespersons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL COMMENT '姓名',
  phone VARCHAR(20) UNIQUE NOT NULL COMMENT '手机号',
  agent_id INT NOT NULL COMMENT '所属代理商ID',
  avatar VARCHAR(255) COMMENT '头像URL',
  role ENUM('agent', 'salesperson', 'merchant') DEFAULT 'salesperson',
  status TINYINT DEFAULT 1 COMMENT '状态 1-正常 0-禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_agent_id (agent_id),
  INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='业务员表';
```

### 2. 小程序模板表 (templates)

```sql
CREATE TABLE templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '模板名称',
  icon VARCHAR(255) COMMENT '模板图标',
  category VARCHAR(50) COMMENT '分类',
  description TEXT COMMENT '描述',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  status ENUM('published', 'pending', 'expired') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='小程序模板表';
```

### 3. 销售记录表 (sales_records)

```sql
CREATE TABLE sales_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  template_id INT NOT NULL COMMENT '模板ID',
  salesperson_id INT NOT NULL COMMENT '业务员ID',
  merchant_id INT NOT NULL COMMENT '商户ID',
  sales_amount DECIMAL(10,2) NOT NULL COMMENT '销售金额',
  sales_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '销售时间',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_template_id (template_id),
  INDEX idx_salesperson_id (salesperson_id),
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_sales_time (sales_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='销售记录表';
```

### 4. 评价表 (reviews)

```sql
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  target_type ENUM('salesperson', 'template') NOT NULL COMMENT '评价对象类型',
  target_id INT NOT NULL COMMENT '评价对象ID',
  merchant_id INT NOT NULL COMMENT '评价商户ID',
  rating DECIMAL(2,1) NOT NULL COMMENT '评分 1.0-5.0',
  comment TEXT COMMENT '评价内容',
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_target (target_type, target_id),
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';
```

### 5. 排名快照表 (ranking_snapshots)

```sql
CREATE TABLE ranking_snapshots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  target_type ENUM('salesperson', 'template') NOT NULL COMMENT '对象类型',
  target_id INT NOT NULL COMMENT '对象ID',
  metric VARCHAR(50) NOT NULL COMMENT '排名指标',
  time_range ENUM('today', 'week', 'month', 'year') NOT NULL COMMENT '时间范围',
  rank INT NOT NULL COMMENT '排名',
  value DECIMAL(15,2) NOT NULL COMMENT '指标值',
  snapshot_date DATE NOT NULL COMMENT '快照日期',
  snapshot_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_snapshot (target_type, target_id, metric, time_range, snapshot_date),
  INDEX idx_target (target_type, target_id),
  INDEX idx_metric_time (metric, time_range, snapshot_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='排名快照表';
```

---

## API接口文档

### 1. 获取业务员排行榜

**接口地址：** `GET /api/ranking/salespersons`

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| timeRange | string | 否 | 时间范围 today/week/month/year，默认week |
| metric | string | 否 | 排名指标 salesCount/salesAmount/merchantCount/rating，默认salesCount |
| keyword | string | 否 | 搜索关键词（姓名） |
| page | int | 否 | 页码，默认1 |
| pageSize | int | 否 | 每页数量，默认20 |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "rank": 1,
        "userId": 1,
        "userName": "小张",
        "avatar": "https://example.com/avatar1.jpg",
        "salesCount": 15,
        "salesAmount": 128000.00,
        "merchantCount": 8,
        "rating": 4.8,
        "trend": {
          "direction": "up",
          "icon": "↑",
          "value": 2,
          "previousRank": 3,
          "text": "上升2位"
        }
      },
      {
        "rank": 2,
        "userId": 2,
        "userName": "小李",
        "avatar": "https://example.com/avatar2.jpg",
        "salesCount": 12,
        "salesAmount": 96000.00,
        "merchantCount": 6,
        "rating": 4.6,
        "trend": {
          "direction": "down",
          "icon": "↓",
          "value": 1,
          "previousRank": 1,
          "text": "下降1位"
        }
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

### 2. 获取小程序模板排行榜

**接口地址：** `GET /api/ranking/templates`

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| timeRange | string | 否 | 时间范围 today/week/month/year，默认week |
| metric | string | 否 | 排名指标 salesCount/salesAmount/merchantCount/rating，默认salesCount |
| keyword | string | 否 | 搜索关键词（模板名称） |
| page | int | 否 | 页码，默认1 |
| pageSize | int | 否 | 每页数量，默认20 |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "rank": 1,
        "templateId": 1,
        "templateName": "在线培训小程序",
        "icon": "https://example.com/icon1.jpg",
        "category": "教育培训类",
        "salesCount": 25,
        "salesAmount": 250000.00,
        "merchantCount": 18,
        "rating": 4.9,
        "trend": {
          "direction": "up",
          "icon": "↑",
          "value": 1,
          "previousRank": 2,
          "text": "上升1位"
        }
      }
    ],
    "total": 30,
    "page": 1,
    "pageSize": 20
  }
}
```

### 3. 获取排行榜详情

**接口地址：** `GET /api/ranking/detail`

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 是 | 对象类型 salesperson/template |
| id | int | 是 | 对象ID |
| timeRange | string | 否 | 时间范围，默认week |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "type": "salesperson",
    "id": 1,
    "name": "小张",
    "avatar": "https://example.com/avatar1.jpg",
    "currentRank": 1,
    "metrics": {
      "salesCount": 15,
      "salesAmount": 128000.00,
      "merchantCount": 8,
      "rating": 4.8
    },
    "trendHistory": [
      { "date": "2026-02-01", "rank": 3 },
      { "date": "2026-02-02", "rank": 2 },
      { "date": "2026-02-03", "rank": 1 }
    ],
    "salesTrend": [
      { "date": "2026-02-01", "value": 3 },
      { "date": "2026-02-02", "value": 6 },
      { "date": "2026-02-03", "value": 15 }
    ]
  }
}
```

### 4. 对比数据

**接口地址：** `POST /api/ranking/compare`

**请求参数：**

```json
{
  "type": "salesperson",
  "ids": [1, 2, 3],
  "timeRange": "week",
  "metrics": ["salesCount", "salesAmount", "merchantCount", "rating"]
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "小张",
        "salesCount": 15,
        "salesAmount": 128000.00,
        "merchantCount": 8,
        "rating": 4.8
      },
      {
        "id": 2,
        "name": "小李",
        "salesCount": 12,
        "salesAmount": 96000.00,
        "merchantCount": 6,
        "rating": 4.6
      },
      {
        "id": 3,
        "name": "小孙",
        "salesCount": 10,
        "salesAmount": 85000.00,
        "merchantCount": 5,
        "rating": 4.9
      }
    ],
    "comparison": {
      "bestSalesCount": { "id": 1, "name": "小张", "value": 15 },
      "bestSalesAmount": { "id": 1, "name": "小张", "value": 128000.00 },
      "bestMerchantCount": { "id": 1, "name": "小张", "value": 8 },
      "bestRating": { "id": 3, "name": "小孙", "value": 4.9 }
    }
  }
}
```

### 5. 获取好评列表

**接口地址：** `GET /api/reviews/list`

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| targetType | string | 是 | 评价对象类型 salesperson/template |
| targetId | int | 是 | 评价对象ID |
| rating | decimal | 否 | 评分筛选 |
| page | int | 否 | 页码 |
| pageSize | int | 否 | 每页数量 |

**响应示例：**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "merchantName": "某某商户",
        "merchantAvatar": "https://example.com/merchant.jpg",
        "rating": 5.0,
        "comment": "小张服务非常专业，响应速度快，强烈推荐！",
        "createdAt": "2026-02-03 14:30:00",
        "likes": 12
      }
    ],
    "total": 50,
    "averageRating": 4.8
  }
}
```

---

## 核心算法实现

### 1. 趋势计算算法

#### 算法说明

趋势计算需要比较当前周期和上一个周期的排名变化。

#### 时间范围定义

```javascript
const timeRangeConfig = {
  today: {
    current: {
      start: getTodayStart(),
      end: getNow()
    },
    previous: {
      start: getYesterdayStart(),
      end: getYesterdayEnd()
    }
  },
  week: {
    current: {
      start: getThisWeekStart(),
      end: getNow()
    },
    previous: {
      start: getLastWeekStart(),
      end: getLastWeekEnd()
    }
  },
  month: {
    current: {
      start: getThisMonthStart(),
      end: getNow()
    },
    previous: {
      start: getLastMonthStart(),
      end: getLastMonthEnd()
    }
  },
  year: {
    current: {
      start: getThisYearStart(),
      end: getNow()
    },
    previous: {
      start: getLastYearStart(),
      end: getLastYearEnd()
    }
  }
}
```

#### 趋势计算函数

```javascript
/**
 * 计算排名趋势
 * @param {number} currentRank - 当前排名
 * @param {number} previousRank - 上次排名
 * @returns {Object} 趋势对象
 */
function calculateTrend(currentRank, previousRank) {
  const rankChange = previousRank - currentRank

  if (rankChange > 0) {
    return {
      direction: 'up',           // 上升
      icon: '↑',
      value: rankChange,         // 上升位数
      previousRank: previousRank,
      text: `上升${rankChange}位`
    }
  } else if (rankChange < 0) {
    return {
      direction: 'down',         // 下降
      icon: '↓',
      value: Math.abs(rankChange),
      previousRank: previousRank,
      text: `下降${Math.abs(rankChange)}位`
    }
  } else {
    return {
      direction: 'stable',       // 稳定
      icon: '—',
      value: 0,
      previousRank: previousRank,
      text: '排名不变'
    }
  }
}

/**
 * 计算业务员排名
 * @param {string} metric - 排名指标
 * @param {string} timeRange - 时间范围
 * @param {number} agentId - 代理商ID（可选）
 * @returns {Array} 排名列表
 */
async function calculateSalespersonRanking(metric, timeRange, agentId = null) {
  // 1. 获取时间范围
  const { current, previous } = timeRangeConfig[timeRange]

  // 2. 查询当前周期数据
  const currentData = await db.query(`
    SELECT
      sp.id,
      sp.name,
      sp.avatar,
      COALESCE(COUNT(DISTINCT sr.id), 0) as salesCount,
      COALESCE(SUM(sr.sales_amount), 0) as salesAmount,
      COALESCE(COUNT(DISTINCT sr.merchant_id), 0) as merchantCount,
      COALESCE(AVG(r.rating), 0) as rating
    FROM salespersons sp
    LEFT JOIN sales_records sr ON sp.id = sr.salesperson_id
      AND sr.sales_time BETWEEN ? AND ?
    LEFT JOIN reviews r ON r.target_type = 'salesperson'
      AND r.target_id = sp.id
      AND r.status = 'approved'
    WHERE sp.status = 1
      ${agentId ? 'AND sp.agent_id = ?' : ''}
    GROUP BY sp.id
    ORDER BY ${getMetricColumn(metric)} DESC
  `, [current.start, current.end, ...(agentId ? [agentId] : [])])

  // 3. 查询上一周期数据（用于计算趋势）
  const previousData = await db.query(`
    SELECT
      sp.id,
      COALESCE(${getMetricAggregate(metric)}, 0) as value
    FROM salespersons sp
    LEFT JOIN sales_records sr ON sp.id = sr.salesperson_id
      AND sr.sales_time BETWEEN ? AND ?
    LEFT JOIN reviews r ON r.target_type = 'salesperson'
      AND r.target_id = sp.id
      AND r.status = 'approved'
    WHERE sp.status = 1
      ${agentId ? 'AND sp.agent_id = ?' : ''}
    GROUP BY sp.id
    ORDER BY value DESC
  `, [previous.start, previous.end, ...(agentId ? [agentId] : [])])

  // 4. 构建上一周期排名映射
  const previousRankMap = new Map()
  previousData.forEach((item, index) => {
    previousRankMap.set(item.id, index + 1)
  })

  // 5. 组合数据并计算趋势
  const result = currentData.map((item, index) => {
    const currentRank = index + 1
    const previousRank = previousRankMap.get(item.id) || currentRank

    return {
      rank: currentRank,
      userId: item.id,
      userName: item.name,
      avatar: item.avatar,
      salesCount: item.salesCount,
      salesAmount: parseFloat(item.salesAmount),
      merchantCount: item.merchantCount,
      rating: parseFloat(item.rating).toFixed(1),
      trend: calculateTrend(currentRank, previousRank)
    }
  })

  // 6. 保存快照（用于历史数据查询）
  await saveRankingSnapshot('salesperson', result, metric, timeRange)

  return result
}

/**
 * 获取指标对应的列名
 */
function getMetricColumn(metric) {
  const columnMap = {
    salesCount: 'COUNT(DISTINCT sr.id)',
    salesAmount: 'SUM(sr.sales_amount)',
    merchantCount: 'COUNT(DISTINCT sr.merchant_id)',
    rating: 'AVG(r.rating)'
  }
  return columnMap[metric] || columnMap.salesCount
}

/**
 * 获取指标对应的聚合函数
 */
function getMetricAggregate(metric) {
  const aggregateMap = {
    salesCount: 'COUNT(DISTINCT sr.id)',
    salesAmount: 'SUM(sr.sales_amount)',
    merchantCount: 'COUNT(DISTINCT sr.merchant_id)',
    rating: 'AVG(r.rating)'
  }
  return aggregateMap[metric] || aggregateMap.salesCount
}

/**
 * 保存排名快照
 */
async function saveRankingSnapshot(targetType, rankingData, metric, timeRange) {
  const today = new Date().toISOString().split('T')[0]

  const records = rankingData.map(item => ({
    target_type: targetType,
    target_id: item.userId || item.templateId,
    metric: metric,
    time_range: timeRange,
    rank: item.rank,
    value: item[metric],
    snapshot_date: today
  }))

  // 批量插入（使用 ON DUPLICATE KEY UPDATE 处理重复）
  await db.query(`
    INSERT INTO ranking_snapshots
      (target_type, target_id, metric, time_range, rank, value, snapshot_date)
    VALUES ?
    ON DUPLICATE KEY UPDATE
      rank = VALUES(rank),
      value = VALUES(value),
      snapshot_time = CURRENT_TIMESTAMP
  `, [records])
}
```

### 2. 好评率计算算法

```javascript
/**
 * 计算好评率
 * @param {string} targetType - 对象类型
 * @param {number} targetId - 对象ID
 * @returns {Object} 评分数据
 */
async function calculateRating(targetType, targetId) {
  const result = await db.query(`
    SELECT
      COUNT(*) as totalReviews,
      SUM(CASE WHEN rating >= 4 THEN 1 ELSE 0 END) as positiveReviews,
      AVG(rating) as averageRating,
      COUNT(CASE WHEN rating = 5 THEN 1 END) as fiveStarCount,
      COUNT(CASE WHEN rating = 4 THEN 1 END) as fourStarCount,
      COUNT(CASE WHEN rating = 3 THEN 1 END) as threeStarCount,
      COUNT(CASE WHEN rating = 2 THEN 1 END) as twoStarCount,
      COUNT(CASE WHEN rating = 1 THEN 1 END) as oneStarCount
    FROM reviews
    WHERE target_type = ?
      AND target_id = ?
      AND status = 'approved'
  `, [targetType, targetId])

  const data = result[0]

  return {
    averageRating: parseFloat(data.averageRating || 0).toFixed(1),
    totalReviews: data.totalReviews,
    positiveRating: data.totalReviews > 0
      ? ((data.positiveReviews / data.totalReviews) * 100).toFixed(1) + '%'
      : '0%',
    distribution: {
      fiveStar: data.fiveStarCount,
      fourStar: data.fourStarCount,
      threeStar: data.threeStarCount,
      twoStar: data.twoStarCount,
      oneStar: data.oneStarCount
    }
  }
}
```

### 3. 搜索和筛选算法

```javascript
/**
 * 搜索和筛选排行榜
 * @param {Object} params - 查询参数
 */
async function searchRanking(params) {
  const {
    type,
    metric,
    timeRange,
    keyword,
    page = 1,
    pageSize = 20
  } = params

  let query = ''
  let queryParams = []

  if (type === 'salesperson') {
    query = `
      SELECT
        sp.id,
        sp.name,
        sp.avatar,
        ${getMetricColumn(metric)} as value
      FROM salespersons sp
      LEFT JOIN sales_records sr ON sp.id = sr.salesperson_id
        AND sr.sales_time BETWEEN ? AND ?
      WHERE sp.status = 1
        AND (sp.name LIKE ? OR sp.phone LIKE ?)
      GROUP BY sp.id
      ORDER BY value DESC
      LIMIT ? OFFSET ?
    `
  } else {
    query = `
      SELECT
        t.id,
        t.name,
        t.icon,
        t.category,
        ${getMetricColumn(metric)} as value
      FROM templates t
      LEFT JOIN sales_records sr ON t.id = sr.template_id
        AND sr.sales_time BETWEEN ? AND ?
      WHERE t.status = 'published'
        AND (t.name LIKE ? OR t.category LIKE ?)
      GROUP BY t.id
      ORDER BY value DESC
      LIMIT ? OFFSET ?
    `
  }

  const { current } = timeRangeConfig[timeRange]
  const offset = (page - 1) * pageSize
  const keywordPattern = `%${keyword}%`

  queryParams = [
    current.start,
    current.end,
    keywordPattern,
    keywordPattern,
    pageSize,
    offset
  ]

  const results = await db.query(query, queryParams)

  // 转换为前端格式
  return formatRankingResults(results, type, metric, timeRange)
}
```

---

## 业务流程说明

### 1. 排行榜生成流程

```
1. 前端请求排行榜数据
   ↓
2. 后端接收请求参数
   - 排行榜类型（业务员/模板）
   - 时间范围（今日/本周/本月/全年）
   - 排名指标（销售数量/金额/商户数/好评率）
   - 搜索关键词
   ↓
3. 查询当前周期数据
   - 根据时间范围计算SQL查询条件
   - 统计指标值
   - 按指标值降序排序
   ↓
4. 查询上一周期数据
   - 使用相同的时间跨度
   - 计算上一周期的排名
   ↓
5. 计算趋势
   - 比较当前排名和上次排名
   - 生成趋势数据（上升/下降/稳定）
   ↓
6. 保存快照
   - 将当前排名保存到快照表
   - 用于历史趋势查询
   ↓
7. 返回结果
   - 排名列表
   - 趋势信息
   - 分页信息
```

### 2. 定时任务流程

建议创建定时任务，每小时生成一次排行榜快照：

```javascript
// 定时任务：每小时生成排行榜快照
cron.schedule('0 * * * *', async () => {
  console.log('开始生成排行榜快照...')

  const types = ['salesperson', 'template']
  const metrics = ['salesCount', 'salesAmount', 'merchantCount', 'rating']
  const timeRanges = ['today', 'week', 'month', 'year']

  for (const type of types) {
    for (const metric of metrics) {
      for (const timeRange of timeRanges) {
        try {
          if (type === 'salesperson') {
            await calculateSalespersonRanking(metric, timeRange)
          } else {
            await calculateTemplateRanking(metric, timeRange)
          }
          console.log(`${type} - ${metric} - ${timeRange} 快照生成成功`)
        } catch (error) {
          console.error(`${type} - ${metric} - ${timeRange} 快照生成失败:`, error)
        }
      }
    }
  }

  console.log('排行榜快照生成完成')
})
```

---

## 性能优化建议

### 1. 数据库优化

#### 索引优化
```sql
-- 销售记录表添加复合索引
CREATE INDEX idx_sales_time ON sales_records(sales_time);
CREATE INDEX idx_salesperson_time ON sales_records(salesperson_id, sales_time);
CREATE INDEX idx_template_time ON sales_records(template_id, sales_time);

-- 快照表添加分区（按月分区）
ALTER TABLE ranking_snapshots
PARTITION BY RANGE (TO_DAYS(snapshot_date)) (
  PARTITION p202601 VALUES LESS THAN (TO_DAYS('2026-02-01')),
  PARTITION p202602 VALUES LESS THAN (TO_DAYS('2026-03-01')),
  ...
);
```

#### 查询优化
- 使用 EXPLAIN 分析慢查询
- 避免 SELECT *，只查询需要的字段
- 合理使用 LIMIT 和 OFFSET
- 大数据量时使用游标分页

### 2. 缓存策略

```javascript
// 使用 Redis 缓存排行榜数据
async function getCachedRanking(key, ttl = 3600) {
  // 1. 尝试从缓存获取
  const cached = await redis.get(key)
  if (cached) {
    return JSON.parse(cached)
  }

  // 2. 从数据库查询
  const data = await calculateRanking()

  // 3. 写入缓存
  await redis.setex(key, ttl, JSON.stringify(data))

  return data
}

// 缓存Key格式
const cacheKey = `ranking:${type}:${metric}:${timeRange}:${page}`

// 缓存失效策略
// - 定时任务更新时清除缓存
// - 有新销售记录时清除相关缓存
```

### 3. 异步处理

```javascript
// 使用消息队列异步处理排行榜计算
const queue = new Queue('ranking', {
  redis: { host: 'localhost', port: 6379 }
})

// 添加任务
queue.add('calculate', {
  type: 'salesperson',
  metric: 'salesCount',
  timeRange: 'week'
})

// 处理任务
queue.process('calculate', async (job) => {
  const { type, metric, timeRange } = job.data
  await calculateRanking(type, metric, timeRange)
})
```

### 4. 数据归档

```sql
-- 定期归档历史快照数据
-- 保留近3个月的数据，超过3个月的归档到历史表

CREATE TABLE ranking_snapshots_history LIKE ranking_snapshots;

-- 归档任务（每月执行）
INSERT INTO ranking_snapshots_history
SELECT * FROM ranking_snapshots
WHERE snapshot_date < DATE_SUB(NOW(), INTERVAL 3 MONTH);

DELETE FROM ranking_snapshots
WHERE snapshot_date < DATE_SUB(NOW(), INTERVAL 3 MONTH);
```

---

## 附录

### 1. 错误码定义

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未授权 |
| 500 | 服务器错误 |

### 2. 前端对接示例

```javascript
// 获取业务员排行榜
async function getSalespersonRanking() {
  const response = await uni.request({
    url: 'https://api.example.com/api/ranking/salespersons',
    method: 'GET',
    data: {
      timeRange: 'week',
      metric: 'salesCount',
      keyword: '',
      page: 1,
      pageSize: 20
    }
  })

  return response.data
}
```

### 3. 测试数据准备

```sql
-- 插入测试业务员
INSERT INTO salespersons (name, phone, agent_id) VALUES
('小张', '13800000001', 1),
('小李', '13800000002', 1),
('小孙', '13800000003', 1);

-- 插入测试模板
INSERT INTO templates (name, category, price) VALUES
('在线培训小程序', '教育培训类', 8000),
('电商商城模板', '电商类', 9000),
('点餐平台', '点餐平台类', 12000);

-- 插入测试销售记录
INSERT INTO sales_records (template_id, salesperson_id, merchant_id, sales_amount, sales_time) VALUES
(1, 1, 1, 8000, '2026-02-01 10:00:00'),
(1, 1, 2, 8000, '2026-02-02 11:00:00'),
(2, 2, 3, 9000, '2026-02-01 14:00:00');
```

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2026-02-08 | 初始版本 |

---

**文档维护者：** 开发团队
**最后更新：** 2026-02-08
**联系方式：** tech@example.com
