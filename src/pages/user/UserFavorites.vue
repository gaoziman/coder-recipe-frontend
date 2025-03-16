<!-- UserFavorites.vue -->
<template>
  <div class="my-favorites">
    <!-- 标题和创建按钮区域 -->
    <div class="page-header">
      <h2 class="page-title">我的收藏</h2>
    </div>

    <!-- 筛选和排序区域 -->
    <div class="filter-section">
      <div class="filters">
        <a-dropdown>
          <a-button class="filter-btn">
            所有分类
            <down-outlined />
          </a-button>
          <template #overlay>
            <a-menu @click="handleCategoryChange">
              <a-menu-item key="all">所有分类</a-menu-item>
              <a-menu-item key="main">主菜</a-menu-item>
              <a-menu-item key="appetizer">开胃菜</a-menu-item>
              <a-menu-item key="soup">汤品</a-menu-item>
              <a-menu-item key="dessert">甜点</a-menu-item>
              <a-menu-item key="breakfast">早餐</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-dropdown>
          <a-button class="filter-btn">
            所有难度
            <down-outlined />
          </a-button>
          <template #overlay>
            <a-menu @click="handleDifficultyChange">
              <a-menu-item key="all">所有难度</a-menu-item>
              <a-menu-item key="easy">简单</a-menu-item>
              <a-menu-item key="medium">中等</a-menu-item>
              <a-menu-item key="hard">困难</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-dropdown>
          <a-button class="filter-btn">
            所有时间
            <down-outlined />
          </a-button>
          <template #overlay>
            <a-menu @click="handleTimeChange">
              <a-menu-item key="all">所有时间</a-menu-item>
              <a-menu-item key="30">30分钟以内</a-menu-item>
              <a-menu-item key="60">30-60分钟</a-menu-item>
              <a-menu-item key="90">60-90分钟</a-menu-item>
              <a-menu-item key="more">90分钟以上</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>

      <div class="sort-control">
        <span>排序：</span>
        <a-dropdown>
          <a-button class="sort-btn">
            最近更新
            <down-outlined />
          </a-button>
          <template #overlay>
            <a-menu @click="handleSortChange">
              <a-menu-item key="latest">最近更新</a-menu-item>
              <a-menu-item key="popular">最受欢迎</a-menu-item>
              <a-menu-item key="time-asc">烹饪时间 ↑</a-menu-item>
              <a-menu-item key="time-desc">烹饪时间 ↓</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>

    <!-- 菜谱卡片网格 -->
    <div class="recipe-grid">
      <div v-for="recipe in favoriteRecipes" :key="recipe.id" class="recipe-card">
        <div class="recipe-image-container">
          <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
          <heart-filled
              class="favorite-icon favorite-active"
              @click="removeFromFavorites(recipe.id)"
          />
        </div>

        <div class="recipe-content">
          <h3 class="recipe-title">{{ recipe.title }}</h3>
          <div class="recipe-meta">
            <span class="cooking-time">
              <clock-circle-outlined /> {{ recipe.cookingTime }}分钟
            </span>
            <span class="publish-date">
              <calendar-outlined /> {{ recipe.date }}
            </span>
          </div>
          <p class="recipe-description">{{ recipe.description }}</p>
          <div class="recipe-difficulty">
            <tag :color="getDifficultyColor(recipe.difficulty)">{{ recipe.difficulty }}</tag>
          </div>
        </div>

        <div class="recipe-actions">
          <a-button type="text" class="action-btn" @click="viewRecipeDetail(recipe.id)">
            <eye-outlined />
          </a-button>
          <a-button type="text" class="action-btn" @click="shareRecipe(recipe.id)">
            <share-alt-outlined />
          </a-button>
          <a-button type="text" class="action-btn" @click="removeFromFavorites(recipe.id)">
            <delete-outlined />
          </a-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="favoriteRecipes.length === 0" class="empty-state">
      <a-empty description="还没有收藏任何菜谱" />
      <a-button type="primary" class="browse-btn" @click="browseRecipes">
        <search-outlined />
        浏览菜谱
      </a-button>
    </div>

    <!-- 分页控件 -->
    <div v-if="favoriteRecipes.length > 0" class="pagination-container">
      <a-pagination
          v-model:current="current"
          :total="total"
          :pageSize="pageSize"
          show-quick-jumper
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  HeartFilled,
  EyeOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  DownOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  SearchOutlined
} from '@ant-design/icons-vue';
import { Tag, message } from 'ant-design-vue';

const router = useRouter();

// 分页状态
const current = ref(1);
const total = ref(12);
const pageSize = ref(6);

