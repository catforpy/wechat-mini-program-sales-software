<template>
  <uni-transition :show="visible" mode="center" :duration="300">
    <view v-if="visible" class="x-modal" @click.self="handleMaskClick">
      <view class="x-modal__container" @click.stop>
        <view v-if="title" class="x-modal__header">
          <text class="x-modal__title">{{ title }}</text>
          <text v-if="closable" class="x-modal__close" @click="handleClose">×</text>
        </view>

        <view class="x-modal__body">
          <slot />
        </view>

        <view v-if="showFooter" class="x-modal__footer">
          <button v-if="showCancel" class="x-modal__btn x-modal__btn--cancel" @click="handleCancel">
            {{ cancelText }}
          </button>
          <button class="x-modal__btn x-modal__btn--confirm" @click="handleConfirm">
            {{ confirmText }}
          </button>
        </view>
      </view>
    </view>
  </uni-transition>
</template>

<script setup lang="ts">
/**
 * 模态框组件
 */
interface Props {
  visible: boolean
  title?: string
  closable?: boolean
  maskClosable?: boolean
  showFooter?: boolean
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  closable: true,
  maskClosable: true,
  showFooter: true,
  showCancel: true,
  confirmText: '确定',
  cancelText: '取消'
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
  cancel: []
  close: []
}>()

const handleMaskClick = () => {
  if (props.maskClosable) {
    handleClose()
  }
}

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.x-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;

  &__container {
    width: 600rpx;
    max-width: 90%;
    background-color: $bg-color-white;
    border-radius: $border-radius-lg;
    overflow: hidden;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-lg;
    border-bottom: 1px solid $border-color;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: bold;
    color: $text-color;
  }

  &__close {
    font-size: 48rpx;
    color: $text-color-placeholder;
    cursor: pointer;
    line-height: 1;
  }

  &__body {
    padding: $spacing-lg;
    max-height: 60vh;
    overflow-y: auto;
  }

  &__footer {
    display: flex;
    border-top: 1px solid $border-color;
  }

  &__btn {
    flex: 1;
    padding: $spacing-md;
    border: none;
    background-color: transparent;
    font-size: $font-size-base;
    cursor: pointer;
    transition: $transition-base;

    &--cancel {
      color: $text-color-secondary;
      border-right: 1px solid $border-color;

      &:active {
        background-color: $bg-color-disabled;
      }
    }

    &--confirm {
      color: $primary-color;
      font-weight: bold;

      &:active {
        background-color: $bg-color-disabled;
      }
    }
  }
}
</style>
