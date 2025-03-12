<template>
  <div class="profile-container">
    <div class="profile-content">
      <!-- 左侧个人信息 -->
      <div class="profile-sidebar">
        <user-profile-card :user="userInfo" />
      </div>

      <!-- 右侧内容区 -->
      <div class="profile-main">
        <!-- 最近活动 -->
        <a-card class="profile-card" :bordered="false">
          <template #title>
            <h3 class="card-title">最近活动</h3>
          </template>
          <div class="activity-list">
            <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
              <div class="activity-icon" :class="getActivityIconClass(activity.type)">
                <component :is="getActivityIcon(activity.type)" />
              </div>
              <div class="activity-content">
                <h4 class="activity-title">{{ activity.title }}</h4>
                <p class="activity-desc">{{ activity.description }}</p>
              </div>
              <div class="activity-time">
                <p class="time-day">{{ activity.day }}</p>
                <p class="time-hour">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </a-card>

        <!-- 收藏的菜谱 -->
        <a-card class="profile-card" :bordered="false">
          <template #title>
            <div class="card-header">
              <h3 class="card-title">收藏的菜谱</h3>
              <a-button type="link" class="view-all-btn" @click="goToFavorites">查看全部</a-button>
            </div>
          </template>
          <div class="profile-recipe-grid">
            <profile-recipe-card
                v-for="recipe in favoriteRecipes"
                :key="recipe.id"
                :recipe="recipe"
            />
          </div>
        </a-card>

        <!-- 烹饪成就 -->
        <a-card class="profile-card" :bordered="false">
          <template #title>
            <h3 class="card-title">烹饪成就</h3>
          </template>
          <div class="achievements-grid">
            <div
                v-for="(achievement, index) in achievements"
                :key="index"
                class="achievement-item"
                :class="{ 'achievement-unlocked': achievement.isUnlocked }"
            >
              <div class="achievement-icon">
                <component :is="achievement.icon" />
              </div>
              <h4 class="achievement-title">{{ achievement.title }}</h4>
              <p class="achievement-desc">{{ achievement.description }}</p>

              <div v-if="!achievement.isUnlocked && achievement.progress" class="achievement-progress">
                <a-progress
                    :percent="achievement.progress.percent"
                    :format="() => `${achievement.progress.current}/${achievement.progress.total}`"
                    size="small"
                    :stroke-color="{ from: '#fa8c16', to: '#ffa940' }"
                />
              </div>
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  UtensilsOutlined,
  ShoppingOutlined,
  AwardOutlined,
  ChefHatOutlined
} from '@/utils/icons'

import ProfileRecipeCard from '@/components/RecipeCard/ProfileRecipeCard.vue'
import UserProfileCard from '@/components/ProfileSidebar/index.vue'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 模拟数据 - 真实项目中应该从API获取
const recentActivities = ref([
  {
    type: 'cooking',
    title: '烹饪了 蒜蓉西兰花',
    description: '使用了 西兰花、大蒜等食材',
    day: '今天',
    time: '10:30'
  },
  {
    type: 'shopping',
    title: '添加了 猪肉',
    description: '添加了 1kg 猪肉到食材库',
    day: '昨天',
    time: '15:45'
  }
])

const favoriteRecipes = ref([
  {
    id: 1,
    title: '蒜蓉西兰花',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    tags: ['素食', '快手菜'],
    cookCount: 12,
    lastCooked: '2024-01-20'
  },
  {
    id: 2,
    title: '番茄炒蛋',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    tags: ['快手菜'],
    cookCount: 18,
    lastCooked: '2024-01-22'
  },
  {
    id: 3,
    title: '番茄炒蛋',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    tags: ['快手菜'],
    cookCount: 18,
    lastCooked: '2024-01-22'
  }
])

const achievements = ref([
  {
    icon: AwardOutlined,
    title: '烹饪达人',
    description: '累计烹饪超过100次',
    isUnlocked: true
  },
  {
    icon: ChefHatOutlined,
    title: '创意大厨',
    description: '创建10个原创菜谱',
    isUnlocked: false,
    progress: {
      current: 6,
      total: 10,
      percent: 60
    }
  }
])

