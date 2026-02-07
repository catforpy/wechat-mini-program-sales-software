<template>
  <view class="login-page">
    <view class="login-header">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <text class="title">销售app会都</text>
    </view>

    <view class="login-form">
      <!-- 用户名输入 -->
      <x-input
        v-model="formData.username"
        label="账号"
        placeholder="请输入账号"
        :error="!!errors.username"
        clearable
      />
      <text v-if="errors.username" class="error-text">{{ errors.username }}</text>

      <!-- 密码输入 -->
      <x-input
        v-model="formData.password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        :error="!!errors.password"
        clearable
      />
      <text v-if="errors.password" class="error-text">{{ errors.password }}</text>

      <!-- 登录按钮 -->
      <x-button
        type="primary"
        size="large"
        :loading="submitting"
        @click="handleLogin"
      >
        登录
      </x-button>
    </view>

    <view class="login-footer">
      <text class="link">忘记密码？</text>
      <text class="link">注册账号</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useForm, formRules } from '@/composables/useForm'
import { useAuth } from '@/composables/useAuth'

/**
 * 登录页面
 * 使用 useForm 和 useAuth composables
 */
const { login } = useAuth()

// 表单数据
const { formData, errors, submitting, handleSubmit } = useForm(
  {
    username: '',
    password: ''
  },
  {
    username: [formRules.required('请输入账号')],
    password: [formRules.required('请输入密码')]
  }
)

// 处理登录
const handleLogin = async () => {
  await handleSubmit(async () => {
    const success = await login(formData.username, formData.password)
    if (success) {
      // 登录成功，跳转到首页
      uni.reLaunch({ url: '/pages/index/index' })
    }
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.login-page {
  min-height: 100vh;
  padding: $spacing-xl;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120rpx;
  margin-bottom: 80rpx;

  .logo {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: $spacing-lg;
    border-radius: $border-radius-lg;
  }

  .title {
    font-size: $font-size-xxl;
    font-weight: bold;
    color: #ffffff;
  }
}

.login-form {
  background-color: $bg-color-white;
  border-radius: $border-radius-lg;
  padding: $spacing-xl;
  box-shadow: $shadow-lg;

  .x-input {
    margin-bottom: $spacing-md;
  }
}

.error-text {
  display: block;
  margin-top: -$spacing-sm;
  margin-bottom: $spacing-md;
  padding-left: $spacing-md;
  font-size: $font-size-sm;
  color: $danger-color;
}

.x-button {
  margin-top: $spacing-lg;
  width: 100%;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: $spacing-lg;
  padding: 0 $spacing-md;

  .link {
    font-size: $font-size-sm;
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>
