<template>
  <div class="collection-detail-container">

    <!-- 合集头部横幅 -->
    <div class="hero-banner" :style="{ backgroundImage: `url(${collection.coverImage})` }">
      <div class="banner-content">
        <div class="flex justify-between items-start">
          <div>
            <a-tag class="collection-recommend-tag">{{ collection.tag }}</a-tag>
            <h1 class="banner-title">{{ collection.title }}</h1>
            <p class="banner-description">{{ collection.description }}</p>
          </div>

          <div class="banner-actions">
            <a-button shape="circle" class="action-btn">
              <template #icon><share-alt-outlined /></template>
            </a-button>
            <a-button shape="circle" class="action-btn" @click="toggleCollect">
              <template #icon>
                <book-outlined v-if="!collection.isCollected" />
                <book-filled v-else />
              </template>
            </a-button>
          </div>
        </div>

        <div class="banner-footer">
          <div class="editor-info">
            <a-avatar :src="collection.editor.avatar" />
            <div class="editor-details">
              <div class="editor-name">{{ collection.editor.name }}</div>
              <div class="editor-date">{{ collection.updateDate }} 更新</div>
            </div>
          </div>

          <div class="collection-stats">
            <div class="stat-item">
              <file-text-outlined />
              <span>{{ collection.recipeCount }} 道菜谱</span>
            </div>
            <div class="stat-item">
              <eye-outlined />
              <span>{{ formatNumber(collection.viewCount) }} 浏览</span>
            </div>
            <div class="stat-item">
              <book-outlined />
              <span>{{ formatNumber(collection.favoriteCount) }} 收藏</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 合集介绍 -->
    <div class="content-container">
      <a-card class="intro-card">
        <h2 class="section-title">合集介绍</h2>
        <div class="intro-content">
          <div v-for="(paragraph, index) in collection.introContent" :key="index" class="intro-paragraph">
            {{ paragraph }}
          </div>
        </div>

        <div class="tags-container">
          <a-tag v-for="tag in collection.tags" :key="tag" class="ingredient-tag">{{ tag }}</a-tag>
        </div>
      </a-card>

      <!-- 筛选工具栏 -->
      <a-card class="filter-card">
        <div class="filter-container">
          <div class="filters">
            <a-select v-model:value="filters.category" class="filter-select" placeholder="全部菜谱">
              <a-select-option value="all">全部菜谱</a-select-option>
              <a-select-option v-for="category in categories" :key="category.value" :value="category.value">
                {{ category.label }}
              </a-select-option>
            </a-select>

            <a-select v-model:value="filters.difficulty" class="filter-select" placeholder="所有难度">
              <a-select-option value="all">所有难度</a-select-option>
              <a-select-option value="easy">简单</a-select-option>
              <a-select-option value="medium">中等</a-select-option>
              <a-select-option value="hard">困难</a-select-option>
            </a-select>

            <a-select v-model:value="filters.time" class="filter-select" placeholder="所有时间">
              <a-select-option value="all">所有时间</a-select-option>
              <a-select-option value="15">15分钟以内</a-select-option>
              <a-select-option value="30">30分钟以内</a-select-option>
              <a-select-option value="60">60分钟以内</a-select-option>
              <a-select-option value="more">60分钟以上</a-select-option>
            </a-select>
          </div>

          <div class="search-sort">
            <a-input-search
                v-model:value="searchKeyword"
                placeholder="搜索菜谱..."
                @search="handleSearch"
                class="search-input"
                enter-button
            />

            <div class="sort-control">
              <span class="sort-label">排序：</span>
              <a-select v-model:value="sortOption" class="sort-select">
                <a-select-option value="recommended">推荐顺序</a-select-option>
                <a-select-option value="latest">最新添加</a-select-option>
                <a-select-option value="views">最多浏览</a-select-option>
                <a-select-option value="favorites">最多收藏</a-select-option>
              </a-select>
            </div>
          </div>
        </div>
      </a-card>

      <!-- 菜谱分类展示 -->
      <div v-for="category in displayedCategories" :key="category.id" class="recipe-category-section">
        <div class="category-header">
          <h2 class="category-title">
            <component :is="getCategoryIcon(category.icon)" class="category-icon" />
            {{ category.name }}
          </h2>
        </div>

        <div class="recipe-grid">
          <a-card
              v-for="recipe in category.recipes"
              :key="recipe.id"
              hoverable
              class="recipe-card"
              @click="goToRecipeDetail(recipe.id)"
          >
            <div class="recipe-image-container">
              <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
              <div class="favorite-btn" @click.stop="toggleFavorite(recipe.id)">
                <heart-outlined v-if="!recipe.favorite" />
                <heart-filled v-else class="favorite-active" />
              </div>
            </div>
            <div class="recipe-card-content">
              <div class="recipe-title-rating">
                <h3 class="recipe-title">{{ recipe.title }}</h3>
                <div class="recipe-rating">
                  <a-rate :value="recipe.rating" disabled :count="5" />
                  <span class="rating-value">{{ recipe.rating }}</span>
                </div>
              </div>
              <p class="recipe-description">{{ recipe.description }}</p>
              <div class="recipe-author-info">
                <div class="recipe-author">
                  <a-avatar :src="recipe.author.avatar" :size="24" />
                  <span class="author-name">{{ recipe.author.name }}</span>
                </div>
                <div class="recipe-meta">
                  <span class="cooking-time">
                    <clock-circle-outlined />
                    {{ recipe.cookingTime }}分钟
                  </span>
                  <span class="difficulty-level">
                    <fire-outlined />
                    {{ recipe.difficulty }}
                  </span>
                </div>
              </div>
            </div>
          </a-card>
        </div>

        <div class="view-more-container">
          <a-button class="view-more-btn" @click="loadMoreRecipes(category.id)">
            查看更多{{ category.name }} ({{ category.totalCount }})
          </a-button>
        </div>
      </div>

      <!-- 加载全部按钮 -->
      <div class="load-all-container">
        <a-button type="primary" class="load-all-btn" @click="loadAllRecipes">
          加载全部{{ collection.recipeCount }}道春季食谱
        </a-button>
      </div>

      <!-- 推荐合集 -->
      <div class="recommended-collections">
        <h2 class="section-title">您可能还喜欢</h2>
        <div class="rec-collections-grid">
          <a-card
              v-for="rec in recommendedCollections"
              :key="rec.id"
              hoverable
              class="rec-collection-card"
              @click="goToCollection(rec.id)"
          >
            <div class="rec-collection-image">
              <img :src="rec.image" :alt="rec.title" />
            </div>
            <div class="rec-collection-content">
              <h3 class="rec-collection-title">{{ rec.title }}</h3>
              <p class="rec-collection-description">{{ rec.description }}</p>
              <div class="rec-collection-footer">
                <span class="rec-recipe-count">{{ rec.recipeCount }}道菜谱</span>
                <span class="view-link">去看看 →</span>
              </div>
            </div>
          </a-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  ShareAltOutlined,
  BookOutlined,
  BookFilled,
  FileTextOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  FireOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  ShopOutlined,
  CoffeeOutlined,
  PieChartOutlined,
  ExperimentOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()

