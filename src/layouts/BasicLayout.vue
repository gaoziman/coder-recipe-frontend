<template>
  <a-layout class="layout">
    <Header />
    <a-layout-content class="content">
      <div class="main-container">
        <router-view></router-view>
      </div>
    </a-layout-content>
    <Footer />
  </a-layout>
</template>

<script lang="ts" setup>
import Header from '@/components/Header/index.vue'
import Footer from '@/components/Footer/index.vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.content {
  padding-top: 64px; /* Header 的高度 */
  background: #fff; /* 将内容区域背景改为白色 */
}

.main-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  background: #fff; /* 确保容器背景是白色 */
}
</style>