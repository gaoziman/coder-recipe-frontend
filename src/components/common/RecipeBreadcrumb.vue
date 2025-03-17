<!-- RecipeBreadcrumb.vue -->
<template>
  <div class="recipe-breadcrumb">
    <!-- 首页链接始终显示 -->
    <router-link to="/" class="breadcrumb-item home">
      <span>首页</span>
    </router-link>
    <span class="breadcrumb-separator">
      <right-outlined />
    </span>

    <!-- 菜谱基础链接 -->
    <router-link to="/recipes" class="breadcrumb-item">
      <span>菜谱</span>
    </router-link>

    <!-- 根据当前路由动态显示剩余部分 -->
    <template v-if="currentRoute.matched.some(record => record.path.includes('category'))">
      <span class="breadcrumb-separator">
        <right-outlined />
      </span>
      <router-link :to="`/recipes/category/${categoryKey}`" class="breadcrumb-item">
        <span>{{ getCategoryName(categoryKey) }}</span>
      </router-link>

      <template v-if="subcategoryKey">
        <span class="breadcrumb-separator">
          <right-outlined />
        </span>
        <router-link :to="`/recipes/category/${categoryKey}/${subcategoryKey}`" class="breadcrumb-item">
          <span>{{ getSubcategoryName(subcategoryKey) }}</span>
        </router-link>
      </template>
    </template>

    <!-- 如果是详情页面 -->
    <template v-if="currentRoute.name === 'RecipeDetail' && recipeDetail">
      <span class="breadcrumb-separator">
        <right-outlined />
      </span>
      <router-link :to="`/recipes/category/${recipeDetail.category}`" class="breadcrumb-item">
        <span>{{ getCategoryName(recipeDetail.category) }}</span>
      </router-link>
      <span class="breadcrumb-separator">
        <right-outlined />
      </span>
      <span class="breadcrumb-item current">{{ recipeDetail.title }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RightOutlined } from '@ant-design/icons-vue';

// 获取当前路由信息
const currentRoute = useRoute();
const router = useRouter();

// 从路由中提取分类和子分类信息
const categoryKey = computed(() => {
  return currentRoute.params.category as string || '';
});

const subcategoryKey = computed(() => {
  return currentRoute.params.subcategory as string || '';
});

// 菜谱详情数据 - 实际项目中，应该通过store或API获取
const recipeDetail = computed(() => {
  // 如果是详情页，返回当前查看的菜谱数据
  if (currentRoute.name === 'RecipeDetail') {
    // 在这里您需要根据自己的数据管理方式获取当前菜谱的详情
    // 这里只是示例，实际实现可能需要从Vuex/Pinia或接口获取
    return {
      id: currentRoute.params.id,
      title: '菜谱详情', // 实际项目中应该是动态获取的
      category: currentRoute.query.category || 'vegetable',
    };
  }
  return null;
});

// 获取分类名称
const getCategoryName = (categoryKey: string): string => {
  const categoryMap: Record<string, string> = {
    'all': '全部分类',
    'vegetable': '蔬菜',
    'meat': '肉类',
    'seafood': '海鲜',
    'pasta': '意面',
    'bread': '面包',
    'dessert': '甜点',
    'soup': '汤品',
    'breakfast': '早餐',
    'main': '主食',
    'rice': '米饭类',
    'noodle': '面食类',
    'dumpling': '饺子类'
  };
  return categoryMap[categoryKey] || '其他';
};

// 获取子分类名称
const getSubcategoryName = (subcategoryKey: string): string => {
  const subcategoryMap: Record<string, string> = {
    'rice': '米饭类',
    'noodle': '面食类',
    'bread': '面包类',
    'dumpling': '饺子类'
  };
  return subcategoryMap[subcategoryKey] || subcategoryKey;
};

// 监听路由变化，更新面包屑
watch(() => currentRoute.path, (newPath) => {
  console.log('路由变化:', newPath);
}, { immediate: true });
</script>

<style scoped>
.recipe-breadcrumb {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-top: 20px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #666;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb-item:hover {
  color: #FF7043;
}

.breadcrumb-item.home {
  color: #666;
}

.breadcrumb-item.current {
  color: #999;
  cursor: default;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #ccc;
  font-size: 12px;
  display: flex;
  align-items: center;
}
</style>