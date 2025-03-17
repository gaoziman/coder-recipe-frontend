<template>
  <div class="collections-page">
    <!-- 增强版页面标题区域 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">精选合集</h1>
        <p class="page-description">
          为您精心挑选的主题食谱合集，覆盖各种场景、新奇和实用技巧，让您的烹饪之旅更加丰富多彩。
        </p>
        <div class="animated-food-icons">
          <apple-outlined class="food-icon icon1" />
          <coffee-outlined class="food-icon icon2" />
          <fire-outlined class="food-icon icon3" />
          <experiment-outlined class="food-icon icon4" />
        </div>
      </div>
    </div>

    <!-- 筛选区域 - 增强版 -->
    <div class="category-navigation">
      <div class="nav-content">
        <div class="nav-tabs">
          <a-button-group class="custom-button-group">
            <a-button
                :type="activeCategory === 'all' ? 'primary' : 'default'"
                class="category-btn"
                @click="filterByMainCategory('all')"
            >
              全部合集
            </a-button>
            <a-button
                :type="activeCategory === 'official' ? 'primary' : 'default'"
                class="category-btn"
                @click="filterByMainCategory('official')"
            >
              官方精选
            </a-button>
            <a-button
                :type="activeCategory === 'seasonal' ? 'primary' : 'default'"
                class="category-btn"
                @click="filterByMainCategory('seasonal')"
            >
              当季推荐
            </a-button>
            <a-button
                :type="activeCategory === 'hot' ? 'primary' : 'default'"
                class="category-btn"
                @click="filterByMainCategory('hot')"
            >
              热门合集
            </a-button>
          </a-button-group>
        </div>

        <div class="search-area">
          <a-input-search
              v-model:value="searchKeyword"
              placeholder="搜索合集..."
              @search="handleSearch"
              enter-button
          >
            <template #enterButton>
              <search-outlined />
            </template>
          </a-input-search>
        </div>
      </div>
    </div>

    <!-- 季节主题横幅 - 新增元素 -->
    <div class="seasonal-banner" v-if="currentSeason">
      <div class="banner-content">
        <div class="season-info">
          <div class="season-icon">
            <component :is="getSeasonIcon()" />
          </div>
          <div class="season-text">
            <h2>{{ currentSeason.title }}</h2>
            <p>{{ currentSeason.description }}</p>
          </div>
        </div>
        <a-button class="view-seasonal" type="primary" @click="viewSeasonalCollections">
          查看当季合集
          <right-outlined />
        </a-button>
      </div>
    </div>

    <!-- 特色合集轮播 - 新增元素 -->
    <div class="featured-collections">
      <div class="section-header">
        <h2 class="section-title">特色合集</h2>
        <a-button type="link" @click="viewAllFeatured">
          查看全部 <right-outlined />
        </a-button>
      </div>

      <a-carousel autoplay class="custom-carousel">
        <div class="carousel-slide" v-for="(collection, index) in featuredCollections" :key="index">
          <div class="slide-content" :style="{ backgroundImage: `url(${collection.coverImage})` }">
            <div class="slide-overlay">
              <a-tag class="feature-tag">{{ collection.tag }}</a-tag>
              <h3 class="slide-title">{{ collection.title }}</h3>
              <p class="slide-description">{{ collection.description }}</p>
              <div class="slide-meta">
                <span class="recipe-count">
                  <file-text-outlined />
                  {{ collection.recipeCount }} 道菜谱
                </span>
                <a-button
                    type="primary"
                    ghost
                    class="view-btn"
                    @click.stop="goToCollection(collection.id)"
                >
                  查看详情
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </a-carousel>
    </div>

    <!-- 主要内容区 - 合集列表 -->
    <div class="collections-container">
      <div class="content-header">
        <h2 class="content-title">浏览所有合集</h2>
        <div class="filter-sort">
          <a-dropdown>
            <template #overlay>
              <a-menu @click="handleSortChange">
                <a-menu-item key="latest">最新添加</a-menu-item>
                <a-menu-item key="popular">最受欢迎</a-menu-item>
                <a-menu-item key="most_recipes">菜谱最多</a-menu-item>
              </a-menu>
            </template>
            <a-button>
              {{ sortText }}
              <down-outlined />
            </a-button>
          </a-dropdown>
        </div>
      </div>

      <!-- 精选分类标签 - 新增元素 -->
      <div class="category-tags-container">
        <div class="scroll-tags">
          <a-tag
              v-for="(tag, index) in popularTags"
              :key="index"
              :color="activeTag === tag.id ? '#FF9966' : ''"
              class="category-tag"
              @click="filterByTag(tag.id)"
          >
            <component :is="getCategoryIcon(tag.icon)" class="tag-icon" />
            {{ tag.name }}
          </a-tag>
        </div>
      </div>

      <!-- 合集网格 - 增强视觉效果 -->
      <transition-group name="collection-fade" tag="div" class="collections-grid">
        <a-card
            v-for="collection in filteredCollections"
            :key="collection.id"
            class="collection-card"
            :hoverable="true"
            @click="goToCollection(collection.id)"
        >
          <div class="collection-image">
            <img :src="collection.coverImage" :alt="collection.title" />
            <div class="collection-tag" v-if="collection.tag">{{ collection.tag }}</div>

            <!-- 新增合集状态指示 -->
            <div class="collection-stats">
              <span class="stat-item">
                <eye-outlined />
                {{ formatNumber(collection.viewCount) }}
              </span>
              <span class="stat-item">
                <heart-outlined />
                {{ formatNumber(collection.favoriteCount || Math.floor(collection.viewCount/7)) }}
              </span>
            </div>
          </div>
          <div class="collection-content">
            <h2 class="collection-title">{{ collection.title }}</h2>
            <p class="collection-description">{{ collection.description }}</p>
            <div class="collection-meta">
              <div class="recipe-info">
                <file-text-outlined />
                <span>{{ collection.recipeCount }} 道菜谱</span>
              </div>
              <div class="collection-author">
                <a-avatar :src="collection.editor?.avatar" :size="24" />
                <span>{{ collection.editor?.name }}</span>
              </div>
            </div>
          </div>
        </a-card>
      </transition-group>

      <!-- 分页与加载更多 -->
      <div class="load-more-container">
        <a-button
            type="primary"
            class="load-more-btn"
            :loading="loading"
            @click="loadMore"
        >
          {{ loading ? '加载中...' : '加载更多合集' }}
        </a-button>
      </div>
    </div>

    <!-- 美食灵感区域 - 新增元素 -->
    <div class="inspiration-section">
      <div class="inspiration-content">
        <div class="inspiration-text">
          <h2>寻找烹饪灵感</h2>
          <p>探索我们的热门食谱标签，发现更多美食创意和灵感</p>
        </div>
        <div class="inspiration-tags">
          <a-tag
              v-for="(tag, index) in inspirationTags"
              :key="index"
              class="inspiration-tag"
              @click="navigateToTag(tag.id)"
          >
            {{ tag.name }}
            <span class="tag-count">{{ tag.count }}</span>
          </a-tag>
        </div>
        <div class="view-all-tags">
          <a-button @click="viewAllTags">查看全部标签</a-button>
        </div>
      </div>
    </div>


    <!-- 用户互动区域 - 新增元素 -->
    <div class="community-section">
      <div class="community-content">
        <div class="community-text">
          <h2>分享您的创意</h2>
          <p>加入我们的美食社区，分享您的拿手好菜和独特食谱</p>
          <div class="community-actions">
            <a-button type="primary" size="large">创建食谱</a-button>
            <a-button size="large">加入社区</a-button>
          </div>
        </div>
        <div class="community-image">
          <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070" alt="烹饪社区" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  SearchOutlined, RightOutlined, DownOutlined, UpOutlined,
  FileTextOutlined, EyeOutlined, HeartOutlined, HomeOutlined,
  ShopOutlined, CoffeeOutlined, PieChartOutlined, ExperimentOutlined,
  FireOutlined, CloudOutlined, AppstoreOutlined, BulbOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const loading = ref(false);
