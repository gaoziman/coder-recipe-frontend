<!-- DataStatistics.vue -->
<template>
  <div class="data-statistics-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2 class="page-title">数据统计</h2>
      <div class="action-buttons">
        <a-select
            v-model:value="timeRange"
            style="width: 120px"
            class="time-range-select"
        >
          <a-select-option value="30">最近30天</a-select-option>
          <a-select-option value="90">最近90天</a-select-option>
          <a-select-option value="180">最近半年</a-select-option>
          <a-select-option value="365">最近一年</a-select-option>
          <a-select-option value="all">全部时间</a-select-option>
        </a-select>
        <a-button class="export-btn" @click="exportReport">
          <download-outlined />
          导出报告
        </a-button>
      </div>
    </div>

    <!-- 统计总览 -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon recipe-icon">
          <book-outlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">我创建的菜谱</div>
          <div class="stat-value-container">
            <span class="stat-value">{{ statistics.recipes }}</span>
            <span class="stat-trend up">↑ {{ statistics.recipesIncrease }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon cooking-icon">
          <fire-outlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">烹饪次数</div>
          <div class="stat-value-container">
            <span class="stat-value">{{ statistics.cookingTimes }}</span>
            <span class="stat-trend up">↑ {{ statistics.cookingTimesIncrease }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon ingredient-icon">
          <inbox-outlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">使用食材</div>
          <div class="stat-value-container">
            <span class="stat-value">{{ statistics.ingredients }}</span>
            <span class="stat-trend up">↑ {{ statistics.ingredientsIncrease }}</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon time-icon">
          <clock-circle-outlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">总烹饪时间</div>
          <div class="stat-value-container">
            <span class="stat-value">{{ statistics.cookingHours }}h</span>
            <span class="stat-trend up">↑ {{ statistics.cookingHoursIncrease }}h</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容标签页 -->
    <div class="content-tabs">
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="habits" tab="烹饪习惯">
          <div class="habits-content">
            <!-- 两列布局：左侧烹饪活跃度，右侧烹饪偏好 -->
            <div class="habits-grid">
              <!-- 烹饪活跃度 -->
              <div class="activity-section">
                <h3 class="section-title">烹饪活跃度</h3>

                <!-- 月度活跃度热力图 -->
                <div class="chart-card">
                  <div class="chart-header">
                    <h4 class="chart-title">月度活跃度</h4>
                    <a-select v-model:value="yearFilter" class="chart-filter">
                      <a-select-option value="2025">2025年</a-select-option>
                      <a-select-option value="2024">2024年</a-select-option>
                    </a-select>
                  </div>

                  <div class="heatmap-container">
                    <div class="heatmap-weekdays">
                      <div v-for="day in weekdays" :key="day" class="weekday-label">{{ day }}</div>
                    </div>

                    <div class="heatmap-grid">
                      <div
                          v-for="(cell, index) in heatmapData"
                          :key="index"
                          :class="['heatmap-cell', `heat-level-${cell.level}`]"
                          :title="`${cell.date}: ${cell.count}次烹饪`"
                      ></div>
                    </div>

                    <div class="heatmap-legend">
                      <div class="legend-item">
                        <div class="legend-color heat-level-0"></div>
                        <span>无活动</span>
                      </div>
                      <div class="legend-item">
                        <div class="legend-color heat-level-1"></div>
                        <span>一次</span>
                      </div>
                      <div class="legend-item">
                        <div class="legend-color heat-level-2"></div>
                        <span>二次</span>
                      </div>
                      <div class="legend-item">
                        <div class="legend-color heat-level-3"></div>
                        <span>三次及以上</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 每周烹饪频率图 -->
                <div class="chart-card">
                  <div class="chart-header">
                    <h4 class="chart-title">每周烹饪频率</h4>
                    <a-select v-model:value="weeklyRangeFilter" class="chart-filter">
                      <a-select-option value="30">最近30天</a-select-option>
                      <a-select-option value="90">最近90天</a-select-option>
                    </a-select>
                  </div>

                  <div class="weekly-chart">
                    <div class="bar-container">
                      <div
                          v-for="(item, index) in weeklyData"
                          :key="index"
                          class="bar-column"
                      >
                        <div class="bar-item" :style="{ height: `${item.height}px` }"></div>
                        <div class="bar-label">{{ item.day }}</div>
                      </div>
                    </div>

                    <div class="chart-note">
                      周末烹饪活动最为频繁，平均每个周末烹饪3.5次
                    </div>
                  </div>
                </div>
              </div>

              <!-- 烹饪偏好和习惯分析 -->
              <div class="preference-section">
                <!-- 烹饪时间分布 -->
                <div class="chart-card">
                  <h4 class="chart-title">烹饪时间分布</h4>

                  <div class="donut-chart-container">
                    <div class="donut-chart">
                      <div class="donut-hole"></div>
                    </div>
                  </div>

                  <div class="distribution-legend">
                    <div class="legend-item">
                      <div class="legend-color breakfast-color"></div>
                      <span class="legend-label">早餐</span>
                      <span class="legend-value">30%</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color lunch-color"></div>
                      <span class="legend-label">午餐</span>
                      <span class="legend-value">25%</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color tea-color"></div>
                      <span class="legend-label">下午茶</span>
                      <span class="legend-value">15%</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color dinner-color"></div>
                      <span class="legend-label">晚餐</span>
                      <span class="legend-value">15%</span>
                    </div>
                    <div class="legend-item">
                      <div class="legend-color night-color"></div>
                      <span class="legend-label">夜宵</span>
                      <span class="legend-value">15%</span>
                    </div>
                  </div>
                </div>

                <!-- 常用烹饪方式 -->
                <div class="chart-card">
                  <h4 class="chart-title">常用烹饪方式</h4>

                  <div class="cooking-methods">
                    <div v-for="method in cookingMethods" :key="method.name" class="method-item">
                      <div class="method-header">
                        <span class="method-name">{{ method.name }}</span>
                        <span class="method-percent">{{ method.percent }}%</span>
                      </div>
                      <div class="method-bar-bg">
                        <div class="method-bar" :style="{ width: `${method.percent}%` }"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 烹饪时长分析 -->
                <div class="chart-card">
                  <h4 class="chart-title">烹饪时长分析</h4>

                  <div class="cooking-duration">
                    <div class="duration-highlight">
                      <p class="duration-value">28</p>
                      <p class="duration-label">平均烹饪时间(分钟)</p>
                    </div>

                    <div class="duration-stats">
                      <div class="duration-item">
                        <span class="duration-type">快手菜 (≤15分钟)</span>
                        <span class="duration-percent">38%</span>
                      </div>
                      <div class="duration-item">
                        <span class="duration-type">日常菜 (16-30分钟)</span>
                        <span class="duration-percent">42%</span>
                      </div>
                      <div class="duration-item">
                        <span class="duration-type">慢食菜 (31-60分钟)</span>
                        <span class="duration-percent">15%</span>
                      </div>
                      <div class="duration-item">
                        <span class="duration-type">耐心菜 (>60分钟)</span>
                        <span class="duration-percent">5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 菜系偏好分析 -->
            <div class="cuisine-analysis">
              <h3 class="section-title">菜系偏好分析</h3>

              <div class="cuisine-content">
                <div class="cuisine-grid">
                  <!-- 菜系分布 -->
                  <div class="cuisine-distribution">
                    <h4 class="chart-title">菜系分布</h4>

                    <div class="distribution-bars">
                      <div v-for="cuisine in cuisineData" :key="cuisine.name" class="cuisine-bar-item">
                        <div class="cuisine-bar-header">
                          <span class="cuisine-name">{{ cuisine.name }}</span>
                          <span class="cuisine-percent">{{ cuisine.percent }}%</span>
                        </div>
                        <div class="cuisine-bar-bg">
                          <div
                              class="cuisine-bar"
                              :style="{
                              width: `${cuisine.percent}%`,
                              backgroundColor: cuisine.color
                            }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 口味偏好 -->
                  <div class="flavor-preference">
                    <h4 class="chart-title">口味偏好</h4>

                    <div class="flavor-grid">
                      <div
                          v-for="flavor in flavorData"
                          :key="flavor.name"
                          class="flavor-item"
                      >
                        <div class="flavor-percent" :style="{ color: flavor.color }">
                          {{ flavor.percent }}%
                        </div>
                        <div class="flavor-name">{{ flavor.name }}</div>
                      </div>
                    </div>

                    <div class="spices-section">
                      <h4 class="spices-title">最常用调味品</h4>
                      <div class="spices-tags">
                        <span
                            v-for="spice in commonSpices"
                            :key="spice"
                            class="spice-tag"
                        >
                          {{ spice }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 健康分析 -->
            <div class="health-analysis">
              <h3 class="section-title">健康分析与建议</h3>

              <div class="health-content">
                <div class="health-grid">
                  <!-- 营养均衡度 -->
                  <div class="nutrition-balance">
                    <h4 class="chart-title">营养均衡度</h4>

                    <div class="balance-score">
                      <div class="score-badge">
                        <span class="score-value">B+</span>
                      </div>
                      <div class="score-info">
                        <p class="score-label">良好</p>
                        <p class="score-description">蛋白质摄入略低于建议值</p>
                      </div>
                    </div>

                    <div class="nutrition-bars">
                      <div v-for="nutrient in nutrients" :key="nutrient.name" class="nutrient-item">
                        <div class="nutrient-header">
                          <span class="nutrient-name">{{ nutrient.name }}</span>
                          <span class="nutrient-percent">
                            {{ nutrient.percent }}%
                            <span class="nutrient-target">/ 建议{{ nutrient.target }}%</span>
                          </span>
                        </div>
                        <div class="nutrient-bar-bg">
                          <div
                              class="nutrient-bar"
                              :style="{
                              width: `${nutrient.percent}%`,
                              backgroundColor: nutrient.color
                            }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 健康建议 -->
                  <div class="health-suggestions">
                    <h4 class="chart-title">个性化建议</h4>

                    <div class="suggestions-list">
                      <div class="suggestion-item protein-item">
                        <information-circle-outlined class="suggestion-icon" />
                        <div class="suggestion-content">
                          <h5 class="suggestion-title">增加蛋白质摄入</h5>
                          <p class="suggestion-text">建议尝试更多鱼类、豆类或瘦肉菜谱</p>
                        </div>
                      </div>

                      <div class="suggestion-item carbs-item">
                        <information-circle-outlined class="suggestion-icon" />
                        <div class="suggestion-content">
                          <h5 class="suggestion-title">减少精细碳水摄入</h5>
                          <p class="suggestion-text">可以用全麦面食替代普通面食</p>
                        </div>
                      </div>

                      <div class="suggestion-item method-item">
                        <information-circle-outlined class="suggestion-icon" />
                        <div class="suggestion-content">
                          <h5 class="suggestion-title">多样化烹饪方式</h5>
                          <p class="suggestion-text">尝试更多蒸煮类菜谱，减少煎炸烹饪方式</p>
                        </div>
                      </div>
                    </div>

                    <div class="recommended-recipes">
                      <h4 class="recipes-title">推荐尝试菜谱</h4>

                      <div class="recipes-list">
                        <div class="recipe-item">
                          <a-avatar :src="salmonImage" shape="square" :size="48" class="recipe-image" />
                          <div class="recipe-info">
                            <h5 class="recipe-name">香煎三文鱼</h5>
                            <p class="recipe-tag">高蛋白、低碳水</p>
                          </div>
                        </div>

                        <div class="recipe-item">
                          <a-avatar :src="saladImage" shape="square" :size="48" class="recipe-image" />
                          <div class="recipe-info">
                            <h5 class="recipe-name">藜麦蔬菜沙拉</h5>
                            <p class="recipe-tag">高纤维、高蛋白</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="ingredients" tab="食材使用">
          <div class="ingredients-placeholder">
            食材使用分析内容将在此显示
          </div>
        </a-tab-pane>

        <a-tab-pane key="recipes" tab="菜谱分析">
          <div class="recipes-placeholder">
            菜谱分析内容将在此显示
          </div>
        </a-tab-pane>

        <a-tab-pane key="nutrition" tab="营养摄入">
          <div class="nutrition-placeholder">
            营养摄入分析内容将在此显示
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 我的成就 -->
    <div class="achievements-section">
      <h3 class="section-title">
        <trophy-outlined class="section-icon" /> 我的成就
      </h3>

      <div class="achievements-grid">
        <div
            v-for="achievement in achievements"
            :key="achievement.id"
            :class="['achievement-card', { 'locked': !achievement.unlocked }]"
        >
          <div class="achievement-icon-wrapper">
            <component :is="achievement.icon" class="achievement-icon" />
          </div>
          <h4 class="achievement-title">{{ achievement.title }}</h4>
          <p class="achievement-description">{{ achievement.description }}</p>
        </div>
      </div>

      <div class="view-more">
        <a-button type="link" @click="viewAllAchievements">查看全部成就 →</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import {
  BookOutlined,
  FireOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  TrophyOutlined
} from '@ant-design/icons-vue';

// 时间范围选择
const timeRange = ref('30');
const yearFilter = ref('2025');
const weeklyRangeFilter = ref('30');
const activeTab = ref('habits');

// 图片资源
const salmonImage = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2';
const saladImage = 'https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9';

// 统计数据
const statistics = reactive({
  recipes: 24,
  recipesIncrease: 3,
  cookingTimes: 186,
  cookingTimesIncrease: 12,
  ingredients: 78,
  ingredientsIncrease: 5,
  cookingHours: 85.5,
  cookingHoursIncrease: 6.2
});

// 热力图数据
const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
const heatmapData = reactive([
  // 第一行
  { date: '2025-03-01', count: 1, level: 1 },
  { date: '2025-03-02', count: 2, level: 2 },
  { date: '2025-03-03', count: 0, level: 0 },
  { date: '2025-03-04', count: 0, level: 0 },
  { date: '2025-03-05', count: 1, level: 1 },
  { date: '2025-03-06', count: 3, level: 3 },
  { date: '2025-03-07', count: 3, level: 3 },
  // 第二行
  { date: '2025-03-08', count: 0, level: 0 },
  { date: '2025-03-09', count: 1, level: 1 },
  { date: '2025-03-10', count: 2, level: 2 },
  { date: '2025-03-11', count: 0, level: 0 },
  { date: '2025-03-12', count: 1, level: 1 },
  { date: '2025-03-13', count: 2, level: 2 },
  { date: '2025-03-14', count: 3, level: 3 },
  // 第三行
  { date: '2025-03-15', count: 1, level: 1 },
  { date: '2025-03-16', count: 0, level: 0 },
  { date: '2025-03-17', count: 1, level: 1 },
  { date: '2025-03-18', count: 2, level: 2 },
  { date: '2025-03-19', count: 0, level: 0 },
  { date: '2025-03-20', count: 3, level: 3 },
  { date: '2025-03-21', count: 2, level: 2 },
  // 第四行
  { date: '2025-03-22', count: 0, level: 0 },
  { date: '2025-03-23', count: 1, level: 1 },
  { date: '2025-03-24', count: 0, level: 0 },
  { date: '2025-03-25', count: 0, level: 0 },
  { date: '2025-03-26', count: 1, level: 1 },
  { date: '2025-03-27', count: 2, level: 2 },
  { date: '2025-03-28', count: 3, level: 3 },
]);

// 每周烹饪频率数据
const weeklyData = reactive([
  { day: '一', count: 20, height: 80 },
  { day: '二', count: 12, height: 48 },
  { day: '三', count: 28, height: 112 },
  { day: '四', count: 16, height: 64 },
  { day: '五', count: 32, height: 128 },
  { day: '六', count: 40, height: 160 },
  { day: '日', count: 36, height: 144 },
]);

// 烹饪方式数据
const cookingMethods = reactive([
  { name: '炒', percent: 45 },
  { name: '蒸', percent: 20 },
  { name: '煮', percent: 15 },
  { name: '烤', percent: 10 },
  { name: '煎', percent: 10 },
]);

// 菜系分布数据
const cuisineData = reactive([
  { name: '川菜', percent: 35, color: '#FF9966' },
  { name: '粤菜', percent: 25, color: '#66CC99' },
  { name: '苏菜', percent: 15, color: '#5C8AE6' },
  { name: '浙菜', percent: 10, color: '#FFBB33' },
  { name: '西式料理', percent: 10, color: '#FF7676' },
  { name: '其他', percent: 5, color: '#CCCCCC' },
]);

// 口味偏好数据
const flavorData = reactive([
  { name: '麻辣', percent: 32, color: '#FF9966' },
  { name: '清淡', percent: 25, color: '#66CC99' },
  { name: '酸甜', percent: 18, color: '#5C8AE6' },
  { name: '咸鲜', percent: 15, color: '#FFBB33' },
  { name: '香辣', percent: 7, color: '#FF7676' },
  { name: '其他', percent: 3, color: '#CCCCCC' },
]);

// 常用调味品
const commonSpices = ['生抽', '蒜末', '料酒', '花椒', '白糖', '盐'];

// 营养素数据
const nutrients = reactive([
  { name: '碳水化合物', percent: 85, target: 70, color: '#FFBB33' },
  { name: '蛋白质', percent: 60, target: 85, color: '#FF9966' },
  { name: '脂肪', percent: 70, target: 60, color: '#FF7676' },
  { name: '膳食纤维', percent: 75, target: 90, color: '#66CC99' },
]);

// 成就数据
const achievements = reactive([
  {
    id: 1,
    title: '烹饪新手',
    description: '完成10道菜谱',
    icon: BookOutlined,
    unlocked: true
  },
  {
    id: 2,
    title: '烹饪达人',
    description: '完成50道菜谱',
    icon: BookOutlined,
    unlocked: true
  },
  {
    id: 3,
    title: '烹饪大师',
    description: '完成100道菜谱',
    icon: BookOutlined,
    unlocked: false
  },
  {
    id: 4,
    title: '蔬菜爱好者',
    description: '使用20种蔬菜',
    icon: BookOutlined,
    unlocked: true
  },
  {
    id: 5,
    title: '甜点专家',
    description: '制作15道甜点',
    icon: BookOutlined,
    unlocked: false
  },
]);

// 导出报告
const exportReport = () => {
  message.success('报告正在导出，请稍候...');
  // 实际项目中需要实现导出逻辑
};

// 查看全部成就
const viewAllAchievements = () => {
  message.info('跳转到成就页面');
  // 实际项目中需要实现页面跳转
};

// 页面加载后初始化
onMounted(() => {
  // 实际项目中可能需要从API获取数据
  message.success('数据统计页面加载完成');
});
</script>

<style scoped>
.data-statistics-page {
  width: 100%;
  background-color: #FFF8F0;
  color: #333333;
}

/* 页面标题和操作按钮 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.time-range-select {
  border-radius: 20px;
}

.export-btn {
  border-color: #ddd;
  color: #666;
  background-color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.export-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

/* 统计总览卡片 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  font-size: 20px;
}

.recipe-icon {
  background-color: #fff0e6;
  color: #FF9966;
}

.cooking-icon {
  background-color: #e6f7f0;
  color: #66CC99;
}

.ingredient-icon {
  background-color: #e6f0ff;
  color: #5C8AE6;
}

.time-icon {
  background-color: #fff6e0;
  color: #FFBB33;
}

.stat-content {
  flex: 1;
}

.stat-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-value-container {
  display: flex;
  align-items: baseline;
}

.stat-value {
  color: #333;
  font-size: 22px;
  font-weight: 600;
}

.stat-trend {
  font-size: 14px;
  margin-left: 8px;
}

.stat-trend.up {
  color: #66CC99;
}

.stat-trend.down {
  color: #FF5E62;
}

/* 标签页内容 */
.content-tabs {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  overflow: hidden;
}

:deep(.ant-tabs-tab) {
  padding: 12px 20px !important;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #FF9966 !important;
  font-weight: 500;
}

:deep(.ant-tabs-ink-bar) {
  background-color: #FF9966 !important;
}

.habits-content {
  padding: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

/* 烹饪习惯和偏好布局 */
.habits-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
}

.chart-card {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-weight: 500;
  font-size: 16px;
  color: #333;
  margin: 0;
}

.chart-filter {
  border: none;
  font-size: 14px;
}

/* 热力图样式 */
.heatmap-container {
  margin-top: 12px;
}

.heatmap-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.weekday-label {
  text-align: center;
  font-size: 12px;
  color: #666;
}

.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.heatmap-cell {
  width: 100%;
  height: 32px;
  border-radius: 4px;
}

.heat-level-0 {
  background-color: white;
  border: 1px solid #eee;
}

.heat-level-1 {
  background-color: #E6F7F0;
}

.heat-level-2 {
  background-color: #D1F0E0;
}

.heat-level-3 {
  background-color: #66CC99;
}

.heatmap-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

/* 每周烹饪频率图表 */
.weekly-chart {
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.bar-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 180px;
}

.bar-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% / 7 - 10px);
  gap: 8px;
}

