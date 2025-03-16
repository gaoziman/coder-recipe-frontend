<!-- BrowseHistory.vue -->
<template>
  <div class="browse-history-page">
    <!-- 页面标题和清空按钮 -->
    <div class="page-header">
      <h2 class="page-title">浏览历史</h2>
      <a-button class="clear-btn" @click="showClearConfirm">
        <delete-outlined />
        清空历史
      </a-button>
    </div>

    <!-- 日期筛选标签页 -->
    <div class="filter-tabs">
      <a-radio-group v-model:value="activeFilter" button-style="solid">
        <a-radio-button value="today">今天</a-radio-button>
        <a-radio-button value="yesterday">昨天</a-radio-button>
        <a-radio-button value="thisWeek">本周</a-radio-button>
        <a-radio-button value="earlier">更早</a-radio-button>
      </a-radio-group>
    </div>

    <!-- 历史记录内容 -->
    <div class="history-content">
      <!-- 今天的历史记录 -->
      <div v-if="todayHistory.length > 0 && (activeFilter === 'today' || activeFilter === 'all')" class="history-section">
        <h3 class="section-title">今天</h3>
        <div class="history-items">
          <div v-for="item in todayHistory" :key="item.id" class="history-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="item-content">
              <div class="item-header">
                <h4 class="item-title">
                  <a :href="item.url">{{ item.title }}</a>
                </h4>
                <div class="item-meta">
                  <span class="item-time">{{ item.time }}</span>
                  <a-button class="delete-btn" type="text" @click="deleteHistoryItem(item.id)">
                    <close-outlined />
                  </a-button>
                </div>
              </div>
              <p class="item-description">{{ item.description }}</p>
              <div class="item-footer">
                <a-tag :color="getCategoryColor(item.category)">{{ item.category }}</a-tag>
                <span class="divider">|</span>
                <span class="view-count">
                  <eye-outlined />
                  {{ formatViewCount(item.viewCount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 昨天的历史记录 -->
      <div v-if="yesterdayHistory.length > 0 && (activeFilter === 'yesterday' || activeFilter === 'all')" class="history-section">
        <h3 class="section-title">昨天</h3>
        <div class="history-items">
          <div v-for="item in yesterdayHistory" :key="item.id" class="history-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="item-content">
              <div class="item-header">
                <h4 class="item-title">
                  <a :href="item.url">{{ item.title }}</a>
                </h4>
                <div class="item-meta">
                  <span class="item-time">{{ item.time }}</span>
                  <a-button class="delete-btn" type="text" @click="deleteHistoryItem(item.id)">
                    <close-outlined />
                  </a-button>
                </div>
              </div>
              <p class="item-description">{{ item.description }}</p>
              <div class="item-footer">
                <a-tag :color="getCategoryColor(item.category)">{{ item.category }}</a-tag>
                <span class="divider">|</span>
                <span class="view-count">
                  <eye-outlined />
                  {{ formatViewCount(item.viewCount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 更早的历史记录 -->
      <div v-if="earlierHistory.length > 0 && (activeFilter === 'earlier' || activeFilter === 'all')" class="history-section">
        <h3 class="section-title">更早</h3>
        <div class="history-items">
          <div v-for="item in earlierHistory" :key="item.id" class="history-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="item-content">
              <div class="item-header">
                <h4 class="item-title">
                  <a :href="item.url">{{ item.title }}</a>
                </h4>
                <div class="item-meta">
                  <span class="item-time">{{ item.time }}</span>
                  <a-button class="delete-btn" type="text" @click="deleteHistoryItem(item.id)">
                    <close-outlined />
                  </a-button>
                </div>
              </div>
              <p class="item-description">{{ item.description }}</p>
              <div class="item-footer">
                <a-tag :color="getCategoryColor(item.category)">{{ item.category }}</a-tag>
                <span class="divider">|</span>
                <span class="view-count">
                  <eye-outlined />
                  {{ formatViewCount(item.viewCount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 无历史记录时显示 -->
      <a-empty v-if="filteredHistory.length === 0" description="暂无浏览记录" />
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <a-pagination
          v-model:current="currentPage"
          :total="totalItems"
          :page-size="pageSize"
          @change="handlePageChange"
      />
    </div>

    <!-- 清空历史确认弹窗 -->
    <a-modal
        v-model:visible="clearConfirmVisible"
        title="确认清空"
        ok-text="确认"
        cancel-text="取消"
        @ok="clearAllHistory"
    >
      <p>确定要清空所有浏览历史记录吗？此操作不可恢复。</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
import {
  DeleteOutlined,
  CloseOutlined,
  EyeOutlined
} from '@ant-design/icons-vue';

// 数据模型
interface HistoryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  viewCount: number;
  time: string;
  date: string;
  url: string;
}

// 页面状态
const activeFilter = ref('today');
const currentPage = ref(1);
const pageSize = ref(10);
const clearConfirmVisible = ref(false);

// 模拟数据
const historyData = ref<HistoryItem[]>([
  {
    id: 1,
    title: '完美煎鱼不粘锅的技巧',
    description: '告别煎鱼粘锅的困扰，学习专业厨师的小技巧，让鱼皮金黄酥脆，鱼肉鲜嫩多汁。',
    image: 'https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    category: '烹调方法',
    viewCount: 3500,
    time: '14:23',
    date: 'today',
    url: '#'
  },
  {
    id: 2,
    title: '15分钟快手早餐',
    description: '为忙碌的早晨提供简单易做的营养早餐方案，让你轻松开启一天。',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    category: '早餐',
    viewCount: 2100,
    time: '10:45',
    date: 'today',
    url: '#'
  },
  {
    id: 3,
    title: '家常菜的调味秘诀',
    description: '学会精准调味，让普通食材散发出惊人美味，这些简单的调味技巧将帮助你轻松提升菜肴风味。',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    category: '调味指南',
    viewCount: 4200,
    time: '19:38',
    date: 'yesterday',
    url: '#'
  },
  {
    id: 4,
    title: '南瓜奶油浓汤',
    description: '香浓的南瓜汤，秋冬温暖的选择，简单易做的高颜值料理。',
    image: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    category: '热门菜谱',
    viewCount: 3800,
    time: '15:12',
    date: 'yesterday',
    url: '#'
  },
  {
    id: 5,
    title: '如何炒出完美的蛋炒饭',
    description: '从米饭准备到火候控制，详解制作松散、颗粒分明、香气四溢的蛋炒饭的全部秘诀。',
    image: 'https://images.unsplash.com/photo-1528712306091-ed0763094c98?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
    category: '烹调方法',
    viewCount: 5600,
    time: '3天前',
    date: 'earlier',
    url: '#'
  }
]);

// 按日期分组的历史记录
const todayHistory = computed(() => {
  return historyData.value.filter(item => item.date === 'today');
});

const yesterdayHistory = computed(() => {
  return historyData.value.filter(item => item.date === 'yesterday');
});

const earlierHistory = computed(() => {
  return historyData.value.filter(item => item.date === 'earlier');
});

// 根据当前筛选条件过滤历史记录
const filteredHistory = computed(() => {
  switch (activeFilter.value) {
    case 'today':
      return todayHistory.value;
    case 'yesterday':
      return yesterdayHistory.value;
    case 'thisWeek':
      return [...todayHistory.value, ...yesterdayHistory.value];
    case 'earlier':
      return earlierHistory.value;
    default:
      return historyData.value;
  }
});

// 总记录数
const totalItems = computed(() => {
  return filteredHistory.value.length;
});

// 根据分类获取标签颜色
const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    '烹调方法': 'volcano',
    '早餐': 'green',
    '调味指南': 'gold',
    '热门菜谱': 'orange',
    '晚餐': 'blue'
  };

  return colorMap[category] || 'default';
};

// 格式化浏览次数
const formatViewCount = (count: number) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'W';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

// 页面变化处理
const handlePageChange = (page: number) => {
  currentPage.value = page;
  // 在实际应用中可能需要从API加载对应页面的数据
};

// 显示清空确认对话框
const showClearConfirm = () => {
  clearConfirmVisible.value = true;
};

// 清空所有历史记录
const clearAllHistory = () => {
  historyData.value = [];
  message.success('浏览历史已清空');
  clearConfirmVisible.value = false;
};

// 删除单个历史记录
const deleteHistoryItem = (id: number) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条浏览记录吗？',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      historyData.value = historyData.value.filter(item => item.id !== id);
      message.success('已删除该记录');
    }
  });
};

// 生命周期钩子
onMounted(() => {
  // 实际应用中，可能需要从API获取历史记录数据
  console.log('Browse history component mounted');
});
</script>

<style scoped>
.browse-history-page {
  width: 100%;
  background-color: #FFF8F0;
  padding-bottom: 24px;
}

/* 页面标题和清空按钮 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.clear-btn {
  display: flex;
  align-items: center;
  color: #666;
  background: transparent;
  border: none;
  font-size: 14px;
}

.clear-btn:hover {
  color: #ff5e62;
}

/* 日期筛选标签页 */
.filter-tabs {
  margin-bottom: 24px;
}

:deep(.ant-radio-button-wrapper) {
  border-radius: 20px;
  margin-right: 8px;
  border: none;
  color: #666;
}

:deep(.ant-radio-button-wrapper:before) {
  display: none;
}

:deep(.ant-radio-button-wrapper-checked) {
  background-color: #FF9966 !important;
  color: white !important;
  border-color: #FF9966 !important;
}

:deep(.ant-radio-button-wrapper:hover) {
  color: #FF9966;
}

:deep(.ant-radio-button-wrapper:first-child) {
  border-radius: 20px;
}

:deep(.ant-radio-button-wrapper:last-child) {
  border-radius: 20px;
}

/* 历史记录内容 */
.history-content {
  margin-bottom: 24px;
}

.history-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 16px;
}

.history-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  display: flex;
  gap: 16px;
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.item-image {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.item-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.item-title a {
  color: #333;
  text-decoration: none;
  transition: color 0.2s;
}

.item-title a:hover {
  color: #FF9966;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-time {
  font-size: 12px;
  color: #999;
}

.delete-btn {
  color: #ccc;
  font-size: 14px;
  padding: 0;
  margin: 0;
  height: auto;
}

.delete-btn:hover {
  color: #ff5e62;
  background: transparent !important;
}

.item-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.divider {
  color: #ddd;
  font-size: 12px;
}

.view-count {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

:deep(.ant-pagination-item-active) {
  border-color: #FF9966;
}

:deep(.ant-pagination-item-active a) {
  color: #FF9966;
}

:deep(.ant-pagination-item:hover) {
  border-color: #FF9966;
}

:deep(.ant-pagination-item:hover a) {
  color: #FF9966;
}

:deep(.ant-pagination-prev:hover .ant-pagination-item-link),
:deep(.ant-pagination-next:hover .ant-pagination-item-link) {
  color: #FF9966;
  border-color: #FF9966;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .history-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 160px;
  }
}
</style>