const searchKeyword = ref('');
const activeCategory = ref('all');
const activeTag = ref('');
const sortOption = ref('popular');
const sortText = ref('最受欢迎');

// 当前季节信息
const currentSeason = reactive({
  id: 'spring-2025',
  title: '2025年春季 - 新鲜上市',
  description: '春风十里，不如一桌春日美食。尝试最新鲜的春季食材，为家人制作健康美味的春季佳肴。',
  icon: 'leaf'
});

// 获取季节图标
const getSeasonIcon = () => {
  const iconMap: Record<string, any> = {
    'spring': CloudOutlined,
    'summer': CloudOutlined,
    'autumn': CloudOutlined,
    'winter': CloudOutlined,
    'leaf': CloudOutlined
  };
  return iconMap[currentSeason.icon] || CloudOutlined;
};

// 特色合集
const featuredCollections = reactive([
  {
    id: 'spring-recipes-2025',
    title: '春风十里不如家的味道 - 2025年春季食谱精选',
    description: '精选30道春季时令菜谱，充分利用春季新鲜食材，为家人烹饪健康美味的春日佳肴。',
    coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
    tag: '编辑推荐',
    recipeCount: 30,
    viewCount: 12500,
    favoriteCount: 1800,
    editor: {
      name: '美食编辑部',
      avatar: 'https://i.pravatar.cc/150?img=58'
    }
  },
  {
    id: 'quick-breakfast',
    title: '15分钟快手早餐合集',
    description: '为忙碌的早晨准备的快速营养早餐方案，让你轻松开启一天的活力。',
    coverImage: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    tag: '热门',
    recipeCount: 25,
    viewCount: 9800,
    favoriteCount: 1200,
    editor: {
      name: '早餐达人',
      avatar: 'https://i.pravatar.cc/150?img=44'
    }
  },
  {
    id: 'healthy-salads',
    title: '健康轻食沙拉集锦',
    description: '多种创意沙拉食谱，融合各国风味，既美味又营养，是减脂健身的理想选择。',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    tag: '当季',
    recipeCount: 18,
    viewCount: 7600,
    favoriteCount: 950,
    editor: {
      name: '健康生活家',
      avatar: 'https://i.pravatar.cc/150?img=47'
    }
  }
]);

