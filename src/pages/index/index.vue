<template>
  <PageLayout :current-index="0">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-box" @click="goToSearch">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索业务员或小程序类目</text>
      </view>
      <view class="notification-btn" @click="goToMessage">
        <text class="notification-icon">🔔</text>
        <view v-if="hasNotification" class="notification-badge"></view>
      </view>
    </view>

    <!-- 横向标签页 -->
    <view class="tabs-container">
      <scroll-view class="tabs-scroll" scroll-x :scroll-left="scrollLeft" scroll-with-animation>
        <view class="tabs-wrapper">
          <view
            v-for="(tab, index) in tabs"
            :key="index"
            :class="['tab-item', { active: currentTab === index }]"
            @click="handleTabChange(index)"
          >
            {{ tab.name }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content-scroll" scroll-y @scrolltolower="loadMore">
      <!-- 全部小程序列表 -->
      <view v-if="currentTab === 0" class="template-list">
        <!-- 按分类分组 -->
        <view
          v-for="(category, categoryIndex) in groupedTemplates"
          :key="categoryIndex"
          class="category-group"
        >
          <!-- 分类标题 -->
          <view class="category-header">
            <text class="category-icon">{{ category.icon }}</text>
            <text class="category-name">{{ category.name }}</text>
          </view>

          <!-- 按业务员分组 -->
          <view
            v-for="(salesperson, spIndex) in category.salespersons"
            :key="spIndex"
            class="salesperson-group"
          >
            <!-- 业务员名称 -->
            <view class="salesperson-name">
              <text class="name-text">{{ salesperson.name }}</text>
            </view>

            <!-- 该业务员的小程序列表 -->
            <view class="salesperson-programs">
              <view
                v-for="(program, progIndex) in salesperson.programs"
                :key="progIndex"
                class="template-card"
                @click="goToDetail(program)"
                @longpress="showMenu(program)"
              >
                <!-- 商户信息 -->
                <view class="merchant-info">
                  <image :src="program.merchantLogo" class="merchant-logo" mode="aspectFill" />
                  <text class="merchant-name">{{ program.merchantName }}</text>
                  <view :class="['status-badge', `status-${program.status}`]">
                    {{ getStatusText(program.status) }}
                  </view>
                </view>

                <!-- 模板信息 -->
                <view class="template-info">
                  <text class="template-name">{{ program.templateName }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="loading" class="loading-more">
          <text class="loading-text">加载中...</text>
        </view>
        <view v-if="!hasMore && groupedTemplates.length > 0" class="no-more">
          <text class="no-more-text">没有更多了</text>
        </view>
      </view>

      <!-- 排行榜 -->
      <view v-if="currentTab === 1" class="ranking-placeholder">
        <text class="placeholder-title">排行榜</text>
        <text class="placeholder-desc">点击查看销售排行榜</text>
        <button class="goto-btn" @click="goToRanking">前往排行榜</button>
      </view>

      <!-- 模板中心 -->
      <view v-if="currentTab === 2" class="templates-placeholder">
        <text class="placeholder-title">模板中心</text>
        <text class="placeholder-desc">浏览所有小程序模板</text>
        <button class="goto-btn" @click="goToTemplates">前往模板中心</button>
      </view>

      <!-- 审批中心 -->
      <view v-if="currentTab === 3" class="approval-placeholder">
        <text class="placeholder-title">审批中心</text>
        <text class="placeholder-desc">待审批小程序列表</text>
        <button class="goto-btn" @click="goToApproval">前往审批中心</button>
      </view>
    </scroll-view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores'
import PageLayout from '../../components/layout/PageLayout.vue'

// 用户 store
const userStore = useUserStore()

// 标签页数据
const tabs = [
  { name: '全部', value: 'all' },
  { name: '排行榜', value: 'ranking' },
  { name: '模版', value: 'templates' },
  { name: '审批', value: 'approval' }
]

const currentTab = ref(0)
const scrollLeft = ref(0)

// 小程序模板列表 - 按分类和业务员分组
const groupedTemplates = ref<any[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)

// 通知状态
const hasNotification = ref(true)

// 切换横向标签页
const handleTabChange = (index: number) => {
  currentTab.value = index
  // 计算滚动位置
  scrollLeft.value = index * 80
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    published: '已上架',
    pending: '待上架',
    expired: '已过期'
  }
  return statusMap[status] || '未知'
}

// 前往搜索
const goToSearch = () => {
  uni.navigateTo({ url: '/src/pages/search/result/index' })
}

// 前往消息
const goToMessage = () => {
  uni.navigateTo({ url: '/src/pages/message/index/index' })
}

// 前往详情
const goToDetail = (item: any) => {
  // TODO: 跳转到详情页
  console.log('前往详情:', item)
  uni.showToast({ title: '详情页开发中', icon: 'none' })
}

// 处理小程序绑定成功后移动卡片
const handleProgramBind = (data: { programId: number; newMemberName: string }) => {
  const { programId, newMemberName } = data

  // 遍历所有分类，找到对应的小程序并移动
  for (const category of groupedTemplates.value) {
    for (const salesperson of category.salespersons) {
      // 在当前业务员的程序列表中查找目标程序
      const programIndex = salesperson.programs.findIndex((p: any) => p.id === programId)

      if (programIndex !== -1) {
        // 找到了程序
        const program = salesperson.programs[programIndex]

        // 如果目标业务员和当前业务员不同，才需要移动
        if (salesperson.name !== newMemberName) {
          // 从当前业务员移除
          salesperson.programs.splice(programIndex, 1)

          // 在同一分类下找到目标业务员
          const targetSalesperson = category.salespersons.find((sp: any) => sp.name === newMemberName)

          if (targetSalesperson) {
            // 添加到目标业务员
            targetSalesperson.programs.push(program)
          } else {
            // 如果目标业务员不存在，创建新的业务员组
            category.salespersons.push({
              name: newMemberName,
              programs: [program]
            })
          }

          // 更新绑定统计显示（可选）
          console.log(`小程序 ${program.templateName} 已从 ${salesperson.name} 移动到 ${newMemberName}`)
          uni.showToast({
            title: `已绑定给 ${newMemberName}`,
            icon: 'success'
          })
        }

        return
      }
    }
  }
}

// 显示菜单
const showMenu = (item: any) => {
  uni.showActionSheet({
    itemList: ['绑定商户', '解绑商户', '查看详情'],
    success: (res) => {
      switch (res.tapIndex) {
        case 0:
          // 绑定商户 - 跳转到团队列表页面
          uni.navigateTo({ url: `/src/pages/team/index/index?programId=${item.id}` })
          break
        case 1:
          uni.showToast({ title: '解绑商户', icon: 'none' })
          break
        case 2:
          goToDetail(item)
          break
      }
    }
  })
}

// 前往排行榜
const goToRanking = () => {
  uni.navigateTo({ url: '/src/pages/ranking/index' })
}

// 前往模板中心
const goToTemplates = () => {
  uni.navigateTo({ url: '/src/pages/product/templates/index' })
}

// 前往审批中心
const goToApproval = () => {
  uni.navigateTo({ url: '/src/pages/approval/index' })
}

// 加载模板列表
const loadTemplates = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true

  // TODO: 调用 API 获取数据
  // 暂时使用 Mock 数据 - 按分类和业务员分组
  setTimeout(() => {
    const mockData = [
      {
        name: '教育培训类',
        icon: '📚',
        salespersons: [
          {
            name: '小张',
            programs: [
              {
                id: 1,
                merchantLogo: 'https://picsum.photos/100/100?random=1',
                merchantName: '张三的商城',
                templateName: '在线培训小程序',
                status: 'published'
              },
              {
                id: 2,
                merchantLogo: 'https://picsum.photos/100/100?random=2',
                merchantName: '李四教育',
                templateName: '课程管理小程序',
                status: 'published'
              }
            ]
          },
          {
            name: '小孙',
            programs: [
              {
                id: 3,
                merchantLogo: 'https://picsum.photos/100/100?random=3',
                merchantName: '王五培训',
                templateName: '考试系统小程序',
                status: 'pending'
              }
            ]
          }
        ]
      },
      {
        name: '电商类',
        icon: '🛒',
        salespersons: [
          {
            name: '小李',
            programs: [
              {
                id: 4,
                merchantLogo: 'https://picsum.photos/100/100?random=4',
                merchantName: '赵六商城',
                templateName: '电商小程序',
                status: 'published'
              },
              {
                id: 5,
                merchantLogo: 'https://picsum.photos/100/100?random=5',
                merchantName: '孙七零售',
                templateName: '零售小程序',
                status: 'published'
              }
            ]
          },
          {
            name: '小周',
            programs: [
              {
                id: 6,
                merchantLogo: 'https://picsum.photos/100/100?random=6',
                merchantName: '周八购物',
                templateName: '跨境电商小程序',
                status: 'expired'
              }
            ]
          }
        ]
      },
      {
        name: '点餐平台类',
        icon: '🍽️',
        salespersons: [
          {
            name: '小王',
            programs: [
              {
                id: 7,
                merchantLogo: 'https://picsum.photos/100/100?random=7',
                merchantName: '钱九餐厅',
                templateName: '智能点餐小程序',
                status: 'published'
              }
            ]
          }
        ]
      },
      {
        name: '直播类',
        icon: '📺',
        salespersons: [
          {
            name: '小郑',
            programs: [
              {
                id: 8,
                merchantLogo: 'https://picsum.photos/100/100?random=8',
                merchantName: '吴十直播',
                templateName: '直播带货小程序',
                status: 'published'
              },
              {
                id: 9,
                merchantLogo: 'https://picsum.photos/100/100?random=9',
                merchantName: '郑十一娱乐',
                templateName: '才艺直播小程序',
                status: 'pending'
              }
            ]
          }
        ]
      },
      {
        name: '游戏类',
        icon: '🎮',
        salespersons: [
          {
            name: '小冯',
            programs: [
              {
                id: 10,
                merchantLogo: 'https://picsum.photos/100/100?random=10',
                merchantName: '冯十二游戏',
                templateName: '休闲游戏小程序',
                status: 'published'
              }
            ]
          }
        ]
      }
    ]

    groupedTemplates.value = mockData
    loading.value = false
    page.value++

    console.log('模板数据已加载:', groupedTemplates.value)

    // 模拟只有1页数据
    if (page.value >= 1) {
      hasMore.value = false
    }
  }, 1000)
}

