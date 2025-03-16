<!-- MyRecipes.vue -->
<template>
  <div class="my-recipes">
    <!-- 标题和创建按钮区域 -->
    <div class="page-header">
      <h2 class="page-title">我的菜谱</h2>
      <a-button type="primary" class="create-btn">
        <plus-outlined />
        创建新菜谱
      </a-button>
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
      <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
        <div class="recipe-image-container">
          <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
          <heart-outlined
              v-if="!recipe.favorite"
              class="favorite-icon"
              @click="toggleFavorite(recipe.id)"
          />
          <heart-filled
              v-else
              class="favorite-icon favorite-active"
              @click="toggleFavorite(recipe.id)"
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
          <a-button type="text" class="action-btn" @click="editRecipe(recipe.id)">
            <edit-outlined />
          </a-button>
          <a-button type="text" class="action-btn" @click="shareRecipe(recipe.id)">
            <share-alt-outlined />
          </a-button>
          <a-button type="text" class="action-btn" @click="deleteRecipe(recipe.id)">
            <delete-outlined />
          </a-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="recipes.length === 0" class="empty-state">
      <a-empty description="还没有菜谱，开始创建吧！" />
      <a-button type="primary" class="create-empty-btn">
        <plus-outlined />
        创建第一个菜谱
      </a-button>
    </div>

    <!-- 分页控件 -->
    <div class="pagination-container">
      <a-pagination
          v-model:current="current"
          :total="total"
          :pageSize="pageSize"
          show-quick-jumper
      />
    </div>

    <!-- 统计数据 -->
    <div class="stats-section">
      <div class="stats-row">
        <div class="stats-card">
          <h3 class="stats-title">菜谱统计</h3>
          <div class="stats-content">
            <div class="stat-item">
              <div class="stat-label">创建菜谱</div>
              <div class="stat-value">24</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">收藏菜谱</div>
              <div class="stat-value">56</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">总浏览量</div>
              <div class="stat-value">2,894</div>
            </div>
          </div>
          <div class="view-more">
            <a href="#" class="link-text">查看更详细的图表</a>
          </div>
        </div>

        <div class="stats-card">
          <h3 class="stats-title">食材使用统计</h3>
          <div class="ingredient-stats">
            <div class="ingredient-item">
              <span class="ingredient-name">西兰花</span>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: 70%"></div>
              </div>
              <span class="ingredient-percentage">70%</span>
            </div>
            <div class="ingredient-item">
              <span class="ingredient-name">番茄</span>
              <div class="progress-bar-container">
                <div class="progress-bar tomato-bar" style="width: 60%"></div>
              </div>
              <span class="ingredient-percentage">60%</span>
            </div>
            <div class="ingredient-item">
              <span class="ingredient-name">鸡蛋</span>
              <div class="progress-bar-container">
                <div class="progress-bar egg-bar" style="width: 45%"></div>
              </div>
              <span class="ingredient-percentage">45%</span>
            </div>
            <div class="ingredient-item">
              <span class="ingredient-name">牛肉</span>
              <div class="progress-bar-container">
                <div class="progress-bar beef-bar" style="width: 30%"></div>
              </div>
              <span class="ingredient-percentage">30%</span>
            </div>
          </div>
        </div>

        <div class="stats-card">
          <h3 class="stats-title">烹饪习惯</h3>
          <div class="habit-stats">
            <div class="habit-item">
              <div class="habit-icon">
                <clock-circle-outlined />
              </div>
              <div class="habit-info">
                <div class="habit-label">平均烹饪时间</div>
                <div class="habit-value">35分钟/餐</div>
              </div>
            </div>
            <div class="habit-item">
              <div class="habit-icon">
                <fire-outlined />
              </div>
              <div class="habit-info">
                <div class="habit-label">最常烹饪风格</div>
                <div class="habit-value">家常菜(45%)</div>
              </div>
            </div>
            <div class="habit-item">
              <div class="habit-icon">
                <calendar-outlined />
              </div>
              <div class="habit-info">
                <div class="habit-label">本月烹饪次数</div>
                <div class="habit-value">18次</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import {
  PlusOutlined,
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  DownOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FireOutlined
} from '@ant-design/icons-vue';
import { Tag, message } from 'ant-design-vue';

// 标签页状态
const activeTab = ref('created');

// 分页状态
const current = ref(1);
const total = ref(24);
const pageSize = ref(6);

// 筛选状态
const filter = reactive({
  category: 'all',
  difficulty: 'all',
  time: 'all',
  sort: 'latest'
});

