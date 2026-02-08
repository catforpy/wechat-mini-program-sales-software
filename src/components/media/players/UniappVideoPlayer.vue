<template>
  <video
    class="uniapp-video"
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
</template>

<script setup lang="ts">
interface Props {
  src: string
  poster?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
  showPlayBtn?: boolean
  showCenterPlayBtn?: boolean
  objectFit?: 'contain' | 'fill' | 'cover'
}

const props = withDefaults(defineProps<Props>(), {
  poster: '',
  autoplay: false,
  controls: true,
  loop: false,
  muted: false,
  showPlayBtn: true,
  showCenterPlayBtn: true,
  objectFit: 'contain'
})

const emit = defineEmits(['play', 'pause', 'ended', 'error', 'timeupdate', 'fullscreenchange'])

const onPlay = (e: any) => emit('play', e)
const onPause = (e: any) => emit('pause', e)
const onEnded = (e: any) => emit('ended', e)
const onError = (e: any) => emit('error', e)
const onTimeUpdate = (e: any) => emit('timeupdate', e)
const onFullscreenChange = (e: any) => emit('fullscreenchange', e)
</script>

<style scoped>
.uniapp-video {
  width: 100%;
  height: 100%;
}
</style>
