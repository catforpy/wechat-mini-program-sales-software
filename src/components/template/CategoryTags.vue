<template>
  <scroll-view class="category-tags" scroll-x :show-scrollbar="false">
    <view class="tags-list">
      <view
        v-for="category in categories"
        :key="category.id"
        class="tag-item"
        :class="{ active: modelValue === category.id, disabled: !category.hasData }"
        @click="onClick(category)"
      >
        <text class="name">{{ category.name }}</text>
        <text v-if="category.templateCount && category.templateCount > 0" class="count">
          ({{ category.templateCount }})
        </text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import type { SecondaryCategory } from '@/types/template'

interface Props {
  categories: SecondaryCategory[]
  modelValue: string  // 当前选中的二级分类ID
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const onClick = (category: SecondaryCategory) => {
  if (!category.hasData) return
  emit('update:modelValue', category.id)
}
</script>

<style scoped lang="scss">
.category-tags {
  white-space: nowrap;
  background: #fff;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.tags-list {
  display: inline-flex;
  padding: 0 24rpx;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 24rpx;
  margin-right: 16rpx;
  background: #f8f8f8;
  border: 2rpx solid #f0f0f0;
  border-radius: 12rpx;
  transition: all 0.3s;

  &.active {
    background: #e6f0ff;
    border-color: #1890ff;
    color: #1890ff;

    .name {
      color: #1890ff;
      font-weight: 600;
    }

    .count {
      color: #1890ff;
    }
  }

  &.disabled {
    opacity: 0.4;
    background: #f5f5f5;
    border-color: #e8e8e8;

    .name,
    .count {
      color: #bbb;
    }
  }

  .name {
    font-size: 26rpx;
    color: #666;
  }

  .count {
    font-size: 24rpx;
    color: #999;
    margin-left: 4rpx;
  }
}
</style>
