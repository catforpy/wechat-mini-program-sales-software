<template>
  <view class="page-layout">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>

    <!-- 页面内容插槽 -->
    <view class="page-content">
      <slot></slot>
    </view>

    <!-- 底部导航栏 -->
    <view class="tabbar-wrap">
      <view class="tabbar-content">
        <view
          v-for="(item, index) in menuItems"
          :key="index"
          :class="['tab-item', currentIndex === index ? 'tab-item-active' : '']"
          @click="handleMenuClick(index, item)"
        >
          <text class="tab-icon">{{ item.icon }}</text>
          <text class="tab-label">{{ item.label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores'

/**
 * 页面布局组件 - 可复用的页面框架
 * 支持动态配置底部导航栏
 */
interface MenuItem {
  icon: string
  label: string
  url: string
}

interface Props {
  // 当前激活的菜单索引
  currentIndex?: number
  // 自定义菜单项（如果不传，则根据用户角色自动配置）
  menuItems?: MenuItem[]
}

const props = withDefaults(defineProps<Props>(), {
  currentIndex: 0,
  menuItems: () => []
})

const userStore = useUserStore()

// 根据用户角色获取默认菜单配置
const getDefaultMenuItems = (): MenuItem[] => {
  const role = userStore.userInfo?.role

  switch (role) {
    case 'agent': // 代理商
      return [
        { icon: '🏠', label: '首页', url: '/src/pages/index/index' },
        { icon: '💬', label: '消息', url: '/src/pages/message/index/index' },
        { icon: '👥', label: '我的团队', url: '/src/pages/team/index/index' },
        { icon: '👤', label: '我的', url: '/src/pages/user/profile/index' }
      ]

    case 'salesperson': // 业务员
      return [
        { icon: '🏠', label: '首页', url: '/src/pages/index/index' },
        { icon: '💬', label: '消息', url: '/src/pages/message/index/index' },
        { icon: '💼', label: '我的业务', url: '/src/pages/business/index/index' },
        { icon: '👤', label: '我的', url: '/src/pages/user/profile/index' }
      ]

    case 'merchant': // 商户
      return [
        { icon: '🏠', label: '首页', url: '/src/pages/index/index' },
        { icon: '💬', label: '消息', url: '/src/pages/message/index/index' },
        { icon: '📱', label: '我的小程序', url: '/src/pages/mini-programs/index/index' },
        { icon: '👤', label: '我的', url: '/src/pages/user/profile/index' }
      ]

    default:
      // 默认配置
      return [
        { icon: '🏠', label: '首页', url: '/src/pages/index/index' },
        { icon: '💬', label: '消息', url: '/src/pages/message/index/index' },
        { icon: '👥', label: '我的团队', url: '/src/pages/team/index/index' },
        { icon: '👤', label: '我的', url: '/src/pages/user/profile/index' }
      ]
  }
}

// 使用自定义菜单项或默认菜单项
const menuItems = computed(() => {
  return props.menuItems.length > 0 ? props.menuItems : getDefaultMenuItems()
})

// 处理菜单点击
const handleMenuClick = (index: number, item: MenuItem) => {
  if (props.currentIndex !== index) {
    uni.redirectTo({
      url: item.url
    })
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.page-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $bg-color;
}

.status-bar {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.tabbar-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #ffffff;
  border-top: 1px solid $border-color;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.tabbar-content {
  display: flex;
  height: 100rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $text-color-secondary;
  transition: all 0.3s;

  &.tab-item-active {
    color: $primary-color;
    font-weight: 500;
  }
}

.tab-icon {
  font-size: 44rpx;
  margin-bottom: 4rpx;
}

.tab-label {
  font-size: $font-size-xs;
}
</style>
