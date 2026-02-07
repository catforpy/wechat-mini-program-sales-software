<template>
  <PageLayout :current-index="2">
    <view class="team-page">
      <view class="header">
        <text class="title">选择团队成员</text>
        <text class="subtitle">为小程序绑定客服</text>
      </view>

      <scroll-view scroll-y class="content-scroll" enable-flex>
        <view class="member-list">
          <view
            v-for="(member, index) in teamMembers"
            :key="member.id"
            class="member-item"
            @click="handleSelectMember(member)"
          >
            <view class="member-avatar">
              <text class="avatar-text">{{ member.name.charAt(0) }}</text>
            </view>

            <view class="member-info">
              <view class="info-top">
                <text class="member-name">{{ member.name }}</text>
                <text class="member-role">{{ getRoleText(member.role) }}</text>
              </view>
              <view class="info-bottom">
                <text class="member-phone">{{ member.phone }}</text>
                <text class="member-programs">已绑定 {{ member.bindCount }} 个小程序</text>
              </view>
            </view>

            <view class="member-arrow">
              <text class="arrow-icon">›</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import PageLayout from '../../../components/layout/PageLayout.vue'

// 团队成员接口
interface TeamMember {
  id: number
  name: string
  phone: string
  role: string
  bindCount: number
}

// 程序ID（从上一个页面传递过来）
const programId = ref<string>('')

// 团队成员列表 - 和首页的业务员名字保持一致
const teamMembers = ref<TeamMember[]>([
  { id: 1, name: '小张', phone: '138****1234', role: 'salesperson', bindCount: 2 },
  { id: 2, name: '小孙', phone: '139****5678', role: 'salesperson', bindCount: 1 },
  { id: 3, name: '小李', phone: '137****9012', role: 'salesperson', bindCount: 2 },
  { id: 4, name: '小周', phone: '136****3456', role: 'salesperson', bindCount: 1 },
  { id: 5, name: '小王', phone: '135****7890', role: 'salesperson', bindCount: 1 },
  { id: 6, name: '小郑', phone: '133****1111', role: 'salesperson', bindCount: 2 },
  { id: 7, name: '小冯', phone: '132****2222', role: 'salesperson', bindCount: 1 }
])

// 获取角色文本
const getRoleText = (role: string) => {
  const roleMap: Record<string, string> = {
    agent: '代理商',
    salesperson: '业务员',
    merchant: '商户'
  }
  return roleMap[role] || role
}

// 选择团队成员进行绑定
const handleSelectMember = (member: TeamMember) => {
  uni.showModal({
    title: '确认绑定',
    content: `确定要将小程序绑定给 ${member.name} 吗？`,
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用API绑定商户到小程序
        console.log('绑定小程序到成员:', {
          programId: programId.value,
          memberId: member.id,
          memberName: member.name
        })

        // 触发事件通知首页更新数据
        uni.$emit('programBindSuccess', {
          programId: parseInt(programId.value),
          newMemberName: member.name
        })

        uni.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 1500
        })

        // 延迟返回上一页
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  })
}

// 页面加载时获取参数
onMounted(() => {
  // 方法1: 使用 getCurrentInstance
  const instance = getCurrentInstance()
  console.log('当前实例:', instance)

  // @ts-ignore
  const params = instance?.proxy?.$page?.options || instance?.type?.props || {}
  console.log('从实例获取的参数:', params)

  // 方法2: 使用 getCurrentPages
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  console.log('当前页面:', currentPage)
  // @ts-ignore
  console.log('当前页面参数:', currentPage?.options || currentPage?.page?.options)

  // 尝试多种方式获取 programId
  // @ts-ignore
  programId.value = params.programId || currentPage?.options?.programId || currentPage?.page?.options?.programId || ''

  console.log('最终获取的 programId:', programId.value)
})
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.team-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: $bg-color;
}

.header {
  padding: $spacing-xl;
  background-color: #ffffff;
  border-bottom: 1rpx solid $border-color;

  .title {
    font-size: 48rpx;
    font-weight: bold;
    color: $text-color;
    display: block;
    margin-bottom: $spacing-xs;
  }

  .subtitle {
    font-size: $font-size-base;
    color: $text-color-secondary;
    display: block;
  }
}

.content-scroll {
  flex: 1;
  height: 0;
}

.member-list {
  padding: $spacing-md;
}

.member-item {
  display: flex;
  align-items: center;
  padding: $spacing-lg;
  background-color: #ffffff;
  border-radius: $border-radius-md;
  margin-bottom: $spacing-md;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:active {
    background-color: #f5f5f5;
    transform: scale(0.98);
  }
}

.member-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: $spacing-lg;

  .avatar-text {
    font-size: 40rpx;
    font-weight: bold;
    color: #ffffff;
  }
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.info-top {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.member-name {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $text-color;
}

.member-role {
  padding: 4rpx 12rpx;
  background-color: $primary-color;
  color: #ffffff;
  font-size: $font-size-xs;
  border-radius: 20rpx;
}

.info-bottom {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.member-phone {
  font-size: $font-size-sm;
  color: $text-color-secondary;
}

.member-programs {
  font-size: $font-size-sm;
  color: $primary-color;
}

.member-arrow {
  margin-left: $spacing-md;

  .arrow-icon {
    font-size: 48rpx;
    color: $text-color-secondary;
    font-weight: 300;
  }
}
</style>
