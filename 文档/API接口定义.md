# API 接口定义文档

## 概述

本文档定义了前端需要调用的后端API接口，供后端开发参考。

---

## 1. 模板详情接口

### 1.1 获取模板详情

**接口地址**：`GET /api/template/detail`

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| templateId | number | 是 | 模板ID |

**请求示例**：
```http
GET /api/template/detail?templateId=1
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "baseInfo": {
      "id": 1,
      "name": "在线培训小程序",
      "category": "教育培训类",
      "price": 9800,
      "rating": 4.9,
      "tags": ["在线学习", "直播授课", "考试系统"],
      "agentName": "小张",
      "agentId": 1,
      "updatedAt": "2天前"
    },
    "banner": [
      {
        "type": "image",
        "url": "https://xxx.com/banner1.jpg",
        "title": "首页截图"
      },
      {
        "type": "video",
        "url": "https://xxx.com/demo.mp4",
        "thumbnail": "https://xxx.com/thumb.jpg",
        "title": "功能演示"
      }
    ],
    "modules": [
      {
        "id": "features",
        "title": "核心特色",
        "icon": "✨",
        "expanded": true,
        "contents": [
          {
            "type": "image",
            "url": "https://xxx.com/feature1.jpg",
            "title": "学员管理"
          },
          {
            "type": "feature-list",
            "title": "主要功能",
            "features": [
              "学员管理系统 - 支持学员注册、信息管理、学习进度追踪",
              "在线考试系统 - 题库管理、自动组卷、在线答题、成绩统计"
            ]
          }
        ]
      }
    ]
  }
}
```

**数据结构**：

```typescript
interface TemplateDetailResponse {
  baseInfo: {
    id: number
    name: string
    category: string
    price: number
    rating: number
    tags: string[]
    agentName: string
    agentId: number
    updatedAt: string
  }
  banner: Array<{
    type: 'image' | 'video'
    url: string
    thumbnail?: string
    title?: string
  }>
  modules: Array<{
    id: string
    title: string
    icon: string
    expanded: boolean
    contents: Array<{
      type: 'image' | 'video' | 'text' | 'feature-list'
      url?: string
      thumbnail?: string
      text?: string
      features?: string[]
      title?: string
    }>
  }>
}
```

---

## 2. 业务员详情接口

### 2.1 获取业务员详情

**接口地址**：`GET /api/salesperson/detail`

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| personId | number | 是 | 业务员ID |

**请求示例**：
```http
GET /api/salesperson/detail?personId=1
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "name": "小张",
    "phone": "138****1234",
    "role": "salesperson",
    "rating": 4.8,
    "currentRank": 1,
    "trend": {
      "direction": "up",
      "value": 2
    },
    "salesAmount": "128000",
    "salesCount": 15,
    "merchantCount": 8,
    "target": {
      "monthlyGoal": 200000,
      "completedAmount": 128000,
      "completionRate": 64,
      "remainingAmount": 72000
    },
    "teamInfo": {
      "totalMembers": 50,
      "myPosition": 1
    },
    "vsTeamAverage": "+20%",
    "totalReviews": 48,
    "rankHistory": [
      { "date": "02-01", "value": 5 },
      { "date": "02-02", "value": 3 },
      { "date": "02-03", "value": 2 },
      { "date": "02-04", "value": 1 },
      { "date": "02-05", "value": 1 },
      { "date": "02-06", "value": 1 },
      { "date": "02-07", "value": 1 }
    ],
    "salesTrend": [
      { "date": "周一", "value": 15000 },
      { "date": "周二", "value": 22000 },
      { "date": "周三", "value": 18000 },
      { "date": "周四", "value": 25000 },
      { "date": "周五", "value": 28000 },
      { "date": "周六", "value": 12000 },
      { "date": "周日", "value": 8000 }
    ],
    "records": [
      {
        "templateName": "在线培训小程序",
        "merchantName": "张三的商城",
        "amount": 8000,
        "date": "02-08"
      }
    ],
    "reviews": [
      {
        "merchantName": "某某商城",
        "comment": "小张服务非常专业，响应速度快，强烈推荐！",
        "date": "2026-02-08",
        "rating": 5
      }
    ]
  }
}
```

