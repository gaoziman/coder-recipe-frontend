<template>
  <a-layout-footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="logo-area">
            <restaurant-outlined theme="filled" class="footer-logo-icon" />
            <h3 class="footer-logo-text">味见好时光</h3>
          </div>
          <p class="slogan">记录美味，分享生活，让每一顿饭都成为难忘的时光</p>
          <div class="social-links">
            <a href="#" class="social-icon"><weibo-outlined /></a>
            <a href="#" class="social-icon"><wechat-outlined /></a>
            <a href="#" class="social-icon"><instagram-outlined /></a>
            <a href="#" class="social-icon"><zhihu-outlined /></a>
          </div>
        </div>

        <!-- 其余内容保持不变 -->
        <div class="footer-section">
          <h4 class="footer-heading">网站导航</h4>
          <ul class="footer-links">
            <li><a href="#">首页</a></li>
            <li><a href="#">菜谱</a></li>
            <li><a href="#">食材</a></li>
            <li><a href="#">合集</a></li>
            <li><a href="#">烹饪技巧</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-heading">关于我们</h4>
          <ul class="footer-links">
            <li><a href="#">关于味见好时光</a></li>
            <li><a href="#">加入我们</a></li>
            <li><a href="#">用户协议</a></li>
            <li><a href="#">隐私政策</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-heading">订阅美食周刊</h4>
          <p class="newsletter-text">订阅我们的美食周刊，获取最新的菜谱和烹饪技巧</p>
          <div class="newsletter-form">
            <a-input placeholder="输入您的邮箱" />
            <a-button type="primary">订阅</a-button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2025 味见好时光 - 美食与记忆的完美交融</p>
      </div>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import {
  WeiboOutlined,
  WechatOutlined,
  InstagramOutlined,
  ZhihuOutlined
} from '@ant-design/icons-vue'
</script>

<style scoped>
.app-footer {
  background-color: #333333;
  color: #ffffff;
  padding: 48px 0 24px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.footer-logo-icon {
  font-size: 24px;
  color: var(--primary-color);
}

.footer-logo-text {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: white;
}

.slogan {
  color: #bdbdbd;
  margin-bottom: 16px;
  line-height: 1.5;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-icon {
  color: #bdbdbd;
  font-size: 20px;
  transition: color 0.3s;
}

.social-icon:hover {
  color: var(--primary-color);
}

.footer-heading {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  color: white;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #bdbdbd;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: white;
}

.newsletter-text {
  color: #bdbdbd;
  margin-bottom: 16px;
  line-height: 1.5;
}

.newsletter-form {
  display: flex;
}

.newsletter-form :deep(.ant-input) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.newsletter-form :deep(.ant-btn) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.footer-bottom {
  border-top: 1px solid #444444;
  padding-top: 24px;
  text-align: center;
  color: #bdbdbd;
}
</style>