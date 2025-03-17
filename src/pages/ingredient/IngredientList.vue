<template>
  <div class="ingredients-list-container">
    <!-- 自定义面包屑导航 -->
    <custom-breadcrumb />

    <!-- 页面标题 -->
    <div class="page-header">
      <div class="page-title-wrapper">
        <h1 class="page-title">食材库</h1>
        <p class="page-desc">探索美食的基础，发现食材的魅力</p>
      </div>
      <!-- 添加一个装饰性背景元素 -->
      <div class="header-decoration">
        <img src="https://cdn.jsdelivr.net/gh/ant-design/ant-design-icons@master/packages/icons-svg/svg/outlined/fire.svg" alt="" aria-hidden="true" />
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <a-input-search
            v-model:value="searchQuery"
            placeholder="搜索食材名称、属性..."
            enter-button
            class="search-input"
            @search="handleSearch"
        >
          <template #prefix>
            <search-outlined class="search-icon" />
          </template>
        </a-input-search>
      </div>
      <div class="search-filters">
        <a-select
            v-model:value="seasonFilter"
            placeholder="按季节筛选"
            class="filter-select"
        >
          <template #suffixIcon><calendar-outlined /></template>
          <a-select-option value="">全部季节</a-select-option>
          <a-select-option value="spring">
            <span class="select-option-content">
              <leaf-outlined class="season-icon spring" /> 春季
            </span>
          </a-select-option>
          <a-select-option value="summer">
            <span class="select-option-content">
              <fire-outlined class="season-icon summer" /> 夏季
            </span>
          </a-select-option>
          <a-select-option value="autumn">
            <span class="select-option-content">
              <fall-outlined class="season-icon autumn" /> 秋季
            </span>
          </a-select-option>
          <a-select-option value="winter">
            <span class="select-option-content">
              <snow-outlined class="season-icon winter" /> 冬季
            </span>
          </a-select-option>
        </a-select>
        <a-select
            v-model:value="sortBy"
            placeholder="排序方式"
            class="filter-select"
        >
          <template #suffixIcon><sort-ascending-outlined /></template>
          <a-select-option value="popular">
            <fire-filled class="sort-icon" /> 按热度排序
          </a-select-option>
          <a-select-option value="az">
            <sort-ascending-outlined class="sort-icon" /> 按名称排序
          </a-select-option>
          <a-select-option value="nutrition">
            <medicine-box-outlined class="sort-icon" /> 按营养价值排序
          </a-select-option>
        </a-select>
      </div>
    </div>

    <!-- 食材分类列表 -->
    <div class="categories-section section-card">
      <div class="section-header">
        <h2 class="section-title">
          <unordered-list-outlined class="section-icon" /> 食材分类
        </h2>
        <a-tooltip title="浏览所有分类">
          <a-button type="text" class="more-button">
            <app-store-outlined />
          </a-button>
        </a-tooltip>
      </div>
      <div class="category-cards">
        <router-link
            v-for="category in categories"
            :key="category.id"
            :to="`/ingredient/category/${category.id}`"
            class="category-card"
        >
          <div class="category-icon-wrapper">
            <component :is="category.icon" class="category-icon" />
          </div>
          <div class="category-info">
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-count">{{ category.count }}种食材</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 当季食材 -->
    <div class="seasonal-section section-card">
      <div class="section-header">
        <h2 class="section-title">
          <calendar-outlined class="section-icon" /> 当季食材
          <a-tag class="current-season-tag">秋季精选</a-tag>
        </h2>
        <router-link to="/ingredient/seasonal" class="view-all-link">
          查看全部 <right-outlined />
        </router-link>
      </div>
      <div class="seasonal-ingredients">
        <div
            v-for="ingredient in seasonalIngredients"
            :key="ingredient.id"
            class="seasonal-card-wrapper"
        >
          <router-link
              :to="`/ingredient/${ingredient.id}`"
              class="ingredient-card"
          >
            <div class="ingredient-image">
              <img :src="ingredient.image" :alt="ingredient.name" loading="lazy" />
              <div class="ingredient-bookmark">
                <heart-outlined class="bookmark-icon" />
              </div>
            </div>
            <div class="ingredient-info">
              <h3 class="ingredient-name">{{ ingredient.name }}</h3>
              <p class="ingredient-desc">{{ ingredient.description }}</p>
              <div class="ingredient-meta">
                <a-tag class="season-tag">
                  <calendar-outlined /> {{ ingredient.season }}
                </a-tag>
                <span class="ingredient-nutrition">
                  <medicine-box-outlined /> 营养丰富
                </span>
              </div>
            </div>
            <div class="ingredient-recipes">
              <cookbook-outlined /> 相关菜谱: 12+
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 食材索引 -->
    <div class="index-section section-card">
      <div class="section-header">
        <h2 class="section-title">
          <font-size-outlined class="section-icon" /> 食材索引
        </h2>
        <div class="index-controls">
          <a-radio-group v-model:value="indexView" button-style="solid" size="small">
            <a-radio-button value="az">首字母</a-radio-button>
            <a-radio-button value="category">分类</a-radio-button>
          </a-radio-group>
        </div>
      </div>

      <div class="letter-index-wrapper">
        <div class="letter-index">
          <a-button
              v-for="letter in alphabet"
              :key="letter"
              class="letter-btn"
              :class="{ active: activeLetter === letter }"
              @click="filterByLetter(letter)"
          >
            {{ letter }}
          </a-button>
          <a-button class="letter-btn all-btn" @click="filterByLetter('全部')">
            全部
          </a-button>
        </div>
      </div>

      <div class="indexed-ingredients">
        <a-spin :spinning="loading" tip="正在加载美味食材...">
          <transition-group name="ingredient-list" tag="div" class="ingredients-grid">
            <router-link
                v-for="ingredient in filteredIngredients"
                :key="ingredient.id"
                :to="`/ingredient/${ingredient.id}`"
                class="ingredient-item"
            >
              <div class="ingredient-thumb-wrapper">
                <img :src="ingredient.image" :alt="ingredient.name" class="ingredient-thumb" loading="lazy" />
                <div class="ingredient-hover-info">
                  <eye-outlined /> 查看详情
                </div>
              </div>
              <span class="ingredient-name">{{ ingredient.name }}</span>
              <span class="ingredient-letter">{{ ingredient.letter }}</span>
            </router-link>
          </transition-group>
          <a-empty
              v-if="filteredIngredients.length === 0"
              description="没有找到匹配的食材"
              class="empty-state"
          >
            <template #image>
              <img-not-found-outlined style="font-size: 60px; color: #f6925c" />
            </template>
            <a-button @click="resetFilters">重置筛选</a-button>
          </a-empty>
        </a-spin>
      </div>
    </div>

    <!-- 推荐搭配 -->
    <div class="pairing-section section-card">
      <div class="section-header">
        <h2 class="section-title">
          <interaction-outlined class="section-icon" /> 食材搭配推荐
        </h2>
      </div>
      <div class="pairing-cards">
        <div v-for="(pair, index) in foodPairings" :key="index" class="pairing-card">
          <div class="pairing-items">
            <div class="pairing-item">
              <img :src="pair.item1.image" :alt="pair.item1.name" class="pairing-img" loading="lazy" />
              <span class="pairing-name">{{ pair.item1.name }}</span>
            </div>
            <div class="pairing-plus">
              <plus-outlined />
            </div>
            <div class="pairing-item">
              <img :src="pair.item2.image" :alt="pair.item2.name" class="pairing-img" loading="lazy" />
              <span class="pairing-name">{{ pair.item2.name }}</span>
            </div>
          </div>
          <div class="pairing-desc">
            <check-circle-outlined class="pairing-check" /> {{ pair.description }}
          </div>
        </div>
      </div>
    </div>

    <!-- 分页控件 -->
    <div class="pagination-container">
      <a-pagination
          v-model:current="currentPage"
          :total="totalIngredients"
          :pageSize="pageSize"
          show-quick-jumper
          @change="handlePageChange"
      />
    </div>

    <!-- 食材库底部信息区 -->
    <div class="ingredients-footer">
      <div class="footer-card">
        <bulb-outlined class="footer-icon" />
        <div class="footer-content">
          <h3>季节性饮食的好处</h3>
          <p>选择当季食材不仅能获得最佳味道，还能提高营养摄入，支持本地农业生产。</p>
        </div>
      </div>
      <div class="footer-card">
        <experiment-outlined class="footer-icon" />
        <div class="footer-content">
          <h3>科学搭配更营养</h3>
          <p>合理搭配不同类别的食材，可以提高营养素的吸收率，让饮食更均衡健康。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  RightOutlined,
  HomeOutlined,
  AppleOutlined,
  ShoppingOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  FireOutlined,
  FireFilled,
  HeartOutlined,
  MedicineBoxOutlined,
  SortAscendingOutlined,
  FontSizeOutlined,
  EyeOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  ExperimentOutlined,
  InteractionOutlined,
} from '@ant-design/icons-vue';
import CustomBreadcrumb from "@/components/common/CustomBreadcrumb.vue";

