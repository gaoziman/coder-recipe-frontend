<template>
  <div class="cooking-tips-wrapper">
    <div class="section-header">
      <h2 class="section-title">烹饪小贴士</h2>
      <a-button type="link" class="view-all-link" @click="goToTipsList">
        查看全部 <right-outlined />
      </a-button>
    </div>

    <div class="tips-container">
      <div class="tip-item" v-for="(tip, index) in cookingTips" :key="index" @click="goToTipDetail(tip.id)">
        <div class="tip-icon-container">
          <div class="icon-circle">
            <bulb-outlined class="tip-icon" />
          </div>
        </div>
        <div class="tip-content">
          <h3 class="tip-title">{{ tip.title }}</h3>
          <p class="tip-text">{{ tip.content }}</p>
          <div class="tip-footer">
            <a-button type="link" class="detail-link">
              查看详情 <right-outlined />
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RightOutlined, BulbOutlined } from '@ant-design/icons-vue'

const router = useRouter()

// 烹饪小贴士数据 - 添加了id属性用于导航
const cookingTips = ref([
  {
    id: 'cooking-rice',
    title: '煮饭小技巧',
    content: '煮米饭前先浸泡20分钟，加入少许盐和一滴油，能让米饭更加松软香甜，不易粘锅'
  },
  {
    id: 'vegetable-fresh',
    title: '蔬菜保鲜法',
    content: '将绿叶蔬菜包裹在湿纸巾中，放入保鲜袋保存在冰箱中，能延长保鲜期至少3天'
  },
  {
    id: 'knife-skills',
    title: '刀工技巧',
    content: '切洋葱前先将其放入冰水中浸泡10分钟，或者在切之前将刀稍微浸湿，能减少辣眼睛'
  }
])

// 跳转到贴士详情页
const goToTipDetail = (tipId: string) => {
  router.push({
    name: 'CookingTipDetail',
    params: { id: tipId }
  })
}

// 跳转到贴士列表页
const goToTipsList = () => {
  router.push({
    name: 'CookingTipsList'
  })
}
</script>

<style scoped>
.cooking-tips-wrapper {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 32px 0;
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
  color: #d3aa79 !important;
  padding: 0 !important;
  height: auto !important;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.tips-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

.tip-item {
  background-color: #FFF8F0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(255, 153, 102, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.tip-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #FF9966, #FF7043);
  border-radius: 4px 0 0 4px;
}

.tip-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(255, 153, 102, 0.12);
}

.tip-icon-container {
  margin-top: 0;
}

.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 153, 102, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.tip-icon {
  font-size: 20px;
  color: #FF9966;
}

.tip-content {
  flex: 1;
}

.tip-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 10px 0;
}

.tip-text {
  font-size: 15px;
  color: #666666;
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.tip-footer {
  display: flex;
  justify-content: flex-end;
}

.detail-link {
  color: #FF9966 !important;
  padding: 0 !important;
  height: auto !important;
  font-size: 14px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.detail-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #FF9966;
  transition: width 0.3s ease;
}

.detail-link:hover::after {
  width: 100%;
}

@media (min-width: 768px) {
  .tips-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .cooking-tips-wrapper {
    padding: 24px 16px;
  }

  .tips-container {
    grid-template-columns: 1fr;
  }
}
</style>