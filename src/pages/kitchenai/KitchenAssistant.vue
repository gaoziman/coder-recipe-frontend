<template>
  <div class="kitchen-assistant-container">
    <a-card :bordered="false" class="assistant-card">
      <template #title>
        <div class="card-title">
          <div class="title-with-icon">
            <robot-outlined class="title-icon" />
            <h2>厨房助手</h2>
          </div>
          <p class="description">智能搭配食材，解锁无限美食灵感</p>
        </div>
      </template>

      <a-tabs v-model:activeKey="activeTab">
        <!-- 食材搭配推荐 -->
        <a-tab-pane key="ingredient-match" tab="食材搭配">
          <div class="ingredient-matcher">
            <div class="input-section">
              <h3>我家有这些食材</h3>
              <div class="ingredients-input">
                <a-select
                    v-model:value="selectedIngredients"
                    mode="multiple"
                    placeholder="请选择或输入食材..."
                    :options="ingredientOptions"
                    :maxTagCount="5"
                    :tokenSeparators="[',']"
                    style="width: 100%"
                    allow-clear
                >
                  <template #suffixIcon><search-outlined /></template>
                </a-select>
              </div>

              <!-- 食材分类选择器 -->
              <div class="quick-categories">
                <p>热门食材:</p>
                <div class="category-tags">
                  <a-tag
                      v-for="category in ingredientCategories"
                      :key="category.name"
                      :color="category.color"
                      class="category-tag"
                      @click="addCategoryIngredients(category.items)"
                  >
                    <template #icon>
                      <component :is="category.icon" />
                    </template>
                    {{ category.name }}
                  </a-tag>
                </div>
              </div>

              <div class="taste-preference">
                <h3>口味偏好</h3>
                <div class="preference-tags">
                  <a-tag
                      v-for="flavor in flavorOptions"
                      :key="flavor.value"
                      :color="selectedFlavors.includes(flavor.value) ? '#f6925c' : ''"
                      class="flavor-tag"
                      @click="toggleFlavor(flavor.value)"
                  >
                    {{ flavor.label }}
                  </a-tag>
                </div>
              </div>

              <div class="cooking-method">
                <h3>烹饪方式</h3>
                <a-radio-group v-model:value="cookingMethod" button-style="solid">
                  <a-radio-button value="any">不限</a-radio-button>
                  <a-radio-button value="quick">快手菜</a-radio-button>
                  <a-radio-button value="stir-fry">炒菜</a-radio-button>
                  <a-radio-button value="soup">煲汤</a-radio-button>
                  <a-radio-button value="bake">烘焙</a-radio-button>
                </a-radio-group>
              </div>

              <a-button
                  type="primary"
                  :loading="loading"
                  :disabled="selectedIngredients.length === 0"
                  @click="getRecommendations"
                  class="submit-button"
              >
                <template #icon><thunderbolt-outlined /></template>
                开始智能搭配
              </a-button>
            </div>

            <!-- 推荐结果区域 -->
            <div class="results-section" v-if="showResults">
              <a-spin :spinning="loading">
                <div class="results-header">
                  <h3>为您推荐的食材搭配</h3>
                  <p class="results-subtitle">基于您选择的 {{ selectedIngredients.length }} 种食材，为您推荐以下创意搭配</p>
                </div>

                <div class="recommendation-cards">
                  <a-card
                      v-for="(rec, index) in recommendations"
                      :key="index"
                      class="recommendation-card"
                      hoverable
                  >
                    <template #cover>
                      <div class="card-image" :style="{ backgroundImage: `url(${rec.image})` }">
                        <div class="card-match-rate">
                          <fire-outlined />
                          匹配度 {{ rec.matchRate }}%
                        </div>
                      </div>
                    </template>
                    <template #title>
                      <div class="rec-title">{{ rec.title }}</div>
                    </template>
                    <div class="ingredient-tags">
                      <a-tag v-for="ing in rec.ingredients" :key="ing" :color="selectedIngredients.includes(ing) ? '#f6925c' : 'default'">
                        {{ ing }}
                      </a-tag>
                    </div>
                    <div class="rec-description">{{ rec.description }}</div>
                    <div class="action-buttons">
                      <a-button type="link" @click="viewRecipe(rec.id)">
                        <template #icon><right-outlined /></template>
                        查看菜谱
                      </a-button>
                      <a-button type="link" @click="addToFavorites(rec.id)">
                        <template #icon><heart-outlined /></template>
                        收藏
                      </a-button>
                    </div>
                  </a-card>
                </div>

                <div class="more-options" v-if="recommendations.length > 0">
                  <a-button @click="getMoreRecommendations">
                    <template #icon><reload-outlined /></template>
                    换一批
                  </a-button>
                  <a-button type="link" @click="showAllRecipes">
                    查看更多相关菜谱 <right-outlined />
                  </a-button>
                </div>
              </a-spin>
            </div>
          </div>
        </a-tab-pane>

        <!-- 食材库存管理 -->
        <a-tab-pane key="inventory" tab="我的食材库">
          <div class="pantry-manager">
            <p>管理您的食材库存，随时了解家中有什么食材可用</p>
            <a-button type="primary" @click="redirectToIngredients">
              <template #icon><appstore-outlined /></template>
              前往食材管理
            </a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  SearchOutlined,
  RobotOutlined,
  FireOutlined,
  HeartOutlined,
  RightOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  AppleOutlined,
  SkinOutlined,
  CoffeeOutlined,
  ExperimentOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const activeTab = ref('ingredient-match');
