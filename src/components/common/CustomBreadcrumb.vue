<!-- RecipeBreadcrumb.vue -->
<template>
  <div class="recipe-breadcrumb">
    <router-link to="/" class="breadcrumb-item home">
      <span>首页</span>
    </router-link>
    <span class="breadcrumb-separator">
      <right-outlined />
    </span>
    <router-link to="/ingredients" class="breadcrumb-item">
      <span>食材</span>
    </router-link>

    <template v-if="category">
      <span class="breadcrumb-separator">
        <right-outlined />
      </span>
      <router-link :to="`/recipes/category/${category.key || category}`" class="breadcrumb-item">
        <span>{{ getCategoryName(category) }}</span>
      </router-link>
    </template>

    <template v-if="subcategory">
      <span class="breadcrumb-separator">
        <right-outlined />
      </span>
      <router-link :to="`/recipes/category/${category}/${subcategory}`" class="breadcrumb-item">
        <span>{{ getSubcategoryName(subcategory) }}</span>
      </router-link>
    </template>

    <template v-if="recipeName">
      <span class="breadcrumb-separator">
        <right-outlined />
      </span>
      <span class="breadcrumb-item current">{{ recipeName }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { HomeOutlined, RightOutlined } from '@ant-design/icons-vue';

// 通过props接收面包屑导航需要的数据
const props = defineProps({
  // 分类可以是字符串键名或对象
  category: {
    type: [String, Object],
    default: null
  },
  // 子分类
  subcategory: {
    type: String,
    default: null
  },
  // 当前菜谱名称
  recipeName: {
    type: String,
    default: null
  }
});

// 获取分类名称
const getCategoryName = (category: any): string => {
  // 如果分类是对象
  if (typeof category === 'object' && category !== null) {
    return category.name || getCategoryNameByKey(category.key);
  }
  // 如果分类是字符串
  return getCategoryNameByKey(category);
};

// 根据分类键名获取分类名称
const getCategoryNameByKey = (key: string): string => {
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
  return categoryMap[key] || '其他';
};

// 获取子分类名称
const getSubcategoryName = (subcategory: string): string => {
  const subcategoryMap: Record<string, string> = {
    'rice': '米饭类',
    'noodle': '面食类',
    'bread': '面包类',
    'dumpling': '饺子类'
  };
  return subcategoryMap[subcategory] || subcategory;
};
</script>

<style scoped>
.recipe-breadcrumb {
  display: flex;
  align-items: center;
  padding: 16px;
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