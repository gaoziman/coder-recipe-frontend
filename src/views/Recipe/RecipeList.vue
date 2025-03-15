<template>
  <div class="recipe-list-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h2 class="page-title">探索美食</h2>
      <p class="page-description">发现各种美味的家常菜谱，开启烹饪之旅</p>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <div class="search-box">
        <a-input-search
            v-model:value="searchQuery"
            placeholder="搜索菜谱名称、食材..."
            enter-button
            @search="handleSearch"
            :loading="loading"
        />
      </div>
      <div class="filter-section">
        <div class="filter-group">
          <span class="filter-label">分类:</span>
          <a-select
              v-model:value="selectedCategory"
              style="width: 120px"
              @change="handleCategoryChange"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="breakfast">早餐</a-select-option>
            <a-select-option value="lunch">午餐</a-select-option>
            <a-select-option value="dinner">晚餐</a-select-option>
            <a-select-option value="dessert">甜点</a-select-option>
            <a-select-option value="snack">小吃</a-select-option>
          </a-select>
        </div>
        <div class="filter-group">
          <span class="filter-label">标签:</span>
          <a-select
              v-model:value="selectedTags"
              mode="multiple"
              style="min-width: 200px"
              placeholder="选择标签"
              @change="handleTagChange"
          >
            <a-select-option value="素食">素食</a-select-option>
            <a-select-option value="快手菜">快手菜</a-select-option>
            <a-select-option value="下饭菜">下饭菜</a-select-option>
            <a-select-option value="低脂">低脂</a-select-option>
            <a-select-option value="高蛋白">高蛋白</a-select-option>
            <a-select-option value="宴客菜">宴客菜</a-select-option>
          </a-select>
        </div>
        <div class="filter-group">
          <span class="filter-label">难度:</span>
          <a-select
              v-model:value="selectedDifficulty"
              style="width: 100px"
              @change="handleDifficultyChange"
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="easy">简单</a-select-option>
            <a-select-option value="medium">适中</a-select-option>
            <a-select-option value="hard">困难</a-select-option>
          </a-select>
        </div>
      </div>

      <!-- 显示当前筛选条件 -->
      <div v-if="hasActiveFilters" class="active-filters">
        <span class="filter-info">当前筛选: </span>
        <a-tag
            v-if="selectedCategory"
            closable
            @close="selectedCategory = ''"
            color="orange"
        >
          {{ getCategoryName(selectedCategory) }}
        </a-tag>
        <a-tag
            v-for="tag in selectedTags"
            :key="tag"
            closable
            @close="removeTag(tag)"
            color="orange"
        >
          {{ tag }}
        </a-tag>
        <a-tag
            v-if="selectedDifficulty"
            closable
            @close="selectedDifficulty = ''"
            color="orange"
        >
          {{ getDifficultyName(selectedDifficulty) }}
        </a-tag>
        <a-button
            type="link"
            size="small"
            @click="clearAllFilters"
            class="clear-filters-btn"
        >
          清除全部
        </a-button>
      </div>
    </div>

    <!-- 菜谱展示区域 -->
    <div class="recipe-section">
      <div class="sort-section">
        <span class="results-count">{{ totalResults }}个结果</span>
        <div class="sort-controls">
          <span class="sort-label">排序方式:</span>
          <a-radio-group v-model:value="sortBy" button-style="solid" @change="handleSortChange">
            <a-radio-button value="popular">最受欢迎</a-radio-button>
            <a-radio-button value="latest">最新发布</a-radio-button>
            <a-radio-button value="rating">最高评分</a-radio-button>
          </a-radio-group>
        </div>
      </div>

      <!-- 菜谱网格 -->
      <a-spin :spinning="loading">
        <transition-group
            name="fade"
            tag="div"
            class="recipe-grid"
            v-bind:css="false"
            @before-enter="beforeEnter"
            @enter="enter"
        >
          <div
              class="recipe-wrapper"
              v-for="(recipe, index) in filteredRecipes"
              :key="recipe.id + '-' + sortBy"
              :data-index="index"
              @click="viewRecipeDetail(recipe.id)"
          >
            <recipe-card :recipe="recipe" />
          </div>
        </transition-group>

        <!-- 如果没有结果 -->
        <div v-if="filteredRecipes.length === 0 && !loading" class="no-results">
          <a-empty
              :image="emptyImage"
              :description="'没有找到匹配的菜谱'"
          >
            <template #description>
              <span>
                没有找到匹配的菜谱，请尝试调整筛选条件
              </span>
            </template>
            <a-button type="primary" @click="clearAllFilters">清除筛选</a-button>
          </a-empty>
        </div>
      </a-spin>

      <!-- 分页 -->
      <div class="pagination-container" v-if="filteredRecipes.length > 0">
        <a-pagination
            v-model:current="currentPage"
            :total="totalResults"
            :page-size="pageSize"
            @change="handlePageChange"
            show-quick-jumper
            :show-total="total => `共 ${total} 条`"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import RecipeCard from '@/components/RecipeCard/index.vue';
