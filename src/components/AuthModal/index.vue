<template>
  <div class="auth-modals">
    <!-- 使用自定义模态框替代a-modal -->
    <div
        class="custom-modal-container"
        :class="{ 'modal-visible': modalVisible }"
    >
      <!-- 背景遮罩 -->
      <div class="custom-modal-mask" @click="handleMaskClick"></div>

      <!-- 模态框本体 -->
      <div class="custom-modal">
        <!-- 右上角关闭按钮 -->
        <button class="custom-modal-close" @click="closeModal">
          <close-outlined />
        </button>

        <!-- 装饰元素 -->
        <div class="modal-decoration">
          <div class="decoration-circle decoration-circle-1"></div>
          <div class="decoration-circle decoration-circle-2"></div>
          <div class="decoration-circle decoration-circle-3"></div>
        </div>

        <!-- 食物图标装饰 -->
        <div class="food-icons">
          <span class="food-icon food-icon-1">🍲</span>
          <span class="food-icon food-icon-2">🥘</span>
          <span class="food-icon food-icon-3">🍜</span>
          <span class="food-icon food-icon-4">🍳</span>
          <span class="food-icon food-icon-5">🥗</span>
        </div>

        <div class="auth-container">
          <!-- 使用transition组件包裹内容 -->
          <transition name="fade" mode="out-in">
            <!-- 登录表单 -->
            <div v-if="formType === 'login'" key="login">
              <div class="auth-header">
                <div class="auth-header-content">
                  <div class="auth-icon">
                    <coffee-outlined />
                  </div>
                  <div class="auth-title-group">
                    <h2 class="auth-title">欢迎回来</h2>
                    <p class="auth-subtitle">登录您的美食探索之旅</p>
                  </div>
                </div>
              </div>

              <a-form
                  :model="loginForm"
                  name="login-form"
                  @finish="handleLogin"
                  :validateMessages="validateMessages"
                  :layout="'vertical'"
              >
                <!-- 登录表单内容 -->
                <a-form-item
                    name="username"
                    :rules="[
                    { required: true, message: '请输入用户名' },
                    { min: 4, message: '用户名不能少于4个字符' }
                  ]"
                >
                  <a-input
                      v-model:value="loginForm.username"
                      placeholder="用户名"
                      size="large"
                      :maxLength="20"
                      class="custom-input"
                  >
                    <template #prefix>
                      <user-outlined class="input-icon"/>
                    </template>
                  </a-input>
                </a-form-item>

                <a-form-item
                    name="password"
                    :rules="[
                    { required: true, message: '请输入密码' },
                    { min: 8, message: '密码不能少于8个字符' }
                  ]"
                >
                  <a-input-password
                      v-model:value="loginForm.password"
                      placeholder="密码"
                      size="large"
                      :maxLength="30"
                      class="custom-input"
                  >
                    <template #prefix>
                      <lock-outlined class="input-icon"/>
                    </template>
                  </a-input-password>
                </a-form-item>

                <div class="form-actions">
                  <a class="forgot-link" @click="handleForgotPassword">忘记密码?</a>
                </div>

                <a-form-item>
                  <a-button
                      type="primary"
                      html-type="submit"
                      class="auth-button"
                      size="large"
                      :loading="loginLoading"
                  >
                    登录
                  </a-button>
                </a-form-item>
              </a-form>

              <div class="auth-footer">
                <p>还没有账号? <a @click="switchForm('register')">立即注册</a></p>
              </div>
            </div>

            <!-- 注册表单 -->
            <div v-else-if="formType === 'register'" key="register">
              <div class="auth-header">
                <div class="auth-header-content">
                  <div class="auth-icon">
                    <fire-outlined />
                  </div>
                  <div class="auth-title-group">
                    <h2 class="auth-title">创建账号</h2>
                    <p class="auth-subtitle">开启您的美食之旅</p>
                  </div>
                </div>
              </div>

              <a-form
                  :model="registerForm"
                  name="register-form"
                  @finish="handleRegister"
                  :validateMessages="validateMessages"
                  :layout="'vertical'"
              >
                <!-- 注册表单内容 -->
                <a-form-item
                    name="username"
                    :rules="[
                    { required: true, message: '请输入用户名' },
                    { min: 4, message: '用户名不能少于4个字符' }
                  ]"
                >
                  <a-input
                      v-model:value="registerForm.username"
                      placeholder="用户名"
                      size="large"
                      :maxLength="20"
                      class="custom-input"
                  >
                    <template #prefix>
                      <user-outlined class="input-icon"/>
                    </template>
                  </a-input>
                </a-form-item>

                <a-form-item
                    name="password"
                    :rules="[
                    { required: true, message: '请输入密码' },
                    { min: 8, message: '密码不能少于8个字符' }
                  ]"
                >
                  <a-input-password
                      v-model:value="registerForm.password"
                      placeholder="密码"
                      size="large"
                      :maxLength="30"
                      class="custom-input"
                  >
                    <template #prefix>
                      <lock-outlined class="input-icon"/>
                    </template>
                  </a-input-password>
                </a-form-item>

                <a-form-item
                    name="confirmPassword"
                    :rules="[
                    { required: true, message: '请确认密码' },
                    { validator: validateConfirmPassword }
                  ]"
                >
                  <a-input-password
                      v-model:value="registerForm.confirmPassword"
                      placeholder="确认密码"
                      size="large"
                      :maxLength="30"
                      class="custom-input"
                  >
                    <template #prefix>
                      <safety-outlined class="input-icon"/>
                    </template>
                  </a-input-password>
                </a-form-item>

                <a-form-item>
                  <a-button
                      type="primary"
                      html-type="submit"
                      class="auth-button"
                      size="large"
                      :loading="registerLoading"
                  >
                    注册
                  </a-button>
                </a-form-item>
              </a-form>

              <div class="auth-footer">
                <p>已有账号? <a @click="switchForm('login')">立即登录</a></p>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  CloseOutlined,
  CoffeeOutlined,
  FireOutlined
} from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

