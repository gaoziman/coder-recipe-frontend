<template>
  <div class="profile-nav">
    <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="handleNavClick(item.path)"
    >
      <component :is="item.icon" class="nav-icon" />
      <span class="nav-text">{{ item.title }}</span>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { QuestionCircleOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons-vue";

const route = useRoute()
const router = useRouter()

// 导航项目
const navItems = [
  {
    title: '个人中心',
    path: '/ProfileSidebar/profile',
    icon: UserOutlined
  },
  {
    title: '设置',
    path: '/settings',
    icon: SettingOutlined
  },
  {
    title: '帮助与反馈',
    path: '/help',
    icon: QuestionCircleOutlined
  }
]

// 判断当前路由是否激活
const isActive = (path: string) => {
  return route.path === path || route.path.includes(path);
}

// 添加导航点击处理函数
const handleNavClick = (path: string) => {
  router.push(path);
}
</script>