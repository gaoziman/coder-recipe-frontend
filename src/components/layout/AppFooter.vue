<!-- src/components/layout/AppFooter.vue -->
<template>
  <a-layout-footer class="app-footer">
    <div class="container footer-content">
      <div class="footer-top">
        <div class="footer-logo">
          <span class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3L17 9L21 10L17 12L15 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 3L7 9L3 10L7 12L9 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
          <h3 class="logo-text">味见好时光</h3>
        </div>
        <div class="footer-slogan">记录美味，分享生活，让每一顿饭都成为难忘的时光</div>
      </div>

      <div class="footer-links">
        <div class="link-group">
          <h4 class="link-title">网站导航</h4>
          <ul class="link-list">
            <li><a href="/">首页</a></li>
            <li><a href="/recipes">菜谱</a></li>
            <li><a href="/ingredients">食材</a></li>
            <li><a href="/collections">合集</a></li>
            <li><a href="/tips">烹饪技巧</a></li>
          </ul>
        </div>

        <div class="link-group">
          <h4 class="link-title">关于我们</h4>
          <ul class="link-list">
            <li><a href="/about">关于味见</a></li>
            <li><a href="/join">加入我们</a></li>
            <li><a href="/feedback">意见反馈</a></li>
            <li><a href="/help">帮助中心</a></li>
            <li><a href="/contact">联系我们</a></li>
          </ul>
        </div>

        <div class="link-group">
          <h4 class="link-title">社区</h4>
          <ul class="link-list">
            <li><a href="/community">美食社区</a></li>
            <li><a href="/creators">创作者中心</a></li>
            <li><a href="/events">线下活动</a></li>
            <li><a href="/challenges">挑战赛</a></li>
            <li><a href="/discussion">讨论区</a></li>
          </ul>
        </div>

        <div class="link-group app-download">
          <h4 class="link-title">下载 APP</h4>
          <div class="qrcode">
            <div class="qrcode-placeholder"></div>
            <p class="qrcode-tip">扫描下载味见 APP</p>
          </div>
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

      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ currentYear }} 味见好时光 · 保留所有权利
        </div>
        <div class="policy-links">
          <a href="/terms">用户协议</a>
          <a href="/privacy">隐私政策</a>
          <a href="/cookies">Cookie 政策</a>
          <a href="/security">网站安全</a>
        </div>
      </div>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons-vue'

// 当前年份
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background-color: #2c3e50;
  padding: 48px 0 24px;
  color: #f9f9f9;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* 顶部区域 */
.footer-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  margin-bottom: 12px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.logo-icon {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 22px;
  font-weight: 600;
  color: var(--primary-color, #F0884C);
  margin: 0;
}

.footer-slogan {
  font-size: 14px;
  color: #a0aec0;
  max-width: 500px;
}

/* 链接区域 */
.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 32px;
}

.link-group {
  min-width: 160px;
}

.link-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 16px 0;
  position: relative;
  padding-bottom: 10px;
}

.link-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(to right, var(--primary-gradient-start, #FF9966), var(--primary-gradient-end, #FF5E62));
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-list li {
  margin-bottom: 10px;
}

.link-list a {
  color: #a0aec0;
  text-decoration: none;
  transition: color 0.2s;
  font-size: 14px;
}

.link-list a:hover {
  color: var(--primary-color, #F0884C);
}

/* 二维码区域 */
.app-download {
  flex-grow: 1;
  max-width: 220px;
}

.qrcode {
  text-align: center;
  margin-bottom: 16px;
}

.qrcode-placeholder {
  width: 120px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin: 0 auto 8px;
  position: relative;
}

.qrcode-placeholder::before {
  content: 'QR Code';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.qrcode-tip {
  font-size: 12px;
  color: #a0aec0;
  margin: 0;
}

.download-btns {
  display: flex;
  gap: 8px;
}

.app-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #ffffff;
  font-size: 12px;
  text-decoration: none;
  transition: all 0.2s;
}

.app-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 底部区域 */
.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright {
  color: #718096;
  font-size: 14px;
}

.policy-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.policy-links a {
  color: #a0aec0;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.2s;
}

.policy-links a:hover {
  color: var(--primary-color, #F0884C);
}

/* 响应式样式 */
@media (max-width: 768px) {
  .footer-links {
    flex-direction: column;
    gap: 24px;
  }

  .link-group {
    min-width: 100%;
  }

  .app-download {
    max-width: 100%;
  }

  .qrcode {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .qrcode-placeholder {
    margin: 0;
  }
}

@media (max-width: 576px) {
  .app-footer {
    padding: 32px 0 16px;
  }

  .footer-links {
    gap: 16px;
  }

  .footer-bottom {
    gap: 8px;
  }

  .qrcode {
    flex-direction: column;
  }
}
</style>