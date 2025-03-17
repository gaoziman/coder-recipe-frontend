<template>
  <div class="ingredient-category-container">
    <!-- 替换原有面包屑导航 -->
    <custom-breadcrumb
        :category="{ id: categoryInfo.id, name: categoryInfo.name }"
    />

    <!-- 加载状态 -->
    <a-spin :spinning="loading">
      <!-- 分类页头部 -->
      <div class="category-header">
        <div class="category-title-section">
          <div class="category-icon">
            <component :is="categoryInfo.icon" />
          </div>
          <div class="category-title-content">
            <h1 class="category-title">{{ categoryInfo.name }}</h1>
            <p class="category-desc">{{ categoryInfo.description }}</p>
          </div>
        </div>
        <div class="category-stats">
          <div class="stat-item">
            <span class="stat-value">{{ categoryInfo.count }}</span>
            <span class="stat-label">种食材</span>
          </div>
          <a-divider type="vertical" />
          <div class="stat-item">
            <span class="stat-value">{{ categoryInfo.recipeCount }}</span>
            <span class="stat-label">份相关菜谱</span>
          </div>
        </div>
      </div>

      <!-- 筛选与排序 -->
      <div class="filter-section">
        <div class="filter-tags">
          <a-tag
              v-for="tag in filterTags"
              :key="tag.value"
              :class="{ 'active-tag': activeFilters.includes(tag.value) }"
              @click="toggleFilter(tag.value)"
          >
            {{ tag.label }}
          </a-tag>
        </div>
        <div class="filter-dropdown">
          <a-dropdown>
            <a-button>
              {{ sortOptions.find(o => o.value === sortBy)?.label || '排序方式' }}
              <down-outlined />
            </a-button>
            <template #overlay>
              <a-menu @click="handleSortChange">
                <a-menu-item v-for="option in sortOptions" :key="option.value">
                  {{ option.label }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>

      <!-- 食材列表 -->
      <div v-if="categoryIngredients.length > 0" class="ingredients-grid">
        <router-link
            v-for="ingredient in categoryIngredients"
            :key="ingredient.id"
            :to="`/ingredient/${ingredient.id}`"
            class="ingredient-card"
        >
          <div class="ingredient-image">
            <img :src="ingredient.image" :alt="ingredient.name" />
            <div class="ingredient-season">{{ ingredient.season }}</div>
          </div>
          <div class="ingredient-info">
            <h3 class="ingredient-name">{{ ingredient.name }}</h3>
            <p class="ingredient-desc">{{ ingredient.description }}</p>
            <div class="ingredient-tags">
              <a-tag v-for="tag in ingredient.tags" :key="tag">{{ tag }}</a-tag>
            </div>
            <div class="ingredient-nutrition">
              <div class="nutrition-item">
                <span class="nutrition-label">热量</span>
                <span class="nutrition-value">{{ ingredient.calories }}千卡/100g</span>
              </div>
              <div class="nutrition-item">
                <span class="nutrition-label">蛋白质</span>
                <span class="nutrition-value">{{ ingredient.protein }}g/100g</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
      <a-empty v-else description="暂无相关食材" />

      <!-- 分页控件 -->
      <div class="pagination-container">
        <a-pagination
            v-model:current="currentPage"
            :total="totalIngredients"
            :pageSize="pageSize"
            show-quick-jumper
            @change="handlePageChange"
        />
      </div>

      <!-- 相关知识和小贴士 -->
      <div class="knowledge-section">
        <a-card :bordered="false" title="食材小贴士">
          <a-card-grid v-for="(tip, index) in categoryTips" :key="index" class="tip-card">
            <div class="tip-icon">
              <bulb-outlined />
            </div>
            <div class="tip-content">
              <h4 class="tip-title">{{ tip.title }}</h4>
              <p class="tip-desc">{{ tip.content }}</p>
            </div>
          </a-card-grid>
        </a-card>
      </div>

      <!-- 相关分类推荐 -->
      <div class="related-categories">
        <h3 class="section-title">相关分类</h3>
        <div class="category-links">
          <router-link
              v-for="category in relatedCategories"
              :key="category.id"
              :to="`/ingredient/category/${category.id}`"
              class="category-link"
          >
            <component :is="category.icon" class="category-link-icon" />
            <span>{{ category.name }}</span>
          </router-link>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  DownOutlined,
  AppleOutlined,
  BulbOutlined,
  FireOutlined,
  ExperimentOutlined,
  CoffeeOutlined,
  MeatOutlined
} from '@ant-design/icons-vue';
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const currentPage = ref(1);
const pageSize = ref(12);
const sortBy = ref('popular');
const activeFilters = ref<string[]>([]);