// 模态框可见性和表单类型
const modalVisible = ref(false);
const formType = ref('login'); // 'login' 或 'register'

// 登录表单
const loginLoading = ref(false);
const loginForm = reactive({
  username: '',
  password: ''
});

// 注册表单
const registerLoading = ref(false);
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

// 表单验证消息
const validateMessages = {
  required: '${label}不能为空',
  string: {
    min: '${label}长度不能小于${min}个字符',
  }
};

// 确认密码验证
const validateConfirmPassword = async (_rule: any, value: string) => {
  if (value === '') {
    return Promise.reject('请确认密码');
  } else if (value !== registerForm.password) {
    return Promise.reject('两次输入的密码不一致');
  } else {
    return Promise.resolve();
  }
};

// 切换表单类型（登录/注册）
const switchForm = (type: 'login' | 'register') => {
  formType.value = type;
};

// 关闭模态框
const closeModal = () => {
  modalVisible.value = false;
};

// 处理遮罩点击
const handleMaskClick = () => {
  closeModal();
};

// 显示登录模态框
const showLoginModal = () => {
  formType.value = 'login';
  modalVisible.value = true;
  document.body.style.overflow = 'hidden'; // 防止背景滚动
};

// 显示注册模态框
const showRegisterModal = () => {
  formType.value = 'register';
  modalVisible.value = true;
  document.body.style.overflow = 'hidden'; // 防止背景滚动
};

// 处理键盘ESC关闭
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && modalVisible.value) {
    closeModal();
  }
};

// 忘记密码处理
const handleForgotPassword = () => {
  message.info('忘记密码功能正在开发中，请稍后再试');
};

// 登录处理
const handleLogin = async () => {
  try {
    loginLoading.value = true;

    // 这里应该调用API进行登录验证
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 假设登录成功，创建一个符合UserInfo接口的对象
    const userData = {
      id: 1,
      username: loginForm.username,
      nickname: loginForm.username,
      avatar: 'https://joeschmoe.io/api/v1/' + loginForm.username,
      avatarUrl: 'https://joeschmoe.io/api/v1/' + loginForm.username,
      bio: '这个用户很懒，还没有填写个人简介',
      registerDate: new Date().toISOString().split('T')[0],
      recipesCount: 0,
      ingredientsCount: 0,
      monthlyCookingCount: 0
    };

    // 存储用户信息
    userStore.setUserInfo(userData);
    userStore.setToken('mock-token-' + Date.now());

    // 关闭模态框
    closeModal();

    // 提示登录成功
    message.success('登录成功，欢迎回来！');

    // 如果有重定向地址，跳转到重定向地址
    const redirect = router.currentRoute.value.query.redirect as string;
    if (redirect) {
      router.push(redirect);
    }
  } catch (error) {
    console.error('登录失败:', error);
    message.error('登录失败，请检查用户名和密码');
  } finally {
    loginLoading.value = false;
  }
};

