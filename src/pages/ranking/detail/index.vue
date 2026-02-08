<template>
  <view class="detail-page">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>

    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-content">
        <view class="nav-left" @click="goBack">
          <text class="back-arrow">‹</text>
        </view>
        <view class="nav-title">
          <text class="title-text">{{ pageTitle }}</text>
        </view>
        <view class="nav-right"></view>
      </view>
    </view>

    <!-- 标签导航栏（固定，可点击跳转） -->
    <view class="tab-nav">
      <scroll-view scroll-x class="tab-scroll">
        <view class="tab-list">
          <view
            v-for="(tab, index) in tabs"
            :key="index"
            :class="['tab-item', { active: currentTab === index }]"
            @click="handleTabClick(index)"
          >
            <text class="tab-text">{{ tab.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 内容区域 -->
    <scroll-view
      scroll-y
      class="content-scroll"
      :scroll-into-view="scrollIntoView"
      scroll-with-animation
    >
      <!-- 加载状态 -->
      <view v-if="!detailData.name" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 数据加载后的内容 -->
      <template v-else>
      <!-- 1. 概况模块 -->
      <view id="section-overview" class="section-block">
        <!-- 基本信息 -->
        <view class="info-header">
          <view class="avatar-large">
            <text class="avatar-char">{{ detailData.name?.charAt(0) || '?' }}</text>
          </view>
          <view class="basic-info">
            <text class="info-name">{{ detailData.name }}</text>
            <text class="info-phone">{{ detailData.phone }}</text>
            <view class="info-tags">
              <text class="tag-role">{{ getRoleText(detailData.role) }}</text>
              <text class="tag-rating">⭐ {{ detailData.rating }}</text>
            </view>
          </view>
        </view>

        <!-- 当前排名卡片 -->
        <view class="rank-card">
          <view class="rank-header">
            <text class="rank-title">当前排名</text>
            <text class="rank-time">本周</text>
          </view>
          <view class="rank-content">
            <view class="rank-number-large">{{ detailData.currentRank }}</view>
            <view class="rank-label">位</view>
          </view>
          <view class="rank-trend" :class="detailData.trend.direction">
            <text class="trend-icon">{{ detailData.trend.icon }}</text>
            <text class="trend-text">{{ getTrendText(detailData.trend) }}</text>
          </view>
        </view>
      </view>

      <!-- 2. 数据模块 -->
      <view id="section-stats" class="section-block">
        <view class="section-header" @click="toggleSection('stats')">
          <text class="section-title">📊 数据统计</text>
          <text class="toggle-icon">{{ expandedSections.stats ? '▲' : '▼' }}</text>
        </view>

        <view v-if="expandedSections.stats" class="section-content">
          <!-- 销售数据 -->
          <view class="stats-grid">
            <view class="stat-card">
              <text class="stat-icon">💰</text>
              <text class="stat-value">{{ formatAmount(detailData.salesAmount) }}</text>
              <text class="stat-label">销售金额</text>
            </view>
            <view class="stat-card">
              <text class="stat-icon">📊</text>
              <text class="stat-value">{{ detailData.salesCount }}</text>
              <text class="stat-label">销售单数</text>
            </view>
            <view class="stat-card">
              <text class="stat-icon">👥</text>
              <text class="stat-value">{{ detailData.merchantCount }}</text>
              <text class="stat-label">绑定商户</text>
            </view>
            <view class="stat-card">
              <text class="stat-icon">⭐</text>
              <text class="stat-value">{{ detailData.rating }}</text>
              <text class="stat-label">好评率</text>
            </view>
          </view>

          <!-- 目标完成度 -->
          <view class="target-card">
            <view class="target-header">
              <text class="target-title">🎯 本月目标</text>
            </view>
            <view class="target-progress">
              <view class="progress-info">
                <text class="progress-text">已完成 {{ detailData.target?.completionRate || 0 }}%</text>
                <text class="progress-amount">{{ formatAmount(detailData.target?.completedAmount || 0) }} / {{ formatAmount(detailData.target?.monthlyGoal || 0) }}</text>
              </view>
              <view class="progress-bar-bg">
                <view
                  class="progress-bar-fill"
                  :style="{ width: (detailData.target?.completionRate || 0) + '%' }"
                ></view>
              </view>
              <text class="target-remaining">还差：{{ formatAmount(detailData.target?.remainingAmount || 0) }}</text>
            </view>
          </view>

          <!-- 团队对比 -->
          <view class="compare-card">
            <view class="compare-header">
              <text class="compare-title">🔄 团队对比</text>
            </view>
            <view class="compare-item">
              <text class="compare-label">团队排名</text>
              <text class="compare-value">{{ detailData.teamInfo?.myPosition || 0 }} / {{ detailData.teamInfo?.totalMembers || 0 }}</text>
            </view>
            <view class="compare-item">
              <text class="compare-label">vs 团队平均</text>
              <text class="compare-value highlight">{{ detailData.vsTeamAverage || '+20%' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 3. 趋势模块 -->
      <view id="section-trend" class="section-block">
        <view class="section-header" @click="toggleSection('trend')">
          <text class="section-title">📈 数据趋势</text>
          <text class="toggle-icon">{{ expandedSections.trend ? '▲' : '▼' }}</text>
        </view>

        <view v-if="expandedSections.trend" class="section-content">
          <!-- 排名趋势 -->
          <view class="chart-card">
            <view class="chart-header">
              <text class="chart-title">近7天排名变化</text>
            </view>
            <SimpleLineChart
              canvas-id="rankChart"
              :data="detailData.rankHistory"
              :width="335"
              :height="200"
              color="#667eea"
            />
            <!-- 关键指标 -->
            <view class="metrics-grid">
              <view class="metric-item" @click="goToRankDetail('best')">
                <text class="metric-label">最佳排名</text>
                <text class="metric-value">第{{ getBestRank() }}名</text>
                <text class="metric-arrow">›</text>
              </view>
              <view class="metric-item" @click="goToRankDetail('worst')">
                <text class="metric-label">最低排名</text>
                <text class="metric-value">第{{ getWorstRank() }}名</text>
                <text class="metric-arrow">›</text>
              </view>
              <view class="metric-item" @click="goToRankDetail('avg')">
                <text class="metric-label">平均排名</text>
                <text class="metric-value">第{{ getAvgRank() }}名</text>
                <text class="metric-arrow">›</text>
              </view>
            </view>
            <view class="view-all-btn" @click="goToRankDetail('all')">
              <text class="view-all-text">查看完整数据 ›</text>
            </view>
          </view>

          <!-- 销售趋势 -->
          <view class="chart-card">
            <view class="chart-header">
              <text class="chart-title">本周销售额趋势</text>
            </view>
            <SimpleBarChart
              canvas-id="salesChart"
              :data="detailData.salesTrend"
              :width="335"
              :height="200"
              color="#764ba2"
            />
            <!-- 关键指标 -->
            <view class="metrics-grid">
              <view class="metric-item" @click="goToSalesDetail('best')">
                <text class="metric-label">最高单日</text>
                <text class="metric-value">{{ formatAmount(getBestSales()) }}</text>
                <text class="metric-arrow">›</text>
              </view>
              <view class="metric-item" @click="goToSalesDetail('worst')">
                <text class="metric-label">最低单日</text>
                <text class="metric-value">{{ formatAmount(getWorstSales()) }}</text>
                <text class="metric-arrow">›</text>
              </view>
              <view class="metric-item" @click="goToSalesDetail('total')">
                <text class="metric-label">本周总计</text>
                <text class="metric-value">{{ formatAmount(getTotalSales()) }}</text>
                <text class="metric-arrow">›</text>
              </view>
            </view>
            <view class="view-all-btn" @click="goToSalesDetail('all')">
              <text class="view-all-text">查看完整数据 ›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 4. 记录模块 -->
      <view id="section-records" class="section-block">
        <view class="section-header" @click="toggleSection('records')">
          <text class="section-title">📜 销售记录</text>
          <text class="toggle-icon">{{ expandedSections.records ? '▲' : '▼' }}</text>
        </view>

        <view v-if="expandedSections.records" class="section-content">
          <!-- 时间筛选 -->
          <view class="time-filter">
            <view
              v-for="(item, index) in ['本周', '本月', '全年']"
              :key="index"
              :class="['filter-item', { active: recordTimeIndex === index }]"
              @click="recordTimeIndex = index; loadRecords()"
            >
              {{ item }}
            </view>
          </view>

          <!-- 记录列表 -->
          <view class="record-list">
            <view v-for="(record, index) in records" :key="index" class="record-item">
              <view class="record-icon">📦</view>
              <view class="record-info">
                <text class="record-name">{{ record.templateName }}</text>
                <text class="record-merchant">商户：{{ record.merchantName }}</text>
              </view>
              <view class="record-right">
                <text class="record-amount">{{ formatAmount(record.amount) }}</text>
                <text class="record-date">{{ record.date }}</text>
              </view>
            </view>
          </view>

          <!-- 查看更多 -->
          <view class="view-more" @click="loadMoreRecords">
            <text class="view-more-text">{{ hasMoreRecords ? '加载更多' : '没有更多了' }}</text>
          </view>
        </view>
      </view>

      <!-- 5. 评价模块 -->
      <view id="section-reviews" class="section-block">
        <view class="section-header" @click="toggleSection('reviews')">
          <text class="section-title">⭐ 客户评价</text>
          <text class="toggle-icon">{{ expandedSections.reviews ? '▲' : '▼' }}</text>
        </view>

        <view v-if="expandedSections.reviews" class="section-content">
          <!-- 评分统计 -->
          <view class="rating-summary">
            <view class="summary-main">
              <text class="summary-score">{{ detailData.rating }}</text>
              <text class="summary-stars">⭐⭐⭐⭐⭐</text>
              <text class="summary-count">{{ detailData.totalReviews }}条评价</text>
            </view>
            <view class="summary-detail">
              <view class="rating-bar">
                <text class="bar-label">5星</text>
                <view class="bar-track">
                  <view class="bar-fill" :style="{ width: '85%' }"></view>
                </view>
                <text class="bar-count">42</text>
              </view>
              <view class="rating-bar">
                <text class="bar-label">4星</text>
                <view class="bar-track">
                  <view class="bar-fill" :style="{ width: '10%' }"></view>
                </view>
                <text class="bar-count">4</text>
              </view>
              <view class="rating-bar">
                <text class="bar-label">3星</text>
                <view class="bar-track">
                  <view class="bar-fill" :style="{ width: '5%' }"></view>
                </view>
                <text class="bar-count">2</text>
              </view>
            </view>
          </view>

          <!-- 评价列表 -->
          <view class="review-list">
            <view v-for="(review, index) in reviews" :key="index" class="review-item">
              <view class="review-stars">
                <text v-for="i in 5" :key="i">⭐</text>
              </view>
              <text class="review-text">{{ review.comment }}</text>
              <view class="review-footer">
                <text class="review-merchant">- {{ review.merchantName }}</text>
                <text class="review-date">{{ review.date }}</text>
              </view>
            </view>
          </view>

          <!-- 查看更多 -->
          <view class="view-more" @click="loadMoreReviews">
            <text class="view-more-text">{{ hasMoreReviews ? '查看更多评价' : '没有更多了' }}</text>
          </view>
        </view>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-area-bottom"></view>
      </template>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import SimpleLineChart from '../../../components/charts/SimpleLineChart.vue'
import SimpleBarChart from '../../../components/charts/SimpleBarChart.vue'

// 显式注册组件（Uniapp需要）
defineOptions({
  components: {
    SimpleLineChart,
    SimpleBarChart
  }
})

// 页面参数
const pageTitle = ref('业务员详情')
const detailType = ref<'salesperson' | 'template'>('salesperson')
const detailId = ref<number>(0)

// 导航标签
const tabs = [
  { label: '概况', id: 'section-overview' },
  { label: '数据', id: 'section-stats' },
  { label: '趋势', id: 'section-trend' },
  { label: '记录', id: 'section-records' },
  { label: '评价', id: 'section-reviews' }
]
const currentTab = ref(0)
const scrollIntoView = ref('')

// 模块展开状态
const expandedSections = ref({
  stats: true,
  trend: true,
  records: true,
  reviews: true
})

// 详情数据
const detailData = ref<any>({
  name: '',
  phone: '',
  role: '',
  rating: 0,
  currentRank: 0,
  trend: { direction: '', value: 0 },
  salesAmount: '',
  salesCount: 0,
  merchantCount: 0,
  target: {
    monthlyGoal: 0,
    completedAmount: 0,
    completionRate: 0,
    remainingAmount: 0
  },
  teamInfo: {
    totalMembers: 0,
    myPosition: 0
  },
  vsTeamAverage: '',
  totalReviews: 0,
  rankHistory: [],
  salesTrend: []
})

// 加载详情数据
const loadDetail = async () => {
  if (!detailId.value) {
    uni.showToast({
      title: 'ID不能为空',
      icon: 'none'
    })
    return
  }

  // 开发环境：直接使用模拟数据
  console.log('加载业务员详情，personId:', detailId.value)
  loadMockData()

  // TODO: 生产环境取消注释以下代码，调用真实API
  /*
  try {
    const res = await uni.request({
      url: '/api/salesperson/detail',
      method: 'GET',
      data: { personId: detailId.value }
    })

    if (res.data.code === 200 && res.data.data) {
      detailData.value = res.data.data
      records.value = res.data.data.records || []
      reviews.value = res.data.data.reviews || []
    } else {
      throw new Error(res.data.message || '获取数据失败')
    }
  } catch (error) {
    console.error('加载详情失败:', error)
    uni.showToast({
      title: '加载失败，请稍后重试',
      icon: 'none'
    })
    loadMockData()
  }
  */
}

// 模拟数据生成（仅开发环境使用）
const loadMockData = () => {
  const mockPersons: Record<number, any> = {
    1: {
      name: '小张',
      phone: '138****1234',
      role: 'salesperson',
      rating: 4.8,
      currentRank: 1,
      trend: { direction: 'up', value: 2 },
      salesAmount: '128000',
      salesCount: 15,
      merchantCount: 8,
      target: {
        monthlyGoal: 200000,
        completedAmount: 128000,
        completionRate: 64,
        remainingAmount: 72000
      },
      teamInfo: {
        totalMembers: 50,
        myPosition: 1
      },
      vsTeamAverage: '+20%',
      totalReviews: 48,
      rankHistory: [
        { date: '02-01', value: 5 },
        { date: '02-02', value: 3 },
        { date: '02-03', value: 2 },
        { date: '02-04', value: 1 },
        { date: '02-05', value: 1 },
        { date: '02-06', value: 1 },
        { date: '02-07', value: 1 }
      ],
      salesTrend: [
        { date: '周一', value: 15000 },
        { date: '周二', value: 22000 },
        { date: '周三', value: 18000 },
        { date: '周四', value: 25000 },
        { date: '周五', value: 28000 },
        { date: '周六', value: 12000 },
        { date: '周日', value: 8000 }
      ]
    },
    2: {
      name: '小李',
      phone: '139****5678',
      role: 'salesperson',
      rating: 4.6,
      currentRank: 2,
      trend: { direction: 'down', value: 1 },
      salesAmount: '96000',
      salesCount: 12,
      merchantCount: 6,
      target: {
        monthlyGoal: 200000,
        completedAmount: 96000,
        completionRate: 48,
        remainingAmount: 104000
      },
      teamInfo: {
        totalMembers: 50,
        myPosition: 2
      },
      vsTeamAverage: '+5%',
      totalReviews: 35,
      rankHistory: [
        { date: '02-01', value: 2 },
        { date: '02-02', value: 2 },
        { date: '02-03', value: 3 },
        { date: '02-04', value: 2 },
        { date: '02-05', value: 3 },
        { date: '02-06', value: 2 },
        { date: '02-07', value: 2 }
      ],
      salesTrend: [
        { date: '周一', value: 12000 },
        { date: '周二', value: 15000 },
        { date: '周三', value: 18000 },
        { date: '周四', value: 14000 },
        { date: '周五', value: 20000 },
        { date: '周六', value: 10000 },
        { date: '周日', value: 9000 }
      ]
    },
    3: {
      name: '小孙',
      phone: '137****9012',
      role: 'salesperson',
      rating: 4.9,
      currentRank: 3,
      trend: { direction: 'up', value: 3 },
      salesAmount: '85000',
      salesCount: 10,
      merchantCount: 5,
      target: {
        monthlyGoal: 200000,
        completedAmount: 85000,
        completionRate: 42.5,
        remainingAmount: 115000
      },
      teamInfo: {
        totalMembers: 50,
        myPosition: 3
      },
      vsTeamAverage: '+8%',
      totalReviews: 32,
      rankHistory: [
        { date: '02-01', value: 6 },
        { date: '02-02', value: 5 },
        { date: '02-03', value: 4 },
        { date: '02-04', value: 4 },
        { date: '02-05', value: 3 },
        { date: '02-06', value: 3 },
        { date: '02-07', value: 3 }
      ],
      salesTrend: [
        { date: '周一', value: 10000 },
        { date: '周二', value: 12000 },
        { date: '周三', value: 15000 },
        { date: '周四', value: 18000 },
        { date: '周五', value: 16000 },
        { date: '周六', value: 8000 },
        { date: '周日', value: 6000 }
      ]
    },
    4: {
      name: '小周',
      phone: '136****3456',
      role: 'salesperson',
      rating: 4.5,
      currentRank: 4,
      trend: { direction: 'stable', value: 0 },
      salesAmount: '64000',
      salesCount: 8,
      merchantCount: 4,
      target: {
        monthlyGoal: 200000,
        completedAmount: 64000,
        completionRate: 32,
        remainingAmount: 136000
      },
      teamInfo: {
        totalMembers: 50,
        myPosition: 4
      },
      vsTeamAverage: '-5%',
      totalReviews: 22,
      rankHistory: [
        { date: '02-01', value: 4 },
        { date: '02-02', value: 4 },
        { date: '02-03', value: 5 },
        { date: '02-04', value: 4 },
        { date: '02-05', value: 4 },
        { date: '02-06', value: 4 },
        { date: '02-07', value: 4 }
      ],
      salesTrend: [
        { date: '周一', value: 8000 },
        { date: '周二', value: 9000 },
        { date: '周三', value: 10000 },
        { date: '周四', value: 12000 },
        { date: '周五', value: 11000 },
        { date: '周六', value: 7000 },
        { date: '周日', value: 7000 }
      ]
    },
    5: {
      name: '小王',
      phone: '135****7890',
      role: 'salesperson',
      rating: 4.7,
      currentRank: 5,
      trend: { direction: 'down', value: 2 },
      salesAmount: '56000',
      salesCount: 7,
      merchantCount: 4,
      target: {
        monthlyGoal: 200000,
        completedAmount: 56000,
        completionRate: 28,
        remainingAmount: 144000
      },
      teamInfo: {
        totalMembers: 50,
        myPosition: 5
      },
      vsTeamAverage: '-8%',
      totalReviews: 18,
      rankHistory: [
        { date: '02-01', value: 3 },
        { date: '02-02', value: 3 },
        { date: '02-03', value: 3 },
        { date: '02-04', value: 4 },
        { date: '02-05', value: 5 },
        { date: '02-06', value: 5 },
        { date: '02-07', value: 5 }
      ],
      salesTrend: [
        { date: '周一', value: 7000 },
        { date: '周二', value: 8000 },
        { date: '周三', value: 9000 },
        { date: '周四', value: 10000 },
        { date: '周五', value: 11000 },
        { date: '周六', value: 6000 },
        { date: '周日', value: 5000 }
      ]
    }
  }

  // 根据 ID 返回对应数据
  const data = mockPersons[detailId.value] || mockPersons[1]
  console.log('=== loadMockData (业务员) ===')
  console.log('请求的 detailId:', detailId.value)
  console.log('找到的数据:', data)
  console.log('业务员姓名:', data?.name)

  detailData.value = data

  console.log('detailData 已赋值')

  // 设置对应的销售记录和评价
  records.value = [
    { templateName: '在线培训小程序', merchantName: '张三的商城', amount: 8000, date: '02-08' },
    { templateName: '电商商城模板', merchantName: '李四商城', amount: 9000, date: '02-07' },
    { templateName: '点餐平台', merchantName: '王五餐厅', amount: 12000, date: '02-06' },
    { templateName: '在线培训小程序', merchantName: '赵六教育', amount: 8000, date: '02-05' }
  ]

  reviews.value = [
    {
      merchantName: '某某商城',
      comment: `${data.name}服务非常专业，响应速度快，强烈推荐！`,
      date: '2026-02-08',
      rating: 5
    },
    {
      merchantName: '某某教育',
      comment: '模板质量很好，售后也很贴心，下次继续合作！',
      date: '2026-02-07',
      rating: 5
    },
    {
      merchantName: '某某餐厅',
      comment: '很专业的业务员，解答问题很耐心。',
      date: '2026-02-06',
      rating: 5
    }
  ]
}

// 原来的详情数据（已被上面的 loadDetail 替代）
// const detailData = ref<any>({ ... })  // 已删除

// 销售记录
const recordTimeIndex = ref(0)
const records = ref<any[]>([])
const hasMoreRecords = ref(true)  // 添加缺失的变量

// 评价列表
const reviews = ref<any[]>([])
const hasMoreReviews = ref(true)

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 获取角色文本
const getRoleText = (role: string) => {
  const roleMap: Record<string, string> = {
    agent: '代理商',
    salesperson: '业务员',
    merchant: '商户'
  }
  return roleMap[role] || role
}

// 获取趋势文本
const getTrendText = (trend: any) => {
  if (trend.direction === 'up') return `上升${trend.value}位`
  if (trend.direction === 'down') return `下降${trend.value}位`
  return '排名不变'
}

// 格式化金额
const formatAmount = (amount: number | string) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 点击标签跳转
const handleTabClick = (index: number) => {
  currentTab.value = index
  scrollIntoView.value = tabs[index].id

  // 自动展开对应模块
  const sectionMap = ['section-overview', 'section-stats', 'section-trend', 'section-records', 'section-reviews']
  const sectionKey = sectionMap[index].replace('section-', '') as keyof typeof expandedSections.value
  if (sectionKey) {
    expandedSections.value[sectionKey] = true
  }
}

// 切换模块展开/收起
const toggleSection = (section: keyof typeof expandedSections.value) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

// 加载销售记录
const loadRecords = () => {
  console.log('加载销售记录，时间范围：', recordTimeIndex.value)
  // TODO: 调用API加载记录
}

// 加载更多记录
const loadMoreRecords = () => {
  if (!hasMoreRecords.value) return
  console.log('加载更多销售记录')
  // TODO: 调用API加载更多
}

// 加载更多评价
const loadMoreReviews = () => {
  if (!hasMoreReviews.value) return
  console.log('加载更多评价')
  // TODO: 调用API加载更多
}

// 排名指标计算
const getBestRank = () => {
  const ranks = detailData.value.rankHistory.map(d => d.value)
  return Math.min(...ranks)
}

const getWorstRank = () => {
  const ranks = detailData.value.rankHistory.map(d => d.value)
  return Math.max(...ranks)
}

const getAvgRank = () => {
  const ranks = detailData.value.rankHistory.map(d => d.value)
  const avg = ranks.reduce((a, b) => a + b, 0) / ranks.length
  return Math.round(avg)
}

// 销售指标计算
const getBestSales = () => {
  const sales = detailData.value.salesTrend.map(d => d.value)
  return Math.max(...sales)
}

const getWorstSales = () => {
  const sales = detailData.value.salesTrend.map(d => d.value)
  return Math.min(...sales)
}

const getTotalSales = () => {
  const sales = detailData.value.salesTrend.map(d => d.value)
  return sales.reduce((a, b) => a + b, 0)
}

// 跳转到排名详情
const goToRankDetail = (type: string) => {
  console.log('查看排名详情:', type)
  uni.navigateTo({
    url: `/src/pages/ranking/rank-detail/index?type=${type}&personId=${detailId.value}`
  })
}

// 跳转到销售详情
const goToSalesDetail = (type: string) => {
  console.log('查看销售详情:', type)
  uni.navigateTo({
    url: `/src/pages/ranking/sales-detail/index?type=${type}&personId=${detailId.value}`
  })
}

// onLoad 生命周期（Uniapp小程序页面参数在这里获取）
onLoad((options: any) => {
  console.log('=== 业务员详情页 onLoad ===')
  console.log('原始 options:', options)
  console.log('options.id:', options?.id)
  console.log('options.type:', options?.type)

  detailType.value = options?.type || 'salesperson'

  // 修复参数解析：确保正确获取 ID
  const idParam = options?.id
  detailId.value = idParam ? parseInt(idParam) : 0

  console.log('解析后的 detailId:', detailId.value)
  console.log('详情页参数：', { type: detailType.value, id: detailId.value })

  // 根据类型设置标题
  pageTitle.value = detailType.value === 'salesperson' ? '业务员详情' : '模板详情'

  // 加载详情数据
  loadDetail()
})

onMounted(async () => {
  // 等待DOM更新后再绘制图表
  await nextTick()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.detail-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: $bg-color;
}

.status-bar {
  height: var(--status-bar-height);
  background-color: #ffffff;
}

.navbar {
  background-color: #ffffff;
  border-bottom: 1rpx solid $border-color;
  position: sticky;
  top: 0;
  z-index: 100;

  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;
    padding: 0 $spacing-md;
  }

  .nav-left {
    width: 80rpx;
    display: flex;
    align-items: center;

    .back-arrow {
      font-size: 60rpx;
      color: $text-color;
      font-weight: 300;
      line-height: 1;
    }
  }

  .nav-title {
    flex: 1;
    text-align: center;

    .title-text {
      font-size: $font-size-xl;
      font-weight: bold;
      color: $text-color;
    }
  }

  .nav-right {
    width: 80rpx;
  }
}

.tab-nav {
  background-color: #ffffff;
  border-bottom: 1rpx solid $border-color;
  position: sticky;
  top: var(--status-bar-height);
  z-index: 99;

  .tab-scroll {
    white-space: nowrap;
  }

  .tab-list {
    display: inline-flex;
    padding: 0 $spacing-md;
  }

  .tab-item {
    padding: $spacing-sm $spacing-md;
    margin-right: $spacing-sm;
    border-radius: 20rpx;

    .tab-text {
      font-size: $font-size-base;
      color: $text-color-secondary;
      white-space: nowrap;
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

      .tab-text {
        color: #ffffff;
        font-weight: bold;
      }
    }
  }
}

.content-scroll {
  flex: 1;
  height: 0;
}

.section-block {
  margin-bottom: $spacing-md;
  background-color: #ffffff;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  border-bottom: 1rpx solid $border-color;

  .section-title {
    font-size: $font-size-lg;
    font-weight: bold;
    color: $text-color;
  }

  .toggle-icon {
    font-size: $font-size-sm;
    color: $text-color-secondary;
  }
}

.section-content {
  padding: $spacing-md;
}

// 概况模块
.info-header {
  display: flex;
  align-items: center;
  padding: $spacing-xl;
  gap: $spacing-lg;
  border-bottom: 1rpx solid $border-color;

  .avatar-large {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-char {
      font-size: 48rpx;
      font-weight: bold;
      color: #ffffff;
    }
  }

  .basic-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    .info-name {
      font-size: $font-size-xxl;
      font-weight: bold;
      color: $text-color;
    }

    .info-phone {
      font-size: $font-size-base;
      color: $text-color-secondary;
    }

    .info-tags {
      display: flex;
      gap: $spacing-sm;

      .tag-role,
      .tag-rating {
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
        font-size: $font-size-sm;
      }

      .tag-role {
        background-color: $primary-color;
        color: #ffffff;
      }

      .tag-rating {
        background-color: #ffd700;
        color: #ffffff;
      }
    }
  }
}

.rank-card {
  padding: $spacing-xl;
  text-align: center;

  .rank-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-lg;

    .rank-title {
      font-size: $font-size-lg;
      font-weight: bold;
      color: $text-color;
    }

    .rank-time {
      font-size: $font-size-sm;
      color: $text-color-secondary;
    }
  }

  .rank-content {
    display: flex;
    justify-content: center;
    align-items: baseline;
    margin-bottom: $spacing-md;

    .rank-number-large {
      font-size: 80rpx;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .rank-label {
      font-size: $font-size-base;
      color: $text-color-secondary;
      margin-left: $spacing-xs;
    }
  }

  .rank-trend {
    display: inline-flex;
    align-items: center;
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    gap: 8rpx;

    &.up {
      background-color: rgba(76, 217, 100, 0.1);
      .trend-icon, .trend-text {
        color: #4cd964;
      }
    }

    &.down {
      background-color: rgba(255, 59, 48, 0.1);
      .trend-icon, .trend-text {
        color: #ff3b30;
      }
    }

    &.stable {
      background-color: rgba(142, 142, 147, 0.1);
      .trend-icon, .trend-text {
        color: #8e8e93;
      }
    }

    .trend-icon {
      font-size: $font-size-lg;
      font-weight: bold;
    }

    .trend-text {
      font-size: $font-size-base;
    }
  }
}

// 数据统计模块
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
  margin-bottom: $spacing-md;

  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-lg;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: $border-radius-md;

    .stat-icon {
      font-size: 48rpx;
      margin-bottom: $spacing-sm;
    }

    .stat-value {
      font-size: $font-size-xl;
      font-weight: bold;
      color: $text-color;
      margin-bottom: $spacing-xs;
    }

    .stat-label {
      font-size: $font-size-sm;
      color: $text-color-secondary;
    }
  }
}

.target-card {
  padding: $spacing-lg;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: $border-radius-md;
  margin-bottom: $spacing-md;

  .target-header {
    margin-bottom: $spacing-md;

    .target-title {
      font-size: $font-size-base;
      color: rgba(255, 255, 255, 0.9);
    }
  }

  .target-progress {
    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: $spacing-sm;

      .progress-text {
        font-size: $font-size-lg;
        font-weight: bold;
        color: #ffffff;
      }

      .progress-amount {
        font-size: $font-size-sm;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .progress-bar-bg {
      height: 12rpx;
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 6rpx;
      overflow: hidden;
      margin-bottom: $spacing-sm;

      .progress-bar-fill {
        height: 100%;
        background-color: #ffffff;
        border-radius: 6rpx;
        transition: width 0.3s;
      }
    }

    .target-remaining {
      font-size: $font-size-sm;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.compare-card {
  padding: $spacing-lg;
  background-color: #f5f5f5;
  border-radius: $border-radius-md;

  .compare-header {
    margin-bottom: $spacing-md;

    .compare-title {
      font-size: $font-size-base;
      color: $text-color;
    }
  }

  .compare-item {
    display: flex;
    justify-content: space-between;
    padding: $spacing-sm 0;

    .compare-label {
      font-size: $font-size-base;
      color: $text-color-secondary;
    }

    .compare-value {
      font-size: $font-size-base;
      font-weight: bold;
      color: $text-color;

      &.highlight {
        color: #4cd964;
      }
    }
  }
}

// 趋势模块
.chart-card {
  margin-bottom: $spacing-md;
  padding: $spacing-lg;
  background-color: #f5f5f5;
  border-radius: $border-radius-md;

  .chart-header {
    margin-bottom: $spacing-md;

    .chart-title {
      font-size: $font-size-base;
      font-weight: bold;
      color: $text-color;
    }
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-sm;
    margin-top: $spacing-md;

    .metric-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: $spacing-md;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: $border-radius-md;
      position: relative;
      transition: all 0.3s;

      &:active {
        transform: scale(0.95);
        opacity: 0.9;
      }

      .metric-label {
        font-size: $font-size-sm;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 4rpx;
      }

      .metric-value {
        font-size: $font-size-lg;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 4rpx;
      }

      .metric-arrow {
        position: absolute;
        top: 8rpx;
        right: 8rpx;
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .view-all-btn {
    margin-top: $spacing-md;
    padding: $spacing-sm;
    text-align: center;
    background-color: #ffffff;
    border-radius: $border-radius-sm;
    transition: all 0.3s;

    &:active {
      background-color: #f0f0f0;
    }

    .view-all-text {
      font-size: $font-size-base;
      color: $primary-color;
      font-weight: 500;
    }
  }
}

// 记录模块
.time-filter {
  display: flex;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;

  .filter-item {
    flex: 1;
    text-align: center;
    padding: $spacing-sm;
    background-color: #f5f5f5;
    border-radius: 20rpx;
    font-size: $font-size-base;
    color: $text-color-secondary;

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      font-weight: bold;
    }
  }
}

.record-list {
  .record-item {
    display: flex;
    align-items: center;
    padding: $spacing-md;
    background-color: #f5f5f5;
    border-radius: $border-radius-md;
    margin-bottom: $spacing-sm;

    .record-icon {
      font-size: 40rpx;
      margin-right: $spacing-md;
    }

    .record-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4rpx;

      .record-name {
        font-size: $font-size-base;
        font-weight: bold;
        color: $text-color;
      }

      .record-merchant {
        font-size: $font-size-sm;
        color: $text-color-secondary;
      }
    }

    .record-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4rpx;

      .record-amount {
        font-size: $font-size-base;
        font-weight: bold;
        color: $primary-color;
      }

      .record-date {
        font-size: $font-size-xs;
        color: $text-color-secondary;
      }
    }
  }
}

// 评价模块
.rating-summary {
  display: flex;
  padding: $spacing-lg;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: $border-radius-md;
  margin-bottom: $spacing-md;

  .summary-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-right: 1rpx solid rgba(0, 0, 0, 0.1);

    .summary-score {
      font-size: 48rpx;
      font-weight: bold;
      color: $text-color;
    }

    .summary-stars {
      font-size: 32rpx;
      margin: $spacing-xs 0;
    }

    .summary-count {
      font-size: $font-size-sm;
      color: $text-color-secondary;
    }
  }

  .summary-detail {
    flex: 2;
    padding-left: $spacing-lg;

    .rating-bar {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-xs;

      .bar-label {
        width: 60rpx;
        font-size: $font-size-sm;
        color: $text-color;
      }

      .bar-track {
        flex: 1;
        height: 12rpx;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 6rpx;
        overflow: hidden;

        .bar-fill {
          height: 100%;
          background-color: #ffd700;
          border-radius: 6rpx;
        }
      }

      .bar-count {
        width: 40rpx;
        text-align: right;
        font-size: $font-size-sm;
        color: $text-color;
      }
    }
  }
}

.review-list {
  .review-item {
    padding: $spacing-md;
    background-color: #f5f5f5;
    border-radius: $border-radius-md;
    margin-bottom: $spacing-sm;

    .review-stars {
      font-size: 24rpx;
      margin-bottom: $spacing-xs;
    }

    .review-text {
      display: block;
      font-size: $font-size-base;
      color: $text-color;
      line-height: 1.6;
      margin-bottom: $spacing-sm;
    }

    .review-footer {
      display: flex;
      justify-content: space-between;

      .review-merchant,
      .review-date {
        font-size: $font-size-sm;
        color: $text-color-secondary;
      }
    }
  }
}

.view-more {
  padding: $spacing-lg;
  text-align: center;

  .view-more-text {
    font-size: $font-size-base;
    color: $primary-color;
  }
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
  background-color: #ffffff;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400rpx;

  .loading-text {
    font-size: $font-size-lg;
    color: $text-color-secondary;
  }
}
</style>
