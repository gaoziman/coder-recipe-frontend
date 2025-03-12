<template>
  <a-layout-header class="header">
    <div class="header-content">
      <div class="left">
        <h1 class="logo">我的菜谱管家</h1>
        <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="horizontal"
            :items="menuItems"
            class="custom-menu"
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
        <a-button type="primary" class="add-recipe" @click="onAddRecipe">
          <plus-outlined />
          新建菜谱
        </a-button>
        <!-- 用户头像 -->
        <a-avatar class="user-avatar" @click="goToUserProfile">
          <template #icon><user-outlined /></template>
        </a-avatar>
      </div>
    </div>
  </a-layout-header>
</template>

<script lang="ts" setup>
// 脚本部分保持不变
import { ref, computed } from 'vue'
import { PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { IMenuItem } from '@/types'

const router = useRouter()
const userStore = useUserStore()

const selectedKeys = ref<string[]>(['home'])
const userInfo = computed(() => userStore.userInfo)

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
  router.push('/recipes/add')
}

const goToUserProfile = () => {
  router.push('/user/profile')
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
  border-radius: 4px; /* 增加圆角 */
  height: 32px;
  padding: 0 16px;
  font-size: 14px; /* 稍微增加按钮文字大小 */
}

.add-recipe:hover {
  background: #fa9d32 !important;
  border-color: #fa9d32 !important;
}

/* 修改菜单样式，去掉下划线，只用颜色来表示选中状态 */
.custom-menu {
  border-bottom: none;
  line-height: 62px; /* 增加行高以适应更大的字体 */
}

/* 增加菜单项字体大小 */
.custom-menu :deep(.ant-menu-item) {
  font-size: 16px; /* 将导航文字从默认尺寸增大到16px */
  padding: 0 16px; /* 增加水平内边距，使菜单项之间有更好的间距 */
}

.custom-menu :deep(.ant-menu-item-selected) {
  color: #fa8c16 !important;
  font-weight: 500;
}

/* 重要：移除下划线 */
.custom-menu :deep(.ant-menu-item::after) {
  display: none !important;
  border-bottom: none !important;
}

.custom-menu :deep(.ant-menu-horizontal) {
  border-bottom: none;
}

/* 鼠标悬停效果 */
.custom-menu :deep(.ant-menu-item:hover) {
  color: #fa8c16 !important;
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
</style>