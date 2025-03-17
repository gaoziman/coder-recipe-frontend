<!-- RecipeDetail.vue -->
<template>
  <div class="recipe-detail-container">
    <!-- 添加面包屑导航 -->
    <recipe-breadcrumb />
    <!-- 顶部大图及标题部分 -->
    <div class="recipe-hero-banner">
      <img :src="recipe.image" :alt="recipe.title" class="full-width-img" />
      <div class="difficulty-badge">{{ recipe.difficulty }}</div>
      <div class="hero-content">
        <h1 class="hero-title">{{ recipe.title }}</h1>
        <p class="hero-description">{{ getShortDescription(recipe.description) }}</p>
      </div>
      <div class="action-icons">
        <button class="icon-btn share-btn"><share-alt-outlined /></button>
        <button class="icon-btn save-btn"><book-outlined /></button>
        <button class="icon-btn like-btn" :class="{ active: recipe.liked }" @click="toggleLike">
          <heart-outlined v-if="!recipe.liked" />
          <heart-filled v-else />
        </button>
      </div>
    </div>

    <!-- 作者信息及食谱基本数据 -->
    <div class="recipe-author-info">
      <div class="author-section">
        <a-avatar :src="'https://randomuser.me/api/portraits/men/32.jpg'" :size="48" />
        <div class="author-details">
          <div class="author-name">{{ recipe.author }}</div>
          <div class="publish-date">{{ formatDate(recipe.date) }} 发布</div>
        </div>
      </div>

      <div class="recipe-stats">
        <div class="stat-item">
          <div class="stat-label">烹饪时间</div>
          <div class="stat-value">{{ recipe.cookTime + recipe.prepTime }}分钟</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-label">难度</div>
          <div class="stat-value">{{ recipe.difficulty }}</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-label">份量</div>
          <div class="stat-value">{{ recipe.servings }}人份</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-label">热量</div>
          <div class="stat-value">{{ recipe.calories }}大卡/份</div>
        </div>
      </div>

      <div class="rating-display">
        <a-rate :value="recipe.rating" disabled allow-half />
        <span class="rating-number">{{ recipe.rating.toFixed(1) }}</span>
        <span class="rating-count">({{ recipe.ratingCount }}条评价)</span>
      </div>

      <div class="recipe-tags">
        <a-tag v-for="tag in recipe.tags" :key="tag">{{ tag }}</a-tag>
      </div>
    </div>

    <!-- 食材清单部分 -->
    <div class="recipe-main-content">
      <div class="recipe-ingredients-section">
        <div class="section-title">
          <h2>用料清单</h2>
          <div class="servings-adjuster">
            <a-input-number
                v-model:value="currentServings"
                :min="1"
                :max="20"
                @change="adjustServings"
            />
            <span>人份</span>
          </div>
        </div>
        <div class="ingredients-list">
          <div class="ingredient-group" v-for="(group, index) in recipe.ingredientGroups" :key="index">
            <div v-if="group.title" class="ingredient-group-title">{{ group.title }}</div>
            <div class="ingredient-item" v-for="(ingredient, idx) in group.items" :key="idx">
              <div class="ingredient-checkbox">
                <a-checkbox v-model:checked="ingredient.checked"></a-checkbox>
              </div>
              <div class="ingredient-amount">{{ calculateAmount(ingredient.amount) }}{{ ingredient.unit }}</div>
              <div class="ingredient-name">{{ ingredient.name }}</div>
              <div class="ingredient-note" v-if="ingredient.note">{{ ingredient.note }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 烹饪步骤 -->
      <div class="recipe-steps-section">
        <div class="section-title">
          <h2>烹饪步骤</h2>
        </div>
        <div class="steps-list">
          <div class="step-item" v-for="(step, index) in recipe.steps" :key="index">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <div class="step-text">{{ step.text }}</div>
              <div class="step-image" v-if="step.image">
                <img :src="step.image" :alt="`步骤 ${index + 1}`" />
              </div>
              <div class="step-tips" v-if="step.tips">
                <a-alert type="info" show-icon>
                  <template #message>烹饪小贴士</template>
                  <template #description>{{ step.tips }}</template>
                </a-alert>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 成品展示 -->
      <div class="recipe-gallery-section">
        <div class="section-title">
          <h2>成品展示</h2>
        </div>
        <div class="gallery-container">
          <a-carousel autoplay dots-class="gallery-dots">
            <div class="gallery-item" v-for="(img, index) in recipe.gallery" :key="index">
              <img :src="img" :alt="`成品图 ${index + 1}`" class="gallery-image" />
            </div>
          </a-carousel>
        </div>
      </div>

      <!-- 用户评论 -->
      <div class="recipe-reviews-section">
        <div class="section-title">
          <h2>用户评论 <span class="review-count">({{ recipe.reviews.length }}条)</span></h2>
        </div>

        <div class="review-list">
          <div class="review-item" v-for="(review, index) in recipe.reviews" :key="index">
            <div class="review-header">
              <div class="reviewer-info">
                <a-avatar :src="review.avatar" />
                <div class="reviewer-details">
                  <div class="reviewer-name">{{ review.name }}</div>
                  <div class="review-date">{{ formatDate(review.date) }}</div>
                </div>
              </div>
              <div class="review-rating">
                <a-rate :value="review.rating" disabled />
              </div>
            </div>
            <div class="review-content">
              {{ review.comment }}
            </div>
            <div class="review-images" v-if="review.images && review.images.length">
              <img
                  v-for="(img, imgIndex) in review.images"
                  :key="imgIndex"
                  :src="img"
                  class="review-image"
                  @click="openImagePreview(review.images, imgIndex)"
              />
            </div>
            <div class="review-actions">
              <a-button type="text" class="review-action">
                <like-outlined />
                有用({{ review.likes }})
              </a-button>
              <a-button type="text" class="review-action">
                <message-outlined />
                回复
              </a-button>
            </div>
          </div>
        </div>

        <div class="write-review">
          <div class="write-review-header">
            <div class="write-review-title">写下您的评论</div>
            <div class="write-review-rating">
              <span class="rating-label">为这道菜评分：</span>
              <a-rate v-model:value="userReview.rating" />
            </div>
          </div>
          <a-textarea
              v-model:value="userReview.comment"
              placeholder="分享您的烹饪体验和建议..."
              :rows="4"
              class="review-textarea"
          />
          <div class="review-actions">
            <a-upload
                list-type="picture-card"
                :file-list="userReview.fileList"
                @preview="handlePreview"
                @change="handleChange"
            >
              <div v-if="userReview.fileList.length < 3">
                <plus-outlined />
                <div style="margin-top: 8px">上传图片</div>
              </div>
            </a-upload>
            <a-button type="primary" class="submit-review-btn">
              提交评论
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 相关菜谱推荐 -->
    <div class="related-recipes-section">
      <div class="section-title">
        <h2>相关菜谱推荐</h2>
      </div>
      <div class="related-recipes-list">
        <div class="related-recipe-card" v-for="(relatedRecipe, index) in relatedRecipes" :key="index">
          <div class="related-recipe-image">
            <img :src="relatedRecipe.image" :alt="relatedRecipe.title" />
          </div>
          <div class="related-recipe-content">
            <h3 class="related-recipe-title">{{ relatedRecipe.title }}</h3>
            <div class="related-recipe-meta">
              <span class="cooking-time">
                <clock-circle-outlined /> {{ relatedRecipe.cookingTime }}分钟
              </span>
              <span class="difficulty">
                <fire-outlined /> {{ relatedRecipe.difficulty }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <a-modal
        v-model:visible="imagePreviewVisible"
        :footer="null"
        @cancel="closeImagePreview"
        width="800px"
        class="image-preview-modal"
    >
      <img :src="previewImage" class="preview-image" v-if="previewImage" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import {
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FireOutlined,
  TeamOutlined,
  BookOutlined,
  LikeOutlined,
  MessageOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import RecipeBreadcrumb from "@/components/common/RecipeBreadcrumb.vue";

// 获取缩短的描述
const getShortDescription = (description: string) => {
  if (!description) return '';
  return description.length > 80 ? description.slice(0, 80) + '...' : description;
};

// 菜谱详情数据
const recipe = reactive({
  id: 101,
  title: '蒜蓉牛油粉丝蒸扇贝',
  author: '美食达人',
  date: '2025-03-10',
  rating: 4.8,
  ratingCount: 236,
  ratingDistribution: {
    1: 1,
    2: 2,
    3: 3,
    4: 24,
    5: 70
  },
  difficulty: '中等',
  category: 'seafood',
  tags: ['贝类', '海鲜', '蒸菜', '宴客'],
  liked: false,
  image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?q=80&w=1200&auto=format&fit=crop',
  prepTime: 15,
  cookTime: 10,
  servings: 2,
  calories: 320,
  description: '鲜美多汁的扇贝配上蒜香浓郁的粉丝，简单蒸制就能呈现海鲜的原汁原味。这道菜不仅色香味俱全，还富含高蛋白和多种矿物质，是一道适合家庭聚餐的健康美味佳肴。',
  ingredientGroups: [
    {
      title: '主料',
      items: [
        { name: '鲜扇贝', amount: 6, unit: '只', note: '新鲜的最佳', checked: false },
        { name: '粉丝', amount: 100, unit: '克', note: '', checked: false }
      ]
    },
    {
      title: '调料',
      items: [
        { name: '蒜末', amount: 20, unit: '克', note: '', checked: false },
        { name: '牛油', amount: 30, unit: '克', note: '室温软化', checked: false },
        { name: '生抽', amount: 10, unit: '毫升', note: '', checked: false },
        { name: '料酒', amount: 5, unit: '毫升', note: '', checked: false },
        { name: '盐', amount: 2, unit: '克', note: '', checked: false },
        { name: '白胡椒粉', amount: 1, unit: '克', note: '', checked: false },
        { name: '香葱', amount: 5, unit: '克', note: '切段', checked: false }
      ]
    }
  ],
  steps: [
    {
      text: '将扇贝洗净，用小刀沿着扇贝壳边缘划开，取出扇贝柱和扇贝肉，去除内脏和杂质，洗净后放回贝壳内。',
      image: 'https://images.unsplash.com/photo-1613454305306-6dc5a12ab331?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      tips: '处理扇贝时注意不要损伤扇贝肉，保持其完整性。'
    },
    {
      text: '将粉丝用温水泡软，沥干水分后剪成小段，铺在扇贝底部。',
      image: 'https://images.unsplash.com/photo-1616358362400-217e03c35cd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      tips: ''
    },
    {
      text: '将蒜末和软化的牛油混合，加入少量生抽、料酒、盐和白胡椒粉调味，搅拌均匀制成蒜蓉牛油酱。',
      image: '',
      tips: '如果没有牛油，也可以用黄油代替，风味略有不同但同样美味。'
    },
    {
      text: '将调好的蒜蓉牛油酱均匀地涂抹在扇贝肉上。',
      image: 'https://images.unsplash.com/photo-1647079408645-c55defc6e85b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      tips: ''
    },
    {
      text: '将准备好的扇贝放入蒸锅中，大火蒸6-8分钟。',
      image: '',
      tips: '蒸制时间不宜过长，以免扇贝肉质变老。'
    },
    {
      text: '蒸好后取出，撒上香葱段即可上桌。',
      image: 'https://images.unsplash.com/photo-1628276501524-78309e0c0d6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      tips: '上桌时趁热食用，风味最佳。'
    }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1579631542720-3a87824fff86?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614377284368-a6232286be3b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1624322034143-22be046099e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  ],
  nutrition: [
    { name: '热量', value: 320, unit: '千卡', percentage: 16 },
    { name: '脂肪', value: 12, unit: '克', percentage: 15 },
    { name: '碳水化合物', value: 28, unit: '克', percentage: 9 },
    { name: '蛋白质', value: 24, unit: '克', percentage: 48 },
    { name: '纤维素', value: 2, unit: '克', percentage: 8 },
    { name: '钠', value: 560, unit: '毫克', percentage: 23 }
  ],
  tips: [
    '选购扇贝时，尽量选择新鲜的活扇贝，壳紧闭，敲击时有回弹。',
    '扇贝洗净后可用厨房纸巾吸干表面水分，这样蒸制时不会有太多水分析出。',
    '蒜蓉牛油酱可提前准备，冷藏保存，需要时取出室温软化即可使用。',
    '喜欢辣味的可以在蒜蓉牛油酱中加入少量的辣椒粉或切碎的红辣椒。',
    '剩余的扇贝可以冷藏保存，但建议在24小时内食用完毕。'
  ],
  reviews: [
    {
      name: '烹饪爱好者',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      date: '2025-03-15',
      rating: 5,
      comment: '这道菜太棒了！我严格按照配方做的，扇贝鲜嫩多汁，蒜蓉牛油香气四溢，全家人都赞不绝口。特别喜欢粉丝吸收了扇贝和蒜蓉的汤汁，非常入味。',
      images: [
        'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      ],
      likes: 24
    },
    {
      name: '家常菜达人',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      date: '2025-03-12',
      rating: 4,
      comment: '整体来说是不错的做法，我稍微调整了一下配料比例，加了点小米辣增加些辣味，风味更丰富了。建议大家可以根据自己的口味做些调整。',
      images: [],
      likes: 15
    },
    {
      name: '新手学做菜',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      date: '2025-03-08',
      rating: 5,
      comment: '作为烹饪新手，我很担心做不好，但这个菜谱非常详细，步骤清晰，完全按照指示做出来的成品非常美味！谢谢分享这么棒的食谱！',
      images: [
        'https://images.unsplash.com/photo-1614377284368-a6232286be3b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1624322034143-22be046099e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      ],
      likes: 32
    }
  ]
});

// 相关菜谱
const relatedRecipes = [
  {
    id: 102,
    title: '蒜蓉粉丝蒸虾',
    image: 'https://images.unsplash.com/photo-1625943886455-6f05f8c1c340?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 15,
    difficulty: '简单'
  },
  {
    id: 103,
    title: '清蒸鲈鱼',
    image: 'https://images.unsplash.com/photo-1611599538487-f40f42d42022?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 20,
    difficulty: '中等'
  },
  {
    id: 104,
    title: '香辣蒸蛤蜊',
    image: 'https://images.unsplash.com/photo-1619394193029-66ced0f4eb09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 10,
    difficulty: '简单'
  },
  {
    id: 105,
    title: '黑椒牛排',
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    cookingTime: 25,
    difficulty: '中等'
  }
];

// 用户评论状态
const userReview = reactive({
  rating: 0,
  comment: '',
  fileList: []
});

// 份量调整
const currentServings = ref(recipe.servings);
const servingRatio = computed(() => currentServings.value / recipe.servings);

// 图片预览状态
const imagePreviewVisible = ref(false);
const previewImage = ref('');
const previewImages = ref([]);
const currentPreviewIndex = ref(0);

// 计算调整后的用料数量
const calculateAmount = (amount: number) => {
  return (amount * servingRatio.value).toFixed(1).replace('.0', '');
};

// 调整份量
const adjustServings = (value: number) => {
  currentServings.value = value;
};

// 切换收藏状态
const toggleLike = () => {
  recipe.liked = !recipe.liked;
  message.success(recipe.liked ? '已收藏该菜谱' : '已取消收藏');
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
    'dessert': '甜点',
    'soup': '汤品',
    'breakfast': '早餐'
  };
  return categoryMap[category] || '其他';
};

// 日期格式化
const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD');
};

// 图片预览相关
const openImagePreview = (images: string[], index: number) => {
  previewImages.value = images;
  currentPreviewIndex.value = index;
  previewImage.value = images[index];
  imagePreviewVisible.value = true;
};

const closeImagePreview = () => {
  imagePreviewVisible.value = false;
};

// 用户评论图片上传
const handlePreview = (file: any) => {
  previewImage.value = file.url || file.thumbUrl;
  imagePreviewVisible.value = true;
};

const handleChange = (info: any) => {
  userReview.fileList = info.fileList;
};

// 生命周期钩子
onMounted(() => {
  // 可以在此处获取菜谱详情数据
  console.log('菜谱详情页加载完成');
});
</script>

<style scoped>
.recipe-detail-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #FFFBF8;
  color: #333;
}

/* 顶部大图及标题部分 */
.recipe-hero-banner {
  position: relative;
  width: 100%;
  height: 480px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
}

.full-width-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.difficulty-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 24px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px 0;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-description {
  font-size: 16px;
  margin: 0;
  max-width: 80%;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.action-icons {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  gap: 12px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  color: #666;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.icon-btn:hover {
  transform: translateY(-3px);
  background-color: white;
  color: #FF7043;
}

.like-btn.active {
  color: #FF4D4F;
}

/* 作者信息及食谱基本数据 */
.recipe-author-info {
  padding: 24px;
  background-color: white;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.author-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.publish-date {
  font-size: 14px;
  color: #999;
}

.recipe-stats {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 0;
  margin-bottom: 20px;
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
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.stat-divider {
  width: 1px;
  background-color: #f0f0f0;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.rating-number {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.rating-count {
  font-size: 14px;
  color: #999;
}

.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 主内容区域样式 */
.recipe-main-content {
  background-color: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
}

.section-title h2 {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 食材部分样式 */
.servings-adjuster {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.ingredient-group {
  margin-bottom: 24px;
}

.ingredient-group-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 3px solid #FF9966;
}

.ingredient-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.ingredient-checkbox {
  width: 40px;
}

.ingredient-amount {
  width: 80px;
  font-weight: 500;
  color: #333;
}

.ingredient-name {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.ingredient-note {
  color: #999;
  font-size: 14px;
  font-style: italic;
}

/* 步骤部分样式 */
.recipe-steps-section {
  margin-top: 40px;
  margin-bottom: 40px;
}

.step-item {
  display: flex;
  margin-bottom: 32px;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF9966, #FF5E62);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  margin-right: 16px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(255, 153, 102, 0.3);
}

.step-content {
  flex: 1;
}

.step-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 16px;
}

.step-image {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.step-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.step-tips {
  margin-bottom: 16px;
}

/* 成品展示部分 */
.recipe-gallery-section {
  margin-top: 40px;
  margin-bottom: 40px;
}

.gallery-container {
  border-radius: 12px;
  overflow: hidden;
}

.gallery-item {
  height: 400px;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.gallery-dots li button) {
  background: #FFD8C5 !important;
}

:deep(.gallery-dots li.slick-active button) {
  background: #FF9966 !important;
}

/* 用户评论部分 */
.recipe-reviews-section {
  margin-top: 40px;
  margin-bottom: 24px;
}

.review-count {
  font-size: 14px;
  color: #999;
  font-weight: normal;
  margin-left: 8px;
}

.review-list {
  margin-bottom: 32px;
}

.review-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
}

.reviewer-name {
  font-weight: 500;
  color: #333;
}

.review-date {
  font-size: 12px;
  color: #999;
}

.review-content {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 12px;
}

.review-images {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.review-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
}

.review-actions {
  display: flex;
  gap: 16px;
}

.review-action {
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.write-review {
  background-color: #F9F9F9;
  padding: 20px;
  border-radius: 12px;
}

.write-review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.write-review-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.write-review-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-label {
  color: #666;
}

.review-textarea {
  width: 100%;
  margin-bottom: 16px;
  border-radius: 8px;
}

.submit-review-btn {
  background: linear-gradient(135deg, #FF9966, #FF7043);
  border: none;
  color: white;
  border-radius: 20px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 20px;
  height: 38px;
  box-shadow: 0 4px 12px rgba(255, 153, 102, 0.2);
  transition: all 0.3s;
}

.submit-review-btn:hover {
  background: linear-gradient(135deg, #FF8044, #FF5722);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 153, 102, 0.3);
  color: white;
  border: none;
}

/* 相关菜谱部分 */
.related-recipes-section {
  margin-bottom: 40px;
}

.related-recipes-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.related-recipe-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.related-recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.related-recipe-image {
  height: 160px;
  overflow: hidden;
}

.related-recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.related-recipe-card:hover .related-recipe-image img {
  transform: scale(1.05);
}

.related-recipe-content {
  padding: 16px;
}

.related-recipe-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-recipe-meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
}

.cooking-time, .difficulty {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 图片预览弹窗 */
.preview-image {
  width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

/* 自定义复选框样式 */
:deep(.ant-checkbox-wrapper) {
  margin-right: 8px;
}

:deep(.ant-checkbox-inner) {
  border-color: #d9d9d9;
  border-radius: 4px;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #FF7043;
  border-color: #FF7043;
}

:deep(.ant-checkbox-checked::after) {
  border: 1px solid #FF7043 !important;
  border-radius: 4px;
}

:deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner),
:deep(.ant-checkbox:hover .ant-checkbox-inner) {
  border-color: #FF9966 !important;
}

:deep(.ant-checkbox-checked:hover .ant-checkbox-inner) {
  background-color: #FF5E62;
  border-color: #FF5E62 !important;
}

:deep(.ant-checkbox-input:focus + .ant-checkbox-inner) {
  border-color: #FF9966 !important;
  outline: 0;
  box-shadow: 0 0 0 2px rgba(255, 153, 102, 0.2) !important;
}

:deep(.ant-checkbox-indeterminate .ant-checkbox-inner) {
  background-color: #fff;
}

:deep(.ant-checkbox-indeterminate .ant-checkbox-inner::after) {
  background-color: #FF7043;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .related-recipes-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .recipe-hero-banner {
    height: 380px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-description {
    max-width: 100%;
    font-size: 14px;
  }

  .recipe-stats {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 16px;
  }

  .stat-item {
    width: 45%;
    text-align: left;
  }

  .stat-divider {
    display: none;
  }

  .related-recipes-list {
    grid-template-columns: 1fr;
  }
}
</style>