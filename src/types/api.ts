/**
 * API 相关类型定义
 */

import type { ApiResponse, PageParams, PageResponse } from './global'

/**
 * 用户登录参数
 */
export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  email?: string
  phone?: string
  role: UserRole
  status: UserStatus
  createTime: string
  updateTime: string
}

/**
 * 用户角色
 */
export type UserRole = 'admin' | 'user' | 'guest'

/**
 * 用户状态
 */
export type UserStatus = 'active' | 'inactive' | 'banned'

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string
  refreshToken: string
  userInfo: UserInfo
  expire: number
}

/**
 * Token 信息
 */
export interface TokenInfo {
  accessToken: string
  refreshToken: string
  expire: number
}

/**
 * 订单信息
 */
export interface OrderInfo {
  id: number
  orderNo: string
  userId: number
  userName: string
  productId: number
  productName: string
  amount: number
  status: OrderStatus
  createTime: string
  updateTime: string
}

/**
 * 订单状态
 */
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'completed'
  | 'cancelled'
  | 'refunded'

/**
 * 商品信息
 */
export interface ProductInfo {
  id: number
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  category: string
  status: 'online' | 'offline'
  createTime: string
}

/**
 * API 错误响应
 */
export interface ApiError {
  code: number
  message: string
  errors?: Record<string, string[]>
}
