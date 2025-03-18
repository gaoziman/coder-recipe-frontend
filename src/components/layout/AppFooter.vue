<!-- src/components/layout/AppFooter.vue -->
<template>
  <a-layout-footer class="app-footer" v-if="!isAdminPage" >
    <div class="container footer-content">
      <!-- Logo和链接区域 -->
      <div class="footer-main">
        <div class="footer-logo-section">
          <div class="footer-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3L17 9L21 10L17 12L15 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 3L7 9L3 10L7 12L9 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="logo-text">味见好时光</span>
          </div>
          <div class="footer-slogan">记录美味，分享生活</div>
        </div>

        <div class="footer-nav">
          <div class="nav-column">
            <a href="/">首页</a>
            <a href="/recipes">菜谱</a>
            <a href="/ingredients">食材</a>
            <a href="/collections">合集</a>
          </div>
          <div class="nav-column">
            <a href="/about">关于我们</a>
            <a href="/join">加入我们</a>
            <a href="/help">帮助中心</a>
          </div>
          <div class="nav-column">
            <a href="/community">美食社区</a>
            <a href="/events">线下活动</a>
            <a href="/discussion">讨论区</a>
          </div>
        </div>

        <div class="footer-download">
          <span class="download-title">下载APP</span>
          <div class="download-btns">
            <a href="#" class="app-btn">
              <apple-outlined />
              App Store
            </a>
            <a href="#" class="app-btn">
              <android-outlined />
              安卓下载
            </a>
          </div>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="footer-copyright">
        <span>&copy; {{ currentYear }} 味见好时光</span>
        <div class="policy-links">
          <a href="/terms">用户协议</a>
          <a href="/privacy">隐私政策</a>
        </div>
      </div>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router';

const route = useRoute();
const isAdminPage = computed(() => route.path.startsWith('/admin'));

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background-color: #FFF9F5;
  padding: 20px 0 12px;
  color: #5A5A5A;
  font-size: 13px;
  border-top: 1px solid #FFE8D6;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 主要内容区域 - 使用水平布局 */
.footer-main {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

/* Logo区域 */
.footer-logo-section {
  flex: 0 0 auto;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #F0884C;
}

.footer-slogan {
  font-size: 12px;
  color: #8C8C8C;
}

/* 导航链接区 - 使用简洁的列布局 */
.footer-nav {
  display: flex;
  gap: 20px;
}

.nav-column {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-column a {
  color: #707070;
  text-decoration: none;
  font-size: 12px;
  transition: color 0.2s;
}

.nav-column a:hover {
  color: #F0884C;
}

/* 下载区域 */
.footer-download {
  flex: 0 0 auto;
}

.download-title {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #5A5A5A;
  margin-bottom: 8px;
}

.download-btns {
  display: flex;
  gap: 6px;
}

.app-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: #FFF0E6;
  border-radius: 16px;
  color: #F0884C;
  font-size: 11px;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid #FFD3B5;
}

.app-btn:hover {
  background-color: #F0884C;
  color: white;
}

/* 版权区域 */
.footer-copyright {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #FFE8D6;
  font-size: 12px;
  color: #8C8C8C;
}

.policy-links {
  display: flex;
  gap: 10px;
}

.policy-links a {
  color: #8C8C8C;
  text-decoration: none;
}

.policy-links a:hover {
  color: #F0884C;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-main {
    flex-direction: column;
    gap: 16px;
  }

  .footer-nav {
    width: 100%;
    justify-content: space-between;
  }

  .footer-copyright {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .app-footer {
    padding: 16px 0 10px;
  }

  .nav-column {
    gap: 4px;
  }
}
</style>