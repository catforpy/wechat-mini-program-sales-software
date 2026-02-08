<template>
  <view class="ranking-page">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>

    <!-- 顶部导航栏 -->
    <view class="navbar">
      <view class="navbar-content">
        <view class="nav-left" @click="goBack">
          <text class="back-arrow">‹</text>
        </view>
        <view class="nav-title">
          <text class="title-text">排行榜</text>
        </view>
        <view class="nav-right">
          <!-- 下拉指标选择器 -->
          <picker
            :range="availableMetrics"
            range-key="label"
            :value="metricIndex"
            @change="handleMetricChange"
          >
            <view class="metric-picker">
              <text class="metric-label">{{ currentMetric.label }}</text>
              <text class="metric-arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="page-content">
      <!-- 时间范围选择 -->
      <view class="time-selector">
        <view
          v-for="(item, index) in timeRanges"
          :key="index"
          :class="['time-item', { active: currentTimeIndex === index }]"
          @click="handleTimeChange(index)"
        >
          {{ item.label }}
        </view>
      </view>

      <!-- 排行榜类型切换 -->
      <view class="type-tabs">
        <view
          :class="['type-tab', { active: rankingType === 'salesperson' }]"
          @click="handleTypeChange('salesperson')"
        >
          业务员排行
        </view>
        <view
          :class="['type-tab', { active: rankingType === 'template' }]"
          @click="handleTypeChange('template')"
        >
          模板排行
        </view>
      </view>

      <!-- 搜索框 -->
      <view class="search-box">
        <input
          v-model="keyword"
          class="search-input"
          type="text"
          placeholder="搜索姓名或模板名称"
          @input="handleSearch"
        />
      </view>

      <!-- 列表内容 -->
      <scroll-view
        scroll-y
        class="content-scroll"
        enable-flex
        refresher-enabled
        :refresher-triggered="refreshing"
        @refresherrefresh="handleRefresh"
      >
        <!-- 业务员排行榜 -->
        <view v-if="rankingType === 'salesperson'" class="ranking-list">
          <view
            v-for="(item, index) in filteredList"
            :key="item.id"
            class="ranking-item"
            @click="goToDetail(item)"
            @longpress="showCompareMenu(item)"
          >
            <!-- 排名标识 -->
            <view class="rank-badge" :class="`rank-${item.rank}`">
              <text v-if="item.rank <= 3" class="medal">{{ getMedal(item.rank) }}</text>
              <text v-else class="rank-number">{{ item.rank }}</text>
            </view>

            <!-- 头像 -->
            <view class="avatar">
              <text class="avatar-text">{{ item.name.charAt(0) }}</text>
            </view>

            <!-- 信息 -->
            <view class="info">
              <view class="info-top">
                <text class="name">{{ item.name }}</text>
                <view class="trend-badge" :class="item.trend.direction">
                  <text class="trend-icon">{{ item.trend.icon }}</text>
                  <text class="trend-text">{{ getTrendText(item.trend) }}</text>
                </view>
              </view>
              <view class="metrics">
                <text class="metric-item">💰 {{ formatAmount(item.salesAmount) }}</text>
                <text class="metric-item">📊 {{ item.salesCount }}单</text>
                <text class="metric-item">👥 {{ item.merchantCount }}商户</text>
                <text class="metric-item">⭐ {{ item.rating }}</text>
              </view>
            </view>

            <!-- 右箭头 -->
            <view class="arrow">
              <text>›</text>
            </view>
          </view>
        </view>

        <!-- 模板排行榜 -->
        <view v-if="rankingType === 'template'" class="ranking-list">
          <view
            v-for="(item, index) in filteredList"
            :key="item.id"
            class="ranking-item template-item"
            @click="goToDetail(item)"
            @longpress="showCompareMenu(item)"
          >
            <!-- 排名标识 -->
            <view class="rank-badge" :class="`rank-${item.rank}`">
              <text v-if="item.rank <= 3" class="medal">{{ getMedal(item.rank) }}</text>
              <text v-else class="rank-number">{{ item.rank }}</text>
            </view>

            <!-- 模板图标 -->
            <image class="template-icon" :src="item.icon" mode="aspectFill" />

            <!-- 信息 -->
            <view class="info">
              <view class="info-top">
                <text class="name">{{ item.name }}</text>
                <view class="category-tag">{{ item.category }}</view>
              </view>
              <view class="metrics">
                <text class="metric-item">💰 {{ formatAmount(item.salesAmount) }}</text>
                <text class="metric-item">📊 {{ item.salesCount }}单</text>
                <text class="metric-item">👥 {{ item.merchantCount }}商户</text>
                <text class="metric-item">⭐ {{ item.rating }}</text>
              </view>
              <view class="trend-info">
                <view class="trend-badge" :class="item.trend.direction">
                  <text class="trend-icon">{{ item.trend.icon }}</text>
                  <text class="trend-text">{{ getTrendText(item.trend) }}</text>
                </view>
              </view>
            </view>

            <!-- 右箭头 -->
            <view class="arrow">
              <text>›</text>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="loading" class="loading">
          <text>加载中...</text>
        </view>

        <!-- 没有更多 -->
        <view v-if="!hasMore && filteredList.length > 0" class="no-more">
          <text>没有更多了</text>
        </view>

        <!-- 空状态 -->
        <view v-if="!loading && filteredList.length === 0" class="empty">
          <text class="empty-icon">📊</text>
          <text class="empty-text">暂无数据</text>
        </view>
      </scroll-view>

      <!-- 底部安全区域 -->
      <view class="safe-area-bottom"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 时间范围选项
