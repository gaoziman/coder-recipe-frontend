<template>
  <div class="featured-collections">
    <div class="section-header">
      <h2 class="section-title">精选合集</h2>
      <router-link to="/collections" class="view-all-link">查看全部 <right-outlined /></router-link>
    </div>

    <div class="collections-list">
      <div
          v-for="(collection, index) in collections"
          :key="index"
          class="collection-item"
          @click="navigateToDetail(collection.id)"
      >
        <div class="collection-image">
          <img :src="collection.image" :alt="collection.title" />
          <div class="collection-tag" :style="{ backgroundColor: collection.tagBg, color: collection.tagColor }">
            {{ collection.tag }}
          </div>
        </div>

        <div class="collection-info">
          <h3 class="collection-title">{{ collection.title }}</h3>
          <p class="collection-description">{{ collection.description }}</p>

          <div class="collection-footer">
            <span class="recipe-count">{{ collection.recipeCount }}</span>
            <span class="detail-link">查看详情 <right-outlined /></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

// 获取路由实例
const router = useRouter()

// 精选合集数据 - 添加了id字段用于导航
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
/* 整体容器 - 不设置背景色，添加了米色背景 */
.featured-collections {
  max-width: 1140px;
  margin: 0 auto;
  padding: 24px 16px;
  background-color: #FAF8F3; /* 添加米色背景 */
  border-radius: 12px;
}

/* 标题区域 */
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
  color: #333;
}

.view-all-link {
  color: #d3aa79;
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s ease;
}

.view-all-link:hover {
  color: #b68c5d;
}

/* 合集列表 */
.collections-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* 合集卡片 */
.collection-item {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.collection-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* 合集图片 */
.collection-image {
  position: relative;
  flex: 0 0 33.33%;
  overflow: hidden;
}

.collection-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.collection-item:hover .collection-image img {
  transform: scale(1.05);
}

/* 合集标签 */
.collection-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 合集信息 */
.collection-info {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.collection-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #333;
}

.collection-description {
  font-size: 14px;
  line-height: 1.5;
  color: #666;
  margin-bottom: 16px;
  flex-grow: 1;
  /* 文本多行截断 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 底部信息 */
.collection-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recipe-count {
  font-size: 14px;
  color: #666;
}

.detail-link {
  color: #d3aa79;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.collection-item:hover .detail-link {
  color: #b68c5d;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .collections-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .collection-item {
    flex-direction: column;
  }

  .collection-image {
    flex: 0 0 180px;
  }

  .featured-collections {
    padding: 20px 12px;
  }
}
</style>