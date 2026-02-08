<template>
  <view class="login-page">
    <!-- GIF背景 - 覆盖整个页面 -->
    <image
      src="/static/background.gif"
      mode="aspectFill"
      class="gif-background"
    />

    <!-- 渐变遮罩 - 覆盖整个页面 -->
    <view class="gradient-overlay"></view>

    <!-- 状态栏占位 -->
    <view class="status-bar"></view>

    <!-- 中间区域 - 显示Logo和标题 -->
    <view class="center-area">
      <!-- Logo和标题 -->
      <image
        src="/static/logo.jpg"
        mode="aspectFit"
        class="logo"
      />
      <text class="title">唐极课得</text>
    </view>

    <!-- 底部登录卡片 -->
    <view class="bottom-card">
      <!-- 角色切换 - 带动画效果 -->
      <view class="role-tabs">
        <view
          v-for="(role, index) in roles"
          :key="index"
          :class="['role-tab', { active: currentRoleIndex === index }]"
          :style="getTabStyle(index)"
          @click="handleRoleChange(index)"
        >
          {{ role.name }}
        </view>
      </view>

      <!-- 登录表单容器 -->
      <view class="form-container">
      <!-- 代理商/业务员登录 -->
      <view v-if="currentRole !== 'merchant'" class="login-form">
        <view class="form-item">
          <text class="label">手机号</text>
          <input
            v-model="staffForm.phone"
            class="input"
            type="number"
            placeholder="请输入手机号"
            maxlength="11"
            @input="validateStaffForm"
          />
        </view>

        <view class="form-item">
          <text class="label">密码</text>
          <input
            v-model="staffForm.password"
            class="input"
            type="password"
            placeholder="请输入密码"
            @input="validateStaffForm"
          />
        </view>

        <view class="form-actions">
          <view class="checkbox-group">
            <checkbox
              :checked="staffForm.rememberPassword"
              @click="staffForm.rememberPassword = !staffForm.rememberPassword"
              color="#007aff"
            />
            <text class="checkbox-label">记住密码</text>
          </view>
          <text class="link" @click="handleForgotPassword">忘记密码？</text>
        </view>

        <button
          class="login-btn"
          :disabled="!staffForm.isValid || staffForm.loading"
          @click="handleStaffLogin"
        >
          {{ staffForm.loading ? '登录中...' : '登录' }}
        </button>
      </view>

      <!-- 商户 - 登录/注册 -->
      <view v-if="currentRole === 'merchant'" class="merchant-container">
        <!-- 登录/注册切换 -->
        <view class="merchant-tabs">
          <view
            :class="['merchant-tab', { active: merchantTab === 'login' }]"
            @click="merchantTab = 'login'"
          >
            登录
          </view>
          <view
            :class="['merchant-tab', { active: merchantTab === 'register' }]"
            @click="merchantTab = 'register'"
          >
            注册
          </view>
        </view>

        <!-- 商户登录表单 - 默认密码登录 -->
        <view v-if="merchantTab === 'login'" class="merchant-form">
          <view class="form-item">
            <text class="label">手机号</text>
            <input
              v-model="merchantLoginForm.phone"
              class="input"
              type="number"
              placeholder="请输入手机号"
              maxlength="11"
              @input="validateMerchantLoginForm"
            />
          </view>

          <!-- 密码登录（默认） -->
          <view v-if="!merchantLoginForm.useSms && !merchantLoginForm.useWechat" class="form-item">
            <text class="label">密码</text>
            <input
              v-model="merchantLoginForm.password"
              class="input"
              type="password"
              placeholder="请输入密码"
              @input="validateMerchantLoginForm"
            />
          </view>

          <!-- 验证码登录 -->
          <view v-if="merchantLoginForm.useSms" class="form-item">
            <text class="label">验证码</text>
            <view class="sms-input">
              <input
                v-model="merchantLoginForm.smsCode"
                class="input sms-code-input"
                type="number"
                placeholder="请输入验证码"
                maxlength="6"
                @input="validateMerchantLoginForm"
              />
              <button
                class="sms-btn"
                :disabled="merchantLoginForm.countdown > 0 || !merchantLoginForm.phone"
                @click="handleSendSms('login')"
              >
                {{ merchantLoginForm.countdown > 0 ? `${merchantLoginForm.countdown}s` : '获取验证码' }}
              </button>
            </view>
          </view>

          <!-- 微信扫码登录提示 -->
          <view v-if="merchantLoginForm.useWechat" class="wechat-login-tip">
            <text class="tip-text">请使用微信扫描二维码登录</text>
            <view class="qrcode-placeholder">
              <text class="placeholder-text">二维码区域</text>
            </view>
          </view>

          <!-- 登录方式切换 -->
          <view v-if="!merchantLoginForm.useWechat" class="login-method-switch">
            <text
              v-if="!merchantLoginForm.useSms"
              class="switch-link"
              @click="merchantLoginForm.useSms = true; merchantLoginForm.useWechat = false"
            >
              使用验证码登录
            </text>
            <text
              v-else
              class="switch-link"
              @click="merchantLoginForm.useSms = false"
            >
              使用密码登录
            </text>
            <text class="divider">|</text>
            <text
              class="switch-link"
              @click="merchantLoginForm.useWechat = !merchantLoginForm.useWechat"
            >
              {{ merchantLoginForm.useWechat ? '使用密码登录' : '使用微信扫码登录' }}
            </text>
          </view>

          <button
            v-if="!merchantLoginForm.useWechat"
            class="login-btn"
            :disabled="!merchantLoginForm.isValid || merchantLoginForm.loading"
            @click="handleMerchantLogin"
          >
            {{ merchantLoginForm.loading ? '登录中...' : '登录' }}
          </button>
        </view>

        <!-- 商户注册表单 -->
        <view v-if="merchantTab === 'register'" class="merchant-form">
          <view class="form-item">
            <text class="label">手机号</text>
            <input
              v-model="merchantRegisterForm.phone"
              class="input"
              type="number"
              placeholder="请输入手机号"
              maxlength="11"
              @input="validateMerchantRegisterForm"
            />
          </view>

          <view class="form-item">
            <text class="label">验证码</text>
            <view class="sms-input">
              <input
                v-model="merchantRegisterForm.smsCode"
                class="input sms-code-input"
                type="number"
                placeholder="请输入验证码"
                maxlength="6"
                @input="validateMerchantRegisterForm"
              />
              <button
                class="sms-btn"
                :disabled="merchantRegisterForm.countdown > 0 || !merchantRegisterForm.phone"
                @click="handleSendSms('register')"
              >
                {{ merchantRegisterForm.countdown > 0 ? `${merchantRegisterForm.countdown}s` : '获取验证码' }}
              </button>
            </view>
          </view>

          <view class="form-item">
            <text class="label">密码</text>
            <input
              v-model="merchantRegisterForm.password"
              class="input"
              type="password"
              placeholder="请设置密码（6-20位）"
              @input="validateMerchantRegisterForm"
            />
          </view>

          <view class="form-item">
            <text class="label">确认密码</text>
            <input
              v-model="merchantRegisterForm.confirmPassword"
              class="input"
              type="password"
              placeholder="请再次输入密码"
              @input="validateMerchantRegisterForm"
            />
          </view>

          <view class="form-tips">
            <text class="tips-text">• 密码长度6-20位</text>
            <text class="tips-text">• 注册成功后自动登录</text>
          </view>

          <button
            class="login-btn"
            :disabled="!merchantRegisterForm.isValid || merchantRegisterForm.loading"
            @click="handleMerchantRegister"
          >
            {{ merchantRegisterForm.loading ? '注册中...' : '注册' }}
          </button>
        </view>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores'