import { Empty } from 'ant-design-vue';

const router = useRouter();
const route = useRoute();
const emptyImage = Empty.PRESENTED_IMAGE_SIMPLE;

// 状态
const loading = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedTags = ref<string[]>([]);
const selectedDifficulty = ref('');
const sortBy = ref('popular');
const currentPage = ref(1);
const pageSize = ref(12);
const sortCache = reactive(new Map());

// 如果URL中有查询参数，初始化筛选条件
onMounted(() => {
  if (route.query.ingredient) {
    selectedTags.value = [route.query.ingredient as string];
    fetchRecipes();
  } else if (route.query.category) {
    selectedCategory.value = route.query.category as string;
    fetchRecipes();
  } else {
    fetchRecipes();
  }
});

// 模拟菜谱数据
const allRecipes = ref([
  {
    id: 1,
    title: '蒜蓉西兰花',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    tags: ['素食', '快手菜'],
    cookCount: 12,
    lastCooked: '2024-01-20',
    category: 'dinner',
    difficulty: 'easy',
    rating: 4.5,
    createdAt: '2023-12-15'
  },
  {
    id: 2,
    title: '番茄炒蛋',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    tags: ['快手菜', '下饭菜'],
    cookCount: 18,
    lastCooked: '2024-01-22',
    category: 'lunch',
    difficulty: 'easy',
    rating: 4.8,
    createdAt: '2023-11-30'
  },
  {
    id: 3,
    title: '清蒸鱼',
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2',
    tags: ['晚餐', '高蛋白'],
    cookCount: 5,
    lastCooked: '2024-01-25',
    category: 'dinner',
    difficulty: 'medium',
    rating: 4.6,
    createdAt: '2024-01-05'
  },
  {
    id: 4,
    title: '红烧排骨',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    tags: ['下饭菜', '宴客菜'],
    cookCount: 7,
    lastCooked: '2024-01-15',
    category: 'dinner',
    difficulty: 'medium',
    rating: 4.7,
    createdAt: '2023-12-20'
  },
  {
    id: 5,
    title: '麻婆豆腐',
    imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
    tags: ['下饭菜', '快手菜'],
    cookCount: 10,
    lastCooked: '2024-01-18',
    category: 'lunch',
    difficulty: 'easy',
    rating: 4.4,
    createdAt: '2023-12-10'
  },
  {
    id: 6,
    title: '肉末茄子',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    tags: ['下饭菜'],
    cookCount: 8,
    lastCooked: '2024-01-20',
    category: 'dinner',
    difficulty: 'easy',
    rating: 4.3,
    createdAt: '2024-01-02'
  },
  {
    id: 7,
    title: '白灼虾',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
    tags: ['高蛋白', '宴客菜'],
    cookCount: 4,
    lastCooked: '2024-01-10',
    category: 'dinner',
    difficulty: 'medium',
    rating: 4.9,
    createdAt: '2023-12-25'
  },
  {
    id: 8,
    title: '青椒土豆丝',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
    tags: ['素食', '快手菜'],
    cookCount: 15,
    lastCooked: '2024-01-22',
    category: 'lunch',
    difficulty: 'easy',
    rating: 4.2,
    createdAt: '2023-11-15'
  },
  {
    id: 9,
    title: '糖醋里脊',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    tags: ['宴客菜'],
    cookCount: 6,
    lastCooked: '2024-01-15',
    category: 'dinner',
    difficulty: 'hard',
    rating: 4.7,
    createdAt: '2023-12-30'
  },
  {
    id: 10,
    title: '鱼香肉丝',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    tags: ['下饭菜'],
    cookCount: 9,
    lastCooked: '2024-01-18',
    category: 'lunch',
    difficulty: 'medium',
    rating: 4.5,
    createdAt: '2023-12-05'
  },
  {
    id: 11,
    title: '红枣黑米粥',
    imageUrl: 'https://images.unsplash.com/photo-1455853659719-4b9233b3b931',
    tags: ['素食', '早餐'],
    cookCount: 20,
    lastCooked: '2024-01-24',
    category: 'breakfast',
    difficulty: 'easy',
    rating: 4.1,
    createdAt: '2023-11-20'
  },
  {
    id: 12,
    title: '香蕉燕麦松饼',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93',
    tags: ['素食', '早餐', '低脂'],
    cookCount: 11,
    lastCooked: '2024-01-23',
    category: 'breakfast',
    difficulty: 'medium',
    rating: 4.4,
    createdAt: '2024-01-10'
  },
  {
    id: 13,
    title: '芝士蛋糕',
    imageUrl: 'https://images.unsplash.com/photo-1533134242453-f4211c01040f',
    tags: ['甜点'],
    cookCount: 3,
    lastCooked: '2024-01-12',
    category: 'dessert',
    difficulty: 'hard',
    rating: 4.8,
    createdAt: '2023-12-12'
  },
  {
    id: 14,
    title: '巧克力布朗尼',
    imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52',
    tags: ['甜点'],
    cookCount: 5,
    lastCooked: '2024-01-16',
    category: 'dessert',
    difficulty: 'medium',
    rating: 4.6,
    createdAt: '2023-12-18'
  },
  {
    id: 15,
    title: '薯条',
    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086',
    tags: ['小吃', '快手菜'],
    cookCount: 14,
    lastCooked: '2024-01-21',
    category: 'snack',
    difficulty: 'easy',
    rating: 4.3,
    createdAt: '2023-11-25'
  },
  {
    id: 16,
    title: '水果沙拉',
    imageUrl: 'https://images.unsplash.com/photo-1564093497595-593b96d80180',
    tags: ['素食', '低脂', '快手菜'],
    cookCount: 16,
    lastCooked: '2024-01-23',
    category: 'snack',
    difficulty: 'easy',
    rating: 4.0,
    createdAt: '2024-01-08'
  }
]);

