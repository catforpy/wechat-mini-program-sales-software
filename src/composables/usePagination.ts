/**
 * 分页相关的 Composable
 */
import { ref, computed } from 'vue'

export function usePagination(initialPageSize: number = 20) {
  const page = ref(1)
  const pageSize = ref(initialPageSize)
  const total = ref(0)

  /**
   * 总页数
   */
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  /**
   * 是否有上一页
   */
  const hasPrevPage = computed(() => page.value > 1)

  /**
   * 是否有下一页
   */
  const hasNextPage = computed(() => page.value < totalPages.value)

  /**
   * 起始位置
   */
  const offset = computed(() => (page.value - 1) * pageSize.value)

  /**
   * 上一页
   */
  const prevPage = () => {
    if (hasPrevPage.value) {
      page.value--
    }
  }

  /**
   * 下一页
   */
  const nextPage = () => {
    if (hasNextPage.value) {
      page.value++
    }
  }

  /**
   * 跳转到指定页
   */
  const goToPage = (targetPage: number) => {
    if (targetPage >= 1 && targetPage <= totalPages.value) {
      page.value = targetPage
    }
  }

  /**
   * 重置分页
   */
  const reset = () => {
    page.value = 1
  }

  /**
   * 设置总数
   */
  const setTotal = (count: number) => {
    total.value = count
  }

  /**
   * 设置每页数量
   */
  const setPageSize = (size: number) => {
    pageSize.value = size
    reset()
  }

  return {
    page: computed(() => page.value),
    pageSize: computed(() => pageSize.value),
    total: computed(() => total.value),
    totalPages,
    hasPrevPage,
    hasNextPage,
    offset,
    prevPage,
    nextPage,
    goToPage,
    reset,
    setTotal,
    setPageSize
  }
}

/**
 * 列表分页 Composable（带数据）
 */
export function useList<T = any>(initialPageSize: number = 20) {
  const list = ref<T[]>([])
  const loading = ref(false)
  const pagination = usePagination(initialPageSize)

  /**
   * 加载数据
   */
  const loadData = async (fn: (page: number, pageSize: number) => Promise<any>) => {
    loading.value = true
    try {
      const response = await fn(pagination.page.value, pagination.pageSize.value)
      list.value = response.data.list
      pagination.setTotal(response.data.total)
    } catch (error) {
      console.error('[useList] 加载失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新
   */
  const refresh = (fn: (page: number, pageSize: number) => Promise<any>) => {
    pagination.reset()
    return loadData(fn)
  }

  /**
   * 重置
   */
  const reset = () => {
    list.value = []
    pagination.reset()
  }

  return {
    list: computed(() => list.value),
    loading: computed(() => loading.value),
    pagination,
    loadData,
    refresh,
    reset
  }
}
