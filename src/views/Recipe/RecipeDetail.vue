<template>
  <div class="recipe-detail-container">
    <a-spin :spinning="loading">
      <!-- 返回按钮 -->
      <div class="back-button">
        <a-button type="link" @click="goBack">
          <left-outlined /> 返回
        </a-button>
      </div>

      <template v-if="recipe">
        <!-- 菜谱头部信息 -->
        <div class="recipe-header">
          <div class="recipe-header-content">
            <div class="recipe-title-section">
              <h1 class="recipe-title">{{ recipe.title }}</h1>
              <div class="recipe-meta">
                <div class="recipe-tags">
                  <a-tag v-for="tag in recipe.tags" :key="tag" color="orange">{{ tag }}</a-tag>
                </div>
                <div class="recipe-rating">
                  <a-rate :value="recipe.rating" disabled allow-half />
                  <span class="rating-count">({{ recipe.ratingCount }}人评价)</span>
                </div>
              </div>
              <p class="recipe-description">{{ recipe.description }}</p>

              <div class="recipe-actions">
                <a-button type="primary" icon=""><heart-outlined /> 收藏</a-button>
                <a-button icon=""><share-alt-outlined /> 分享</a-button>
                <a-button icon=""><printer-outlined /> 打印</a-button>
              </div>
            </div>
            <div class="recipe-image-container">
              <img :src="recipe.imageUrl" :alt="recipe.title" class="recipe-image" />
            </div>
          </div>
        </div>

        <!-- 菜谱基本信息卡片 -->
        <div class="recipe-info-section">
          <div class="recipe-info-card">
            <div class="info-item">
              <clock-circle-outlined class="info-icon" />
              <div class="info-content">
                <div class="info-label">准备时间</div>
                <div class="info-value">{{ recipe.prepTime }}分钟</div>
              </div>
            </div>
            <div class="info-item">
              <fire-outlined class="info-icon" />
              <div class="info-content">
                <div class="info-label">烹饪时间</div>
                <div class="info-value">{{ recipe.cookTime }}分钟</div>
              </div>
            </div>
            <div class="info-item">
              <team-outlined class="info-icon" />
              <div class="info-content">
                <div class="info-label">份量</div>
                <div class="info-value">{{ recipe.servings }}人份</div>
              </div>
            </div>
            <div class="info-item">
              <star-outlined class="info-icon" />
              <div class="info-content">
                <div class="info-label">难度</div>
                <div class="info-value">{{ getDifficultyText(recipe.difficulty) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 菜谱作者信息 -->
        <div class="author-section">
          <div class="author-info">
            <a-avatar :src="recipe.author.avatar" size={48} />
            <div class="author-details">
              <div class="author-name">{{ recipe.author.name }}</div>
              <div class="author-bio">{{ recipe.author.bio }}</div>
            </div>
          </div>
          <a-button>关注</a-button>
        </div>

        <!-- 菜谱内容区域 -->
        <div class="recipe-content">
          <a-row :gutter="24">
            <a-col :xs="24" :md="8">
              <!-- 食材列表 -->
              <div class="ingredients-section">
                <h2 class="section-title">食材 <shopping-outlined class="section-icon" /></h2>

                <div class="servings-selector">
                  <span class="servings-label">份量:</span>
                  <a-input-number
                      v-model:value="currentServings"
                      :min="1"
                      :max="10"
                      @change="updateIngredientQuantities"
                  />
                  <span class="servings-unit">人份</span>
                </div>

                <a-divider />

                <div class="ingredients-list">
                  <div
                      v-for="(group, index) in recipe.ingredientGroups"
                      :key="index"
                      class="ingredient-group"
                  >
                    <h3 v-if="group.name" class="group-name">{{ group.name }}</h3>
                    <div
                        v-for="ingredient in group.ingredients"
                        :key="ingredient.id"
                        class="ingredient-item"
                    >
                      <a-checkbox v-model:checked="ingredient.checked"></a-checkbox>
                      <span class="ingredient-quantity">{{ getAdjustedQuantity(ingredient.quantity) }}{{ ingredient.unit }}</span>
                      <span class="ingredient-name">{{ ingredient.name }}</span>
                      <span v-if="ingredient.note" class="ingredient-note">({{ ingredient.note }})</span>
                    </div>
                  </div>
                </div>

                <div class="ingredients-actions">
                  <a-button block>
                    <shopping-cart-outlined /> 添加到购物清单
                  </a-button>
                </div>
              </div>

              <!-- 营养信息 -->
              <div class="nutrition-section">
                <h2 class="section-title">营养信息 <pie-chart-outlined class="section-icon" /></h2>
                <p class="per-serving">每份含量</p>

                <div class="nutrition-item">
                  <span class="nutrition-name">热量</span>
                  <span class="nutrition-value">{{ recipe.nutrition.calories }}千卡</span>
                </div>
                <a-progress
                    :percent="recipe.nutrition.caloriesPercent"
                    :stroke-color="{ '0%': '#ffa940', '100%': '#fa8c16' }"
                    :show-info="false"
                />

                <div class="nutrition-grid">
                  <div class="nutrition-item">
                    <span class="nutrition-name">碳水化合物</span>
                    <span class="nutrition-value">{{ recipe.nutrition.carbs }}克</span>
                    <a-progress
                        :percent="recipe.nutrition.carbsPercent"
                        :stroke-color="{ '0%': '#ffa940', '100%': '#fa8c16' }"
                        :show-info="false"
                    />
                  </div>

                  <div class="nutrition-item">
                    <span class="nutrition-name">蛋白质</span>
                    <span class="nutrition-value">{{ recipe.nutrition.protein }}克</span>
                    <a-progress
                        :percent="recipe.nutrition.proteinPercent"
                        :stroke-color="{ '0%': '#ffa940', '100%': '#fa8c16' }"
                        :show-info="false"
                    />
                  </div>

                  <div class="nutrition-item">
                    <span class="nutrition-name">脂肪</span>
                    <span class="nutrition-value">{{ recipe.nutrition.fat }}克</span>
                    <a-progress
                        :percent="recipe.nutrition.fatPercent"
                        :stroke-color="{ '0%': '#ffa940', '100%': '#fa8c16' }"
                        :show-info="false"
                    />
                  </div>

                  <div class="nutrition-item">
                    <span class="nutrition-name">纤维素</span>
                    <span class="nutrition-value">{{ recipe.nutrition.fiber }}克</span>
                    <a-progress
                        :percent="recipe.nutrition.fiberPercent"
                        :stroke-color="{ '0%': '#ffa940', '100%': '#fa8c16' }"
                        :show-info="false"
                    />
                  </div>
                </div>

                <p class="nutrition-disclaimer">
                  * 营养数据为估算值，具体以实际食材为准
                </p>
              </div>
            </a-col>

            <a-col :xs="24" :md="16">
              <!-- 烹饪步骤 -->
              <div class="steps-section">
                <h2 class="section-title">烹饪步骤 <fire-outlined class="section-icon" /></h2>

                <div class="steps-timer">
                  <div class="timer-display">
                    <clock-circle-outlined class="timer-icon" />
                    <span v-if="timerRunning">
                      {{ formatTime(timerRemaining) }}
                    </span>
                    <span v-else>计时器</span>
                  </div>
                  <div class="timer-controls" v-if="timerRunning">
                    <a-button size="small" @click="pauseTimer" v-if="!timerPaused">
                      <pause-outlined /> 暂停
                    </a-button>
                    <a-button size="small" @click="resumeTimer" v-else>
                      <play-outlined /> 继续
                    </a-button>
                    <a-button size="small" @click="stopTimer">
                      <stop-outlined /> 停止
                    </a-button>
                  </div>
                </div>

                <div class="cooking-steps">
                  <div
                      v-for="(step, index) in recipe.steps"
                      :key="index"
                      class="step-item"
                      :class="{ 'step-completed': step.completed }"
                  >
                    <div class="step-header">
                      <div class="step-number">{{ index + 1 }}</div>
                      <div class="step-actions">
                        <a-checkbox
                            v-model:checked="step.completed"
                            class="step-checkbox"
                        ></a-checkbox>
                        <a-button
                            v-if="step.timerMinutes"
                            size="small"
                            class="timer-button"
                            @click="startTimer(step.timerMinutes)"
                        >
                          <clock-circle-outlined /> {{ step.timerMinutes }}分钟
                        </a-button>
                      </div>
                    </div>
                    <div class="step-content">
                      <div class="step-instruction">{{ step.instruction }}</div>
                      <div
                          v-if="step.imageUrl"
                          class="step-image"
                          :style="{ backgroundImage: `url(${step.imageUrl})` }"
                      ></div>
                      <div v-if="step.tip" class="step-tip">
                        <bulb-outlined /> <span>小贴士: {{ step.tip }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 烹饪小贴士 -->
              <div class="tips-section" v-if="recipe.tips && recipe.tips.length > 0">
                <h2 class="section-title">烹饪小贴士 <bulb-outlined class="section-icon" /></h2>
                <div class="cooking-tips">
                  <div v-for="(tip, index) in recipe.tips" :key="index" class="tip-item">
                    <bulb-outlined class="tip-icon" />
                    <div class="tip-content">{{ tip }}</div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>

        <!-- 评论区域 -->
        <div class="comments-section">
          <h2 class="section-title">用户评价 <comment-outlined class="section-icon" /></h2>

          <!-- 评分统计 -->
          <div class="rating-stats">
            <div class="rating-average">
              <div class="average-score">{{ recipe.rating }}</div>
              <a-rate :value="recipe.rating" disabled allow-half />
              <div class="rating-count">{{ recipe.ratingCount }}人评价</div>
            </div>
            <div class="rating-distribution">
              <div class="rating-bar" v-for="i in 5" :key="i">
                <span class="star-label">{{ 6 - i }}星</span>
                <div class="bar-container">
                  <div
                      class="bar-fill"
                      :style="{ width: `${recipe.ratingDistribution[5 - i]}%` }"
                  ></div>
                </div>
                <span class="bar-percent">{{ recipe.ratingDistribution[5 - i] }}%</span>
              </div>
            </div>
          </div>

          <!-- 评论表单 -->
          <div class="comment-form">
            <h3>分享你的烹饪体验</h3>
            <div class="form-rating">
              <span class="form-label">你的评分:</span>
              <a-rate v-model:value="userRating" allow-half />
            </div>
            <a-form :model="commentForm" layout="vertical">
              <a-form-item label="评价内容">
                <a-textarea
                    v-model:value="commentForm.content"
                    placeholder="分享你的烹饪心得、改良建议或搭配推荐..."
                    :rows="4"
                />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="submitComment">
                  发表评价
                </a-button>
              </a-form-item>
            </a-form>
          </div>

          <!-- 评论列表 -->
          <div class="comments-list">
            <div
                v-for="comment in recipe.comments"
                :key="comment.id"
                class="comment-item"
            >
              <div class="comment-header">
                <div class="comment-user">
                  <a-avatar :src="comment.userAvatar" />
                  <div class="user-info">
                    <div class="user-name">{{ comment.userName }}</div>
                    <div class="comment-date">{{ formatDate(comment.date) }}</div>
                  </div>
                </div>
                <div class="comment-rating">
                  <a-rate :value="comment.rating" disabled allow-half />
                </div>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-actions">
                <a-button type="text" @click="likeComment(comment)">
                  <like-outlined :style="{ color: comment.liked ? '#fa8c16' : '' }" />
                  {{ comment.likes }}
                </a-button>
                <a-button type="text" @click="replyToComment(comment)">
                  <comment-outlined /> 回复
                </a-button>
              </div>
              <!-- 回复表单 -->
              <div v-if="commentToReply === comment.id" class="reply-form">
                <a-textarea
                    v-model:value="replyContent"
                    placeholder="写下你的回复..."
                    :rows="2"
                />
                <div class="reply-actions">
                  <a-button size="small" @click="cancelReply">取消</a-button>
                  <a-button size="small" type="primary" @click="submitReply(comment)">回复</a-button>
                </div>
              </div>
              <!-- 回复列表 -->
              <div v-if="comment.replies && comment.replies.length > 0" class="replies-container">
                <div
                    v-for="reply in comment.replies"
                    :key="reply.id"
                    class="reply-item"
                >
                  <div class="reply-header">
                    <a-avatar :src="reply.userAvatar" size="small" />
                    <span class="reply-user">{{ reply.userName }}</span>
                    <span class="reply-date">{{ formatDate(reply.date) }}</span>
                  </div>
                  <div class="reply-content">{{ reply.content }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="comments-pagination">
            <a-pagination
                v-model:current="currentCommentPage"
                :total="recipe.comments.length"
                :page-size="5"
                show-quick-jumper
            />
          </div>
        </div>

        <!-- 相关菜谱推荐 -->
        <div class="related-recipes">
          <h2 class="section-title">你可能也喜欢 <heart-outlined class="section-icon" /></h2>
          <div class="related-recipe-grid">
            <div
                v-for="relatedRecipe in recipe.relatedRecipes"
                :key="relatedRecipe.id"
                class="related-recipe-card"
                @click="goToRecipe(relatedRecipe.id)"
            >
              <div
                  class="related-recipe-image"
                  :style="{ backgroundImage: `url(${relatedRecipe.imageUrl})` }"
              >
                <div class="related-recipe-overlay">
                  <h3 class="related-recipe-title">{{ relatedRecipe.title }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 数据为空时显示 -->
      <div v-else-if="!loading && !recipe" class="recipe-not-found">
        <a-result
            status="warning"
            title="抱歉，该菜谱不存在或已被删除"
            sub-title="你可以查看其他热门菜谱或返回首页"
        >
          <template #extra>
            <a-button type="primary" @click="goToRecipes">
              浏览其他菜谱
            </a-button>
            <a-button @click="goToHome">
              返回首页
            </a-button>
          </template>
        </a-result>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  LeftOutlined,
  HeartOutlined,
  ShareAltOutlined,
  PrinterOutlined,
  ClockCircleOutlined,
  FireOutlined,
  TeamOutlined,
  StarOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  PieChartOutlined,
  BulbOutlined,
  CommentOutlined,
  LikeOutlined,
  PauseOutlined,
  StopOutlined
} from '@ant-design/icons-vue';

// 设置dayjs
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const recipe = ref<any>(null);

// 评分和评论表单
const userRating = ref(0);
const commentForm = ref({ content: '' });
const currentCommentPage = ref(1);
const commentToReply = ref<number | null>(null);
const replyContent = ref('');

// 计时器状态
const timerRunning = ref(false);
const timerPaused = ref(false);
const timerRemaining = ref(0);
let timerInterval: number | null = null;

// 当前份量
const currentServings = ref(4);
const originalServings = ref(4);

// 获取菜谱详情
onMounted(async () => {
  const recipeId = route.params.id;
  if (!recipeId) {
    loading.value = false;
    return;
  }

  try {
    // 模拟API请求延迟
    setTimeout(() => {
      // 这里应该是从API获取数据，现在使用模拟数据
      recipe.value = getRecipeById(Number(recipeId));
      if (recipe.value) {
        originalServings.value = recipe.value.servings;
        currentServings.value = recipe.value.servings;
      }
      loading.value = false;
    }, 800);
  } catch (error) {
    console.error('获取菜谱详情失败:', error);
    loading.value = false;
  }
});

// 在组件销毁前清除计时器
onBeforeUnmount(() => {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }
});

// 根据难度级别获取对应的文本
const getDifficultyText = (difficulty: string) => {
  const difficultyMap: Record<string, string> = {
    'easy': '简单',
    'medium': '适中',
    'hard': '困难'
  };
  return difficultyMap[difficulty] || difficulty;
};

// 格式化日期
const formatDate = (dateString: string) => {
  return dayjs(dateString).fromNow();
};

// 格式化计时器时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 调整食材份量
const getAdjustedQuantity = (quantity: number) => {
  if (!quantity) return '';
  const ratio = currentServings.value / originalServings.value;
  return Math.round(quantity * ratio * 10) / 10;
};

const updateIngredientQuantities = () => {
  // 实际应用中这个函数会更新显示的份量
  // 在我们的实现中，getAdjustedQuantity已经处理了这个逻辑
};

// 计时器功能
const startTimer = (minutes: number) => {
  // 先停止可能正在运行的计时器
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }

  timerRemaining.value = minutes * 60;
  timerRunning.value = true;
  timerPaused.value = false;

  timerInterval = window.setInterval(() => {
    if (!timerPaused.value) {
      timerRemaining.value--;
      if (timerRemaining.value <= 0) {
        stopTimer();
        // 实际应用中可以添加声音提醒
        alert('计时结束!');
      }
    }
  }, 1000);
};

const pauseTimer = () => {
  timerPaused.value = true;
};

const resumeTimer = () => {
  timerPaused.value = false;
};

const stopTimer = () => {
  timerRunning.value = false;
  timerPaused.value = false;
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

// 评论相关功能
const submitComment = () => {
  if (userRating.value === 0) {
    alert('请为菜谱评分');
    return;
  }

  if (!commentForm.value.content) {
    alert('请填写评价内容');
    return;
  }

  // 模拟提交评论
  alert('评论提交成功!');
  userRating.value = 0;
  commentForm.value.content = '';
};

const likeComment = (comment: any) => {
  comment.liked = !comment.liked;
  if (comment.liked) {
    comment.likes++;
  } else {
    comment.likes--;
  }
};

const replyToComment = (comment: any) => {
  commentToReply.value = comment.id;
  replyContent.value = '';
};

const cancelReply = () => {
  commentToReply.value = null;
  replyContent.value = '';
};

const submitReply = (comment: any) => {
  if (!replyContent.value.trim()) {
    alert('请输入回复内容');
    return;
  }

  // 模拟添加回复
  if (!comment.replies) {
    comment.replies = [];
  }

  comment.replies.push({
    id: Date.now(),
    userName: '当前用户',
    userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    content: replyContent.value,
    date: new Date().toISOString()
  });

  cancelReply();
};

// 导航功能
const goBack = () => {
  router.back();
};

const goToRecipe = (id: number) => {
  router.push(`/recipes/${id}`);
};

const goToRecipes = () => {
  router.push('/recipes');
};

const goToHome = () => {
  router.push('/');
};

// 模拟数据 - 根据ID获取菜谱详情
const getRecipeById = (id: number) => {
  // 这里应该是API调用，现在返回模拟数据
  return {
    id: id,
    title: '蒜蓉西兰花',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    tags: ['素食', '快手菜', '低脂'],
    description: '这道蒜蓉西兰花是一道简单快捷又营养丰富的家常菜。蒜香浓郁，西兰花口感鲜脆，色泽翠绿，是餐桌上的健康选择。',
    rating: 4.7,
    ratingCount: 328,
    ratingDistribution: [75, 15, 7, 2, 1],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    author: {
      name: '健康厨房',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: '专注分享简单健康的家常菜谱'
    },
    ingredientGroups: [
      {
        name: '主料',
        ingredients: [
          { id: 1, name: '西兰花', quantity: 500, unit: '克', note: '切小朵', checked: false },
          { id: 2, name: '蒜头', quantity: 5, unit: '瓣', note: '切末', checked: false }
        ]
      },
      {
        name: '调料',
        ingredients: [
          { id: 3, name: '食用油', quantity: 2, unit: '汤匙', note: '', checked: false },
          { id: 4, name: '盐', quantity: 1, unit: '茶匙', note: '', checked: false },
          { id: 5, name: '白胡椒粉', quantity: 0.25, unit: '茶匙', note: '可选', checked: false }
        ]
      }
    ],
    steps: [
      {
        instruction: '西兰花洗净切成小朵，蒜头切成蒜末。',
        imageUrl: 'https://images.unsplash.com/photo-1584448162039-a9efb471de21',
        completed: false
      },
      {
        instruction: '锅中烧开水，加入少许盐，放入西兰花焯水约1分钟，至西兰花变色。',
        timerMinutes: 1,
        completed: false
      },
      {
        instruction: '迅速捞出西兰花放入冷水中降温，沥干水分备用。',
        tip: '冷水浸泡可以保持西兰花鲜绿色泽和脆嫩口感',
        completed: false
      },
      {
        instruction: '热锅凉油，放入蒜末爆香。',
        imageUrl: 'https://images.unsplash.com/photo-1603614550145-c7bb90bbecb8',
        completed: false
      },
      {
        instruction: '放入西兰花快速翻炒均匀，加入盐和白胡椒粉调味。',
        completed: false
      },
      {
        instruction: '西兰花断生后即可出锅装盘。',
        tip: '不要炒太久，保持西兰花的脆嫩口感',
        completed: false
      }
    ],
    tips: [
      '选择西兰花时，挑选颜色鲜绿、花蕾紧密、没有黄斑的为佳。',
      '西兰花焯水不宜过长，以保持其营养成分和爽脆口感。',
      '可以根据个人口味加入少量生抽或蚝油提味。'
    ],
    nutrition: {
      calories: 120,
      caloriesPercent: 60,
      carbs: 10,
      carbsPercent: 40,
      protein: 8,
      proteinPercent: 70,
      fat: 5,
      fatPercent: 25,
      fiber: 4,
      fiberPercent: 80
    },
    comments: [
      {
        id: 1,
        userName: '小厨娘',
        userAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        date: '2024-01-15T12:30:00Z',
        rating: 5,
        content: '非常简单又美味的一道菜！蒜蓉的香气和西兰花很搭，家人都很喜欢。我还加了一点点蚝油提味，效果不错。',
        likes: 24,
        liked: false,
        replies: [
          {
            id: 101,
            userName: '健康厨房',
            userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            content: '感谢分享您的烹饪经验！加蚝油确实是个不错的选择。',
            date: '2024-01-15T14:25:00Z'
          }
        ]
      },
      {
        id: 2,
        userName: '美食探索者',
        userAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        date: '2024-01-10T18:45:00Z',
        rating: 4,
        content: '做法简单，味道不错。我建议可以加点红辣椒提色增香，效果会更好。',
        likes: 15,
        liked: false
      },
      {
        id: 3,
        userName: '健康生活家',
        userAvatar: 'https://randomuser.me/api/portraits/women/56.jpg',
        date: '2024-01-08T09:12:00Z',
        rating: 5,
        content: '超级喜欢这道菜！简单健康又美味，已经做了好几次了。小贴士很有用，焯水后确实要马上过冷水，这样西兰花的颜色会保持得更好。',
        likes: 32,
        liked: false
      }
    ],
    relatedRecipes: [
      {
        id: 2,
        title: '番茄炒蛋',
        imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554'
      },
      {
        id: 8,
        title: '青椒土豆丝',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'
      },
      {
        id: 5,
        title: '麻婆豆腐',
        imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8'
      },
      {
        id: 16,
        title: '水果沙拉',
        imageUrl: 'https://images.unsplash.com/photo-1564093497595-593b96d80180'
      }
    ]
  };
};
</script>

<style scoped>
.recipe-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 40px;
  background: #f5f5f7;
}

.back-button {
  margin-bottom: 16px;
}

/* 菜谱头部样式 */
.recipe-header {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.recipe-header-content {
  display: flex;
  flex-direction: row;
}

.recipe-title-section {
  flex: 1;
  padding: 32px;
}

.recipe-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.recipe-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recipe-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-count {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.recipe-description {
  margin-bottom: 24px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
}

.recipe-actions {
  display: flex;
  gap: 12px;
}

.recipe-image-container {
  width: 40%;
  position: relative;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 菜谱基本信息卡片 */
.recipe-info-section {
  margin-bottom: 24px;
}

.recipe-info-card {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.info-item {
  display: flex;
  align-items: center;
  padding: 0 16px;
  flex: 1;
  min-width: 140px;
}

.info-icon {
  font-size: 24px;
  color: #fa8c16;
  margin-right: 16px;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

/* 作者信息 */
.author-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 16px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.author-bio {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

/* 通用标题样式 */
.section-title {
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 20px;
  position: relative;
  padding-left: 12px;
  display: flex;
  align-items: center;
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

.section-icon {
  font-size: 18px;
  color: #fa8c16;
  margin-left: 8px;
}

/* 食材区域 */
.recipe-content {
  margin-bottom: 24px;
}

.ingredients-section,
.nutrition-section,
.steps-section,
.tips-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.servings-selector {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.servings-label {
  margin-right: 8px;
}

.servings-unit {
  margin-left: 8px;
}

.ingredient-group {
  margin-bottom: 20px;
}

.group-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.75);
}

.ingredient-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.ingredient-quantity {
  width: 60px;
  margin: 0 12px;
  color: rgba(0, 0, 0, 0.65);
}

.ingredient-name {
  flex: 1;
}

.ingredient-note {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  margin-left: 8px;
}

.ingredients-actions {
  margin-top: 16px;
}

/* 营养信息 */
.nutrition-section {
  margin-top: 24px;
}

.per-serving {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  margin-bottom: 16px;
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.nutrition-name {
  color: rgba(0, 0, 0, 0.65);
}

.nutrition-value {
  font-weight: 500;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.nutrition-disclaimer {
  margin-top: 16px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  font-style: italic;
}

/* 步骤区域 */
.steps-timer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fef6e8;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.timer-display {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
}

.timer-icon {
  color: #fa8c16;
}

.timer-controls {
  display: flex;
  gap: 8px;
}

.cooking-steps {
  margin-top: 24px;
}

.step-item {
  margin-bottom: 24px;
  border-radius: 8px;
  background: #fafafa;
  overflow: hidden;
  transition: all 0.3s;
}

.step-completed {
  opacity: 0.7;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f5f5;
}

.step-number {
  width: 28px;
  height: 28px;
  background: #fa8c16;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.step-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-content {
  padding: 16px;
}

.step-instruction {
  margin-bottom: 16px;
  line-height: 1.6;
}

.step-image {
  height: 200px;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  margin-bottom: 16px;
}

.step-tip {
  background: #fef6e8;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.step-tip .anticon {
  color: #fa8c16;
  margin-top: 2px;
}

/* 小贴士区域 */
.cooking-tips {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
}

.tip-icon {
  color: #fa8c16;
  margin-top: 3px;
}

.tip-content {
  flex: 1;
  line-height: 1.6;
}

/* 评论区域 */
.comments-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.rating-stats {
  display: flex;
  margin-bottom: 24px;
  gap: 24px;
}

.rating-average {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-right: 24px;
  border-right: 1px solid #f0f0f0;
}

.average-score {
  font-size: 36px;
  font-weight: 600;
  color: #fa8c16;
}

.rating-count {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}

.rating-distribution {
  flex: 1;
}

.rating-bar {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.star-label {
  width: 40px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.bar-container {
  flex: 1;
  height: 10px;
  background: #f0f0f0;
  border-radius: 5px;
  margin: 0 12px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #fa8c16;
  border-radius: 5px;
}

.bar-percent {
  width: 40px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  text-align: right;
}

/* 评论表单 */
.comment-form {
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.form-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.form-label {
  color: rgba(0, 0, 0, 0.65);
}

/* 评论列表 */
.comment-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 0;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.comment-date {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.comment-content {
  margin-bottom: 12px;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

/* 回复表单 */
.reply-form {
  margin: 12px 0 12px 48px;
  background: #fafafa;
  padding: 12px;
  border-radius: 6px;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  gap: 8px;
}

/* 回复列表 */
.replies-container {
  margin-left: 48px;
  margin-top: 12px;
  background: #fafafa;
  border-radius: 6px;
  padding: 12px;
}

.reply-item {
  padding: 8px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.reply-user {
  font-weight: 500;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.75);
}

.reply-date {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.reply-content {
  font-size: 14px;
  margin-left: 28px;
  line-height: 1.5;
}

/* 分页 */
.comments-pagination {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

/* 相关菜谱推荐 */
.related-recipes {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.related-recipe-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.related-recipe-card {
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.related-recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.related-recipe-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.related-recipe-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.related-recipe-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

/* 错误状态 */
.recipe-not-found {
  background: white;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .related-recipe-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .recipe-header-content {
    flex-direction: column-reverse;
  }

  .recipe-image-container {
    width: 100%;
    height: 300px;
  }

  .related-recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .nutrition-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .rating-stats {
    flex-direction: column;
  }

  .rating-average {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 0 16px 0;
    margin-bottom: 16px;
  }
}

@media (max-width: 576px) {
  .recipe-detail-container {
    padding: 16px 12px 24px;
  }

  .recipe-title {
    font-size: 24px;
  }

  .recipe-title-section {
    padding: 20px;
  }

  .recipe-actions {
    flex-wrap: wrap;
  }

  .related-recipe-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .related-recipe-card {
    height: 120px;
  }
}
</style>