<template>
  <div class="recipe-section-wrapper">
    <section class="recommended-recipes">
      <div class="section-header">
        <h2 class="section-title">推荐菜谱</h2>
        <a-button type="link" class="view-all-link">
          查看全部 <right-outlined />
        </a-button>
      </div>

      <div class="recipes-grid">
        <a-card v-for="(recipe, index) in recipes" :key="index"
                hoverable class="recipe-card">
          <template #cover>
            <div class="recipe-image-container">
              <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
              <a-tag class="recipe-tag" :style="{ backgroundColor: recipe.tagBg, color: recipe.tagColor }">{{ recipe.tag }}</a-tag>
            </div>
          </template>
          <div class="recipe-content">
            <div class="recipe-header">
              <h3 class="recipe-title">{{ recipe.title }}</h3>
              <div class="recipe-rating">
                <star-filled class="rating-icon" />
                <span>{{ recipe.rating }}</span>
              </div>
            </div>

            <p class="recipe-description">{{ recipe.description }}</p>

            <div class="recipe-footer">
              <div class="recipe-author">
                <a-avatar :src="recipe.authorAvatar" :size="24" />
                <span class="author-name">{{ recipe.author }}</span>
              </div>

              <div class="recipe-info">
                <span class="info-item">
                  <clock-circle-outlined class="info-icon" />
                  {{ recipe.time }}
                </span>
                <span class="info-item">
                  <fire-outlined class="info-icon" />
                  {{ recipe.difficulty }}
                </span>
              </div>
            </div>
          </div>
        </a-card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RightOutlined, StarFilled, ClockCircleOutlined, FireOutlined } from '@ant-design/icons-vue'

// 推荐菜谱数据 - 更新图片链接和标签样式
const recipes = ref([
  {
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
    difficulty: '简单'
  },
  {
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
    difficulty: '中等'
  },
  {
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
    difficulty: '复杂'
  }
])
</script>

<style scoped>
.recipe-section-wrapper {
  width: 100%;
  padding: 32px 0;
  display: flex;
  justify-content: center;
}

.recommended-recipes {
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
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
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.recipe-card {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
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

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.rating-icon {
  color: #FFBB33;
  margin-right: 4px;
}

.recipe-description {
  font-size: 14px;
  color: #666666;
  margin-bottom: 16px;
  line-height: 1.5;
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
  gap: 12px;
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