<template>
  <div class="custom-breadcrumb">
    <router-link to="/" class="breadcrumb-item home">
      <span>首页</span>
    </router-link>
    <span class="breadcrumb-separator">
      <right-outlined />
    </span>
    <router-link to="/ingredients" class="breadcrumb-item">
      <span>食材库</span>
    </router-link>
    <template v-if="category">
      <span class="breadcrumb-separator">
        <right-outlined />
      </span>
      <router-link :to="`/ingredient/category/${category.id}`" class="breadcrumb-item">
        <span>{{ category.name }}</span>
      </router-link>
    </template>
    <template v-if="currentItem">
      <span class="breadcrumb-separator">
        <right-outlined />
      </span>
      <span class="breadcrumb-item current">{{ currentItem }}</span>
    </template>
  </div>
</template>

<script setup>
import { HomeOutlined, RightOutlined } from '@ant-design/icons-vue';
import { defineProps } from 'vue';

// 通过props接收当前分类和当前项目
const props = defineProps({
  category: {
    type: Object,
    default: null
  },
  currentItem: {
    type: String,
    default: null
  }
});
</script>

<style scoped>
.custom-breadcrumb {
  display: flex;
  align-items: center;
  padding: 16px 0;
  font-size: 15px;
  color: #333;
  background-color: transparent;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
  font-weight: 400;
}

.breadcrumb-item.home {
  font-weight: 400;
}

.breadcrumb-item:hover {
  color: #f6925c;
}

.breadcrumb-item.current {
  color: #999;
  cursor: default;
}

.breadcrumb-separator {
  margin: 0 12px;
  color: #ccc;
  font-size: 12px;
}

.breadcrumb-separator .anticon {
  font-size: 12px;
}
</style>