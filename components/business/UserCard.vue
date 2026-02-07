<template>
  <view class="user-card" @click="handleClick">
    <image :src="user.avatar || defaultAvatar" class="user-card__avatar" mode="aspectFill" />
    <view class="user-card__info">
      <text class="user-card__name">{{ user.nickname || user.username }}</text>
      <text v-if="showRole" class="user-card__role">{{ roleText }}</text>
    </view>
    <slot name="extra" />
  </view>
</template>

<script setup lang="ts">
/**
 * 用户卡片组件
 */
import type { UserInfo } from '@/types'

interface Props {
  user: UserInfo
  showRole?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRole: false
})

const emit = defineEmits<{
  click: [user: UserInfo]
}>()

const defaultAvatar = '/static/images/default-avatar.png'

const roleText = computed(() => {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    user: '用户',
    guest: '游客'
  }
  return roleMap[props.user.role] || '未知'
})

const handleClick = () => {
  emit('click', props.user)
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.user-card {
  display: flex;
  align-items: center;
  padding: $spacing-md;
  background-color: $bg-color-white;
  border-radius: $border-radius-md;
  transition: $transition-base;

  &:active {
    background-color: $bg-color-disabled;
  }

  &__avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: $spacing-md;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-size: $font-size-base;
    font-weight: bold;
    color: $text-color;
    margin-bottom: $spacing-xs;
  }

  &__role {
    font-size: $font-size-sm;
    color: $text-color-secondary;
  }
}
</style>
