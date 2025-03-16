<template>
  <section class="container section">
    <div class="section-header">
      <h2 class="section-title">精选合集</h2>
      <a-button type="link" class="view-all-link">
        查看全部 <right-outlined />
      </a-button>
    </div>

    <div class="collections-grid">
      <a-card v-for="(collection, index) in collections" :key="index"
              hoverable class="collection-card">
        <div class="collection-content">
          <div class="collection-image-wrapper">
            <img :src="collection.image" :alt="collection.title" class="collection-image" />
          </div>

          <div class="collection-details">
            <a-tag class="collection-tag" :style="{ backgroundColor: collection.tagBg, color: collection.tagColor }">
              {{ collection.tag }}
            </a-tag>

            <h3 class="collection-title">{{ collection.title }}</h3>
            <p class="collection-description">{{ collection.description }}</p>

            <div class="collection-footer">
              <span class="recipe-count">{{ collection.recipeCount }}</span>
              <a-button type="link" class="view-details-btn">
                查看详情 <right-outlined />
              </a-button>
            </div>
          </div>
        </div>
      </a-card>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'

// 精选合集数据
const collections = ref([
  {
    title: '秋季养生食谱合集',
    description: '精选30道秋季养生菜肴，滋补身体，增强免疫力',
    image: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf',
    tag: '热门',
    tagBg: '#FFEBE0',
    tagColor: '#FF9966',
    recipeCount: '30道菜谱'
  },
  {
    title: '15分钟快手早餐',
    description: '为忙碌的早晨准备的快速营养早餐方案，让你轻松开启一天',
    image: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3',
    tag: '推荐',
    tagBg: '#E6F7F0',
    tagColor: '#66CC99',
    recipeCount: '25道菜谱'
  }
])
</script>

<style scoped>
.section {
  padding: 48px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: var(--text-primary);
}

.view-all-link {
  color: var(--primary-color) !important;
  padding: 0 !important;
  height: auto !important;
  display: flex;
  align-items: center;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.collection-card {
  border-radius: 12px;
  overflow: hidden;
  border: none;
  transition: all 0.3s ease;
}

.collection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.collection-content {
  display: flex;
  height: 100%;
}

.collection-image-wrapper {
  width: 33.33%;
  overflow: hidden;
}

.collection-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.collection-details {
  width: 66.67%;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.collection-tag {
  align-self: flex-start;
  border-radius: 16px;
  border: none;
  font-size: 12px;
  margin-bottom: 12px;
}

.collection-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 12px;
  color: var(--text-primary);
}

.collection-description {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 16px;
  flex-grow: 1;
}

.collection-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.recipe-count {
  font-size: 14px;
  color: var(--text-secondary);
}

.view-details-btn {
  color: var(--primary-color) !important;
  padding: 0 !important;
  height: auto !important;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .collections-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .collection-content {
    flex-direction: column;
  }

  .collection-image-wrapper {
    width: 100%;
    height: 180px;
  }

  .collection-details {
    width: 100%;
  }
}
</style>