// 注册处理
const handleRegister = async () => {
  try {
    registerLoading.value = true;

    // 这里应该调用API进行注册
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 假设注册成功，创建一个符合UserInfo接口的对象
    const userData = {
      id: 1,
      username: registerForm.username,
      nickname: registerForm.username,
      avatar: 'https://joeschmoe.io/api/v1/' + registerForm.username,
      avatarUrl: 'https://joeschmoe.io/api/v1/' + registerForm.username,
      bio: '这个用户很懒，还没有填写个人简介',
      registerDate: new Date().toISOString().split('T')[0],
      recipesCount: 0,
      ingredientsCount: 0,
      monthlyCookingCount: 0
    };

    // 存储用户信息
    userStore.setUserInfo(userData);
    userStore.setToken('mock-token-' + Date.now());

    // 关闭模态框
    closeModal();

    // 提示注册成功
    message.success('注册成功，欢迎加入！');

    // 如果有重定向地址，跳转到重定向地址
    const redirect = router.currentRoute.value.query.redirect as string;
    if (redirect) {
      router.push(redirect);
    }
  } catch (error) {
    console.error('注册失败:', error);
    message.error('注册失败，请稍后再试');
  } finally {
    registerLoading.value = false;
  }
};

// 监听modalVisible变化以处理body滚动
watch(modalVisible, (newVal) => {
  if (!newVal) {
    document.body.style.overflow = '';
  }
});

// 组件挂载时添加键盘监听
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  // 确保离开时恢复body滚动
  document.body.style.overflow = '';
});

// 导出方法供外部使用
defineExpose({
  showLoginModal,
  showRegisterModal
});
</script>

<style scoped>
/* 自定义模态框样式 */
.custom-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.custom-modal-container.modal-visible {
  opacity: 1;
  visibility: visible;
  pointer-events: all;
}

.custom-modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modal-visible .custom-modal-mask {
  opacity: 1;
}

