<template>
  <div class="recipe-section-wrapper">
    <section class="recommended-recipes">
      <div class="section-header">
        <h2 class="section-title">推荐菜谱</h2>
        <a-button type="link" class="view-all-link" @click="navigateToRecipeList">
          查看全部 <right-outlined />
        </a-button>
      </div>

      <div class="recipes-grid">
        <div class="recipe-card" v-for="(recipe, index) in recipes" :key="index" @click="navigateToRecipeDetail(recipe.id)">
          <div class="recipe-image-container">
            <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
            <a-tag class="recipe-tag" :style="{ backgroundColor: recipe.tagBg, color: recipe.tagColor }">{{ recipe.tag }}</a-tag>
          </div>

          <div class="recipe-content">
            <div class="recipe-title-rating">
              <h3 class="recipe-title">{{ recipe.title }}</h3>
              <div class="recipe-rating">
                <span class="rating-number">{{ recipe.rating }}</span>
                <star-filled class="rating-icon" />
              </div>
            </div>

            <p class="recipe-description">{{ recipe.description }}</p>

            <div class="recipe-footer">
              <div class="recipe-author">
                <a-avatar :src="recipe.authorAvatar" :size="32" />
                <span class="author-name">{{ recipe.author }}</span>
              </div>

              <div class="recipe-info">
                <span class="info-item">
                  <clock-circle-outlined class="info-icon" />
                  {{ recipe.time }}
                </span>
                <span class="info-difficulty" :class="getDifficultyClass(recipe.difficulty)">
                  {{ recipe.difficulty }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RightOutlined, StarFilled, ClockCircleOutlined, FireOutlined } from '@ant-design/icons-vue'

// 获取路由实例
const router = useRouter()

// 推荐菜谱数据 - 更新图片链接和标签样式，添加id属性
const recipes = ref([
  {
    id: 101,
    title: '南瓜奶油浓汤',
    description: '香浓的南瓜浓汤，秋冬温暖的味道，简单易做的家常美食',
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a',
    tag: '秋季推荐',
    tagBg: '#F8DFC0',
    tagColor: '#C17B3A',
    rating: '4.8',
    author: '清风厨房',
    authorAvatar: 'https://i.pravatar.cc/150?img=32',
    time: '30分钟',
    difficulty: '简单',
    category: 'soup'
  },
  {
    id: 102,
    title: '糖醋排骨',
    description: '酸甜可口的传统名菜，色泽红亮，肉质酥烂，开胃下饭',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330',
    tag: '家常菜',
    tagBg: '#E1F3E9',
    tagColor: '#4A9972',
    rating: '4.7',
    author: '家的味道',
    authorAvatar: 'https://i.pravatar.cc/150?img=56',
    time: '45分钟',
    difficulty: '中等',
    category: 'meat'
  },
  {
    id: 103,
    title: '抹茶芝士蛋糕',
    description: '绵密的口感配上淡淡抹茶香，不甜腻的完美甜点',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330',
    tag: '甜点',
    tagBg: '#FFEAEA',
    tagColor: '#E17979',
    rating: '4.9',
    author: '甜蜜厨房',
    authorAvatar: 'https://i.pravatar.cc/150?img=42',
    time: '90分钟',
    difficulty: '复杂',
    category: 'dessert'
  }
])

// 根据难度级别返回对应的CSS类名
const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case '简单':
      return 'difficulty-easy';
    case '中等':
      return 'difficulty-medium';
    case '复杂':
      return 'difficulty-hard';
    default:
      return '';
  }
}

// 导航到菜谱详情页
const navigateToRecipeDetail = (id: number) => {
  // 这里可以根据需要传递额外的参数，比如分类信息
  const recipe = recipes.value.find(recipe => recipe.id === id)
  if (recipe) {
    router.push({
      path: `/recipes/${id}`,
      query: {
        category: recipe.category,
        source: 'recommended' // 可以添加来源标记，便于分析用户行为
      }
    })
  }
}

// 导航到菜谱列表页
const navigateToRecipeList = () => {
  router.push('/recipes')
}
</script>

<style scoped>
.recipe-section-wrapper {
  width: 100%;
  padding: 32px 0;
}

.recommended-recipes {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  color: #333333;
}

.view-all-link {
  color: #d3aa79 !important;
  padding: 0 !important;
  height: auto !important;
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.recipe-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: white;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.recipe-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  border-radius: 16px;
  border: none;
  font-size: 12px;
  padding: 2px 8px;
}

.recipe-content {
  padding: 16px;
}

.recipe-title-rating {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.recipe-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #333333;
}

.recipe-rating {
  display: flex;
  align-items: center;
  color: #666666;
}

.rating-number {
  font-weight: bold;
  margin-right: 4px;
}

.rating-icon {
  color: #FFBB33;
}

.recipe-description {
  font-size: 14px;
  color: #666666;
  margin-bottom: 16px;
  line-height: 1.5;
  /* 限制文本行数，超出部分显示省略号 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recipe-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recipe-author {
  display: flex;
  align-items: center;
}

.author-name {
  font-size: 14px;
  color: #666666;
  margin-left: 8px;
}

.recipe-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666666;
}

.info-icon {
  margin-right: 4px;
}

.info-difficulty {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
}

.difficulty-easy {
  background-color: #E6F7FF;
  color: #1890FF;
}

.difficulty-medium {
  background-color: #FFF7E6;
  color: #FA8C16;
}

.difficulty-hard {
  background-color: #FFF1F0;
  color: #F5222D;
}

@media (max-width: 1024px) {
  .recipes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .recipes-grid {
    grid-template-columns: 1fr;
  }
}
</style>