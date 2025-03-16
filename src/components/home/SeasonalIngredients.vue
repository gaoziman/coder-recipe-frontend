<template>
  <section class="seasonal-ingredients container">
    <div class="section-header">
      <h2 class="section-title">当季食材</h2>
      <a-button type="link" class="view-all-link">
        查看全部 <right-outlined />
      </a-button>
    </div>

    <div class="ingredients-grid">
      <a-card v-for="(ingredient, index) in ingredients" :key="index"
              hoverable class="ingredient-card">
        <template #cover>
          <div class="ingredient-image">
            <img :src="ingredient.image" :alt="ingredient.name" />
          </div>
        </template>
        <a-card-meta :title="ingredient.name">
          <template #description>
            <p class="ingredient-desc">{{ ingredient.description }}</p>
            <div class="ingredient-footer">
              <a-tag class="season-tag">{{ ingredient.season }}</a-tag>
              <a-button type="link" class="bookmark-btn">
                <template #icon><book-outlined /></template>
              </a-button>
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RightOutlined, BookOutlined } from '@ant-design/icons-vue'

// 当季食材数据 - 更新了图片链接
const ingredients = ref([
  {
    name: '南瓜',
    description: '营养丰富，适合煲汤和烘焙',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
    season: '秋季'
  },
  {
    name: '栗子',
    description: '香甜可口，可煮可烤',
    image: 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7',
    season: '秋季'
  },
  {
    name: '甜椒',
    description: '营养丰富，颜色鲜艳',
    image: 'https://images.unsplash.com/photo-1550461716-dbf266b2a8a7',
    season: '秋季'
  },
  {
    name: '葡萄',
    description: '鲜甜多汁，营养丰富',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f',
    season: '秋季'
  }
])
</script>

<style scoped>
.seasonal-ingredients {
  padding: 24px 0;
  /* 移除白色背景，让卡片呈现在页面的米色背景上 */
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
  color: var(--text-primary);
}

.view-all-link {
  color: #d3aa79 !important; /* 使用原型图中的橙棕色调 */
  padding: 0 !important;
  height: auto !important;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.ingredient-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: white;
}

.ingredient-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.ingredient-image {
  height: 180px; /* 增加高度使其更接近原型图 */
  overflow: hidden;
}

.ingredient-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ingredient-desc {
  margin-top: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.ingredient-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.season-tag {
  background-color: rgba(255, 153, 102, 0.1) !important;
  color: #ff9966 !important;
  border-color: transparent !important;
  border-radius: 16px;
}

.bookmark-btn {
  color: #ff9966 !important;
  padding: 0 !important;
  height: auto !important;
}

/* 让内容更接近原型图的样式 */
:deep(.ant-card-meta-title) {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

:deep(.ant-card-body) {
  padding: 16px;
}

@media (max-width: 1200px) {
  .ingredients-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .ingredients-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .ingredients-grid {
    grid-template-columns: 1fr;
  }
}
</style>