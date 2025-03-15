<template>
  <a-layout-header class="header">
    <div class="header-content">
      <div class="left">
        <h1 class="logo">
          <span class="logo-text">味见好时光</span>
        </h1>
        <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="horizontal"
            :items="menuItems"
            class="custom-menu"
            @click="handleMenuClick"
        />
      </div>
      <div class="right">
        <a-input-search
            placeholder="搜索菜谱、食材或烹饪技巧..."
            style="width: 250px"
            @search="onSearch"
            class="custom-search"
        >
          <template #enterButton>
            <search-outlined />
          </template>
        </a-input-search>
        <!-- 新建菜谱 -->
        <a-button type="primary"
                  class="auth-login-btn"
                  @click="onAddRecipe">
          <template #icon><plus-outlined /></template>
          新建菜谱
        </a-button>

        <!-- 用户未登录显示登录按钮 -->
        <a-button v-if="!userStore.isLoggedIn"
                  type="primary"
                  class="auth-login-btn"
                  @click="showLoginModal">
          <template #icon><user-outlined /></template>
          登录
        </a-button>

        <!-- 用户已登录显示头像和下拉菜单 -->
        <a-dropdown v-else placement="bottomRight">
          <a-avatar
              class="user-avatar"
              :src="userStore.userInfo?.avatarUrl || userStore.userInfo?.avatar">
            <template #icon v-if="!userStore.userInfo?.avatarUrl && !userStore.userInfo?.avatar">
              <user-outlined />
            </template>
          </a-avatar>
          <template #overlay>
            <a-menu class="dropdown-menu">
              <a-menu-item key="profile" @click="goToUserProfile">
                <user-outlined  style="margin-right: 4px;" />
                <span>个人中心</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="handleLogout">
                <logout-outlined  style="margin-right: 4px; color: #ff4d4f;"/>
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    <AuthModal ref="authModalRef" />
  </a-layout-header>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { IMenuItem } from '@/types'
import AuthModal from '@/components/AuthModal/index.vue'
import { message } from 'ant-design-vue'

const router = useRouter()
const userStore = useUserStore()

const selectedKeys = ref<string[]>(['home'])

// 在组件setup部分添加
const authModalRef = ref<InstanceType<typeof AuthModal> | null>(null)

const menuItems: IMenuItem[] = [
  {
    key: 'home',
    label: '首页'
  },
  {
    key: 'recipes',
    label: '我的菜谱'
  },
  {
    key: 'ingredients',
    label: '食材管理'
  },
  {
    key: 'shopping',
    label: '购物清单'
  },
  {
    key: 'statistics',
    label: '数据统计'
  }
]

const onSearch = (value: string) => {
  console.log('search:', value)
}

const onAddRecipe = () => {
  // 如果未登录，先弹出登录框
  if (!userStore.isLoggedIn) {
    showLoginModal()
    return
  }
  router.push('/recipes/add')
}

// 显示登录模态框
const showLoginModal = () => {
  authModalRef.value?.showLoginModal()
}

const handleMenuClick = (e: { key: string }) => {
  switch(e.key) {
    case 'home':
      router.push('/');
      break;
    case 'recipes':
      router.push('/recipes');
      break;
    case 'ingredients':
      router.push('/ingredients');
      break;
    case 'shopping':
      router.push('/shopping');
      break;
    case 'statistics':
      router.push('/statistics');
      break;
    default:
      router.push('/');
  }
}

// 修改goToUserProfile方法
const goToUserProfile = () => {
  router.push('/ProfileSidebar/profile')
}

// 添加退出登录方法
const handleLogout = () => {
  userStore.logout()
  message.success('退出登录成功')

  // 如果当前页面需要登录才能访问，则重定向到首页
  const currentRoute = router.currentRoute.value
  if (currentRoute.meta?.requiresAuth) {
    router.push('/')
  }
}
</script>

<style scoped>
.header {
  background: #fff;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: fixed;
  width: 100%;
  z-index: 1000;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
}

.left {
  display: flex;
  align-items: center;
}

.logo {
  margin: 0 48px 0 0;
  font-size: 20px;
  font-weight: bold;
  color: #262626;
}

.right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 修改新建菜谱按钮颜色为橙色，添加圆角 */
.add-recipe {
  background: #fa8c16 !important;
  border-color: #fa8c16 !important;
  border-radius: 4px;
  height: 32px;
  padding: 0 16px;
  font-size: 14px;
}

.add-recipe:hover {
  background: #fa9d32 !important;
  border-color: #fa9d32 !important;
}

/* 登录按钮样式 */
.login-btn {
  color: #fa8c16 !important;
  font-weight: 500;
  font-size: 14px;
}

.login-btn:hover {
  color: #fa9d32 !important;
}

/* 基础菜单容器样式 */
.custom-menu {
  border-bottom: none !important;
  position: relative;
}

.custom-menu:deep(.ant-menu-horizontal) {
  border-bottom: none;
}

/* 菜单项基础样式 */
.custom-menu :deep(.ant-menu-item) {
  padding: 0 16px;
  margin: 0 4px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 15px;
  transition: all 0.3s ease;
  border-bottom: none !important;
  position: relative;
}

/* 菜单项悬停效果 */
.custom-menu :deep(.ant-menu-item:hover) {
  color: #fa8c16;
  border-bottom-color: transparent !important;
}

/* 选中菜单项样式 */
.custom-menu :deep(.ant-menu-item-selected) {
  color: #fa8c16 !important;
  font-weight: 500;
  border-bottom-color: transparent !important;
}