// 筛选状态
const filter = reactive({
  category: 'all',
  difficulty: 'all',
  time: 'all',
  sort: 'latest'
});

// 模拟收藏的菜谱数据
const favoriteRecipes = ref([
  {
    id: 1,
    title: '番茄炖牛腩',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 90,
    date: '2025.03.05',
    difficulty: '中等',
    description: '酸甜开胃的番茄配上软烂入味的牛腩，营养又美味的家常菜',
    author: '味见好时光'
  },
  {
    id: 2,
    title: '蒜香面包',
    image: 'https://images.unsplash.com/photo-1619535860434-620c45ecc6ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 120,
    date: '2025.02.28',
    difficulty: '困难',
    description: '香酥可口的自制蒜香面包，有嚼劲的面团配上浓郁的蒜香香味',
    author: '面包达人'
  },
  {
    id: 3,
    title: '培根奶油意面',
    image: 'https://images.unsplash.com/photo-1618889482923-38250401a84e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 25,
    date: '2025.02.05',
    difficulty: '简单',
    description: '经典的意式料理，奶香浓郁的酱汁配上培根十足的意面',
    author: '意厨先生'
  }
]);

// 获取难度对应的颜色
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case '简单':
      return 'green';
    case '中等':
      return 'orange';
    case '困难':
      return 'red';
    default:
      return 'default';
  }
};

// 从收藏中移除
const removeFromFavorites = (id: number) => {
  favoriteRecipes.value = favoriteRecipes.value.filter(recipe => recipe.id !== id);
  message.success('已从收藏中移除');
};

// 查看菜谱详情
const viewRecipeDetail = (id: number) => {
  router.push(`/recipes/${id}`);
};

// 分享菜谱
const shareRecipe = (id: number) => {
  message.success('分享链接已复制到剪贴板');
};

// 浏览菜谱
const browseRecipes = () => {
  router.push('/recipes');
};

// 筛选和排序处理函数
const handleCategoryChange = (e: any) => {
  filter.category = e.key;
  fetchFavoriteRecipes();
};

const handleDifficultyChange = (e: any) => {
  filter.difficulty = e.key;
  fetchFavoriteRecipes();
};

const handleTimeChange = (e: any) => {
  filter.time = e.key;
  fetchFavoriteRecipes();
};

const handleSortChange = (e: any) => {
  filter.sort = e.key;
  fetchFavoriteRecipes();
};

// 模拟获取收藏菜谱数据
const fetchFavoriteRecipes = () => {
  // 实际项目中这里会请求后端API
  console.log('Fetching favorite recipes with filters:', filter);
  // 模拟加载延迟
  setTimeout(() => {
    // 这里应该根据筛选条件更新favoriteRecipes数据
  }, 300);
};

// 生命周期钩子
onMounted(() => {
  fetchFavoriteRecipes();
});
</script>

<style scoped>
.my-favorites {
  width: 100%;
}

/* 头部样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 筛选和排序区域 */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filters {
  display: flex;
  gap: 12px;
}

.filter-btn, .sort-btn {
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  background-color: #fff;
  transition: all 0.3s;
  height: 32px;
  border: 1px solid #e8e8e8;
}

.filter-btn:hover, .sort-btn:hover {
  color: #FF9966;
  border-color: #FF9966;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

/* 菜谱卡片网格 */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.recipe-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
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
  transition: transform 0.5s;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.favorite-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.favorite-icon:hover {
  background-color: white;
  transform: scale(1.1);
}

.favorite-active {
  color: #FF4D4F;
}

.recipe-content {
  padding: 16px;
}

.recipe-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.recipe-meta {
  display: flex;
  gap: 16px;
  color: #999;
  font-size: 13px;
  margin-bottom: 10px;
}

.cooking-time, .publish-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.recipe-description {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recipe-difficulty {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}

.recipe-actions {
  padding: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  color: #666;
  font-size: 16px;
}

.action-btn:hover {
  color: #FF9966;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.browse-btn {
  margin-top: 24px;
  background-color: #FF9966;
  border-color: #FF9966;
  color: white;
  border-radius: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.browse-btn:hover {
  background-color: #FF8044;
  border-color: #FF8044;
}

/* 分页容器 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin: 32px 0;
}

:deep(.ant-pagination-item-active) {
  border-color: #FF9966 !important;
}

:deep(.ant-pagination-item-active a) {
  color: #FF9966 !important;
}

:deep(.ant-pagination-item:hover) {
  border-color: #FF9966 !important;
}

:deep(.ant-pagination-item:hover a) {
  color: #FF9966 !important;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    flex-wrap: wrap;
  }

  .filter-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .sort-control {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>