// 用户 store
const userStore = useUserStore()

// 角色列表
const roles = [
  { name: '代理商', value: 'agent' },
  { name: '业务员', value: 'salesperson' },
  { name: '商户', value: 'merchant' }
]

// 当前角色索引
const currentRoleIndex = ref(0)
const currentRole = computed(() => roles[currentRoleIndex.value].value)

// 商户登录/注册切换
const merchantTab = ref<'login' | 'register'>('login')

// 代理商/业务员表单
const staffForm = ref({
  phone: '',
  password: '',
  rememberPassword: false,
  loading: false,
  isValid: false
})

// 商户登录表单
const merchantLoginForm = ref({
  phone: '',
  password: '',
  smsCode: '',
  useSms: false, // 是否使用验证码登录
  useWechat: false, // 是否使用微信扫码登录
  loading: false,
  countdown: 0,
  isValid: false
})

// 商户注册表单
const merchantRegisterForm = ref({
  phone: '',
  smsCode: '',
  password: '',
  confirmPassword: '',
  loading: false,
  countdown: 0,
  isValid: false
})

// 倒计时定时器
let countdownTimer: number | null = null

// 切换角色
const handleRoleChange = (index: number) => {
  currentRoleIndex.value = index
  // 重置表单状态
  resetForms()
}