// 格式化数字 (例如: 12500 -> 12.5K)
const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 合集数据
const collection = reactive({
  id: 'spring-recipes-2025',
  title: '春风十里不如家的味道 - 2025年春季食谱精选',
  description: '精选30道春季时令菜谱，充分利用春季新鲜食材，为家人烹饪健康美味的春日佳肴。从鲜嫩的春笋到香甜的草莓，这里有一切春天的味道。',
  coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
  tag: '编辑推荐',
  isCollected: false,
  editor: {
    name: '美食编辑部',
    avatar: 'https://i.pravatar.cc/150?img=58'
  },
  updateDate: '2025.03.01',
  recipeCount: 30,
  viewCount: 12500,
  favoriteCount: 1800,
  introContent: [
    '春天是万物复苏的季节，大自然为我们带来了丰富多样的食材。本合集精选了30道春季应季食谱，旨在充分利用春季时令食材，为您和家人带来健康美味的春日佳肴。',
    '春季是享用新鲜绿色蔬菜的最佳时节，嫩芽、春笋、菠菜都是不可错过的食材。此外，春天也是草莓、樱桃等水果的丰收季节，它们的甜美口感令人愉悦。',
    '我们的食谱分为五个部分：春季家常菜、春季轻食沙拉、春季养生汤品、春季甜点和春季早餐，全方位满足您的烹饪需求。希望这些菜谱能为您的春日餐桌增添一抹亮色！'
  ],
  tags: ['春笋', '菠菜', '草莓', '春季', '养生', '轻食', '甜点']
})

