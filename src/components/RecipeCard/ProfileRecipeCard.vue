<template>
  <div class="profile-recipe-card" @click="navigateToRecipe">
    <img :src="recipe.imageUrl"
         :alt="recipe.title"
         class="recipe-image">
    <div class="recipe-content">
      <h3 class="recipe-title">{{ recipe.title }}</h3>
      <div class="recipe-info">
        <span class="cook-count">烹饪次数: {{ recipe.cookCount }}次</span>
        <span class="rating">★ {{ recipe.rating || '4.5' }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

interface RecipeProps {
  recipe: {
    id: number
    title: string
    imageUrl: string
    cookCount: number
    rating?: number
    tags?: string[]
    lastCooked?: string
  }
}

const props = defineProps<RecipeProps>()
const router = useRouter()

const navigateToRecipe = () => {
  router.push(`/recipes/${props.recipe.id}`)
}
</script>

<style scoped>
.profile-recipe-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
}

.profile-recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.recipe-image {
  width: 100%;
  aspect-ratio: 1 / 0.8; /* 调整为更宽的图片比例 */
  object-fit: cover;
}

.recipe-content {
  padding: 8px 10px; /* 减小内边距 */
  background: #fff;
  flex-shrink: 0; /* 防止内容区域被挤压 */
}

.recipe-title {
  margin: 0 0 4px; /* 减小下边距 */
  font-size: 14px; /* 减小字体大小 */
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* 确保标题单行显示 */
}

.recipe-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.rating {
  color: #fa8c16;
}
</style>