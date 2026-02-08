<template>
  <view class="media-swiper-wrapper">
    <swiper
      :class="['media-swiper', customClass]"
      :current="currentSwiperIndex"
      :indicator-dots="showIndicator"
      :autoplay="autoplay && !hasPlayingVideo"
      :interval="interval"
      :duration="duration"
      :indicator-color="indicatorColor"
      :indicator-active-color="indicatorActiveColor"
      :circular="circular"
      @change="onSwiperChange"
      @transition="onTransition"
      @animationfinish="onAnimationFinish"
    >
      <swiper-item
        v-for="(item, index) in mediaList"
        :key="index"
        class="swiper-item"
      >
        <!-- 图片类型 -->
        <view v-if="item.type === 'image'" class="media-item image-item">
          <image
            class="media-image"
            :src="item.url"
            :mode="imageMode"
            @click="onImageClick(index)"
            @load="onImageLoad(index)"
            @error="onImageError(index)"
          />
        </view>

        <!-- 视频类型 -->
        <view v-else-if="item.type === 'video'" class="media-item video-item">
          <!-- 视频封面（未播放时显示） -->
          <view v-if="currentPlayingVideoIndex !== index" class="video-poster-wrapper">
            <image
              class="video-poster"
              :src="item.poster || item.thumbnail || defaultPoster"
              :mode="imageMode"
              @click="playVideo(index)"
            />
            <view class="play-btn-overlay">
              <view class="play-btn">
                <text class="play-icon">▶</text>
              </view>
            </view>
          </view>

          <!-- 视频播放器 -->
          <VideoPlayer
            v-else
            :key="`video-${index}`"
            class="video-player"
            :src="item.url"
            :poster="item.poster || item.thumbnail || defaultPoster"
            :player-type="videoPlayerType"
            :autoplay="true"
            :controls="true"
            :show-play-btn="true"
            :show-center-play-btn="false"
            :object-fit="videoObjectFit"
            @play="onVideoPlay(index)"
            @pause="onVideoPause(index)"
            @ended="onVideoEnd(index)"
            @error="onVideoError(index)"
          />
        </view>

        <!-- 自定义内容类型 -->
        <view v-else-if="item.type === 'custom'" class="media-item custom-item">
          <slot :name="`custom-${index}`" :item="item" :index="index"></slot>
        </view>
      </swiper-item>
    </swiper>

    <!-- 自定义指示器 -->
    <view v-if="customIndicator && mediaList.length > 1" class="custom-indicator">
      <view
        v-for="(item, index) in mediaList"
        :key="index"
        :class="['indicator-dot', { active: currentSwiperIndex === index }]"
        @click="slideTo(index)"
      >
        <text v-if="item.type === 'video'" class="indicator-icon">🎬</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import VideoPlayer from './VideoPlayer.vue'

/**
 * 媒体轮播组件
 *
 * 支持图片、视频混合轮播
 * 视频播放时暂停自动轮播
 * 视频播放结束后可自动恢复轮播
 */

// 媒体项类型定义
export interface MediaItem {
  type: 'image' | 'video' | 'custom'  // 媒体类型
  url: string                         // 资源URL
  poster?: string                     // 视频封面
  thumbnail?: string                  // 缩略图（同poster）
  title?: string                      // 标题
  [key: string]: any                  // 其他自定义字段
}

interface Props {
  // 媒体列表
  list: MediaItem[]

  // Swiper 基础配置
  autoplay?: boolean           // 自动轮播
  interval?: number            // 轮播间隔（ms）
  duration?: number            // 切换动画时长（ms）
  circular?: boolean           // 是否循环轮播
  current?: number             // 初始索引

  // 指示器配置
  showIndicator?: boolean      // 是否显示指示器
  customIndicator?: boolean    // 是否使用自定义指示器
  indicatorColor?: string      // 指示器颜色
  indicatorActiveColor?: string  // 当前指示器颜色

  // 图片配置
  imageMode?: 'aspectFill' | 'aspectFit' | 'widthFix' | 'heightFix' | 'scaleToFill'

  // 视频配置
  videoPlayerType?: string     // 视频播放器类型
  videoObjectFit?: 'contain' | 'fill' | 'cover'
  defaultPoster?: string       // 默认视频封面

  // 其他
  customClass?: string         // 自定义类名
  pauseOnHover?: boolean       // 鼠标悬停时暂停（仅H5）
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: true,
  interval: 5000,
  duration: 300,
  circular: true,
  current: 0,
  showIndicator: true,
  customIndicator: false,
  indicatorColor: 'rgba(255, 255, 255, 0.5)',
  indicatorActiveColor: '#ffffff',
  imageMode: 'aspectFill',
  videoPlayerType: 'uniapp',
  videoObjectFit: 'contain',
  defaultPoster: '',
  customClass: '',
  pauseOnHover: false
})

