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
        <div class="recipe-wrapper" v-for="recipe in recommendedRecipes" :key="recipe.id">
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

    <!-- 烹饪技巧与小贴士 -->
    <div class="section tips-section">
      <div class="section-header">
        <h2 class="section-title">烹饪小贴士</h2>
        <a-button type="link" class="view-more-btn" @click="viewMoreTips">
          更多 <right-outlined />
        </a-button>
      </div>
      <div class="tips-grid">
        <div class="tip-card" v-for="tip in cookingTips" :key="tip.id" @click="viewTip(tip.id)">
          <div class="tip-icon">
            <component :is="tip.icon" />
          </div>
          <div class="tip-content">
            <h3 class="tip-title">{{ tip.title }}</h3>
            <p class="tip-desc">{{ tip.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 社区人气厨师 -->
    <div class="section chefs-section">
      <div class="section-header">
        <h2 class="section-title">人气厨师</h2>
        <a-button type="link" class="view-more-btn" @click="viewMoreChefs">
          更多 <right-outlined />
        </a-button>
      </div>
      <div class="chefs-grid">
        <div class="chef-card" v-for="chef in popularChefs" :key="chef.id" @click="viewChefProfile(chef.id)">
          <div class="chef-avatar" :style="{ backgroundImage: `url(${chef.avatarUrl})` }"></div>
          <div class="chef-info">
            <h3 class="chef-name">{{ chef.name }}</h3>
            <p class="chef-bio">{{ chef.bio }}</p>
            <div class="chef-stats">
              <span class="chef-recipes">{{ chef.recipeCount }}个菜谱</span>
              <span class="chef-followers">{{ chef.followers }}个粉丝</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {
  PlusOutlined,
  RightOutlined,
  FireOutlined,
  ClockOutlined,
  StarOutlined,
  BulbOutlined,
  NotificationOutlined,
  CloseOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import RecipeCard from '@/components/RecipeCard/index.vue'

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

// 烹饪小贴士
const cookingTips = ref([
  {
    id: 1,
    title: '正确处理蔬菜',
    description: '如何洗净、切割和保存蔬菜以保持最佳口感和营养',
    icon: 'bulb-outlined'
  },
  {
    id: 2,
    title: '掌握火候技巧',
    description: '了解不同食材的最佳烹饪温度和时间，做出完美菜品',
    icon: 'fire-outlined'
  },
  {
    id: 3,
    title: '高效厨房管理',
    description: '如何规划烹饪流程，节省时间并保持厨房整洁',
    icon: 'clock-outlined'
  },
  {
    id: 4,
    title: '调味品搭配秘诀',
    description: '掌握调味品的平衡搭配，让家常菜提升到餐厅水准',
    icon: 'star-outlined'
  }
])

// 人气厨师数据
const popularChefs = ref([
  {
    id: 1,
    name: '王大厨',
    avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90',
    bio: '专注家常菜20年，擅长川菜',
    recipeCount: 48,
    followers: 1254
  },
  {
    id: 2,
    name: '李老师',
    avatarUrl: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16',
    bio: '健康饮食倡导者，素食达人',
    recipeCount: 36,
    followers: 986
  },
  {
    id: 3,
    name: '张师傅',
    avatarUrl: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f',
    bio: '米其林星级餐厅大厨，专注中西融合',
    recipeCount: 27,
    followers: 2134
  }
])

// 页面交互方法
const goToAddRecipe = () => {
  router.push('/recipes/add')
}

const exploreTopRecipes = () => {
  router.push('/recipes/top')
}

const viewMoreRecommended = () => {
  router.push('/recipes/recommended')
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

const viewMoreChefs = () => {
  router.push('/chefs')
}

const viewChefProfile = (id) => {
  router.push(`/chefs/${id}`)
}

const filterByIngredient = (name) => {
  router.push(`/recipes?ingredient=${name}`)
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

/* 烹饪技巧区 */
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

/* 人气厨师区 */
.chefs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.chef-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  background: #f9f9f9;
  transition: all 0.3s;
  cursor: pointer;
}

.chef-card:hover {
  background: #fff5e6;
  transform: translateY(-2px);
}

.chef-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin-bottom: 12px;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chef-info {
  text-align: center;
  width: 100%;
}

.chef-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.chef-bio {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.5;
}

.chef-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .recipe-grid, .collections-grid, .chefs-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

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

  .tips-grid, .chefs-grid {
    grid-template-columns: 1fr;
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
}
</style>