// 搜索和筛选状态
const searchKeyword = ref('')
const filters = reactive({
  category: 'all',
  difficulty: 'all',
  time: 'all'
})
const sortOption = ref('recommended')

// 分类列表
const categories = [
  { value: 'home-cooking', label: '春季家常菜' },
  { value: 'salad', label: '春季轻食沙拉' },
  { value: 'soup', label: '春季养生汤品' },
  { value: 'dessert', label: '春季甜点' },
  { value: 'breakfast', label: '春季早餐' }
]

// 显示的分类和菜谱
const displayedCategories = ref([
  {
    id: 'home-cooking',
    name: '春季家常菜',
    icon: 'home',
    totalCount: 6,
    recipes: [
      {
        id: 1,
        title: '春笋炒肉',
        image: 'https://images.unsplash.com/photo-1580959375944-abd7e991f971',
        rating: 4.8,
        description: '鲜嫩春笋搭配嫩滑猪肉，春季必备的经典家常菜，鲜香爽口。',
        cookingTime: 20,
        difficulty: '简单',
        favorite: false,
        author: {
          name: '家的味道',
          avatar: 'https://i.pravatar.cc/150?img=56'
        }
      },
      {
        id: 2,
        title: '香椿炒鸡蛋',
        image: 'https://images.unsplash.com/photo-1619221882220-947b3d3c8861',
        rating: 4.5,
        description: '春季香椿嫩芽与鸡蛋的完美搭配，鲜香浓郁，是春季不可错过的美味。',
        cookingTime: 15,
        difficulty: '简单',
        favorite: false,
        author: {
          name: '阳光厨房',
          avatar: 'https://i.pravatar.cc/150?img=33'
        }
      },
      {
        id: 3,
        title: '蒜蓉菠菜',
        image: 'https://images.unsplash.com/photo-1603048708876-806807096423',
        rating: 4.9,
        description: '春季嫩菠菜配上蒜蓉，简单又营养，是春季餐桌上的常见清爽小菜。',
        cookingTime: 10,
        difficulty: '简单',
        favorite: false,
        author: {
          name: '养生达人',
          avatar: 'https://i.pravatar.cc/150?img=45'
        }
      }
    ]
  },
  {
    id: 'salad',
    name: '春季轻食沙拉',
    icon: 'experiment',
    totalCount: 6,
    recipes: [
      {
        id: 4,
        title: '春季蔬菜沙拉',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
        rating: 4.7,
        description: '汇集春季时令蔬菜的轻食沙拉，清新爽口，维生素丰富，是春季减脂的理想选择。',
        cookingTime: 15,
        difficulty: '简单',
        favorite: true,
        author: {
          name: '健康生活家',
          avatar: 'https://i.pravatar.cc/150?img=52'
        }
      },
      {
        id: 5,
        title: '藜麦春笋沙拉',
        image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af',
        rating: 4.2,
        description: '营养丰富的藜麦搭配脆嫩春笋，加入坚果和柠檬汁调味，健康美味兼具。',
        cookingTime: 20,
        difficulty: '中等',
        favorite: false,
        author: {
          name: '健康生活家',
          avatar: 'https://i.pravatar.cc/150?img=52'
        }
      },
      {
        id: 6,
        title: '春日水果沙拉',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
        rating: 4.8,
        description: '草莓、樱桃等春季时令水果与酸奶的完美结合，清甜可口，是春季早餐或下午茶的理想选择。',
        cookingTime: 10,
        difficulty: '简单',
        favorite: false,
        author: {
          name: '甜蜜厨房',
          avatar: 'https://i.pravatar.cc/150?img=42'
        }
      }
    ]
  },
  {
    id: 'soup',
    name: '春季养生汤品',
    icon: 'pie-chart',
    totalCount: 6,
    recipes: [
      {
        id: 7,
        title: '春笋排骨汤',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
        rating: 4.6,
        description: '鲜嫩春笋与排骨熬制的鲜美汤品，清爽不油腻，春季养生必备。',
        cookingTime: 60,
        difficulty: '中等',
        favorite: false,
        author: {
          name: '养生达人',
          avatar: 'https://i.pravatar.cc/150?img=45'
        }
      },
      {
        id: 8,
        title: '菠菜豆腐汤',
        image: 'https://images.unsplash.com/photo-1608475861994-cf7bec99db1d',
        rating: 4.1,
        description: '春季嫩菠菜与滑嫩豆腐的完美搭配，清淡爽口，简单易做又营养丰富。',
        cookingTime: 20,
        difficulty: '简单',
        favorite: false,
        author: {
          name: '阳光厨房',
          avatar: 'https://i.pravatar.cc/150?img=33'
        }
      },
      {
        id: 9,
        title: '鲜蘑菌菇汤',
        image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d',
        rating: 4.9,
        description: '春季野生菌菇熬制的清鲜汤品，鲜美可口，营养丰富，提升免疫力。',
        cookingTime: 40,
        difficulty: '中等',
        favorite: true,
        author: {
          name: '家的味道',
          avatar: 'https://i.pravatar.cc/150?img=56'
        }
      }
    ]
  }
])

