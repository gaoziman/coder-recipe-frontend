<!-- src/pages/user/UserProfile.vue -->
<template>
  <div class="user-profile">
    <div class="page-header">
      <h2 class="page-title">个人中心</h2>
      <p class="page-description">管理您的个人信息和烹饪偏好</p>
    </div>

    <a-row :gutter="[24, 24]">
      <!-- 用户信息卡片 -->
      <a-col :span="24">
        <a-card class="info-card" :bordered="false">
          <template #title>
            <div class="card-title">
              <user-outlined class="card-icon" />
              <span>基本信息</span>
            </div>
          </template>

          <a-descriptions :column="{ xs: 1, sm: 2, md: 3 }" layout="vertical">
            <a-descriptions-item label="用户名">
              <div class="value-display">{{ userInfo?.username }}</div>
            </a-descriptions-item>
            <a-descriptions-item label="邮箱">
              <div class="value-display">{{ userInfo?.email }}</div>
            </a-descriptions-item>
            <a-descriptions-item label="会员等级">
              <a-tag color="orange">普通会员</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="注册时间">
              <div class="value-display">2025-03-01</div>
            </a-descriptions-item>
            <a-descriptions-item label="最近登录">
              <div class="value-display">{{ formatDate(new Date()) }}</div>
            </a-descriptions-item>
          </a-descriptions>

          <a-divider />

          <div class="action-section">
            <a-button type="primary" class="edit-btn">
              <template #icon><edit-outlined /></template>
              编辑资料
            </a-button>
          </div>
        </a-card>
      </a-col>

      <!-- 统计卡片 -->
      <a-col :xs="24" :sm="12" :md="8">
        <a-card class="stat-card recipes-card" :bordered="false">
          <div class="stat-value">6</div>
          <div class="stat-label">我的菜谱</div>
          <fire-outlined class="stat-icon" />
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="8">
        <a-card class="stat-card favs-card" :bordered="false">
          <div class="stat-value">32</div>
          <div class="stat-label">收藏菜谱</div>
          <heart-outlined class="stat-icon" />
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="12" :md="8">
        <a-card class="stat-card likes-card" :bordered="false">
          <div class="stat-value">128</div>
          <div class="stat-label">获赞总数</div>
          <like-outlined class="stat-icon" />
        </a-card>
      </a-col>

      <!-- 近期活动 -->
      <a-col :span="24">
        <a-card class="activity-card" :bordered="false">
          <template #title>
            <div class="card-title">
              <history-outlined class="card-icon" />
              <span>近期活动</span>
            </div>
          </template>

          <a-timeline mode="left">
            <a-timeline-item color="green">
              <template #dot>
                <like-outlined style="font-size: 16px;" />
              </template>
              <span class="timeline-content">
                您给 <a>红烧排骨</a> 点了赞
              </span>
              <span class="timeline-time">2小时前</span>
            </a-timeline-item>

            <a-timeline-item color="blue">
              <template #dot>
                <message-outlined style="font-size: 16px;" />
              </template>
              <span class="timeline-content">
                您评论了 <a>糖醋里脊</a>
              </span>
              <span class="timeline-time">1天前</span>
            </a-timeline-item>

            <a-timeline-item color="orange">
              <template #dot>
                <star-outlined style="font-size: 16px;" />
              </template>
              <span class="timeline-content">
                您收藏了 <a>香煎三文鱼</a>
              </span>
              <span class="timeline-time">3天前</span>
            </a-timeline-item>

            <a-timeline-item color="#F0884C">
              <template #dot>
                <fire-outlined style="font-size: 16px;" />
              </template>
              <span class="timeline-content">
                您发布了新菜谱 <a>宫保鸡丁</a>
              </span>
              <span class="timeline-time">1周前</span>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>

      <!-- 烹饪偏好 -->
      <a-col :span="24">
        <a-card class="preference-card" :bordered="false">
          <template #title>
            <div class="card-title">
              <heart-outlined class="card-icon" />
              <span>烹饪偏好</span>
            </div>
          </template>

          <div class="pref-section">
            <h4 class="pref-title">喜爱的菜系</h4>
            <div class="tag-group">
              <a-tag color="orange">川菜</a-tag>
              <a-tag color="blue">粤菜</a-tag>
              <a-tag color="green">东北菜</a-tag>
              <a-tag color="purple">日料</a-tag>
              <a-tag color="magenta">意大利菜</a-tag>
              <a-tag>+ 添加</a-tag>
            </div>
          </div>

          <div class="pref-section">
            <h4 class="pref-title">擅长的烹饪技巧</h4>
            <div class="tag-group">
              <a-tag color="orange">爆炒</a-tag>
              <a-tag color="blue">煎</a-tag>
              <a-tag color="green">蒸</a-tag>
              <a-tag>+ 添加</a-tag>
            </div>
          </div>

          <div class="pref-section">
            <h4 class="pref-title">饮食习惯</h4>
            <div class="tag-group">
              <a-tag color="orange">低脂</a-tag>
              <a-tag color="blue">高蛋白</a-tag>
              <a-tag>+ 添加</a-tag>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import {
  UserOutlined,
  EditOutlined,
  FireOutlined,
  HeartOutlined,
  LikeOutlined,
  HistoryOutlined,
  MessageOutlined,
  StarOutlined
} from '@ant-design/icons-vue'