// 获取当前分类ID
const categoryId = computed(() => route.params.categoryId);

// 监听分类ID变化
watch(categoryId, () => {
  fetchCategoryData();
});

// 排序选项
const sortOptions = [
  { label: '按热度排序', value: 'popular' },
  { label: '按名称排序', value: 'az' },
  { label: '按营养价值排序', value: 'nutrition' }
];

// 筛选标签
const filterTags = [
  { label: '春季', value: 'spring' },
  { label: '夏季', value: 'summer' },
  { label: '秋季', value: 'autumn' },
  { label: '冬季', value: 'winter' },
  { label: '低热量', value: 'low-calorie' },
  { label: '高蛋白', value: 'high-protein' },
  { label: '高维生素', value: 'high-vitamin' }
];

// 分类基本信息
const categoryInfo = reactive({
  id: '',
  name: '',
  description: '',
  icon: 'apple-outlined',
  count: 0,
  recipeCount: 0
});

// 分类下的食材
const categoryIngredients = reactive([
  {
    id: '1',
    name: '南瓜',
    image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818',
    description: '南瓜富含维生素A、维生素C和钾，是秋季常见蔬菜，质地坚硬，呈橙黄色，口感香甜。',
    tags: ['秋季', '维生素A', '纤维'],
    season: '秋季',
    calories: 26,
    protein: 1.0
  },
  {
    id: '3',
    name: '甜椒',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83',
    description: '甜椒又称彩椒，富含维生素C，有红色、黄色、绿色等多种颜色，口感清脆甜美。',
    tags: ['全年', '维生素C', '抗氧化'],
    season: '秋季',
    calories: 31,
    protein: 1.2
  },
  {
    id: '4',
    name: '葡萄',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f',
    description: '葡萄含有丰富的果糖和多种维生素，有紫色、绿色、红色等品种，味道甜美多汁。',
    tags: ['秋季', '抗氧化', '花青素'],
    season: '秋季',
    calories: 69,
    protein: 0.6
  },
  {
    id: '7',
    name: '菠菜',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
    description: '菠菜是绿叶蔬菜，富含铁质和维生素，叶片鲜嫩，适合炒食或做汤。',
    tags: ['秋冬', '铁质', '叶酸'],
    season: '秋季',
    calories: 23,
    protein: 2.9
  },
  {
    id: '8',
    name: '柿子',
    image: 'https://images.unsplash.com/photo-1606926694086-5624f1ccc7c1',
    description: '柿子含有丰富的胡萝卜素和糖分，呈橙红色，口感甜脆，是秋季代表性水果。',
    tags: ['秋季', '胡萝卜素', '抗氧化'],
    season: '秋季',
    calories: 70,
    protein: 0.7
  },
]);

// 食材分类小贴士
const categoryTips = reactive([
  {
    title: '选购新鲜蔬果的技巧',
    content: '选择颜色鲜艳、质地坚实、无损伤的蔬果。部分蔬果轻拍时会发出沉闷声音，表示内部水分充足。'
  },
  {
    title: '正确储存延长保鲜期',
    content: '大多数蔬菜适合放入冰箱保存，但番茄、甜椒等水果类蔬菜在室温下保存风味更佳。菜叶类蔬菜用湿纸巾包裹再放入保鲜袋中。'
  },
  {
    title: '季节性蔬果营养更丰富',
    content: '选择当季蔬果不仅更新鲜美味，而且营养价值更高，同时也更加环保和经济。'
  },
  {
    title: '多彩蔬果营养均衡',
    content: '不同颜色的蔬果含有不同的营养物质，尽量选择多种颜色的蔬果，保证摄入多样化的营养素。'
  }
]);

// 相关分类
const relatedCategories = reactive([
  {
    id: 2,
    name: '肉禽蛋类',
    icon: 'meat-outlined'
  },
  {
    id: 6,
    name: '干果零食',
    icon: 'apple-outlined'
  },
  {
    id: 4,
    name: '调味品',
    icon: 'coffee-outlined'
  }
]);

// 总食材数量
const totalIngredients = ref(24);

// 页面加载时获取分类数据
onMounted(() => {
  fetchCategoryData();
});