// 获取菜谱数据（模拟API调用）
const fetchRecipes = () => {
  loading.value = true;
  // 模拟API请求延迟
  setTimeout(() => {
    loading.value = false;
  }, 600);
};

// 过滤和排序菜谱（修复后的实现）
const filteredRecipes = computed(() => {
  // 应用筛选条件
  const filtered = allRecipes.value.filter(recipe => {
    // 搜索文本过滤
    if (searchQuery.value && !recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false;
    }

    // 分类过滤
    if (selectedCategory.value && recipe.category !== selectedCategory.value) {
      return false;
    }

    // 标签过滤
    if (selectedTags.value.length > 0 && !selectedTags.value.some(tag => recipe.tags.includes(tag))) {
      return false;
    }

    // 难度过滤
    if (selectedDifficulty.value && recipe.difficulty !== selectedDifficulty.value) {
      return false;
    }

    return true;
  });

  // 生成缓存键
  const sortKey = `${sortBy.value}-${filtered.length}`;

  // 检查缓存
  if (!sortCache.has(sortKey)) {
    let results = [...filtered];

    // 应用排序
    if (sortBy.value === 'popular') {
      results.sort((a, b) => b.cookCount - a.cookCount);
    } else if (sortBy.value === 'latest') {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy.value === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    }

    // 最多缓存3种排序结果
    if (sortCache.size >= 3) {
      // 删除最老的缓存
      const oldestKey = Array.from(sortCache.keys())[0];
      sortCache.delete(oldestKey);
    }

    sortCache.set(sortKey, results);
  }

  return sortCache.get(sortKey) || filtered;
});

// 分页数据
const paginatedRecipes = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredRecipes.value.slice(startIndex, startIndex + pageSize.value);
});

// 总结果数
const totalResults = computed(() => filteredRecipes.value.length);

// 是否有激活的筛选条件
const hasActiveFilters = computed(() =>
    selectedCategory.value !== '' ||
    selectedTags.value.length > 0 ||
    selectedDifficulty.value !== '' ||
    searchQuery.value !== ''
);

// 分类名称映射
const getCategoryName = (categoryValue: string) => {
  const categoryMap: Record<string, string> = {
    'breakfast': '早餐',
    'lunch': '午餐',
    'dinner': '晚餐',
    'dessert': '甜点',
    'snack': '小吃'
  };
  return categoryMap[categoryValue] || categoryValue;
};

// 难度名称映射
const getDifficultyName = (difficultyValue: string) => {
  const difficultyMap: Record<string, string> = {
    'easy': '简单',
    'medium': '适中',
    'hard': '困难'
  };
  return difficultyMap[difficultyValue] || difficultyValue;
};

// 添加动画钩子函数
const beforeEnter = (el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(15px)';
};

