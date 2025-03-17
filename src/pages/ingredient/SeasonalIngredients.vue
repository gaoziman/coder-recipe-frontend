<template>
  <div class="seasonal-ingredients-container">
    <a-card :bordered="false" class="seasonal-card">
      <template #title>
        <div class="card-header">
          <h2 class="section-title">当季食材</h2>
          <p class="section-desc">探索当季新鲜食材，品尝最佳风味</p>
        </div>
      </template>

      <a-spin :spinning="loading">
        <a-tabs v-model:activeKey="activeTabKey">
          <a-tab-pane key="spring" tab="春季"></a-tab-pane>
          <a-tab-pane key="summer" tab="夏季"></a-tab-pane>
          <a-tab-pane key="autumn" tab="秋季"></a-tab-pane>
          <a-tab-pane key="winter" tab="冬季"></a-tab-pane>
        </a-tabs>

        <div class="ingredient-grid">
          <router-link
              v-for="ingredient in seasonalIngredients"
              :key="ingredient.id"
              :to="`/ingredient/${ingredient.id}`"
              class="ingredient-card"
          >
            <div class="ingredient-image">
              <img :src="ingredient.image" :alt="ingredient.name">
            </div>
            <div class="ingredient-info">
              <h3 class="ingredient-name">{{ ingredient.name }}</h3>
              <p class="ingredient-desc">{{ ingredient.description }}</p>
              <div class="ingredient-season">
                <a-tag color="orange">{{ ingredient.season }}</a-tag>
              </div>
            </div>
          </router-link>
        </div>

        <div class="view-more">
          <a-button type="link" @click="showAllIngredients">
            查看全部 <right-outlined />
          </a-button>
        </div>
      </a-spin>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { RightOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const activeTabKey = ref('autumn'); // 默认显示秋季，可以根据当前月份自动选择

// 模拟的当季食材数据
const seasonalIngredients = reactive([
  {
    id: '1',
    name: '南瓜',
    image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818',
    description: '营养丰富，适合煲汤和烘焙',
    season: '秋季',
  },
  {
    id: '2',
    name: '栗子',
    image: 'https://images.unsplash.com/photo-1508700629452-7969ea21903c',
    description: '香甜可口，可煮可烤',
    season: '秋季',
  },
  {
    id: '3',
    name: '甜椒',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83',
    description: '营养丰富，颜色鲜艳',
    season: '秋季',
  },
  {
    id: '4',
    name: '葡萄',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f',
    description: '鲜甜多汁，营养丰富',
    season: '秋季',
  },
  {
    id: '5',
    name: '梨',
    image: 'https://images.unsplash.com/photo-1514756331096-242fdeb70d4a',
    description: '香甜多汁，生津止渴',
    season: '秋季',
  },
  {
    id: '6',
    name: '红薯',
    image: 'https://images.unsplash.com/photo-1596097635121-14b38c7c658f',
    description: '香甜软糯，营养丰富',
    season: '秋季',
  },
  {
    id: '7',
    name: '菠菜',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb',
    description: '绿叶菜，富含铁质',
    season: '秋季',
  },
  {
    id: '8',
    name: '柿子',
    image: 'https://images.unsplash.com/photo-1606926694086-5624f1ccc7c1',
    description: '甜脆爽口，秋季水果',
    season: '秋季',
  },
]);

// 根据选中的季节加载对应的食材
watch(activeTabKey, async (newSeason) => {
  try {
    loading.value = true;

    // 实际应用中，这里会根据季节从API获取数据
    // const response = await fetch(`/api/ingredients/seasonal?season=${newSeason}`);
    // const data = await response.json();
    // seasonalIngredients.length = 0;
    // seasonalIngredients.push(...data);

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 600));

    // 下面是模拟不同季节的食材数据切换
    if (newSeason === 'spring') {
      // 春季食材
    } else if (newSeason === 'summer') {
      // 夏季食材
    } else if (newSeason === 'autumn') {
      // 秋季食材 - 已经设置为默认
    } else if (newSeason === 'winter') {
      // 冬季食材
    }

    loading.value = false;
  } catch (error) {
    console.error('获取当季食材失败:', error);
    loading.value = false;
  }
});

// 查看全部食材
const showAllIngredients = () => {
  router.push('/ingredients');
};

// 页面加载时自动选择当前季节
onMounted(() => {
  const getSeasonByMonth = (month: number): string => {
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  };

  const currentMonth = new Date().getMonth() + 1; // JavaScript月份从0开始
  activeTabKey.value = getSeasonByMonth(currentMonth);
});
</script>

<style scoped>
.seasonal-ingredients-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.seasonal-card {
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
}

.card-header {
  margin-bottom: 8px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.85);
}

.section-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin: 0;
}

.ingredient-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
  margin-top: 20px;
}

@media (min-width: 640px) {
  .ingredient-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .ingredient-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .ingredient-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.ingredient-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: block;
}

.ingredient-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.ingredient-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.ingredient-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.ingredient-card:hover .ingredient-image img {
  transform: scale(1.05);
}

.ingredient-info {
  padding: 16px;
}

.ingredient-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: rgba(0, 0, 0, 0.85);
}

.ingredient-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 12px;
  line-height: 1.5;
}

.ingredient-season {
  margin-top: 8px;
}

.view-more {
  text-align: center;
  margin-top: 32px;
}

/* 主题色调整 */
:deep(.ant-tabs-ink-bar) {
  background-color: #f6925c;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #f6925c;
}

:deep(.ant-tabs-tab:hover) {
  color: #ff8c5a;
}

:deep(.ant-tag-orange) {
  color: #f6925c;
  background: #fff0e6;
  border-color: #ffcca6;
}

:deep(.ant-btn-link) {
  color: #f6925c;
}

:deep(.ant-btn-link:hover) {
  color: #ff8c5a;
}
</style>