// 模拟菜谱数据
const recipes = ref([
  {
    id: 1,
    title: '蒜蓉西兰花',
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 15,
    date: '2025.02.18',
    difficulty: '简单',
    description: '清爽爽口的西兰花配上香浓蒜香，简单健康的家常小菜',
    favorite: false
  },
  {
    id: 2,
    title: '番茄炖牛腩',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 90,
    date: '2025.03.05',
    difficulty: '中等',
    description: '酸甜开胃的番茄配上软烂入味的牛腩，营养又美味的家常菜',
    favorite: true
  },
  {
    id: 3,
    title: '蒜香面包',
    image: 'https://images.unsplash.com/photo-1619535860434-620c45ecc6ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 120,
    date: '2025.02.28',
    difficulty: '困难',
    description: '香酥可口的自制蒜香面包，有嚼劲的面团配上浓郁的蒜香香味',
    favorite: true
  },
  {
    id: 4,
    title: '芒果班戟',
    image: 'https://images.unsplash.com/photo-1601312540934-ba2c0b5c9743?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 45,
    date: '2025.01.15',
    difficulty: '中等',
    description: '香甜的芒果配上松软的班戟皮，口感丰富水果的甜蜜组合',
    favorite: false
  },
  {
    id: 5,
    title: '香煎三文鱼',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 20,
    date: '2025.03.10',
    difficulty: '简单',
    description: '外酥里嫩的三文鱼，简单又营养，搭配时蔬是完美的轻食晚餐',
    favorite: false
  },
  {
    id: 6,
    title: '培根奶油意面',
    image: 'https://images.unsplash.com/photo-1618889482923-38250401a84e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 25,
    date: '2025.02.05',
    difficulty: '简单',
    description: '经典的意式料理，奶香浓郁的酱汁配上培根十足的意面',
    favorite: true
  }
]);

// 切换收藏状态
const toggleFavorite = (id: number) => {
  const recipe = recipes.value.find(recipe => recipe.id === id);
  if (recipe) {
    recipe.favorite = !recipe.favorite;
    message.success(recipe.favorite ? '已添加到收藏' : '已取消收藏');
  }
};

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

// 筛选和排序处理函数
const handleCategoryChange = (e: any) => {
  filter.category = e.key;
  fetchRecipes();
};

const handleDifficultyChange = (e: any) => {
  filter.difficulty = e.key;
  fetchRecipes();
};

const handleTimeChange = (e: any) => {
  filter.time = e.key;
  fetchRecipes();
};

const handleSortChange = (e: any) => {
  filter.sort = e.key;
  fetchRecipes();
};

// 模拟获取菜谱数据
const fetchRecipes = () => {
  // 实际项目中这里会请求后端API
  console.log('Fetching recipes with filters:', filter);
  // 模拟加载延迟
  setTimeout(() => {
    // 这里应该根据筛选条件更新recipes数据
  }, 300);
};

// 编辑菜谱
const editRecipe = (id: number) => {
  console.log('编辑菜谱', id);
  // 实际项目中跳转到编辑页面
  // router.push(`/edit-recipe/${id}`);
};

// 分享菜谱
const shareRecipe = (id: number) => {
  message.success('分享链接已复制到剪贴板');
};

// 删除菜谱
const deleteRecipe = (id: number) => {
  // 实际项目中会有确认对话框
  message.success('菜谱已删除');
  recipes.value = recipes.value.filter(recipe => recipe.id !== id);
};

// 生命周期钩子
onMounted(() => {
  fetchRecipes();
});
</script>

<style scoped>
.my-recipes {
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

.create-btn {
  background-color: #FF9966;
  border-color: #FF9966;
  color: white;
  border-radius: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.create-btn:hover {
  background-color: #FF8044;
  border-color: #FF8044;
}


:deep(.ant-tabs-nav) {
  margin-bottom: 20px !important;
}

:deep(.ant-tabs-nav::before) {
  border-bottom: none !important;
}

:deep(.ant-tabs-nav-list) {
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
}

:deep(.ant-tabs-tab) {
  padding: 12px 0 !important;
  margin: 0 !important;
  margin-right: 32px !important;
}

:deep(.ant-tabs-tab-btn) {
  font-size: 15px;
  color: #999 !important;
  transition: color 0.3s;
}

:deep(.ant-tabs-tab:hover .ant-tabs-tab-btn) {
  color: #FF9966 !important;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #FF9966 !important;
  font-weight: normal;
}

:deep(.ant-tabs-ink-bar) {
  background-color: #FF9966 !important;
  height: 2px !important;
  bottom: 0 !important;
}

/* 确保标签下方有完整的底部边框 */
:deep(.ant-tabs-nav-list::after) {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #f0f0f0;
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
  color: #999;
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

.create-empty-btn {
  margin-top: 24px;
  background-color: #FF9966;
  border-color: #FF9966;
  color: white;
  border-radius: 20px;
  font-weight: 500;
}

.create-empty-btn:hover {
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

/* 统计区域 */
.stats-section {
  margin-top: 40px;
  margin-bottom: 24px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.stats-card {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stats-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.stats-content {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.view-more {
  text-align: center;
  margin-top: 16px;
}

.link-text {
  color: #FF9966;
  font-size: 14px;
  text-decoration: none;
}

.link-text:hover {
  text-decoration: underline;
}

/* 食材统计 */
.ingredient-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ingredient-name {
  width: 60px;
  font-size: 14px;
  color: #666;
}

.progress-bar-container {
  flex: 1;
  height: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #52C41A;
  border-radius: 4px;
}

.tomato-bar {
  background-color: #FF9966;
}

.egg-bar {
  background-color: #FAAD14;
}

.beef-bar {
  background-color: #FF4D4F;
}

.ingredient-percentage {
  font-size: 14px;
  color: #666;
  width: 40px;
  text-align: right;
}

/* 烹饪习惯统计 */
.habit-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.habit-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.habit-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #FFF4E6;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FF9966;
  font-size: 18px;
}

.habit-info {
  flex: 1;
}

.habit-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 2px;
}

.habit-value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-card:last-child {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }

  .stats-card:last-child {
    grid-column: span 1;
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