const enter = (el, done) => {
  const delay = el.dataset.index * 50; // 每个项目延迟50ms

  setTimeout(() => {
    el.style.transition = 'all 0.3s ease';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, delay);

  // 确保动画完成后能够被清理
  setTimeout(done, delay + 300);
};

// 修改排序函数
const handleSortChange = () => {
  loading.value = true;

  // 短暂延迟，让用户看到排序切换的动画
  setTimeout(() => {
    currentPage.value = 1;
    loading.value = false;
  }, 300);
};

// 事件处理函数
const handleSearch = () => {
  currentPage.value = 1; // 重置页码
  sortCache.clear(); // 清除排序缓存
  fetchRecipes();
};

const handleCategoryChange = () => {
  currentPage.value = 1;
  sortCache.clear(); // 清除排序缓存
  fetchRecipes();
};

const handleTagChange = () => {
  currentPage.value = 1;
  sortCache.clear(); // 清除排序缓存
  fetchRecipes();
};

const handleDifficultyChange = () => {
  currentPage.value = 1;
  sortCache.clear(); // 清除排序缓存
  fetchRecipes();
};


const handlePageChange = (page: number) => {
  currentPage.value = page;
  // 滚动到页面顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const clearAllFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedTags.value = [];
  selectedDifficulty.value = '';
  currentPage.value = 1;
  sortCache.clear(); // 清除排序缓存
  fetchRecipes();
};

const removeTag = (tagToRemove: string) => {
  selectedTags.value = selectedTags.value.filter(tag => tag !== tagToRemove);
  sortCache.clear(); // 清除排序缓存
  fetchRecipes();
};

// 查看菜谱详情
const viewRecipeDetail = (id: number) => {
  router.push(`/recipes/${id}`);
};
</script>

<style scoped>
/* 基础容器样式 */
.recipe-list-container {
  padding: 24px 16px;
  background: #f5f5f7;
}

/* 页面标题区域 */
.page-header {
  margin-bottom: 24px;
  text-align: center;
  padding: 20px 0;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 8px;
  position: relative;
  display: inline-block;
}

.page-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -8px;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: #fa8c16;
  border-radius: 2px;
}

.page-description {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
}

