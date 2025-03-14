<template>
  <div class="collection-detail-container">
    <!-- 合集头部信息 -->
    <div class="collection-hero" :style="{ backgroundImage: `url(${collection.imageUrl})` }">
      <div class="hero-overlay">
        <div class="hero-content">
          <h1 class="collection-title">{{ collection.title }}</h1>
          <p class="collection-description">{{ collection.description }}</p>
          <div class="collection-meta">
            <span class="meta-item"><calendar-outlined /> 创建于 {{ formatDate(collection.createdAt) }}</span>
            <span class="meta-item"><fire-outlined /> {{ collection.recipeCount }}个菜谱</span>
            <span class="meta-item"><heart-outlined /> {{ collection.likes }}人喜欢</span>
          </div>
          <div class="collection-tags">
            <a-tag v-for="tag in collection.tags" :key="tag" color="orange">{{ tag }}</a-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 合集内容 -->
    <div class="collection-content">
      <!-- 筛选排序区域 -->
      <div class="filter-bar">
        <div class="filter-left">
          <a-radio-group v-model:value="viewMode" button-style="solid" class="view-toggle">
            <a-radio-button value="grid"><app-store-outlined /> 网格</a-radio-button>
            <a-radio-button value="list"><bars-outlined /> 列表</a-radio-button>
          </a-radio-group>
        </div>
        <div class="filter-right">
          <span class="sort-label">排序:</span>
          <a-select v-model:value="sortOption" style="width: 140px" class="sort-select">
            <a-select-option value="popular">最受欢迎</a-select-option>
            <a-select-option value="newest">最新添加</a-select-option>
            <a-select-option value="easiest">最易制作</a-select-option>
          </a-select>
        </div>
      </div>

      <!-- 食谱网格视图 -->
      <div v-if="viewMode === 'grid'" class="recipes-grid">
        <div class="recipe-wrapper" v-for="recipe in recipes" :key="recipe.id">
          <recipe-card :recipe="recipe" />
        </div>
      </div>

      <!-- 食谱列表视图 -->
      <div v-else class="recipes-list">
        <div class="recipe-list-item" v-for="recipe in recipes" :key="recipe.id" @click="viewRecipe(recipe.id)">
          <div class="recipe-image" :style="{ backgroundImage: `url(${recipe.imageUrl})` }"></div>
          <div class="recipe-info">
            <h3 class="recipe-title">{{ recipe.title }}</h3>
            <div class="recipe-tags">
              <a-tag v-for="tag in recipe.tags" :key="tag" color="blue">{{ tag }}</a-tag>
            </div>
            <p class="recipe-brief">{{ recipe.brief }}</p>
            <div class="recipe-meta">
              <span class="meta-item"><clock-outlined /> {{ recipe.cookTime }}分钟</span>
              <span class="meta-item"><fire-outlined /> {{ recipe.calories }}卡路里</span>
              <span class="meta-item"><like-outlined /> {{ recipe.likeCount }}人喜欢</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页组件 -->
      <div class="pagination-wrapper">
        <a-pagination
            v-model:current="currentPage"
            :total="totalRecipes"
            :pageSize="pageSize"
            show-less-items
        />
      </div>
    </div>

    <!-- 相关合集推荐 -->
    <div class="related-collections">
      <h2 class="section-title">相关合集推荐</h2>
      <div class="related-grid">
        <div
            class="related-card"
            v-for="item in relatedCollections"
            :key="item.id"
            @click="viewCollection(item.id)"
        >
          <div class="related-image" :style="{ backgroundImage: `url(${item.imageUrl})` }"></div>
          <div class="related-info">
            <h3 class="related-title">{{ item.title }}</h3>
            <div class="related-count">{{ item.recipeCount }}个菜谱</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  CalendarOutlined,
  FireOutlined,
  HeartOutlined,
  BarsOutlined,
  LikeOutlined
} from '@ant-design/icons-vue';
import RecipeCard from '@/components/RecipeCard/index.vue';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const collectionId = route.params.id;

