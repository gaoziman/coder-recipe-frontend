<template>
  <div class="cooking-tips-list">
    <!-- 头部横幅 -->
    <div class="hero-banner">
      <div class="hero-content">
        <h1 class="hero-title">烹饪小贴士</h1>
        <p class="hero-subtitle">探索专业厨师的烹饪秘诀，让美食制作更简单</p>
        <div class="search-container">
          <a-input-search
              placeholder="搜索烹饪技巧..."
              enter-button="搜索"
              size="large"
              class="search-input"
              @search="onSearch"
          />
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 热门标签云 -->
      <div class="tag-cloud">
        <h3 class="section-subheading">热门搜索</h3>
        <div class="popular-tags">
          <a-tag v-for="tag in popularTags" :key="tag" class="popular-tag">{{ tag }}</a-tag>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="category-filter">
        <div class="filter-header">
          <h2 class="section-heading">烹饪技巧分类</h2>
          <a-button type="link" class="view-all-link" @click="viewAll">
            查看全部
            <RightOutlined />
          </a-button>
        </div>

        <div class="filter-tabs">
          <a-radio-group v-model:value="currentCategory" button-style="solid">
            <a-tag value="all" class="popular-tag">全部</a-tag>
            <a-tag v-for="category in categories" :key="category.value" :value="category.value" class="popular-tag">
              {{ category.label }}
            </a-tag>
          </a-radio-group>
        </div>
      </div>

      <!-- 精选技巧轮播 -->
      <div class="featured-tips" v-if="featuredTips.length > 0">
        <h3 class="section-subheading">精选技巧</h3>
        <a-carousel autoplay class="featured-carousel">
          <div v-for="tip in featuredTips" :key="tip.id" class="carousel-slide">
            <div class="carousel-content">
              <div class="carousel-text">
                <a-tag :color="getCategoryColor(tip.category)">{{ tip.category }}</a-tag>
                <h3 class="carousel-title">{{ tip.title }}</h3>
                <p class="carousel-description">{{ tip.description }}</p>
                <a-button type="primary" class="read-more-btn" @click="goToDetail(tip.id)">
                  查看详情
                </a-button>
              </div>
              <div class="carousel-image">
                <img :src="tip.image" :alt="tip.title" />
              </div>
            </div>
          </div>
        </a-carousel>
      </div>


      <div class="tips-section">
        <div class="tips-container">
          <!-- 左侧：小贴士列表 -->
          <div class="cooking-tips-wrapper">
            <h3 class="section-subheading">烹饪小贴士</h3>
            <div class="tips-grid">
              <div class="tip-item" v-for="tip in filteredTips" :key="tip.id" @click="goToDetail(tip.id)">
                <div class="cooking-tip-card">
                  <!-- 分类标签 -->
                  <div class="category-tag">{{ tip.category }}</div>

                  <div class="card-content">
                    <!-- 图片部分 -->
                    <div class="image-container">
                      <img :src="tip.image" :alt="tip.title" class="card-image">
                      <div class="image-overlay">
                        <EyeOutlined class="view-icon" />
                      </div>
                    </div>

                    <!-- 文字内容部分 -->
                    <div class="text-content">
                      <h3 class="tip-title">{{ tip.title }}</h3>
                      <p class="tip-description">{{ tip.description }}</p>

                      <!-- 作者信息和统计 -->
                      <div class="card-footer">
                        <div class="author-info">
                          <a-avatar :src="tip.authorAvatar" :size="28" />
                          <span class="author-name">{{ tip.author }}</span>
                        </div>
                        <div class="card-stats">
                          <span class="publish-time">{{ tip.time }}</span>
                          <span class="view-count">
                      <EyeOutlined /> {{ tip.views }}
                    </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：每日贴士 -->
          <div class="daily-tips-wrapper">
            <h3 class="section-subheading">每日烹饪贴士</h3>
            <div class="daily-tips-list">
              <div v-for="(tip, index) in dailyTips" :key="index" class="daily-tip">
                <div class="daily-tip-content">
                  <div class="daily-tip-text">
                    <p class="daily-tip-description">{{ tip.content }}</p>
                    <div class="daily-tip-author">
                      <a-avatar :src="tip.authorAvatar" :size="28" />
                      <span>{{ tip.author }}</span>
                    </div>
                  </div>
                  <div class="daily-tip-image">
                    <img :src="tip.image" alt="每日贴士" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 季节性技巧 -->
      <div class="seasonal-tips">
        <div class="seasonal-header">
          <h3 class="section-subheading">应季技巧</h3>
          <span class="seasonal-label">{{ currentSeason }}推荐</span>
        </div>
        <div class="seasonal-cards">
          <a-row :gutter="[24, 24]">
            <a-col :span="8" v-for="tip in seasonalTips" :key="tip.id">
              <div class="seasonal-card">
                <img :src="tip.image" :alt="tip.title" class="seasonal-image" />
                <div class="seasonal-content">
                  <h4 class="seasonal-title">{{ tip.title }}</h4>
                  <p class="seasonal-description">{{ tip.description }}</p>
                  <a-button type="link" class="seasonal-link" @click="goToDetail(tip.id)">
                    阅读更多 <RightOutlined />
                  </a-button>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <a-pagination
            :current="currentPage"
            :total="totalTips"
            :pageSize="pageSize"
            show-quick-jumper
            @change="onPageChange"
        />
      </div>
    </div>

    <!-- 订阅区域 -->
    <div class="subscribe-section">
      <div class="subscribe-content">
        <h3 class="subscribe-title">订阅烹饪技巧推送</h3>
        <p class="subscribe-description">每周获取精选烹饪技巧，提升您的厨艺水平</p>
        <div class="subscribe-form">
          <a-input placeholder="输入您的邮箱" class="subscribe-input" />
          <a-button type="primary" class="subscribe-btn">订阅</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  RightOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 当前分类
