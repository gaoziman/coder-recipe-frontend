<template>
  <div class="home-page">
    <Banner />
    <Announcement />
    <SeasonalIngredients />
    <RecommendedRecipes />
    <FeaturedCollections />
    <CookingTips />
  </div>
</template>

<script setup lang="ts">
import Banner from '@/components/home/Banner.vue'
import Announcement from '@/components/home/Announcement.vue'
import SeasonalIngredients from '@/components/home/SeasonalIngredients.vue'
import RecommendedRecipes from '@/components/home/RecommendedRecipes.vue'
import FeaturedCollections from '@/components/home/FeaturedCollections.vue'
import CookingTips from '@/components/home/CookingTips.vue'
</script>

<style scoped>
.home-page > * + * {
  margin-top: 32px; /* 减少各组件间的间距，原来可能是48px或更多 */
}
</style>