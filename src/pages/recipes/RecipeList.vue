<!-- RecipeList.vue -->
<template>
  <div class="recipe-list-container">
    <!-- 添加面包屑导航 -->
    <recipe-breadcrumb />

    <!-- 筛选和排序区域 -->
    <div class="filter-section">
      <div class="filters">
        <a-dropdown>
          <a-button class="filter-btn">
            {{ filterLabels.category }}
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
        <a-tag v-if="filter.category !== 'all'" closable @close="resetCategoryFilter">
          <apartment-outlined /> {{ filterLabels.category }}
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

    <!-- 季节推荐 -->
    <div class="seasonal-section" v-if="showSeasonal">
      <div class="section-header">
        <h2 class="section-title">
          <fire-outlined class="section-icon" />
          当季推荐
        </h2>
        <a-button type="link" class="view-all-btn" @click="handleViewAll('seasonal')">
          查看全部
          <right-outlined />
        </a-button>
      </div>
      <div class="seasonal-carousel">
        <a-carousel autoplay dots-class="carousel-dots">
          <div class="seasonal-slide" v-for="group in seasonalGroups" :key="group.id">
            <div class="seasonal-slide-inner">
              <div v-for="recipe in group.items" :key="recipe.id" class="seasonal-card">
                <div class="seasonal-image-container">
                  <img :src="recipe.image" :alt="recipe.title" class="seasonal-image" />
                  <div class="seasonal-overlay">
                    <span class="seasonal-badge">当季推荐</span>
                  </div>
                </div>
                <div class="seasonal-content">
                  <h3 class="seasonal-title">{{ recipe.title }}</h3>
                  <div class="seasonal-info">
                    <span class="cooking-time">
                      <clock-circle-outlined /> {{ recipe.cookingTime }}分钟
                    </span>
                    <tag :color="getDifficultyColor(recipe.difficulty)">{{ recipe.difficulty }}</tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-carousel>
      </div>
    </div>

    <!-- 菜谱卡片网格 -->
    <div class="list-header">
      <h2 class="list-title">
        <book-outlined class="section-icon" />
        所有菜谱
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

    <!-- 统计数据 -->
    <div class="stats-section">
      <div class="section-header">
        <h2 class="section-title">
          <pie-chart-outlined class="section-icon" />
          我的烹饪分析
        </h2>
      </div>
      <div class="stats-row">
        <div class="stats-card">
          <div class="stats-card-header">
            <h3 class="stats-title">菜谱统计</h3>
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
          <div class="stats-content">
            <div class="stat-item">
              <div class="stat-icon create-icon">
                <form-outlined />
              </div>
              <div class="stat-details">
                <div class="stat-label">创建菜谱</div>
                <div class="stat-value">24</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon favorite-icon-bg">
                <heart-filled />
              </div>
              <div class="stat-details">
                <div class="stat-label">收藏菜谱</div>
                <div class="stat-value">56</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon view-icon">
                <eye-outlined />
              </div>
              <div class="stat-details">
                <div class="stat-label">总浏览量</div>
                <div class="stat-value">2,894</div>
              </div>
            </div>
          </div>
          <div class="view-more">
            <a-button type="link" class="link-text" @click="viewDetailedStats">
              查看更详细的图表
              <right-outlined />
            </a-button>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-card-header">
            <h3 class="stats-title">食材使用统计</h3>
            <a-dropdown>
              <a-button type="text" class="more-btn">
                <more-outlined />
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">查看所有食材</a-menu-item>
                  <a-menu-item key="2">导出数据</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div class="ingredient-stats">
            <div class="ingredient-item">
              <span class="ingredient-name">西兰花</span>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: 70%"></div>
                <span class="ingredient-percentage-overlay">70%</span>
              </div>
              <span class="ingredient-percentage">70%</span>
            </div>
            <div class="ingredient-item">
              <span class="ingredient-name">番茄</span>
              <div class="progress-bar-container">
                <div class="progress-bar tomato-bar" style="width: 60%"></div>
                <span class="ingredient-percentage-overlay">60%</span>
              </div>
              <span class="ingredient-percentage">60%</span>
            </div>
            <div class="ingredient-item">
              <span class="ingredient-name">鸡蛋</span>
              <div class="progress-bar-container">
                <div class="progress-bar egg-bar" style="width: 45%"></div>
                <span class="ingredient-percentage-overlay">45%</span>
              </div>
              <span class="ingredient-percentage">45%</span>
            </div>
            <div class="ingredient-item">
              <span class="ingredient-name">牛肉</span>
              <div class="progress-bar-container">
                <div class="progress-bar beef-bar" style="width: 30%"></div>
                <span class="ingredient-percentage-overlay">30%</span>
              </div>
              <span class="ingredient-percentage">30%</span>
            </div>
          </div>
          <div class="ingredient-trend">
            <span class="trend-label">本月趋势：</span>
            <span class="trend-value up">蔬菜类 <arrow-up-outlined /></span>
            <span class="trend-value down">肉类 <arrow-down-outlined /></span>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-card-header">
            <h3 class="stats-title">烹饪习惯</h3>
            <a-dropdown>
              <a-button type="text" class="more-btn">
                <more-outlined />
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">详细分析</a-menu-item>
                  <a-menu-item key="2">烹饪日历</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
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
          <div class="achievement">
            <trophy-outlined class="trophy-icon" />
            <div class="achievement-text">你已成为<strong>厨艺达人</strong>！再接再厉！</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 烹饪建议 -->
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
            <experiment-outlined />
          </div>
          <div class="suggestion-content">
            <h3 class="suggestion-title">尝试新的食材</h3>
            <p class="suggestion-desc">根据您的烹饪记录，您可能会喜欢尝试藜麦作为主食材。</p>
            <a-button type="link" class="suggestion-link">查看相关菜谱 <right-outlined /></a-button>
          </div>
        </div>
        <div class="suggestion-card">
          <div class="suggestion-icon">
            <schedule-outlined />
          </div>
          <div class="suggestion-content">
            <h3 class="suggestion-title">周末烹饪计划</h3>
            <p class="suggestion-desc">根据您的食谱收藏，我们为您准备了一份周末家庭聚餐的完美菜单。</p>
            <a-button type="link" class="suggestion-link">查看菜单方案 <right-outlined /></a-button>
          </div>
        </div>
        <div class="suggestion-card">
          <div class="suggestion-icon">
            <notification-outlined />
          </div>
          <div class="suggestion-content">
            <h3 class="suggestion-title">待完成的菜谱</h3>
            <p class="suggestion-desc">您有2份保存但未完成的菜谱草稿，需要继续编辑吗？</p>
            <a-button type="link" class="suggestion-link">继续编辑 <right-outlined /></a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <a-modal
        v-model:visible="deleteModal.visible"
        title="确认删除"
        okText="删除"
        cancelText="取消"
        okType="danger"
        @ok="handleDeleteConfirm"
    >
      <p>确定要删除"{{ deleteModal.recipeName }}"这个菜谱吗？此操作不可恢复。</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import {
  PlusOutlined,
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  DownOutlined,
  RightOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FireOutlined,
  EyeOutlined,
  SearchOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  PieChartOutlined,
  BookOutlined,
  TrophyOutlined,
  MoreOutlined,
  FormOutlined,
  BulbOutlined,
  ExperimentOutlined,
  ScheduleOutlined,
  NotificationOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ApartmentOutlined
} from '@ant-design/icons-vue';
import { Tag, message } from 'ant-design-vue';
import RecipeBreadcrumb from "@/components/common/RecipeBreadcrumb.vue";
import router from "@/router";

