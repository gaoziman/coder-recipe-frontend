<template>
  <div class="auth-container">
    <!-- 登录弹窗 -->
    <a-modal
        v-model:visible="loginVisible"
        :footer="null"
        :width="420"
        :destroyOnClose="false"
        @cancel="resetForms"
        :maskClosable="false"
        class="auth-modal"
        :class="{'modal-leaving': isLoginLeaving}"
    >
      <div class="auth-header">
        <div class="auth-logo">
          <span class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3L17 9L21 10L17 12L15 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 3L7 9L3 10L7 12L9 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
          <h2 class="auth-title">账号登录</h2>
        </div>
        <p class="auth-subtitle">欢迎回来，请登录您的账号</p>
      </div>

      <a-form
          :model="loginForm"
          :rules="loginRules"
          layout="vertical"
          @finish="handleLogin"
          ref="loginFormRef"
      >
        <a-form-item label="用户名" name="username">
          <a-input
              v-model:value="loginForm.username"
              placeholder="请输入您的用户名"
              :maxLength="50"
              size="large"
          >
            <template #prefix>
              <user-outlined class="form-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password
              v-model:value="loginForm.password"
              placeholder="请输入您的密码"
              :maxLength="20"
              size="large"
          >
            <template #prefix>
              <lock-outlined class="form-icon" />
            </template>
          </a-input-password>
          <div class="text-right">
            <a class="forgot-link">忘记密码？</a>
          </div>
        </a-form-item>

        <div class="form-error" v-if="loginError">{{ loginError }}</div>

        <a-button
            type="primary"
            html-type="submit"
            block
            size="large"
            :loading="isLoading"
            class="submit-btn"
        >
          登录
        </a-button>

        <div class="switch-auth-modal">
          <p>还没有账号？ <a @click="switchToRegister" class="switch-link">立即注册</a></p>
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

    <!-- 注册弹窗 -->
    <a-modal
        v-model:visible="registerVisible"
        :footer="null"
        :width="420"
        :destroyOnClose="false"
        @cancel="resetForms"
        :maskClosable="false"
        class="auth-modal"
        :class="{'modal-leaving': isRegisterLeaving}"
    >
      <div class="auth-header">
        <div class="auth-logo">
          <span class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3L17 9L21 10L17 12L15 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 3L7 9L3 10L7 12L9 18" stroke="#F0884C" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
          <h2 class="auth-title">创建账号</h2>
        </div>
        <p class="auth-subtitle">加入我们，发现更多美食灵感</p>
      </div>

      <a-form
          :model="registerForm"
          :rules="registerRules"
          layout="vertical"
          @finish="handleRegister"
          ref="registerFormRef"
      >
        <a-form-item label="用户名" name="username">
          <a-input
              v-model:value="registerForm.username"
              placeholder="请设置您的用户名"
              :maxLength="20"
              size="large"
          >
            <template #prefix>
              <user-outlined class="form-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
            label="密码"
            name="password"
            :extra="passwordStrength.message"
        >
          <a-input-password
              v-model:value="registerForm.password"
              placeholder="请设置您的密码"
              :maxLength="20"
              size="large"
              @change="checkPasswordStrength"
          >
            <template #prefix>
              <lock-outlined class="form-icon" />
            </template>
          </a-input-password>

          <div class="password-strength">
            <div
                class="strength-bar"
                :style="{ width: passwordStrength.percent + '%', backgroundColor: passwordStrength.color }"
            ></div>
          </div>
        </a-form-item>

        <a-form-item label="确认密码" name="confirmPassword">
          <a-input-password
              v-model:value="registerForm.confirmPassword"
              placeholder="请再次输入您的密码"
              :maxLength="20"
              size="large"
          >
            <template #prefix>
              <safety-outlined class="form-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="agreement">
          <a-checkbox v-model:checked="registerForm.agreement">
            我已阅读并同意<a>用户协议</a>和<a>隐私政策</a>
          </a-checkbox>
        </a-form-item>

        <div class="form-error" v-if="registerError">{{ registerError }}</div>

        <a-button
            type="primary"
            html-type="submit"
            block
            size="large"
            :loading="isLoading"
            class="submit-btn"
            :disabled="!registerForm.agreement"
        >
          注册
        </a-button>

        <div class="switch-auth-modal">
          <p>已有账号？ <a @click="switchToLogin" class="switch-link">立即登录</a></p>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import {
  WechatOutlined,
  WeiboOutlined,
  QqOutlined,
  UserOutlined,
  LockOutlined,
  SafetyOutlined
} from '@ant-design/icons-vue'

