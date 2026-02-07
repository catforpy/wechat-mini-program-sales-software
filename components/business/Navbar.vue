<template>
  <view :class="['navbar', { 'navbar--fixed': fixed }]">
    <view class="navbar__content">
      <view v-if="showBack" class="navbar__back" @click="handleBack">
        <text class="navbar__icon">‹</text>
      </view>
      <view v-else-if="showHome" class="navbar__back" @click="handleHome">
        <text class="navbar__icon">⌂</text>
      </view>

      <text class="navbar__title">{{ title }}</text>

      <view class="navbar__extra">
        <slot name="extra" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 导航栏组件
 */
interface Props {
  title?: string
  showBack?: boolean
  showHome?: boolean
  fixed?: boolean
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showBack: true,
  showHome: false,
  fixed: true,
  backgroundColor: '#007aff'
})

const handleBack = () => {
  uni.navigateBack({
    delta: 1
  })
}

const handleHome = () => {
  uni.reLaunch({
    url: '/pages/index/index'
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.navbar {
  width: 100%;

  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }

  &__content {
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 $spacing-md;
    background-color: v-bind(backgroundColor);
    color: #ffffff;
  }

  &__back {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    font-size: 48rpx;
    font-weight: bold;
  }

  &__title {
    flex: 1;
    font-size: $font-size-lg;
    font-weight: bold;
    text-align: center;
  }

  &__extra {
    width: 64rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