// 标签页状态
const activeTab = ref('created');

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
  category: 'all',
  difficulty: 'all',
  time: 'all',
  sort: 'latest'
});

// 筛选标签显示文本
const filterLabels = reactive({
  category: '所有分类',
  difficulty: '所有难度',
  time: '所有时间'
});

// 排序标签显示文本
const sortLabel = ref('最近更新');

// 判断是否有活跃的筛选条件
const hasActiveFilters = computed(() => {
  return filter.category !== 'all' ||
      filter.difficulty !== 'all' ||
      filter.time !== 'all' ||
      searchText.value.length > 0;
});

// 是否显示季节推荐
const showSeasonal = ref(true);

// 删除确认对话框
const deleteModal = reactive({
  visible: false,
  recipeId: null,
  recipeName: ''
});

// 模拟季节推荐数据
const seasonalRecipes = [
  {
    id: 101,
    title: '春季蘑菇汤',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 30,
    difficulty: '简单',
  },
  {
    id: 102,
    title: '樱花草莓蛋糕',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 45,
    difficulty: '中等',
  },
  {
    id: 103,
    title: '春笋炒肉',
    image: 'https://images.unsplash.com/photo-1627662168806-DF538101c8a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 25,
    difficulty: '简单',
  },
  {
    id: 104,
    title: '菠菜鸡蛋卷',
    image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 20,
    difficulty: '简单',
  },
  {
    id: 105,
    title: '春季沙拉',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 15,
    difficulty: '简单',
  },
  {
    id: 106,
    title: '清蒸鲈鱼',
    image: 'https://images.unsplash.com/photo-1635321593217-40050ad13c74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 40,
    difficulty: '中等',
  }
];