const viewMode = ref('grid');
const sortOption = ref('popular');
const currentPage = ref(1);
const pageSize = ref(12);
const totalRecipes = ref(0);

// 模拟合集数据
const collection = ref({
  id: collectionId,
  title: '简易家常菜',
  description: '适合忙碌工作日的快手菜谱，20分钟内即可完成的经典家常菜，让你在繁忙的生活中也能享受美味的家常料理。这些菜谱原料易得，操作简单，却能带来满满的家的味道。',
  imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  recipeCount: 12,
  likes: 526,
  createdAt: '2024-01-15',
  tags: ['家常', '快手菜', '下饭菜', '简单', '美味']
});

// 模拟食谱数据
// 模拟食谱数据
const recipes = ref([
  {
    id: 1,
    title: '蒜蓉西兰花',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    tags: ['素食', '快手菜'],
    brief: '清脆爽口的西兰花配上浓郁的蒜香，简单又营养。',
    cookTime: 15,
    calories: 120,
    likeCount: 128,
    cookedCount: '次',
    lastCooked: '几秒前'
  },
  {
    id: 2,
    title: '番茄炒蛋',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    tags: ['家常菜', '快手菜'],
    brief: '酸甜可口的经典家常菜，简单易做且营养丰富。',
    cookTime: 10,
    calories: 180,
    likeCount: 256,
    cookedCount: '次',
    lastCooked: '几秒前'
  },
  {
    id: 3,
    title: '清蒸鱼',
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2',
    tags: ['海鲜', '清蒸'],
    brief: '保留鱼肉鲜美的最佳烹饪方式，鲜嫩多汁。',
    cookTime: 20,
    calories: 200,
    likeCount: 189,
    cookedCount: '次',
    lastCooked: '几秒前'
  },
  {
    id: 4,
    title: '青椒土豆丝',
    imageUrl: 'https://images.unsplash.com/photo-1533622597524-a1215e26c0a2',
    tags: ['素食', '爽口'],
    brief: '清爽可口的家常小炒，开胃下饭的首选。',
    cookTime: 15,
    calories: 150,
    likeCount: 143,
    cookedCount: '次',
    lastCooked: '几秒前'
  },
  {
    id: 5,
    title: '糖醋排骨',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    tags: ['肉类', '经典'],
    brief: '外酥里嫩，酸甜可口的传统名菜。',
    cookTime: 30,
    calories: 320,
    likeCount: 210,
    cookedCount: '次',
    lastCooked: '几秒前'
  },
  {
    id: 6,
    title: '蒜香花菜',
    imageUrl: 'https://images.unsplash.com/photo-1510629040585-037b8b3316d7',
    tags: ['素食', '简单'],
    brief: '简单快手的素菜，蒜香浓郁，口感脆爽。',
    cookTime: 12,
    calories: 110,
    likeCount: 98,
    cookedCount: '次',
    lastCooked: '几秒前'
  }
]);

// 模拟相关合集数据
const relatedCollections = ref([
  {
    id: 2,
    title: '健康低脂餐',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    recipeCount: 8
  },
  {
    id: 4,
    title: '周末宴客菜',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae',
    recipeCount: 10
  },
  {
    id: 5,
    title: '适合新手的素食菜谱',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    recipeCount: 9
  }
]);

// 格式化日期
const formatDate = (dateString :any) => {
  return dayjs(dateString).format('YYYY年MM月DD日');
};

// 查看食谱详情
const viewRecipe = (id :any) => {
  router.push(`/recipes/${id}`);
};

// 查看相关合集
const viewCollection = (id :any) => {
  if (id !== collectionId) {
    router.push(`/collections/${id}`);
  }
};

onMounted(() => {
  // 在实际应用中，这里应该根据ID从API获取合集详情
  totalRecipes.value = recipes.value.length;

  // 更新页面标题
  document.title = `${collection.value.title} - 美食爱好者的社区`;
});
</script>

