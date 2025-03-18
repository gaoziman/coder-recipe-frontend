<template>
  <a-layout class="admin-layout">
    <!-- 侧边栏 -->
    <a-layout-sider
        class="admin-sider"
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        width="220"
    >
      <!-- Logo区域 -->
      <div class="admin-logo">
        <router-link to="/" class="logo-link">
          <span class="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3L17 9L21 10L17 12L15 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 3L7 9L3 10L7 12L9 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
          <span v-if="!collapsed" class="admin-logo-text">味见管理后台</span>
        </router-link>
      </div>

      <!-- 菜单区域 -->
      <a-menu
          class="admin-menu"
          mode="inline"
          :selectedKeys="[currentRoute]"
          theme="light"
          @select="handleMenuSelect"
      >
        <a-menu-item key="/admin/dashboard">
          <template #icon><dashboard-outlined /></template>
          <span v-if="!collapsed">控制台</span>
        </a-menu-item>

        <a-menu-item key="/admin/users">
          <template #icon><team-outlined /></template>
          <span v-if="!collapsed">用户管理</span>
        </a-menu-item>

        <a-menu-item key="/admin/ingredients">
          <template #icon><database-outlined /></template>
          <span v-if="!collapsed">食材管理</span>
        </a-menu-item>

        <a-menu-item key="/admin/recipes">
          <template #icon><appstore-outlined /></template>
          <span v-if="!collapsed">菜谱管理</span>
        </a-menu-item>

        <a-menu-item key="/admin/categories">
          <template #icon><folder-outlined /></template>
          <span v-if="!collapsed">分类管理</span>
        </a-menu-item>

        <a-menu-item key="/admin/tags">
          <template #icon><tag-outlined /></template>
          <span v-if="!collapsed">标签管理</span>
        </a-menu-item>

        <a-menu-item key="/admin/tips">
          <template #icon><bulb-outlined /></template>
          <span v-if="!collapsed">贴士管理</span>
        </a-menu-item>

        <a-menu-item key="/admin/systemSettings">
          <template #icon><bulb-outlined /></template>
          <span v-if="!collapsed">系统管理</span>
        </a-menu-item>

        <a-menu-item key="/admin/contentReview">
          <template #icon><bulb-outlined /></template>
          <span v-if="!collapsed">审核管理</span>
        </a-menu-item>

      </a-menu>
    </a-layout-sider>

    <!-- 主要内容区域 -->
    <a-layout class="main-container" :style="{ marginLeft: collapsed ? '80px' : '220px' }">
      <!-- 顶部导航栏 -->
      <a-layout-header class="admin-header">
        <div class="admin-header-left">
          <!-- 折叠按钮 -->
          <menu-fold-outlined
              v-if="!collapsed"
              class="trigger"
              @click="toggleCollapsed"
          />
          <menu-unfold-outlined
              v-else
              class="trigger"
              @click="toggleCollapsed"
          />
          <span class="admin-header-title">{{ currentPageTitle }}</span>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="admin-content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  FolderOutlined,
  TagOutlined,
  BulbOutlined,
  DatabaseOutlined,
  TeamOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

// 侧边栏折叠状态
const collapsed = ref(false)

// 切换侧边栏状态
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

// 当前路由路径
const currentRoute = computed(() => route.path)

// 当前页面标题
const currentPageTitle = computed(() => {
  const currentMeta = route.meta
  return currentMeta?.title || '管理中心'
})

// 处理菜单选择事件
const handleMenuSelect = ({ key }) => {
  router.push(key)
}
</script>

<style scoped>
/* 整体布局 */
.admin-layout {
  min-height: 100vh;
}

/* 侧边栏样式 */
.admin-sider {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #fff !important;
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  z-index: 1000; /* 增加 z-index 值 */
}

:deep(.app-footer) {
  position: relative;
  z-index: 1; /* 较低的 z-index */
}

/* Logo区域样式 */
.admin-logo {
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.admin-logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #F0884C;
  white-space: nowrap;
  transition: all 0.3s;
}

/* 主内容区样式 */
.main-container {
  background: #FFF8F5 !important; /* 强制使用淡橙色背景 */
  transition: all 0.3s;
}

/* 顶部导航栏样式 */
.admin-header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 9;
}

.admin-header-left {
  display: flex;
  align-items: center;
}

.admin-header-title {
  margin-left: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.trigger:hover {
  color: #F0884C;
}

/* 内容区域样式 */
.admin-content {
  margin: 24px;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 112px);
  background: transparent; /* 确保内容区域背景透明，显示下层背景 */
}

.content-wrapper {
  background: #FFF8F5; /* 与主容器背景一致 */
  border-radius: 8px;
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: none; /* 移除阴影，避免与背景冲突 */
}

/* 子页面卡片样式 */
:deep(.content-card) {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(240, 136, 76, 0.08);
  flex: 1;
}

:deep(.ant-card) {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(240, 136, 76, 0.08);
}

/* 确保页面主体背景 */
:deep(.ant-layout) {
  background: transparent;
}

:deep(.ant-layout-content) {
  background: transparent;
}

/* 调整表格背景 */
:deep(.ant-table) {
  background: #fff;
}



/* 菜单覆盖样式 */
:deep(.ant-menu) {
  background: #fff;
  border-right: none;
}

:deep(.ant-menu-item-selected) {
  background-color: rgba(255, 153, 102, 0.15) !important;
}

:deep(.ant-menu-item-selected a),
:deep(.ant-menu-item-selected) {
  color: #F0884C !important;
}

:deep(.ant-menu-item:hover) {
  color: #F0884C !important;
}

:deep(.ant-menu-vertical .ant-menu-item::after),
:deep(.ant-menu-inline .ant-menu-item::after) {
  border-right: 3px solid #F0884C !important;
}
</style>