// 推荐合集
const recommendedCollections = ref([
  {
    id: 'spring-festival',
    title: '春节家宴特辑',
    description: '春节团圆必备的家宴菜谱，从开胃菜到主菜、甜点，一应俱全。',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd',
    recipeCount: '35'
  },
  {
    id: 'low-fat',
    title: '低脂高蛋白健身餐',
    description: '专为健身爱好者设计的低脂高蛋白食谱，助力塑形增肌。',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
    recipeCount: '18'
  },
  {
    id: 'quick-breakfast',
    title: '15分钟快手早餐',
    description: '为忙碌的早晨准备的快速营养早餐方案，让你轻松开启一天。',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    recipeCount: '25'
  }
])

// 切换收藏状态
const toggleCollect = () => {
  collection.isCollected = !collection.isCollected
  message.success(collection.isCollected ? '已收藏该合集' : '已取消收藏该合集')
}

// 切换菜谱收藏状态
const toggleFavorite = (recipeId: number) => {
  displayedCategories.value.forEach(category => {
    const recipe = category.recipes.find(r => r.id === recipeId)
    if (recipe) {
      recipe.favorite = !recipe.favorite
      message.success(recipe.favorite ? '已收藏菜谱' : '已取消收藏菜谱')
    }
  })
}

// 获取分类图标
const getCategoryIcon = (icon: string) => {
  const iconMap: Record<string, any> = {
    'home': HomeOutlined,
    'shop': ShopOutlined,
    'coffee': CoffeeOutlined,
    'pie-chart': PieChartOutlined,
    'experiment': ExperimentOutlined,
    'sun': ExperimentOutlined
  }
  return iconMap[icon] || HomeOutlined
}

// 处理搜索
const handleSearch = () => {
  // 实际项目中这里会请求后端API
  console.log('搜索关键词:', searchKeyword.value)
  message.success(`搜索: ${searchKeyword.value}`)
}

// 加载更多菜谱
const loadMoreRecipes = (categoryId: string) => {
  // 实际项目中这里会请求后端API
  console.log('加载更多菜谱，分类ID:', categoryId)
  message.info(`正在加载更多${categoryId}菜谱...`)
}

// 加载全部菜谱
const loadAllRecipes = () => {
  // 实际项目中这里会请求后端API
  console.log('加载全部30道春季食谱')
  message.info('正在加载全部春季食谱...')
}

// 跳转到菜谱详情
const goToRecipeDetail = (recipeId: number) => {
  console.log('跳转到菜谱详情，ID:', recipeId)
  router.push(`/recipes/${recipeId}`)
}

// 跳转到合集详情
const goToCollection = (collectionId: string) => {
  console.log('跳转到合集详情，ID:', collectionId)
  router.push(`/collections/${collectionId}`)
}

onMounted(() => {
  console.log('合集详情页面已加载')
})
</script>

<style scoped>
.collection-detail-container {
  background-color: #FFF8F0;
  min-height: 100vh;
}

/* 横幅 */
.hero-banner {
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center;
  margin-bottom: 32px;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%);
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 32px;
}

