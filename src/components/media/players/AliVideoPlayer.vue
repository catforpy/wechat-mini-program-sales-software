<template>
  <view class="ali-video-wrapper">
    <!-- 阿里云播放器实现 -->
    <!-- 注意：需要安装阿里云播放器小程序SDK -->
    <view class="player-container">
      <text class="tip">阿里云播放器</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  src: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  poster: '',
  autoplay: false,
  loop: false
})

const emit = defineEmits(['play', 'pause', 'ended', 'error'])

// TODO: 初始化阿里云播放器
// 需要在页面引入阿里云播放器组件

const onPlay = (e: any) => emit('play', e)
const onPause = (e: any) => emit('pause', e)
const onEnded = (e: any) => emit('ended', e)
const onError = (e: any) => emit('error', e)
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.ali-video-wrapper {
  width: 100%;
  height: 100%;
  background-color: #000000;

  .player-container {
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
</style>
