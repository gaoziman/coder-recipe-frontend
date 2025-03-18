<template>
  <a-layout-header class="app-header">
    <div class="container header-content">
      <div class="logo-area">
        <router-link to="/" class="logo-link">
          <span class="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3L17 9L21 10L17 12L15 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 3L7 9L3 10L7 12L9 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
          <h1 class="logo-text">味见好时光</h1>
        </router-link>
      </div>

      <div class="navigation-buttons">
        <router-link to="/" class="nav-button" :class="{ active: currentRoutePath === '/' }">首页</router-link>
        <router-link to="/recipes" class="nav-button" :class="{ active: currentRoutePath.startsWith('/recipes') }">菜谱</router-link>
        <router-link to="/ai" class="nav-button" :class="{ active: currentRoutePath.startsWith('/ai') }">AI搭配</router-link>
        <router-link to="/collections" class="nav-button" :class="{ active: currentRoutePath.startsWith('/collections') }">合集</router-link>
        <router-link to="/tips" class="nav-button" :class="{ active: currentRoutePath.startsWith('/tips') }">烹饪技巧</router-link>

        <!-- 管理员导航下拉菜单 - 仅对管理员显示 -->
        <div class="admin-dropdown" v-if="isAdmin">
          <div class="admin-link">
            <span class="admin-text">管理中心</span>
          </div>
          <div class="admin-dropdown-panel">
            <div class="admin-menu-wrapper">
              <router-link to="/admin/dashboard" class="admin-menu-item">
                <dashboard-outlined class="admin-item-icon" />
                <span>控制台</span>
              </router-link>
              <router-link to="/admin/users" class="admin-menu-item">
                <team-outlined class="admin-item-icon" />
                <span>用户管理</span>
              </router-link>
              <router-link to="/admin/ingredients" class="admin-menu-item">
                <database-outlined class="admin-item-icon" />
                <span>食材管理</span>
              </router-link>
              <router-link to="/admin/recipes" class="admin-menu-item">
                <appstore-outlined class="admin-item-icon" />
                <span>菜谱管理</span>
              </router-link>
              <router-link to="/admin/categories" class="admin-menu-item">
                <folder-outlined class="admin-item-icon" />
                <span>分类管理</span>
              </router-link>
              <router-link to="/admin/tags" class="admin-menu-item">
                <tag-outlined class="admin-item-icon" />
                <span>标签管理</span>
              </router-link>
              <router-link to="/admin/tips" class="admin-menu-item">
                <bulb-outlined class="admin-item-icon" />
                <span>贴士管理</span>
              </router-link>
              <router-link to="/admin/systemSettings" class="admin-menu-item">
                <bulb-outlined class="admin-item-icon" />
                <span>系统管理</span>
              </router-link>
              <router-link to="/admin/contentReview" class="admin-menu-item">
                <bulb-outlined class="admin-item-icon" />
                <span>审核管理</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <!-- 搜索框 -->
        <div class="search-area">
          <input type="text" placeholder="搜索菜谱、食材..." v-model="searchText" @keyup.enter="handleSearch" />
          <button class="search-button" @click="handleSearch">
            <search-outlined />
          </button>
        </div>

        <!-- 用户区域 - 未登录 -->
        <template v-if="!isLoggedIn">
          <a-button class="login-btn" @click="showLogin">登录</a-button>
        </template>

        <!-- 用户区域 - 已登录 (使用hover触发) -->
        <template v-else>
          <div class="user-dropdown">
            <div class="avatar-container">
              <a-avatar
                  :src="userInfo?.avatar"
                  :size="32"
                  class="avatar">
                {{ userInfo?.username?.charAt(0).toUpperCase() }}
              </a-avatar>
              <span class="user-name">{{ userInfo?.username || 'user' }}</span>
            </div>

            <div class="dropdown-panel">
              <div class="menu-item-wrapper">
                <router-link to="/user/profile" class="menu-item profile-item">
                  <user-outlined class="item-icon" />
                  <span>个人中心</span>
                </router-link>
                <div class="menu-item logout-item" @click="handleLogout">
                  <logout-outlined class="item-icon" />
                  <span>退出登录</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </a-layout-header>

  <!-- 引入AuthModal组件 -->
  <auth-modal ref="authModalRef" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import AuthModal from '@/components/auth/AuthModal.vue'
import {
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons-vue'

// 路由相关
const router = useRouter()
const route = useRoute()

// 添加管理员状态判断
const isAdmin = computed(() => userStore.userInfo.isAdmin)

// 当前路由路径
const currentRoutePath = computed(() => route.path)

// 用户状态管理
const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo)

// 搜索文本
const searchText = ref('')

// 认证模态框引用
const authModalRef = ref()

// 显示登录弹窗
const showLogin = () => {
  authModalRef.value?.showLogin()
}

// 处理登出
const handleLogout = () => {
  userStore.logout()
  message.success('您已成功退出登录')

  // 如果当前在需要登录的页面，则跳转到首页
  const requiresAuth = route.meta.requiresAuth
  if (requiresAuth) {
    router.push('/')
  }
}

// 处理搜索
const handleSearch = () => {
  if (!searchText.value.trim()) return

  router.push({
    path: '/search',
    query: { q: searchText.value.trim() }
  })

  searchText.value = ''
}

// 添加一个空白div以防止内容被固定导航栏覆盖
onMounted(() => {
  const appHeader = document.querySelector('.app-header')
  const headerHeight = appHeader?.clientHeight || 64

  // 创建或更新占位元素
  let spacer = document.querySelector('.header-spacer')

  if (!spacer) {
    spacer = document.createElement('div')
    spacer.className = 'header-spacer'
    document.body.insertBefore(spacer, document.body.firstChild)
  }

  // 确保高度正确
  spacer.style.height = `${headerHeight}px`
  // 重要：确保没有额外的边距
  spacer.style.margin = '0'
  spacer.style.padding = '0'
})
</script>