const currentCategory = ref('all')

// 分页
const currentPage = ref(1)
const pageSize = ref(6)
const totalTips = ref(24)

// 热门标签
const popularTags = ref([
  '炒菜技巧', '刀工入门', '调味比例', '食材保鲜', '厨房清洁',
  '肉类处理', '烘焙窍门', '蔬菜处理', '海鲜烹饪', '快手菜'
])

// 分类数据
const categories = ref([
  { label: '切配技巧', value: 'cutting' },
  { label: '烹调方法', value: 'cooking' },
  { label: '调味指南', value: 'seasoning' },
  { label: '食材保存', value: 'storage' },
  { label: '厨房工具', value: 'tools' }
])

// 季节信息
const currentSeason = ref('夏季')

// 每日小贴士
const dailyTips = ref([
  {
    content: '烹饪蔬菜前，可先将蔬菜在盐水中浸泡3-5分钟，能够有效去除农药残留。煮面条时，加入少许橄榄油可以防止面条黏在一起。',
    author: '张主厨',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554'
  },
  {
    content: '炒菜时先把葱姜蒜炒香再下食材，能够更好地激发香味。处理鱼时，可以用厨房纸吸干表面水分，这样煎制时更容易得到酥脆的表皮。',
    author: '李大厨',
    authorAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae'
  },
  {
    content: '做酱汁时，加入少量蜂蜜可以平衡酸度，增加风味层次。煎肉类食材前，先将肉取出至室温放置15-20分钟，能使肉质更嫩，熟度更均匀。',
    author: '王师傅',
    authorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975'
  }
])