// 模拟一个自定义图标组件
const FallOutlined = {
  template: '<span class="anticon custom-icon"><svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em"><path d="M557.2 442.2c3.8-1.3 7.9-1.9 12-1.9 21.1 0 38.3 17.1 38.3 38.3a38 38 0 01-11.5 27.3l-112 112c-38.8 38.8-101.7 38.8-140.5 0-21.5-21.5-31.5-49.9-30.1-78l63.9-63.9c6.4-6.4 15-9.9 24-9.9 18.9 0 34.2 15.3 34.2 34.2 0 9-3.5 17.6-9.9 24l-45.1 45.1a14.5 14.5 0 0010.3 24.8c4.8 0 9.3-2.3 12.1-6.2l53.2-70.9c6.2-8.3 15.9-13.1 26.3-13.1 9.6 0 18.8 4.2 25.1 11.3l37.7 41.1-7.5 7.5a9.9 9.9 0 000 14 9.9 9.9 0 0014 0l7.6-7.6 13.8 15.1-7.5 7.5a9.9 9.9 0 000 14 9.9 9.9 0 0014 0l7.6-7.6 10.4 11.4-7.5 7.5a9.9 9.9 0 000 14 9.9 9.9 0 0014 0l7.6-7.6 13 14.2c20.6 22.5 19.9 57.3-2.1 78.9L573 654.8c-24.7 23.4-58.8 35.8-94 33.6-26.2-1.6-50.1-11.6-69.2-28.2a138.4 138.4 0 01-28.5-36.3l-19.9-39.6-78 35.9a30.09 30.09 0 01-39.9-15.9 30.09 30.09 0 0115.9-39.9L514 435.6a38.16 38.16 0 0143.2 6.6z" fill="currentColor"></path></svg></span>'
};