<style scoped>
.app-header {
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  padding: 0;
  height: 64px;
  line-height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo-area {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.logo-link:hover {
  transform: scale(1.02);
}

.logo-icon {
  display: flex;
  align-items: center;
  color: var(--primary-color, #F0884C);
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--primary-color, #F0884C);
}

/* 导航按钮 */
.navigation-buttons {
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 0 auto;
}

.nav-button {
  height: 38px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 19px;
  transition: all 0.25s;
}

.nav-button:hover {
  color: #F0884C;
  background-color: rgba(255, 153, 102, 0.08);
}

.nav-button.active {
  color: white;
  background: linear-gradient(to right, #FF9966, #FF5E62);
  box-shadow: 0 2px 8px rgba(255, 94, 98, 0.25);
}

/* 头部操作区 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 搜索区域 */
.search-area {
  position: relative;
  width: 250px;
}

.search-area input {
  width: 100%;
  height: 36px;
  border-radius: 18px;
  border: 1px solid #f0f0f0;
  background-color: #f8f8f8;
  padding: 0 36px 0 16px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: all 0.2s;
}

.search-area input:focus {
  border-color: #ddd;
  background-color: white;
}

.search-area input::placeholder {
  color: #aaa;
}

.search-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  color: #bbb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.search-button:hover {
  color: #666;
}

/* 登录按钮 */
.login-btn {
  border-radius: 18px;
  height: 36px;
  padding: 0 20px;
  font-size: 14px;
  border: 1px solid var(--primary-color, #F0884C);
  color: var(--primary-color, #F0884C);
  background: transparent;
  transition: all 0.25s;
}

.login-btn:hover {
  background-color: rgba(240, 136, 76, 0.05);
  transform: translateY(-1px);
}

/* =========== 带光标手型和浅橙色背景的用户头像和下拉菜单 =========== */
.user-dropdown {
  position: relative;
  height: 64px;
  display: flex;
  align-items: center;
}

.avatar-container {
  display: flex;
  align-items: center;
  cursor: pointer; /* 默认为手型光标 */
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.avatar-container:hover {
  background-color: #f9f9f9;
}

.avatar {
  background: linear-gradient(120deg, #FF9966, #FF5E62);
  color: white;
  font-weight: 500;
  font-size: 14px;
  border: none;
}

.user-name {
  font-size: 14px;
  font-weight: normal;
  color: #666;
  margin: 0 6px 0 8px;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow {
  font-size: 10px;
  color: #aaa;
  transition: transform 0.2s;
}

.user-dropdown:hover .arrow {
  transform: rotate(180deg);
  color: #999;
}

/* 下拉菜单面板 */
.dropdown-panel {
  position: absolute;
  top: 56px;
  right: 0;
  background: white;
  width: 130px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  z-index: 100;

  /* 默认隐藏 */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.2s ease;
}

/* 显示下拉菜单 */
.user-dropdown:hover .dropdown-panel {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.menu-item-wrapper {
  padding: 4px;
}

/* 菜单项基本样式 */
.menu-item {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 12px;
  font-size: 13px;
  color: #555;
  text-decoration: none;
  transition: all 0.15s;
  border-radius: 4px;
  cursor: pointer; /* 确保所有菜单项都有手型光标 */
}

/* 个人中心项样式 */
.profile-item:hover {
  background-color: #f5f5f5;
  color: #FF5E62;
}

/* 退出登录项样式 - 添加浅橙色背景 */
.logout-item:hover {
  background-color: rgba(255, 153, 102, 0.15); /* 浅橙色背景 */
  color: #FF5E62;
}

.item-icon {
  font-size: 14px;
  color: #999;
  margin-right: 6px;
}

.profile-item:hover .item-icon,
.logout-item:hover .item-icon {
  color: #FF5E62;
}

/* 特别为退出登录项添加红色图标颜色 */
.logout-item:hover .item-icon {
  color: #FF5E62;
}
/* 管理员下拉菜单样式 */
.admin-dropdown {
  position: relative;
  height: 64px;
  display: flex;
  align-items: center;
}

.admin-link {
  height: 38px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  border-radius: 19px;
  transition: all 0.25s;
  cursor: pointer;
}

.admin-link:hover {
  color: #F0884C;
  background-color: rgba(255, 153, 102, 0.08);
}

.admin-text {
  margin-right: 4px;
}

.admin-arrow {
  font-size: 12px;
  color: #aaa;
  transition: transform 0.2s;
}

.admin-dropdown:hover .admin-arrow {
  transform: rotate(180deg);
  color: #999;
}

/* 管理员下拉面板 */
.admin-dropdown-panel {
  position: absolute;
  top: 56px;
  left: 0;
  background: white;
  width: 160px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  z-index: 100;

  /* 默认隐藏 */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: all 0.2s ease;
}

/* 显示下拉菜单 */
.admin-dropdown:hover .admin-dropdown-panel {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.admin-menu-wrapper {
  padding: 4px;
}

/* 菜单项样式 */
.admin-menu-item {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 12px;
  font-size: 13px;
  color: #555;
  text-decoration: none;
  transition: all 0.15s;
  border-radius: 4px;
  cursor: pointer;
}

.admin-menu-item:hover {
  background-color: rgba(255, 153, 102, 0.15);
  color: #FF5E62;
}

.admin-item-icon {
  font-size: 14px;
  color: #999;
  margin-right: 8px;
}

.admin-menu-item:hover .admin-item-icon {
  color: #FF5E62;
}
</style>