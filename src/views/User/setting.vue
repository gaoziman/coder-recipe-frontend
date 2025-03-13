<template>
  <div class="settings-container">
    <div class="settings-content">
      <!-- 左侧个人信息 -->
      <div class="profile-sidebar">
        <user-profile-card :user="userInfo" />
      </div>

      <!-- 右侧内容区 -->
      <div class="settings-main">
        <a-card class="settings-card" :bordered="false">
          <template #title>
            <h3 class="card-title">个人设置</h3>
          </template>

          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="基本信息">
              <div class="settings-form">
                <a-form :model="userForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                  <a-form-item label="头像">
                    <div class="avatar-uploader">
                      <div class="avatar-wrapper">
                        <img :src="userForm.avatar || 'https://via.placeholder.com/100'" alt="头像" />
                        <div class="avatar-overlay">
                          <upload-outlined />
                        </div>
                      </div>
                      <div class="avatar-tip">
                        <p>推荐使用正方形图片，最小尺寸 200×200 像素</p>
                      </div>
                    </div>
                  </a-form-item>

                  <a-form-item label="昵称">
                    <a-input v-model:value="userForm.nickname" placeholder="请输入昵称" />
                  </a-form-item>

                  <a-form-item label="个人简介">
                    <a-textarea
                        v-model:value="userForm.bio"
                        placeholder="介绍一下你自己，让更多人了解你（最多200字）"
                        :auto-size="{ minRows: 3, maxRows: 5 }"
                        :maxlength="200"
                        show-count
                    />
                  </a-form-item>

                  <a-form-item :wrapper-col="{ offset: 4 }">
                    <a-button type="primary" @click="saveUserInfo">保存更改</a-button>
                  </a-form-item>
                </a-form>
              </div>
            </a-tab-pane>

            <a-tab-pane key="2" tab="通知设置">
              <div class="notification-settings">
                <a-list :split="false">
                  <a-list-item>
                    <div class="notification-item">
                      <div>
                        <h4 class="notification-title">菜谱收藏提醒</h4>
                        <p class="notification-desc">当你收藏的菜谱有更新时提醒你</p>
                      </div>
                      <a-switch v-model:checked="notificationSettings.recipeUpdate" />
                    </div>
                  </a-list-item>

                  <a-list-item>
                    <div class="notification-item">
                      <div>
                        <h4 class="notification-title">社区互动通知</h4>
                        <p class="notification-desc">当其他用户评论或点赞你的内容时通知你</p>
                      </div>
                      <a-switch v-model:checked="notificationSettings.interaction" />
                    </div>
                  </a-list-item>

                  <a-list-item>
                    <div class="notification-item">
                      <div>
                        <h4 class="notification-title">烹饪提醒</h4>
                        <p class="notification-desc">根据你的计划提醒你准备食材和烹饪</p>
                      </div>
                      <a-switch v-model:checked="notificationSettings.cookingReminder" />
                    </div>
                  </a-list-item>

                  <a-list-item>
                    <div class="notification-item">
                      <div>
                        <h4 class="notification-title">每周推荐</h4>
                        <p class="notification-desc">根据你的口味偏好每周推荐新菜谱</p>
                      </div>
                      <a-switch v-model:checked="notificationSettings.weeklyRecommend" />
                    </div>
                  </a-list-item>
                </a-list>

                <div class="notification-actions">
                  <a-button  type="primary" @click="saveNotificationSettings">保存设置</a-button>
                </div>
              </div>
            </a-tab-pane>

            <a-tab-pane key="3" tab="隐私设置">
              <div class="privacy-settings">
                <a-list :split="false">
                  <a-list-item>
                    <div class="privacy-item">
                      <div>
                        <h4 class="privacy-title">个人主页可见性</h4>
                        <p class="privacy-desc">选择谁可以查看你的个人主页</p>
                      </div>
                      <a-select
                          v-model:value="privacySettings.profileVisibility"
                          style="width: 120px"
                      >
                        <a-select-option value="public">所有人</a-select-option>
                        <a-select-option value="friends">仅好友</a-select-option>
                        <a-select-option value="private">仅自己</a-select-option>
                      </a-select>
                    </div>
                  </a-list-item>

                  <a-list-item>
                    <div class="privacy-item">
                      <div>
                        <h4 class="privacy-title">烹饪记录可见性</h4>
                        <p class="privacy-desc">选择谁可以看到你的烹饪记录</p>
                      </div>
                      <a-select
                          v-model:value="privacySettings.cookingRecordVisibility"
                          style="width: 120px"
                      >
                        <a-select-option value="public">所有人</a-select-option>
                        <a-select-option value="friends">仅好友</a-select-option>
                        <a-select-option value="private">仅自己</a-select-option>
                      </a-select>
                    </div>
                  </a-list-item>

                  <a-list-item>
                    <div class="privacy-item">
                      <div>
                        <h4 class="privacy-title">数据分享</h4>
                        <p class="privacy-desc">允许分享匿名数据以改进推荐</p>
                      </div>
                      <a-switch v-model:checked="privacySettings.dataSharing" />
                    </div>
                  </a-list-item>
                </a-list>

                <div class="privacy-actions">
                  <a-button  type="primary" @click="savePrivacySettings">保存设置</a-button>
                </div>
              </div>
            </a-tab-pane>

            <a-tab-pane key="4" tab="账号安全">
              <div class="security-settings">
                <a-list :split="false">
                  <a-list-item>
                    <div class="security-item">
                      <div>
                        <h4 class="security-title">修改密码</h4>
                        <p class="security-desc">定期更改密码可以提高账号安全性</p>
                      </div>
                      <a-button type="dashed" @click="showPasswordModal">修改</a-button>
                    </div>
                  </a-list-item>

                  <a-list-item>
                    <div class="security-item">
                      <div>
                        <h4 class="security-title">绑定手机</h4>
                        <p class="security-desc">{{ userInfo.phone ? '已绑定：' + maskPhone(userInfo.phone) : '绑定手机号码以保护账号安全' }}</p>
                      </div>
                      <a-button type="dashed" @click="showPhoneModal">{{ userInfo.phone ? '更换' : '绑定' }}</a-button>
                    </div>
                  </a-list-item>

                  <a-list-item>
                    <div class="security-item">
                      <div>
                        <h4 class="security-title">绑定邮箱</h4>
                        <p class="security-desc">{{ userInfo.email ? '已绑定：' + maskEmail(userInfo.email) : '绑定邮箱以接收重要通知' }}</p>
                      </div>
                      <a-button type="dashed" @click="showEmailModal">{{ userInfo.email ? '更换' : '绑定' }}</a-button>
                    </div>
                  </a-list-item>

                  <a-list-item>
                    <div class="security-item">
                      <div>
                        <h4 class="security-title">登录设备管理</h4>
                        <p class="security-desc">查看并管理已登录的设备</p>
                      </div>
                      <a-button  type="dashed" @click="showDevicesModal">管理</a-button>
                    </div>
                  </a-list-item>
                </a-list>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <a-modal
        v-model:visible="passwordModalVisible"
        title="修改密码"
        @ok="changePassword"
        :maskClosable="false"
    >
      <a-form
          :model="passwordForm"
          layout="vertical"
      >
        <a-form-item label="当前密码" name="currentPassword">
          <a-input-password v-model:value="passwordForm.currentPassword" placeholder="请输入当前密码" />
        </a-form-item>
        <a-form-item label="新密码" name="newPassword">
          <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item label="确认新密码" name="confirmPassword">
          <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 绑定手机弹窗 -->
    <a-modal
        v-model:visible="phoneModalVisible"
        title="绑定手机"
        @ok="savePhoneNumber"
        :maskClosable="false"
    >
      <a-form layout="vertical">
        <a-form-item label="手机号码" name="phone">
          <a-input v-model:value="phoneForm.number" placeholder="请输入11位手机号码" />
        </a-form-item>
        <a-form-item label="验证码" name="code">
          <div style="display: flex; gap: 8px;">
            <a-input v-model:value="phoneForm.code" placeholder="请输入验证码" style="flex: 1;" />
            <a-button :disabled="phoneForm.countdown > 0" @click="sendPhoneCode">
              {{ phoneForm.countdown > 0 ? `${phoneForm.countdown}秒后重发` : '获取验证码' }}
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 绑定邮箱弹窗 -->
    <a-modal
        v-model:visible="emailModalVisible"
        title="绑定邮箱"
        @ok="saveEmail"
        :maskClosable="false"
    >
      <a-form layout="vertical">
        <a-form-item label="邮箱地址" name="email">
          <a-input v-model:value="emailForm.address" placeholder="请输入邮箱地址" />
        </a-form-item>
        <a-form-item label="验证码" name="code">
          <div style="display: flex; gap: 8px;">
            <a-input v-model:value="emailForm.code" placeholder="请输入验证码" style="flex: 1;" />
            <a-button :disabled="emailForm.countdown > 0" @click="sendEmailCode">
              {{ emailForm.countdown > 0 ? `${emailForm.countdown}秒后重发` : '获取验证码' }}
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 设备管理弹窗 -->
    <a-modal
        v-model:visible="devicesModalVisible"
        title="登录设备管理"
        :footer="null"
        width="600px"
        :maskClosable="false"
    >
      <div class="devices-list">
        <a-list
            itemLayout="horizontal"
            :dataSource="devicesList"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #avatar>
                  <div class="device-icon">
                    <component :is="getDeviceIcon(item.type)" />
                  </div>
                </template>
                <template #title>
                  <div class="device-title">
                    {{ item.name }}
                    <a-tag v-if="item.current" color="green">当前设备</a-tag>
                  </div>
                </template>
                <template #description>
                  <div class="device-info">
                    <p>{{ item.os }} · {{ item.browser }}</p>
                    <p>最近登录: {{ item.lastLogin }}</p>
                    <p>IP地址: {{ item.ip }} · {{ item.location }}</p>
                  </div>
                </template>
              </a-list-item-meta>
              <template #extra>
                <a-button
                    danger
                    :disabled="item.current"
                    @click="logoutDevice(item.id)"
                >
                  退出登录
                </a-button>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import {DesktopOutlined, MobileOutlined, TabletOutlined, UploadOutlined} from '@ant-design/icons-vue';