.bar-item {
  width: 40px;
  background-color: #FFEBE0;
  border-radius: 6px 6px 0 0;
  transition: all 0.3s;
}

.bar-column:nth-child(6) .bar-item,
.bar-column:nth-child(7) .bar-item {
  background-color: #FF9966;
}

.bar-label {
  font-size: 14px;
  color: #666;
}

.chart-note {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 16px;
}

/* 烹饪时间分布环形图 */
.donut-chart-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.donut-chart {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
      #FF9966 0% 30%,
      #66CC99 30% 55%,
      #5C8AE6 55% 70%,
      #FFBB33 70% 85%,
      #FF7676 85% 100%
  );
  position: relative;
}

.donut-hole {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.distribution-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.breakfast-color {
  background-color: #FF9966;
}

.lunch-color {
  background-color: #66CC99;
}

.tea-color {
  background-color: #5C8AE6;
}

.dinner-color {
  background-color: #FFBB33;
}

.night-color {
  background-color: #FF7676;
}

.legend-label {
  flex: 1;
  font-size: 14px;
  color: #666;
}

.legend-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* 常用烹饪方式 */
.cooking-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-item {
  margin-bottom: 8px;
}

.method-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.method-name {
  font-size: 14px;
  color: #666;
}

.method-percent {
  font-size: 12px;
  color: #666;
}

.method-bar-bg {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.method-bar {
  height: 100%;
  background-color: #FF9966;
  border-radius: 4px;
}

/* 烹饪时长分析 */
.cooking-duration {
  padding: 12px 0;
}

.duration-highlight {
  text-align: center;
  margin-bottom: 16px;
}

.duration-value {
  font-size: 28px;
  font-weight: 600;
  color: #FF9966;
  margin: 0;
}

.duration-label {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0 0;
}

.duration-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.duration-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.duration-type {
  color: #666;
}

.duration-percent {
  color: #333;
  font-weight: 500;
}

/* 菜系偏好分析 */
.cuisine-content {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.cuisine-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.distribution-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cuisine-bar-item {
  margin-bottom: 4px;
}

.cuisine-bar-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.cuisine-name {
  font-size: 14px;
  color: #666;
}

.cuisine-percent {
  font-size: 14px;
  color: #333;
}

.cuisine-bar-bg {
  width: 100%;
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.cuisine-bar {
  height: 100%;
  border-radius: 5px;
}

/* 口味偏好 */
.flavor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.flavor-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

.flavor-percent {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 4px;
}

.flavor-name {
  font-size: 14px;
  color: #666;
}

.spices-section {
  margin-top: 16px;
}

.spices-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.spices-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.spice-tag {
  background-color: #FFEBE0;
  color: #FF9966;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
}

/* 健康分析 */
.health-content {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.health-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.balance-score {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.score-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #E6F7F0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.score-value {
  font-size: 24px;
  font-weight: 600;
  color: #66CC99;
}

.score-label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.score-description {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0 0;
}

.nutrition-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nutrient-item {
  margin-bottom: 6px;
}

.nutrient-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.nutrient-name {
  font-size: 14px;
  color: #666;
}

.nutrient-percent {
  font-size: 14px;
  color: #333;
}

.nutrient-target {
  font-size: 12px;
  color: #999;
}

.nutrient-bar-bg {
  width: 100%;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.nutrient-bar {
  height: 100%;
  border-radius: 4px;
}

/* 个性化建议 */
.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.suggestion-item {
  display: flex;
  padding: 12px;
  border-radius: 8px;
  align-items: flex-start;
}

.protein-item {
  background-color: #FFEBE0;
}

.carbs-item {
  background-color: #E6F7F0;
}

.method-item {
  background-color: #E6F0FF;
}

.suggestion-icon {
  color: #FF9966;
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.carbs-item .suggestion-icon {
  color: #66CC99;
}

.method-item .suggestion-icon {
  color: #5C8AE6;
}

.suggestion-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
}

.suggestion-text {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.recommended-recipes {
  margin-top: 24px;
}

.recipes-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.recipes-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recipe-item {
  display: flex;
  padding: 8px;
  border: 1px solid #eee;
  border-radius: 8px;
  align-items: center;
}

.recipe-image {
  margin-right: 12px;
  object-fit: cover;
  border-radius: 4px;
}

.recipe-name {
  font-size: 15px;
  color: #333;
  margin: 0 0 4px 0;
}

.recipe-tag {
  font-size: 12px;
  color: #66CC99;
  margin: 0;
}

/* 成就部分 */
.achievements-section {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.section-icon {
  color: #FF9966;
  margin-right: 8px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.achievement-card {
  background-color: #FFEBE0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  transition: all 0.3s;
}

.achievement-card.locked {
  background-color: #f0f0f0;
  opacity: 0.6;
}

.achievement-icon-wrapper {
  width: 48px;
  height: 48px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  border: 2px solid #FF9966;
}

.achievement-card.locked .achievement-icon-wrapper {
  border-color: #ccc;
}

.achievement-icon {
  font-size: 20px;
  color: #FF9966;
}

.achievement-card.locked .achievement-icon {
  color: #ccc;
}

.achievement-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
}

.achievement-card.locked .achievement-title {
  color: #666;
}

.achievement-description {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.achievement-card.locked .achievement-description {
  color: #999;
}

.view-more {
  text-align: center;
  margin-top: 16px;
}

.view-more button {
  color: #FF9966;
}

.view-more button:hover {
  color: #FF8044;
}

/* 占位内容样式 */
.ingredients-placeholder,
.recipes-placeholder,
.nutrition-placeholder {
  padding: 40px;
  text-align: center;
  color: #999;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .habits-grid,
  .cuisine-grid,
  .health-grid {
    grid-template-columns: 1fr;
  }

  .achievements-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: 1fr;
  }

  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .flavor-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
/* Tab栏样式优化 */
:deep(.ant-tabs-nav) {
  margin-bottom: 0;
}

:deep(.ant-tabs-tab) {
  padding: 12px 20px !important;
  transition: color 0.3s;
  font-size: 16px;
}

:deep(.ant-tabs-tab:hover) {
  color: #FF9966;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active) {
  position: relative;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #FF9966 !important;
  font-weight: 500;
}

:deep(.ant-tabs-ink-bar) {
  background-color: #FF9966 !important;
  height: 3px !important;
}

:deep(.ant-tabs-nav::before) {
  border-bottom: 1px solid #f0f0f0;
}

/* 未选中的标签颜色 */
:deep(.ant-tabs-tab .ant-tabs-tab-btn) {
  color: #666666;
}
</style>