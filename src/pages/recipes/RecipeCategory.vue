<!-- RecipeCategory.vue -->
<template>
  <div class="recipe-category-container">
    <!-- 添加面包屑导航 -->
    <recipe-breadcrumb />
    <!-- 分类导航 -->
    <div class="category-nav">
      <a-tabs v-model:activeKey="activeCategory" class="category-tabs">
        <a-tab-pane key="all" tab="全部分类"></a-tab-pane>
        <a-tab-pane key="main" tab="主食"></a-tab-pane>
        <a-tab-pane key="meat" tab="肉类"></a-tab-pane>
        <a-tab-pane key="vegetable" tab="蔬菜"></a-tab-pane>
        <a-tab-pane key="soup" tab="汤品"></a-tab-pane>
        <a-tab-pane key="dessert" tab="甜点"></a-tab-pane>
        <a-tab-pane key="breakfast" tab="早餐"></a-tab-pane>
        <a-tab-pane key="seafood" tab="海鲜"></a-tab-pane>
      </a-tabs>
    </div>

    <!-- 筛选和排序区域 -->
    <div class="filter-section">
      <div class="filters">
        <a-dropdown>
          <a-button class="filter-btn">
            {{ filterLabels.difficulty }}
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
            {{ filterLabels.time }}
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

        <a-input-search
            v-model:value="searchText"
            placeholder="搜索菜谱名称或食材"
            class="search-input"
            @search="handleSearch"
        />
      </div>

      <div class="sort-control">
        <span>排序：</span>
        <a-dropdown>
          <a-button class="sort-btn">
            {{ sortLabel }}
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

    <!-- 活跃筛选标签 -->
    <div v-if="hasActiveFilters" class="active-filters">
      <div class="active-filter-label">已选筛选条件：</div>
      <div class="filter-tags">
        <a-tag v-if="activeCategory !== 'all'" closable @close="resetCategoryFilter">
          <apartment-outlined /> {{ getCategoryName(activeCategory) }}
        </a-tag>
        <a-tag v-if="filter.difficulty !== 'all'" closable @close="resetDifficultyFilter">
          <fire-outlined /> {{ filterLabels.difficulty }}
        </a-tag>
        <a-tag v-if="filter.time !== 'all'" closable @close="resetTimeFilter">
          <clock-circle-outlined /> {{ filterLabels.time }}
        </a-tag>
        <a-tag v-if="searchText" closable @close="resetSearch">
          <search-outlined /> "{{ searchText }}"
        </a-tag>
        <a-button v-if="hasActiveFilters" type="link" class="clear-all-btn" @click="resetAllFilters">
          清除全部
        </a-button>
      </div>
    </div>

    <!-- 当前分类信息 -->
    <div class="category-info-card" v-if="activeCategory !== 'all'">
      <div class="category-header">
        <div class="category-icon" :class="getCategoryIconClass(activeCategory)">
          <component :is="getCategoryIcon(activeCategory)" />
        </div>
        <div class="category-details">
          <h2 class="category-title">{{ getCategoryName(activeCategory) }}</h2>
          <p class="category-description">{{ getCategoryDescription(activeCategory) }}</p>
        </div>
      </div>
      <div class="category-stats">
        <div class="category-stat-item">
          <div class="stat-value">{{ getCategoryStats(activeCategory).count }}</div>
          <div class="stat-label">菜谱数量</div>
        </div>
        <div class="category-stat-item">
          <div class="stat-value">{{ getCategoryStats(activeCategory).averageTime }}分钟</div>
          <div class="stat-label">平均烹饪时间</div>
        </div>
        <div class="category-stat-item">
          <div class="stat-value">{{ getCategoryStats(activeCategory).favorite }}</div>
          <div class="stat-label">收藏数量</div>
        </div>
      </div>
    </div>

    <!-- 热门子分类 -->
    <div class="subcategory-section" v-if="activeCategory === 'all' || activeCategory === 'main'">
      <div class="section-header">
        <h2 class="section-title">
          <fire-outlined class="section-icon" />
          热门子分类
        </h2>
        <a-button type="link" class="view-all-btn" @click="handleViewAll('subcategories')">
          查看全部
          <right-outlined />
        </a-button>
      </div>
      <div class="subcategory-list">
        <div class="subcategory-card" v-for="subcat in subcategories" :key="subcat.id" @click="handleSubcategoryClick(subcat.key)">
          <div class="subcategory-image-container">
            <img :src="subcat.image" :alt="subcat.name" class="subcategory-image" />
          </div>
          <div class="subcategory-content">
            <h3 class="subcategory-name">{{ subcat.name }}</h3>
            <div class="subcategory-count">{{ subcat.count }}个菜谱</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 菜谱卡片网格 -->
    <div class="list-header">
      <h2 class="list-title">
        <book-outlined class="section-icon" />
        {{ activeCategory === 'all' ? '所有分类菜谱' : getCategoryName(activeCategory) + '菜谱' }}
        <span class="recipe-count">共 {{ total }} 个</span>
      </h2>
      <div class="view-switch">
        <a-tooltip title="列表视图">
          <a-button
              class="view-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
          >
            <unordered-list-outlined />
          </a-button>
        </a-tooltip>
        <a-tooltip title="网格视图">
          <a-button
              class="view-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
          >
            <appstore-outlined />
          </a-button>
        </a-tooltip>
      </div>
    </div>

    <div v-if="isLoading" class="loading-container">
      <a-spin tip="加载中..."></a-spin>
    </div>

    <div v-else-if="recipes.length === 0" class="empty-state">
      <a-empty description="没有找到符合条件的菜谱" />
      <a-button type="primary" class="create-empty-btn" @click="resetAllFilters">
        <reload-outlined />
        重置筛选条件
      </a-button>
    </div>

    <div v-else :class="['recipe-container', viewMode === 'list' ? 'list-view' : 'grid-view']">
      <div
          v-for="recipe in recipes"
          :key="recipe.id"
          :class="['recipe-card', { 'new-recipe': isNewRecipe(recipe.date) }]"
          @click="viewRecipeDetail(recipe.id)"
      >
        <div class="recipe-image-container">
          <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
          <heart-outlined
              v-if="!recipe.favorite"
              class="favorite-icon"
              @click.stop="toggleFavorite(recipe.id)"
          />
          <heart-filled
              v-else
              class="favorite-icon favorite-active"
              @click.stop="toggleFavorite(recipe.id)"
          />
          <div v-if="isNewRecipe(recipe.date)" class="new-badge">新</div>
        </div>

        <div class="recipe-content">
          <h3 class="recipe-title">{{ recipe.title }}</h3>
          <div class="recipe-meta">
            <span class="cooking-time">
              <clock-circle-outlined /> {{ recipe.cookingTime }}分钟
            </span>
            <span class="publish-date">
              <calendar-outlined /> {{ formatDate(recipe.date) }}
            </span>
          </div>
          <p class="recipe-description">{{ recipe.description }}</p>
          <div class="recipe-tags">
            <tag :color="getDifficultyColor(recipe.difficulty)">{{ recipe.difficulty }}</tag>
            <tag color="cyan">{{ getCategoryName(recipe.category) }}</tag>
            <tag v-if="recipe.favorite" color="red">收藏</tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页控件 -->
    <div class="pagination-container">
      <a-pagination
          v-model:current="current"
          :total="total"
          :pageSize="pageSize"
          show-quick-jumper
          :showTotal="total => `共 ${total} 个菜谱`"
          @change="handlePageChange"
      />
    </div>

    <!-- 分类趋势 -->
    <div class="category-trends-section">
      <div class="section-header">
        <h2 class="section-title">
          <rise-outlined class="section-icon" />
          分类趋势分析
        </h2>
      </div>
      <div class="trends-cards">
        <div class="trends-card">
          <div class="trends-card-header">
            <h3 class="trends-title">热门分类排行</h3>
            <a-dropdown>
              <a-button type="text" class="more-btn">
                <more-outlined />
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">导出数据</a-menu-item>
                  <a-menu-item key="2">详细报告</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div class="trend-items">
            <div class="trend-item" v-for="(trend, index) in categoryTrends" :key="trend.category">
              <div class="trend-rank">{{ index + 1 }}</div>
              <div class="trend-icon" :class="getCategoryIconClass(trend.category)">
                <component :is="getCategoryIcon(trend.category)" />
              </div>
              <div class="trend-info">
                <div class="trend-name">{{ getCategoryName(trend.category) }}</div>
                <div class="trend-progress-container">
                  <div class="trend-progress" :style="{ width: trend.percentage + '%' }"></div>
                </div>
              </div>
              <div class="trend-percentage">{{ trend.percentage }}%</div>
              <div class="trend-change" :class="{'trend-up': trend.change > 0, 'trend-down': trend.change < 0}">
                <arrow-up-outlined v-if="trend.change > 0" />
                <arrow-down-outlined v-else-if="trend.change < 0" />
                {{ Math.abs(trend.change) }}%
              </div>
            </div>
          </div>
        </div>

        <div class="trends-card">
          <div class="trends-card-header">
            <h3 class="trends-title">季节性推荐</h3>
            <a-dropdown>
              <a-button type="text" class="more-btn">
                <more-outlined />
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">查看日历</a-menu-item>
                  <a-menu-item key="2">季节建议</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div class="season-banner">
            <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="春季食材" class="season-image" />
            <div class="season-overlay">
              <h3 class="season-title">春季时令食材</h3>
              <p class="season-description">春笋、菠菜、草莓、春韭...</p>
              <a-button type="primary" class="season-btn">探索春季菜谱</a-button>
            </div>
          </div>
          <div class="season-tags">
            <a-tag color="green" class="season-tag">春笋</a-tag>
            <a-tag color="green" class="season-tag">菠菜</a-tag>
            <a-tag color="magenta" class="season-tag">草莓</a-tag>
            <a-tag color="green" class="season-tag">春韭</a-tag>
            <a-tag color="cyan" class="season-tag">时令鱼类</a-tag>
            <a-tag color="gold" class="season-tag">柠檬</a-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类推荐 -->
    <div class="suggestion-section">
      <div class="section-header">
        <h2 class="section-title">
          <bulb-outlined class="section-icon" />
          为你推荐
        </h2>
      </div>
      <div class="suggestion-cards">
        <div class="suggestion-card">
          <div class="suggestion-icon">
            <fire-outlined />
          </div>
          <div class="suggestion-content">
            <h3 class="suggestion-title">探索新分类</h3>
            <p class="suggestion-desc">根据您的浏览历史，我们推荐您尝试"亚洲风味"分类下的菜谱。</p>
            <a-button type="link" class="suggestion-link">查看分类 <right-outlined /></a-button>
          </div>
        </div>
        <div class="suggestion-card">
          <div class="suggestion-icon">
            <experiment-outlined />
          </div>
          <div class="suggestion-content">
            <h3 class="suggestion-title">定制您的分类</h3>
            <p class="suggestion-desc">创建您自己的分类，更好地组织和管理您的菜谱收藏。</p>
            <a-button type="link" class="suggestion-link">创建分类 <right-outlined /></a-button>
          </div>
        </div>
        <div class="suggestion-card">
          <div class="suggestion-icon">
            <schedule-outlined />
          </div>
          <div class="suggestion-content">
            <h3 class="suggestion-title">分类收藏</h3>
            <p class="suggestion-desc">您有3个常用分类尚未添加到收藏，需要现在添加吗？</p>
            <a-button type="link" class="suggestion-link">添加到收藏 <right-outlined /></a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import {
  PlusOutlined,
  HeartOutlined,
  HeartFilled,
  DownOutlined,
  RightOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FireOutlined,
  SearchOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  BookOutlined,
  MoreOutlined,
  BulbOutlined,
  ExperimentOutlined,
  ScheduleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ApartmentOutlined,
  RiseOutlined,
  CoffeeOutlined,
  ShopOutlined,
  PieChartOutlined,
  ForkOutlined,
  BugOutlined,
  CrownOutlined
} from '@ant-design/icons-vue';
import { Tag, message } from 'ant-design-vue';
import RecipeBreadcrumb from "@/components/common/RecipeBreadcrumb.vue";
import router from "@/router";

