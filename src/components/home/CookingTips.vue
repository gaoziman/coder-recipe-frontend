<template>
  <div class="tips-section-wrapper">
    <section class="cooking-tips">
      <div class="section-header">
        <h2 class="section-title">烹饪小贴士</h2>
        <a-button type="link" class="view-all-link">
          查看全部 <right-outlined />
        </a-button>
      </div>

      <div class="tips-container">
        <div class="tip-item" v-for="(tip, index) in cookingTips" :key="index">
          <div class="tip-icon-container">
            <bulb-outlined class="tip-icon" />
          </div>
          <div class="tip-content">
            <h3 class="tip-title">{{ tip.title }}</h3>
            <p class="tip-text">{{ tip.content }}</p>
            <a-button type="link" class="detail-link">
              查看详情 <right-outlined />
            </a-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RightOutlined, BulbOutlined } from '@ant-design/icons-vue'

// 烹饪小贴士数据
const cookingTips = ref([
  {
    title: '煮饭小技巧',
    content: '煮米饭前先浸泡20分钟，加入少许盐和一滴油，能让米饭更加松软香甜，不易粘锅'
  },
  {
    title: '蔬菜保鲜法',
    content: '将绿叶蔬菜包裹在湿纸巾中，放入保鲜袋保存在冰箱中，能延长保鲜期至少3天'
  },
  {
    title: '刀工技巧',
    content: '切洋葱前先将其放入冰水中浸泡10分钟，或者在切之前将刀稍微浸湿，能减少辣眼睛'
  }
])
</script>

<style scoped>
.tips-section-wrapper {
  width: 100%;
  padding: 32px 0;
  display: flex;
  justify-content: center;
}

.cooking-tips {
  background-color: white;
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 1140px; /* 设置最大宽度，与原型图一致 */
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  color: #333333;
}

.view-all-link {
  color: #d3aa79 !important; /* 使用原型图中的颜色 */
  padding: 0 !important;
  height: auto !important;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.tips-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-item {
  background-color: #FFF8F0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.tip-icon-container {
  margin-top: 4px;
}

.tip-icon {
  font-size: 20px;
  color: #FF9966;
}

.tip-content {
  flex: 1;
}

.tip-title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin: 0 0 8px 0;
}

.tip-text {
  font-size: 14px;
  color: #666666;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.detail-link {
  color: #FF9966 !important;
  padding: 0 !important;
  height: auto !important;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}

@media (max-width: 768px) {
  .cooking-tips {
    padding: 24px 16px;
  }
}
</style>