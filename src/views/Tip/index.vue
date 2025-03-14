<template>
  <div class="tips-list-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="breadcrumb">
        <a @click="goToHome">首页</a>
        <right-outlined class="separator" />
        <span>烹饪小贴士</span>
      </div>
      <h1 class="page-title">烹饪小贴士</h1>
      <p class="page-desc">提升烹饪技巧，让美食制作更简单、更健康、更美味</p>
    </div>

    <!-- 分类筛选区域 -->
    <div class="filter-section">
      <div class="filter-title">按类别筛选：</div>
      <div class="filter-tags">
        <a-tag
            v-for="tag in tipTags"
            :key="tag"
            :color="activeTag === tag ? '#fa8c16' : ''"
            @click="filterTipsByTag(tag)"
            class="filter-tag"
        >
          {{ tag }}
        </a-tag>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <a-input-search
          v-model:value="searchQuery"
          placeholder="搜索烹饪技巧、食材处理方法..."
          class="search-input"
          @search="handleSearch"
          :style="{ width: '100%' }"
      >
        <template #enterButton>
          <a-button type="primary" :icon="h(SearchOutlined)">
            搜索
          </a-button>
        </template>
      </a-input-search>
    </div>

    <!-- 内容区域 -->
    <div class="tips-content">
      <!-- 筛选结果提示 -->
      <div class="result-info" v-if="filteredTips.length > 0">
        <span>共找到 <b>{{ filteredTips.length }}</b> 个烹饪小贴士</span>
        <a-button type="link" @click="resetFilters" v-if="isFiltering">
          <reload-outlined /> 重置筛选
        </a-button>
      </div>
      <div class="empty-result" v-else>
        <empty-outlined />
        <p>没有找到符合条件的小贴士</p>
        <a-button type="primary" @click="resetFilters">
          重置筛选
        </a-button>
      </div>

      <!-- 小贴士列表 -->
      <div class="tips-grid">
        <div
            class="tip-card"
            v-for="tip in filteredTips"
            :key="tip.id"
            @click="viewTipDetail(tip.id)"
        >
          <div class="tip-icon">
            <component :is="getTipIcon(tip.category)" />
          </div>
          <div class="tip-content">
            <h3 class="tip-title">{{ tip.title }}</h3>
            <p class="tip-desc">{{ tip.description }}</p>
            <div class="tip-footer">
              <span class="tip-category">{{ tip.category }}</span>
              <div class="tip-meta">
                <span class="tip-likes">
                  <heart-outlined /> {{ tip.likes }} 人觉得有用
                </span>
                <span class="tip-date">
                  <calendar-outlined /> {{ formatDate(tip.publishDate) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="filteredTips.length > 0">
        <a-pagination
            v-model:current="currentPage"
            :total="filteredTips.length"
            :pageSize="pageSize"
            @change="handlePageChange"
            showQuickJumper
        />
      </div>
    </div>

    <!-- 返回顶部 -->
    <a-back-top>
      <div class="back-top">
        <up-outlined />
      </div>
    </a-back-top>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import {
  RightOutlined,
  HeartOutlined,
  CalendarOutlined,
  SearchOutlined,
  ReloadOutlined,
  UpOutlined,
  FireOutlined,
  BulbOutlined,
  StarOutlined,
  InboxOutlined
} from '@ant-design/icons-vue'

// 设置中文语言
dayjs.locale('zh-cn')

const router = useRouter()
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(12)
const activeTag = ref('全部')

// 定义小贴士分类标签
const tipTags = ref(['全部', '食材处理', '烹饪技巧', '厨房管理', '营养搭配'])

// 小贴士数据 - 在实际应用中可能来自API
const cookingTips = ref([
  {
    id: 1,
    title: '正确处理蔬菜',
    description: '如何洗净、切割和保存蔬菜以保持最佳口感和营养。先用流动水冲洗蔬菜，再浸泡5分钟去除农药残留。高叶菜如生菜需要拆开单片清洗，根茎类需要刷洗。',
    category: '食材处理',
    likes: 328,
    publishDate: '2024-01-15'
  },
  {
    id: 2,
    title: '掌握火候技巧',
    description: '了解不同食材的最佳烹饪温度和时间，做出完美菜品。肉类煎制前要回温，鱼类宜用中小火慢煎保持鲜嫩。不同肉类的烹饪温度和时间各有讲究，掌握这些基础能让菜肴更加美味。',
    category: '烹饪技巧',
    likes: 256,
    publishDate: '2024-01-18'
  },
  {
    id: 3,
    title: '高效厨房管理',
    description: '如何规划烹饪流程，节省时间并保持厨房整洁。建立"边做边清洁"的习惯，准备食材时按烹饪顺序排列。合理规划厨房空间，常用工具放在触手可及的位置，提高烹饪效率。',
    category: '厨房管理',
    likes: 187,
    publishDate: '2024-01-20'
  },
  {
    id: 4,
    title: '调味品搭配秘诀',
    description: '掌握调味品的平衡搭配，让家常菜提升到餐厅水准。酸甜苦辣咸五味平衡是提升菜品层次感的关键。了解各种香料特性，中式炒菜推荐姜蒜配合，西式烤肉推荐百里香与迷迭香。',
    category: '营养搭配',
    likes: 243,
    publishDate: '2024-01-22'
  },
  {
    id: 5,
    title: '油温判断方法',
    description: '学会不用温度计也能准确判断油温。筷尖入油有气泡缓慢上升是中温，筷尖周围气泡快速上升是高温。也可以用面粉测试：撒入少许面粉，浮在表面为低温，沉下去冒小泡为中温，立即变色为高温。',
    category: '烹饪技巧',
    likes: 215,
    publishDate: '2024-01-25'
  },
  {
    id: 6,
    title: '食材保鲜延长法',
    description: '几种简单方法让你的蔬菜水果保鲜期延长一倍。将绿叶菜用厨房纸包裹后放入保鲜袋，排出空气后冷藏。不同蔬果需要不同的存储温度，掌握这些技巧可以减少食材浪费。',
    category: '食材处理',
    likes: 198,
    publishDate: '2024-01-27'
  },
  {
    id: 7,
    title: '肉类嫩化处理',
    description: '几种家庭常用的肉类嫩化方法，让您轻松做出嫩滑的肉质。使用菠萝、猕猴桃等含有蛋白酶的水果腌制牛肉，也可以用小苏打腌制猪肉。切肉时注意横切肌纤维，可减少韧性。',
    category: '食材处理',
    likes: 176,
    publishDate: '2024-01-30'
  },
  {
    id: 8,
    title: '刀工基础入门',
    description: '掌握基础刀工技巧，提高切菜效率和安全性。切菜前确保刀具锋利，使用适当大小的砧板，保持手指弯曲避免切到。练习切丝、切片和切丁三种基本切法，从慢到快逐步提升。',
    category: '烹饪技巧',
    likes: 221,
    publishDate: '2024-02-02'
  },
  {
    id: 9,
    title: '厨余垃圾减量技巧',
    description: '如何减少厨房垃圾并充分利用食材。蔬菜根茎和外叶可用于熬汤，剩余的米饭可以做炒饭或粥。建立计划性购物和烹饪习惯，减少食材浪费，对环境和家庭预算都有好处。',
    category: '厨房管理',
    likes: 145,
    publishDate: '2024-02-05'
  },
  {
    id: 10,
    title: '常见蔬菜搭配指南',
    description: '了解哪些蔬菜可以一起烹饪，哪些应分开处理。绿叶菜适合快炒，根茎类适合慢炖。蔬菜的营养成分和烹饪时间各不相同，合理搭配可以保留最多营养并提升口感。',
    category: '营养搭配',
    likes: 189,
    publishDate: '2024-02-08'
  },
  {
    id: 11,
    title: '煲汤技巧大全',
    description: '如何煲出清甜鲜美的汤品。选择合适的汤锅，掌握火候变化，了解不同食材的下锅顺序。了解特殊食材的处理方法，如何去除异味，如何保持原汁原味。',
    category: '烹饪技巧',
    likes: 234,
    publishDate: '2024-02-10'
  },
  {
    id: 12,
    title: '食材替代方案',
    description: '当缺少特定食材时的替代选择。学会灵活替换调料和主料，依据口感和烹饪特性找到合适的替代品。这些技巧帮助您在食材不足时依然能够完成美味料理。',
    category: '食材处理',
    likes: 167,
    publishDate: '2024-02-12'
  },
  {
    id: 13,
    title: '季节性饮食指南',
    description: '根据季节选择最新鲜、最有营养的食材。春季选嫩芽新叶，夏季选瓜果蔬菜，秋季选坚果和根茎，冬季选温补食材。顺应自然规律，既健康又经济。',
    category: '营养搭配',
    likes: 213,
    publishDate: '2024-02-15'
  },
  {
    id: 14,
    title: '厨房器具维护',
    description: '如何正确清洁和保养厨房工具，延长使用寿命。铁锅需要定期开油保养，木制工具需防止长时间浸水，刀具需保持干燥防止生锈。定期维护可以保证烹饪效果和食品安全。',
    category: '厨房管理',
    likes: 156,
    publishDate: '2024-02-18'
  },
  {
    id: 15,
    title: '提升菜肴颜色技巧',
    description: '如何让菜肴颜色更加诱人。通过控制烹饪时间保持蔬菜鲜亮，善用天然食材增色，如红椒、胡萝卜、菠菜等。摆盘时注意色彩搭配，让菜品更加赏心悦目。',
    category: '烹饪技巧',
    likes: 187,
    publishDate: '2024-02-20'
  },
  {
    id: 16,
    title: '蒸菜完美诀窍',
    description: '掌握蒸菜的关键技巧，保留食材原味和营养。水开后再上锅，控制好蒸制时间，学会判断不同食材的最佳蒸制时长。蒸菜是一种健康的烹饪方式，适合各种食材。',
    category: '烹饪技巧',
    likes: 209,
    publishDate: '2024-02-23'
  },
  {
    id: 17,
    title: '冰箱收纳整理法',
    description: '如何科学整理冰箱，延长食材保鲜期。了解冰箱不同区域的温度特点，合理安排食材位置。使用透明收纳盒分类存放，标记日期避免过期。定期清理，保持冰箱清洁和效率。',
    category: '厨房管理',
    likes: 172,
    publishDate: '2024-02-26'
  },
  {
    id: 18,
    title: '健康减盐烹饪法',
    description: '在不影响口感的情况下减少盐分摄入。利用草本香料、柑橘汁、醋等增强风味，降低对盐的依赖。了解不同食材的原味特点，减少调味品用量，培养对食物本真味道的欣赏。',
    category: '营养搭配',
    likes: 193,
    publishDate: '2024-02-29'
  },
  {
    id: 19,
    title: '糖醋平衡秘诀',
    description: '如何在菜品中完美平衡酸甜口味。使用不同种类的糖和醋，了解它们的特性和适用场景。掌握先尝后调的方法，循序渐进调整口味，不同菜系对糖醋平衡有不同要求。',
    category: '烹饪技巧',
    likes: 226,
    publishDate: '2024-03-03'
  },
  {
    id: 20,
    title: '一锅多用烹饪法',
    description: '如何高效利用同一口锅完成多道菜肴。了解食材的烹饪顺序，先炒耗时长的硬质食材，后放易熟的嫩叶菜。掌握分批次取出和加工的技巧，让一锅菜有多种口感和风味。',
    category: '厨房管理',
    likes: 188,
    publishDate: '2024-03-06'
  }
])
// 根据分类获取相应的图标
const getTipIcon = (category) => {
  const iconMap = {
    '食材处理': BulbOutlined,
    '烹饪技巧': FireOutlined,
    '厨房管理': InboxOutlined,
    '营养搭配': StarOutlined
  }
  return iconMap[category] || BulbOutlined
}

// 格式化日期
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY年MM月DD日')
}

// 筛选小贴士
const filterTipsByTag = (tag) => {
  activeTag.value = tag
  currentPage.value = 1 // 重置到第一页
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
}

// 重置筛选条件
const resetFilters = () => {
  activeTag.value = '全部'
  searchQuery.value = ''
  currentPage.value = 1
}

// 处理页面变化
const handlePageChange = (page) => {
  currentPage.value = page
  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 查看小贴士详情
const viewTipDetail = (id) => {
  router.push(`/tips/${id}`)
}

// 返回首页
const goToHome = () => {
  router.push('/')
}

// 计算属性：是否处于筛选状态
const isFiltering = computed(() => {
  return activeTag.value !== '全部' || searchQuery.value.trim() !== ''
})

// 计算属性：根据筛选条件获取小贴士列表
const filteredTips = computed(() => {
  let results = cookingTips.value

  // 根据标签筛选
  if (activeTag.value !== '全部') {
    results = results.filter(tip => tip.category === activeTag.value)
  }

  // 根据搜索关键词筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    results = results.filter(tip =>
        tip.title.toLowerCase().includes(query) ||
        tip.description.toLowerCase().includes(query)
    )
  }

  return results
})