// 引入Pinia Store
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()

// 控制登录弹窗显示
const loginVisible = ref(false)
const registerVisible = ref(false)
const isLoading = ref(false)
const isLoginLeaving = ref(false)
const isRegisterLeaving = ref(false)

// 登录表单
const loginForm = reactive({
  username: '',
  password: ''
})

// 注册表单
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

// 密码强度评估
const passwordStrength = reactive({
  percent: 0,
  color: '#e6e6e6',
  message: ''
})

// 错误信息
const loginError = ref('')
const registerError = ref('')

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ]
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在2-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: async (rule: any, value: string) => {
        if (value !== registerForm.password) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ],
  agreement: [
    {
      validator: async (rule: any, value: boolean) => {
        if (!value) {
          return Promise.reject('请阅读并同意用户协议和隐私政策')
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ]
}

// 检查密码强度
const checkPasswordStrength = () => {
  const password = registerForm.password

  if (!password) {
    passwordStrength.percent = 0
    passwordStrength.color = '#e6e6e6'
    passwordStrength.message = ''
    return
  }

  let strength = 0
  // 检查长度
  if (password.length >= 8) strength += 25
  // 检查是否包含小写字母
  if (/[a-z]/.test(password)) strength += 25
  // 检查是否包含大写字母
  if (/[A-Z]/.test(password)) strength += 25
  // 检查是否包含数字或特殊字符
  if (/[0-9\W]/.test(password)) strength += 25

  passwordStrength.percent = strength

  if (strength < 50) {
    passwordStrength.color = '#ff4d4f'
    passwordStrength.message = '密码强度较弱'
  } else if (strength < 75) {
    passwordStrength.color = '#faad14'
    passwordStrength.message = '密码强度中等'
  } else {
    passwordStrength.color = '#52c41a'
    passwordStrength.message = '密码强度较高'
  }
}

// 处理登录
const handleLogin = async () => {
  try {
    loginError.value = ''
    isLoading.value = true

    // 表单验证
    await loginFormRef.value?.validate()

    // 调用登录方法（修改为传入用户名）
    const result = await userStore.login(loginForm.username, loginForm.password)

    if (result.success) {
      message.success('登录成功')
      closeModals()
    } else {
      loginError.value = result.error || '登录失败，请稍后再试'
    }
  } catch (error) {
    // 表单验证失败
    console.error('表单验证失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  try {
    registerError.value = ''
    isLoading.value = true

    // 表单验证
    await registerFormRef.value?.validate()

    // 调用注册方法（只传入用户名和密码）
    const result = await userStore.register(
        registerForm.username,
        registerForm.password
    )

    if (result.success) {
      message.success('注册成功')
      closeModals()
    } else {
      registerError.value = result.error || '注册失败，请稍后再试'
    }
  } catch (error) {
    // 表单验证失败
    console.error('表单验证失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 切换到注册弹窗 - 优化版
const switchToRegister = () => {
  // 标记登录模态框正在离开
  isLoginLeaving.value = true

  // 短暂延迟后开始显示注册模态框，无需等待登录模态框完全关闭
  setTimeout(() => {
    registerVisible.value = true
    // 重置离开状态
    setTimeout(() => {
      loginVisible.value = false
      isLoginLeaving.value = false
    }, 300)
  }, 150)
}

// 切换到登录弹窗 - 优化版
const switchToLogin = () => {
  // 标记注册模态框正在离开
  isRegisterLeaving.value = true

  // 短暂延迟后开始显示登录模态框，无需等待注册模态框完全关闭
  setTimeout(() => {
    loginVisible.value = true
    // 重置离开状态
    setTimeout(() => {
      registerVisible.value = false
      isRegisterLeaving.value = false
    }, 300)
  }, 150)
}

// 重置表单
const resetForms = () => {
  loginFormRef.value?.resetFields()
  registerFormRef.value?.resetFields()
  loginError.value = ''
  registerError.value = ''
  passwordStrength.percent = 0
  passwordStrength.color = '#e6e6e6'
  passwordStrength.message = ''
}

// 关闭所有弹窗
const closeModals = () => {
  loginVisible.value = false
  registerVisible.value = false
  resetForms()
}

// 导出方法供外部组件调用
defineExpose({
  showLogin: () => {
    loginVisible.value = true
  },
  showRegister: () => {
    registerVisible.value = true
  },
  closeModals
})
</script>

<style scoped>
.auth-modal :deep(.ant-modal-content) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.auth-modal :deep(.ant-modal-body) {
  padding: 28px 32px;
}

.auth-header {
  text-align: center;
  margin-bottom: 28px;
}

.auth-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
}

.logo-icon {
  margin-bottom: 12px;
  animation: pulse 1.5s infinite alternate ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

.auth-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.auth-subtitle {
  font-size: 14px;
  color: #888;
  margin: 0;
}

/* 表单样式 */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-input),
:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
  transition: all 0.3s;
}

:deep(.ant-input:focus),
:deep(.ant-input-affix-wrapper:focus),
:deep(.ant-input-affix-wrapper-focused) {
  border-color: var(--primary-color, #F0884C);
  box-shadow: 0 0 0 2px rgba(240, 136, 76, 0.1);
}

.form-icon {
  color: #bbb;
  font-size: 16px;
}

.submit-btn {
  height: 44px;
  font-size: 16px;
  margin-top: 8px;
  border-radius: 8px;
  background: linear-gradient(to right, var(--primary-gradient-start, #FF9966), var(--primary-gradient-end, #FF5E62));
  border: none;
  font-weight: 500;
  letter-spacing: 1px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.submit-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 94, 98, 0.2);
}

.forgot-link,
.switch-link {
  color: var(--primary-color, #F0884C);
  transition: all 0.3s;
}

.forgot-link:hover,
.switch-link:hover {
  color: #ff5e62;
  text-decoration: none;
}

.switch-auth-modal {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
}

.text-right {
  text-align: right;
  margin-top: 4px;
}

.divider-text {
  margin-top: 24px;
  margin-bottom: 16px;
}

.divider-text :deep(.ant-divider-inner-text) {
  font-size: 13px;
  color: #aaa;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.social-btn {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 密码强度指示器 */
.password-strength {
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  transition: width 0.3s, background-color 0.3s;
}

/* 错误提示 */
.form-error {
  color: #ff4d4f;
  margin-bottom: 12px;
  font-size: 14px;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-container {
  position: relative;
}

.auth-modal {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1) translateY(0);
  opacity: 1;
}

.modal-leaving {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

/* 为模态框内容添加进入动画 */
.auth-modal :deep(.ant-modal-content) {
  animation: modalContentEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalContentEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为表单项添加连续进入动画 */
.auth-modal :deep(.ant-form-item) {
  animation: formItemEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: both;
}

.auth-modal :deep(.ant-form-item:nth-child(1)) {
  animation-delay: 0.1s;
}

.auth-modal :deep(.ant-form-item:nth-child(2)) {
  animation-delay: 0.15s;
}

.auth-modal :deep(.ant-form-item:nth-child(3)) {
  animation-delay: 0.2s;
}

.auth-modal :deep(.ant-form-item:nth-child(4)) {
  animation-delay: 0.25s;
}

@keyframes formItemEnter {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 为登录按钮添加明显的进入动画 */
.submit-btn {
  animation: submitBtnEnter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation-delay: 0.3s;
  animation-fill-mode: both;
}

@keyframes submitBtnEnter {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 为切换链接添加呼吸动画，增加引导性 */
.switch-link {
  position: relative;
  display: inline-block;
  animation: breathe 2s infinite alternate ease-in-out;
}

@keyframes breathe {
  from {
    transform: scale(1);
    text-shadow: 0 0 0 rgba(255, 94, 98, 0);
  }
  to {
    transform: scale(1.05);
    text-shadow: 0 0 5px rgba(255, 94, 98, 0.3);
  }
}

/* 动态背景效果 */
.auth-header {
  position: relative;
  overflow: hidden;
}

.auth-header::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(135deg, rgba(255, 153, 102, 0.1) 0%, rgba(255, 94, 98, 0.1) 100%);
  transform-origin: center;
  animation: rotateGradient 15s infinite linear;
  z-index: -1;
  border-radius: 30%;
}

@keyframes rotateGradient {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>