<!-- src/pages/user/UserLayout.vue -->
<template>
  <div class="user-layout">
    <div class="container">
      <a-row :gutter="24">
        <!-- 侧边栏 -->
        <a-col :span="6">
          <div class="user-sidebar">
            <div class="user-info">
              <a-avatar :size="80" :src="userInfo?.avatar" class="user-avatar">
                {{ userInfo?.username?.charAt(0).toUpperCase() }}
              </a-avatar>
              <h3 class="username">{{ userInfo?.username }}</h3>
              <p class="user-email">{{ userInfo?.email }}</p>
            </div>

            <a-menu
                mode="inline"
                v-model:selectedKeys="selectedKeys"
                class="user-menu"
            >
              <a-menu-item key="profile">
                <template #icon><user-outlined /></template>
                <router-link to="/user/profile">个人中心</router-link>
              </a-menu-item>
              <a-menu-item key="favorites">
                <template #icon><heart-outlined /></template>
                <router-link to="/user/favorites">我的收藏</router-link>
              </a-menu-item>
              <a-menu-item key="recipes">
                <template #icon><fire-outlined /></template>
                <router-link to="/user/recipes">我的菜谱</router-link>
              </a-menu-item>
              <a-menu-item key="settings">
                <template #icon><setting-outlined /></template>
                <router-link to="/user/settings">账号设置</router-link>
              </a-menu-item>
            </a-menu>
          </div>
        </a-col>

        <!-- 内容区域 -->
        <a-col :span="18">
          <div class="user-content">
            <router-view />
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  UserOutlined,
  HeartOutlined,
  FireOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'

// 获取用户信息
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 路由相关
const route = useRoute()
const selectedKeys = ref<string[]>(['profile'])

// 根据当前路由更新菜单选中状态
const updateSelectedKey = () => {
  const path = route.path
  if (path.includes('/user/profile')) selectedKeys.value = ['profile']
  else if (path.includes('/user/favorites')) selectedKeys.value = ['favorites']
  else if (path.includes('/user/recipes')) selectedKeys.value = ['recipes']
  else if (path.includes('/user/settings')) selectedKeys.value = ['settings']
}

// 监听路由变化
watch(() => route.path, updateSelectedKey, { immediate: true })
</script>

<style scoped>
.user-layout {
  padding: 32px 0;
  background-color: #f9f9f9;
  min-height: calc(100vh - 64px - 200px); /* 减去header和footer的高度 */
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.user-sidebar {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.user-info {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(to right, rgba(255, 153, 102, 0.1), rgba(255, 94, 98, 0.1));
}

.user-avatar {
  margin-bottom: 16px;
  background: linear-gradient(to right, var(--primary-gradient-start, #FF9966), var(--primary-gradient-end, #FF5E62));
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(255, 94, 98, 0.25);
}

.username {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.user-email {
  margin: 0;
  font-size: 13px;
  color: #999;
}

.user-menu {
  border-right: none;
}

.user-menu :deep(.ant-menu-item) {
  height: 48px;
  line-height: 48px;
  margin: 4px 0;
  border-radius: 0;
}

.user-menu :deep(.ant-menu-item a) {
  color: inherit;
  text-decoration: none;
}

.user-menu :deep(.ant-menu-item-selected) {
  background-color: rgba(240, 136, 76, 0.1);
  color: var(--primary-color, #F0884C);
  font-weight: 500;
}

.user-menu :deep(.ant-menu-item-selected::after) {
  border-right: 3px solid var(--primary-color, #F0884C);
}

.user-menu :deep(.ant-menu-item:hover) {
  color: var(--primary-color, #F0884C);
}

.user-menu :deep(.ant-menu-item-icon) {
  font-size: 18px;
}

.user-content {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  min-height: 500px;
}
</style>