// 计算属性：当前页显示的小贴士
const paginatedTips = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  return filteredTips.value.slice(startIndex, startIndex + pageSize.value)
})
</script>

<style scoped>
.tips-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  background: #f5f5f7;
}

/* 页面标题区域 */
.page-header {
  margin-bottom: 24px;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.breadcrumb {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  margin-bottom: 16px;
}

.breadcrumb a {
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
}

.breadcrumb a:hover {
  color: #fa8c16;
}

.separator {
  margin: 0 8px;
  font-size: 10px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 8px 0;
}

.page-desc {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  margin: 0;
}

/* 筛选区域 */
.filter-section {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-title {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-right: 12px;
  white-space: nowrap;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 16px;
  transition: all 0.3s;
}

.filter-tag:hover {
  color: #fa8c16;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 24px;
}

.search-input :deep(.ant-btn-primary) {
  background-color: #fa8c16;
  border-color: #fa8c16;
}

.search-input :deep(.ant-btn-primary:hover) {
  background-color: #fd9a30;
  border-color: #fd9a30;
}

/* 内容区域 */
.tips-content {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.result-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  color: rgba(0, 0, 0, 0.65);
}

.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  color: rgba(0, 0, 0, 0.45);
}

.empty-result :deep(.anticon) {
  font-size: 48px;
  margin-bottom: 16px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
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
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
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
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tip-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.tip-category {
  color: #fa8c16;
  background: rgba(250, 140, 22, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  width: fit-content;
}

.tip-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.tip-likes, .tip-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* 返回顶部按钮 */
.back-top {
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 50%;
  background-color: #fa8c16;
  color: #fff;
  text-align: center;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(250, 140, 22, 0.3);
}

/* 响应式布局 */
@media (max-width: 992px) {
  .tips-grid {
    grid-template-columns: 1fr;
  }

  .filter-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 20px;
  }

  .page-desc {
    font-size: 14px;
  }

  .tip-footer {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .page-header, .filter-section, .tips-content {
    padding: 16px;
  }

  .tip-meta {
    flex-direction: column;
    gap: 4px;
  }
}
</style>