<template>
  <view class="tabbar-wrap">
    <view class="tabbar-content">
      <view
        v-for="(item, index) in defaultItems"
        :key="index"
        :class="['tab-item', activeIndex === index ? 'tab-item-active' : '']"
        @click="handleClick(index, item)"
      >
        <text class="tab-icon">{{ item.icon }}</text>
        <text class="tab-label">{{ item.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 底部导航栏组件
 */
interface TabbarItem {
  icon: string
  label: string
  url: string
}

interface Props {
  activeIndex: number
}

const props = defineProps<Props>()

// 默认的导航配置
const defaultItems: TabbarItem[] = [
  { icon: '🏠', label: '首页', url: '/src/pages/index/index' },
  { icon: '💬', label: '消息', url: '/src/pages/message/index/index' },
  { icon: '👥', label: '我的团队', url: '/src/pages/team/index/index' },
  { icon: '👤', label: '我的', url: '/src/pages/user/profile/index' }
]

const handleClick = (index: number, item: TabbarItem) => {
  if (props.activeIndex !== index) {
    uni.redirectTo({
      url: item.url
    })
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';

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
