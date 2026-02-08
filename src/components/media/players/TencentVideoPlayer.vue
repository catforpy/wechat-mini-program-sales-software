<template>
  <view class="tencent-video-wrapper">
    <!-- 腾讯云播放器实现 -->
    <!-- 注意：需要安装腾讯云播放器小程序SDK -->
    <view class="player-container">
      <!-- 这里使用 txv-video 组件，需要在小程序中引入 -->
      <txv-video
        v-if="isReady"
        :vid="vid"
        :playerid="playerId"
        :autoplay="autoplay"
        :controls="controls"
        :poster="poster"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @error="onError"
        @timeupdate="onTimeUpdate"
      />
      <!-- 如果使用URL播放 -->
      <view v-else class="url-player">
        <text class="tip">腾讯云播放器（URL模式）</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  src: string              // 视频URL或fileID
  poster?: string
  autoplay?: boolean
  controls?: boolean
  licenseUrl?: string      // license URL
}

const props = withDefaults(defineProps<Props>(), {
  poster: '',
  autoplay: false,
  controls: true
})

const emit = defineEmits(['play', 'pause', 'ended', 'error', 'timeupdate'])

// 判断是使用fileID还是URL
const vid = ref('')
const isReady = computed(() => vid.value.length > 0)
const playerId = ref(`tencent-player-${Date.now()}`)

// TODO: 初始化腾讯云播放器
// 需要在页面引入腾讯云播放器组件
// const player = require('../../components/tencent-video/video')

const onPlay = (e: any) => emit('play', e)
const onPause = (e: any) => emit('pause', e)
const onEnded = (e: any) => emit('ended', e)
const onError = (e: any) => emit('error', e)
const onTimeUpdate = (e: any) => emit('timeupdate', e)
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.tencent-video-wrapper {
  width: 100%;
  height: 100%;
  background-color: #000000;

  .player-container {
    width: 100%;
    height: 100%;

    .url-player {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .tip {
        color: #ffffff;
        font-size: $font-size-sm;
      }
    }
  }
}
</style>
