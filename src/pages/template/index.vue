<template>
  <view class="template-center-page">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrapper">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          type="text"
          placeholder="搜索模板名称、分类或标签"
          :value="searchKeyword"
          @input="onSearchInput"
          @confirm="onSearch"
        />
        <text v-if="searchKeyword" class="clear-btn" @click="onClearSearch">✕</text>
      </view>
    </view>

    <!-- 一级分类栏 -->
    <CategoryBar
      v-model="selectedPrimaryCategory"
      :categories="primaryCategories"
    />

    <!-- 二级分类标签 -->
    <CategoryTags
      v-if="secondaryCategories.length > 0"
      v-model="selectedSecondaryCategory"
      :categories="secondaryCategories"
    />

    <!-- 当前分类信息和统计 -->
    <view class="category-info">
      <text class="path">{{ currentCategoryPath }}</text>
      <text class="count">共 {{ templateList.length }} 个模板</text>
    </view>

    <!-- 模板列表 -->
    <view class="template-list">
      <!-- 加载状态 -->
      <view v-if="loading" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-else-if="templateList.length === 0" class="empty-state">
        <text class="empty-icon">📦</text>
        <text class="empty-text">暂无模板</text>
        <text class="empty-hint">该分类下还没有模板</text>
      </view>

      <!-- 模板卡片网格 -->
      <view v-else class="template-grid">
        <TemplateCard
          v-for="template in templateList"
          :key="template.id"
          :template="template"
          :user-role="userRole"
          :show-agent="showAgentInfo"
          @click="onTemplateClick(template)"
          @collect="onCollect(template)"
        />
      </view>

      <!-- 加载更多 -->
      <view v-if="hasMore && !loading" class="load-more" @click="onLoadMore">
        <text class="load-more-text">加载更多</text>
      </view>

      <!-- 没有更多了 -->
      <view v-if="!hasMore && templateList.length > 0" class="no-more">
        <text class="no-more-text">— 没有更多了 —</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CategoryBar from '@/components/template/CategoryBar.vue'
import CategoryTags from '@/components/template/CategoryTags.vue'
import TemplateCard from '@/components/template/TemplateCard.vue'
import { getPrimaryCategories, getSecondaryCategories } from '@/mock/templateCategories'
import { getTemplates } from '@/mock/templateList'
import type { Category, SecondaryCategory, Template } from '@/types/template'

// ============ 状态数据 ============

const userRole = ref<'agent' | 'merchant' | 'admin'>('merchant')  // 当前用户角色
const showAgentInfo = ref(false)  // 是否显示代理商信息

const loading = ref(false)
const searchKeyword = ref('')

// 分类相关
const selectedPrimaryCategory = ref('all')
const selectedSecondaryCategory = ref('')
const primaryCategories = ref<Category[]>([])
const secondaryCategories = ref<(SecondaryCategory & { parentId?: string; parentName?: string })[]>([])

