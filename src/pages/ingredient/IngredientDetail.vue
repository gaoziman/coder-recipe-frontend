<template>
  <div class="ingredient-detail-container">
    <!-- 自定义面包屑导航 -->
    <custom-breadcrumb
        :category="ingredient.category"
        :current-item="ingredient.name"
    />
    <!-- 加载状态 -->
    <a-spin :spinning="loading">
      <!-- 食材基本信息卡片 -->
      <a-card :bordered="false" class="mb-6 ingredient-info-card">
        <div class="ingredient-basic-info">
          <div class="ingredient-image">
            <img :src="ingredient.image" :alt="ingredient.name" />
          </div>
          <div class="ingredient-details">
            <div class="ingredient-header">
              <div>
                <h1 class="ingredient-title">{{ ingredient.name }}</h1>
                <div class="ingredient-tags">
                  <a-tag color="orange" v-if="ingredient.season">{{ ingredient.season }}</a-tag>
                  <a-tag color="green" v-if="ingredient.category">{{ ingredient.category.name }}</a-tag>
                </div>
              </div>
              <a-button shape="circle" class="favorite-btn">
                <template #icon><heart-outlined /></template>
              </a-button>
            </div>

            <div class="ingredient-intro">
              <h3>食材简介</h3>
              <p>{{ ingredient.description }}</p>
            </div>

            <div class="ingredient-quick-facts">
              <div class="fact-item">
                <h4>热量</h4>
                <p>{{ ingredient.nutrition.calories }}千卡/100g</p>
              </div>
              <div class="fact-item">
                <h4>主要营养</h4>
                <p>{{ ingredient.primaryNutrients }}</p>
              </div>
              <div class="fact-item">
                <h4>适宜人群</h4>
                <p>{{ ingredient.suitableFor }}</p>
              </div>
              <div class="fact-item">
                <h4>季节</h4>
                <p>{{ ingredient.seasonDetail }}</p>
              </div>
            </div>

            <a-button type="primary" class="shopping-btn">
              <shopping-cart-outlined /> 添加到购物清单
            </a-button>
          </div>
        </div>
      </a-card>

      <!-- 食材详情与边栏 -->
      <div class="detail-content">
        <!-- 主要内容区 -->
        <div class="main-content">
          <!-- 营养成分 -->
          <a-card :bordered="false" title="营养成分" class="mb-6">
            <a-table
                :dataSource="nutritionData"
                :columns="nutritionColumns"
                :pagination="false"
                :showHeader="true"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'dailyValue'">
                  <div class="nutrition-bar-container">
                    <span>{{ record.dailyValue }}%</span>
                    <div class="nutrition-bar">
                      <div
                          class="nutrition-bar-fill"
                          :style="{ width: `${Math.min(record.dailyValue, 100)}%` }"
                      ></div>
                    </div>
                  </div>
                </template>
              </template>
            </a-table>
          </a-card>

          <!-- 食材知识 -->
          <a-card :bordered="false" title="食材知识" class="mb-6">
            <div class="knowledge-section">
              <h3>
                <medical-outlined class="section-icon" /> 健康功效
              </h3>
              <ul class="benefit-list">
                <li v-for="(benefit, index) in ingredient.benefits" :key="index">
                  <check-circle-outlined class="benefit-icon" />
                  <span>{{ benefit }}</span>
                </li>
              </ul>
            </div>

            <a-divider />

            <div class="knowledge-section">
              <h3>
                <shopping-outlined class="section-icon" /> 挑选技巧
              </h3>
              <ul class="tips-list">
                <li v-for="(tip, index) in ingredient.selectionTips" :key="index">
                  <check-circle-outlined class="tip-icon" />
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>

            <a-divider />

            <div class="knowledge-section">
              <h3>
                <inbox-outlined class="section-icon" /> 储存方法
              </h3>
              <ul class="storage-list">
                <li v-for="(method, index) in ingredient.storageMethods" :key="index">
                  <check-circle-outlined class="storage-icon" />
                  <span>{{ method }}</span>
                </li>
              </ul>
            </div>
          </a-card>

          <!-- 烹饪技巧 -->
          <a-card :bordered="false" title="烹饪技巧" class="mb-6">
            <div class="cooking-section">
              <h3>
                <knife-outlined class="section-icon" /> 处理方法
              </h3>
              <p class="preparation-info">{{ ingredient.preparation }}</p>
              <div class="preparation-methods">
                <a-tag v-for="method in ingredient.preparationMethods" :key="method">{{ method }}</a-tag>
              </div>
            </div>

            <a-divider />

            <div class="cooking-section">
              <h3>
                <fire-outlined class="section-icon" /> 常用烹饪方式
              </h3>
              <div class="cooking-methods">
                <div v-for="method in ingredient.cookingMethods" :key="method.name" class="cooking-method-item">
                  <component :is="method.icon" class="cooking-icon" />
                  <p>{{ method.name }}</p>
                </div>
              </div>
            </div>

            <a-divider />

            <div class="cooking-section">
              <h3>
                <bulb-outlined class="section-icon" /> 烹饪小贴士
              </h3>
              <ul class="cooking-tips-list">
                <li v-for="(tip, index) in ingredient.cookingTips" :key="index">
                  <info-circle-outlined class="tip-info-icon" />
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>
          </a-card>
        </div>

        <!-- 侧边栏 -->
        <div class="sidebar-content">
          <!-- 推荐搭配 -->
          <a-card :bordered="false" title="推荐搭配" class="mb-6">
            <div class="pairing-list">
              <div v-for="pair in ingredient.pairings" :key="pair.id" class="pairing-item">
                <a-avatar :src="pair.image" :size="48" />
                <div class="pairing-info">
                  <p class="pairing-name">{{ pair.name }}</p>
                  <p class="pairing-desc">{{ pair.description }}</p>
                </div>
                <a-tag :color="pair.level === 'best' ? 'orange' : 'green'">
                  {{ pair.level === 'best' ? '极佳' : '推荐' }}
                </a-tag>
              </div>
            </div>
          </a-card>

          <!-- 相关菜谱 -->
          <a-card :bordered="false" title="相关菜谱" class="mb-6">
            <div class="related-recipes">
              <div v-for="recipe in ingredient.recipes" :key="recipe.id" class="recipe-item">
                <img :src="recipe.image" :alt="recipe.name" class="recipe-image" />
                <div class="recipe-info">
                  <h3 class="recipe-name">{{ recipe.name }}</h3>
                  <div class="recipe-meta">
                    <clock-circle-outlined /> {{ recipe.time }}
                    <a-divider type="vertical" />
                    {{ recipe.difficulty }}
                  </div>
                  <div class="recipe-rating">
                    <a-rate :value="recipe.rating" disabled allow-half :count="5" />
                    <span class="rating-score">{{ recipe.rating }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="more-recipes">
              <router-link :to="`/recipes?ingredient=${ingredient.id}`">
                查看更多{{ ingredient.name }}菜谱 <right-outlined />
              </router-link>
            </div>
          </a-card>

          <!-- 用户评论 -->
          <a-card :bordered="false" title="用户评论">
            <div class="comments-container">
              <div v-for="comment in ingredient.comments" :key="comment.id" class="comment-item">
                <div class="comment-header">
                  <a-avatar :src="comment.avatar" />
                  <div class="commenter-info">
                    <p class="commenter-name">{{ comment.username }}</p>
                    <p class="comment-date">{{ comment.date }}</p>
                  </div>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
                <a-divider v-if="ingredient.comments.indexOf(comment) !== ingredient.comments.length - 1" />
              </div>
            </div>
            <a-button class="comment-btn" block>添加评论</a-button>
          </a-card>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  HeartOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ShoppingOutlined,
  InboxOutlined,
  FireOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from '@ant-design/icons-vue';
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.vue";

// 路由和加载状态
const route = useRoute();
const loading = ref(true);

// 营养成分表格配置
const nutritionColumns = [
  {
    title: '营养素',
    dataIndex: 'nutrient',
    key: 'nutrient',
  },
  {
    title: '含量(每100g)',
    dataIndex: 'amount',
    key: 'amount',
    align: 'right',
  },
  {
    title: '占每日推荐摄入量',
    dataIndex: 'dailyValue',
    key: 'dailyValue',
    align: 'right',
  },
];

// 营养成分数据
const nutritionData = reactive([
  {
    key: '1',
    nutrient: '热量',
    amount: '26千卡',
    dailyValue: 1.3,
  },
  {
    key: '2',
    nutrient: '碳水化合物',
    amount: '6.5g',
    dailyValue: 2.2,
  },
  {
    key: '3',
    nutrient: '蛋白质',
    amount: '1g',
    dailyValue: 1.7,
  },
  {
    key: '4',
    nutrient: '脂肪',
    amount: '0.1g',
    dailyValue: 0.2,
  },
  {
    key: '5',
    nutrient: '维生素A',
    amount: '7384IU',
    dailyValue: 148,
  },
  {
    key: '6',
    nutrient: '维生素C',
    amount: '9mg',
    dailyValue: 10,
  },
  {
    key: '7',
    nutrient: '钾',
    amount: '340mg',
    dailyValue: 7.2,
  },
]);

// 食材数据
const ingredient = reactive({
  id: '1',
  name: '南瓜',
  image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818',
  category: {
    id: '1',
    name: '蔬菜',
  },
  season: '秋季',
  seasonDetail: '秋季、冬季',
  description: '南瓜是葫芦科南瓜属植物的果实，原产于美洲，是世界上广泛种植的蔬菜之一。南瓜富含维生素A、维生素C、钾和纤维，营养价值很高。它的果肉颜色多为橙黄色，口感甜糯，适合煮汤、烘焙、炒菜等多种烹饪方式。秋季是南瓜的最佳食用季节，此时的南瓜味道更加香甜浓郁。',
  nutrition: {
    calories: '26',
    carbs: '6.5g',
    protein: '1g',
    fat: '0.1g',
    vitaminA: '7384IU',
    vitaminC: '9mg',
    potassium: '340mg',
  },
  primaryNutrients: '维生素A、钾',
  suitableFor: '大众人群',
  benefits: [
    '富含β-胡萝卜素，有助于维持视力健康，增强免疫力',
    '含有丰富的抗氧化物质，可以抵抗自由基，延缓衰老',
    '具有降血糖、降血脂的作用，适合糖尿病人食用',
    '富含膳食纤维，有助于促进肠胃蠕动，改善便秘',
  ],
  selectionTips: [
    '选择外表完整，无裂缝，表皮光滑的南瓜',
    '拍打南瓜时听到沉闷的声音，代表南瓜肉质紧密',
    '蒂部应该坚硬干燥，不易折断',
    '颜色鲜艳、均匀的南瓜通常更加成熟甜美',
  ],
  storageMethods: [
    '整个南瓜可以存放在阴凉、干燥、通风的地方，可保存1-3个月',
    '切开的南瓜应包裹保鲜膜放入冰箱，可保存3-5天',
    '煮熟的南瓜放入密封容器冷藏，可保存3-4天',
    '可将南瓜切块冷冻保存，冷冻可保持6-8个月',
  ],
  preparation: '南瓜皮较硬，切之前可以先用微波炉加热1-2分钟使其变软，便于切割。切南瓜时，先将南瓜从中间切开，挖出内部的籽，然后再切成所需的大小。',
  preparationMethods: ['切块', '切片', '切丁', '捣泥'],
  cookingMethods: [
    { name: '煮汤', icon: 'coffee-outlined' },
    { name: '烘焙', icon: 'build-outlined' },
    { name: '炒菜', icon: 'fire-outlined' },
    { name: '蒸煮', icon: 'experiment-outlined' },
  ],
  cookingTips: [
    '南瓜与糯米搭配煮粥非常适合养胃',
    '南瓜蒸熟后加入少量蜂蜜，可增加甜度和风味',
    '南瓜籽别丢弃，洗净烘干后是营养丰富的零食',
    '炒南瓜时可加入适量的白糖，提升甜度和口感',
  ],
  pairings: [
    {
      id: '1',
      name: '糯米',
      image: 'https://images.unsplash.com/photo-1514516816566-de580c621376',
      description: '适合煮粥',
      level: 'best',
    },
    {
      id: '2',
      name: '红枣',
      image: 'https://images.unsplash.com/photo-1615485020471-b66b4ca6364c',
      description: '适合煲汤',
      level: 'best',
    },
    {
      id: '3',
      name: '肉馅',
      image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25',
      description: '适合蒸/烤',
      level: 'recommended',
    },
    {
      id: '4',
      name: '牛奶',
      image: 'https://images.unsplash.com/photo-1559814048-149b70765d47',
      description: '适合做甜点',
      level: 'recommended',
    },
    {
      id: '5',
      name: '芝士',
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
      description: '适合烘焙',
      level: 'recommended',
    },
  ],
  recipes: [
    {
      id: '1',
      name: '南瓜奶油浓汤',
      image: 'https://images.unsplash.com/photo-1593095948071-474c06a461e7',
      time: '30分钟',
      difficulty: '简单',
      rating: 4.8,
    },
    {
      id: '2',
      name: '蜜汁南瓜',
      image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759',
      time: '20分钟',
      difficulty: '简单',
      rating: 4.2,
    },
    {
      id: '3',
      name: '香酥南瓜饼',
      image: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499',
      time: '45分钟',
      difficulty: '中等',
      rating: 4.9,
    },
    {
      id: '4',
      name: '南瓜红枣粥',
      image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a',
      time: '60分钟',
      difficulty: '简单',
      rating: 4.6,
    },
  ],
  comments: [
    {
      id: '1',
      username: '清风厨房',
      avatar: 'https://i.pravatar.cc/150?img=32',
      date: '2025-03-12',
      content: '南瓜真的是营养丰富又美味的食材！我用它做了南瓜派，全家都爱吃。',
    },
    {
      id: '2',
      username: '小厨娘',
      avatar: 'https://i.pravatar.cc/150?img=44',
      date: '2025-03-10',
      content: '南瓜炖排骨也很不错，汤色金黄，味道香甜，是秋冬进补的好选择。',
    },
    {
      id: '3',
      username: '美食达人',
      avatar: 'https://i.pravatar.cc/150?img=56',
      date: '2025-03-05',
      content: '最近用南瓜做了饼干，加了肉桂粉和少量的干果，味道棒极了！',
    },
  ],
});

// 页面加载时获取食材详情
onMounted(async () => {
  try {
    const id = route.params.id;
    // 在实际应用中，这里会通过API获取食材详情
    // const response = await fetch(`/api/ingredients/${id}`);
    // const data = await response.json();
    // Object.assign(ingredient, data);

    // 模拟API请求延迟
    setTimeout(() => {
      loading.value = false;
    }, 800);
  } catch (error) {
    console.error('获取食材详情失败:', error);
    loading.value = false;
  }
});
</script>

<style scoped>
.ingredient-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* 基本信息卡片样式 */
.ingredient-basic-info {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .ingredient-basic-info {
    flex-direction: row;
    gap: 24px;
  }

  .ingredient-image {
    width: 33%;
  }

  .ingredient-details {
    width: 67%;
  }
}

.ingredient-image {
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 16px;
}

.ingredient-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.ingredient-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ingredient-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.ingredient-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.ingredient-tags {
  display: flex;
  gap: 8px;
}

.favorite-btn {
  background-color: #fff0e6;
  color: #f6925c;
  border: none;
}

.ingredient-intro h3 {
  font-weight: 600;
  margin-bottom: 8px;
}

.ingredient-intro p {
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.65);
}

