<!-- src/App.vue -->
<template>
  <div class="app">
    <app-header ref="headerRef" />

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <FloatingButtons />
    </main>

    <app-footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import FloatingButtons from "@/components/common/FloatingButtons.vue";

// 创建对 AppHeader 组件的引用
const headerRef = ref()

// 挂载完成后，将登录方法暴露给全局
onMounted(() => {
  // 注册全局方法，使其他地方可以触发登录弹窗
  window.showGlobalLogin = () => {
    headerRef.value?.showLogin()
  }
})
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  /* 移除或减小这个 padding，因为我们使用专门的占位元素 */
  /* padding-top: 64px; */
}

/* 过渡动画效果保持不变 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>