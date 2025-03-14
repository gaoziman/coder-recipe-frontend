<template>
  <div class="collections-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h1 class="page-title">精选合集</h1>
      <p class="page-subtitle">发现适合各种场景的美食集锦，让烹饪变得更简单</p>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <a-radio-group v-model:value="filterType" button-style="solid" class="filter-group">
        <a-radio-group v-model:value="filterType" button-style="solid" class="filter-group">
          <a-radio-button value="all" class="filter-btn">全部</a-radio-button>
          <a-radio-button value="meals" class="filter-btn">按餐点</a-radio-button>
          <a-radio-button value="ingredients" class="filter-btn">按食材</a-radio-button>
          <a-radio-button value="season" class="filter-btn">按季节</a-radio-button>
          <a-radio-button value="occasion" class="filter-btn">按场合</a-radio-button>
        </a-radio-group>
      </a-radio-group>

      <a-input-search
          v-model:value="searchQuery"
          placeholder="搜索合集..."
          class="search-input"
          @search="onSearch"
          :enter-button="true"
      />
    </div>

    <!-- 合集展示区域 -->
    <div class="collections-grid">
      <div
          class="collection-card"
          v-for="collection in filteredCollections"
          :key="collection.id"
          @click="viewCollection(collection.id)"
      >
        <div class="collection-image" :style="{ backgroundImage: `url(${collection.imageUrl})` }">
          <div class="collection-overlay">
            <h3 class="collection-title">{{ collection.title }}</h3>
            <div class="collection-count">{{ collection.recipeCount }}个菜谱</div>
          </div>
        </div>
        <div class="collection-info">
          <div class="collection-desc">{{ collection.description }}</div>
          <div class="collection-tags">
            <a-tag v-for="tag in collection.tags" :key="tag" color="orange">{{ tag }}</a-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-wrapper">
      <a-pagination
          v-model:current="currentPage"
          :total="totalCollections"
          :pageSize="pageSize"
          show-less-items
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const router = useRouter();
const filterType = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(9);
const totalCollections = ref(0);

// 模拟合集数据
const allCollections = ref([
  {
    id: 1,
    title: '简易家常菜',
    description: '适合忙碌工作日的快手菜谱，20分钟内即可完成',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    recipeCount: 12,
    tags: ['家常', '快手菜', '下饭菜']
  },
  {
    id: 2,
    title: '健康低脂餐',
    description: '专为健身和减重设计的美味低卡路里食谱',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    recipeCount: 8,
    tags: ['低脂', '健康', '沙拉']
  },
  {
    id: 3,
    title: '春季时令菜',
    description: '使用春季新鲜食材制作的时令菜肴，尽享自然风味',
    imageUrl: 'https://images.unsplash.com/photo-1620589125118-b558371e0b5c',
    recipeCount: 15,
    tags: ['春季', '时令', '鲜香']
  },
  {
    id: 4,
    title: '周末宴客菜',
    description: '招待亲朋好友的精致菜品，展现厨艺的绝佳选择',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae',
    recipeCount: 10,
    tags: ['宴客', '大菜', '高级']
  },
  {
    id: 5,
    title: '适合新手的素食菜谱',
    description: '即使是厨房新手也能掌握的简单美味素食料理',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    recipeCount: 9,
    tags: ['素食', '新手', '简单']
  },
  {
    id: 6,
    title: '中华传统小吃',
    description: '传承中华美食文化的经典小吃，唤醒童年记忆',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
    recipeCount: 14,
    tags: ['传统', '小吃', '家乡味']
  },
  {
    id: 7,
    title: '夏季开胃凉菜',
    description: '炎炎夏日的清凉选择，开胃又解暑',
    imageUrl: 'https://images.unsplash.com/photo-1551248429-40975aa4de74',
    recipeCount: 7,
    tags: ['夏季', '凉菜', '开胃']
  },
  {
    id: 8,
    title: '节日餐桌必备',
    description: '节日聚会的精选菜谱，让节日更有烟火气',
    imageUrl: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904',
    recipeCount: 11,
    tags: ['节日', '聚会', '团圆']
  },
  {
    id: 9,
    title: '儿童喜爱的趣味料理',
    description: '色彩缤纷、造型有趣的料理，让孩子爱上吃饭',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    recipeCount: 8,
    tags: ['儿童', '趣味', '创意']
  }
]);

