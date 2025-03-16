<!-- UserLayout.vue -->
<template>
  <div class="user-layout">
    <!-- 个人资料头部区域 -->
    <div class="profile-header bg-white rounded-xl overflow-hidden shadow-sm">
      <!-- 封面图区域 -->
      <div class="profile-cover">
        <button class="camera-btn">
          <camera-outlined />
        </button>
      </div>

      <!-- 用户信息区域 -->
      <div class="user-info-container">
        <!-- 头像部分 -->
        <div class="avatar-container">
          <a-avatar :size="120" :src="userInfo?.avatar" class="user-avatar">
            {{ userInfo?.username?.charAt(0).toUpperCase() || 'U' }}
          </a-avatar>
          <button class="avatar-camera-btn">
            <camera-outlined />
          </button>
        </div>

        <!-- 用户详情区域 -->
        <div class="user-details">
          <div class="user-identity">
            <h2 class="username">{{ userInfo?.username || '阳光厨房' }}</h2>
            <p class="user-bio">分享美食，传递快乐</p>
          </div>

          <a-button class="edit-btn">
            <template #icon><edit-outlined /></template>
            编辑资料
          </a-button>
        </div>
      </div>

      <!-- 统计数据部分 -->
      <div class="stats-container">
        <div class="stat-item">
          <p class="stat-number">{{ userStats.following || '56' }}</p>
          <p class="stat-label">关注</p>
        </div>
        <div class="stat-item">
          <p class="stat-number">{{ userStats.followers || '128' }}</p>
          <p class="stat-label">粉丝</p>
        </div>
        <div class="stat-item">
          <p class="stat-number">{{ userStats.recipes || '24' }}</p>
          <p class="stat-label">菜谱</p>
        </div>
        <div class="stat-item">
          <p class="stat-number">{{ userStats.likes || '1.2k' }}</p>
          <p class="stat-label">获赞</p>
        </div>
      </div>
    </div>

    <div class="profile-body">
      <a-row :gutter="24">
        <!-- 左侧导航菜单 -->
        <a-col :span="6">
          <!-- 第一个菜单卡片 -->
          <div class="sidebar-menu bg-white rounded-xl shadow-sm">
            <a-menu
                mode="inline"
                v-model:selectedKeys="selectedKeys"
                class="profile-menu"
            >
              <div class="menu-section">
                <a-menu-item key="profile" class="menu-item">
                  <template #icon><user-outlined /></template>
                  <router-link to="/user/profile">个人资料</router-link>
                </a-menu-item>
                <a-menu-item key="recipes" class="menu-item">
                  <template #icon><book-outlined /></template>
                  <router-link to="/user/recipes">我的菜谱</router-link>
                </a-menu-item>
                <a-menu-item key="favorites" class="menu-item">
                  <template #icon><heart-outlined /></template>
                  <router-link to="/user/favorites">我的收藏</router-link>
                </a-menu-item>
                <a-menu-item key="ingredients" class="menu-item">
                  <template #icon><shopping-outlined /></template>
                  <router-link to="/user/ingredients">食材管理</router-link>
                </a-menu-item>
                <a-menu-item key="shopping" class="menu-item">
                  <template #icon><shopping-cart-outlined /></template>
                  <router-link to="/user/shopping">购物清单</router-link>
                </a-menu-item>
                <a-menu-item key="statistics" class="menu-item">
                  <template #icon><bar-chart-outlined /></template>
                  <router-link to="/user/statistics">数据统计</router-link>
                </a-menu-item>
                <a-menu-item key="history" class="menu-item">
                  <template #icon><history-outlined /></template>
                  <router-link to="/user/history">浏览历史</router-link>
                </a-menu-item>
              </div>
            </a-menu>
          </div>

          <!-- 第二个菜单卡片 -->
          <div class="sidebar-menu bg-white rounded-xl shadow-sm mt-6">
            <a-menu mode="inline" class="profile-menu">
              <div class="menu-section">
                <!-- 将账号设置移到菜单内部 -->
                <div class="settings-title">账号设置</div>
                <a-menu-item key="security" class="menu-item">
                  <template #icon><lock-outlined /></template>
                  <router-link to="/user/security">安全设置</router-link>
                </a-menu-item>
                <a-menu-item key="notification" class="menu-item">
                  <template #icon><notification-outlined /></template>
                  <router-link to="/user/notification">通知设置</router-link>
                </a-menu-item>
                <a-menu-item key="privacy" class="menu-item">
                  <template #icon><safety-outlined /></template>
                  <router-link to="/user/privacy">隐私设置</router-link>
                </a-menu-item>
                <a-menu-item key="logout" class="menu-item">
                  <template #icon><logout-outlined /></template>
                  <router-link to="/logout">退出登录</router-link>
                </a-menu-item>
              </div>
            </a-menu>
          </div>
        </a-col>

        <!-- 右侧内容区域 -->
        <a-col :span="18">
          <div class="content-area bg-white rounded-xl shadow-sm">
            <router-view />
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  UserOutlined,
  EditOutlined,
  HeartOutlined,
  BookOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  HistoryOutlined,
  LockOutlined,
  NotificationOutlined,
  SafetyOutlined,
  LogoutOutlined,
  CameraOutlined
} from '@ant-design/icons-vue'