const emit = defineEmits([
  'change',           // swiper切换
  'transition',       // 过渡动画
  'animationFinish',  // 动画结束
  'imageClick',       // 图片点击
  'imageLoad',        // 图片加载完成
  'imageError',       // 图片加载错误
  'videoPlay',        // 视频播放
  'videoPause',       // 视频暂停
  'videoEnd',         // 视频播放结束
  'videoError'        // 视频错误
])

// 媒体列表
const mediaList = computed(() => props.list)

// 当前swiper索引
const currentSwiperIndex = ref(props.current)

// 当前播放视频的索引
const currentPlayingVideoIndex = ref(-1)

// 是否有视频正在播放
const hasPlayingVideo = computed(() => currentPlayingVideoIndex.value !== -1)

// 监听外部current变化
watch(() => props.current, (newVal) => {
  currentSwiperIndex.value = newVal
})

// Swiper 切换事件
const onSwiperChange = (e: any) => {
  currentSwiperIndex.value = e.detail.current
  emit('change', {
    index: e.detail.current,
    item: mediaList.value[e.detail.current]
  })

  // 如果切换到非视频页面，重置视频播放状态
  if (currentPlayingVideoIndex.value !== -1 && currentPlayingVideoIndex.value !== e.detail.current) {
    currentPlayingVideoIndex.value = -1
  }
}

// Swiper 过渡事件
const onTransition = (e: any) => {
  emit('transition', e)
}

// Swiper 动画结束事件
const onAnimationFinish = (e: any) => {
  emit('animationFinish', e)
}

// 图片点击
const onImageClick = (index: number) => {
  emit('imageClick', {
    index,
    item: mediaList.value[index]
  })
}

// 图片加载完成
const onImageLoad = (index: number) => {
  emit('imageLoad', {
    index,
    item: mediaList.value[index]
  })
}

// 图片加载错误
const onImageError = (index: number) => {
  emit('imageError', {
    index,
    item: mediaList.value[index]
  })
}

// 播放视频
const playVideo = (index: number) => {
  currentPlayingVideoIndex.value = index
  currentSwiperIndex.value = index
  emit('videoPlay', {
    index,
    item: mediaList.value[index]
  })
}

// 视频播放事件
const onVideoPlay = (index: number) => {
  emit('videoPlay', {
    index,
    item: mediaList.value[index]
  })
}

// 视频暂停事件
const onVideoPause = (index: number) => {
  emit('videoPause', {
    index,
    item: mediaList.value[index]
  })
}

// 视频播放结束
const onVideoEnd = (index: number) => {
  currentPlayingVideoIndex.value = -1
  emit('videoEnd', {
    index,
    item: mediaList.value[index]
  })

  // 视频播放结束后的行为
  if (props.autoplay) {
    // 延迟后切换到下一张
    setTimeout(() => {
      const nextIndex = (index + 1) % mediaList.value.length
      currentSwiperIndex.value = nextIndex
    }, 1000)
  }
}

// 视频错误
const onVideoError = (index: number) => {
  currentPlayingVideoIndex.value = -1
  emit('videoError', {
    index,
    item: mediaList.value[index]
  })
}

// 切换到指定索引
const slideTo = (index: number) => {
  currentSwiperIndex.value = index
}

// 暴露给父组件的方法
defineExpose({
  slideTo,
  playVideo,
  getCurrentIndex: () => currentSwiperIndex.value,
  getPlayingVideoIndex: () => currentPlayingVideoIndex.value
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.media-swiper-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  .media-swiper {
    width: 100%;
    height: 100%;

    .swiper-item {
      width: 100%;
      height: 100%;

      .media-item {
        width: 100%;
        height: 100%;

        &.image-item {
          .media-image {
            width: 100%;
            height: 100%;
            display: block;
          }
        }

        &.video-item {
          position: relative;
          background-color: #000000;

          .video-poster-wrapper {
            width: 100%;
            height: 100%;
            position: relative;

            .video-poster {
              width: 100%;
              height: 100%;
              display: block;
            }

            .play-btn-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: rgba(0, 0, 0, 0.3);

              .play-btn {
                width: 100rpx;
                height: 100rpx;
                background-color: rgba(0, 0, 0, 0.7);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;

                &:active {
                  transform: scale(0.9);
                }

                .play-icon {
                  font-size: 40rpx;
                  color: #ffffff;
                  margin-left: 6rpx;
                }
              }
            }
          }

          .video-player {
            width: 100%;
            height: 100%;
          }
        }

        &.custom-item {
          // 自定义内容样式
        }
      }
    }
  }

  .custom-indicator {
    position: absolute;
    bottom: 20rpx;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12rpx;
    z-index: 10;

    .indicator-dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.5);
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        background-color: #ffffff;
        transform: scale(1.2);
      }

      .indicator-icon {
        font-size: 20rpx;
      }
    }
  }
}
</style>