const timeRanges = [
  { label: '今日', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
  { label: '全年', value: 'year' }
]

const currentTimeIndex = ref(1) // 默认本周
const rankingType = ref<'salesperson' | 'template'>('salesperson')
const keyword = ref('')
const refreshing = ref(false)
const loading = ref(false)
const hasMore = ref(true)
const metricIndex = ref(0) // 指标选择器索引

// 排名指标选项
const salespersonMetrics = [
  { label: '按销售数量', value: 'salesCount' },
  { label: '按销售金额', value: 'salesAmount' },
  { label: '按商户数', value: 'merchantCount' },
  { label: '按好评率', value: 'rating' }
]

const templateMetrics = [
  { label: '按销售数量', value: 'salesCount' },
  { label: '按销售金额', value: 'salesAmount' },
  { label: '按使用商户', value: 'merchantCount' },
  { label: '按好评率', value: 'rating' }
]

const currentMetric = ref(salespersonMetrics[0])

// 计算可用的指标
const availableMetrics = computed(() => {
  return rankingType.value === 'salesperson' ? salespersonMetrics : templateMetrics
})

// 业务员模拟数据
const salespersonData = ref([
  {
    id: 1,
    rank: 1,
    name: '小张',
    avatar: '',
    salesCount: 15,
    salesAmount: 128000,
    merchantCount: 8,
    rating: 4.8,
    trend: { direction: 'up', icon: '↑', value: 2, previousRank: 3 }
  },
  {
    id: 2,
    rank: 2,
    name: '小李',
    avatar: '',
    salesCount: 12,
    salesAmount: 96000,
    merchantCount: 6,
    rating: 4.6,
    trend: { direction: 'down', icon: '↓', value: 1, previousRank: 1 }
  },
  {
    id: 3,
    rank: 3,
    name: '小孙',
    avatar: '',
    salesCount: 10,
    salesAmount: 85000,
    merchantCount: 5,
    rating: 4.9,
    trend: { direction: 'up', icon: '↑', value: 3, previousRank: 6 }
  },
  {
    id: 4,
    rank: 4,
    name: '小周',
    avatar: '',
    salesCount: 8,
    salesAmount: 64000,
    merchantCount: 4,
    rating: 4.5,
    trend: { direction: 'stable', icon: '—', value: 0, previousRank: 4 }
  },
  {
    id: 5,
    rank: 5,
    name: '小王',
    avatar: '',
    salesCount: 7,
    salesAmount: 56000,
    merchantCount: 4,
    rating: 4.7,
    trend: { direction: 'down', icon: '↓', value: 2, previousRank: 3 }
  }
])

// 模板模拟数据
const templateData = ref([
  {
    id: 1,
    rank: 1,
    name: '在线培训小程序',
    icon: 'https://picsum.photos/100/100?random=1',
    category: '教育培训类',
    salesCount: 25,
    salesAmount: 250000,
    merchantCount: 18,
    rating: 4.9,
    trend: { direction: 'up', icon: '↑', value: 1, previousRank: 2 }
  },
  {
    id: 2,
    rank: 2,
    name: '电商商城模板',
    icon: 'https://picsum.photos/100/100?random=2',
    category: '电商类',
    salesCount: 20,
    salesAmount: 180000,
    merchantCount: 15,
    rating: 4.7,
    trend: { direction: 'down', icon: '↓', value: 1, previousRank: 1 }
  },
  {
    id: 3,
    rank: 3,
    name: '点餐平台',
    icon: 'https://picsum.photos/100/100?random=3',
    category: '点餐平台类',
    salesCount: 18,
    salesAmount: 144000,
    merchantCount: 12,
    rating: 4.8,
    trend: { direction: 'stable', icon: '—', value: 0, previousRank: 3 }
  }
])

// 过滤后的列表
const filteredList = computed(() => {
  const list = rankingType.value === 'salesperson' ? salespersonData.value : templateData.value

  if (!keyword.value) return list

  return list.filter((item) => {
    return item.name.toLowerCase().includes(keyword.value.toLowerCase())
  })
})

// 获取奖牌
const getMedal = (rank: number) => {
  const medals = ['🥇', '🥈', '🥉']
  return medals[rank - 1] || ''
}

// 获取趋势文本
const getTrendText = (trend: any) => {
  if (trend.direction === 'up') return `上升${trend.value}位`
  if (trend.direction === 'down') return `下降${trend.value}位`
  return '排名不变'
}

// 格式化金额
const formatAmount = (amount: number) => {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万'
  }
  return amount.toString()
}

