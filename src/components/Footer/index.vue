<template>
  <a-layout-footer class="footer">
    <div class="footer-container">
      <!-- 顶部链接区域 -->
      <div class="footer-links">
        <div class="footer-section">
          <h4>关于我们</h4>
          <a-divider class="section-divider" />
          <p><a href="#">关于菜谱管家</a></p>
          <p><a href="#">加入我们</a></p>
          <p><a href="#">使用条款</a></p>
        </div>

        <div class="footer-section">
          <h4>帮助中心</h4>
          <a-divider class="section-divider" />
          <p><a href="#">使用指南</a></p>
          <p><a href="#">常见问题</a></p>
          <p><a href="#">反馈建议</a></p>
        </div>

        <div class="footer-section">
          <h4>联系我们</h4>
          <a-divider class="section-divider" />
          <p><a href="mailto:contact@recipemanager.com">邮箱：m2942894660@163.com</a></p>
          <p><a href="#">微信公众号：程序员Leo</a></p>
        </div>
      </div>

      <!-- 中间logo区域 -->
      <div class="footer-brand">
        <h2 class="brand-logo">我的菜谱管家</h2>
        <p class="brand-slogan">让烹饪更简单，让生活更美好</p>
      </div>

      <!-- 底部版权信息 -->
      <div class="footer-copyright">
        <p>鄂ICP备2025089543号-1 |
          <a href="https://opensource.org/licenses/MIT" target="_blank">MIT 协议</a> |
          版权所有 © {{ currentYear }} 菜谱管家团队
        </p>
      </div>
    </div>
  </a-layout-footer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

// 自动更新年份
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
  background: #fff;
  padding: 0;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 24px;
}

.footer-links {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.footer-section {
  flex: 1;
  padding: 0 16px;
}

.footer-section h4 {
  font-size: 16px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 0;
}

.section-divider {
  margin: 12px 0;
  background-color: #fa8c16;
  opacity: 0.6;
  width: 40px;
  min-width: 40px;
}

.footer-section p {
  margin-bottom: 8px;
}

.footer-section a {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #fa8c16;
}

.footer-brand {
  text-align: center;
  margin-bottom: 32px;
}

.brand-logo {
  font-size: 24px;
  font-weight: bold;
  color: #fa8c16;
  margin-bottom: 8px;
}

.brand-slogan {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.footer-copyright {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
}

.footer-copyright p {
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
}

.footer-copyright a {
  color: rgba(0, 0, 0, 0.45);
  transition: color 0.3s;
}

.footer-copyright a:hover {
  color: #fa8c16;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-links {
    flex-direction: column;
  }

  .footer-section {
    margin-bottom: 24px;
  }
}
</style>