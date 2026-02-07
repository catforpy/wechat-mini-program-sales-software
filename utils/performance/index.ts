/**
 * 性能优化工具函数
 * 防抖、节流、虚拟列表等
 */

import { DELAY } from '@/config/constant'

/**
 * 防抖函数
 * 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = DELAY.DEBOUNCE
): (...args: Parameters<T>) => void {
  let timer: number | null = null

  return function(this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数
 * 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = DELAY.THROTTLE
): (...args: Parameters<T>) => void {
  let lastTime = 0

  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now()

    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

/**
 * 请求帧节流（使用 requestAnimationFrame）
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => void {
  let pending = false

  return function(this: any, ...args: Parameters<T>) {
    if (pending) {
      return
    }

    pending = true
    requestAnimationFrame(() => {
      fn.apply(this, args)
      pending = false
    })
  }
}

/**
 * 延迟执行
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 批量执行（每次执行一批）
 */
export async function batchExecute<T, R>(
  items: T[],
  batchSize: number,
  executor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(executor))
    results.push(...batchResults)
  }

  return results
}

/**
 * 并发控制（限制同时执行的数量）
 */
export async function parallelExecute<T, R>(
  items: T[],
  limit: number,
  executor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = []
  const executing: Promise<void>[] = []

  for (const item of items) {
    const promise = executor(item).then((result) => {
      results.push(result)
    })

    executing.push(promise)

    if (executing.length >= limit) {
      await Promise.race(executing)
      // 移除已完成的
      executing.splice(
        executing.findIndex((p) => p === promise),
        1
      )
    }
  }

  await Promise.all(executing)
  return results
}

/**
 * 缓存函数结果
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * 清除 memoize 缓存
 */
export function clearMemoizeCache(fn: any): void {
  if (fn.cache) {
    fn.cache.clear()
  }
}

/**
 * 虚拟列表数据切片
 */
export function getVisibleData<T>(
  data: T[],
  scrollTop: number,
  itemHeight: number,
  containerHeight: number
): {
  visibleData: T[]
  startIndex: number
  endIndex: number
  offsetY: number
} {
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    data.length - 1
  )
  const visibleData = data.slice(startIndex, endIndex + 1)
  const offsetY = startIndex * itemHeight

  return {
    visibleData,
    startIndex,
    endIndex,
    offsetY
  }
}

/**
 * 深度克隆
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any
  }

  if (typeof obj === 'object') {
    const clonedObj: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }

  return obj
}

/**
 * 对象合并
 */
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) {
    return target
  }

  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} })
        }
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * 判断是否为对象
 */
function isObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object'
}

/**
 * 性能监控
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map()
  private measures: Map<string, number[]> = new Map()

  /**
   * 开始标记
   */
  mark(name: string): void {
    this.marks.set(name, performance.now())
  }

  /**
   * 结束标记并测量
   */
  measure(name: string, markName?: string): number {
    const endTime = performance.now()
    const startTime = markName ? this.marks.get(markName) : this.marks.get(name)

    if (startTime === undefined) {
      console.warn(`[Performance] 标记 "${markName || name}" 不存在`)
      return 0
    }

    const duration = endTime - startTime

    if (!this.measures.has(name)) {
      this.measures.set(name, [])
    }

    this.measures.get(name)!.push(duration)

    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)

    return duration
  }

  /**
   * 获取测量统计
   */
  getStats(name: string) {
    const durations = this.measures.get(name)

    if (!durations || durations.length === 0) {
      return null
    }

    const sum = durations.reduce((a, b) => a + b, 0)
    const avg = sum / durations.length
    const min = Math.min(...durations)
    const max = Math.max(...durations)

    return {
      count: durations.length,
      sum,
      avg,
      min,
      max
    }
  }

  /**
   * 清除所有标记和测量
   */
  clear(): void {
    this.marks.clear()
    this.measures.clear()
  }

  /**
   * 获取所有统计
   */
  getAllStats() {
    const stats: Record<string, any> = {}

    for (const [name] of this.measures) {
      stats[name] = this.getStats(name)
    }

    return stats
  }
}

/**
 * 全局性能监控实例
 */
export const performanceMonitor = new PerformanceMonitor()
