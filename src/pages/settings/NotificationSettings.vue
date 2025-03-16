<template>
  <div class="notification-settings">
    <a-card :bordered="false">
      <template #title>
        <div class="card-title">
          <h2>通知设置</h2>
          <p class="description">设置您希望接收的通知类型和接收方式</p>
        </div>
      </template>

      <!-- 加载状态 -->
      <a-spin :spinning="loading">
        <!-- 全局通知开关 -->
        <div class="section">
          <div class="option-wrapper">
            <div class="option-info">
              <h3>开启通知</h3>
              <p class="option-desc">设置是否接收所有类型的通知</p>
            </div>
            <a-switch
                v-model:checked="notificationSettings.enableAll"
                @change="toggleAllNotifications"
            />
          </div>
        </div>

        <a-divider />

        <!-- 通知方式设置 -->
        <div class="section">
          <h3 class="section-title">通知方式</h3>

          <div class="option-wrapper" v-for="(option, key) in notificationSettings.channels" :key="`channel-${key}`">
            <div class="option-info">
              <span class="option-title">{{ channelTitles[key] }}</span>
              <span class="option-desc">{{ channelDescriptions[key] }}</span>
            </div>
            <a-switch
                v-model:checked="notificationSettings.channels[key]"
                :disabled="!notificationSettings.enableAll"
            />
          </div>
        </div>

        <a-divider />

        <!-- 通知类型设置 -->
        <div class="section">
          <h3 class="section-title">通知类型</h3>

          <div class="option-wrapper" v-for="(option, key) in notificationSettings.types" :key="`type-${key}`">
            <div class="option-info">
              <span class="option-title">{{ typeTitles[key] }}</span>
              <span class="option-desc">{{ typeDescriptions[key] }}</span>
            </div>
            <a-switch
                v-model:checked="notificationSettings.types[key]"
                :disabled="!notificationSettings.enableAll"
            />
          </div>
        </div>

        <a-divider />

        <!-- 通知频率设置 -->
        <div class="section">
          <h3 class="section-title">通知频率</h3>

          <a-radio-group v-model:value="notificationSettings.frequency" :disabled="!notificationSettings.enableAll">
            <div class="radio-option-wrapper">
              <a-radio value="immediate">实时通知（即时接收所有通知）</a-radio>
            </div>
            <div class="radio-option-wrapper">
              <a-radio value="daily">每日摘要（每天汇总一次通知）</a-radio>
            </div>
            <div class="radio-option-wrapper">
              <a-radio value="weekly">每周摘要（每周汇总一次通知）</a-radio>
            </div>
          </a-radio-group>
        </div>

        <!-- 提交按钮 -->
        <div class="action-buttons">
          <a-button @click="resetToDefault">恢复默认设置</a-button>
          <a-button type="primary" :loading="saving" @click="saveSettings">保存设置</a-button>
        </div>
      </a-spin>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import type { NotificationSettings } from '@/types/notification';

// 加载和保存状态
const loading = ref(false);
const saving = ref(false);

// 通知设置数据
const notificationSettings = reactive<NotificationSettings>({
  enableAll: true,
  channels: {
    website: true,
    email: true,
    sms: false
  },
  types: {
    system: true,
    interaction: true,
    follow: true,
    message: true,
    activity: false
  },
  frequency: 'immediate'
});

// 保存原始设置，用于重置功能
const originalSettings = ref<NotificationSettings | null>(null);

// 通知渠道标题和描述
const channelTitles = {
  website: '网站通知',
  email: '邮件通知',
  sms: '手机短信通知'
};

const channelDescriptions = {
  website: '在网站内接收实时通知',
  email: '通过邮件接收重要通知',
  sms: '通过短信接收重要通知'
};

// 通知类型标题和描述
const typeTitles = {
  system: '系统通知',
  interaction: '互动通知',
  follow: '关注通知',
  message: '私信通知',
  activity: '活动通知'
};

const typeDescriptions = {
  system: '关于账户安全、功能更新等系统级别的通知',
  interaction: '当其他用户评论、点赞或收藏您的内容时通知',
  follow: '当您关注的用户发布新内容时通知',
  message: '当收到私信时通知',
  activity: '关于网站活动、优惠信息等营销通知'
};

// 页面加载时获取通知设置
onMounted(async () => {
  try {
    loading.value = true;
    // 在实际应用中，这里会从API获取用户通知设置
    // const { data } = await fetch('/api/user/notification-settings');

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟获取数据成功
    // notificationSettings = data;

    // 保存原始设置用于重置
    originalSettings.value = JSON.parse(JSON.stringify(notificationSettings));
  } catch (error) {
    console.error('获取通知设置失败:', error);
    message.error('获取通知设置失败，请稍后重试');
  } finally {
    loading.value = false;
  }
});

// 切换所有通知开关
const toggleAllNotifications = (checked: boolean) => {
  if (!checked) {
    // 可以添加确认弹窗
    // 这里简化处理，直接显示提示信息
    message.info('关闭所有通知后，您将不会收到任何通知提醒');
  }
};

// 保存设置
const saveSettings = async () => {
  try {
    saving.value = true;

    // 在实际应用中，这里会将设置发送到API
    // await fetch('/api/user/notification-settings', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(notificationSettings)
    // });

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 保存成功后更新原始设置
    originalSettings.value = JSON.parse(JSON.stringify(notificationSettings));

    message.success('通知设置已保存');
  } catch (error) {
    console.error('保存通知设置失败:', error);
    message.error('保存通知设置失败，请稍后重试');
  } finally {
    saving.value = false;
  }
};

// 重置为默认设置
const resetToDefault = () => {
  // 默认设置
  const defaultSettings: NotificationSettings = {
    enableAll: true,
    channels: {
      website: true,
      email: true,
      sms: false
    },
    types: {
      system: true,
      interaction: true,
      follow: true,
      message: true,
      activity: false
    },
    frequency: 'immediate'
  };

  // 更新设置
  Object.assign(notificationSettings, defaultSettings);
  message.info('已恢复默认设置');
};
</script>

<style scoped>
.notification-settings {
  padding: 0;
  background-color: #f9f7f4;
}

.card-title {
  margin-bottom: 8px;
}

.card-title h2 {
  margin-bottom: 4px;
  font-size: 18px;
  font-weight: 600;
}

.description {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
}

.option-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.option-info {
  display: flex;
  flex-direction: column;
}

.option-title {
  font-size: 14px;
  font-weight: 500;
}

.option-desc {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  margin-top: 4px;
}

.radio-option-wrapper {
  margin-bottom: 12px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

/* 适配品牌色 */
:deep(.ant-switch-checked) {
  background-color: #f6925c;
}

:deep(.ant-radio-checked .ant-radio-inner) {
  border-color: #f6925c;
}

:deep(.ant-radio-inner::after) {
  background-color: #f6925c;
}

:deep(.ant-radio-wrapper-checked) {
  color: #f6925c;
}

:deep(.ant-btn-primary) {
  background-color: #f6925c;
  border-color: #f6925c;
}

:deep(.ant-btn-primary:hover) {
  background-color: #ff8b48;
  border-color: #ff8b48;
}
</style>