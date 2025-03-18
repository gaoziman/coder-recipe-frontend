<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-icon">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6L14 12M14 12L9 10M14 12L9 14" stroke="#F0884C" stroke-width="2" stroke-linecap="round" />
          <path d="M15 3L17 9L21 10L17 12L15 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round" />
          <path d="M9 3L7 9L3 10L7 12L9 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round" />
          <circle cx="12" cy="20" r="1" fill="#F0884C" />
          <circle cx="12" cy="16" r="1" fill="#F0884C" />
        </svg>
      </div>
      <h1 class="error-code">404</h1>
      <h2 class="error-title">页面迷路了</h2>
      <p class="error-message">看起来这道美食还在准备中，或者您访问的页面已被移除。</p>
      <div class="suggestion">
        <p>您可以尝试以下方式：</p>
        <ul>
          <li>检查URL是否正确</li>
          <li>返回上一页</li>
          <li>浏览我们的美食菜谱</li>
        </ul>
      </div>
      <div class="action-buttons">
        <a-button type="primary" size="large" @click="goHome">
          返回首页
        </a-button>
        <a-button size="large" @click="goBack" style="margin-left: 16px;">
          返回上一页
        </a-button>
      </div>
    </div>
    <div class="background-decoration">
      <div class="decoration-item" v-for="n in 8" :key="n"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #FFF8F5 0%, #FFF 100%);
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(240, 136, 76, 0.12);
}

.error-icon {
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

.error-code {
  font-size: 90px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(120deg, #F0884C, #FF5E62);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 16px 0;
}

.error-message {
  font-size: 18px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
}

.suggestion {
  background-color: #FFF8F5;
  border-radius: 8px;
  padding: 16px 24px;
  text-align: left;
  margin-bottom: 32px;
  border-left: 4px solid #F0884C;
}

.suggestion p {
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.suggestion ul {
  margin: 0;
  padding-left: 20px;
}

.suggestion li {
  color: #666;
  margin-bottom: 8px;
  line-height: 1.5;
}

.action-buttons {
  margin-top: 32px;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.decoration-item {
  position: absolute;
  background-color: #F0884C;
  opacity: 0.05;
  border-radius: 50%;
}

.decoration-item:nth-child(1) {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -100px;
}

.decoration-item:nth-child(2) {
  width: 200px;
  height: 200px;
  bottom: -100px;
  right: -50px;
}

.decoration-item:nth-child(3) {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 15%;
}

.decoration-item:nth-child(4) {
  width: 60px;
  height: 60px;
  bottom: 30%;
  left: 10%;
}

.decoration-item:nth-child(5) {
  width: 40px;
  height: 40px;
  top: 40%;
  left: 20%;
}

.decoration-item:nth-child(6) {
  width: 50px;
  height: 50px;
  bottom: 15%;
  left: 40%;
}

.decoration-item:nth-child(7) {
  width: 70px;
  height: 70px;
  top: 25%;
  left: 60%;
}

.decoration-item:nth-child(8) {
  width: 90px;
  height: 90px;
  top: 60%;
  right: 25%;
}

/* 覆盖 Ant Design 样式 */
:deep(.ant-btn-primary) {
  background-color: #F0884C;
  border-color: #F0884C;
}

:deep(.ant-btn-primary:hover) {
  background-color: #FF9966;
  border-color: #FF9966;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

@media (max-width: 768px) {
  .error-code {
    font-size: 72px;
  }

  .error-title {
    font-size: 24px;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .action-buttons .ant-btn {
    margin: 0 !important;
  }
}
</style>