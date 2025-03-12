<template>
  <div class="profile-nav">
    <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
    >
      <component :is="item.icon" class="nav-icon" />
      <span class="nav-text">{{ item.title }}</span>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import {QuestionCircleOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons-vue";


const route = useRoute()

// 导航项目
const navItems = [˚
  {
    title: '个人中心',
    path: '/profile',
    icon: UserOutlined
  },
  {
    title: '设置',
    path: '/settings',
    icon: SettingOutlined
  },
  {
    title: '帮助与反馈',
    path: '/help-feedback',
    icon: QuestionCircleOutlined
  }
]

// 判断当前路由是否激活
const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.profile-nav {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  color: rgba(0, 0, 0, 0.65);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: rgba(250, 140, 22, 0.05);
  color: #fa8c16;
}

.nav-item.active {
  background-color: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.nav-text {
  font-size: 14px;
}

/* 响应式调整 */
@media (max-width: 576px) {
  .profile-nav {
    padding: 8px;
  }

  .nav-item {
    padding: 8px;
  }

  .nav-icon {
    font-size: 20px;
    margin-bottom: 4px;
  }

  .nav-text {
    font-size: 12px;
  }
}
</style>