/* 搜索和筛选区域 */
.search-filter-section {
  position: relative;
  padding: 24px;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 搜索框样式 */
.search-box {
  max-width: 720px;
  margin: 0 auto 20px;
}

.search-box .ant-input-search {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.search-box .ant-input-search .ant-input {
  padding: 12px 16px;
  font-size: 15px;
  border: none;
  background-color: #fff;
}

.search-box .ant-input-search .ant-input:focus {
  box-shadow: none;
}

.search-box .ant-input-search .ant-input-search-button {
  background-color: #fa8c16;
  border-color: #fa8c16;
  height: 46px;
  width: 46px;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-box .ant-input-search .ant-input-search-button:hover {
  background-color: #fd9a30;
  border-color: #fd9a30;
}

.search-box .anticon-search {
  font-size: 18px;
  color: #fff;
}

/* 筛选区域样式 */
.filter-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  position: relative;
}

.filter-label {
  margin-right: 10px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 500;
}

/* Select组件样式覆盖 */
.filter-group :deep(.ant-select) {
  min-width: 100px;
}

.filter-group :deep(.ant-select-selector) {
  border-radius: 6px !important;
  border-color: #e8e8e8 !important;
  transition: all 0.3s ease;
}

.filter-group :deep(.ant-select-selector:hover) {
  border-color: #ffa940 !important;
}

.filter-group :deep(.ant-select-focused .ant-select-selector) {
  border-color: #fa8c16 !important;
  box-shadow: 0 0 0 2px rgba(250, 140, 22, 0.2) !important;
}

/* 标签选择特殊样式 */
.filter-group :deep(.ant-select-multiple .ant-select-selection-item) {
  background: #fff7e6;
  border-color: #ffd591;
  color: #fa8c16;
}

/* 筛选标签展示区域 */
.active-filters {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.filter-info {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.clear-filters-btn {
  color: #fa8c16;
  padding: 0 4px;
  height: auto;
}

.clear-filters-btn:hover {
  color: #fd9a30;
}

/* 菜谱展示区域 */
.recipe-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.sort-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.results-count {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

/* 排序按钮组样式 */
.sort-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-label {
  color: rgba(0, 0, 0, 0.65);
}

/* 按钮组整体样式 */
.sort-controls :deep(.ant-radio-group) {
  border: none !important;
  border-radius: 6px;
  overflow: hidden;
  display: inline-flex;
}

/* 按钮基础样式 */
.sort-controls :deep(.ant-radio-button-wrapper) {
  border: 1px solid #fa8c16 !important;
  color: rgba(0, 0, 0, 0.65);
  position: relative;
  transition: all 0.25s ease-in-out !important;
  margin-right: -1px;
  background-color: #fff !important;
}

/* 第一个按钮左侧圆角 */
.sort-controls :deep(.ant-radio-button-wrapper:first-child) {
  border-radius: 6px 0 0 6px !important;
}

/* 最后一个按钮右侧圆角 */
.sort-controls :deep(.ant-radio-button-wrapper:last-child) {
  border-radius: 0 6px 6px 0 !important;
  margin-right: 0;
}

/* 按钮悬停样式 */
.sort-controls :deep(.ant-radio-button-wrapper:hover) {
  color: #fa8c16 !important;
  z-index: 1;
}

/* 按钮选中样式 */
.sort-controls :deep(.ant-radio-button-wrapper-checked) {
  background: #fa8c16 !important;
  border-color: #fa8c16 !important;
  color: #fff !important;
  z-index: 2 !important;
  box-shadow: -1px 0 0 0 #fa8c16 !important;
}

/* 处理按钮间的分隔线 */
.sort-controls :deep(.ant-radio-button-wrapper:not(:first-child)::before) {
  background-color: #fa8c16 !important;
  width: 1px;
  height: 100%;
}

/* 选中按钮的分隔线处理 */
.sort-controls :deep(.ant-radio-button-wrapper-checked:not(:first-child)::before) {
  background-color: #fa8c16 !important;
  opacity: 0;
}

/* 选中按钮的相邻元素分隔线处理 */
.sort-controls :deep(.ant-radio-button-wrapper-checked + .ant-radio-button-wrapper::before) {
  background-color: #fa8c16 !important;
  opacity: 0;
}

/* 选中按钮悬停样式 */
.sort-controls :deep(.ant-radio-button-wrapper-checked:hover) {
  background: #ffa940 !important;
  border-color: #ffa940 !important;
  color: #fff !important;
}

/* 聚焦状态 */
.sort-controls :deep(.ant-radio-button-wrapper:focus-within) {
  outline: none;
}

/* 解决特殊状态下的样式问题 */
.sort-controls :deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)) {
  border-color: #fa8c16 !important;
  box-shadow: -1px 0 0 0 #fa8c16 !important;
}

/* 修复后续按钮的边框颜色 */
.sort-controls :deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover) {
  border-color: #ffa940 !important;
}

/* 菜谱网格 */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
  transition: opacity 0.3s ease-out;
}

.recipe-wrapper {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.recipe-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.no-results {
  grid-column: span 4;
  padding: 40px 0;
  text-align: center;
}

/* 添加淡入淡出效果的类 */
.recipe-grid.fade-enter-active,
.recipe-grid.fade-leave-active {
  transition: opacity 0.3s ease;
}

.recipe-grid.fade-enter-from,
.recipe-grid.fade-leave-to {
  opacity: 0;
}

/* 菜谱卡片依次显示的动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* 分页颜色修复 */
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

:deep(.ant-pagination-prev:hover .ant-pagination-item-link),
:deep(.ant-pagination-next:hover .ant-pagination-item-link) {
  border-color: #fa8c16 !important;
  color: #fa8c16 !important;
}

:deep(.ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-link-icon),
:deep(.ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-link-icon) {
  color: #fa8c16 !important;
}

:deep(.ant-pagination-options-quick-jumper input:focus),
:deep(.ant-pagination-options-quick-jumper input:hover) {
  border-color: #fa8c16 !important;
  box-shadow: 0 0 0 2px rgba(250, 140, 22, 0.2) !important;
}

/* 加载状态样式 */
:deep(.ant-spin-dot-item) {
  background-color: #fa8c16 !important;
}

:deep(.ant-spin-text) {
  color: #fa8c16 !important;
}

/* 空状态按钮 */
:deep(.ant-empty .ant-btn-primary) {
  background-color: #fa8c16 !important;
  border-color: #fa8c16 !important;
}

:deep(.ant-empty .ant-btn-primary:hover) {
  background-color: #ffa940 !important;
  border-color: #ffa940 !important;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .recipe-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .no-results {
    grid-column: span 3;
  }
}

@media (max-width: 992px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .no-results {
    grid-column: span 2;
  }

  .sort-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-box {
    max-width: 100%;
  }
}

@media (max-width: 576px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .no-results {
    grid-column: span 1;
  }

  .filter-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filter-group {
    width: 100%;
  }

  .sort-controls {
    width: 100%;
  }

  .sort-controls :deep(.ant-radio-group) {
    width: 100%;
    display: flex;
  }

  .sort-controls :deep(.ant-radio-button-wrapper) {
    flex: 1;
    text-align: center;
  }
}
</style>