// 精选技巧
const featuredTips = ref([
  {
    id: 'f1',
    title: '掌握火候的秘诀',
    description: '不同食材需要不同的火候，了解如何掌握完美的温度和时间，让每一道菜肴都能发挥最佳口感。',
    category: '烹调方法',
    image: 'https://images.unsplash.com/photo-1551218372-748527cdf3b7'
  },
  {
    id: 'f2',
    title: '打造完美酱汁',
    description: '酱汁是提升菜肴风味的关键，学习经典酱汁的比例和技巧，轻松为家常菜增添专业水准。',
    category: '调味指南',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8'
  },
  {
    id: 'f3',
    title: '厨房收纳整理术',
    description: '高效的厨房布局和收纳方式能大大提升烹饪效率，学习专业厨师的空间利用技巧。',
    category: '厨房工具',
    image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7'
  }
])

// 应季技巧
const seasonalTips = ref([
  {
    id: 's1',
    title: '夏季蔬果保鲜法',
    description: '炎炎夏日，蔬果容易腐坏，学习正确的保存方法，延长食材的新鲜度。',
    image: 'https://images.unsplash.com/photo-1571211905393-6de67ff8fb61'
  },
  {
    id: 's2',
    title: '夏季消暑饮品制作',
    description: '自制清凉饮品，不但健康还能解暑，简单几步打造专业级饮品。',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd'
  },
  {
    id: 's3',
    title: '夏季轻食料理',
    description: '炎热天气胃口不佳？尝试这些开胃又营养的轻食料理，让夏日饮食更健康。',
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0'
  }
])

// 小贴士列表数据
const tipsList = ref([
  {
    id: 1,
    title: '7种常见蔬菜的切配法',
    description: '了解不同切法对烹饪效果的影响，掌握专业厨师切配蔬菜的技巧，让你的菜肴更加美观可口。',
    category: '切配技巧',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9',
    author: '张厨师',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    time: '2天前',
    views: '1.2K'
  },
  {
    id: 2,
    title: '家常菜的调味秘诀',
    description: '学会精准调味，让普通食材散发出惊人美味，这些简单的调味技巧将帮助你轻松提升菜肴风味。',
    category: '调味指南',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    author: '李大厨',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    time: '3天前',
    views: '3.5K'
  },
  {
    id: 3,
    title: '蔬果保鲜小窍门',
    description: '延长蔬果保鲜期的实用技巧，掌握正确的储存方法，减少食材浪费，保持最佳口感和营养价值。',
    category: '食材保存',
    image: 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e',
    author: '王营养师',
    authorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    time: '5天前',
    views: '2.7K'
  },
  {
    id: 4,
    title: '完美煎鱼不粘锅的技巧',
    description: '告别煎鱼粘锅的困扰，学习专业厨师的小技巧，让鱼皮金黄酥脆，鱼肉鲜嫩多汁。',
    category: '烹调方法',
    image: 'https://images.unsplash.com/photo-1630385703461-35fdecec9f4b',
    author: '赵师傅',
    authorAvatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    time: '1周前',
    views: '5.8K'
  },
  {
    id: 5,
    title: '新手必备的5种厨房工具',
    description: '选择合适的厨房工具可以大大提高烹饪效率，这些实用工具让初学者也能轻松掌握烹饪要领。',
    category: '厨房工具',
    image: 'https://images.unsplash.com/photo-1591261730799-ee4e6c2d4209',
    author: '刘美食家',
    authorAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    time: '1周前',
    views: '4.1K'
  },
  {
    id: 6,
    title: '如何炒出完美的蛋炒饭',
    description: '从米饭准备到火候控制，详解制作松散、颗粒分明、香气四溢的蛋炒饭的全部秘诀。',
    category: '烹调方法',
    image: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98',
    author: '陈师傅',
    authorAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    time: '2周前',
    views: '6.3K'
  }
])

// 根据分类筛选小贴士
const filteredTips = computed(() => {
  if (currentCategory.value === 'all') {
    return tipsList.value
  }
  return tipsList.value.filter(tip => {
    const categoryMap = {
      'cutting': '切配技巧',
      'cooking': '烹调方法',
      'seasoning': '调味指南',
      'storage': '食材保存',
      'tools': '厨房工具'
    }
    return tip.category === categoryMap[currentCategory.value]
  })
})