/* 创建圆点指示器样式 */
.custom-menu :deep(.ant-menu-item)::before {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  width: 0;
  height: 3px;
  background-color: #fa8c16;
  border-radius: 3px;
  transform: translateX(-50%);
  opacity: 0;
  transition: width 0.3s ease, opacity 0.3s ease;
}

.custom-menu :deep(.ant-menu-item:hover)::before {
  width: 12px;
  opacity: 0.5;
}

.custom-menu :deep(.ant-menu-item-selected)::before {
  width: 24px;
  opacity: 1;
}

/* 添加顶部微妙指示器 */
.custom-menu :deep(.ant-menu-item)::after {
  content: '';
  position: absolute;
  top: 6px;
  left: 50%;
  width: 0;
  height: 3px;
  background-color: #fa8c16;
  border-radius: 3px;
  transform: translateX(-50%);
  opacity: 0;
  transition: width 0.3s ease, opacity 0.3s ease;
}

.custom-menu :deep(.ant-menu-item-selected)::after {
  width: 12px;
  opacity: 0.5;
}

/* 覆盖所有Ant Design默认样式 */
:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item::after),
:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-active::after),
:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-open::after),
:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected::after),
:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover::after),
:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu::after),
:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-active::after),
:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-open::after),
:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected::after),
:deep(.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover::after) {
  border-bottom: none !important;
  background-color: transparent !important;
}

/* 添加文字阴影和微妙缩放效果 */
.custom-menu :deep(.ant-menu-item-selected) span {
  display: inline-block;
  transform: scale(1.05);
  text-shadow: 0 0 0.5px rgba(250, 140, 22, 0.3);
  transition: transform 0.3s ease;
}

/* 创建轻微的背景效果 */
.custom-menu :deep(.ant-menu-item) {
  overflow: hidden;
}

.custom-menu :deep(.ant-menu-item)::before {
  content: '';
  position: absolute;
  top: auto;
  bottom: 6px;
  left: 50%;
  width: 0;
  height: 3px;
  background-color: #fa8c16;
  border-radius: 3px;
  transform: translateX(-50%);
  transition: width 0.3s ease;
  z-index: 1;
}

.custom-menu :deep(.ant-menu-item-selected)::before {
  width: 24px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .custom-menu :deep(.ant-menu-item) {
    padding: 0 12px;
    margin: 0 2px;
  }

  .custom-menu :deep(.ant-menu-item-selected)::before {
    width: 20px;
  }

  .custom-menu :deep(.ant-menu-item-selected)::after {
    width: 10px;
  }
}

@media (max-width: 576px) {
  .custom-menu :deep(.ant-menu-item) {
    padding: 0 8px;
    margin: 0 1px;
    font-size: 14px;
  }

  .custom-menu :deep(.ant-menu-item-selected)::before {
    width: 16px;
  }

  .custom-menu :deep(.ant-menu-item-selected)::after {
    width: 8px;
  }

  .custom-menu :deep(.ant-menu-item-selected) span {
    transform: scale(1.03);
  }
}

/* 修改搜索按钮颜色为橙色 */
.custom-search :deep(.ant-btn-primary) {
  background-color: #fa8c16 !important;
  border-color: #fa8c16 !important;
}

.custom-search :deep(.ant-btn-primary:hover) {
  background-color: #fa9d32 !important;
  border-color: #fa9d32 !important;
}

/* 搜索图标颜色 */
.custom-search :deep(.anticon-search) {
  color: #fff !important;
}

/* 用户头像样式 */
.user-avatar {
  cursor: pointer;
  background-color: #f0f2f5;
}

.user-avatar:hover {
  background-color: #e6e8eb;
}

/* 下拉菜单样式 */
:deep(.dropdown-menu .ant-dropdown-menu-item) {
  padding: 10px 20px;
}

:deep(.dropdown-menu .ant-dropdown-menu-item:hover) {
  background-color: #fff7e6;
}

:deep(.dropdown-menu .ant-dropdown-menu-item .anticon) {
  margin-right: 16px;
  color: #fa8c16;
}



:deep(.dropdown-menu .ant-dropdown-menu-item:last-child .anticon) {
  color: #ff4d4f;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .right {
    gap: 8px;
  }

  .custom-search {
    width: 200px !important;
  }

  /* 在小屏幕上稍微缩小一点字体，保持布局美观 */
  .custom-menu :deep(.ant-menu-item) {
    font-size: 15px;
    padding: 0 12px;
  }
}

@media (max-width: 576px) {
  .logo {
    margin-right: 16px;
    font-size: 18px;
  }

  .custom-search {
    width: 150px !important;
  }

  /* 在更小的屏幕上进一步调整字体大小 */
  .custom-menu :deep(.ant-menu-item) {
    font-size: 14px;
    padding: 0 8px;
  }
}

/* 新增的logo样式 */
.logo {
  margin: 0 48px 0 0;
  font-size: 20px;
  font-weight: bold;
  color: #fa8c16;
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-text {
  font-size: 22px;
  letter-spacing: 1px;
}

.logo-subtitle {
  font-size: 12px;
  font-weight: normal;
  color: rgba(0, 0, 0, 0.45);
}

/* 响应式适配 */
@media (max-width: 992px) {
  .logo-text {
    font-size: 20px;
  }

  .logo-subtitle {
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .logo {
    margin-right: 24px;
  }

  .logo-subtitle {
    display: none;
  }
}

@media (max-width: 576px) {
  .logo {
    margin-right: 16px;
  }

  .logo-text {
    font-size: 18px;
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .header-content {
    padding: 0 12px;
  }

  .logo {
    margin-right: 8px;
  }

  .logo-text {
    font-size: 16px;
  }

  .custom-menu :deep(.ant-menu-item) {
    padding: 0 6px;
    font-size: 13px;
  }
}
</style>