// 根据筛选条件和搜索关键词过滤合集
const filteredCollections = computed(() => {
  let result = allCollections.value;

  // 根据类型筛选
  if (filterType.value !== 'all') {
    // 在实际应用中，这里应该根据类型进行筛选
    // 这里仅作为示例，简单过滤一些数据
    if (filterType.value === 'meals') {
      result = result.filter(item => item.tags.some(tag => ['快手菜', '早餐', '午餐', '晚餐'].includes(tag)));
    } else if (filterType.value === 'ingredients') {
      result = result.filter(item => item.tags.some(tag => ['素食', '肉类', '海鲜'].includes(tag)));
    } else if (filterType.value === 'season') {
      result = result.filter(item => item.tags.some(tag => ['春季', '夏季', '秋季', '冬季'].includes(tag)));
    } else if (filterType.value === 'occasion') {
      result = result.filter(item => item.tags.some(tag => ['宴客', '聚会', '节日'].includes(tag)));
    }
  }

  // 根据搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  totalCollections.value = result.length;

  // 分页处理
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return result.slice(startIndex, startIndex + pageSize.value);
});

// 查看合集详情
const viewCollection = (id) => {
  router.push(`/collections/${id}`);
};

// 搜索功能
const onSearch = () => {
  currentPage.value = 1; // 重置为第一页
  if (filteredCollections.value.length === 0) {
    message.info('未找到相关合集');
  }
};

onMounted(() => {
  // 在实际应用中，这里应该从API获取合集数据
  totalCollections.value = allCollections.value.length;
});
</script>

<style scoped>
.collections-container {
  padding: 24px 16px;
  background: #f5f5f7;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
}

.page-subtitle {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-group {
  flex-grow: 1;
}

.search-container {
  max-width: 300px;
  width: 100%;
}

.search-input {
  width: 30%;
}

/* 使用深度选择器修改搜索按钮和图标样式 */
:deep(.ant-input-search .ant-input) {
  border-color: #eee;
}

:deep(.ant-input-search .ant-input:focus),
:deep(.ant-input-search .ant-input:hover) {
  border-color: #fa8c16;
}

:deep(.ant-input-search .ant-input-search-button) {
  background-color: #fa8c16;
  border-color: #fa8c16;
}

:deep(.ant-input-search .ant-input-search-button:hover) {
  background-color: #fd9a30;
  border-color: #fd9a30;
}

/* 关键修改：将搜索图标改为白色 */
:deep(.ant-input-search .ant-input-search-button .anticon-search) {
  color: white !important;
}
.collections-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.collection-card {
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  cursor: pointer;
}

.collection-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.collection-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
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
  font-size: 18px;
  font-weight: 600;
}

.collection-count {
  font-size: 12px;
  opacity: 0.9;
}

.collection-info {
  padding: 16px;
}

.collection-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 12px;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.collection-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .collections-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .collections-grid {
    grid-template-columns: 1fr;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }
}

/* 修改筛选按钮样式 */
.filter-btn {
  transition: all 0.3s;
}

:deep(.ant-radio-button-wrapper-checked) {
  background: #fa8c16 !important;
  border-color: #fa8c16 !important;
  color: white !important;
}

:deep(.ant-radio-button-wrapper-checked)::before {
  background-color: #fa8c16 !important;
}

:deep(.ant-radio-button-wrapper:hover) {
  color: #fa8c16;
}

:deep(.ant-input-search .ant-input:focus),
:deep(.ant-input-search .ant-input:hover) {
  border-color: #fa8c16;
}

:deep(.ant-input-search .ant-input-search-button) {
  background-color: #fa8c16;
  border-color: #fa8c16;
}

:deep(.ant-input-search .ant-input-search-button:hover) {
  background-color: #fd9a30;
  border-color: #fd9a30;
}
</style>