const router = useRouter();
const loading = ref(false);
const searchQuery = ref('');
const seasonFilter = ref('');
const sortBy = ref('popular');
const currentPage = ref(1);
const pageSize = ref(24);
const activeLetter = ref('全部');
const indexView = ref('az');

// 字母表索引
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// 分类数据
const categories = reactive([
  {
    id: 1,
    name: '蔬菜水果',
    count: 68,
    imageUrl: 'https://img.icons8.com/fluency/96/vegetables-basket.png'
  },
  {
    id: 2,
    name: '肉禽蛋类',
    count: 42,
    imageUrl: 'https://img.icons8.com/fluency/96/beef.png'
  },
  {
    id: 3,
    name: '海鲜水产',
    count: 36,
    imageUrl: 'https://img.icons8.com/fluency/96/fish-food.png'
  },
  {
    id: 4,
    name: '调味品',
    count: 28,
    imageUrl: 'https://img.icons8.com/fluency/96/salt-and-pepper.png'
  },
  {
    id: 5,
    name: '米面豆乳',
    count: 32,
    imageUrl: 'https://img.icons8.com/fluency/96/rice-bowl.png'
  },
  {
    id: 6,
    name: '干果零食',
    count: 24,
    imageUrl: 'https://img.icons8.com/fluency/96/trail-mix.png'
  }
]);