.ingredient-quick-facts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 992px) {
  .ingredient-quick-facts {
    grid-template-columns: repeat(4, 1fr);
  }
}

.fact-item {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
}

.fact-item h4 {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  margin-bottom: 4px;
}

.fact-item p {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.shopping-btn {
  margin-top: 8px;
  background-color: #f6925c;
  border-color: #f6925c;
}

.shopping-btn:hover {
  background-color: #ff8c5a;
  border-color: #ff8c5a;
}

/* 详情内容区布局 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (min-width: 992px) {
  .detail-content {
    flex-direction: row;
  }

  .main-content {
    width: 70%;
  }

  .sidebar-content {
    width: 30%;
  }
}

/* 营养成分表样式 */
.nutrition-bar-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.nutrition-bar {
  width: 100px;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.nutrition-bar-fill {
  height: 100%;
  background-color: #f6925c;
  border-radius: 4px;
}

/* 食材知识和烹饪技巧样式 */
.knowledge-section,
.cooking-section {
  margin-bottom: 16px;
}

.section-icon {
  color: #f6925c;
  margin-right: 8px;
}

.benefit-list,
.tips-list,
.storage-list,
.cooking-tips-list {
  padding-left: 0;
  list-style: none;
}

.benefit-list li,
.tips-list li,
.storage-list li,
.cooking-tips-list li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
}

.benefit-icon,
.tip-icon,
.storage-icon {
  color: #52c41a;
  margin-right: 8px;
  margin-top: 3px;
}

.tip-info-icon {
  color: #1890ff;
  margin-right: 8px;
  margin-top: 3px;
}

.preparation-info {
  margin-bottom: 12px;
}

.preparation-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cooking-methods {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 768px) {
  .cooking-methods {
    grid-template-columns: repeat(4, 1fr);
  }
}

.cooking-method-item {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.cooking-icon {
  font-size: 24px;
  color: #f6925c;
  margin-bottom: 8px;
}

/* 侧边栏样式 */
.pairing-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.pairing-item:last-child {
  border-bottom: none;
}

.pairing-info {
  margin-left: 12px;
  flex: 1;
}

.pairing-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.pairing-desc {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.recipe-item {
  display: flex;
  margin-bottom: 16px;
}

.recipe-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.recipe-info {
  margin-left: 12px;
  flex: 1;
}

.recipe-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.recipe-meta {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 4px;
}

.recipe-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.ant-rate) {
  font-size: 12px;
}

.rating-score {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.more-recipes {
  text-align: center;
  margin-top: 16px;
}

.more-recipes a {
  color: #f6925c;
  font-size: 14px;
}

.comment-item {
  margin-bottom: 16px;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.commenter-info {
  margin-left: 12px;
}

.commenter-name {
  font-weight: 500;
  margin-bottom: 0;
}

.comment-date {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 0;
}

.comment-content {
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
}

.comment-btn {
  border-color: #f6925c;
  color: #f6925c;
}

.comment-btn:hover {
  background-color: #fff0e6;
}

/* 主题色调整 */
:deep(.ant-breadcrumb a:hover) {
  color: #f6925c;
}

:deep(.ant-card-head-title) {
  font-weight: 600;
}

:deep(.ant-tag-orange) {
  color: #f6925c;
  background: #fff0e6;
  border-color: #ffcca6;
}

:deep(.ant-tag-green) {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
}

:deep(.ant-rate-star-full .ant-rate-star-first),
:deep(.ant-rate-star-full .ant-rate-star-second) {
  color: #ffbb33;
}

:deep(.ant-rate-star-half .ant-rate-star-first) {
  color: #ffbb33;
}

:deep(.ant-rate-star-half .ant-rate-star-second) {
  color: #e8e8e8;
}
</style>