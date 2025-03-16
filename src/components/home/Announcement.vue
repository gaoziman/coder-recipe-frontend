<template>
  <div class="container announcement-container">
    <a-alert
        class="announcement"
        banner
        :showIcon="false"
        closable
    >
      <template #icon>
        <notification-outlined class="announcement-icon" />
      </template>
      <template #message>
        <div class="announcement-content">
          <notification-outlined class="announcement-icon" />
          <p class="announcement-text">公告：欢迎来到「味见好时光」！我们最新推出了秋季食谱合集，快来探索当季美食吧！</p>
          <a-button type="link" class="announcement-link">查看详情</a-button>
        </div>
      </template>
    </a-alert>
  </div>
</template>

<script setup lang="ts">
import { NotificationOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.announcement-container {
  margin-top: 24px;
}

.announcement {
  background-color: var(--tag-background) !important;
  border-color: transparent !important;
  border-radius: 8px;
}

.announcement-content {
  display: flex;
  align-items: center;
  padding: 12px 0;
}

.announcement-icon {
  font-size: 18px;
  color: var(--primary-color);
  margin-right: 12px;
}

.announcement-text {
  margin: 0;
  flex-grow: 1;
}

.announcement-link {
  padding: 0 !important;
  height: auto !important;
  color: var(--primary-color) !important;
  font-size: 14px;
}
</style>