const loading = ref(false);
const showResults = ref(false);
const selectedIngredients = ref<string[]>([]);
const selectedFlavors = ref<string[]>([]);
const cookingMethod = ref('any');

// 食材选项数据
const ingredientOptions = [
  { value: '土豆', label: '土豆' },
  { value: '茄子', label: '茄子' },
  { value: '胡萝卜', label: '胡萝卜' },
  { value: '青椒', label: '青椒' },
  { value: '洋葱', label: '洋葱' },
  { value: '西红柿', label: '西红柿' },
  { value: '白菜', label: '白菜' },
  { value: '花菜', label: '花菜' },
  { value: '豆腐', label: '豆腐' },
  { value: '大蒜', label: '大蒜' },
  { value: '姜', label: '姜' },
  { value: '鸡蛋', label: '鸡蛋' },
  { value: '鸡胸肉', label: '鸡胸肉' },
  { value: '排骨', label: '排骨' },
  { value: '五花肉', label: '五花肉' },
  { value: '牛肉', label: '牛肉' },
  { value: '羊肉', label: '羊肉' },
  { value: '虾', label: '虾' },
  { value: '鱼', label: '鱼' },
  { value: '香菇', label: '香菇' },
  { value: '木耳', label: '木耳' },
  { value: '葱', label: '葱' },
  { value: '青菜', label: '青菜' },
];

// 食材分类数据
const ingredientCategories = [
  {
    name: '蔬菜类',
    icon: AppleOutlined,
    color: '#87d068',
    items: ['土豆', '茄子', '胡萝卜', '青椒', '洋葱', '西红柿']
  },
  {
    name: '肉类',
    icon: SkinOutlined,
    color: '#f50',
    items: ['鸡胸肉', '排骨', '五花肉', '牛肉']
  },
  {
    name: '调味品',
    icon: CoffeeOutlined,
    color: '#108ee9',
    items: ['大蒜', '姜', '葱']
  },
  {
    name: '菌菇类',
    icon: ExperimentOutlined,
    color: '#722ed1',
    items: ['香菇', '木耳']
  }
];

// 口味选项
const flavorOptions = [
  { value: 'spicy', label: '麻辣' },
  { value: 'sweet', label: '甜' },
  { value: 'sour', label: '酸' },
  { value: 'salty', label: '咸鲜' },
  { value: 'light', label: '清淡' },
  { value: 'rich', label: '浓郁' },
  { value: 'numbing', label: '麻' },
  { value: 'garlic', label: '蒜香' }
];

// 推荐结果
const recommendations = ref([
  {
    id: 1,
    title: '土豆烧牛肉',
    image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    matchRate: 95,
    ingredients: ['土豆', '牛肉', '洋葱', '大蒜', '胡萝卜'],
    description: '浓郁香醇的土豆烧牛肉，土豆软糯，牛肉鲜嫩，一道经典下饭好菜。'
  },
  {
    id: 2,
    title: '茄子烧豆角',
    image: 'https://images.unsplash.com/photo-1541480551145-2370a440d585?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    matchRate: 88,
    ingredients: ['茄子', '豆角', '五花肉', '青椒', '大蒜'],
    description: '茄子吸油香而不腻，搭配爽脆豆角，肉香四溢，下饭一绝。'
  },
  {
    id: 3,
    title: '西红柿炒鸡蛋',
    image: 'https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    matchRate: 92,
    ingredients: ['西红柿', '鸡蛋', '葱'],
    description: '家常经典，酸甜可口的西红柿搭配金黄蓬松的鸡蛋，简单又美味。'
  }
]);

// 添加分类食材
const addCategoryIngredients = (items: string[]) => {
  // 合并已选和新选，并去重
  const newSelection = [...new Set([...selectedIngredients.value, ...items])];
  selectedIngredients.value = newSelection;
};