// 重置所有表单
const resetForms = () => {
  staffForm.value = {
    phone: '',
    password: '',
    rememberPassword: false,
    loading: false,
    isValid: false
  }

  merchantLoginForm.value = {
    phone: '',
    password: '',
    smsCode: '',
    useSms: false,
    useWechat: false,
    loading: false,
    countdown: 0,
    isValid: false
  }

  merchantRegisterForm.value = {
    phone: '',
    smsCode: '',
    password: '',
    confirmPassword: '',
    loading: false,
    countdown: 0,
    isValid: false
  }

  // 清除倒计时
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// 验证代理商/业务员表单
const validateStaffForm = () => {
  const { phone, password } = staffForm.value
  staffForm.value.isValid = /^1[3-9]\d{9}$/.test(phone) && password.length >= 6
}

// 验证商户登录表单
const validateMerchantLoginForm = () => {
  const { phone, password, smsCode, useSms } = merchantLoginForm.value
  const isPhoneValid = /^1[3-9]\d{9}$/.test(phone)

  if (useSms) {
    merchantLoginForm.value.isValid = isPhoneValid && smsCode.length === 6
  } else {
    merchantLoginForm.value.isValid = isPhoneValid && password.length >= 6
  }
}

// 验证商户注册表单
const validateMerchantRegisterForm = () => {
  const { phone, smsCode, password, confirmPassword } = merchantRegisterForm.value
  const isPhoneValid = /^1[3-9]\d{9}$/.test(phone)
  const isSmsCodeValid = smsCode.length === 6
  const isPasswordValid = password.length >= 6 && password.length <= 20
  const isConfirmValid = password === confirmPassword

  merchantRegisterForm.value.isValid =
    isPhoneValid && isSmsCodeValid && isPasswordValid && isConfirmValid
}

// 发送验证码
const handleSendSms = async (type: 'login' | 'register') => {
  const phone = type === 'login'
    ? merchantLoginForm.value.phone
    : merchantRegisterForm.value.phone

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '请输入正确的手机号'
    })
    return
  }

  try {
    // TODO: 调用发送验证码 API
    // 暂时使用 Mock
    console.log('发送验证码:', { type, phone })

    // 模拟发送成功
    uni.showToast({
      title: '提示',
      icon: 'success',
      content: '验证码已发送'
    })

    // 开始倒计时
    const formRef = type === 'login' ? merchantLoginForm : merchantRegisterForm
    formRef.value.countdown = 60

    countdownTimer = setInterval(() => {
      formRef.value.countdown--
      if (formRef.value.countdown <= 0) {
        clearInterval(countdownTimer!)
        countdownTimer = null
      }
    }, 1000)
  } catch (error) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '验证码发送失败，请稍后重试'
    })
  }
}

// 代理商/业务员登录
const handleStaffLogin = async () => {
  if (!staffForm.value.isValid) return

  const { phone, password, rememberPassword } = staffForm.value

  try {
    staffForm.value.loading = true

    // TODO: 调用登录 API
    // 暂时使用 Mock - 默认所有输入都正确
    console.log('代理商/业务员登录:', { phone, password, role: currentRole.value })

    // 模拟登录成功
    const mockToken = `mock_token_${currentRole.value}_${Date.now()}`
    const mockUserInfo = {
      id: 1,
      name: '测试用户',
      phone: phone,
      role: currentRole.value,
      avatar: ''
    }

    // 保存到 store 和本地存储
    userStore.token = mockToken
    userStore.userInfo = mockUserInfo
    uni.setStorageSync('token', mockToken)
    uni.setStorageSync('userInfo', mockUserInfo)

    // 如果选择记住密码，保存手机号
    if (rememberPassword) {
      uni.setStorageSync('saved_phone', phone)
    }

    uni.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500
    })

    // 跳转到首页
    setTimeout(() => {
      uni.reLaunch({ url: '/src/pages/index/index' })
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '登录失败，请检查账号密码'
    })
  } finally {
    staffForm.value.loading = false
  }
}

