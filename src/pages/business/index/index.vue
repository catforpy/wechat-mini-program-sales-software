<template>
  <PageLayout :current-index="2">
    <view class="business-page">
      <view class="header">
        <text class="title">我的业务</text>
      </view>

      <view class="placeholder">
        <text class="placeholder-icon">💼</text>
        <text class="placeholder-text">业务管理功能</text>
        <text class="placeholder-desc">正在开发中...</text>
      </view>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from '../../../components/layout/PageLayout.vue'
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.business-page {
  padding: $spacing-xl;
}

.header {
  margin-bottom: $spacing-xl;

  .title {
    font-size: 48rpx;
    font-weight: bold;
    color: $text-color;
  }
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: $spacing-md;

  .placeholder-icon {
    font-size: 120rpx;
  }

  .placeholder-text {
    font-size: $font-size-xl;
    font-weight: bold;
    color: $text-color;
  }

  .placeholder-desc {
    font-size: $font-size-base;
    color: $text-color-secondary;
  }
}
</style>
