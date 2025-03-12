<template>
  <div class="user-profile-card">
    <div class="profile-header">
      <div class="avatar-container">
        <div class="avatar">
          {{ user.nickname.charAt(0) }}
        </div>
      </div>
      <h2 class="username">{{ user.nickname }}</h2>
      <p class="register-time">注册时间: {{ formatDate(user.registerTime) }}</p>
    </div>

    <div class="profile-stats">
      <div class="stat-item" @click="navigateTo('/recipes/my')">
        <span class="stat-label">我的菜谱</span>
        <span class="stat-value">{{ user.recipeCount || 32 }} 个</span>
      </div>

      <div class="stat-item" @click="navigateTo('/ingredients')">
        <span class="stat-label">食材库存</span>
        <span class="stat-value">{{ user.ingredientCount || 15 }} 种</span>
      </div>

      <div class="stat-item" @click="navigateTo('/cooking-history')">
        <span class="stat-label">本月烹饪</span>
        <span class="stat-value">{{ user.monthCookingCount || 28 }} 次</span>
      </div>
    </div>

    <div class="profile-actions">
      <button class="action-button" @click="navigateTo('/settings')">
        <icon-font type="icon-shezhi" class="button-icon" /> 设置
      </button>

      <button class="action-button" @click="navigateTo('/help')">
        <icon-font type="icon-bangzhufankui-" class="button-icon" /> 帮助与反馈
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { SCRIPT_URL } from '@/constants/iconfont.ts'
import {createFromIconfontCN} from "@ant-design/icons-vue";




interface UserProfileProps {
  user: {
    id: number | string
    nickname: string
    avatar?: string
    registerTime: string
    recipeCount?: number
    ingredientCount?: number
    monthCookingCount?: number
  }
}

const IconFont = createFromIconfontCN({
  scriptUrl: SCRIPT_URL,
})
const props = defineProps<UserProfileProps>()

const router = useRouter()

// 格式化日期
const formatDate = (dateString: string) => {
  return dayjs(dateString).format('YYYY-MM-DD')
}

// 页面导航
const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.user-profile-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: 100%;
  padding: 24px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.avatar-container {
  margin-bottom: 16px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5a623, #f56a00);
  color: white;
  font-size: 40px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  font-size: 24px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 8px 0;
}

.register-time {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin: 0;
}

.profile-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f5f5f5;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.stat-item:hover {
  background-color: #f0f0f0;
}

.stat-label {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.75);
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #f0f0f0;
}

/* 添加图标与文字间的间距 */
.button-icon {
  margin-right: 4px; /* 增加右侧间距 */
  font-size: 18px;
}

/* 响应式调整 */
@media (max-width: 576px) {
  .user-profile-card {
    padding: 20px;
  }

  .avatar {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }

  .username {
    font-size: 20px;
  }

  .stat-label,
  .stat-value,
  .action-button {
    font-size: 14px;
  }
}
</style>