// 季节性食材数据 - 扩展更多细节
const seasonalIngredients = reactive([
  {
    id: '1',
    name: '南瓜',
    image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=800&auto=format&q=80',
    description: '营养丰富，适合煲汤和烘焙',
    season: '秋季',
    nutritionScore: 9.2,
    cookingMethods: ['蒸', '煮', '烤', '炒'],
    popularity: 4.8
  },
  {
    id: '2',
    name: '栗子',
    image: 'https://images.unsplash.com/photo-1508700629452-7969ea21903c?w=800&auto=format&q=80',
    description: '香甜可口，可煮可烤',
    season: '秋季',
    nutritionScore: 8.6,
    cookingMethods: ['煮', '烤', '炖'],
    popularity: 4.7
  },
  {
    id: '3',
    name: '甜椒',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&q=80',
    description: '营养丰富，颜色鲜艳',
    season: '秋季',
    nutritionScore: 8.9,
    cookingMethods: ['炒', '炖', '烤', '生食'],
    popularity: 4.6
  },
  {
    id: '4',
    name: '葡萄',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&auto=format&q=80',
    description: '鲜甜多汁，营养丰富',
    season: '秋季',
    nutritionScore: 9.0,
    cookingMethods: ['生食', '制酒', '制果酱'],
    popularity: 4.9
  }
]);

// 食材搭配推荐数据
const foodPairings = reactive([
  {
    item1: {
      name: '番茄',
      image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=800&auto=format&q=80'
    },
    item2: {
      name: '罗勒',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&q=80'
    },
    description: '经典意式搭配，酸甜与香草的完美结合'
  },
  {
    item1: {
      name: '三文鱼',
      image: 'https://images.unsplash.com/photo-1501560379-5951f586a175?w=800&auto=format&q=80'
    },
    item2: {
      name: '柠檬',
      image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=800&auto=format&q=80'
    },
    description: '提升鲜味，中和油腻感，增添清新口感'
  },
  {
    item1: {
      name: '南瓜',
      image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=800&auto=format&q=80'
    },
    item2: {
      name: '肉桂',
      image: 'https://images.unsplash.com/photo-1611045721007-4c70e9bbf2d3?w=800&auto=format&q=80'
    },
    description: '秋季经典组合，温暖香甜，适合甜点和汤品'
  }
]);

// 扩展的食材数据
const allIngredients = reactive([
  {
    id: '1',
    name: '南瓜',
    image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=800&auto=format&q=80',
    description: '营养丰富，适合煲汤和烘焙',
    season: '秋季',
    letter: 'N',
    categoryId: 1,
  },
  {
    id: '2',
    name: '栗子',
    image: 'https://images.unsplash.com/photo-1508700629452-7969ea21903c?w=800&auto=format&q=80',
    description: '香甜可口，可煮可烤',
    season: '秋季',
    letter: 'L',
    categoryId: 6,
  },
  {
    id: '3',
    name: '甜椒',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&q=80',
    description: '营养丰富，颜色鲜艳',
    season: '秋季',
    letter: 'T',
    categoryId: 1,
  },
  {
    id: '4',
    name: '葡萄',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&auto=format&q=80',
    description: '鲜甜多汁，营养丰富',
    season: '秋季',
    letter: 'P',
    categoryId: 1,
  },
  {
    id: '5',
    name: '梨',
    image: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?w=800&auto=format&q=80',
    description: '香甜多汁，生津止渴',
    season: '秋季',
    letter: 'L',
    categoryId: 1,
  },
  {
    id: '6',
    name: '红薯',
    image: 'https://images.unsplash.com/photo-1596097635121-14b38c7c658f?w=800&auto=format&q=80',
    description: '香甜软糯，营养丰富',
    season: '秋季',
    letter: 'H',
    categoryId: 1,
  },
  {
    id: '7',
    name: '菠菜',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&q=80',
    description: '绿叶菜，富含铁质',
    season: '秋季',
    letter: 'B',
    categoryId: 1,
  },
  {
    id: '8',
    name: '柿子',
    image: 'https://images.unsplash.com/photo-1606926694086-5624f1ccc7c1?w=800&auto=format&q=80',
    description: '甜脆爽口，秋季水果',
    season: '秋季',
    letter: 'S',
    categoryId: 1,
  }
]);

