<template>
  <view class="home-page">
    <!-- 状态栏占位 -->
    <view class="status-bar"></view>

    <view class="content">
      <view class="header">
        <text class="title">首页</text>
      </view>

      <!-- 用户信息 -->
      <view class="user-info">
        <text class="welcome-text">欢迎，{{ userInfo?.name || '用户' }}</text>
        <text class="role-text">角色：{{ getRoleName(userInfo?.role) }}</text>
        <text class="phone-text">{{ userInfo?.phone || '' }}</text>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-grid">
        <view class="menu-item">
          <text class="menu-icon">📋</text>
          <text class="menu-title">订单管理</text>
        </view>
        <view class="menu-item">
          <text class="menu-icon">👥</text>
          <text class="menu-title">客户管理</text>
        </view>
        <view class="menu-item">
          <text class="menu-icon">📦</text>
          <text class="menu-title">商品管理</text>
        </view>
        <view class="menu-item">
          <text class="menu-icon">📊</text>
          <text class="menu-title">数据统计</text>
        </view>
      </view>

      <!-- 退出登录按钮 -->
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const userInfo = ref<any>(null)

// 获取角色名称
const getRoleName = (role: string | undefined) => {
  const roleMap: Record<string, string> = {
    agent: '代理商',
    salesperson: '业务员',
    merchant: '商户'
  }
  return roleMap[role || ''] || '未知'
}

// 退出登录
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
  // 从 store 获取用户信息
  userInfo.value = userStore.userInfo
  console.log('首页加载，用户信息:', userInfo.value)
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.home-page {
  min-height: 100vh;
  background-color: $bg-color;
  display: flex;
  flex-direction: column;
}

.status-bar {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content {
  flex: 1;
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

.user-info {
  background: #ffffff;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  margin-bottom: $spacing-xl;
  box-shadow: $shadow-sm;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  .welcome-text {
    font-size: $font-size-xl;
    font-weight: bold;
    color: $text-color;
  }

  .role-text {
    font-size: $font-size-base;
    color: $primary-color;
  }

  .phone-text {
    font-size: $font-size-sm;
    color: $text-color-secondary;
  }
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
  margin-bottom: $spacing-xl;

  .menu-item {
    background: #ffffff;
    border-radius: $border-radius-lg;
    padding: $spacing-xl;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    box-shadow: $shadow-sm;

    .menu-icon {
      font-size: 64rpx;
    }

    .menu-title {
      font-size: $font-size-base;
      color: $text-color;
    }
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
}
</style>
