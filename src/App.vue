<template>
  <a-layout class="app-layout">
    <AppHeader />

    <a-layout-content class="app-content">
      <router-view />
    </a-layout-content>

    <AppFooter />

    <!-- 添加悬浮按钮组件 -->
    <FloatingButtons />
  </a-layout>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import FloatingButtons from '@/components/common/FloatingButtons.vue';
</script>