// 切换时间范围
const handleTimeChange = (index: number) => {
  currentTimeIndex.value = index
  loadRankingData()
}

// 切换排行榜类型
const handleTypeChange = (type: 'salesperson' | 'template') => {
  console.log('切换排行榜类型:', type)
  rankingType.value = type
  currentMetric.value = availableMetrics.value[0]
  console.log('切换后rankingType:', rankingType.value)
  loadRankingData()
}

// 切换排名指标
const handleMetricChange = (e: any) => {
  const index = e.detail.value
  metricIndex.value = index
  currentMetric.value = availableMetrics.value[index]
  loadRankingData()
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 搜索
const handleSearch = () => {
  // 搜索逻辑已通过 computed 实现
}

// 下拉刷新
const handleRefresh = async () => {
  refreshing.value = true
  await loadRankingData()
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}

// 加载排行榜数据
const loadRankingData = async () => {
  loading.value = true

  // TODO: 调用后端API
  const params = {
    timeRange: timeRanges[currentTimeIndex.value].value,
    rankingType: rankingType.value,
    metric: currentMetric.value.value,
    keyword: keyword.value
  }

  console.log('加载排行榜数据:', params)

  // 模拟加载延迟
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 前往详情
const goToDetail = (item: any) => {
  console.log('点击项目:', item)
  console.log('当前排行榜类型:', rankingType.value)

  // 根据排行榜类型跳转到不同的详情页
  if (rankingType.value === 'salesperson') {
    // 业务员详情
    console.log('跳转到业务员详情页')
    uni.navigateTo({
      url: `/src/pages/ranking/detail/index?type=${rankingType.value}&id=${item.id}`
    })
  } else {
    // 模板详情
    console.log('跳转到模板详情页')
    uni.navigateTo({
      url: `/src/pages/template/detail/index?id=${item.id}`
    })
  }
}

// 显示对比菜单
const showCompareMenu = (item: any) => {
  uni.showActionSheet({
    itemList: ['查看详情', '对比数据'],
    success: (res) => {
      if (res.tapIndex === 0) {
        goToDetail(item)
      } else if (res.tapIndex === 1) {
        // TODO: 进入对比页面
        uni.showToast({ title: '对比功能开发中', icon: 'none' })
      }
    }
  })
}

onMounted(() => {
  loadRankingData()
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.ranking-page {
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
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .metric-picker {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 8rpx 20rpx;
      background-color: #f5f5f5;
      border-radius: 20rpx;

      .metric-label {
        font-size: 26rpx;
        color: $text-color;
        white-space: nowrap;
      }

      .metric-arrow {
        font-size: 20rpx;
        color: $text-color-secondary;
      }
    }
  }
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
  background-color: #ffffff;
}

.time-selector {
  display: flex;
  background-color: #ffffff;
  padding: $spacing-md;
  gap: $spacing-sm;
  border-bottom: 1rpx solid $border-color;

  .time-item {
    flex: 1;
    text-align: center;
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-md;
    font-size: $font-size-base;
    color: $text-color-secondary;
    background-color: $bg-color;
    transition: all 0.3s;

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      font-weight: bold;
    }
  }
}

.type-tabs {
  display: flex;
  background-color: #ffffff;
  padding: $spacing-md $spacing-xl;
  gap: $spacing-lg;
  border-bottom: 1rpx solid $border-color;

  .type-tab {
    flex: 1;
    text-align: center;
    padding: $spacing-md;
    border-radius: $border-radius-md;
    font-size: $font-size-lg;
    color: $text-color-secondary;
    background-color: $bg-color;
    transition: all 0.3s;

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      font-weight: bold;
    }
  }
}

.search-box {
  padding: $spacing-md $spacing-md;
  background-color: #ffffff;
  border-bottom: 1rpx solid $border-color;

  .search-input {
    width: 100%;
    height: 72rpx;
    padding: 0 $spacing-md;
    background-color: #f5f5f5;
    border-radius: 36rpx;
    font-size: $font-size-base;
    color: $text-color;
    box-sizing: border-box;
  }
}

.content-scroll {
  flex: 1;
  height: 0;
}

.ranking-list {
  padding: $spacing-md;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: $spacing-lg;
  background-color: #ffffff;
  border-radius: $border-radius-md;
  margin-bottom: $spacing-md;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:active {
    background-color: #f5f5f5;
    transform: scale(0.98);
  }
}

.rank-badge {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-md;
  margin-right: $spacing-md;
  flex-shrink: 0;

  &.rank-1 {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  }

  &.rank-2 {
    background: linear-gradient(135deg, #c0c0c0 0%, #e0e0e0 100%);
  }

  &.rank-3 {
    background: linear-gradient(135deg, #cd7f32 0%, #e8a862 100%);
  }

  &:not(.rank-1):not(.rank-2):not(.rank-3) {
    background-color: $bg-color;
  }

  .medal {
    font-size: 36rpx;
  }

  .rank-number {
    font-size: $font-size-lg;
    font-weight: bold;
    color: $text-color;
  }
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $spacing-md;
  flex-shrink: 0;

  .avatar-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #ffffff;
  }
}

.template-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: $border-radius-md;
  margin-right: $spacing-md;
  flex-shrink: 0;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.info-top {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.name {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $text-color;
}

.category-tag {
  padding: 4rpx 12rpx;
  background-color: $primary-color;
  color: #ffffff;
  font-size: $font-size-xs;
  border-radius: 20rpx;
}

.trend-badge {
  display: flex;
  align-items: center;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  gap: 4rpx;

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
    font-size: $font-size-sm;
    font-weight: bold;
  }

  .trend-text {
    font-size: $font-size-xs;
  }
}

.metrics {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;

  .metric-item {
    font-size: $font-size-sm;
    color: $text-color-secondary;
  }
}

.trend-info {
  display: flex;
  align-items: center;
}

.arrow {
  margin-left: $spacing-md;
  font-size: 48rpx;
  color: $text-color-secondary;
  font-weight: 300;
}

.loading,
.no-more,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xl;
  color: $text-color-secondary;
  font-size: $font-size-base;
}

.empty {
  padding: 120rpx $spacing-xl;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: $spacing-md;
  }

  .empty-text {
    font-size: $font-size-lg;
  }
}
</style>