// 所有合集
const allCollections = reactive([
  // 春季食谱合集
  {
    id: 'spring-recipes-2025',
    title: '春风十里不如家的味道 - 2025年春季食谱精选',
    description: '精选30道春季时令菜谱，充分利用春季新鲜食材，为家人烹饪健康美味的春日佳肴。',
    coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
    tag: '编辑推荐',
    recipeCount: 30,
    viewCount: 12500,
    editor: {
      name: '美食编辑部',
      avatar: 'https://i.pravatar.cc/150?img=58'
    },
    category: 'seasonal',
    tags: ['spring', 'fresh', 'healthy']
  },
  // 快手早餐合集
  {
    id: 'quick-breakfast',
    title: '15分钟快手早餐合集',
    description: '为忙碌的早晨准备的快速营养早餐方案，让你轻松开启一天的活力。',
    coverImage: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    tag: '热门',
    recipeCount: 25,
    viewCount: 9800,
    editor: {
      name: '早餐达人',
      avatar: 'https://i.pravatar.cc/150?img=44'
    },
    category: 'hot',
    tags: ['breakfast', 'quick', 'simple']
  },
  // 健康沙拉合集
  {
    id: 'healthy-salads',
    title: '健康轻食沙拉集锦',
    description: '多种创意沙拉食谱，融合各国风味，既美味又营养，是减脂健身的理想选择。',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    tag: '当季',
    recipeCount: 18,
    viewCount: 7600,
    editor: {
      name: '健康生活家',
      avatar: 'https://i.pravatar.cc/150?img=47'
    },
    category: 'official',
    tags: ['salad', 'healthy', 'fresh']
  },
  // 中式家常菜合集
  {
    id: 'chinese-home-cooking',
    title: '中华家常菜必学100道',
    description: '收录百道经典中式家常菜，从基础到进阶，让你轻松掌握中华美食精髓。',
    coverImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
    recipeCount: 100,
    viewCount: 15300,
    editor: {
      name: '传统美食专家',
      avatar: 'https://i.pravatar.cc/150?img=61'
    },
    category: 'hot',
    tags: ['chinese', 'traditional', 'home']
  },
  // 甜点合集
  {
    id: 'dessert-wonderland',
    title: '甜点爱好者的梦幻天堂',
    description: '从简单的曲奇到精致的法式甜点，满足你对甜蜜的所有想象和追求。',
    coverImage: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    tag: '人气',
    recipeCount: 45,
    viewCount: 11200,
    editor: {
      name: '甜点师傅',
      avatar: 'https://i.pravatar.cc/150?img=32'
    },
    category: 'hot',
    tags: ['dessert', 'sweet', 'baking']
  },
  // 一锅料理合集
  {
    id: 'one-pot-meals',
    title: '一锅搞定懒人料理',
    description: '简单省事的一锅料理，最少的步骤，最少的厨具，创造出美味可口的家常菜。',
    coverImage: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
    recipeCount: 32,
    viewCount: 9400,
    editor: {
      name: '效率厨房',
      avatar: 'https://i.pravatar.cc/150?img=59'
    },
    category: 'official',
    tags: ['one-pot', 'simple', 'efficient']
  },
  // 环球美食合集
  {
    id: 'international-cuisine',
    title: '环球美食之旅',
    description: '带你足不出户品尝世界各地的经典美食，领略不同国家的饮食文化与特色。',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    tag: '精选',
    recipeCount: 60,
    viewCount: 8700,
    editor: {
      name: '环球美食家',
      avatar: 'https://i.pravatar.cc/150?img=40'
    },
    category: 'official',
    tags: ['international', 'culture', 'exotic']
  },
  // 汤品合集
  {
    id: 'soup-collection',
    title: '四季养生汤品大全',
    description: '春夏秋冬应季汤品，滋补养生，增强免疫力，让全家人喝出健康好气色。',
    coverImage: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a',
    recipeCount: 40,
    viewCount: 10500,
    editor: {
      name: '养生达人',
      avatar: 'https://i.pravatar.cc/150?img=63'
    },
    category: 'seasonal',
    tags: ['soup', 'health', 'seasonal']
  },
  // 儿童美食合集
  {
    id: 'kids-friendly',
    title: '孩子最爱家常菜',
    description: '专为儿童设计的美味食谱，营养均衡又好吃，让挑食的孩子也能爱上吃饭。',
    coverImage: 'https://images.unsplash.com/photo-1575853121743-60c24f0a7502',
    tag: '推荐',
    recipeCount: 35,
    viewCount: 12800,
    editor: {
      name: '亲子美食家',
      avatar: 'https://i.pravatar.cc/150?img=49'
    },
    category: 'official',
    tags: ['kids', 'family', 'nutrition']
  }
]);

