/**
 * 请求相关的 Composable
 * 封装常用的请求操作
 */
import { ref, computed } from 'vue'
import { httpRequest } from '@/utils'
import { showLoading, hideLoading } from '@/utils/ui'

export function useRequest() {
  const loading = ref(false)
  const error = ref<any>(null)

  /**
   * 发起请求
   */
  const request = async <T = any>(
    fn: () => Promise<T>,
    options: {
      showLoading?: boolean
      loadingText?: string
      showError?: boolean
    } = {}
  ): Promise<T | null> => {
    try {
      loading.value = true
      error.value = null

      if (options.showLoading) {
        showLoading(options.loadingText || '加载中...')
      }

      const result = await fn()
      return result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
      hideLoading()
    }
  }

  /**
   * GET 请求
   */
  const get = <T = any>(url: string, params?: any) => {
    return httpRequest.get<T>(url, params)
  }

  /**
   * POST 请求
   */
  const post = <T = any>(url: string, data?: any) => {
    return httpRequest.post<T>(url, data)
  }

  /**
   * PUT 请求
   */
  const put = <T = any>(url: string, data?: any) => {
    return httpRequest.put<T>(url, data)
  }

  /**
   * DELETE 请求
   */
  const del = <T = any>(url: string, data?: any) => {
    return httpRequest.delete<T>(url, data)
  }

  return {
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    request,
    get,
    post,
    put,
    delete: del
  }
}

/**
 * 分页请求 Composable
 */
export function usePageRequest<T = any>(pageSize: number = 20) {
  const list = ref<T[]>([])
  const total = ref(0)
  const page = ref(1)
  const loading = ref(false)
  const hasMore = computed(() => list.value.length < total.value)

  /**
   * 加载数据
   */
  const loadData = async (fn: (page: number, pageSize: number) => Promise<any>) => {
    if (loading.value) return

    try {
      loading.value = true
      const response = await fn(page.value, pageSize)

      if (page.value === 1) {
        list.value = response.data.list
      } else {
        list.value.push(...response.data.list)
      }

      total.value = response.data.total
    } catch (error) {
      console.error('[usePageRequest] 加载失败:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 刷新
   */
  const refresh = (fn: (page: number, pageSize: number) => Promise<any>) => {
    page.value = 1
    return loadData(fn)
  }

  /**
   * 加载更多
   */
  const loadMore = (fn: (page: number, pageSize: number) => Promise<any>) => {
    if (!hasMore.value || loading.value) return
    page.value++
    return loadData(fn)
  }

  /**
   * 重置
   */
  const reset = () => {
    list.value = []
    total.value = 0
    page.value = 1
  }

  return {
    list: computed(() => list.value),
    total: computed(() => total.value),
    page: computed(() => page.value),
    loading: computed(() => loading.value),
    hasMore,
    loadData,
    refresh,
    loadMore,
    reset
  }
}