import UserProfileCard from '@/components/ProfileSidebar/index.vue'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 表单数据
const userForm = reactive({
  avatar: userInfo.value?.avatar || '',
  nickname: userInfo.value?.nickname || '',
  bio: userInfo.value?.bio || ''
})

// 通知设置
const notificationSettings = reactive({
  recipeUpdate: true,
  interaction: true,
  cookingReminder: false,
  weeklyRecommend: true
})

// 隐私设置
const privacySettings = reactive({
  profileVisibility: 'public',
  cookingRecordVisibility: 'friends',
  dataSharing: true
})

// 密码修改相关
const passwordModalVisible = ref(false)
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 显示密码修改弹窗
const showPasswordModal = () => {
  passwordModalVisible.value = true
}

// 修改密码
const changePassword = () => {
  // 验证表单
  if (!passwordForm.currentPassword) {
    message.error('请输入当前密码')
    return
  }

  if (!passwordForm.newPassword) {
    message.error('请输入新密码')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error('两次输入的密码不一致')
    return
  }

  // 调用API修改密码
  message.success('密码修改成功')
  passwordModalVisible.value = false
  // 清空表单
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

// 电话相关
const phoneModalVisible = ref(false)
const phoneForm = reactive({
  number: '',
  code: '',
  countdown: 0
})

// 邮箱相关
const emailModalVisible = ref(false)
const emailForm = reactive({
  address: '',
  code: '',
  countdown: 0
})

// 设备管理相关
const devicesModalVisible = ref(false)
const devicesList = ref([
  {
    id: 1,
    name: 'Windows 电脑',
    type: 'desktop',
    os: 'Windows 11',
    browser: 'Chrome 122',
    lastLogin: '2025-03-13 08:32',
    ip: '192.168.1.1',
    location: '广东省深圳市',
    current: true
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    type: 'mobile',
    os: 'iOS 17',
    browser: 'Safari',
    lastLogin: '2025-03-12 20:15',
    ip: '118.122.xx.xx',
    location: '广东省广州市',
    current: false
  },
  {
    id: 3,
    name: 'iPad Air',
    type: 'tablet',
    os: 'iPadOS 17',
    browser: 'Safari',
    lastLogin: '2025-03-10 12:44',
    ip: '220.181.xx.xx',
    location: '北京市海淀区',
    current: false
  }
])

// 手机号脱敏显示
const maskPhone = (phone: string) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 邮箱脱敏显示
const maskEmail = (email: string) => {
  if (!email) return ''
  const parts = email.split('@')
  if (parts.length !== 2) return email

  let name = parts[0]
  if (name.length <= 2) {
    return name[0] + '***@' + parts[1]
  } else {
    return name.substring(0, 2) + '***@' + parts[1]
  }
}

// 保存用户信息
const saveUserInfo = () => {
  message.success('个人信息保存成功')
}

// 保存通知设置
const saveNotificationSettings = () => {
  message.success('通知设置保存成功')
}

// 保存隐私设置
const savePrivacySettings = () => {
  message.success('隐私设置保存成功')
}

// 显示绑定手机弹窗
const showPhoneModal = () => {
  phoneModalVisible.value = true
  // 如果已有手机号，预填表单
  if (userInfo.value?.phone) {
    phoneForm.number = userInfo.value.phone
  }
}

// 发送手机验证码
const sendPhoneCode = () => {
  if (!phoneForm.number) {
    message.error('请输入手机号码')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(phoneForm.number)) {
    message.error('请输入正确的手机号码格式')
    return
  }

  // 模拟发送验证码
  message.success(`验证码已发送至 ${maskPhone(phoneForm.number)}`)

  // 开始倒计时
  phoneForm.countdown = 60
  const timer = setInterval(() => {
    phoneForm.countdown--
    if (phoneForm.countdown <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 保存手机号
const savePhoneNumber = () => {
  if (!phoneForm.number || !phoneForm.code) {
    message.error('请填写完整信息')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(phoneForm.number)) {
    message.error('请输入正确的手机号码格式')
    return
  }

  // 模拟验证成功
  message.success('手机绑定成功')

  // 更新用户信息
  if (userStore.userInfo) {
    userStore.updateUserInfo({ phone: phoneForm.number })
  }

  // 关闭弹窗并重置表单
  phoneModalVisible.value = false
  phoneForm.code = ''
  phoneForm.countdown = 0
}

// 显示绑定邮箱弹窗
const showEmailModal = () => {
  emailModalVisible.value = true
  // 如果已有邮箱，预填表单
  if (userInfo.value?.email) {
    emailForm.address = userInfo.value.email
  }
}

// 发送邮箱验证码
const sendEmailCode = () => {
  if (!emailForm.address) {
    message.error('请输入邮箱地址')
    return
  }

  if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(emailForm.address)) {
    message.error('请输入正确的邮箱格式')
    return
  }

  // 模拟发送验证码
  message.success(`验证码已发送至 ${maskEmail(emailForm.address)}`)

  // 开始倒计时
  emailForm.countdown = 60
  const timer = setInterval(() => {
    emailForm.countdown--
    if (emailForm.countdown <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 保存邮箱
const saveEmail = () => {
  if (!emailForm.address || !emailForm.code) {
    message.error('请填写完整信息')
    return
  }

  if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(emailForm.address)) {
    message.error('请输入正确的邮箱格式')
    return
  }

  // 模拟验证成功
  message.success('邮箱绑定成功')

  // 更新用户信息
  if (userStore.userInfo) {
    userStore.updateUserInfo({ email: emailForm.address })
  }

  // 关闭弹窗并重置表单
  emailModalVisible.value = false
  emailForm.code = ''
  emailForm.countdown = 0
}

// 显示设备管理弹窗
const showDevicesModal = () => {
  devicesModalVisible.value = true
}

// 获取设备图标
const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'desktop':
      return DesktopOutlined
    case 'mobile':
      return MobileOutlined
    case 'tablet':
      return TabletOutlined
    default:
      return DesktopOutlined
  }
}

// 退出设备登录
const logoutDevice = (deviceId: number) => {
  // 模拟API调用
  message.success('已成功退出该设备的登录')

  // 更新设备列表
  devicesList.value = devicesList.value.filter(device => device.id !== deviceId)
}

// 初始化 - 在真实项目中应该从API获取数据
onMounted(() => {
  // 加载用户数据
  if (!userStore.isLoaded) {
    userStore.fetchUserInfo()
  }

  // 加载设置数据
  // 在这里你可以添加获取用户设置的API调用
})
</script>

<style scoped>
.settings-container {
  padding: 24px 0;
}

.settings-content {
  display: flex;
  gap: 32px;
}

.profile-sidebar {
  width: 320px;
  flex-shrink: 0;
}

.settings-main {
  flex: 1;
}

.settings-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

/* 表单样式 */
.settings-form {
  max-width: 600px;
  margin: 24px 0;
}

/* 头像上传样式 */
.avatar-uploader {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.avatar-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-tip {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

/* 通知设置项样式 */
.notification-item,
.privacy-item,
.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 0;
}

.notification-title,
.privacy-title,
.security-title {
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 4px 0;
}

.notification-desc,
.privacy-desc,
.security-desc {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  margin: 0;
}

.notification-actions,
.privacy-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

/* 设备列表样式 */
.device-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fa8c16;
  font-size: 20px;
}

.device-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.device-info p {
  margin: 0;
  line-height: 1.6;
}

/* 响应式适配 */
@media (max-width: 992px) {
  .settings-content {
    flex-direction: column;
  }

  .profile-sidebar {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .notification-item,
  .privacy-item,
  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .notification-item > :last-child,
  .privacy-item > :last-child,
  .security-item > :last-child {
    align-self: flex-end;
  }
}
</style>