<template>
  <view class="video-player-wrapper">
    <!-- Uniapp 原生 video -->
    <uniapp-video-player
      v-if="playerType === 'uniapp'"
      :src="src"
      :poster="poster"
      :controls="controls"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :show-play-btn="showPlayBtn"
      :show-center-play-btn="showCenterPlayBtn"
      :object-fit="objectFit"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @error="onError"
      @timeupdate="onTimeUpdate"
      @fullscreenchange="onFullscreenChange"
    />

    <!-- 腾讯云视频播放器 -->
    <tencent-video-player
      v-else-if="playerType === 'tencent-video'"
      :src="src"
      :poster="poster"
      :controls="controls"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :license-url="licenseUrl"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @error="onError"
      @timeupdate="onTimeUpdate"
    />

    <!-- 腾讯云直播播放器 -->
    <tencent-live-player
      v-else-if="playerType === 'tencent-live-player'"
      :src="src"
      :autoplay="autoplay"
      :muted="muted"
      :orientation="orientation"
      :show-progress="showProgress"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @error="onError"
    />

    <!-- 腾讯云直播推流 -->
    <tencent-live-pusher
      v-else-if="playerType === 'tencent-live-pusher'"
      :url="pushUrl"
      :autoplay="autoplay"
      :muted="muted"
      :camera-position="cameraPosition"
      :beauty="beauty"
      @statechange="onPushStateChange"
      @error="onPushError"
    />

    <!-- 阿里云视频播放器 -->
    <ali-video-player
      v-else-if="playerType === 'ali-video'"
      :src="src"
      :poster="poster"
      :autoplay="autoplay"
      :loop="loop"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @error="onError"
    />

    <!-- 阿里云直播播放器 -->
    <ali-live-player
      v-else-if="playerType === 'ali-live-player'"
      :src="src"
      :autoplay="autoplay"
      @play="onPlay"
      @pause="onPause"
      @error="onError"
    />

    <!-- 阿里云直播推流 -->
    <ali-live-pusher
      v-else-if="playerType === 'ali-live-pusher'"
      :url="pushUrl"
      :autoplay="autoplay"
      @statechange="onPushStateChange"
      @error="onPushError"
    />

    <!-- 占位：未配置播放器 -->
    <view v-else class="player-placeholder">
      <text class="placeholder-text">未配置视频播放器</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import UniappVideoPlayer from './players/UniappVideoPlayer.vue'
import TencentVideoPlayer from './players/TencentVideoPlayer.vue'
import TencentLivePlayer from './players/TencentLivePlayer.vue'
import TencentLivePusher from './players/TencentLivePusher.vue'
import AliVideoPlayer from './players/AliVideoPlayer.vue'
import AliLivePlayer from './players/AliLivePlayer.vue'
import AliLivePusher from './players/AliLivePusher.vue'

// 注册组件（Uniapp需要）
defineOptions({
  components: {
    UniappVideoPlayer,
    TencentVideoPlayer,
    TencentLivePlayer,
    TencentLivePusher,
    AliVideoPlayer,
    AliLivePlayer,
    AliLivePusher
  }
})

/**
 * 视频播放器组件 - 工厂模式
 *
 * 支持的视频播放器类型：
 * - uniapp: Uniapp原生video组件
 * - tencent-video: 腾讯云播放器
 * - tencent-live-player: 腾讯云直播播放器
 * - tencent-live-pusher: 腾讯云直播推流
 * - ali-video: 阿里云播放器
 * - ali-live-player: 阿里云直播播放器
 * - ali-live-pusher: 阿里云直播推流
 *
 * 使用方式：
 * 1. 全局配置播放器类型（推荐）：在 @/config/media.config.ts 中配置
 * 2. 组件级配置：通过 playerType prop 指定
 */

interface Props {
  src: string                    // 视频地址
  poster?: string                // 封面图
  playerType?: string            // 播放器类型（优先级高于全局配置）
  licenseUrl?: string            // 腾讯云播放器 license

  // 播放控制
  autoplay?: boolean             // 自动播放
  controls?: boolean             // 显示控制栏
  loop?: boolean                 // 循环播放
  muted?: boolean                // 静音
  showPlayBtn?: boolean          // 显示播放按钮
  showCenterPlayBtn?: boolean    // 显示中心播放按钮
  showProgress?: boolean         // 显示进度条
  objectFit?: 'contain' | 'fill' | 'cover'  // 填充方式

  // 直播推流相关
  pushUrl?: string               // 推流地址
  orientation?: 'vertical' | 'horizontal'  // 推流方向
  cameraPosition?: 'front' | 'back'        // 摄像头位置
  beauty?: number                // 美颜级别 0-9
}

const props = withDefaults(defineProps<Props>(), {
  poster: '',
  autoplay: false,
  controls: true,
  loop: false,
  muted: false,
  showPlayBtn: true,
  showCenterPlayBtn: true,
  showProgress: true,
  objectFit: 'contain',
  orientation: 'vertical',
  cameraPosition: 'front',
  beauty: 5
})

const emit = defineEmits([
  'play',
  'pause',
  'ended',
  'error',
  'timeupdate',
  'fullscreenchange',
  'statechange',  // 推流状态变化
  'pusherror'     // 推流错误
])

// 获取全局配置（如果配置了的话）
const instance = getCurrentInstance()
const globalPlayerType = computed(() => {
  // 从全局配置或App配置中读取
  // @ts-ignore
  return instance?.appContext?.config?.globalProperties?.$videoPlayerType || 'uniapp'
})

// 最终使用的播放器类型（组件配置优先于全局配置）
const playerType = computed(() => {
  return props.playerType || globalPlayerType.value
})

// 事件处理
const onPlay = (e: any) => emit('play', e)
const onPause = (e: any) => emit('pause', e)
const onEnded = (e: any) => emit('ended', e)
const onError = (e: any) => emit('error', e)
const onTimeUpdate = (e: any) => emit('timeupdate', e)
const onFullscreenChange = (e: any) => emit('fullscreenchange', e)
const onPushStateChange = (e: any) => emit('statechange', e)
const onPushError = (e: any) => emit('pusherror', e)

// 暴露给父组件的方法
const play = () => {
  // 根据播放器类型调用对应方法
  console.log('播放视频')
}

const pause = () => {
  console.log('暂停视频')
}

const stop = () => {
  console.log('停止视频')
}

const seek = (time: number) => {
  console.log('跳转到指定时间:', time)
}

defineExpose({
  play,
  pause,
  stop,
  seek
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.video-player-wrapper {
  width: 100%;
  height: 100%;
  position: relative;

  .player-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000000;

    .placeholder-text {
      color: #ffffff;
      font-size: $font-size-base;
    }
  }
}
</style>