// 获取活动图标组件
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'cooking':
      return UtensilsOutlined
    case 'shopping':
      return ShoppingOutlined
    default:
      return UtensilsOutlined
  }
}

// 获取活动图标类名
const getActivityIconClass = (type: string) => {
  switch (type) {
    case 'cooking':
      return 'icon-cooking'
    case 'shopping':
      return 'icon-shopping'
    default:
      return ''
  }
}

// 跳转到收藏页面
const goToFavorites = () => {
  router.push('/recipes/favorites')
}

// 初始化 - 在真实项目中应该从API获取数据
onMounted(() => {
  // 加载用户数据
  if (!userStore.isLoaded) {
    userStore.fetchUserInfo()
  }
})
</script>

<style scoped>
.profile-container {
  padding: 24px 0;
}

.profile-content {
  display: flex;
  gap: 32px;
}

.profile-sidebar {
  width: 320px;
  flex-shrink: 0;
}

.profile-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-all-btn {
  padding: 0;
  color: #fa8c16;
  font-size: 14px;
}

.view-all-btn:hover {
  color: #ffa940;
}

/* 活动列表样式 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 活动项目调整 */
.activity-item {
  padding: 16px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  transition: background-color 0.3s;
}
/* 成就项目调整 */
.activity-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}


/* 活动图标样式优化 */
.activity-icon {
  width: 48px;  /* 从48px增加到64px */
  height: 48px; /* 从48px增加到64px */
  border-radius: 10px; /* 稍微增加圆角半径 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  /* 增加图标内部大小 */
  font-size: 28px; /* 增加图标字体大小 */
}

/* 图标内部SVG尺寸调整 */
.activity-icon svg {
  width: 32px;
  height: 32px;
}

.icon-cooking {
  background-color: #fff7e6;
  color: #fa8c16;
}

.icon-shopping {
  background-color: #f6ffed;
  color: #52c41a;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 4px 0;
}

.activity-desc {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  margin: 0;
}

.activity-time {
  text-align: right;
  flex-shrink: 0;
}

.time-day {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 4px 0;
}

.time-hour {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  margin: 0;
}

/* 菜谱网格样式 */
/* 更新CSS样式部分，替换现有的.recipe-grid样式 */
.profile-recipe-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列网格布局 */
  gap: 16px;
  margin-top: 8px;
}

/* 响应式布局调整 */
@media (max-width: 1200px) {
  .profile-recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .profile-recipe-grid {
    grid-template-columns: 1fr; /* 小屏幕单列显示 */
  }
}

@media (min-width: 1400px) {
  .profile-recipe-grid {
    grid-template-columns: repeat(3, 1fr); /* 超大屏幕三列显示 */
  }
}

/* 成就网格样式 */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.achievement-item {
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.achievement-unlocked .achievement-icon {
  background-color: #fff7e6;
  color: #fa8c16;
}

/* 成就图标样式优化 */
.achievement-icon {
  width: 80px;  /* 从64px增加到80px */
  height: 80px; /* 从64px增加到80px */
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px; /* 稍微增加底部间距 */
  color: #bfbfbf;
  /* 增加图标内部大小 */
  font-size: 36px; /* 增加图标字体大小 */
}

/* 图标内部SVG尺寸调整 */
.achievement-icon svg {
  width: 40px;
  height: 40px;
}

/* 已解锁成就的图标增强效果 */
.achievement-unlocked .achievement-icon {
  background-color: #fff7e6;
  color: #fa8c16;
  box-shadow: 0 2px 8px rgba(250, 140, 22, 0.2); /* 添加轻微阴影增强视觉效果 */
}

.achievement-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 4px 0;
}

.achievement-desc {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin: 0 0 8px 0;
}

.achievement-progress {
  width: 100%;
  margin-top: 8px;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .achievements-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .profile-content {
    flex-direction: column;
  }

  .profile-sidebar {
    width: 100%;
  }

  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .recipe-grid,
  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>