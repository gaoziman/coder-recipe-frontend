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

        <!-- 添加新菜谱卡片 -->
        <div class="recipe-wrapper">
          <div class="add-recipe-card" @click="goToAddRecipe">
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
  padding: 24px 0;
  background: #fff; /* 将整个容器背景改为白色 */
}

.category-filter {
  margin-bottom: 24px;
  padding: 0 0 16px 0;
  background: #fff;
  border-bottom: 1px solid #f0f0f0; /* 添加一个细线作为分隔 */
}

/* 自定义Radio按钮组样式 */
.custom-radio-group :deep(.ant-radio-button-wrapper) {
  border: none;
  background: #f5f5f5;
  color: rgba(0, 0, 0, 0.65);
  margin-right: 8px;
  border-radius: 2px;
}

.custom-radio-group :deep(.ant-radio-button-wrapper:before) {
  display: none;
}

.custom-radio-group :deep(.ant-radio-button-wrapper-checked) {
  background: #fef6e8 !important;
  color: #fa8c16 !important;
  font-weight: normal;
}

.custom-radio-group :deep(.ant-radio-button-wrapper:hover) {
  color: #fa8c16;
}

.section {
  margin-bottom: 40px;
  background: #fff; /* 确保每个区域的背景是白色 */
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
  padding-left: 0;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.recipe-wrapper {
  border-radius: 8px;
  overflow: hidden;
  background: #fff; /* 确保每个卡片外围的背景是白色 */
}

.add-recipe-card {
  height: 236px;
  background: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.add-recipe-card :deep(.anticon) {
  font-size: 24px;
  margin-bottom: 8px;
}

.add-recipe-card:hover {
  border-color: #fa8c16;
  color: #fa8c16;
}

.add-recipe-card:hover :deep(.anticon) {
  color: #fa8c16;
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
}

@media (max-width: 576px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }
}
</style>