<template>
  <view :class="['card', { 'card--shadow': shadow, 'card--clickable': clickable }]" @click="handleClick">
    <view v-if="title || $slots.extra" class="card__header">
      <text class="card__title">{{ title }}</text>
      <slot name="extra" />
    </view>

    <view class="card__body">
      <slot />
    </view>

    <view v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 卡片容器组件
 */
interface Props {
  title?: string
  shadow?: boolean
  clickable?: boolean
}

withDefaults(defineProps<Props>(), {
  shadow: true,
  clickable: false
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.card {
  background-color: $bg-color-white;
  border-radius: $border-radius-lg;
  overflow: hidden;
  transition: $transition-base;

  &--shadow {
    box-shadow: $shadow-sm;
  }

  &--clickable {
    &:active {
      opacity: 0.8;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-lg;
    border-bottom: 1px solid $border-color-light;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: bold;
    color: $text-color;
  }

  &__body {
    padding: $spacing-lg;
  }

  &__footer {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $border-color-light;
  }
}
</style>
