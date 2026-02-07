<template>
  <PageLayout :current-index="3">
    <view class="profile-page">
      <view class="header">
        <text class="title">我的</text>
      </view>

      <view class="placeholder">
        <text class="placeholder-icon">👤</text>
        <text class="placeholder-text">个人中心</text>
        <text class="placeholder-desc">正在开发中...</text>
      </view>

      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores'
import PageLayout from '../../../components/layout/PageLayout.vue'

const userStore = useUserStore()

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        // 清除本地存储
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')

        // 清除 store 状态
        userStore.token = ''
        userStore.userInfo = null

        uni.reLaunch({ url: '/src/pages/user/login/index' })
      }
    }
  })
}

onMounted(() => {
  console.log('个人中心加载，用户信息:', userStore.userInfo)
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.profile-page {
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

.logout-btn {
  width: 100%;
  height: 88rpx;
  background: #ffffff;
  color: $danger-color;
  font-size: $font-size-lg;
  border-radius: $border-radius-md;
  border: 1rpx solid $danger-color;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: $spacing-xl;
}
</style>
