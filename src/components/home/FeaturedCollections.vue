<template>
  <div class="collection-section-wrapper">
    <section class="featured-collections">
      <div class="section-header">
        <h2 class="section-title">精选合集</h2>
        <router-link to="/collections" class="view-all-link">
          查看全部 <right-outlined />
        </router-link>
      </div>

      <div class="collections-grid">
        <div
            class="collection-card"
            v-for="(collection, index) in collections"
            :key="index"
            @click="navigateToDetail(collection.id)"
        >
          <div class="collection-image-container">
            <img :src="collection.image" :alt="collection.title" class="collection-image" />
            <a-tag
                class="collection-tag"
                :style="{ backgroundColor: collection.tagBg, color: collection.tagColor }"
            >
              {{ collection.tag }}
            </a-tag>
          </div>

          <div class="collection-content">
            <h3 class="collection-title">{{ collection.title }}</h3>
            <p class="collection-description">{{ collection.description }}</p>

            <div class="collection-footer">
              <span class="recipe-count">{{ collection.recipeCount }}</span>
              <span class="detail-link">
                查看详情 <right-outlined />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

// 获取路由实例
const router = useRouter()

// 精选合集数据
const collections = ref([
  {
    id: '1',
    title: '秋季养生食谱合集',
    description: '精选30道秋季养生菜肴，滋补身体，增强免疫力',
    image: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf',
    tag: '热门',
    tagBg: '#FFEBE0',
    tagColor: '#FF9966',
    recipeCount: '30道菜谱'
  },
  {
    id: '2',
    title: '15分钟快手早餐',
    description: '为忙碌的早晨准备的快速营养早餐方案，让你轻松开启一天',
    image: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3',
    tag: '推荐',
    tagBg: '#E6F7F0',
    tagColor: '#66CC99',
    recipeCount: '25道菜谱'
  }
])

// 导航到合集详情页
const navigateToDetail = (id: string) => {
  router.push({
    name: 'CollectionDetail',
    params: { id }
  })
}
</script>

<style scoped>
.collection-section-wrapper {
  width: 100%;
  padding: 32px 0;
}

.featured-collections {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  background-color: #FAF8F3;
  border-radius: 12px;
  padding: 24px;
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
  color: #d3aa79;
  font-size: 14px;
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: color 0.3s ease;
}

/* 为箭头添加左侧间距 */
.view-all-link :deep(.anticon) {
  margin-left: 4px;
}

.view-all-link:hover {
  color: #b68c5d;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.collection-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.collection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.collection-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.collection-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.collection-card:hover .collection-image {
  transform: scale(1.05);
}

.collection-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  border-radius: 16px;
  border: none;
  font-size: 12px;
  padding: 2px 8px;
}

.collection-content {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.collection-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333333;
}

.collection-description {
  font-size: 14px;
  color: #666666;
  margin-bottom: 16px;
  line-height: 1.5;
  flex-grow: 1;
  /* 限制文本行数，超出部分显示省略号 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collection-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.recipe-count {
  font-size: 14px;
  color: #666666;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 4px 12px;
  border-radius: 16px;
}

.detail-link {
  color: #FF9966 !important;
  padding: 0 !important;
  height: auto !important;
  font-size: 14px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.detail-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #FF9966;
  transition: width 0.3s ease;
}

.detail-link:hover::after {
  width: 100%;
}

/* 为箭头添加左侧间距 */
.detail-link :deep(.anticon) {
  margin-left: 4px;
}

.detail-link:hover {
  color: #b68c5d;
}

@media (max-width: 1024px) {
  .collections-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .collections-grid {
    grid-template-columns: 1fr;
  }

  .collection-image-container {
    height: 160px;
  }

  .featured-collections {
    padding: 20px 16px;
  }
}
</style>