// 热门分类标签
const popularTags = [
  { id: 'all', name: '全部', icon: 'home' },
  { id: 'spring', name: '春季时令', icon: 'leaf' },
  { id: 'breakfast', name: '早餐', icon: 'coffee' },
  { id: 'quick', name: '快手菜', icon: 'pie-chart' },
  { id: 'healthy', name: '健康轻食', icon: 'experiment' },
  { id: 'chinese', name: '中华料理', icon: 'shop' },
  { id: 'dessert', name: '甜点烘焙', icon: 'pie-chart' },
  { id: 'one-pot', name: '一锅料理', icon: 'home' },
  { id: 'international', name: '环球美食', icon: 'experiment' },
  { id: 'soup', name: '汤品', icon: 'coffee' },
  { id: 'kids', name: '儿童餐', icon: 'shop' }
];

// 灵感标签
const inspirationTags = [
  { id: 'spring-cuisine', name: '春季料理', count: 257 },
  { id: 'quick-meal', name: '快手菜', count: 189 },
  { id: 'vegetarian', name: '素食', count: 145 },
  { id: 'noodles', name: '面食', count: 128 },
  { id: 'seafood', name: '海鲜', count: 112 },
  { id: 'hot-pot', name: '火锅', count: 98 },
  { id: 'bbq', name: '烧烤', count: 87 },
  { id: 'baking', name: '烘焙', count: 76 },
  { id: 'rice', name: '米饭', count: 65 }
];

