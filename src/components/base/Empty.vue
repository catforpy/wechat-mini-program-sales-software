<template>
  <view class="x-empty">
    <image v-if="image" :src="image" class="x-empty__image" mode="aspectFit" />
    <view v-else class="x-empty__icon">📦</view>
    <text class="x-empty__description">{{ description }}</text>
    <slot name="extra" />
  </view>
</template>

<script setup lang="ts">
/**
 * 空状态组件
 */
interface Props {
  image?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  description: '暂无数据'
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.x-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl 0;

  &__icon {
    font-size: 120rpx;
    margin-bottom: $spacing-lg;
    opacity: 0.5;
  }

  &__image {
    width: 400rpx;
    height: 400rpx;
    margin-bottom: $spacing-lg;
  }

  &__description {
    font-size: $font-size-base;
    color: $text-color-secondary;
  }
}
</style>
