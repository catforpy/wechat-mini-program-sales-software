<template>
  <scroll-view class="category-bar" scroll-x :show-scrollbar="false">
    <view class="category-list">
      <view
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        :class="{ active: modelValue === category.id }"
        @click="onClick(category.id)"
      >
        <text class="icon">{{ category.icon }}</text>
        <text class="name">{{ category.name }}</text>
        <!-- 数量徽章 -->
        <text v-if="category.templateCount && category.templateCount > 0" class="badge">
          {{ category.templateCount }}
        </text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import type { Category } from '@/types/template'

interface Props {
  categories: Category[]
  modelValue: string  // 当前选中的分类ID
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const onClick = (categoryId: string) => {
  emit('update:modelValue', categoryId)
}
</script>

<style scoped lang="scss">
.category-bar {
  white-space: nowrap;
  background: #fff;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.category-list {
  display: inline-flex;
  padding: 0 24rpx;
}

.category-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  margin-right: 16rpx;
  background: #f5f5f5;
  border-radius: 40rpx;
  transition: all 0.3s;

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.4);

    .name {
      color: #fff;
      font-weight: 600;
    }

    .badge {
      background: rgba(255, 255, 255, 0.3);
      color: #fff;
    }
  }

  .icon {
    font-size: 32rpx;
  }

  .name {
    font-size: 28rpx;
    color: #333;
    white-space: nowrap;
  }

  .badge {
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    min-width: 32rpx;
    height: 32rpx;
    line-height: 32rpx;
    padding: 0 8rpx;
    background: #ff4444;
    color: #fff;
    font-size: 20rpx;
    text-align: center;
    border-radius: 16rpx;
    font-weight: 600;
  }
}
</style>