// 获取用户信息
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 用户统计数据
const userStats = reactive({
  following: '56',
  followers: '128',
  recipes: '24',
  likes: '1.2k'
})

// 路由相关
const route = useRoute()
const selectedKeys = ref<string[]>(['profile'])

// 根据当前路由更新菜单选中状态
const updateSelectedKey = () => {
  const path = route.path
  if (path.includes('/user/profile')) selectedKeys.value = ['profile']
  else if (path.includes('/user/recipes')) selectedKeys.value = ['recipes']
  else if (path.includes('/user/favorites')) selectedKeys.value = ['favorites']
  else if (path.includes('/user/ingredients')) selectedKeys.value = ['ingredients']
  else if (path.includes('/user/shopping')) selectedKeys.value = ['shopping']
  else if (path.includes('/user/statistics')) selectedKeys.value = ['statistics']
  else if (path.includes('/user/history')) selectedKeys.value = ['history']
  else if (path.includes('/user/security')) selectedKeys.value = ['security']
  else if (path.includes('/user/notification')) selectedKeys.value = ['notification']
  else if (path.includes('/user/privacy')) selectedKeys.value = ['privacy']
}

// 监听路由变化
watch(() => route.path, updateSelectedKey, { immediate: true })
</script>

<style scoped>
.user-layout {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
  background-color: #FFF8F0;
  min-height: calc(100vh - 64px);
}

/* 个人资料头部 */
.profile-header {
  margin-bottom: 24px;
  overflow: hidden;
  border-radius: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 封面图 */
.profile-cover {
  height: 200px;
  background-image: url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=1920&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
}

.camera-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.camera-btn:hover {
  background-color: rgba(255, 255, 255, 1);
}

/* 用户信息区域 */
.user-info-container {
  padding: 0 24px;
  background-color: white;
  display: flex;
  align-items: flex-start;
  position: relative;
}

.avatar-container {
  position: relative;
  margin-top: -60px;
  margin-right: 24px;
}

.user-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background: linear-gradient(to right, #FF9966, #FF5E62);
  color: white;
  font-weight: 600;
}

.avatar-camera-btn {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: white;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  font-size: 14px;
}

/* 用户详情 */
.user-details {
  padding-top: 20px;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.username {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.user-bio {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
}

.edit-btn {
  border-color: #FF9966;
  color: #FF9966;
  background-color: transparent;
  border-radius: 20px;
  height: 36px;
  padding: 0 16px;
  transition: all 0.3s;
}

.edit-btn:hover {
  background-color: #FFEBE0;
  border-color: #FF9966;
  color: #FF9966;
}

/* 统计数据 */
.stats-container {
  display: flex;
  padding: 16px 24px 24px;
  gap: 40px;
  background-color: white;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 主体区域 */
.profile-body {
  margin-top: 24px;
}

/* 确保左右卡片对齐 */
.profile-body .ant-row {
  display: flex;
  align-items: flex-start;
}

/* 侧边栏菜单容器 */
.sidebar-menu {
  border-radius: 32px;
  overflow: hidden;
  padding: 16px 0;
  margin-bottom: 16px;
}

/* 菜单内部区域 */
.menu-section {
  padding: 8px 16px;
}

.settings-title {
  font-weight: 600;
  color: #333;
  padding: 12px 16px 16px 16px;
  font-size: 16px;
}

.profile-menu {
  border-right: none;
}

/* 菜单项样式 */
.menu-item {
  border-radius: 20px !important;
  margin: 4px 0 !important;
  padding-left: 20px !important;
}

.profile-menu :deep(.ant-menu-item) {
  height: 48px;
  line-height: 48px;
}

.profile-menu :deep(.ant-menu-item a) {
  color: inherit;
  text-decoration: none;
}

.profile-menu :deep(.ant-menu-item-selected) {
  background-color: #F8ECE0 !important;
  color: #FF9966;
  font-weight: 500;
  border-radius: 20px !important;
  border-left: 3px solid #FF9966;
}

/* 移除右侧边框 */
.profile-menu :deep(.ant-menu-item-selected::after) {
  border-right: none !important;
}

.profile-menu :deep(.ant-menu-item:hover) {
  color: #FF9966;
}

.profile-menu :deep(.ant-menu-item-icon) {
  font-size: 18px;
}

/* 内容区域 - 调整对齐 */
.content-area {
  padding: 24px;
  min-height: 600px;
  border-radius: 32px;
  margin-top: 0; /* 确保与左侧对齐 */
}

/* 响应式调整 */
@media (max-width: 768px) {
  .user-info-container {
    flex-direction: column;
    align-items: center;
  }

  .avatar-container {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .user-details {
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
  }

  .edit-btn {
    margin-top: 16px;
  }

  .stats-container {
    justify-content: center;
  }

  .sidebar-menu, .content-area {
    border-radius: 24px;
  }
}
</style>