// 过滤后的食材列表
const filteredIngredients = computed(() => {
  let filtered = [...allIngredients];

  // 按字母筛选
  if (activeLetter.value !== '全部') {
    filtered = filtered.filter(item => item.letter === activeLetter.value);
  }

  // 按季节筛选
  if (seasonFilter.value) {
    const seasonMap = {
      'spring': '春季',
      'summer': '夏季',
      'autumn': '秋季',
      'winter': '冬季'
    };
    filtered = filtered.filter(item => item.season === seasonMap[seasonFilter.value]);
  }

  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }

  // 排序
  if (sortBy.value === 'az') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy.value === 'nutrition') {
    // 模拟按营养价值排序（实际应用中应该有真实数据）
    filtered.sort((a, b) => {
      const nutritionA = a.nutritionScore || Math.random() * 10;
      const nutritionB = b.nutritionScore || Math.random() * 10;
      return nutritionB - nutritionA;
    });
  }

  return filtered;
});

// 总食材数量
const totalIngredients = computed(() => filteredIngredients.value.length);

// 页面加载
onMounted(async () => {
  loading.value = true;

  try {
    // 实际应用中这里应该从API获取数据
    // const response = await fetch('/api/ingredients');
    // const data = await response.json();
    // allIngredients.splice(0, allIngredients.length, ...data);

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800));

  } catch (error) {
    console.error('获取食材列表失败:', error);
  } finally {
    loading.value = false;
  }
});

// 按字母筛选
const filterByLetter = (letter) => {
  activeLetter.value = letter;
  currentPage.value = 1;
};

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1;
};

// 页码变化处理
const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = '';
  seasonFilter.value = '';
  sortBy.value = 'popular';
  activeLetter.value = '全部';
  currentPage.value = 1;
};
</script>

<style scoped>
.ingredients-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  color: #333;
}

/* 面包屑导航样式 */
.breadcrumb-wrapper {
  margin-bottom: 16px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.bread-link {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 页面标题样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  padding: 10px 20px;
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,247,240,0.9) 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(246, 146, 92, 0.08);
}

.page-title-wrapper {
  z-index: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
  background: linear-gradient(45deg, #333, #f6925c);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
}

.page-desc {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  max-width: 500px;
  line-height: 1.5;
}

.header-decoration {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  opacity: 0.2;
}

/* 搜索部分样式 */
.search-section {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
  align-items: center;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.search-input-wrapper {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-icon {
  color: rgba(0, 0, 0, 0.45);
}

.search-filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  min-width: 140px;
}

.select-option-content {
  display: flex;
  align-items: center;
  gap: 6px;
}

.season-icon {
  font-size: 16px;
}

.season-icon.spring {
  color: #52c41a;
}

.season-icon.summer {
  color: #f5222d;
}

.season-icon.autumn {
  color: #fa8c16;
}

.season-icon.winter {
  color: #1890ff;
}

.sort-icon {
  margin-right: 6px;
}

/* 通用区域卡片样式 */
.section-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding-bottom: 12px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  color: #f6925c;
}

.view-all-link {
  color: #f6925c;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.view-all-link:hover {
  color: #ff8c5a;
  transform: translateX(3px);
}

.more-button {
  color: #f6925c;
}

/* 食材分类区域样式 */
.category-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.category-card {
  background: white;
  border-radius: 10px;
  padding: 20px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #f6925c, #ffb380);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 20px rgba(246, 146, 92, 0.12);
}

.category-card:hover::before {
  transform: translateY(0);
}

.category-icon-wrapper {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 247, 240, 1) 0%, rgba(255, 236, 224, 1) 100%);
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.category-card:hover .category-icon-wrapper {
  transform: scale(1.05);
  background: linear-gradient(135deg, rgba(246, 146, 92, 0.1) 0%, rgba(246, 146, 92, 0.2) 100%);
}