**数据结构**：

```typescript
interface SalespersonDetailResponse {
  name: string
  phone: string
  role: string
  rating: number
  currentRank: number
  trend: {
    direction: 'up' | 'down' | 'stable'
    value: number
  }
  salesAmount: string
  salesCount: number
  merchantCount: number
  target: {
    monthlyGoal: number
    completedAmount: number
    completionRate: number
    remainingAmount: number
  }
  teamInfo: {
    totalMembers: number
    myPosition: number
  }
  vsTeamAverage: string
  totalReviews: number
  rankHistory: Array<{
    date: string
    value: number
  }>
  salesTrend: Array<{
    date: string
    value: number
  }>
  records: Array<{
    templateName: string
    merchantName: string
    amount: number
    date: string
  }>
  reviews: Array<{
    merchantName: string
    comment: string
    date: string
    rating: number
  }>
}
```

---

## 3. 通用响应格式

### 3.1 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": { /* 业务数据 */ }
}
```

### 3.2 错误响应

```json
{
  "code": 400,
  "message": "错误信息描述",
  "data": null
}
```

### 3.3 常见状态码

| code | 说明 |
|------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 4. 开发注意事项

### 4.1 数据格式

1. **金额字段**：
   - 前端展示时可能需要格式化（如：128000 → 12.8万）
   - 后端返回数字类型，前端负责格式化

2. **日期字段**：
   - 统一使用 `MM-DD` 或 `YYYY-MM-DD` 格式
   - `updatedAt` 等相对时间字段可以是"2天前"这种格式

3. **图片/视频URL**：
   - 建议使用完整URL（包含协议和域名）
   - 或使用相对路径，前端配合 baseURL 处理

### 4.2 分页参数

如果接口支持分页，建议使用以下参数：

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| page | number | 1 | 页码 |
| pageSize | number | 20 | 每页数量 |

### 4.3 错误处理

前端会进行以下错误处理：

```typescript
try {
  const res = await uni.request({
    url: '/api/template/detail',
    method: 'GET',
    data: { templateId: 1 }
  })

  if (res.data.code === 200) {
    // 成功处理
  } else {
    // 业务错误，显示 message
    uni.showToast({
      title: res.data.message,
      icon: 'none'
    })
  }
} catch (error) {
  // 网络错误或其他异常
  uni.showToast({
    title: '加载失败，请稍后重试',
    icon: 'none'
  })
}
```

### 4.4 开发环境模拟数据

前端在开发环境使用了模拟数据，模拟数据结构请参考本文档中的响应示例。

后端开发完成后，前端会切换到真实接口。

---

## 5. 接口测试

### 5.1 测试工具推荐

- **Postman**：API 测试工具
- **Swagger**：API 文档和测试
- **Charles**：抓包调试

### 5.2 测试账号

建议提供测试账号和数据：

```javascript
// 测试模板ID
const testTemplateIds = [1, 2, 3]

// 测试业务员ID
const testPersonIds = [1, 2, 3]
```

---

## 6. 联调时间安排

### 6.1 前端已完成

- ✅ 页面UI开发完成
- ✅ 数据结构定义完成
- ✅ 模拟数据准备完成
- ✅ 接口调用逻辑完成

### 6.2 等待后端

- ⏳ 接口开发
- ⏳ 接口测试
- ⏳ 联调测试

### 6.3 联调检查清单

- [ ] 模板详情接口
  - [ ] 正常数据返回
  - [ ] 数据为空处理
  - [ ] 错误处理
  - [ ] 图片/视频资源加载

- [ ] 业务员详情接口
  - [ ] 正常数据返回
  - [ ] 数据为空处理
  - [ ] 错误处理
  - [ ] 图表数据正确性

---

## 7. 联系方式

如有疑问，请联系：

- **前端开发**：[联系方式]
- **后端开发**：[联系方式]
- **项目经理**：[联系方式]

---

**文档版本**：v1.0
**最后更新**：2026-02-08
