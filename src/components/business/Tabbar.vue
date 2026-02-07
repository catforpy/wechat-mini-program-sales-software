<template>
  <view class="tabbar">
    <view
      v-for="(item, index) in items"
      :key="index"
      :class="['tabbar__item', { 'tabbar__item--active': activeIndex === index }]"
      @click="handleClick(index, item)"
    >
      <text :class="['tabbar__icon', activeIndex === index ? item.activeIcon : item.icon]"></text>
      <text class="tabbar__label">{{ item.label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 底部导航栏组件
 */
interface TabbarItem {
  icon: string
  activeIcon: string
  label: string
  url: string
}

interface Props {
  items: TabbarItem[]
  activeIndex: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  change: [index: number, item: TabbarItem]
}>()

const handleClick = (index: number, item: TabbarItem) => {
  if (props.activeIndex !== index) {
    emit('change', index, item)
    uni.switchTab({
      url: item.url
    })
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 100rpx;
  background-color: $bg-color-white;
  border-top: 1px solid $border-color;
  z-index: 999;

  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: $text-color-secondary;
    transition: $transition-base;

    &--active {
      color: $primary-color;
    }
  }

  &__icon {
    font-size: 48rpx;
    margin-bottom: $spacing-xs;
  }

  &__label {
    font-size: $font-size-xs;
  }
}
</style>
