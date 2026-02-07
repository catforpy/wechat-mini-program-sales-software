<template>
  <button
    :class="['x-button', `x-button--${type}`, `x-button--${size}`, { 'x-button--disabled': disabled, 'x-button--loading': loading }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <text v-if="loading" class="x-button__loading-icon">⟳</text>
    <slot />
  </button>
</template>

<script setup lang="ts">
/**
 * 基础按钮组件
 */
interface Props {
  // 按钮类型
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'text'
  // 尺寸
  size?: 'small' | 'medium' | 'large'
  // 是否禁用
  disabled?: boolean
  // 是否加载中
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'medium',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.x-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: $border-radius-md;
  font-size: $font-size-base;
  line-height: 1.5;
  cursor: pointer;
  transition: $transition-base;
  outline: none;

  // 禁用状态
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  // 加载状态
  &--loading {
    cursor: wait;
  }

  // 尺寸
  &--small {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-sm;
    height: 56rpx;
  }

  &--medium {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-base;
    height: 72rpx;
  }

  &--large {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-lg;
    height: 88rpx;
  }

  // 类型
  &--primary {
    background-color: $primary-color;
    color: #ffffff;

    &:active:not(.x-button--disabled) {
      opacity: 0.8;
    }
  }

  &--success {
    background-color: $success-color;
    color: #ffffff;

    &:active:not(.x-button--disabled) {
      opacity: 0.8;
    }
  }

  &--warning {
    background-color: $warning-color;
    color: #ffffff;

    &:active:not(.x-button--disabled) {
      opacity: 0.8;
    }
  }

  &--danger {
    background-color: $danger-color;
    color: #ffffff;

    &:active:not(.x-button--disabled) {
      opacity: 0.8;
    }
  }

  &--default {
    background-color: $bg-color-white;
    color: $text-color;
    border: 1px solid $border-color;

    &:active:not(.x-button--disabled) {
      background-color: $bg-color-disabled;
    }
  }

  &--text {
    background-color: transparent;
    color: $primary-color;

    &:active:not(.x-button--disabled) {
      opacity: 0.6;
    }
  }

  &__loading-icon {
    margin-right: $spacing-xs;
    animation: rotate 1s linear infinite;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
