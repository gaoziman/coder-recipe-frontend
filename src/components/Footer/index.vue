<template>
  <a-layout-footer class="footer">
    <div class="footer-wave-container">
      <svg class="footer-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 140">
        <path fill="#f5f5f7" fill-opacity="1" d="M0,64L60,69.3C120,75,240,85,360,90.7C480,96,600,96,720,80C840,64,960,32,1080,26.7C1200,21,1320,43,1380,53.3L1440,64L1440,140L1380,140C1320,140,1200,140,1080,140C960,140,840,140,720,140C600,140,480,140,360,140C240,140,120,140,60,140L0,140Z"></path>
      </svg>
    </div>

    <div class="footer-container">
      <!-- 顶部链接区域 -->
      <div class="footer-links">
        <div class="footer-section about-section">
          <h4>关于我们</h4>
          <a-divider class="section-divider" />
          <p><a href="#"><coffee-outlined /> 关于味见好时光</a></p>
          <p><a href="#"><team-outlined /> 加入我们</a></p>
          <p><a href="#"><file-text-outlined /> 使用条款</a></p>
        </div>

        <div class="footer-section help-section">
          <h4>帮助中心</h4>
          <a-divider class="section-divider" />
          <p><a href="#"><book-outlined /> 使用指南</a></p>
          <p><a href="#"><question-circle-outlined /> 常见问题</a></p>
          <p><a href="#"><message-outlined /> 反馈建议</a></p>
        </div>

        <div class="footer-section contact-section">
          <h4>联系我们</h4>
          <a-divider class="section-divider" />
          <p><a href="mailto:m2942894660@163.com"><mail-outlined /> 邮箱：m2942894660@163.com</a></p>
          <p><a href="#"><wechat-outlined /> 微信公众号：程序员Leo</a></p>
          <div class="social-icons">
            <a href="#" class="social-icon"><github-outlined /></a>
            <a href="#" class="social-icon"><weibo-outlined /></a>
            <a href="#" class="social-icon"><zhihu-outlined /></a>
          </div>
        </div>

        <!-- 新增的QR码区域 -->
        <div class="footer-section qrcode-section">
          <h4>扫码关注</h4>
          <a-divider class="section-divider" />
          <div class="qrcode-container">
            <div class="qrcode-box">
              <div class="qrcode-placeholder"></div>
              <p>微信公众号</p>
            </div>
            <div class="qrcode-box">
              <div class="qrcode-placeholder"></div>
              <p>小程序</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间品牌区域 -->
      <div class="footer-brand">
        <div class="brand-content">
          <div class="brand-icon">
            <fire-outlined />
          </div>
          <div class="brand-text">
            <h2 class="brand-logo">味见好时光</h2>
            <p class="brand-slogan">让烹饪更简单，让生活更美好</p>
          </div>
        </div>

        <!-- 新增的食材轮播 -->
        <div class="ingredient-slider">
          <div class="slider-content">
            <span class="ingredient-item"><environment-outlined /> 新鲜</span>
            <span class="ingredient-dot">•</span>
            <span class="ingredient-item"><heart-outlined /> 健康</span>
            <span class="ingredient-dot">•</span>
            <span class="ingredient-item"><smile-outlined /> 美味</span>
            <span class="ingredient-dot">•</span>
            <span class="ingredient-item"><bulb-outlined /> 创意</span>
            <span class="ingredient-dot">•</span>
            <span class="ingredient-item"><home-outlined /> 家的味道</span>
            <span class="ingredient-dot">•</span>
            <span class="ingredient-item"><environment-outlined /> 新鲜</span>
            <span class="ingredient-dot">•</span>
            <span class="ingredient-item"><heart-outlined /> 健康</span>
          </div>
        </div>

        <!-- 订阅区域 -->
        <div class="subscribe-section">
          <p class="subscribe-text">订阅我们的烹饪灵感与食谱更新</p>
          <div class="subscribe-form">
            <a-input placeholder="请输入您的邮箱" />
            <a-button type="primary">订阅</a-button>
          </div>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="footer-copyright">
        <p class="copyright-text">
          <span class="copyright-item">鄂ICP备2025089543号-1</span>
          <span class="copyright-divider">|</span>
          <a href="https://opensource.org/licenses/MIT" target="_blank" class="copyright-item">MIT 协议</a>
          <span class="copyright-divider">|</span>
          <span class="copyright-item">版权所有 © {{ currentYear }} 味见好时光团队</span>
        </p>
        <div class="footer-badges">
          <span class="badge"><safety-outlined /> 安全认证</span>
          <span class="badge"><trophy-outlined /> 诚信网站</span>
          <span class="badge"><check-circle-outlined /> 可信食谱</span>
        </div>
      </div>
    </div>

    <!-- 回到顶部按钮 -->
    <div class="back-to-top" @click="scrollToTop">
      <arrow-up-outlined />
    </div>
  </a-layout-footer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import {
  CoffeeOutlined,
  TeamOutlined,
  FileTextOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  MessageOutlined,
  MailOutlined,
  WechatOutlined,
  GithubOutlined,
  WeiboOutlined,
  ZhihuOutlined,
  FireOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  SmileOutlined,
  BulbOutlined,
  HomeOutlined,
  SafetyOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ArrowUpOutlined
} from '@ant-design/icons-vue';

// 自动更新年份
const currentYear = computed(() => new Date().getFullYear());

// 回到顶部功能
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
</script>

<style scoped>
.footer {
  background: #f5f5f7;
  padding: 0;
  position: relative;
  margin-top: 40px;
}