// 加载更多
const loadMore = () => {
  if (currentTab.value === 0) {
    loadTemplates()
  }
}

onMounted(() => {
  // 加载模板列表
  loadTemplates()

  // 获取用户信息
  console.log('首页加载，用户信息:', userStore.userInfo)

  // 监听小程序绑定成功事件
  uni.$on('programBindSuccess', handleProgramBind)
})

// 页面卸载时移除监听
onUnmounted(() => {
  uni.$off('programBindSuccess', handleProgramBind)
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.search-bar {
  display: flex;
  align-items: center;
  padding: $spacing-md;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  gap: $spacing-md;

  .search-box {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: $border-radius-lg;
    padding: $spacing-sm $spacing-md;
    gap: $spacing-sm;

    .search-icon {
      font-size: 32rpx;
    }

    .search-placeholder {
      font-size: $font-size-base;
      color: $text-color-placeholder;
    }
  }

  .notification-btn {
    position: relative;
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: $border-radius-lg;

    .notification-icon {
      font-size: 36rpx;
    }

    .notification-badge {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      width: 16rpx;
      height: 16rpx;
      background-color: $danger-color;
      border-radius: 50%;
      border: 2rpx solid #ffffff;
    }
  }
}

// 横向标签页
.tabs-container {
  background-color: #ffffff;
  border-bottom: 1rpx solid $border-color;

  .tabs-scroll {
    white-space: nowrap;
  }

  .tabs-wrapper {
    display: inline-flex;
    padding: $spacing-md $spacing-xl;

    .tab-item {
      position: relative;
      padding: $spacing-sm $spacing-lg;
      margin-right: $spacing-xl;
      font-size: $font-size-lg;
      color: $text-color-secondary;
      white-space: nowrap;
      transition: all 0.3s;

      &.active {
        color: $primary-color;
        font-weight: bold;

        &::after {
          content: '';
          position: absolute;
          bottom: -$spacing-sm;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 4rpx;
          background-color: $primary-color;
          border-radius: 2rpx;
        }
      }
    }
  }
}

// 内容滚动区域
.content-scroll {
  flex: 1;
  height: 0;
  padding-bottom: 20rpx;
}

// 模板列表
.template-list {
  padding: $spacing-md;
}

// 分类分组
.category-group {
  margin-bottom: $spacing-xl;

  &:not(:last-child) {
    margin-bottom: $spacing-xl;
  }
}

// 分类标题
.category-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: $border-radius-lg;
  margin-bottom: $spacing-md;

  .category-icon {
    font-size: 40rpx;
  }

  .category-name {
    font-size: $font-size-lg;
    font-weight: bold;
    color: #ffffff;
  }
}

// 业务员分组
.salesperson-group {
  margin-bottom: $spacing-lg;
  padding: 0 $spacing-md;
}

// 业务员名称
.salesperson-name {
  padding: $spacing-sm 0;
  margin-bottom: $spacing-sm;
  border-bottom: 1rpx solid $border-color;

  .name-text {
    font-size: $font-size-base;
    font-weight: 600;
    color: $text-color;
  }
}

// 业务员的小程序列表 - 横向排列
.salesperson-programs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;

  .template-card {
    background-color: #ffffff;
    border-radius: $border-radius-lg;
    padding: $spacing-md;
    box-shadow: $shadow-sm;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    transition: all 0.3s;
    min-height: 160rpx;

    &:active {
      transform: scale(0.98);
      box-shadow: $shadow-md;
    }

    .merchant-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      position: relative;

      .merchant-logo {
        width: 48rpx;
        height: 48rpx;
        border-radius: 50%;
        background-color: $bg-color;
      }

      .merchant-name {
        flex: 1;
        font-size: $font-size-sm;
        color: $text-color-secondary;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-badge {
        padding: 4rpx 12rpx;
        border-radius: $border-radius-sm;
        font-size: $font-size-xs;

        &.status-published {
          background-color: rgba(76, 217, 100, 0.1);
          color: $success-color;
        }

        &.status-pending {
          background-color: rgba(255, 149, 0, 0.1);
          color: $warning-color;
        }

        &.status-expired {
          background-color: rgba(255, 59, 48, 0.1);
          color: $danger-color;
        }
      }
    }

    .template-info {
      display: flex;
      flex-direction: column;
      gap: 4rpx;

      .template-name {
        font-size: $font-size-base;
        font-weight: bold;
        color: $text-color;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

// 占位页
.ranking-placeholder,
.templates-placeholder,
.approval-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx $spacing-xl;
  text-align: center;

  .placeholder-title {
    font-size: $font-size-xl;
    font-weight: bold;
    color: $text-color;
    margin-bottom: $spacing-sm;
  }

  .placeholder-desc {
    font-size: $font-size-base;
    color: $text-color-secondary;
    margin-bottom: $spacing-xl;
  }

  .goto-btn {
    padding: $spacing-md $spacing-xl;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    font-size: $font-size-base;
    border-radius: $border-radius-md;
    border: none;
  }
}

// 加载更多
.loading-more,
.no-more {
  display: flex;
  justify-content: center;
  padding: $spacing-xl;

  .loading-text,
  .no-more-text {
    font-size: $font-size-sm;
    color: $text-color-placeholder;
  }
}
</style>