// 根据分类获取标签颜色
const getCategoryColor = (category) => {
  const colorMap = {
    '切配技巧': 'green',
    '烹调方法': 'volcano',
    '调味指南': 'gold',
    '食材保存': 'blue',
    '厨房工具': 'purple'
  }
  return colorMap[category] || 'default'
}

// 分页变化
const onPageChange = (page) => {
  currentPage.value = page
  // 在实际应用中这里应该请求新的数据
}

// 搜索
const onSearch = (value) => {
  console.log('搜索:', value)
  // 实际应用中这里应该根据搜索词筛选数据
}

// 查看全部
const viewAll = () => {
  currentCategory.value = 'all'
}

// 跳转到详情页
const goToDetail = (id) => {
  router.push({ name: 'CookingTipDetail', params: { id } })
}

// 获取季节信息
const getSeason = () => {
  const date = new Date()
  const month = date.getMonth() + 1
  if (month >= 3 && month <= 5) {
    return '春季'
  } else if (month >= 6 && month <= 8) {
    return '夏季'
  } else if (month >= 9 && month <= 11) {
    return '秋季'
  } else {
    return '冬季'
  }
}

// 组件挂载
onMounted(() => {
  currentSeason.value = getSeason()
})
</script>

<style scoped>
.cooking-tips-list {
  background-color: #f9f7f4;
}

/* 头部横幅 */
.hero-banner {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1556910103-1c02745aae4d');
  background-size: cover;
  background-position: center;
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  position: relative;
}

.hero-content {
  max-width: 800px;
  padding: 0 20px;
  z-index: 1;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 32px;
  opacity: 0.9;
}

.search-container {
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  border-radius: 24px;
  overflow: hidden;
}

/* 主要内容区 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
}

/* 标签云 */
.tag-cloud {
  margin-bottom: 32px;
}