// 获取用户信息
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 格式化日期
const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.user-profile {
  width: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.page-description {
  margin: 0;
  font-size: 14px;
  color: #999;
}

/* 卡片通用样式 */
.info-card,
.stat-card,
.activity-card,
.preference-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.info-card:hover,
.activity-card:hover,
.preference-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 卡片标题样式 */
.card-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-icon {
  margin-right: 8px;
  color: var(--primary-color, #F0884C);
}

/* 基本信息卡片样式 */
.value-display {
  font-size: 14px;
  color: #333;
}

.action-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.edit-btn {
  background: linear-gradient(to right, var(--primary-gradient-start, #FF9966), var(--primary-gradient-end, #FF5E62));
  border: none;
  font-weight: 500;
  height: 36px;
  border-radius: 18px;
  transition: all 0.3s;
}

.edit-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 94, 98, 0.2);
}

/* 统计卡片样式 */
.stat-card {
  height: 120px;
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
}

.stat-label {
  font-size: 14px;
  color: #666;
  position: relative;
  z-index: 2;
}

.stat-icon {
  position: absolute;
  bottom: -15px;
  right: -15px;
  font-size: 80px;
  opacity: 0.1;
  color: #000;
  transition: all 0.3s;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(10deg);
}

.recipes-card {
  background: linear-gradient(135deg, #ffefba, #ffffff);
}

.recipes-card .stat-value {
  color: #f5a623;
}

.favs-card {
  background: linear-gradient(135deg, #ffe8e8, #ffffff);
}

.favs-card .stat-value {
  color: #ff5e62;
}

.likes-card {
  background: linear-gradient(135deg, #e8f5ff, #ffffff);
}

.likes-card .stat-value {
  color: #1890ff;
}

/* 活动时间线样式 */
:deep(.ant-timeline-item-content) {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.timeline-content {
  flex: 1;
}

.timeline-content a {
  color: var(--primary-color, #F0884C);
  font-weight: 500;
  text-decoration: none;
}

.timeline-content a:hover {
  text-decoration: underline;
}

.timeline-time {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  margin-left: 16px;
}

/* 偏好设置样式 */
.pref-section {
  margin-bottom: 20px;
}

.pref-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #666;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

:deep(.ant-tag) {
  padding: 4px 10px;
  font-size: 13px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 0;
}

:deep(.ant-tag:hover) {
  transform: scale(1.05);
}
</style>