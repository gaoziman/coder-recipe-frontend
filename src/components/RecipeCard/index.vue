<template>
  <div class="recipe-card" @click="navigateToRecipe">
    <img :src="recipe.imageUrl"
         :alt="recipe.title"
         class="recipe-image">
    <div class="recipe-content">
      <h3 class="recipe-title">{{ recipe.title }}</h3>
      <div class="recipe-tags">
        <span v-for="tag in recipe.tags"
              :key="tag"
              class="recipe-tag"
              :class="getTagClass(tag)">
          {{ tag }}
        </span>
      </div>
      <div class="recipe-info">
        <span>烹饪次数: {{ recipe.cookCount }}次</span>
        <span>上次: {{ formatLastCooked(recipe.lastCooked) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

interface RecipeProps {
  recipe: {
    id: number
    title: string
    imageUrl: string
    tags: string[]
    cookCount: number
    lastCooked: string
  }
}

const props = defineProps<RecipeProps>()
const router = useRouter()

const getTagClass = (tag: string) => {
  switch (tag) {
    case '素食':
      return 'tag-vegetarian'
    case '快手菜':
      return 'tag-quick'
    default:
      return 'tag-default'
  }
}

const formatLastCooked = (date: string) => {
  return dayjs(date).fromNow()
}

const navigateToRecipe = () => {
  router.push(`/recipes/${props.recipe.id}`)
}
</script>

<style scoped>
.recipe-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #f0f0f0; /* 添加了浅灰色边框 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03); /* 添加了轻微阴影 */
}

.recipe-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 悬停时增强阴影效果 */
}

.recipe-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.recipe-content {
  padding: 12px;
  background: #fff; /* 确保内容区域为白色背景 */
}

.recipe-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: normal;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.5;
}

.recipe-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.recipe-tag {
  padding: 0 8px;
  border-radius: 2px;
  font-size: 12px;
  line-height: 20px;
  display: inline-block;
}

.tag-vegetarian {
  background: #f6ffed;
  color: #52c41a;
  border: none;
}

.tag-quick {
  background: #fff7e6;
  color: #fa8c16;
  border: none;
}

.tag-default {
  background: #f5f5f5;
  color: #595959;
  border: none;
}

.recipe-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
</style>