.category-icon {
  font-size: 32px;
  color: #f6925c;
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.category-count {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  margin: 0;
}

/* 当季食材区域样式 */
.seasonal-ingredients {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 16px;
}

.seasonal-card-wrapper {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.seasonal-card-wrapper:hover {
  transform: translateY(-6px);
}

.ingredient-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.ingredient-card:hover {
  box-shadow: 0 10px 24px rgba(246, 146, 92, 0.15);
}

.ingredient-image {
  height: 180px;
  overflow: hidden;
  position: relative;
}

.ingredient-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.ingredient-card:hover .ingredient-image img {
  transform: scale(1.08);
}

.ingredient-bookmark {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ingredient-bookmark:hover {
  background: white;
  transform: scale(1.1);
}

.bookmark-icon {
  color: #f6925c;
  font-size: 16px;
}

.ingredient-info {
  padding: 16px;
  flex-grow: 1;
}

.ingredient-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
}

.ingredient-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 12px;
  line-height: 1.5;
}

.ingredient-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.ingredient-nutrition {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  gap: 4px;
}

.ingredient-recipes {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  padding: 8px 16px;
  background: rgba(246, 146, 92, 0.05);
  display: flex;
  align-items: center;
  gap: 6px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.current-season-tag {
  margin-left: 8px;
  font-size: 12px;
  background-color: rgba(255, 153, 102, 0.1) !important;
  color: #f6925c !important;
  border-color: transparent !important;
  border-radius: 16px;
  font-weight: normal;
}

.season-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: rgba(255, 153, 102, 0.1) !important;
  color: #f6925c !important;
  border-color: transparent !important;
  border-radius: 16px;
  padding: 0 10px;
}

/* 食材索引区域样式 */
.index-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.letter-index-wrapper {
  background: rgba(246, 146, 92, 0.05);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 24px;
}

.letter-index {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.letter-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border-color: rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
}

.letter-btn:hover {
  color: #f6925c;
  border-color: #f6925c;
}

.letter-btn.active {
  background-color: #f6925c;
  color: white;
  border-color: #f6925c;
}

.all-btn {
  min-width: 52px;
}

.ingredients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.ingredient-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  text-align: center;
  transition: all 0.3s ease;
}

.ingredient-item:hover {
  transform: translateY(-6px);
}

.ingredient-thumb-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  margin-bottom: 10px;
}

.ingredient-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.ingredient-hover-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(246, 146, 92, 0.9);
  color: white;
  font-size: 12px;
  padding: 4px 0;
  opacity: 0;
  transform: translateY(100%);
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.ingredient-item:hover .ingredient-thumb {
  transform: scale(1.08);
}

.ingredient-item:hover .ingredient-hover-info {
  opacity: 1;
  transform: translateY(0);
}

