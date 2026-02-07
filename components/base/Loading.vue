<template>
  <view v-if="visible" class="x-loading" :style="{ backgroundColor: mask ? 'rgba(0, 0, 0, 0.5)' : 'transparent' }">
    <view class="x-loading__spinner">
      <view class="x-loading__icon"></view>
      <text v-if="text" class="x-loading__text">{{ text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 加载中组件
 */
interface Props {
  visible: boolean
  text?: string
  mask?: boolean
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
  mask: true
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.x-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  &__spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-lg;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: $border-radius-md;
  }

  &__icon {
    width: 64rpx;
    height: 64rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__text {
    margin-top: $spacing-md;
    font-size: $font-size-base;
    color: #ffffff;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
