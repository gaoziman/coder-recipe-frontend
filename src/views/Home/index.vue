<template>
  <div class="home-container">
    <!-- 类别筛选栏 -->
    <div class="category-filter">
      <a-radio-group v-model:value="currentCategory" buttonStyle="solid" class="custom-radio-group">
        <a-radio-button value="all" class="custom-radio-button">全部</a-radio-button>
        <a-radio-button value="breakfast" class="custom-radio-button">早餐</a-radio-button>
        <a-radio-button value="lunch" class="custom-radio-button">午餐</a-radio-button>
        <a-radio-button value="dinner" class="custom-radio-button">晚餐</a-radio-button>
        <a-radio-button value="fast" class="custom-radio-button">快手菜</a-radio-button>
        <a-radio-button value="vegetarian" class="custom-radio-button">素食</a-radio-button>
      </a-radio-group>
    </div>

    <!-- 推荐菜谱区域 -->
    <div class="section">
      <h2 class="section-title">推荐菜谱</h2>
      <div class="recipe-grid">
        <div class="recipe-wrapper" v-for="recipe in recommendedRecipes" :key="recipe.id">
          <recipe-card :recipe="recipe" />
        </div>

        <!-- 添加新菜谱卡片 - 修改后的实现 -->
        <div class="recipe-wrapper no-focus-outline">
          <div class="add-recipe-card" @click="goToAddRecipe" tabindex="-1">
            <plus-outlined />
            <span>添加新菜谱</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近烹饪区域 -->
    <div class="section">
      <h2 class="section-title">最近烹饪</h2>
      <div class="recipe-grid">
        <div class="recipe-wrapper" v-for="recipe in recentRecipes" :key="recipe.id">
          <recipe-card :recipe="recipe" />
        </div>
      </div>
    </div>

    <!-- 收藏菜谱区域 -->
    <div class="section">
      <h2 class="section-title">我的收藏</h2>
      <div class="recipe-grid">
        <div class="recipe-wrapper" v-for="recipe in favoriteRecipes" :key="recipe.id">
          <recipe-card :recipe="recipe" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import RecipeCard from '@/components/RecipeCard/index.vue'

const router = useRouter()
const currentCategory = ref('all')

// 模拟数据
const recommendedRecipes = ref([
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
  }
])

const recentRecipes = ref([
  {
    id: 3,
    title: '清蒸鱼',
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2',
    tags: ['晚餐'],
    cookCount: 5,
    lastCooked: '2024-01-25'
  }
])

const favoriteRecipes = ref([
  {
    id: 4,
    title: '红烧肉',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    tags: ['晚餐'],
    cookCount: 8,
    lastCooked: '2024-01-15'
  }
])

const goToAddRecipe = () => {
  router.push('/recipes/add')
}
</script>

<style scoped>
.home-container {
  padding: 24px 16px; /* 添加水平内边距确保内容不贴边 */
  background: #f5f5f7; /* 修改背景为浅灰色 */
}

.category-filter {
  margin-bottom: 24px;
  padding: 0 0 16px 0;
  background: #f5f5f7; /* 修改为浅灰色 */
  border-bottom: 1px solid #e8e8e8; /* 调整分隔线颜色 */
}

/* 自定义Radio按钮组样式 */
.custom-radio-group :deep(.ant-radio-button-wrapper) {
  border: none;
  background: #f0f0f0; /* 略微调深按钮背景色 */
  color: rgba(0, 0, 0, 0.65);
  margin-right: 8px;
  border-radius: 4px; /* 增大圆角 */
  transition: all 0.3s; /* 添加过渡效果 */
}

.custom-radio-group :deep(.ant-radio-button-wrapper:before) {
  display: none;
}

.custom-radio-group :deep(.ant-radio-button-wrapper-checked) {
  background: #fef6e8 !important;
  color: #fa8c16 !important;
  font-weight: normal;
  box-shadow: 0 2px 6px rgba(250, 140, 22, 0.12); /* 添加轻微阴影 */
}

.custom-radio-group :deep(.ant-radio-button-wrapper:hover) {
  color: #fa8c16;
  background: #fff5e6; /* 添加悬停效果 */
}

.section {
  margin-bottom: 40px;
  background: #f5f5f7; /* 修改为浅灰色 */
  padding: 0 8px; /* 添加内边距 */
}

.section-title {
  font-size: 18px; /* 增大字体 */
  font-weight: 600; /* 加粗 */
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 20px; /* 增加下边距 */
  padding-left: 0;
  position: relative; /* 用于添加装饰元素 */
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 24px;
  height: 3px;
  background: #fa8c16; /* 添加橙色下划线装饰 */
  border-radius: 3px;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px; /* 增大间距 */
}

.recipe-wrapper {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.recipe-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* 移除可能会出现焦点样式的元素的轮廓 */
.no-focus-outline:focus,
.no-focus-outline *:focus {
  outline: none !important;
  box-shadow: none !important;
}

.recipe-wrapper:hover {
  transform: translateY(-4px); /* 添加悬停上浮效果 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1); /* 添加悬停阴影 */
}

.add-recipe-card {
  height: 236px;
  background: #ffffff; /* 纯白色背景 */
  border: 1px dashed #d9d9d9; /* 浅灰色虚线边框 */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #8c8c8c; /* 中灰色文字 */
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
  position: relative;
}

/* 图标样式 */
.add-recipe-card .anticon,
.add-recipe-card :deep(.anticon) {
  font-size: 24px; /* 调整图标大小 */
  margin-bottom: 8px;
  color: #bfbfbf; /* 浅灰色图标 */
}

/* 悬停效果 */
.add-recipe-card:hover {
  border-color: #bfbfbf; /* 悬停时边框变深灰 */
  background: #fafafa; /* 悬停时背景略微变灰 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 轻微阴影 */
}

.add-recipe-card:hover .anticon,
.add-recipe-card:hover :deep(.anticon) {
  color: #8c8c8c; /* 悬停时图标变深灰 */
}

/* 焦点样式 */
.add-recipe-card:focus,
.add-recipe-card:focus-within,
.add-recipe-card:active {
  outline: none !important;
  border-color: #d9d9d9 !important;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05) !important;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .recipe-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .home-container {
    padding: 16px 12px; /* 减小内边距 */
  }
}

@media (max-width: 576px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .custom-radio-group {
    display: flex;
    overflow-x: auto;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
  }

  .custom-radio-group::-webkit-scrollbar {
    display: none; /* 隐藏滚动条 */
  }
}
</style>