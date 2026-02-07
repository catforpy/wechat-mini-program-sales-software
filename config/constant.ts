/**
 * 全局常量定义
 */

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
  // 用户相关
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',

  // 应用配置
  APP_CONFIG: 'app_config',
  THEME: 'theme',
  LANGUAGE: 'language',

  // 缓存
  API_CACHE: 'api_cache_',
  IMAGE_CACHE: 'image_cache_',

  // 其他
  SEARCH_HISTORY: 'search_history',
  LAST_LOGIN_TIME: 'last_login_time'
} as const

/**
 * HTTP 状态码
 */
export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const

/**
 * 业务错误码
 */
export const ERROR_CODE = {
  SUCCESS: 0,
  ERROR: -1,
  TOKEN_EXPIRED: 401,
  TOKEN_INVALID: 402,
  PERMISSION_DENIED: 403,
  USER_NOT_FOUND: 1001,
  PASSWORD_ERROR: 1002,
  USER_DISABLED: 1003,
  PARAMS_ERROR: 2001,
  DATA_NOT_FOUND: 2002,
  DATA_EXISTS: 2003
} as const

/**
 * 正则表达式
 */
export const REGEX = {
  // 手机号（中国大陆）
  PHONE: /^1[3-9]\d{9}$/,

  // 邮箱
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // 身份证号
  ID_CARD: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,

  // 密码（8-20位，包含字母和数字）
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,20}$/,

  // URL
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,

  // IP 地址
  IP: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
} as const

/**
 * 日期时间格式
 */
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_MILLIS: 'YYYY-MM-DD HH:mm:ss.SSS',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
  TIME_SHORT: 'HH:mm'
} as const

/**
 * 文件大小单位
 */
export const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

/**
 * 防抖节流默认延迟时间（毫秒）
 */
export const DELAY = {
  DEBOUNCE: 300,
  THROTTLE: 300,
  SEARCH: 500,
  SCROLL: 100,
  RESIZE: 200
} as const

/**
 * 缓存过期时间（毫秒）
 */
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 分钟
  MEDIUM: 30 * 60 * 1000, // 30 分钟
  LONG: 60 * 60 * 1000, // 1 小时
  VERY_LONG: 24 * 60 * 60 * 1000 // 24 小时
} as const

/**
 * 主题模式
 */
export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
} as const

/**
 * 应用事件类型
 */
export const APP_EVENTS = {
  // 用户相关
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  USER_INFO_UPDATE: 'user:info:update',

  // 网络相关
  NETWORK_ONLINE: 'network:online',
  NETWORK_OFFLINE: 'network:offline',

  // 数据相关
  DATA_REFRESH: 'data:refresh',
  DATA_UPDATE: 'data:update',

  // 应用生命周期
  APP_SHOW: 'app:show',
  APP_HIDE: 'app:hide'
} as const

/**
 * 平台类型
 */
export const PLATFORM = {
  MP_WEIXIN: 'mp-weixin',
  MP_ALIPAY: 'mp-alipay',
  MP_BAIDU: 'mp-baidu',
  MP_TOUTIAO: 'mp-toutiao',
  H5: 'h5',
  APP_PLUS: 'app-plus'
} as const

/**
 * 环境类型
 */
export const ENV_TYPE = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TESTING: 'testing'
} as const
