<template>
  <view class="login-background">
    <!-- 背景图层 -->
    <view v-if="type === 'image'" class="background-image">
      <image
        :src="backgroundImage"
        mode="aspectFill"
        class="bg-image"
      />
      <!-- 渐变遮罩 -->
      <view class="gradient-mask"></view>
    </view>

    <!-- 纯色/渐变背景 -->
    <view
      v-else
      class="background-color"
      :style="{ background: backgroundColor }"
    ></view>

    <!-- Logo区域 -->
    <view v-if="showLogo" class="logo-area">
      <image
        v-if="logo"
        :src="logo"
        mode="aspectFit"
        class="logo"
      />
      <text v-if="title" class="title">{{ title }}</text>
      <text v-if="subtitle" class="subtitle">{{ subtitle }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 登录页背景组件
 * 支持动态切换背景类型：纯色、渐变、图片
 */
import { computed } from 'vue'

interface Props {
  // 背景类型：color-纯色/渐变, image-图片
  type?: 'color' | 'image'
  // 背景色（type=color时使用）
  backgroundColor?: string
  // 背景图（type=image时使用）
  backgroundImage?: string
  // 是否显示logo
  showLogo?: boolean
  // logo路径
  logo?: string
  // 标题
  title?: string
  // 副标题
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'image',
  backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  backgroundImage: '/static/background.gif',
  showLogo: true,
  logo: '/static/logo.jpg',
  title: '唐极课得',
  subtitle: ''
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;

  // 背景图模式
  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;

    .bg-image {
      width: 100%;
      height: 100%;
    }

    // 渐变遮罩，让背景图更柔和
    .gradient-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        rgba(102, 126, 234, 0.3) 0%,
        rgba(118, 75, 162, 0.5) 50%,
        rgba(102, 126, 234, 0.7) 100%
      );
    }
  }

  // 纯色/渐变模式
  .background-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  // Logo区域
  .logo-area {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 120rpx;
    padding-left: $spacing-xl;
    padding-right: $spacing-xl;

    .logo {
      width: 160rpx;
      height: 160rpx;
      border-radius: $border-radius-lg;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 8rpx;
      box-shadow: $shadow-lg;
      margin-bottom: $spacing-lg;
    }

    .title {
      font-size: 48rpx;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: $spacing-sm;
      text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
    }

    .subtitle {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