// 特色厨师
const featuredChefs = [
  {
    name: '陈师傅',
    title: '中式烹饪大师',
    avatar: 'https://i.pravatar.cc/150?img=51',
    recommendedCollection: {
      id: 'chinese-home-cooking',
      title: '中华家常菜必学100道',
      description: '收录百道经典中式家常菜，从基础到进阶，让你轻松掌握中华美食精髓。'
    }
  },
  {
    name: '李美食',
    title: '创意料理专家',
    avatar: 'https://i.pravatar.cc/150?img=32',
    recommendedCollection: {
      id: 'one-pot-meals',
      title: '一锅搞定懒人料理',
      description: '简单省事的一锅料理，最少的步骤，最少的厨具，创造出美味可口的家常菜。'
    }
  },
  {
    name: '王营养师',
    title: '健康饮食顾问',
    avatar: 'https://i.pravatar.cc/150?img=47',
    recommendedCollection: {
      id: 'healthy-salads',
      title: '健康轻食沙拉集锦',
      description: '多种创意沙拉食谱，融合各国风味，既美味又营养，是减脂健身的理想选择。'
    }
  }
];

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// 获取分类图标
const getCategoryIcon = (icon: string) => {
  const iconMap: Record<string, any> = {
    'home': HomeOutlined,
    'shop': ShopOutlined,
    'coffee': CoffeeOutlined,
    'pie-chart': PieChartOutlined,
    'experiment': ExperimentOutlined,
    'leaf': PieChartOutlined,
    'fire': FireOutlined
  };
  return iconMap[icon] || HomeOutlined;
};

// 过滤后的合集列表
const filteredCollections = computed(() => {
  return allCollections.filter(collection => {
    // 主分类筛选
    if (activeCategory.value !== 'all' && collection.category !== activeCategory.value) {
      return false;
    }

    // 标签筛选
    if (activeTag.value && activeTag.value !== 'all') {
      if (!collection.tags?.includes(activeTag.value)) {
        return false;
      }
    }

    // 关键词搜索
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase();
      return collection.title.toLowerCase().includes(keyword) ||
          collection.description.toLowerCase().includes(keyword);
    }

    return true;
  });
});

// 主分类筛选
const filterByMainCategory = (category: string) => {
  activeCategory.value = category;
  console.log('筛选主分类:', category);
};

// 标签筛选
const filterByTag = (tagId: string) => {
  activeTag.value = tagId === activeTag.value ? '' : tagId;
  console.log('筛选标签:', tagId);
};

// 排序处理
const handleSortChange = (e: any) => {
  sortOption.value = e.key;
  switch(e.key) {
    case 'latest':
      sortText.value = '最新添加';
      break;
    case 'popular':
      sortText.value = '最受欢迎';
      break;
    case 'most_recipes':
      sortText.value = '菜谱最多';
      break;
  }
};

// 搜索处理
const handleSearch = () => {
  console.log('搜索关键词:', searchKeyword.value);
};

// 加载更多
const loadMore = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    // 实际应用中这里会加载更多数据
  }, 1500);
};

// 查看当季合集
const viewSeasonalCollections = () => {
  activeCategory.value = 'seasonal';
  console.log('查看当季合集');
};

// 查看所有特色合集
const viewAllFeatured = () => {
  console.log('查看所有特色合集');
};

// 导航到标签页
const navigateToTag = (tagId: string) => {
  console.log('导航到标签页:', tagId);
};

// 查看所有标签
const viewAllTags = () => {
  console.log('查看所有标签');
};