// 模板列表相关
const templateList = ref<Template[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const hasMore = ref(false)

// ============ 计算属性 ============

// 当前分类路径（用于显示）
const currentCategoryPath = computed(() => {
  if (selectedSecondaryCategory.value) {
    const secondary = secondaryCategories.value.find(c => c.id === selectedSecondaryCategory.value)
    if (secondary) {
      return selectedPrimaryCategory.value === 'all'
        ? secondary.name
        : `${secondary.parentName} > ${secondary.name}`
    }
  }

  const primary = primaryCategories.value.find(c => c.id === selectedPrimaryCategory.value)
  return primary?.name || '全部'
})

// ============ 方法 ============

// 加载一级分类
const loadPrimaryCategories = async () => {
  try {
    // 模拟API调用
    primaryCategories.value = getPrimaryCategories()
    console.log('一级分类加载完成：', primaryCategories.value)
  } catch (error) {
    console.error('加载一级分类失败：', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}

// 加载二级分类
const loadSecondaryCategories = async (primaryId: string) => {
  try {
    const categories = getSecondaryCategories(primaryId)
    secondaryCategories.value = categories

    // 自动选中第一个有数据的二级分类
    if (categories.length > 0 && !selectedSecondaryCategory.value) {
      selectedSecondaryCategory.value = categories[0].id
    }

    console.log('二级分类加载完成：', categories)
  } catch (error) {
    console.error('加载二级分类失败：', error)
  }
}

// 加载模板列表
const loadTemplates = async (reset = true) => {
  if (loading.value) return

  loading.value = true

  try {
    // 重置分页
    if (reset) {
      currentPage.value = 1
      templateList.value = []
    }

    // 确定要查询的分类ID
    const categoryId = selectedSecondaryCategory.value || selectedPrimaryCategory.value

    // 模拟API调用
    const result = getTemplates({
      categoryId,
      keyword: searchKeyword.value,
      page: currentPage.value,
      pageSize: pageSize.value
    })

    // 追加或替换数据
    if (reset) {
      templateList.value = result.templates
    } else {
      templateList.value = [...templateList.value, ...result.templates]
    }

    total.value = result.total
    hasMore.value = result.hasMore

    console.log('模板列表加载完成：', {
      categoryId,
      count: result.templates.length,
      total: result.total,
      hasMore: result.hasMore
    })
  } catch (error) {
    console.error('加载模板列表失败：', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 加载更多
const onLoadMore = () => {
  if (hasMore.value && !loading.value) {
    currentPage.value++
    loadTemplates(false)
  }
}

// 搜索输入
const onSearchInput = (e: any) => {
  searchKeyword.value = e.detail.value
}

// 执行搜索
const onSearch = () => {
  console.log('搜索：', searchKeyword.value)
  loadTemplates(true)
}

// 清除搜索
const onClearSearch = () => {
  searchKeyword.value = ''
  loadTemplates(true)
}

// 点击模板卡片
const onTemplateClick = (template: Template) => {
  console.log('点击模板：', template)

  // 跳转到模板详情页
  uni.navigateTo({
    url: `/pages/template/detail/index?id=${template.id}&userRole=${userRole.value}`
  })
}

// 收藏/取消收藏
const onCollect = (template: Template) => {
  console.log('收藏模板：', template)

  // 切换收藏状态
  template.isCollected = !template.isCollected

  // 显示提示
  uni.showToast({
    title: template.isCollected ? '已收藏' : '已取消收藏',
    icon: 'success',
    duration: 1500
  })

  // TODO: 实际应该调用API
}

// ============ 监听分类变化 ============

// 监听一级分类变化
watch(() => selectedPrimaryCategory.value, (newId) => {
  console.log('一级分类变化：', newId)

  // 重置二级分类选择
  selectedSecondaryCategory.value = ''

  // 加载该一级分类下的二级分类
  loadSecondaryCategories(newId)

  // 加载模板列表
  loadTemplates(true)
})

// 监听二级分类变化
watch(() => selectedSecondaryCategory.value, () => {
  console.log('二级分类变化：', selectedSecondaryCategory.value)

  // 加载模板列表
  loadTemplates(true)
})

// ============ 生命周期 ============

onMounted(async () => {
  console.log('=== 模板中心页面 onMounted ===')

  // 1. 加载一级分类
  await loadPrimaryCategories()

  // 2. 加载默认模板列表
  await loadTemplates(true)
})
</script>

<style scoped lang="scss">
.template-center-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 120rpx;  // 为底部导航栏留出空间
}

.search-bar {
  background: #fff;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;

  .search-input-wrapper {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 40rpx;
    padding: 16rpx 24rpx;

    .search-icon {
      font-size: 32rpx;
      margin-right: 12rpx;
    }

    .search-input {
      flex: 1;
      font-size: 28rpx;
      color: #333;
    }

    .clear-btn {
      font-size: 32rpx;
      color: #999;
      padding: 8rpx;
    }
  }
}

.category-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;

  .path {
    font-size: 26rpx;
    color: #666;
    font-weight: 500;
  }

  .count {
    font-size: 24rpx;
    color: #999;
  }
}

.template-list {
  padding: 24rpx;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;

  .loading-text,
  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-top: 20rpx;
  }

  .empty-icon {
    font-size: 96rpx;
  }

  .empty-hint {
    font-size: 24rpx;
    color: #bbb;
    margin-top: 12rpx;
  }
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;

  @media (max-width: 375px) {
    grid-template-columns: 1fr;
  }
}

.load-more {
  text-align: center;
  padding: 30rpx 0;
  margin-top: 20rpx;

  .load-more-text {
    font-size: 28rpx;
    color: #1890ff;
  }
}

.no-more {
  text-align: center;
  padding: 30rpx 0;
  margin-top: 20rpx;

  .no-more-text {
    font-size: 24rpx;
    color: #ccc;
  }
}
</style>
