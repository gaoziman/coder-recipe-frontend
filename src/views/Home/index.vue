<template>
  <div class="home-container">
    <!-- 网站公告横幅 -->
    <div v-if="showAnnouncement" class="announcement-banner">
      <div class="announcement-content">
        <notification-outlined class="announcement-icon" />
        <div class="announcement-text">
          新年特辑上线啦！春节家宴必备的20道经典菜谱，立即查看
          <a class="announcement-link" @click="viewAnnouncement">了解更多</a>
        </div>
      </div>
      <a-button
          type="text"
          class="close-btn"
          @click="closeAnnouncement"
          :title="'关闭'"
      >
        <close-outlined />
      </a-button>
    </div>

    <!-- 推荐菜谱横幅区域 -->
    <div class="featured-banner">
      <div class="featured-content">
        <h2 class="featured-title">本周人气菜谱</h2>
        <p class="featured-desc">精选健康美味的家常菜，简单易学，适合所有人</p>
        <a-button type="primary" class="featured-btn" @click="exploreTopRecipes">
          立即探索
          <right-outlined />
        </a-button>
      </div>
      <div class="featured-image" :style="{ backgroundImage: `url(https://images.unsplash.com/photo-1547592180-85f173990554)` }"></div>
    </div>

    <!-- 当季食材推荐 -->
    <div class="section seasonal-section">
      <div class="section-header">
        <h2 class="section-title">当季食材</h2>
        <a-button type="link" class="view-more-btn" @click="viewMoreSeasonal">
          更多 <right-outlined />
        </a-button>
      </div>
      <div class="seasonal-ingredients">
        <div class="ingredient-card" v-for="ingredient in seasonalIngredients" :key="ingredient.id" @click="filterByIngredient(ingredient.name)">
          <div class="ingredient-icon" :style="{ backgroundImage: `url(${ingredient.imageUrl})` }"></div>
          <div class="ingredient-name">{{ ingredient.name }}</div>
        </div>
      </div>
    </div>

    <!-- 推荐菜谱区域 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">推荐菜谱</h2>
        <a-button type="link" class="view-more-btn" @click="viewMoreRecommended">
          更多 <right-outlined />
        </a-button>
      </div>
      <div class="recipe-grid">
        <div class="recipe-wrapper" v-for="recipe in recommendedRecipes" :key="recipe.id" @click="viewRecipe(recipe.id)">
          <recipe-card :recipe="recipe" />
        </div>

        <!-- 添加新菜谱卡片 -->
        <div class="recipe-wrapper no-focus-outline">
          <div class="add-recipe-card" @click="goToAddRecipe" tabindex="-1">
            <plus-outlined />
            <span>添加新菜谱</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 人气食谱合集 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">精选合集</h2>
        <a-button type="link" class="view-more-btn" @click="viewMoreCollections">
          更多 <right-outlined />
        </a-button>
      </div>
      <div class="collections-grid">
        <div class="collection-card" v-for="collection in popularCollections" :key="collection.id" @click="viewCollection(collection.id)">
          <div class="collection-image" :style="{ backgroundImage: `url(${collection.imageUrl})` }">
            <div class="collection-overlay">
              <h3 class="collection-title">{{ collection.title }}</h3>
              <div class="collection-count">{{ collection.recipeCount }}个菜谱</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 烹饪技巧与小贴士 - 完善版 -->
    <div class="section tips-section">
      <div class="section-header">
        <h2 class="section-title">烹饪小贴士</h2>
        <a-button type="link" class="view-more-btn" @click="viewMoreTips">
          更多 <right-outlined />
        </a-button>
      </div>

      <!-- 添加一个标签选择器 -->
      <div class="tip-tags">
        <a-tag
            v-for="(tag, index) in tipTags"
            :key="index"
            :color="activeTag === tag ? '#fa8c16' : ''"
            @click="filterTipsByTag(tag)"
            class="tip-tag"
        >
          {{ tag }}
        </a-tag>
      </div>

      <div class="tips-grid">
        <div class="tip-card" v-for="tip in filteredCookingTips" :key="tip.id" @click="viewTip(tip.id)">
          <div class="tip-icon">
            <component :is="tip.icon" />
          </div>
          <div class="tip-content">
            <h3 class="tip-title">{{ tip.title }}</h3>
            <p class="tip-desc">{{ tip.description }}</p>
            <div class="tip-footer">
              <span class="tip-category">{{ tip.category }}</span>
              <span class="tip-likes">{{ tip.likes }} 人觉得有用</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加视频教程区块 -->
      <div class="video-tutorial">
        <h3 class="video-tutorial-title">本周精选教学视频</h3>
        <div class="video-preview" @click="watchTutorial">
          <div class="video-thumbnail" :style="{ backgroundImage: `url(https://images.unsplash.com/photo-1556909114-44e3e9e23b11)` }">
            <div class="play-button">
              <play-circle-outlined />
            </div>
          </div>
          <div class="video-info">
            <h4 class="video-title">刀工基础：三种最实用的蔬菜切法</h4>
            <p class="video-desc">掌握这些基础切法，提升烹饪效率和菜品质感</p>
            <div class="video-meta">
              <clock-outlined /> 8分钟
              <eye-outlined class="ml-12" /> 2,458次观看
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 智能助手浮动按钮 -->
    <div class="ai-assistant-button" @click="toggleAssistant">
      <robot-outlined v-if="!assistantOpen" />
      <close-outlined v-else />
    </div>

    <div v-if="assistantOpen" class="ai-assistant-panel">
      <div class="assistant-header">
        <robot-outlined />
        <span>厨房小帮手</span>
      </div>
      <div class="assistant-content">
        <div class="assistant-message">
          你好！我是你的厨房小帮手。有什么可以帮到你的吗？
        </div>
        <div class="assistant-suggestions">
          <a-button size="small" @click="askQuestion('如何处理剩菜剩饭？')">如何处理剩菜剩饭？</a-button>
          <a-button size="small" @click="askQuestion('替代食材推荐')">替代食材推荐</a-button>
          <a-button size="small" @click="askQuestion('今天吃什么？')">今天吃什么？</a-button>
        </div>
      </div>
      <div class="assistant-input">
        <a-input placeholder="输入你的问题..." v-model:value="assistantQuery" @pressEnter="sendQuery" />
        <a-button type="primary" shape="circle" @click="sendQuery">
          <send-outlined />
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, computed} from 'vue'
import {
  PlusOutlined,
  RightOutlined,
  NotificationOutlined,
  CloseOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  RobotOutlined,
  SendOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import RecipeCard from '@/components/RecipeCard/index.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

// 设置中文语言
dayjs.locale('zh-cn')

const router = useRouter()
const showAnnouncement = ref(true)

// 关闭公告
const closeAnnouncement = () => {
  showAnnouncement.value = false
  // 可以在这里设置localStorage，让公告关闭状态保持一段时间
  localStorage.setItem('announcement_closed', 'true')
  localStorage.setItem('announcement_closed_time', Date.now().toString())
}

// 查看公告详情
const viewAnnouncement = () => {
  router.push('/announcements/spring-festival-2024')
}

// 推荐菜谱数据
const recommendedRecipes = ref([
  {
    id: 1,
    title: '蒜蓉西兰花',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    tags: ['素食', '快手菜'],
    cookCount: 12,
    lastCooked: '2024-01-20'
  },
  {
    id: 2,
    title: '番茄炒蛋',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    tags: ['快手菜'],
    cookCount: 18,
    lastCooked: '2024-01-22'
  },
  {
    id: 3,
    title: '清蒸鱼',
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2',
    tags: ['晚餐'],
    cookCount: 5,
    lastCooked: '2024-01-25'
  }
])

// 当季食材数据
const seasonalIngredients = ref([
  { id: 1, name: '西红柿', imageUrl: 'https://images.unsplash.com/photo-1558818498-28c1e002b655' },
  { id: 2, name: '茄子', imageUrl: 'https://images.unsplash.com/photo-1635342219731-4ae2bf5bcc60' },
  { id: 3, name: '黄瓜', imageUrl: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6' },
  { id: 4, name: '胡萝卜', imageUrl: 'https://images.unsplash.com/photo-1598170845053-a6151d2d4055' },
  { id: 5, name: '菠菜', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb' },
  { id: 6, name: '青椒', imageUrl: 'https://images.unsplash.com/photo-1563699498778-aa3a7c455ac6' }
])

// 人气合集数据
const popularCollections = ref([
  {
    id: 1,
    title: '简易家常菜',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    recipeCount: 12
  },
  {
    id: 2,
    title: '健康低脂餐',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    recipeCount: 8
  },
  {
    id: 3,
    title: '春季时令菜',
    imageUrl: 'https://images.unsplash.com/photo-1620589125118-b558371e0b5c',
    recipeCount: 15
  }
])

// 小贴士标签和筛选功能
const tipTags = ref(['全部', '食材处理', '烹饪技巧', '厨房管理', '营养搭配'])
const activeTag = ref('全部')

// 扩展小贴士数据
const cookingTips = ref([
  {
    id: 1,
    title: '正确处理蔬菜',
    description: '如何洗净、切割和保存蔬菜以保持最佳口感和营养。先用流动水冲洗蔬菜，再浸泡5分钟去除农药残留。',
    icon: 'bulb-outlined',
    category: '食材处理',
    likes: 328
  },
  {
    id: 2,
    title: '掌握火候技巧',
    description: '了解不同食材的最佳烹饪温度和时间，做出完美菜品。肉类煎制前要回温，鱼类宜用中小火慢煎保持鲜嫩。',
    icon: 'fire-outlined',
    category: '烹饪技巧',
    likes: 256
  },
  {
    id: 3,
    title: '高效厨房管理',
    description: '如何规划烹饪流程，节省时间并保持厨房整洁。建立"边做边清洁"的习惯，准备食材时按烹饪顺序排列。',
    icon: 'clock-outlined',
    category: '厨房管理',
    likes: 187
  },
  {
    id: 4,
    title: '调味品搭配秘诀',
    description: '掌握调味品的平衡搭配，让家常菜提升到餐厅水准。酸甜苦辣咸五味平衡是提升菜品层次感的关键。',
    icon: 'star-outlined',
    category: '营养搭配',
    likes: 243
  },
  {
    id: 5,
    title: '油温判断方法',
    description: '学会不用温度计也能准确判断油温。筷尖入油有气泡缓慢上升是中温，筷尖周围气泡快速上升是高温。',
    icon: 'fire-outlined',
    category: '烹饪技巧',
    likes: 215
  },
  {
    id: 6,
    title: '食材保鲜延长法',
    description: '几种简单方法让你的蔬菜水果保鲜期延长一倍。将绿叶菜用厨房纸包裹后放入保鲜袋，排出空气后冷藏。',
    icon: 'bulb-outlined',
    category: '食材处理',
    likes: 198
  }
])


// 智能助手相关状态
const assistantOpen = ref(false)
const assistantQuery = ref('')

// 筛选小贴士的方法
const filterTipsByTag = (tag) => {
  activeTag.value = tag
}

// 计算属性：根据标签筛选小贴士
const filteredCookingTips = computed(() => {
  if (activeTag.value === '全部') {
    return cookingTips.value
  } else {
    return cookingTips.value.filter(tip => tip.category === activeTag.value)
  }
})

// 切换助手面板
const toggleAssistant = () => {
  assistantOpen.value = !assistantOpen.value
}

// 发送问题
const sendQuery = () => {
  if (assistantQuery.value.trim()) {
    // 这里可以接入实际的AI服务
    console.log('发送问题:', assistantQuery.value)
    assistantQuery.value = ''
  }
}

// 点击预设问题
const askQuestion = (question) => {
  assistantQuery.value = question
  sendQuery()
}

// 页面交互方法
const goToAddRecipe = () => {
  router.push('/recipes/add')
}

const exploreTopRecipes = () => {
  router.push('/recipes/explore?sort=popular')
}

const viewMoreRecommended = () => {
  router.push('/recipes/explore')
}

const viewMoreSeasonal = () => {
  router.push('/ingredients/seasonal')
}

const viewMoreCollections = () => {
  router.push('/collections')
}

const viewCollection = (id) => {
  router.push(`/collections/${id}`)
}

const viewMoreTips = () => {
  router.push('/tips')
}

const viewTip = (id) => {
  router.push(`/tips/${id}`)
}


const filterByIngredient = (name) => {
  router.push(`/recipes?explore=${name}`)
}

// 观看教程视频
const watchTutorial = () => {
  router.push('/tutorials/knife-skills')
}

// 查看食谱详情
const viewRecipe = (id) => {
  router.push(`/recipes/${id}`) // 确保这个方法被调用
}

// 检查公告是否已关闭
onMounted(() => {
  const announcementClosed = localStorage.getItem('announcement_closed')
  const closedTime = localStorage.getItem('announcement_closed_time')

  // 如果公告已关闭且关闭时间不超过7天，则不显示公告
  if (announcementClosed === 'true' && closedTime) {
    const now = Date.now()
    const closedTimeValue = parseInt(closedTime)
    const daysSinceClosed = (now - closedTimeValue) / (1000 * 60 * 60 * 24)

    if (daysSinceClosed < 7) {
      showAnnouncement.value = false
    }
  }
})
</script>

<style scoped>
.home-container {
  padding: 24px 16px;
  background: #f5f5f7;
}

/* 公告横幅 */
.announcement-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fef6e8;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.announcement-content {
  display: flex;
  align-items: center;
}

.announcement-icon {
  font-size: 18px;
  color: #fa8c16;
  margin-right: 12px;
}

.announcement-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.75);
}

.announcement-link {
  color: #fa8c16;
  margin-left: 8px;
  cursor: pointer;
  text-decoration: underline;
}

.announcement-link:hover {
  color: #fd9a30;
}

.close-btn {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.close-btn:hover {
  color: rgba(0, 0, 0, 0.65);
}

/* 特色横幅 */
.featured-banner {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
  background: linear-gradient(to right, #fff9f0, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.featured-content {
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.85);
}

.featured-desc {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 20px;
}

.featured-btn {
  background: #fa8c16;
  border-color: #fa8c16;
  align-self: flex-start;
}

.featured-btn:hover {
  background: #fd9a30;
  border-color: #fd9a30;
}

.featured-image {
  width: 50%;
  background-size: cover;
  background-position: center;
}

/* 通用区块样式 */
.section {
  margin-bottom: 40px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
  position: relative;
  padding-left: 12px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background: #fa8c16;
  border-radius: 2px;
}

.view-more-btn {
  font-size: 14px;
  color: #fa8c16;
  padding: 0;
  height: auto;
}

.view-more-btn:hover {
  color: #fd9a30;
}

/* 当季食材区 */
.seasonal-ingredients {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 4px 0 12px 0;
}

.seasonal-ingredients::-webkit-scrollbar {
  height: 4px;
}

.seasonal-ingredients::-webkit-scrollbar-thumb {
  background: #e8e8e8;
  border-radius: 4px;
}

.ingredient-card {
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.ingredient-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #fff;
  transition: all 0.3s;
}

.ingredient-card:hover .ingredient-icon {
  transform: scale(1.05);
  border-color: #fa8c16;
}

.ingredient-name {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

/* 菜谱网格 */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.recipe-wrapper {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.recipe-wrapper:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.no-focus-outline:focus,
.no-focus-outline *:focus {
  outline: none !important;
  box-shadow: none !important;
}

.add-recipe-card {
  height: 236px;
  background: #ffffff;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #8c8c8c;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
}

.add-recipe-card .anticon,
.add-recipe-card :deep(.anticon) {
  font-size: 24px;
  margin-bottom: 8px;
  color: #bfbfbf;
}

.add-recipe-card:hover {
  border-color: #fa8c16;
  color: #fa8c16;
}

.add-recipe-card:hover .anticon,
.add-recipe-card:hover :deep(.anticon) {
  color: #fa8c16;
}

/* 收藏集卡片 */
.collections-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.collection-card {
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.collection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.collection-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.collection-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.collection-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.collection-count {
  font-size: 12px;
  opacity: 0.9;
}

/* 小贴士区域优化样式 */
.tips-section {
  position: relative;
  background: linear-gradient(to bottom right, #fff, #fafafa);
}

.tip-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.tip-tag {
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 16px;
  transition: all 0.3s;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.tip-card {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  background: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

.tip-card:hover {
  background: #fff5e6;
  transform: translateY(-2px);
}

.tip-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fef6e8;
  color: #fa8c16;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
}

.tip-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.tip-desc {
  margin: 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.5;
}

.tip-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
}

.tip-category {
  color: #fa8c16;
  background: rgba(250, 140, 22, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
}

.tip-likes {
  color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
}

.tip-likes::before {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23fa8c16"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>');
  background-size: contain;
  margin-right: 4px;
}

/* 视频教程样式 */
.video-tutorial {
  margin-top: 30px;
  border-top: 1px dashed #f0f0f0;
  padding-top: 20px;
}

.video-tutorial-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.video-preview {
  display: flex;
  gap: 16px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s;
}

.video-preview:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.video-thumbnail {
  width: 240px;
  height: 135px;
  background-size: cover;
  background-position: center;
  position: relative;
  flex-shrink: 0;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  opacity: 0.8;
  transition: all 0.3s;
}

.video-preview:hover .play-button {
  opacity: 1;
  background: rgba(250, 140, 22, 0.8);
  transform: translate(-50%, -50%) scale(1.1);
}

.video-info {
  padding: 16px;
  flex: 1;
}

.video-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
}

.video-desc {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.video-meta {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
}

.ml-12 {
  margin-left: 12px;
}

.meal-empty .anticon {
  font-size: 16px;
  margin-bottom: 2px;
}

/* 智能助手样式 */
.ai-assistant-button {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fa8c16;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 16px rgba(250, 140, 22, 0.3);
  cursor: pointer;
  z-index: 99;
  transition: all 0.3s;
}

.ai-assistant-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(250, 140, 22, 0.4);
}

.ai-assistant-panel {
  position: fixed;
  right: 24px;
  bottom: 84px;
  width: 320px;
  height: 400px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  z-index: 99;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.assistant-header {
  padding: 12px 16px;
  background: #fa8c16;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.assistant-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.assistant-message {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 12px 12px 12px 0;
  margin-bottom: 16px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.75);
}

.assistant-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.assistant-input {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
}

/* 响应式布局 */

@media (max-width: 992px) {
  .featured-banner {
    flex-direction: column-reverse;
  }

  .featured-image {
    width: 100%;
    height: 200px;
  }

  .recipe-grid, .collections-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .video-preview {
    flex-direction: column;
  }

  .video-thumbnail {
    width: 100%;
    height: 180px;
  }
}

@media (max-width: 768px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .collections-grid {
    grid-template-columns: 1fr;
  }

  .home-container {
    padding: 16px 12px;
  }

  .announcement-text {
    font-size: 13px;
  }

  .video-preview {
    flex-direction: column;
  }

  .video-thumbnail {
    width: 100%;
    height: 180px;
  }
}

@media (max-width: 576px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .featured-content {
    padding: 20px;
  }

  .featured-title {
    font-size: 20px;
  }

  .section-title {
    font-size: 16px;
  }

  .announcement-banner {
    padding: 10px 12px;
  }

  .announcement-text {
    font-size: 12px;
  }

  .tip-tags {
    overflow-x: auto;
    padding-bottom: 8px;
    flex-wrap: nowrap;
  }

  .ai-assistant-panel {
    width: calc(100% - 32px);
    right: 16px;
  }
}
</style>