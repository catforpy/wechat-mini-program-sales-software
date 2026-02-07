<template>
  <view class="home-page">
    <navbar title="首页" :show-back="false" />

    <view class="content">
      <!-- 用户信息卡片 -->
      <card v-if="isLoggedIn" title="用户信息" @click="handleUserCard">
        <user-card :user="userInfo" :show-role="true" />
      </card>

      <!-- 未登录状态 -->
      <card v-else title="欢迎">
        <view class="welcome">
          <text class="welcome-text">欢迎来到销售app会都</text>
          <x-button type="primary" @click="goToLogin">立即登录</x-button>
        </view>
      </card>

      <!-- 功能列表 -->
      <card title="常用功能" class="mt-20">
        <list-item
          v-for="(item, index) in menuItems"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          @click="handleMenuClick(item)"
        />
      </card>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 首页
 * 展示如何使用组件和 Composables
 */
import { useAuth } from '@/composables/useAuth'

// 组件
import Navbar from '@/components/business/Navbar.vue'
import Card from '@/components/business/Card.vue'
import UserCard from '@/components/business/UserCard.vue'
import ListItem from '@/components/business/ListItem.vue'
import XButton from '@/components/base/Button.vue'

// 使用 Composables
const { isLoggedIn, userInfo } = useAuth()

// 菜单项
const menuItems = [
  { title: '订单管理', icon: '📋', url: '/pages/order/list/index' },
  { title: '客户管理', icon: '👥', url: '/pages/customer/list/index' },
  { title: '商品管理', icon: '📦', url: '/pages/product/list/index' },
  { title: '数据统计', icon: '📊', url: '/pages/statistics/index' },
  { title: '系统设置', icon: '⚙️', url: '/pages/settings/index' }
]

// 处理菜单点击
const handleMenuClick = (item: any) => {
  uni.navigateTo({ url: item.url })
}

// 处理用户卡片点击
const handleUserCard = () => {
  uni.navigateTo({ url: '/pages/user/profile/index' })
}

// 跳转登录
const goToLogin = () => {
  uni.navigateTo({ url: '/pages/user/login/index' })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.home-page {
  min-height: 100vh;
  background-color: $bg-color;
}

.content {
  padding: $spacing-md;
}

.mt-20 {
  margin-top: 20rpx;
}

.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-xl 0;

  &-text {
    font-size: $font-size-lg;
    color: $text-color;
    margin-bottom: $spacing-lg;
  }
}
</style>