// 当前活跃分类
const activeCategory = ref('all');

// 视图模式
const viewMode = ref('grid'); // 'grid' 或 'list'

// 搜索
const searchText = ref('');

// 分页状态
const current = ref(1);
const total = ref(24);
const pageSize = ref(6);

// 加载状态
const isLoading = ref(false);

// 筛选状态
const filter = reactive({
  difficulty: 'all',
  time: 'all',
  sort: 'latest'
});

// 筛选标签显示文本
const filterLabels = reactive({
  difficulty: '所有难度',
  time: '所有时间'
});

// 排序标签显示文本
const sortLabel = ref('最近更新');

// 判断是否有活跃的筛选条件
const hasActiveFilters = computed(() => {
  return activeCategory.value !== 'all' ||
      filter.difficulty !== 'all' ||
      filter.time !== 'all' ||
      searchText.value.length > 0;
});

// 子分类数据
const subcategories = [
  {
    id: 1,
    key: 'rice',
    name: '米饭类',
    count: 16,
    image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 2,
    key: 'noodle',
    name: '面食类',
    count: 24,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 3,
    key: 'bread',
    name: '面包类',
    count: 12,
    image: 'https://images.unsplash.com/photo-1486887396153-fa416526c108?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: 4,
    key: 'dumpling',
    name: '饺子类',
    count: 8,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];

// 分类趋势数据
const categoryTrends = [
  { category: 'vegetable', percentage: 32, change: 5 },
  { category: 'dessert', percentage: 28, change: 3 },
  { category: 'meat', percentage: 24, change: -2 },
  { category: 'soup', percentage: 18, change: 1 },
  { category: 'seafood', percentage: 16, change: 4 }
];

// 模拟菜谱数据
const recipes = ref([
  {
    id: 1,
    title: '蒜蓉西兰花',
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 15,
    date: '2025.03.17', // 今天，新菜谱
    difficulty: '简单',
    category: 'vegetable',
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
    category: 'meat',
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
    category: 'bread',
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
    category: 'dessert',
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
    category: 'seafood',
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
    category: 'pasta',
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

// 获取分类名称
const getCategoryName = (category: string) => {
  const categoryMap: Record<string, string> = {
    'all': '全部',
    'vegetable': '蔬菜',
    'meat': '肉类',
    'seafood': '海鲜',
    'pasta': '意面',
    'bread': '面包',
    'dessert': '甜点',
    'soup': '汤品',
    'breakfast': '早餐',
    'main': '主食',
    'rice': '米饭类',
    'noodle': '面食类',
    'dumpling': '饺子类'
  };
  return categoryMap[category] || '其他';
};

// 获取分类图标
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    'vegetable': BugOutlined,
    'meat': ForkOutlined,
    'seafood': CrownOutlined,
    'pasta': ShopOutlined,
    'bread': CoffeeOutlined,
    'dessert': CoffeeOutlined,
    'soup': PieChartOutlined,
    'breakfast': CoffeeOutlined,
    'main': ShopOutlined
  };
  return iconMap[category] || ApartmentOutlined;
};

// 获取分类图标样式类名
const getCategoryIconClass = (category: string) => {
  const classMap: Record<string, string> = {
    'vegetable': 'vegetable-icon',
    'meat': 'meat-icon',
    'seafood': 'seafood-icon',
    'pasta': 'pasta-icon',
    'bread': 'bread-icon',
    'dessert': 'dessert-icon',
    'soup': 'soup-icon',
    'breakfast': 'breakfast-icon',
    'main': 'main-icon'
  };
  return classMap[category] || '';
};

// 获取分类描述
const getCategoryDescription = (category: string) => {
  const descMap: Record<string, string> = {
    'vegetable': '新鲜健康的蔬菜类菜谱，提供多种营养搭配和烹饪方法，让您轻松享受蔬菜的美味。',
    'meat': '荤菜爱好者的天堂，包含各类肉食烹饪方法，从简单快手到大师级的复杂技巧。',
    'seafood': '各式海鲜菜谱，从基础的清蒸到复杂的炖煮，充分展现海鲜的鲜美。',
    'pasta': '意大利面的百变风味，从传统的番茄意面到创新的亚洲风味融合。',
    'bread': '从基础面包到创意甜点，探索面粉的无限可能性。',
    'dessert': '甜蜜诱人的甜点系列，从简单家常到精致法式甜点应有尽有。',
    'soup': '滋补养生的汤品菜谱，四季皆宜的美味与营养。',
    'breakfast': '开启美好一天的早餐食谱，快手简单又营养均衡。',
    'main': '餐桌上的主角，丰富多样的主食菜谱满足您的每一餐需求。'
  };
  return descMap[category] || '探索多样化的菜谱，找到适合您口味的美食灵感。';
};

// 获取分类统计数据
const getCategoryStats = (category: string) => {
  const statsMap: Record<string, any> = {
    'vegetable': { count: 32, averageTime: 25, favorite: 19 },
    'meat': { count: 28, averageTime: 45, favorite: 22 },
    'seafood': { count: 18, averageTime: 30, favorite: 13 },
    'pasta': { count: 14, averageTime: 35, favorite: 10 },
    'bread': { count: 12, averageTime: 90, favorite: 8 },
    'dessert': { count: 24, averageTime: 60, favorite: 18 },
    'soup': { count: 16, averageTime: 40, favorite: 11 },
    'breakfast': { count: 20, averageTime: 20, favorite: 15 },
    'main': { count: 40, averageTime: 30, favorite: 28 }
  };
  return statsMap[category] || { count: 0, averageTime: 0, favorite: 0 };
};

// 日期格式化
const formatDate = (dateStr: string) => {
  return dateStr.replace(/\./g, '-');
};

// 判断是否为新菜谱（7天内）
const isNewRecipe = (dateStr: string) => {
  const recipeDate = dayjs(dateStr.replace(/\./g, '-'));
  const today = dayjs();
  return today.diff(recipeDate, 'day') <= 7;
};

// 筛选和排序处理函数
const handleDifficultyChange = (e: any) => {
  filter.difficulty = e.key;
  filterLabels.difficulty = e.item.title || '所有难度';
  fetchRecipes();
};

const handleTimeChange = (e: any) => {
  filter.time = e.key;
  filterLabels.time = e.item.title || '所有时间';
  fetchRecipes();
};

const handleSortChange = (e: any) => {
  filter.sort = e.key;
  sortLabel.value = e.item.title || '最近更新';
  fetchRecipes();
};

const handleSearch = () => {
  if (searchText.value.trim()) {
    fetchRecipes();
  }
};

const handleSubcategoryClick = (key: string) => {
  console.log('选择子分类:', key);
  // 实际应用中可以根据key进行跳转或加载对应分类的菜谱
  message.success(`已选择"${key}"分类`);
};

// 重置筛选条件
const resetCategoryFilter = () => {
  activeCategory.value = 'all';
  fetchRecipes();
};

const resetDifficultyFilter = () => {
  filter.difficulty = 'all';
  filterLabels.difficulty = '所有难度';
  fetchRecipes();
};

const resetTimeFilter = () => {
  filter.time = 'all';
  filterLabels.time = '所有时间';
  fetchRecipes();
};

const resetSearch = () => {
  searchText.value = '';
  fetchRecipes();
};

const resetAllFilters = () => {
  activeCategory.value = 'all';
  filter.difficulty = 'all';
  filter.time = 'all';
  filterLabels.difficulty = '所有难度';
  filterLabels.time = '所有时间';
  searchText.value = '';
  fetchRecipes();
};

// 分页处理
const handlePageChange = (page: number) => {
  current.value = page;
  fetchRecipes();
};

// 查看全部
const handleViewAll = (section: string) => {
  console.log(`查看${section === 'subcategories' ? '子分类' : ''}全部内容`);
};

// 模拟获取菜谱数据
const fetchRecipes = () => {
  // 实际项目中这里会请求后端API
  console.log('Fetching recipes with category:', activeCategory.value, 'filters:', filter, 'search:', searchText.value, 'page:', current.value);
  isLoading.value = true;

  // 模拟加载延迟
  setTimeout(() => {
    // 这里应该根据筛选条件更新recipes数据
    isLoading.value = false;
  }, 500);
};

// 查看菜谱详情，实现路由跳转
const viewRecipeDetail = (id: number) => {
  console.log('查看菜谱详情', id);
  // 实际项目中跳转到详情页面
  router.push(`/recipes/${id}`);
};

// 生命周期钩子
onMounted(() => {
  fetchRecipes();
});
</script>

<style scoped>
/* 保留RecipeList.vue中的通用样式 */
.recipe-category-container {
  width: 100%;
  padding: 0 16px;
  max-width: 1400px;
  margin: 0 auto;
}


/* 分类导航 */
.category-nav {
  margin-bottom: 24px;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 16px;
}

:deep(.ant-tabs-tab) {
  font-size: 15px;
  padding: 12px 16px;
  transition: color 0.3s;
}

:deep(.ant-tabs-tab:hover) {
  color: #FF7043;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #FF7043;
  font-weight: 500;
}

:deep(.ant-tabs-ink-bar) {
  background-color: #FF7043;
}

/* 自定义标签页样式 - 这是为了处理可能存在的自定义标签页 */
.custom-tabs {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

.custom-tab-item {
  padding: 12px 16px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  color: #666;
}

.custom-tab-item:hover {
  color: #FF7043;
}

.custom-tab-item.active {
  color: #FF7043;
  font-weight: 500;
}

.custom-tab-item.active:after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #FF9966, #FF5E62);
}


/* 分类信息卡片 */
.category-info-card {
  background: linear-gradient(135deg, #FFF9F5, #FFF5F5);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.category-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #FFF0EB;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  color: #FF9966;
  flex-shrink: 0;
}

.vegetable-icon {
  background-color: #F6FFED;
  color: #52C41A;
}

.meat-icon {
  background-color: #FFF1F0;
  color: #FF4D4F;
}

.seafood-icon {
  background-color: #E6F7FF;
  color: #1890FF;
}

.dessert-icon {
  background-color: #FFF0F6;
  color: #EB2F96;
}

.soup-icon {
  background-color: #FCFFE6;
  color: #FAAD14;
}

.breakfast-icon {
  background-color: #FFF7E6;
  color: #FA8C16;
}

.category-details {
  flex: 1;
}

.category-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.category-description {
  color: #666;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

.category-stats {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.category-stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* 子分类部分 */
.subcategory-section {
  margin-bottom: 40px;
}

.subcategory-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.subcategory-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.subcategory-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.subcategory-image-container {
  height: 140px;
  overflow: hidden;
}

.subcategory-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.subcategory-card:hover .subcategory-image {
  transform: scale(1.05);
}

.subcategory-content {
  padding: 16px;
}

.subcategory-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.subcategory-count {
  font-size: 14px;
  color: #666;
}

/* 分类趋势部分 */
.category-trends-section {
  margin-bottom: 40px;
}

.trends-cards {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 24px;
}

.trends-card {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.trends-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FF9966, #FF5E62);
}

.trends-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.trends-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.trend-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.trend-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trend-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.trend-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}

.trend-info {
  flex: 1;
}

.trend-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.trend-progress-container {
  height: 6px;
  background-color: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
}

.trend-progress {
  height: 100%;
  background: linear-gradient(90deg, #FF9966, #FF5E62);
  border-radius: 3px;
}

.trend-percentage {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  width: 40px;
  text-align: right;
}

.trend-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  width: 50px;
}

.trend-up {
  color: #52C41A;
}

.trend-down {
  color: #FF4D4F;
}

/* 季节推荐部分 */
.season-banner {
  position: relative;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.season-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.season-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  color: white;
}

.season-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.season-description {
  font-size: 14px;
  margin: 0 0 16px 0;
}

.season-btn {
  align-self: flex-start;
  background: linear-gradient(135deg, #FF9966, #FF7043);
  border: none;
}

.season-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.season-tag {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 16px;
}

/* 保留RecipeList.vue中的其他样式... */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  flex: 1;
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
  border-color: #e8e8e8;
}

.filter-btn:hover, .sort-btn:hover {
  color: #FF9966;
  border-color: #FF9966;
}

.search-input {
  max-width: 250px;
  height: 30px;
  border-radius: 20px;
}

:deep(.ant-input-search .ant-input) {
  border-radius: 20px 0 0 20px;
}

:deep(.ant-input-search .ant-input-search-button) {
  border-radius: 0 20px 20px 0;
  background: linear-gradient(135deg, #FF9966, #FF7043);
  border-color: transparent;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.ant-input-search .ant-input-search-button:hover) {
  background: linear-gradient(135deg, #FF8044, #FF5722);
  color: white;
  border-color: transparent;
}

:deep(.ant-input-search .ant-input-search-button .anticon-search) {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

/* 确保搜索图标在搜索按钮中居中且足够大 */
:deep(.ant-input-search .anticon-search svg) {
  width: 18px;
  height: 18px;
  fill: white;
  stroke: white;
  stroke-width: 15px;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

/* 活跃筛选条件 */
.active-filters {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 8px;
}

.active-filter-label {
  font-size: 14px;
  color: #666;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.clear-all-btn {
  font-size: 14px;
  padding: 0;
  color: #999;
}

.clear-all-btn:hover {
  color: #FF5722;
}

/* 列表头部 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.recipe-count {
  font-size: 14px;
  font-weight: normal;
  color: #999;
  margin-left: 6px;
}

.view-switch {
  display: flex;
  gap: 8px;
}

.view-btn {
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.view-btn.active {
  color: #FF9966;
  border-color: #FF9966;
  background-color: #FFF9F5;
}

/* 加载中样式 */
.loading-container {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

/* 菜谱容器 */
.recipe-container {
  margin-bottom: 32px;
}

/* 网格视图 */
.grid-view {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* 列表视图 */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.list-view .recipe-card {
  display: flex;
  height: 180px;
}

.list-view .recipe-image-container {
  width: 280px;
  height: 100%;
  flex-shrink: 0;
}

.list-view .recipe-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 菜谱卡片 */
.recipe-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  cursor: pointer; /* 添加指针样式，提示可点击 */
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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
  z-index: 2;
}

.favorite-icon:hover {
  background-color: white;
  transform: scale(1.1);
}

.favorite-active {
  color: #FF4D4F;
}

.new-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #8BC34A, #4CAF50);
  color: white;
  font-size: 12px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 10px;
  z-index: 2;
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

.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.create-empty-btn {
  margin-top: 24px;
  background: linear-gradient(135deg, #FF9966, #FF7043);
  border: none;
  color: white;
  border-radius: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.create-empty-btn:hover {
  background: linear-gradient(135deg, #FF8044, #FF5722);
  color: white;
  border: none;
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

/* 建议区域 */
.suggestion-section {
  margin-bottom: 40px;
}

.suggestion-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.suggestion-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  padding: 20px;
  display: flex;
  gap: 16px;
  transition: transform 0.3s;
}

.suggestion-card:hover {
  transform: translateY(-5px);
}

.suggestion-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #FFF4E6;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FF9966;
  font-size: 20px;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.suggestion-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.suggestion-link {
  color: #FF9966;
  font-size: 14px;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.suggestion-link:hover {
  color: #FF5722;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .grid-view {
    grid-template-columns: repeat(2, 1fr);
  }

  .subcategory-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .trends-cards {
    grid-template-columns: 1fr;
  }

  .suggestion-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .suggestion-card:last-child {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .grid-view {
    grid-template-columns: 1fr;
  }

  .list-view .recipe-card {
    flex-direction: column;
    height: auto;
  }

  .list-view .recipe-image-container {
    width: 100%;
    height: 200px;
  }

  .subcategory-list {
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

  .suggestion-cards {
    grid-template-columns: 1fr;
  }

  .suggestion-card:last-child {
    grid-column: span 1;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .create-btn {
    align-self: flex-start;
  }

  .category-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .category-stats {
    flex-direction: column;
    gap: 16px;
  }
}
</style>