.footer-wave-container {
  position: absolute;
  top: -140px;
  left: 0;
  width: 100%;
  height: 140px;
  overflow: hidden;
}

.footer-wave {
  width: 100%;
  height: 100%;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 24px 24px;
  position: relative;
}

/* 链接区域样式 */
.footer-links {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.footer-section {
  flex: 1;
  padding: 0 16px;
  min-width: 200px;
  margin-bottom: 20px;
}

.footer-section h4 {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 0;
  position: relative;
  display: inline-block;
}

.section-divider {
  margin: 12px 0;
  background-color: #fa8c16;
  opacity: 0.8;
  width: 40px;
  min-width: 40px;
  height: 2px;
}

.footer-section p {
  margin-bottom: 10px;
}

.footer-section a {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
}

.footer-section a:hover {
  color: #fa8c16;
  transform: translateX(3px);
}

.footer-section a .anticon {
  margin-right: 8px;
  font-size: 16px;
  color: #fa8c16;
  opacity: 0.8;
}

/* 社交图标区域 */
.social-icons {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.social-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.social-icon:hover {
  background: #fa8c16;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(250, 140, 22, 0.2);
}

/* 二维码区域 */
.qrcode-section {
  flex: 1.2;
}

.qrcode-container {
  display: flex;
  gap: 16px;
}

.qrcode-box {
  text-align: center;
}

.qrcode-placeholder {
  width: 80px;
  height: 80px;
  background: #fff;
  border: 1px solid #eee;
  margin-bottom: 8px;
  display: inline-block;
  position: relative;
  overflow: hidden;
}

.qrcode-placeholder:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(45deg, #fa8c16 25%, transparent 25%, transparent 50%, #fa8c16 50%, #fa8c16 75%, transparent 75%);
  background-size: 10px 10px;
  opacity: 0.1;
}

.qrcode-placeholder:after {
  content: "扫一扫";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fa8c16;
  font-size: 12px;
}

.qrcode-box p {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}

/* 品牌区域样式 */
.footer-brand {
  text-align: center;
  margin-bottom: 32px;
  padding: 20px 0;
  border-top: 1px dashed rgba(0, 0, 0, 0.1);
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
}

.brand-content {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: #fff7e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #fa8c16;
  font-size: 24px;
  box-shadow: 0 2px 8px rgba(250, 140, 22, 0.2);
}

.brand-text {
  text-align: left;
}

.brand-logo {
  font-size: 24px;
  font-weight: bold;
  color: #fa8c16;
  margin-bottom: 0;
  line-height: 1.2;
}

.brand-slogan {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  margin: 4px 0 0 0;
}

/* 食材轮播样式 */
.ingredient-slider {
  margin: 24px 0;
  overflow: hidden;
  background: #fff7e6;
  border-radius: 30px;
  padding: 10px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.slider-content {
  display: flex;
  align-items: center;
  animation: slide 20s linear infinite;
  white-space: nowrap;
}

@keyframes slide {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.ingredient-item {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: #fa8c16;
}

.ingredient-item .anticon {
  margin-right: 4px;
}

.ingredient-dot {
  margin: 0 10px;
  color: #ffc069;
}

/* 订阅区域 */
.subscribe-section {
  margin-top: 24px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.subscribe-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 12px;
}

.subscribe-form {
  display: flex;
  gap: 8px;
}

.subscribe-form .ant-input {
  border-radius: 4px;
  border-color: #ffd591;
}

.subscribe-form .ant-input:focus,
.subscribe-form .ant-input:hover {
  border-color: #fa8c16;
  box-shadow: 0 0 0 2px rgba(250, 140, 22, 0.2);
}

.subscribe-form .ant-btn {
  background: #fa8c16;
  border-color: #fa8c16;
}

.subscribe-form .ant-btn:hover {
  background: #fd9a30;
  border-color: #fd9a30;
}

/* 版权信息区域 */
.footer-copyright {
  text-align: center;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.copyright-text {
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 8px;
}

.copyright-item {
  margin: 0 5px;
}

.copyright-divider {
  color: rgba(0, 0, 0, 0.25);
}

.copyright-text a {
  color: rgba(0, 0, 0, 0.45);
  transition: color 0.3s;
}

.copyright-text a:hover {
  color: #fa8c16;
}

.footer-badges {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

.badge {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
}

.badge .anticon {
  margin-right: 4px;
  color: #52c41a;
}

/* 回到顶部按钮 */
.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fa8c16;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 999;
  transition: all 0.3s;
}

.back-to-top:hover {
  background: #fa8c16;
  color: #fff;
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(250, 140, 22, 0.3);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .footer-section {
    flex: 0 0 calc(50% - 32px);
  }

  .qrcode-section {
    flex: 0 0 100%;
    margin-top: 20px;
  }

  .qrcode-container {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .footer-links {
    flex-direction: column;
  }

  .footer-section {
    flex: 0 0 100%;
    margin-bottom: 24px;
  }

  .subscribe-form {
    flex-direction: column;
  }

  .footer-copyright {
    flex-direction: column;
  }

  .footer-badges {
    margin-top: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .footer-container {
    padding: 20px 16px 16px;
  }

  .brand-content {
    flex-direction: column;
    text-align: center;
  }

  .brand-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .brand-text {
    text-align: center;
  }

  .ingredient-slider {
    padding: 8px;
  }

  .footer-badges {
    gap: 10px;
  }

  .back-to-top {
    right: 20px;
    bottom: 20px;
    width: 36px;
    height: 36px;
  }
}
</style>