// 跳转到合集详情
const goToCollection = (collectionId: string) => {
  console.log('跳转到合集详情，ID:', collectionId);
  router.push(`/collections/${collectionId}`);
};

onMounted(() => {
  console.log('合集列表页面已加载');
});
</script>




<style scoped>
.collections-page {
  background-color: #FFF8F0;
  min-height: 100vh;
}

/* 页面标题区域 - 增强设计 */
.page-header {
  background-color: #FF9966;
  background-image: linear-gradient(135deg, #FF9966 0%, #FF8855 100%);
  color: white;
  padding: 48px 0 60px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}

.header-content {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-description {
  font-size: 18px;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  opacity: 0.9;
}

/* 动画食物图标 */
.animated-food-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.food-icon {
  position: absolute;
  opacity: 0.15;
  font-size: 40px;
  color: white;
}

.icon1 {
  top: 20%;
  left: 10%;
  animation: float 8s ease-in-out infinite;
}

.icon2 {
  top: 15%;
  right: 15%;
  animation: float 10s ease-in-out infinite;
}

.icon3 {
  bottom: 25%;
  left: 20%;
  animation: float 9s ease-in-out infinite 1s;
}

.icon4 {
  bottom: 20%;
  right: 10%;
  animation: float 7s ease-in-out infinite 0.5s;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

/* 导航标签栏 - 增强样式 */
.category-navigation {
  position: relative;
  margin-top: -42px;
  margin-bottom: 32px;
  z-index: 10;
}

.nav-content {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 16px 24px;
}

.nav-tabs {
  display: flex;
  gap: 16px;
}

.custom-button-group {
  border-radius: 8px;
  overflow: hidden;
}

.category-btn {
  height: 40px;
  padding: 0 16px;
  font-size: 15px;
  border: none;
}

:deep(.ant-btn-primary) {
  background-color: #FF9966;
}

:deep(.ant-btn-primary:hover) {
  background-color: #FF8855;
}

.search-area {
  width: 300px;
}

:deep(.ant-input-search .ant-input) {
  border-radius: 8px 0 0 8px;
}

:deep(.ant-input-search .ant-input-search-button) {
  background-color: #FF9966;
  border-color: #FF9966;
  border-radius: 0 8px 8px 0;
  height: 40px;
}

:deep(.ant-input-search .ant-input-search-button:hover) {
  background-color: #FF8855;
  border-color: #FF8855;
}

/* 季节主题横幅 */
.seasonal-banner {
  max-width: 1140px;
  margin: 0 auto 32px;
  padding: 0 16px;
}

.banner-content {
  background-color: rgba(255, 153, 102, 0.1);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #FF9966;
}

.season-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.season-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #FF9966;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 30px;
}

.season-text h2 {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.season-text p {
  color: #666;
  font-size: 14px;
  max-width: 600px;
}

.view-seasonal {
  background-color: #FF9966;
  border: none;
  height: 40px;
  border-radius: 8px;
}

.view-seasonal:hover {
  background-color: #FF8855;
}

/* 特色合集轮播 */
.featured-collections {
  max-width: 1140px;
  margin: 0 auto 48px;
  padding: 0 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.custom-carousel {
  border-radius: 12px;
  overflow: hidden;
  height: 400px;
}

.carousel-slide {
  height: 400px;
}

.slide-content {
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: white;
}

.feature-tag {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 12px;
  border-radius: 20px;
  background-color: #FFEBE0;
  color: #FF9966;
  border: none;
  align-self: flex-start;
}

.slide-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slide-description {
  max-width: 800px;
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.6;
  opacity: 0.9;
}

.slide-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recipe-count {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.view-btn {
  border-color: white;
  color: white;
}

.view-btn:hover {
  border-color: #FF9966;
  color: #FF9966;
  background-color: white;
}

/* 主内容区域 */
.collections-container {
  max-width: 1140px;
  margin: 0 auto 64px;
  padding: 0 16px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.content-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 分类标签横向滚动 */
.category-tags-container {
  margin-bottom: 24px;
  position: relative;
}

.scroll-tags {
  display: flex;
  overflow-x: auto;
  padding: 8px 0;
  gap: 12px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.scroll-tags::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.category-tag {
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  border: none;
  background-color: #F0F0F0;
}

.category-tag:hover {
  background-color: #FFEBE0;
  color: #FF9966;
}

.tag-icon {
  font-size: 14px;
}

/* 合集网格 - 带动画效果 */
.collections-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.collection-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.collection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.collection-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.collection-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.collection-card:hover .collection-image img {
  transform: scale(1.05);
}

.collection-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  background-color: #FFEBE0;
  color: #FF9966;
  font-size: 12px;
  font-weight: 500;
}

.collection-stats {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  gap: 12px;
}

.stat-item {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 4px 10px;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.collection-content {
  padding: 16px;
  background-color: white;
}

.collection-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.collection-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  height: 42px;
}

.collection-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recipe-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.collection-author {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

/* 加载更多按钮 */
.load-more-container {
  text-align: center;
  margin-top: 32px;
}

.load-more-btn {
  padding: 0 32px;
  height: 44px;
  font-size: 16px;
  background-color: #FF9966;
  border: none;
  border-radius: 8px;
}

.load-more-btn:hover {
  background-color: #FF8855;
}

/* 收藏动画 */
.collection-fade-enter-active,
.collection-fade-leave-active {
  transition: all 0.3s ease;
}

.collection-fade-enter-from,
.collection-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 美食灵感区域 */
.inspiration-section {
  background-color: white;
  padding: 64px 0;
  margin-bottom: 64px;
}

.inspiration-content {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
  text-align: center;
}

.inspiration-text {
  margin-bottom: 32px;
}

.inspiration-text h2 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.inspiration-text p {
  font-size: 16px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.inspiration-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.inspiration-tag {
  padding: 8px 16px;
  border-radius: 20px;
  background-color: #f5f5f5;
  color: #666;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.inspiration-tag:hover {
  background-color: #FFEBE0;
  color: #FF9966;
}

.tag-count {
  display: inline-block;
  margin-left: 6px;
  font-size: 12px;
  color: #999;
}

.view-all-tags {
  margin-top: 24px;
}



/* 社区互动区域 */
.community-section {
  background-color: white;
  padding: 64px 0;
  margin-bottom: 64px;
}

.community-content {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 48px;
}

.community-text {
  flex: 1;
}

.community-text h2 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.community-text p {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.community-actions {
  display: flex;
  gap: 16px;
}

.community-actions .ant-btn-primary {
  background-color: #FF9966;
  border: none;
}

.community-actions .ant-btn-primary:hover {
  background-color: #FF8855;
}

.community-image {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.community-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


/* 响应式样式 */
@media (max-width: 1200px) {
  .collections-grid, .chef-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .collections-grid, .chef-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-header {
    padding: 40px 0 50px;
  }

  .page-title {
    font-size: 32px;
  }

  .nav-content {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }

  .search-area {
    width: 100%;
  }

  .seasonal-banner .banner-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .community-content {
    flex-direction: column;
    gap: 32px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 32px 0 40px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-description {
    font-size: 16px;
  }

  .nav-tabs {
    overflow-x: auto;
    width: 100%;
    padding-bottom: 8px;
  }

  .season-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .slide-title {
    font-size: 24px;
  }

  .slide-description {
    font-size: 14px;
  }

  .custom-carousel,
  .carousel-slide {
    height: 300px;
  }
}

@media (max-width: 576px) {
  .collections-grid, .chef-cards {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 24px;
  }

  .custom-carousel,
  .carousel-slide {
    height: 250px;
  }

  .slide-overlay {
    padding: 20px;
  }

  .inspiration-tags {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 16px;
  }
}

/* 确保主色调统一为 #FF9966 */
:deep(.ant-btn-primary) {
  background-color: #FF9966;
  border-color: #FF9966;
}

:deep(.ant-btn-primary:hover) {
  background-color: #FF8855;
  border-color: #FF8855;
}
</style>