// 切换口味选择
const toggleFlavor = (flavor: string) => {
  if (selectedFlavors.value.includes(flavor)) {
    selectedFlavors.value = selectedFlavors.value.filter(f => f !== flavor);
  } else {
    selectedFlavors.value.push(flavor);
  }
};

// 获取推荐
const getRecommendations = async () => {
  if (selectedIngredients.value.length === 0) {
    message.warning('请至少选择一种食材');
    return;
  }

  loading.value = true;
  showResults.value = true;

  try {
    // 真实环境下会调用API获取推荐
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 模拟获取到的数据
    // 实际项目中这里应该是API调用
    // recommendations.value = await fetchRecommendations(...)

    message.success('为您找到多种创意搭配方案');
  } catch (error) {
    console.error('获取推荐失败:', error);
    message.error('获取推荐失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 获取更多推荐
const getMoreRecommendations = async () => {
  loading.value = true;

  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 简单地改变顺序来模拟新的推荐
    recommendations.value = [...recommendations.value].reverse();

    message.success('已为您更新推荐');
  } catch (error) {
    console.error('获取更多推荐失败:', error);
    message.error('获取更多推荐失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 查看菜谱详情
const viewRecipe = (id: number) => {
  router.push(`/recipes/${id}`);
};

// 添加到收藏
const addToFavorites = (id: number) => {
  message.success('已添加到收藏');
};

// 查看更多相关菜谱
const showAllRecipes = () => {
  const queryParams = new URLSearchParams();
  selectedIngredients.value.forEach(ing => {
    queryParams.append('ingredient', ing);
  });

  router.push({
    path: '/search',
    query: { type: 'ingredients', ...Object.fromEntries(queryParams) }
  });
};

// 跳转到食材管理页面
const redirectToIngredients = () => {
  router.push('/user/ingredients');
};

onMounted(() => {
  // 初始化逻辑
});
</script>

<style scoped>
.kitchen-assistant-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.assistant-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-title {
  margin-bottom: 16px;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.title-icon {
  font-size: 22px;
  color: #f6925c;
}

.card-title h2 {
  font-size: 20px;
  margin: 0;
  font-weight: 600;
}

.description {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  margin: 4px 0 0 0;
}

/* 标签页样式调整 */
:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #f6925c;
}

:deep(.ant-tabs-ink-bar) {
  background-color: #f6925c;
}

:deep(.ant-tabs-tab:hover) {
  color: #ff8b48;
}

/* 食材匹配区域 */
.ingredient-matcher {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-section h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.quick-categories {
  margin-top: 8px;
}

.quick-categories p {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 8px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  cursor: pointer;
  padding: 4px 12px;
  font-size: 13px;
}

.preference-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.flavor-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.flavor-tag:hover {
  opacity: 0.8;
}

.submit-button {
  margin-top: 16px;
  height: 40px;
  font-size: 15px;
  background: linear-gradient(to right, #f6925c, #ff5e62);
  border: none;
  width: 100%;
}

/* 结果区域 */
.results-section {
  margin-top: 24px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.results-header {
  margin-bottom: 20px;
}

.results-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.results-subtitle {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.recommendation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.recommendation-card {
  overflow: hidden;
  transition: all 0.3s;
}

.recommendation-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.card-match-rate {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(to right, #f6925c, #ff5e62);
  color: white;
  padding: 6px 12px;
  border-top-left-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.rec-title {
  font-size: 16px;
  font-weight: 600;
}

.ingredient-tags {
  margin: 12px 0;
}

.rec-description {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}

.more-options {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 食材库区域 */
.pantry-manager {
  text-align: center;
  padding: 60px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.pantry-manager p {
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.65);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .recommendation-cards {
    grid-template-columns: 1fr;
  }
}

/* 主题色调整 */
:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)) {
  color: #fff !important;
  background: #f6925c !important;
  border-color: #f6925c !important;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before) {
  background-color: #f6925c !important;
}

:deep(.ant-radio-button-wrapper:hover) {
  color: #f6925c;
}

:deep(.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  border-color: #f6925c;
  box-shadow: 0 0 0 2px rgba(246, 146, 92, 0.2);
}

:deep(.ant-select-item-option-selected:not(.ant-select-item-option-disabled)) {
  background-color: rgba(246, 146, 92, 0.1);
}

:deep(.ant-btn-primary) {
  background-color: #f6925c;
  border-color: #f6925c;
}

:deep(.ant-btn-primary:hover) {
  background-color: #ff8b48;
  border-color: #ff8b48;
}

:deep(.ant-btn-link) {
  color: #f6925c;
}

:deep(.ant-btn-link:hover) {
  color: #ff8b48;
}
</style>