.ingredient-letter {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 22px;
  height: 22px;
  background: #f6925c;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

/* 食材搭配推荐区域 */
.pairing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.pairing-card {
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.pairing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(246, 146, 92, 0.1);
}

.pairing-items {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 16px;
}

.pairing-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.pairing-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pairing-name {
  font-weight: 500;
  font-size: 15px;
}

.pairing-plus {
  color: #f6925c;
  font-size: 20px;
}

.pairing-desc {
  padding: 12px;
  background: rgba(246, 146, 92, 0.05);
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pairing-check {
  color: #52c41a;
}

/* 分页控件样式 */
.pagination-container {
  margin-top: 40px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}

/* 空状态样式 */
.empty-state {
  padding: 40px 0;
}

/* 页面底部信息区 */
.ingredients-footer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 40px;
  margin-bottom: 20px;
}

.footer-card {
  background: linear-gradient(135deg, rgba(255, 247, 240, 1) 0%, rgba(255, 236, 224, 1) 100%);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.footer-icon {
  font-size: 24px;
  color: #f6925c;
  margin-top: 4px;
}

.footer-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  margin-top: 0;
}

.footer-content p {
  font-size: 14px;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.65);
  margin: 0;
}

/* 列表过渡动画 */
.ingredient-list-enter-active,
.ingredient-list-leave-active {
  transition: all 0.5s ease;
}

.ingredient-list-enter-from,
.ingredient-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* AntDesign样式覆盖 */
:deep(.ant-input-search-button) {
  background-color: #f6925c !important;
  border-color: #f6925c !important;
}

:deep(.ant-input-search-button:hover) {
  background-color: #ff8c5a !important;
  border-color: #ff8c5a !important;
}

:deep(.ant-input-affix-wrapper:focus),
:deep(.ant-input-affix-wrapper-focused) {
  border-color: #f6925c !important;
  box-shadow: 0 0 0 2px rgba(246, 146, 92, 0.2) !important;
}

:deep(.ant-select:not(.ant-select-disabled):hover .ant-select-selector) {
  border-color: #f6925c !important;
}

:deep(.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  border-color: #f6925c !important;
  box-shadow: 0 0 0 2px rgba(246, 146, 92, 0.2) !important;
}

:deep(.ant-pagination-item-active) {
  border-color: #f6925c !important;
}

:deep(.ant-pagination-item-active a) {
  color: #f6925c !important;
}

:deep(.ant-pagination-item:hover) {
  border-color: #f6925c !important;
}

:deep(.ant-pagination-item:hover a) {
  color: #f6925c !important;
}

:deep(.ant-pagination-next:hover .ant-pagination-item-link),
:deep(.ant-pagination-prev:hover .ant-pagination-item-link) {
  color: #f6925c !important;
  border-color: #f6925c !important;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)) {
  color: #f6925c !important;
  border-color: #f6925c !important;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before) {
  background-color: #f6925c !important;
}

:deep(.ant-btn-primary) {
  background-color: #f6925c !important;
  border-color: #f6925c !important;
}

:deep(.ant-btn-primary:hover),
:deep(.ant-btn-primary:focus) {
  background-color: #ff8c5a !important;
  border-color: #ff8c5a !important;
}

/* 响应式布局调整 */
@media (max-width: 768px) {
  .search-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-filters {
    justify-content: space-between;
  }

  .category-cards {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .seasonal-ingredients {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }

  .page-title {
    font-size: 26px;
  }

  .page-desc {
    font-size: 14px;
  }

  .ingredients-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 16px;
  }

  .pairing-cards {
    grid-template-columns: 1fr;
  }

  .letter-index {
    gap: 4px;
  }

  .letter-btn {
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
  }
}

/* 小屏幕进一步优化 */
@media (max-width: 480px) {
  .category-cards {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .ingredients-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 12px;
  }

  .ingredient-thumb-wrapper {
    width: 70px;
    height: 70px;
  }
}
/* 添加到现有CSS中 */
:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)) {
  color: white !important;
  border-color: #f6925c !important;
  background: #f6925c !important;
  box-shadow: -1px 0 0 0 #f6925c !important;
}

:deep(.ant-radio-button-wrapper:hover) {
  color: #f6925c !important;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before) {
  background-color: #f6925c !important;
}

:deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover) {
  color: white !important;
  border-color: #ff8c5a !important;
  background: #ff8c5a !important;
}
</style>