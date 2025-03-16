<template>
  <a-layout class="layout">
    <AppHeader />

    <a-layout-content class="content">
      <slot></slot>
    </a-layout-content>

    <AppFooter />
  </a-layout>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.content {
  min-height: 280px;
  background-color: var(--background-color);
}
</style>