.custom-modal {
  position: relative;
  width: 440px;
  max-width: 90%;
  background: white;
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transform: translateY(20px) scale(0.98);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
  background: linear-gradient(to bottom, #fff, #fff9f0);
  border: 1px solid rgba(250, 140, 22, 0.15);
}

.modal-visible .custom-modal {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* 装饰圆圈元素 */
.modal-decoration {
  position: absolute;
  top: 0;
  right: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.decoration-circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -60px;
  background: linear-gradient(135deg, #fd7f18, #fa8c16);
}

.decoration-circle-2 {
  width: 120px;
  height: 120px;
  top: 30px;
  right: -60px;
  background: linear-gradient(135deg, #ffa940, #ffd591);
}

.decoration-circle-3 {
  width: 80px;
  height: 80px;
  bottom: 10%;
  left: -20px;
  background: linear-gradient(135deg, #fa8c16, #ffa940);
}

/* 食物图标装饰 */
.food-icons {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.food-icon {
  position: absolute;
  opacity: 0.1;
  font-size: 20px;
  transition: all 0.5s ease;
}

.food-icon-1 {
  top: 8%;
  left: 12%;
  transform: rotate(15deg);
  animation: float 5s ease-in-out infinite, rotate 8s linear infinite;
}

.food-icon-2 {
  bottom: 15%;
  right: 12%;
  transform: rotate(-10deg);
  animation: float 4s ease-in-out infinite reverse, rotate 10s linear infinite reverse;
}

.food-icon-3 {
  top: 35%;
  right: 10%;
  transform: rotate(5deg);
  animation: float 6s ease-in-out infinite, rotate 12s linear infinite;
}

.food-icon-4 {
  bottom: 25%;
  left: 15%;
  transform: rotate(-8deg);
  animation: float 5.5s ease-in-out infinite, rotate 9s linear infinite reverse;
}

.food-icon-5 {
  top: 45%;
  left: 8%;
  transform: rotate(12deg);
  animation: float 4.5s ease-in-out infinite, rotate 11s linear infinite;
}

@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.custom-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s ease;
  border-radius: 50%;
}

.custom-modal-close:hover {
  background-color: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.85);
}

/* 更紧凑的布局 */
.auth-container {
  padding: 15px 25px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* 改进的头部样式 */
.auth-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 18px;
  position: relative;
  padding-bottom: 5px;
  width: 100%;
}

.auth-header:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 2px;
  background: linear-gradient(to right, rgba(250, 140, 22, 0.1), rgba(250, 140, 22, 0.6), rgba(250, 140, 22, 0.1));
  border-radius: 2px;
}

.auth-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fa8c16, #ffa940);
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(250, 140, 22, 0.3);
  flex-shrink: 0;
  animation: fadeIn 0.5s ease forwards;
}

.auth-title-group {
  text-align: left;
}

.auth-title {
  font-size: 22px;
  font-weight: 600;
  color: #fa8c16;
  margin: 0 0 2px 0;
  background: linear-gradient(135deg, #fa8c16, #ffa940);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.auth-subtitle {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
  line-height: 1.2;
}

.input-icon {
  color: rgba(0, 0, 0, 0.25);
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 16px !important;
}

/* 调整输入框尺寸 */
:deep(.ant-input.custom-input),
:deep(.ant-input-affix-wrapper.custom-input),
:deep(.ant-input-password.custom-input) {
  border: 1px solid #d9d9d9 !important;
  border-bottom: 2px solid rgba(250, 140, 22, 0.3) !important;
  border-radius: 12px !important;
  height: 38px !important;
  max-width: 360px !important;
  margin: 0 auto !important;
  transition: all 0.3s ease !important;
}

/* 悬停状态 */
:deep(.ant-input.custom-input:hover),
:deep(.ant-input-affix-wrapper.custom-input:hover),
:deep(.ant-input-password.custom-input:hover) {
  border-color: #fa8c16 !important;
  border-bottom: 2px solid rgba(250, 140, 22, 0.6) !important;
  box-shadow: 0 0 0 2px rgba(250, 140, 22, 0.1) !important;
}

/* 聚焦状态 */
:deep(.ant-input.custom-input:focus),
:deep(.ant-input-affix-wrapper.custom-input:focus),
:deep(.ant-input-affix-wrapper.custom-input:focus-within),
:deep(.ant-input-affix-wrapper-focused.custom-input),
:deep(.ant-input-password.custom-input:focus-within) {
  border-color: #fa8c16 !important;
  border-bottom: 2px solid #fa8c16 !important;
  box-shadow: 0 0 0 2px rgba(250, 140, 22, 0.2) !important;
  outline: none !important;
  transform: translateY(-1px);
  animation: pulse 2s infinite;
}

/* 密码框内部输入框处理 */
:deep(.ant-input-password.custom-input .ant-input) {
  border: none !important;
  box-shadow: none !important;
}

/* 错误状态 */
:deep(.ant-form-item-has-error .ant-input.custom-input),
:deep(.ant-form-item-has-error .ant-input-affix-wrapper.custom-input),
:deep(.ant-form-item-has-error .ant-input-password.custom-input),
:deep(.ant-form-item-has-error .ant-input.custom-input:focus),
:deep(.ant-form-item-has-error .ant-input-affix-wrapper.custom-input:focus-within),
:deep(.ant-form-item-has-error .ant-input-password.custom-input:focus-within) {
  border-color: #ff4d4f !important;
  border-bottom: 2px solid #ff4d4f !important;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1) !important;
}


/* 登录按钮的闪光效果 */
.auth-button {
  position: relative;
  overflow: hidden;
  width: 360px !important;
  max-width: 100% !important;
  margin: 0 auto !important;
  height: 44px !important;
  border-radius: 12px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  background: linear-gradient(135deg, #fa8c16, #ffa940) !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(250, 140, 22, 0.3) !important;
  transition: all 0.3s ease !important;
  letter-spacing: 2px !important;
}

.auth-button:after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(30deg);
  background-position: -100px;
  background-repeat: no-repeat;
}

.auth-button:hover {
  background: linear-gradient(135deg, #ff9928, #ffb54e) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 18px rgba(250, 140, 22, 0.35) !important;
}

.auth-button:hover:after {
  animation: shine 1.5s forwards;
}

@keyframes shine {
  0% { background-position: -100px; }
  20% { background-position: 200px; }
  100% { background-position: 200px; }
}

/* 给输入框添加呼吸光效果 */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(250, 140, 22, 0.1); }
  70% { box-shadow: 0 0 0 6px rgba(250, 140, 22, 0); }
  100% { box-shadow: 0 0 0 0 rgba(250, 140, 22, 0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 修改 form-actions 样式，使其单个元素靠右对齐 */
.form-actions {
  display: flex;
  justify-content: flex-end; /* 改为右对齐 */
  max-width: 360px;
  width: 100%;
  margin: 0 auto 12px auto;
}

/* 忘记密码链接样式微调 */
.forgot-link {
  color: #fa8c16;
  transition: color 0.3s ease;
  text-decoration: none !important;
  font-size: 14px; /* 可选：添加字体大小确保统一 */
}

.forgot-link:hover {
  color: #ffa940;
  text-decoration: none !important;
}

/* 超链接样式 - 禁用下划线 */
a {
  text-decoration: none !important;
}

a:hover, a:focus, a:active {
  text-decoration: none !important;
}

.auth-footer {
  text-align: center;
  margin-top: 12px;
}

.auth-footer a {
  color: #fa8c16;
  font-weight: 500;
  transition: color 0.3s ease;
}

.auth-footer a:hover {
  color: #ffa940;
  text-decoration: underline;
}

/* 表单项间距调整 */
:deep(.ant-form-item) {
  margin-bottom: 16px !important;
}

:deep(.ant-form-item-with-help) {
  margin-bottom: 0 !important;
}

/* 保留内部表单的过渡动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 响应式适配 */
@media (max-width: 576px) {
  .custom-modal {
    width: 95%;
    max-width: 520px;
  }

  .auth-container {
    padding: 20px 24px;
  }

  .auth-title {
    font-size: 24px;
  }

  .auth-subtitle {
    font-size: 14px;
  }
}


</style>