// 商户登录
const handleMerchantLogin = async () => {
  const { phone, password, smsCode, useSms } = merchantLoginForm.value

  // 验证输入
  const isPhoneValid = /^1[3-9]\d{9}$/.test(phone)
  if (!isPhoneValid) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '请输入正确的手机号'
    })
    return
  }

  if (useSms && smsCode.length !== 6) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '请输入验证码'
    })
    return
  }

  if (!useSms && password.length < 6) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '请输入密码'
    })
    return
  }

  try {
    merchantLoginForm.value.loading = true

    // TODO: 调用商户登录 API
    // 暂时使用 Mock - 默认所有输入都正确
    console.log('商户登录:', { phone, password, smsCode, useSms })

    // 模拟登录成功
    const mockToken = `mock_token_merchant_${Date.now()}`
    const mockUserInfo = {
      id: 2,
      name: '测试商户',
      phone: phone,
      role: 'merchant',
      avatar: ''
    }

    // 保存到 store 和本地存储
    userStore.token = mockToken
    userStore.userInfo = mockUserInfo
    uni.setStorageSync('token', mockToken)
    uni.setStorageSync('userInfo', mockUserInfo)

    uni.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500
    })

    // 跳转到首页
    setTimeout(() => {
      uni.reLaunch({ url: '/src/pages/index/index' })
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '登录失败，请检查账号密码'
    })
  } finally {
    merchantLoginForm.value.loading = false
  }
}

// 商户注册
const handleMerchantRegister = async () => {
  if (!merchantRegisterForm.value.isValid) return

  const { phone, smsCode, password } = merchantRegisterForm.value

  try {
    merchantRegisterForm.value.loading = true

    // TODO: 调用商户注册 API
    // 暂时使用 Mock - 默认所有输入都正确
    console.log('商户注册:', { phone, smsCode, password })

    // 模拟注册成功
    const mockToken = `mock_token_merchant_${Date.now()}`
    const mockUserInfo = {
      id: 3,
      name: '新商户',
      phone: phone,
      role: 'merchant',
      avatar: ''
    }

    // 保存到 store 和本地存储
    userStore.token = mockToken
    userStore.userInfo = mockUserInfo
    uni.setStorageSync('token', mockToken)
    uni.setStorageSync('userInfo', mockUserInfo)

    uni.showToast({
      title: '注册成功',
      icon: 'success',
      duration: 1500
    })

    // 跳转到首页
    setTimeout(() => {
      uni.reLaunch({ url: '/src/pages/index/index' })
    }, 1500)
  } catch (error) {
    uni.showToast({
      title: '提示',
      icon: 'none',
      content: '注册失败，请稍后重试'
    })
  } finally {
    merchantRegisterForm.value.loading = false
  }
}

// 忘记密码
const handleForgotPassword = () => {
  uni.showToast({
    title: '提示',
    icon: 'none',
    content: '请联系管理员重置密码'
  })
}

// 获取选项卡样式（带动画）
const getTabStyle = (index: number) => {
  const isActive = currentRoleIndex.value === index
  return {
    transform: `scale(${isActive ? 1.1 : 0.95})`,
    opacity: isActive ? 1 : 0.7
  }
}

// 页面加载时隐藏 tabBar
onMounted(() => {
  uni.hideTabBar({
    animation: false
  })
})

// 页面卸载时清除定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

// 状态栏占位
.status-bar {
  height: var(--status-bar-height);
  width: 100%;
  position: relative;
  z-index: 20;
  background: transparent;
}

// 底部安全区域
.safe-area-bottom {
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
  width: 100%;
  background-color: transparent;
}

// 动画关键帧
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20rpx);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: transparent;
  overflow: hidden;

  // GIF背景 - 覆盖整个页面
  .gif-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 1;
  }

  // 渐变遮罩 - 让GIF背景不要太抢眼
  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.05) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.15) 100%
    );
  }
}

// 中间区域 - 显示Logo和标题
.center-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 5;

  .logo {
    position: relative;
    z-index: 10;
    width: 200rpx;
    height: 200rpx;
    border-radius: $border-radius-lg;
    background-color: rgba(255, 255, 255, 0.95);
    padding: 12rpx;
    box-shadow: $shadow-lg;
    margin-bottom: $spacing-lg;
    animation: float 3s ease-in-out infinite;
  }

  .title {
    position: relative;
    z-index: 10;
    font-size: 52rpx;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.4);
    animation: fadeInUp 1s ease-out;
  }
}