.section-subheading {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.popular-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.popular-tag {
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 16px;
  background-color: white;
  transition: all 0.3s;
}

.popular-tag:hover {
  background-color: #f6925c;
  color: white;
}

/* 分类筛选 */
.category-filter {
  margin-bottom: 32px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-heading {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.view-all-link {
  color: #f6925c;
  font-size: 14px;
}

.view-all-link:hover {
  color: #e57c4a;
}

.filter-tabs {
  margin-bottom: 16px;
}

.filter-btn {
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 16px;
  padding: 0 16px;
  height: 32px;
}

/* 精选技巧轮播 */
.featured-tips {
  margin-bottom: 48px;
}

.featured-carousel {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.carousel-slide {
  height: 360px;
  background-color: #fff;
}

.carousel-content {
  display: flex;
  height: 100%;
}

.carousel-text {
  flex: 1;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.carousel-title {
  font-size: 24px;
  font-weight: 600;
  margin: 16px 0;
}

.carousel-description {
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
}

.carousel-image {
  flex: 1;
  overflow: hidden;
}

.carousel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.read-more-btn {
  align-self: flex-start;
  border-radius: 20px;
  background-color: #f6925c;
  border-color: #f6925c;
}

.read-more-btn:hover {
  background-color: #e57c4a;
  border-color: #e57c4a;
}

/* 小贴士卡片 */
.tips-grid {
  margin-bottom: 48px;
}

.tip-card {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.tip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.card-image-container {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.tip-card:hover .card-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.tip-card:hover .image-overlay {
  opacity: 1;
}

.view-icon {
  color: white;
  font-size: 24px;
}

.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
}

/* 小贴士和每日贴士上下布局样式 */
.tips-section {
  margin-bottom: 40px;
}

/* 小贴士列表样式 */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.tip-item {
  cursor: pointer;
}

.cooking-tip-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
}

.cooking-tip-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.category-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #f6925c;
  color: white;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  z-index: 2;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.image-container {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.cooking-tip-card:hover .card-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.cooking-tip-card:hover .image-overlay {
  opacity: 1;
}

.view-icon {
  color: white;
  font-size: 24px;
}

.text-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.tip-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tip-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-name {
  margin-left: 8px;
  font-size: 13px;
  color: #555;
}

.card-stats {
  display: flex;
  align-items: center;
  color: #888;
  font-size: 12px;
}

.view-count {
  margin-left: 12px;
}

.publish-time {
  color: #888;
}

/* 每日贴士样式 */
.daily-tips-section {
  margin-top: 20px;
}

.daily-tips-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.daily-tip {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  height: 100%;
}

.daily-tip:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.daily-tip-content {
  display: flex;
  height: 100%;
}

.daily-tip-text {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.daily-tip-description {
  font-size: 14px;
  line-height: 1.5;
  color: #555;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.daily-tip-author {
  display: flex;
  align-items: center;
  margin-top: auto;
}

.daily-tip-author span {
  margin-left: 8px;
  font-size: 13px;
  color: #666;
}

.daily-tip-image {
  flex: 1;
  min-width: 40%;
  max-width: 40%;
}

.daily-tip-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .daily-tips-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .tips-grid {
    grid-template-columns: 1fr;
  }

  .daily-tip-content {
    flex-direction: column;
  }

  .daily-tip-image {
    min-width: 100%;
    max-width: 100%;
    height: 160px;
    order: -1; /* 将图片放在文字上方 */
  }
}
.author-info {
  display: flex;
  align-items: center;
}

.author-name {
  margin-left: 8px;
}




/* 季节性技巧 */
.seasonal-tips {
  margin-bottom: 48px;
}

.seasonal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.seasonal-label {
  background-color: #f6925c;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
}

.seasonal-cards {
  margin-bottom: 24px;
}

.seasonal-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.seasonal-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.seasonal-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.seasonal-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.seasonal-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
  flex-grow: 1;
}

.seasonal-link {
  color: #f6925c;
  align-self: flex-start;
  padding-left: 0;
}

/* 分页 */
.pagination-container {
  text-align: center;
  margin-bottom: 48px;
}

/* 订阅区域 */
.subscribe-section {
  background-color: #fff8f0;
  padding: 48px 20px;
  text-align: center;
}

.subscribe-content {
  max-width: 600px;
  margin: 0 auto;
}

.subscribe-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.subscribe-description {
  color: #666;
  margin-bottom: 24px;
}

.subscribe-form {
  display: flex;
  margin: 0 auto;
  max-width: 500px;
}

.subscribe-input {
  flex: 1;
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  border-right: none;
}

.subscribe-btn {
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  background-color: #f6925c;
  border-color: #f6925c;
}

.subscribe-btn:hover {
  background-color: #e57c4a;
  border-color: #e57c4a;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hero-banner {
    height: 280px;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .carousel-content {
    flex-direction: column;
  }

  .carousel-text {
    padding: 20px;
  }

  .daily-tip-content {
    flex-direction: column;
  }

  .daily-tip-image {
    max-width: 100%;
  }

  .daily-tip-text {
    padding: 24px;
  }

  .subscribe-form {
    flex-direction: column;
  }

  .subscribe-input {
    border-radius: 24px;
    margin-bottom: 12px;
  }

  .subscribe-btn {
    border-radius: 24px;
  }

  .carousel-slide {
    height: auto;
  }
}
.cooking-tip-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  width: 100%;
  height: 100%;
}

.cooking-tip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.category-tag {
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: #f6925c;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  z-index: 2;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.image-container {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.cooking-tip-card:hover .card-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.cooking-tip-card:hover .image-overlay {
  opacity: 1;
}

.view-icon {
  color: white;
  font-size: 32px;
}

.text-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.tip-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.tip-description {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-name {
  margin-left: 12px;
  font-size: 15px;
  color: #555;
}

.card-stats {
  display: flex;
  align-items: center;
  color: #888;
  font-size: 14px;
}

.view-count {
  margin-left: 16px;
}

.publish-time {
  color: #888;
}
</style>