.collection-recommend-tag {
  display: inline-block;
  padding: 4px 12px;
  margin-bottom: 12px;
  border-radius: 20px;
  background-color: #FFEBE0;
  color: #FF9966;
  border: none;
}

.banner-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.banner-description {
  max-width: 800px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin: 0;
  line-height: 1.6;
}

.banner-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  backdrop-filter: blur(4px);
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.banner-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.editor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.editor-details {
  display: flex;
  flex-direction: column;
}

.editor-name {
  color: white;
  font-weight: 500;
}

.editor-date {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.collection-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

/* 内容容器 */
.content-container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px 64px;
}

/* 合集介绍卡片 */
.intro-card {
  border-radius: 12px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.intro-content {
  color: #666;
  line-height: 1.8;
}

.intro-paragraph {
  margin-bottom: 16px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.ingredient-tag {
  padding: 4px 12px;
  background-color: #f5f5f5;
  color: #666;
  border-radius: 20px;
  border: none;
}

/* 筛选工具栏 */
.filter-card {
  border-radius: 12px;
  margin-bottom: 24px;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-select {
  min-width: 120px;
}

.search-sort {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 240px;
}

.sort-control {
  display: flex;
  align-items: center;
}

.sort-label {
  margin-right: 8px;
  color: #666;
}

.sort-select {
  width: 120px;
}

/* 菜谱分类部分 */
.recipe-category-section {
  margin-bottom: 40px;
}

.category-header {
  margin-bottom: 24px;
}

.category-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  color: #FF9966;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.recipe-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.recipe-image-container {
  position: relative;
  height: 200px;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  color: #999;
  font-size: 16px;
}

.favorite-btn:hover {
  background-color: white;
  color: #FF9966;
}

.favorite-active {
  color: #FF4D4F;
}

.recipe-card-content {
  padding: 16px;
}

.recipe-title-rating {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.recipe-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.recipe-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.ant-rate) {
  font-size: 14px;
  color: #FFBB33;
}

:deep(.ant-rate-star) {
  margin-right: 2px;
}

.rating-value {
  font-size: 14px;
  color: #666;
}

.recipe-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.recipe-author-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recipe-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  font-size: 14px;
  color: #666;
}

.recipe-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.cooking-time, .difficulty-level {
  display: flex;
  align-items: center;
  gap: 4px;
}

.view-more-container {
  display: flex;
  justify-content: center;
}

.view-more-btn {
  padding: 0 24px;
  height: 36px;
  border-color: #ddd;
  color: #666;
}

.view-more-btn:hover {
  color: #FF9966;
  border-color: #FF9966;
}

/* 加载全部按钮 */
.load-all-container {
  margin: 32px 0 48px;
  display: flex;
  justify-content: center;
}

.load-all-btn {
  height: 44px;
  padding: 0 32px;
  font-size: 16px;
  border-radius: 8px;
  background-color: #FF9966;
  border: none;
}

.load-all-btn:hover {
  background-color: #FF8855;
}

/* 推荐合集 */
.recommended-collections {
  margin-top: 48px;
}

.rec-collections-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.rec-collection-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.rec-collection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.rec-collection-image {
  height: 160px;
  overflow: hidden;
}

.rec-collection-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.rec-collection-card:hover .rec-collection-image img {
  transform: scale(1.05);
}

.rec-collection-content {
  padding: 16px;
}

.rec-collection-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.rec-collection-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.rec-collection-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rec-recipe-count {
  font-size: 14px;
  color: #666;
}

.view-link {
  font-size: 14px;
  color: #FF9966;
}

/* 响应式样式 */
@media (max-width: 1200px) {
  .banner-title {
    font-size: 28px;
  }
}

@media (max-width: 992px) {
  .recipe-grid, .rec-collections-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-banner {
    height: auto;
    min-height: 400px;
  }

  .banner-content {
    padding-top: 100px;
  }

  .banner-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filters, .search-sort {
    width: 100%;
  }

  .search-sort {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .search-input {
    width: 100%;
  }

  .sort-control {
    width: 100%;
  }

  .sort-select {
    flex-grow: 1;
  }
}

@media (max-width: 576px) {
  .recipe-grid, .rec-collections-grid {
    grid-template-columns: 1fr;
  }

  .banner-title {
    font-size: 24px;
  }

  .banner-actions {
    display: none;
  }
}
</style>