// 底部卡片 - 沉底的登录表单
.bottom-card {
  position: relative;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  border-radius: 40rpx 40rpx 0 0;
  padding: $spacing-xl;
  padding-bottom: 0;
  box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.15);
  animation: slideUp 0.6s ease-out;
}

// 角色切换标签 - 带动画
.role-tabs {
  display: flex;
  background-color: $bg-color;
  border-radius: $border-radius-lg;
  padding: 8rpx;
  margin-bottom: $spacing-lg;

  .role-tab {
    flex: 1;
    text-align: center;
    padding: 20rpx 0;
    font-size: 28rpx;
    color: $text-color-secondary;
    border-radius: $border-radius-md;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;

    &.active {
      background-color: $primary-color;
      color: #ffffff;
      font-weight: bold;
      box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
    }
  }
}

// 表单容器
.form-container {
  max-height: 60vh;
  overflow-y: auto;
  padding-bottom: $spacing-xl;
}

// 登录/注册切换标签（商户）
.merchant-tabs {
  display: flex;
  background-color: $bg-color;
  border-radius: $border-radius-md;
  padding: 4rpx;
  margin-bottom: $spacing-xl;

  .merchant-tab {
    flex: 1;
    text-align: center;
    padding: 16rpx 0;
    font-size: 28rpx;
    color: $text-color-secondary;
    border-radius: $border-radius-sm;
    transition: all 0.3s;

    &.active {
      background-color: $primary-color;
      color: #ffffff;
      font-weight: bold;
    }
  }
}

// 表单项
.form-item {
  margin-bottom: $spacing-lg;

  .label {
    display: block;
    font-size: $font-size-base;
    color: $text-color;
    margin-bottom: $spacing-sm;
    font-weight: 500;
  }

  .input {
    width: 100%;
    height: 88rpx;
    padding: 0 $spacing-md;
    background-color: $bg-color;
    border: 1rpx solid $border-color;
    border-radius: $border-radius-md;
    font-size: $font-size-base;
    color: $text-color;

    &:focus {
      border-color: $primary-color;
      background-color: #ffffff;
    }
  }
}

// 验证码输入
.sms-input {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  .sms-code-input {
    flex: 1;
  }

  .sms-btn {
    flex-shrink: 0;
    width: 200rpx;
    height: 88rpx;
    font-size: $font-size-sm;
    color: $primary-color;
    background-color: #ffffff;
    border: 1rpx solid $primary-color;
    border-radius: $border-radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

    &:disabled {
      opacity: 0.5;
    }
  }
}

// 表单操作区
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-lg;

  .checkbox-group {
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    .checkbox-label {
      font-size: $font-size-sm;
      color: $text-color-secondary;
    }
  }

  .link {
    font-size: $font-size-sm;
    color: $primary-color;
  }
}

// 登录方式切换
.login-method-switch {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;

  .switch-link {
    font-size: $font-size-sm;
    color: $primary-color;
    text-decoration: underline;
  }

  .divider {
    font-size: $font-size-sm;
    color: $text-color-placeholder;
  }
}

// 微信登录提示
.wechat-login-tip {
  text-align: center;
  padding: $spacing-xl 0;

  .tip-text {
    display: block;
    font-size: $font-size-base;
    color: $text-color;
    margin-bottom: $spacing-lg;
  }

  .qrcode-placeholder {
    width: 400rpx;
    height: 400rpx;
    margin: 0 auto;
    background-color: $bg-color;
    border-radius: $border-radius-lg;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1rpx solid $border-color;

    .placeholder-text {
      font-size: $font-size-base;
      color: $text-color-secondary;
    }
  }
}

// 登录按钮
.login-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-size: $font-size-lg;
  border-radius: $border-radius-md;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 16rpx rgba(102, 126, 234, 0.4);

  &:disabled {
    opacity: 0.5;
  }

  &:not(:disabled):active {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

// 提示信息
.form-tips {
  margin-bottom: $spacing-lg;

  .tips-text {
    display: block;
    font-size: $font-size-sm;
    color: $text-color-secondary;
    line-height: 1.8;
  }
}
</style>
