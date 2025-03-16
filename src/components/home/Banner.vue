<template>
  <div class="banner">
    <div class="banner-content">
      <div class="banner-text">
        <h2 class="banner-title">探索美食的无限可能</h2>
        <p class="banner-description">记录美味，分享生活，让每一顿饭都成为难忘的时光</p>
        <div class="banner-buttons">
          <a-button size="large" class="banner-btn primary-btn">
            <template #icon><book-outlined /></template>
            浏览菜谱
          </a-button>
          <a-button size="large" class="banner-btn outline-btn">
            <template #icon><plus-circle-outlined /></template>
            创建食谱
          </a-button>
        </div>
      </div>
    </div>
    <div class="banner-image">
      <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352" alt="美食展示" />
      <div class="banner-image-overlay"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOutlined, PlusCircleOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.banner {
  height: 450px;
  position: relative;
  overflow: hidden;
  display: flex;
}

.banner-content {
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, var(--primary-gradient-start), var(--primary-gradient-end));
  display: flex;
  align-items: center;
  /* 修改：保持居中对齐，但增加左侧内边距 */
  justify-content: center;
  /* 修改：增加左侧内边距，减少右侧负边距 */
  padding-left: 15%;
  padding-right: 5%;
  margin-right: -3%;
  position: relative;
  z-index: 2;
}

.banner-text {
  max-width: 520px;
  color: white;
  text-align: left;
  margin-left: 30%;
}
.banner-title {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 16px;
}

.banner-description {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 32px;
  line-height: 1.6;
}

.banner-buttons {
  display: flex;
  gap: 16px;
  /* 保持按钮左对齐 */
  justify-content: flex-start;
}

.banner-btn {
  height: 48px;
  border-radius: 24px;
  padding: 0 24px;
  display: flex;
  align-items: center;
}

.primary-btn {
  background-color: white !important;
  color: var(--primary-color) !important;
  border-color: white !important;
}

.primary-btn:hover {
  background-color: #f0f0f0 !important;
}

.outline-btn {
  background-color: transparent !important;
  color: white !important;
  border-color: white !important;
}

.outline-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.banner-image {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 60%;
  z-index: 1;
}

.banner-image img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.banner-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, var(--primary-gradient-end), transparent 40%);
  opacity: 0.1;
}

@media (max-width: 1024px) {
  .banner-content {
    width: 60%;
    margin-right: -3%;
  }

  .banner-text {
    margin-left: 3%;
  }

  .banner-image {
    width: 55%;
  }
}

@media (max-width: 768px) {
  .banner-content {
    width: 100%;
    margin-right: 0;
    padding: 0 24px;
    /* 在移动设备上保持居中 */
    justify-content: center;
  }

  .banner-text {
    margin-left: 0;
    text-align: center;
  }

  .banner-buttons {
    /* 在移动设备上居中显示按钮 */
    justify-content: center;
  }

  .banner-image {
    width: 100%;
    opacity: 0.2;
  }

  .banner-image-overlay {
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>