// 将季节推荐分组以适应轮播
const seasonalGroups = computed(() => {
  const result = [];
  const itemsPerSlide = 3;

  for (let i = 0; i < seasonalRecipes.length; i += itemsPerSlide) {
    result.push({
      id: `group-${i}`,
      items: seasonalRecipes.slice(i, i + itemsPerSlide)
    });
  }

  return result;
});

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
    'vegetable': '蔬菜',
    'meat': '肉类',
    'seafood': '海鲜',
    'pasta': '意面',
    'bread': '面包',
    'dessert': '甜点'
  };
  return categoryMap[category] || '其他';
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
const handleCategoryChange = (e: any) => {
  filter.category = e.key;
  filterLabels.category = e.item.title || '所有分类';
  fetchRecipes();
};

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

// 重置筛选条件
const resetCategoryFilter = () => {
  filter.category = 'all';
  filterLabels.category = '所有分类';
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
  filter.category = 'all';
  filter.difficulty = 'all';
  filter.time = 'all';
  filterLabels.category = '所有分类';
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

// 修改查看菜谱详情方法，实现路由跳转
const viewRecipeDetail = (id: number) => {
  console.log('查看菜谱详情', id);
  // 实际项目中跳转到详情页面
  router.push(`/recipes/${id}`);
};

// 模拟获取菜谱数据
const fetchRecipes = () => {
  // 实际项目中这里会请求后端API
  console.log('Fetching recipes with filters:', filter, 'search:', searchText.value, 'page:', current.value);
  isLoading.value = true;

  // 模拟加载延迟
  setTimeout(() => {
    // 这里应该根据筛选条件更新recipes数据
    isLoading.value = false;
  }, 500);
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

// 确认删除
const confirmDelete = (id: number) => {
  const recipe = recipes.value.find(recipe => recipe.id === id);
  if (recipe) {
    deleteModal.recipeId = id;
    deleteModal.recipeName = recipe.title;
    deleteModal.visible = true;
  }
};

// 删除菜谱
const handleDeleteConfirm = () => {
  if (deleteModal.recipeId) {
    message.success(`菜谱"${deleteModal.recipeName}"已删除`);
    recipes.value = recipes.value.filter(recipe => recipe.id !== deleteModal.recipeId);
    deleteModal.visible = false;
    deleteModal.recipeId = null;
    deleteModal.recipeName = '';
  }
};

// 查看全部
const handleViewAll = (section: string) => {
  console.log(`查看${section === 'seasonal' ? '当季推荐' : ''}全部内容`);
};

// 查看详细统计
const viewDetailedStats = () => {
  console.log('查看详细统计');
};

// 生命周期钩子
onMounted(() => {
  fetchRecipes();
});
</script>

<style scoped>
.recipe-list-container {
  width: 100%;
  padding: 0 16px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 筛选和排序区域 */
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
  border-radius: 20px;
}

:deep(.ant-input-search .ant-input) {
  border-radius: 20px 0 0 20px;
}

:deep(.ant-input-search .ant-input-search-button) {
  border-radius: 0 20px 20px 0;
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

/* 季节推荐 */
.seasonal-section {
  margin-bottom: 40px;
  background-color: #FFF9F5;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  color: #FF9966;
}

.view-all-btn {
  color: #FF9966;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.seasonal-carousel {
  position: relative;
}

:deep(.carousel-dots) {
  bottom: -20px !important;
}

:deep(.carousel-dots li button) {
  background-color: #FFD8C5 !important;
}

:deep(.carousel-dots li.slick-active button) {
  background-color: #FF9966 !important;
}

.seasonal-slide {
  padding: 8px 0;
}

.seasonal-slide-inner {
  display: flex;
  gap: 16px;
}

.seasonal-card {
  flex: 1;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.seasonal-card:hover {
  transform: translateY(-5px);
}

.seasonal-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.seasonal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.seasonal-card:hover .seasonal-image {
  transform: scale(1.05);
}

.seasonal-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
}

.seasonal-badge {
  background: linear-gradient(135deg, #FF9966, #FF5E62);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.seasonal-content {
  padding: 12px;
}

.seasonal-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
}

.seasonal-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.list-view .recipe-actions {
  border-top: none;
  border-left: 1px solid #f0f0f0;
  flex-direction: column;
  padding: 16px 12px;
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


.action-btn {
  color: #666;
  font-size: 16px;
}

.action-btn:hover {
  color: #FF9966;
}

.danger-btn:hover {
  color: #FF4D4F;
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

/* 统计区域 */
.stats-section {
  margin-top: 40px;
  margin-bottom: 36px;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FF9966, #FF5E62);
}

.stats-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stats-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.more-btn {
  color: #999;
}

.stats-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin-bottom: 8px;
}

.create-icon {
  background-color: #E6F7FF;
  color: #1890FF;
}

.favorite-icon-bg {
  background-color: #FFF1F0;
  color: #FF4D4F;
}

.view-icon {
  background-color: #F6FFED;
  color: #52C41A;
}

.stat-details {
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.link-text:hover {
  color: #FF5722;
}

/* 食材统计 */
.ingredient-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
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
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: #52C41A;
  border-radius: 4px;
  position: relative;
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

.ingredient-percentage-overlay {
  position: absolute;
  top: -20px;
  right: 0;
  font-size: 12px;
  color: #333;
  opacity: 0;
  transition: opacity 0.3s, top 0.3s;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
}

.progress-bar-container:hover .ingredient-percentage-overlay {
  opacity: 1;
  top: -24px;
}

.ingredient-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.trend-label {
  color: #666;
}

.trend-value {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.trend-value.up {
  color: #52C41A;
}

.trend-value.down {
  color: #FF4D4F;
}

/* 烹饪习惯统计 */
.habit-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
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

.achievement {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #FFFBE6;
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
}

.trophy-icon {
  font-size: 20px;
  color: #FAAD14;
}

.achievement-text {
  font-size: 14px;
  color: #333;
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

  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-card:last-child {
    grid-column: span 2;
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

  .list-view .recipe-actions {
    border-left: none;
    border-top: 1px solid #f0f0f0;
    flex-direction: row;
    padding: 8px;
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

  .suggestion-cards {
    grid-template-columns: 1fr;
  }

  .suggestion-card:last-child {
    grid-column: span 1;
  }
}
</style>