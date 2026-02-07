/**
 * Uniapp 全局类型声明
 * 扩展 Uniapp 的类型定义
 */

import type { ComponentInternalInstance } from 'vue'

/**
 * Uniapp 应用生命周期
 */
export declare function onLaunch(callback: () => void): void
export declare function onShow(callback: () => void): void
export declare function onHide(callback: () => void): void

/**
 * 页面生命周期
 */
export declare function onLoad(callback: (options: any) => void): void
export declare function onReady(callback: () => void): void
export declare function onUnload(callback: () => void): void
export declare function onPullDownRefresh(callback: () => void): void
export declare function onReachBottom(callback: () => void): void
export declare function onShareAppMessage(callback: () => any): void
export declare function onPageScroll(callback: (res: any) => void): void
export declare function onTabItemTap(callback: (res: any) => void): void

/**
 * 扩展 window 对象（H5）
 */
declare global {
  interface Window {
    uni: any
    plus: any
    wx: any
  }
}

export {}
