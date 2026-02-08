/**
 * 媒体播放器配置文件
 *
 * 用于配置全局使用的视频播放器类型
 * 修改此配置即可切换整个应用使用的播放器
 */

// 播放器类型枚举
export enum PlayerType {
  UNIAPP = 'uniapp',                      // Uniapp原生video组件
  TENCENT_VIDEO = 'tencent-video',        // 腾讯云点播播放器
  TENCENT_LIVE_PLAYER = 'tencent-live-player',  // 腾讯云直播播放器
  TENCENT_LIVE_PUSHER = 'tencent-live-pusher',  // 腾讯云直播推流
  ALI_VIDEO = 'ali-video',                // 阿里云点播播放器
  ALI_LIVE_PLAYER = 'ali-live-player',    // 阿里云直播播放器
  ALI_LIVE_PUSHER = 'ali-live-pusher'     // 阿里云直播推流
}

// 默认播放器配置
export const defaultPlayerConfig = {
  // 视频点播默认播放器
  video: PlayerType.UNIAPP,

  // 直播播放默认播放器
  livePlayer: PlayerType.UNIAPP,

  // 直播推流默认播放器
  livePusher: PlayerType.UNIAPP
}

// 腾讯云播放器配置
export const tencentPlayerConfig = {
  licenseUrl: '',  // 腾讯云播放器 license URL，需要在腾讯云控制台申请
  appId: '',       // 腾讯云应用ID
}

// 阿里云播放器配置
export const aliPlayerConfig = {
  authInfo: {},    // 阿里云播放器鉴权信息
  // 其他阿里云配置...
}

// 媒体配置导出
export const mediaConfig = {
  // 默认使用的播放器类型（全局配置）
  default: defaultPlayerConfig.video,

  // 各类型播放器配置
  players: {
    uniapp: defaultPlayerConfig,
    tencent: tencentPlayerConfig,
    ali: aliPlayerConfig
  }
}

/**
 * 获取当前使用的播放器类型
 * @returns 播放器类型
 */
export const getCurrentPlayerType = (): PlayerType => {
  // 可以从环境变量、配置文件或动态读取
  return mediaConfig.default as PlayerType
}

/**
 * 动态设置播放器类型
 * @param type 播放器类型
 */
export const setPlayerType = (type: PlayerType) => {
  mediaConfig.default = type
}
