<template>
  <a-layout-header class="app-header">
    <div class="container header-content">
      <div class="logo-area">
        <span class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3L17 9L21 10L17 12L15 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
            <path d="M9 3L7 9L3 10L7 12L9 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
        <h1 class="logo-text">味见好时光</h1>
      </div>

      <a-menu mode="horizontal" v-model:selectedKeys="selectedKeys" class="nav-menu">
        <a-menu-item key="home">首页</a-menu-item>
        <a-menu-item key="recipes">菜谱</a-menu-item>
        <a-menu-item key="ingredients">食材</a-menu-item>
        <a-menu-item key="collections">合集</a-menu-item>
        <a-menu-item key="tips">烹饪技巧</a-menu-item>
      </a-menu>

      <div class="action-area">
        <!-- 简化后的搜索框 -->
        <div class="search-box">
          <input type="text" placeholder="搜索菜谱、食材..." v-model="searchText" />
          <button type="button" class="search-icon">
            <search-outlined />
          </button>
        </div>
        <a-button class="login-btn" @click="showLoginModal">登录</a-button>
        <a-button class="register-btn" @click="showRegisterModal">注册</a-button>
      </div>
    </div>
  </a-layout-header>

  <!-- 登录弹窗内容保持不变 -->
  <a-modal
      v-model:visible="loginVisible"
      title="登录"
      :footer="null"
      :width="420"
      class="auth-modal"
  >
    <a-form :model="loginForm" layout="vertical">
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="loginForm.email" placeholder="请输入您的邮箱" />
      </a-form-item>

      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="loginForm.password" placeholder="请输入您的密码" />
        <div class="text-right">
          <a class="forgot-link">忘记密码？</a>
        </div>
      </a-form-item>

      <a-button type="primary" block>登录</a-button>

      <div class="switch-auth-modal">
        <p>还没有账号？ <a @click="switchToRegister">立即注册</a></p>
      </div>

      <div class="divider-text">
        <a-divider>或通过以下方式登录</a-divider>
      </div>

      <div class="social-login">
        <a-button shape="circle" class="social-btn">
          <template #icon><wechat-outlined style="color: #07C160; font-size: 20px" /></template>
        </a-button>
        <a-button shape="circle" class="social-btn">
          <template #icon><weibo-outlined style="color: #E6162D; font-size: 20px" /></template>
        </a-button>
        <a-button shape="circle" class="social-btn">
          <template #icon><qq-outlined style="color: #1677FF; font-size: 20px" /></template>
        </a-button>
      </div>
    </a-form>
  </a-modal>

  <!-- 注册弹窗内容保持不变 -->
  <a-modal
      v-model:visible="registerVisible"
      title="注册"
      :footer="null"
      :width="420"
      class="auth-modal"
  >
    <a-form :model="registerForm" layout="vertical">
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="registerForm.username" placeholder="请设置您的用户名" />
      </a-form-item>

      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="registerForm.email" placeholder="请输入您的邮箱" />
      </a-form-item>

      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="registerForm.password" placeholder="请设置您的密码" />
      </a-form-item>

      <a-form-item label="确认密码" name="confirmPassword">
        <a-input-password v-model:value="registerForm.confirmPassword" placeholder="请再次输入您的密码" />
      </a-form-item>

      <a-form-item name="agreement">
        <a-checkbox v-model:checked="registerForm.agreement">
          我已阅读并同意<a>用户协议</a>和<a>隐私政策</a>
        </a-checkbox>
      </a-form-item>

      <a-button type="primary" block>注册</a-button>

      <div class="switch-auth-modal">
        <p>已有账号？ <a @click="switchToLogin">立即登录</a></p>
      </div>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {
  WechatOutlined,
  WeiboOutlined,
  QqOutlined,
  SearchOutlined
} from '@ant-design/icons-vue'

// 导航菜单选中状态
const selectedKeys = ref(['home'])

// 搜索文本
const searchText = ref('')

// 登录表单相关
const loginVisible = ref(false)
const loginForm = reactive({
  email: '',
  password: ''
})

// 注册表单相关
const registerVisible = ref(false)
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

// 显示登录弹窗
const showLoginModal = () => {
  loginVisible.value = true
}

// 显示注册弹窗
const showRegisterModal = () => {
  registerVisible.value = true
}

// 切换到注册弹窗
const switchToRegister = () => {
  loginVisible.value = false
  registerVisible.value = true
}

// 切换到登录弹窗
const switchToLogin = () => {
  registerVisible.value = false
  loginVisible.value = true
}

// 添加一个空白div以防止内容被固定导航栏覆盖
onMounted(() => {
  const appHeader = document.querySelector('.app-header');
  const headerHeight = appHeader?.offsetHeight || 64;

  // 创建占位元素
  const spacer = document.createElement('div');
  spacer.style.height = `${headerHeight}px`;
  document.body.insertBefore(spacer, document.body.firstChild);
});
</script>

