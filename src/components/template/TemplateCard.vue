<template>
  <view class="template-card" @click="onClick">
    <!-- 缩略图 -->
    <view class="thumbnail-wrapper">
      <image
        class="thumbnail"
        :src="template.thumbnail"
        mode="aspectFill"
        :lazy-load="true"
      />
      <!-- 收藏按钮（仅商户端显示） -->
      <view
        v-if="userRole === 'merchant'"
        class="collect-btn"
        :class="{ collected: template.isCollected }"
        @click.stop="onCollect"
      >
        <text class="collect-icon">{{ template.isCollected ? '❤️' : '🤍' }}</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 模板名称 -->
      <view class="name">{{ template.name }}</view>

      <!-- 分类路径 -->
      <view class="category-path">{{ template.categoryPath }}</view>

      <!-- 标签 -->
      <view class="tags">
        <text
          v-for="(tag, index) in displayTags"
          :key="index"
          class="tag"
        >
          {{ tag }}
        </text>
      </view>

      <!-- 底部信息 -->
      <view class="footer">
        <!-- 价格 -->
        <view class="price-section">
          <text class="price-symbol">¥</text>
          <text class="price">{{ template.price }}</text>
        </view>

        <!-- 评分和销量 -->
        <view class="stats">
          <text class="rating">⭐ {{ template.rating }}</text>
          <text class="sales">📦 {{ template.salesCount }}</text>
        </view>
      </view>

      <!-- 代理商信息（可选显示） -->
      <view v-if="showAgent && template.agentName" class="agent-info">
        <text class="agent-label">代理商：</text>
        <text class="agent-name">{{ template.agentName }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Template } from '@/types/template'

interface Props {
  template: Template
  userRole?: 'agent' | 'merchant' | 'admin'  // 用户角色
  showAgent?: boolean  // 是否显示代理商信息
}

const props = withDefaults(defineProps<Props>(), {
  userRole: 'merchant',
  showAgent: false
})

const emit = defineEmits<{
  click: []
  collect: [isCollected: boolean]
}>()

// 只显示前3个标签
const displayTags = computed(() => {
  return props.template.tags.slice(0, 3)
})

// 点击卡片
const onClick = () => {
  emit('click')
}

// 收藏/取消收藏
const onCollect = () => {
  emit('collect', !props.template.isCollected)
}
</script>

<style scoped lang="scss">
.template-card {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 24rpx;
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.12);
  }
}

.thumbnail-wrapper {
  position: relative;
  width: 100%;
  height: 320rpx;
  background: #f5f5f5;

  .thumbnail {
    width: 100%;
    height: 100%;
  }

  .collect-btn {
    position: absolute;
    top: 16rpx;
    right: 16rpx;
    width: 56rpx;
    height: 56rpx;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);

    .collect-icon {
      font-size: 32rpx;
    }

    &.collected {
      background: rgba(255, 245, 245, 0.95);
    }
  }
}

.content {
  padding: 20rpx;
}

.name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-path {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 12rpx;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 16rpx;

  .tag {
    font-size: 22rpx;
    color: #666;
    background: #f5f5f5;
    padding: 6rpx 12rpx;
    border-radius: 6rpx;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;

  .price-section {
    display: flex;
    align-items: baseline;
    color: #ff4444;

    .price-symbol {
      font-size: 24rpx;
      margin-right: 2rpx;
    }

    .price {
      font-size: 36rpx;
      font-weight: 700;
    }
  }

  .stats {
    display: flex;
    gap: 16rpx;
    font-size: 24rpx;
    color: #999;

    .rating {
      color: #ffb400;
    }
  }
}

.agent-info {
  font-size: 24rpx;
  color: #666;
  padding-top: 12rpx;
  border-top: 1rpx solid #f0f0f0;

  .agent-label {
    color: #999;
  }

  .agent-name {
    color: #1890ff;
    font-weight: 500;
  }
}
</style>
