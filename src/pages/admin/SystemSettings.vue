<!-- SystemSettings.vue -->
<template>
  <div class="system-settings">
    <div class="page-header">
      <h2 class="page-title">系统设置</h2>
      <div class="page-actions">
        <a-button type="primary" @click="saveSettings">
          <template #icon><save-outlined /></template>
          保存设置
        </a-button>
      </div>
    </div>

    <a-tabs default-active-key="1" tab-position="left" class="settings-tabs">
      <a-tab-pane key="1" tab="基础设置">
        <div class="settings-card">
          <a-form :model="basicSettings" layout="vertical">
            <a-form-item label="网站名称" name="siteName">
              <a-input v-model:value="basicSettings.siteName" placeholder="请输入网站名称" />
            </a-form-item>
            <a-form-item label="网站描述" name="siteDescription">
              <a-textarea v-model:value="basicSettings.siteDescription" placeholder="请输入网站描述" :rows="3" />
            </a-form-item>
            <a-form-item label="网站LOGO" name="siteLogo">
              <a-upload
                  v-model:file-list="logoFileList"
                  list-type="picture-card"
                  :show-upload-list="true"
                  :before-upload="beforeUpload"
              >
                <div v-if="logoFileList.length < 1">
                  <plus-outlined />
                  <div style="margin-top: 8px">上传</div>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item label="网站图标" name="siteFavicon">
              <a-upload
                  v-model:file-list="faviconFileList"
                  list-type="picture-card"
                  :show-upload-list="true"
                  :before-upload="beforeUpload"
              >
                <div v-if="faviconFileList.length < 1">
                  <plus-outlined />
                  <div style="margin-top: 8px">上传</div>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item label="ICP备案号" name="icpNumber">
              <a-input v-model:value="basicSettings.icpNumber" placeholder="请输入ICP备案号" />
            </a-form-item>
          </a-form>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="SEO设置">
        <div class="settings-card">
          <a-form :model="seoSettings" layout="vertical">
            <a-form-item label="默认页面标题" name="defaultTitle">
              <a-input v-model:value="seoSettings.defaultTitle" placeholder="请输入默认页面标题" />
            </a-form-item>
            <a-form-item label="默认关键词" name="keywords">
              <a-textarea v-model:value="seoSettings.keywords" placeholder="请输入默认关键词，多个关键词用英文逗号分隔" :rows="2" />
            </a-form-item>
            <a-form-item label="默认描述" name="description">
              <a-textarea v-model:value="seoSettings.description" placeholder="请输入默认描述" :rows="3" />
            </a-form-item>
            <a-form-item label="百度统计代码" name="baiduAnalytics">
              <a-textarea v-model:value="seoSettings.baiduAnalytics" placeholder="请输入百度统计代码" :rows="2" />
            </a-form-item>
            <a-form-item label="谷歌分析代码" name="googleAnalytics">
              <a-textarea v-model:value="seoSettings.googleAnalytics" placeholder="请输入谷歌分析代码" :rows="2" />
            </a-form-item>
          </a-form>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="安全设置">
        <div class="settings-card">
          <a-form :model="securitySettings" layout="vertical">
            <a-form-item label="登录验证码" name="loginCaptcha">
              <a-switch v-model:checked="securitySettings.loginCaptcha" />
            </a-form-item>
            <a-form-item label="密码强度要求" name="passwordStrength">
              <a-select v-model:value="securitySettings.passwordStrength">
                <a-select-option value="low">低（仅限长度要求）</a-select-option>
                <a-select-option value="medium">中（必须包含数字和字母）</a-select-option>
                <a-select-option value="high">高（必须包含数字、大小写字母和特殊字符）</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="登录失败锁定" name="loginLockEnabled">
              <a-switch v-model:checked="securitySettings.loginLockEnabled" />
            </a-form-item>
            <a-form-item label="失败锁定次数" name="loginLockAttempts" v-if="securitySettings.loginLockEnabled">
              <a-input-number v-model:value="securitySettings.loginLockAttempts" :min="1" :max="10" style="width: 100%" />
            </a-form-item>
            <a-form-item label="锁定时间(分钟)" name="loginLockTime" v-if="securitySettings.loginLockEnabled">
              <a-input-number v-model:value="securitySettings.loginLockTime" :min="5" :max="1440" style="width: 100%" />
            </a-form-item>
          </a-form>
        </div>
      </a-tab-pane>
      <a-tab-pane key="4" tab="邮件设置">
        <div class="settings-card">
          <a-form :model="emailSettings" layout="vertical">
            <a-form-item label="SMTP服务器" name="smtpServer">
              <a-input v-model:value="emailSettings.smtpServer" placeholder="请输入SMTP服务器地址" />
            </a-form-item>
            <a-form-item label="端口" name="smtpPort">
              <a-input-number v-model:value="emailSettings.smtpPort" :min="1" :max="65535" style="width: 100%" />
            </a-form-item>
            <a-form-item label="加密方式" name="encryption">
              <a-select v-model:value="emailSettings.encryption">
                <a-select-option value="none">无</a-select-option>
                <a-select-option value="ssl">SSL</a-select-option>
                <a-select-option value="tls">TLS</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="发件人邮箱" name="fromEmail">
              <a-input v-model:value="emailSettings.fromEmail" placeholder="请输入发件人邮箱" />
            </a-form-item>
            <a-form-item label="发件人名称" name="fromName">
              <a-input v-model:value="emailSettings.fromName" placeholder="请输入发件人名称" />
            </a-form-item>
            <a-form-item label="邮箱账号" name="username">
              <a-input v-model:value="emailSettings.username" placeholder="请输入邮箱账号" />
            </a-form-item>
            <a-form-item label="邮箱密码" name="password">
              <a-input-password v-model:value="emailSettings.password" placeholder="请输入邮箱密码" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="testEmailConnection">测试连接</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import {
  SaveOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';

// 基础设置
const basicSettings = reactive({
  siteName: '味见好时光',
  siteDescription: '探索美食的无限可能，记录美味，分享生活，让每一顿饭都是一道风景。',
  siteLogo: '/logo.png',
  siteFavicon: '/favicon.ico',
  icpNumber: '浙ICP备xxxxxxxx号'
});

// SEO设置
const seoSettings = reactive({
  defaultTitle: '味见好时光 - 分享美食，传递快乐',
  keywords: '菜谱,食谱,美食,烹饪,厨艺,家常菜',
  description: '味见好时光是一个分享美食、探索厨艺的平台，提供丰富的菜谱、食材百科和烹饪技巧。',
  baiduAnalytics: '',
  googleAnalytics: ''
});

// 安全设置
const securitySettings = reactive({
  loginCaptcha: true,
  passwordStrength: 'medium',
  loginLockEnabled: true,
  loginLockAttempts: 5,
  loginLockTime: 30
});

// 邮件设置
const emailSettings = reactive({
  smtpServer: 'smtp.example.com',
  smtpPort: 465,
  encryption: 'ssl',
  fromEmail: 'no-reply@example.com',
  fromName: '味见好时光',
  username: 'no-reply@example.com',
  password: '******'
});

// 上传相关
const logoFileList = ref([
  {
    uid: '-1',
    name: 'logo.png',
    status: 'done',
    url: '/logo.png',
  }
]);

const faviconFileList = ref([
  {
    uid: '-1',
    name: 'favicon.ico',
    status: 'done',
    url: '/favicon.ico',
  }
]);

// 上传前验证
const beforeUpload = (file) => {
  const isImage = file.type.indexOf('image/') === 0;
  if (!isImage) {
    message.error('只能上传图片文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片必须小于2MB!');
  }
  return isImage && isLt2M;
};

// 保存设置
const saveSettings = () => {
  message.loading('正在保存设置...');
  // 模拟API请求
  setTimeout(() => {
    message.success('设置保存成功');
  }, 1000);
};

// 测试邮件连接
const testEmailConnection = () => {
  message.loading('正在测试连接...');
  // 模拟API请求
  setTimeout(() => {
    message.success('连接测试成功');
  }, 1500);
};
</script>

<style scoped>
.system-settings {
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.settings-tabs {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(240, 136, 76, 0.08);
  padding: 16px;
}

.settings-card {
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  max-width: 800px;
}

:deep(.ant-tabs-nav-wrap) {
  padding: 10px 0;
}

:deep(.ant-tabs-tab) {
  transition: all 0.3s;
  border-radius: 4px;
  margin: 4px 0;
}

:deep(.ant-tabs-tab-active) {
  background-color: rgba(240, 136, 76, 0.1);
}

:deep(.ant-tabs-ink-bar) {
  background-color: #F0884C;
}

:deep(.ant-tabs-tab:hover) {
  color: #F0884C;
}

:deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #F0884C !important;
  font-weight: 500;
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

:deep(.ant-switch-checked) {
  background-color: #F0884C;
}
</style>