<template>
  <div class="floating-buttons" :style="buttonStyle">
    <div class="assistant-wrapper">
      <!-- 厨房智能助手弹窗 - 改为绝对定位 -->
      <div class="assistant-dialog" v-if="assistantVisible">
        <div class="dialog-header">
          <h3>厨房智能助手</h3>
          <a-button type="text" @click="closeAssistant" class="close-btn">
            <close-outlined />
          </a-button>
        </div>

        <div class="assistant-container">
          <div class="assistant-header">
            <div class="assistant-avatar">
              <!-- 更加明显的图标组合 -->
              <div class="kitchen-icon">
                <fire-outlined />
              </div>
            </div>
            <div class="assistant-info">
              <h3>味见小厨</h3>
              <p>您的私人烹饪顾问</p>
            </div>
          </div>

          <div class="assistant-messages">
            <div class="message assistant-message">
              您好！我是您的厨房智能助手"味见小厨"。有什么可以帮到您的吗？
            </div>

            <div class="quick-questions">
              <a-button class="question-btn" @click="askQuestion('如何判断食材新鲜度？')">
                如何判断食材新鲜度？
              </a-button>
              <a-button class="question-btn" @click="askQuestion('有什么适合初学者的菜谱推荐？')">
                适合初学者的菜谱
              </a-button>
              <a-button class="question-btn" @click="askQuestion('厨房常见问题解决')">
                厨房常见问题解决
              </a-button>
            </div>
          </div>

          <div class="assistant-input">
            <a-input
                placeholder="输入您的问题..."
                v-model:value="question"
                @pressEnter="sendQuestion"
            />
            <a-button type="primary" @click="sendQuestion">
              <template #icon><send-outlined /></template>
            </a-button>
          </div>
        </div>
      </div>

      <!-- 改进的助手按钮 - 不使用JSX -->
      <a-button
          class="floating-btn assistant-btn"
          shape="circle"
          @click="toggleAssistant"
          title="厨房智能助手"
      >
        <template #icon>
          <!-- 直接使用内联SVG，避免JSX语法 -->
          <span class="chef-icon">
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
              <path d="M12,2C9.24,2 7,4.24 7,7C7,7.76 7.17,8.47 7.46,9.11C5.68,10 4.5,11.82 4.5,14C4.5,15.58 5.19,17 6.25,17.97V19C6.25,19.55 6.7,20 7.25,20H16.75C17.3,20 17.75,19.55 17.75,19V17.97C18.81,17 19.5,15.58 19.5,14C19.5,11.82 18.32,10 16.54,9.11C16.83,8.47 17,7.76 17,7C17,4.24 14.76,2 12,2M12,4C13.66,4 15,5.34 15,7C15,8.66 13.66,10 12,10C10.34,10 9,8.66 9,7C9,5.34 10.34,4 12,4M12,12C14.21,12 16,13.79 16,16V18H8V16C8,13.79 9.79,12 12,12M8,18H16V21H8V18Z" />
            </svg>
          </span>
        </template>
      </a-button>
    </div>

    <a-button
        class="floating-btn back-to-top-btn"
        shape="circle"
        @click="scrollToTop"
        title="回到顶部"
        v-show="showBackToTop"
    >
      <template #icon>
        <up-outlined />
      </template>
    </a-button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  UpOutlined,
  CloseOutlined,
  SendOutlined,
  FireOutlined,
} from '@ant-design/icons-vue';

// 控制回到顶部按钮的显示
const showBackToTop = ref(false);

// 滚动监听函数
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300;
};

// 回到顶部功能
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 厨房智能助手相关
const assistantVisible = ref(false);
const question = ref('');

const toggleAssistant = () => {
  assistantVisible.value = !assistantVisible.value;
};

const closeAssistant = () => {
  assistantVisible.value = false;
};

const sendQuestion = () => {
  if (!question.value.trim()) return;
  question.value = '';
};

const askQuestion = (q) => {
  question.value = q;
  sendQuestion();
};

// 组件挂载和卸载时的事件监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // 初始检查
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* 保持原有样式不变 */
.floating-buttons {
  position: fixed;
  right: 30px;
  bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 999;
}

.assistant-wrapper {
  position: relative;
}

.assistant-dialog {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 360px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(to right, var(--primary-gradient-start, #FF9966), var(--primary-gradient-end, #FF5E62));
  color: white;
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  color: white;
}

.floating-btn {
  width: 50px;
  height: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-to-top-btn {
  background: white;
  color: var(--primary-color, #F0884C);
  border: 1px solid #f0f0f0;
}

.back-to-top-btn:hover {
  transform: translateY(-3px);
  color: white;
  background: linear-gradient(to right, var(--primary-gradient-start, #FF9966), var(--primary-gradient-end, #FF5E62));
  border: none;
}

.assistant-btn {
  background: linear-gradient(to right, var(--primary-gradient-start, #FF9966), var(--primary-gradient-end, #FF5E62));
  color: white;
  border: none;
  position: relative;
  font-size: 18px;
}

.assistant-btn:hover, .assistant-btn:focus {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(255, 94, 98, 0.3);
  color: white;
}

/* 新增SVG图标样式 */
.chef-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chef-icon svg {
  width: 24px;
  height: 24px;
}

/* 改进的厨师图标 */
.kitchen-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(to right, #FF9966, #FF5E62);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(240, 136, 76, 0.3);
}

/* 助手对话框样式 */
.assistant-container {
  display: flex;
  flex-direction: column;
  height: 400px;
  padding: 16px;
}

.assistant-header {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.assistant-avatar {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.assistant-info h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.assistant-info p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.assistant-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
  margin-bottom: 16px;
}

.message {
  padding: 10px 16px;
  border-radius: 18px;
  margin-bottom: 16px;
  max-width: 80%;
}

.assistant-message {
  background-color: #f9f9f9;
  align-self: flex-start;
}

.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.question-btn {
  border-radius: 18px;
  font-size: 13px;
  height: auto;
  padding: 6px 12px;
  white-space: normal;
  text-align: left;
  border-color: #f0f0f0;
  color: #666;
}

.question-btn:hover {
  color: var(--primary-color, #F0884C);
  border-color: var(--primary-color, #F0884C);
}

.assistant-input {
  display: flex;
  gap: 8px;
}

.assistant-input :deep(.ant-input) {
  border-radius: 20px;
  padding: 8px 16px;
}

.assistant-input :deep(.ant-btn) {
  border-radius: 20px;
  background: linear-gradient(to right, var(--primary-gradient-start, #FF9966), var(--primary-gradient-end, #FF5E62));
  border: none;
}
</style>