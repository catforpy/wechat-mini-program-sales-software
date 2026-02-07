<template>
  <view :class="['list-item', { 'list-item--clickable': clickable }]" @click="handleClick">
    <view v-if="icon" class="list-item__icon">
      <text :class="icon"></text>
    </view>
    <view v-if="avatar" class="list-item__avatar">
      <image :src="avatar" mode="aspectFill" />
    </view>
    <view class="list-item__content">
      <text class="list-item__title">{{ title }}</text>
      <text v-if="note" class="list-item__note">{{ note }}</text>
    </view>
    <view v-if="arrow || $slots.extra" class="list-item__extra">
      <slot name="extra">{{ extraText }}</slot>
      <text v-if="arrow" class="list-item__arrow">›</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 列表项组件
 */
interface Props {
  title: string
  note?: string
  icon?: string
  avatar?: string
  extraText?: string
  arrow?: boolean
  clickable?: boolean
}

withDefaults(defineProps<Props>(), {
  arrow: true,
  clickable: true
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

.list-item {
  display: flex;
  align-items: center;
  padding: $spacing-lg;
  background-color: $bg-color-white;
  border-bottom: 1px solid $border-color-light;
  transition: $transition-base;

  &--clickable {
    &:active {
      background-color: $bg-color-disabled;
    }
  }

  &__icon {
    margin-right: $spacing-md;
    font-size: $font-size-xl;
  }

  &__avatar {
    width: 80rpx;
    height: 80rpx;
    margin-right: $spacing-md;
    border-radius: $border-radius-md;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: $font-size-base;
    color: $text-color;
    margin-bottom: $spacing-xs;
  }

  &__note {
    font-size: $font-size-sm;
    color: $text-color-secondary;
  }

  &__extra {
    display: flex;
    align-items: center;
    margin-left: $spacing-md;
  }

  &__arrow {
    margin-left: $spacing-xs;
    font-size: $font-size-xl;
    color: $text-color-placeholder;
  }
}
</style>