<style scoped>
.app-header {
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  padding: 0;
  height: 64px;
  line-height: 64px;
  position: fixed; /* 改为固定定位 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 确保导航栏显示在其他内容上方 */
  width: 100%;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  display: flex;
  align-items: center;
  color: var(--primary-color, #F0884C);
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--primary-color, #F0884C);
}

.nav-menu {
  background: transparent;
  border-bottom: none;
  flex: 1;
  display: flex;
  justify-content: center;
}

/* 菜单容器调整 */
.nav-menu {
  background: transparent;
  border-bottom: none;
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 8px; /* 为菜单项提供一些间距 */
}

/* 菜单项基础样式 */
.nav-menu :deep(.ant-menu-item) {
  padding: 0 16px;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0 4px;
  line-height: 40px;
  height: 40px; /* 降低高度使胶囊效果更明显 */
  border-radius: 20px; /* 完全圆角，呼应按钮风格 */
}

/* 完全移除原有下划线 */
.nav-menu :deep(.ant-menu-item::after),
.nav-menu :deep(.ant-menu-horizontal > .ant-menu-item::after),
.nav-menu :deep(.ant-menu-horizontal > .ant-menu-submenu::after) {
  display: none !important;
  border-bottom: none !important;
}

/* 悬停效果 - 轻微的背景变化 */
.nav-menu :deep(.ant-menu-item:hover) {
  color: #F0884C;
  background-color: rgba(255, 153, 102, 0.08);
}

/* 选中项样式 - 胶囊式效果 */
.nav-menu :deep(.ant-menu-item-selected) {
  color: white !important;
  font-weight: 500;
  background: linear-gradient(to right, var(--primary-gradient-start, #FF9966), var(--primary-gradient-end, #FF5E62));
  box-shadow: 0 2px 8px rgba(255, 94, 98, 0.25);
  transform: translateY(-2px); /* 轻微上浮效果 */
}

/* 活动项样式（点击时） */
.nav-menu :deep(.ant-menu-item-active) {
  color: #F0884C;
}

/* 调整搜索框样式 */
.action-area {
  display: flex;
  align-items: center; /* 确保垂直居中 */
  gap: 12px;
}

.search-box {
  position: relative;
  width: 280px;
  height: 40px;
  /* 移除左右margin，改用flex的gap来控制间距 */
  margin: 0;
  display: flex;
  align-items: center; /* 确保内部垂直居中 */
}

.search-box input {
  width: 100%;
  height: 38px; /* 稍微调小高度 */
  border-radius: 20px;
  border: 1px solid #eeeeee;
  background-color: #f9f9f9;
  padding: 0 40px 0 16px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box; /* 确保padding不会影响整体尺寸 */
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  padding: 0; /* 确保无内边距 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbbbbb;
  cursor: pointer;
  font-size: 16px;
  outline: none; /* 防止点击时出现轮廓 */
  z-index: 1; /* 确保按钮在输入框之上 */
}

/* 确保图标正确显示 */
.search-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.login-btn {
  border-radius: 20px;
  height: 36px;
  padding: 0 20px;
  font-size: 14px;
  border: 1px solid var(--primary-color, #F0884C);
  color: var(--primary-color, #F0884C);
  background: transparent;
}

.register-btn {
  border-radius: 20px;
  height: 36px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  color: white;
  /* 使用全局CSS变量中定义的渐变 */
  background: linear-gradient(to right, var(--primary-gradient-start, #FF9966), var(--primary-gradient-end, #FF5E62));
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 弹窗样式 */
.auth-modal :deep(.ant-modal-title) {
  font-size: 22px;
  font-weight: bold;
}

.auth-modal :deep(.ant-btn-primary) {
  background: linear-gradient(to right, var(--primary-gradient-start, #FF9966), var(--primary-gradient-end, #FF5E62));
  border: none;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
}

.forgot-link {
  font-size: 13px;
  float: right;
  color: var(--primary-color, #F0884C);
}

.switch-auth-modal {
  margin-top: 16px;
  text-align: center;
}

.switch-auth-modal a {
  color: var(--primary-color, #F0884C);
  cursor: pointer;
}

.divider-text {
  margin-top: 24px;
  margin-bottom: 16px;
}

.social-login {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.social-btn {
  border: 1px solid #e8e8e8;
  width: 100%;
  height: 40px;
}

.text-right {
  text-align: right;
}

/* 细节样式修改 */
:deep(.ant-menu-horizontal) {
  border-bottom: none;
}

:deep(.ant-menu-horizontal > .ant-menu-item::after),
:deep(.ant-menu-horizontal > .ant-menu-submenu::after) {
  border-bottom: none !important;
}

:deep(.ant-menu-horizontal > .ant-menu-item-active::after) {
  border-bottom: 2px solid var(--primary-color, #F0884C) !important;
}

:deep(.ant-menu-horizontal > .ant-menu-item-selected::after) {
  border-bottom: 2px solid var(--primary-color, #F0884C) !important;
}

/* 增加悬停效果 */
.login-btn:hover {
  background-color: rgba(240, 136, 76, 0.05);
}

.register-btn:hover {
  opacity: 0.95;
}
</style>