// 获取分类数据
const fetchCategoryData = async () => {
  loading.value = true;

  try {
    // 实际应用中这里应该从API获取数据
    // const response = await fetch(`/api/ingredient-categories/${categoryId.value}`);
    // const data = await response.json();

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟不同分类的数据
    const categoryMap = {
      '1': {
        id: '1',
        name: '蔬菜水果',
        description: '蔬菜水果是日常饮食中不可或缺的健康食材，富含维生素、矿物质和膳食纤维，有助于增强免疫力、促进消化和维持身体健康。',
        icon: 'apple-outlined',
        count: 68,
        recipeCount: 426
      },
      '2': {
        id: '2',
        name: '肉禽蛋类',
        description: '肉禽蛋类是重要的蛋白质来源，含有人体必需的氨基酸和各种微量元素，对维持肌肉健康和提供能量至关重要。',
        icon: 'meat-outlined',
        count: 42,
        recipeCount: 352
      }
      // 其他分类...
    };

    // 更新分类信息
    Object.assign(categoryInfo, categoryMap[categoryId.value] || {
      id: categoryId.value,
      name: '未知分类',
      description: '暂无描述',
      icon: 'apple-outlined',
      count: 0,
      recipeCount: 0
    });

    // 模拟食材列表数据
    // 实际应用中应该根据分类ID获取对应的食材

  } catch (error) {
    console.error('获取分类数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 切换筛选标签
const toggleFilter = (filter: string) => {
  const index = activeFilters.value.indexOf(filter);
  if (index >= 0) {
    activeFilters.value.splice(index, 1);
  } else {
    activeFilters.value.push(filter);
  }
  currentPage.value = 1;
};

// 排序方式变更处理
const handleSortChange = (e) => {
  sortBy.value = e.key;
};

// 页码变化处理
const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo(0, 0);
};
</script>

<style scoped>
.ingredient-category-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.category-header {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.category-title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.category-icon {
  font-size: 48px;
  color: #f6925c;
  background-color: rgba(246, 146, 92, 0.1);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.category-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
}

.category-desc {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
}

.category-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #f6925c;
}

.stat-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tags .ant-tag {
  cursor: pointer;
  padding: 6px 12px;
  font-size: 14px;
  margin-right: 0;
}

.filter-tags .active-tag {
  background-color: #f6925c !important;
  color: white !important;
  border-color: #f6925c !important;
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.ingredient-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.ingredient-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.ingredient-image {
  height: 180px;
  position: relative;
  overflow: hidden;
}

.ingredient-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.ingredient-card:hover .ingredient-image img {
  transform: scale(1.05);
}

.ingredient-season {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #f6925c;
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 16px;
}

.ingredient-info {
  padding: 16px;
}

.ingredient-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
}

.ingredient-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ingredient-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.ingredient-tags .ant-tag {
  margin-right: 0;
  background-color: #f5f5f5;
  border-color: transparent;
}

.ingredient-nutrition {
  display: flex;
  justify-content: space-between;
  background-color: #f9f9f9;
  padding: 8px 12px;
  border-radius: 4px;
}

.nutrition-item {
  display: flex;
  flex-direction: column;
}

.nutrition-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.nutrition-value {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.pagination-container {
  margin-top: 32px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}

.knowledge-section {
  margin-bottom: 40px;
}

.tip-card {
  width: 50%;
  text-align: left;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

@media (max-width: 768px) {
  .tip-card {
    width: 100%;
  }
}

.tip-icon {
  font-size: 24px;
  color: #f6925c;
}

.tip-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.85);
}

.tip-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin: 0;
  line-height: 1.6;
}

.related-categories {
  margin-bottom: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.category-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.85);
  background-color: white;
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.category-link:hover {
  color: #f6925c;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.category-link-icon {
  color: #f6925c;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .category-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .category-stats {
    width: 100%;
    justify-content: center;
    margin-top: 16px;
  }

  .filter-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-tags {
    width: 100%;
  }

  .filter-dropdown {
    width: 100%;
  }

  .filter-dropdown .ant-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

/* 主题色调整 */
:deep(.ant-pagination-item-active) {
  border-color: #f6925c;
}

:deep(.ant-pagination-item-active a) {
  color: #f6925c;
}

:deep(.ant-card-head-title) {
  font-weight: 600;
}

:deep(.ant-empty-description) {
  color: rgba(0, 0, 0, 0.45);
}
</style>