<style scoped>
.collection-detail-container {
  background: #f5f5f7;
}

/* 合集头部样式 */
.collection-hero {
  height: 360px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: flex-end;
}

.hero-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  color: white;
}

.collection-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.collection-description {
  font-size: 16px;
  max-width: 800px;
  margin-bottom: 16px;
  opacity: 0.9;
}

.collection-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.collection-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 合集内容区域 */
.collection-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-label {
  color: rgba(0, 0, 0, 0.65);
}

/* 食谱网格视图 */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.recipe-wrapper {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.recipe-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* 食谱列表视图 */
.recipes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.recipe-list-item {
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  cursor: pointer;
}

.recipe-list-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.recipe-image {
  width: 180px;
  height: 120px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.recipe-info {
  padding: 16px;
  flex: 1;
}

.recipe-title {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: rgba(0, 0, 0, 0.85);
}

.recipe-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.recipe-brief {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 12px;
}

.recipe-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

/* 分页样式 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 相关合集推荐 */
.related-collections {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.85);
  position: relative;
  padding-left: 16px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: #fa8c16;
  border-radius: 2px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.related-card {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s;
  height: 100px;
}

.related-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.related-image {
  width: 140px;
  height: 100px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.related-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.related-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: rgba(0, 0, 0, 0.85);
}

.related-count {
  font-size: 12px;
  color: #fa8c16;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .recipes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .hero-content {
    padding: 30px 20px;
  }

  .collection-title {
    font-size: 28px;
  }

  .recipes-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .collection-hero {
    height: 300px;
  }

  .recipe-list-item {
    flex-direction: column;
  }

  .recipe-image {
    width: 100%;
    height: 180px;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .collection-hero {
    height: 250px;
  }

  .collection-title {
    font-size: 24px;
  }

  .collection-meta {
    flex-direction: column;
    gap: 8px;
  }

  .recipes-grid {
    grid-template-columns: 1fr;
  }

  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* 修改视图切换按钮样式 */
:deep(.view-toggle .ant-radio-button-wrapper-checked) {
  background: #fa8c16 !important;
  border-color: #fa8c16 !important;
  color: white !important;
}

:deep(.view-toggle .ant-radio-button-wrapper-checked)::before {
  background-color: #fa8c16 !important;
}

:deep(.view-toggle .ant-radio-button-wrapper:hover) {
  color: #fa8c16;
}

/* 修改排序下拉框样式 */
:deep(.sort-select .ant-select-selector:hover) {
  border-color: #fa8c16 !important;
}

:deep(.sort-select.ant-select-focused .ant-select-selector) {
  border-color: #fa8c16 !important;
  box-shadow: 0 0 0 2px rgba(250, 140, 22, 0.2) !important;
}

:deep(.ant-select-item-option-selected) {
  background-color: rgba(250, 140, 22, 0.1) !important;
  color: #fa8c16 !important;
}

:deep(.ant-select-item-option:hover) {
  background-color: rgba(250, 140, 22, 0.05) !important;
}

/* 修改食谱标签颜色 */
:deep(.recipe-tags .ant-tag) {
  color: #fa8c16;
  background: rgba(250, 140, 22, 0.1);
  border-color: rgba(250, 140, 22, 0.2);
}

/* 修改分页器样式 */
:deep(.ant-pagination-item-active) {
  border-color: #fa8c16 !important;
}

:deep(.ant-pagination-item-active a) {
  color: #fa8c16 !important;
}

:deep(.ant-pagination-item:hover) {
  border-color: #fa8c16 !important;
}

:deep(.ant-pagination-item:hover a) {
  color: #fa8c16 !important;
}

:deep(.ant-pagination-next:hover .ant-pagination-item-link),
:deep(.ant-pagination-prev:hover .ant-pagination-item-link) {
  color: #fa8c16 !important;
  border-color: #fa8c16 !important;
}

</style>