<template>
  <div class="privacy-settings">
    <a-card :bordered="false">
      <template #title>
        <div class="card-title">
          <h2>隐私设置</h2>
          <p class="description">管理您的账号隐私和个人数据保护</p>
        </div>
      </template>

      <!-- 加载状态 -->
      <a-spin :spinning="loading">
        <!-- 隐私保护模式 -->
        <div class="section">
          <div class="option-wrapper">
            <div class="option-info">
              <h3>隐私保护模式</h3>
              <p class="option-desc">开启后将提高账号隐私保护级别</p>
            </div>
            <a-switch v-model:checked="privacySettings.privacyMode" />
          </div>
        </div>

        <a-divider />

        <!-- 个人资料可见性 -->
        <div class="section">
          <h3 class="section-title">个人资料可见性</h3>

          <div class="option-wrapper" v-for="(option, key) in visibilityOptions" :key="`visibility-${key}`">
            <div class="option-info">
              <span class="option-title">{{ option.title }}</span>
              <span class="option-desc">{{ option.description }}</span>
            </div>
            <a-select
                v-model:value="privacySettings.visibility[key]"
                class="visibility-select"
                :options="visibilityLevels"
            />
          </div>
        </div>

        <a-divider />

        <!-- 互动权限 -->
        <div class="section">
          <h3 class="section-title">互动权限</h3>

          <div class="option-wrapper">
            <div class="option-info">
              <span class="option-title">评论设置</span>
              <span class="option-desc">谁可以评论您发布的内容</span>
            </div>
            <a-select
                v-model:value="privacySettings.permissions.comment"
                class="permission-select"
                :options="commentOptions"
            />
          </div>

          <div class="option-wrapper">
            <div class="option-info">
              <span class="option-title">私信权限</span>
              <span class="option-desc">谁可以给您发送私信</span>
            </div>
            <a-select
                v-model:value="privacySettings.permissions.message"
                class="permission-select"
                :options="messageOptions"
            />
          </div>

          <div class="option-wrapper">
            <div class="option-info">
              <span class="option-title">提及权限</span>
              <span class="option-desc">谁可以在评论或菜谱中@您</span>
            </div>
            <a-select
                v-model:value="privacySettings.permissions.mention"
                class="permission-select"
                :options="mentionOptions"
            />
          </div>

          <div class="option-wrapper">
            <div class="option-info">
              <span class="option-title">关注申请</span>
              <span class="option-desc">是否需要审核用户的关注请求</span>
            </div>
            <a-switch v-model:checked="privacySettings.permissions.followApproval" />
          </div>
        </div>

        <a-divider />

        <!-- 数据隐私 -->
        <div class="section">
          <h3 class="section-title">数据隐私</h3>

          <div class="option-wrapper">
            <div class="option-info">
              <span class="option-title">允许搜索引擎索引您的个人主页</span>
              <span class="option-desc">关闭后搜索引擎将无法找到您的个人资料</span>
            </div>
            <a-switch v-model:checked="privacySettings.dataPrivacy.allowSearch" />
          </div>

          <div class="option-wrapper">
            <div class="option-info">
              <span class="option-title">个性化推荐</span>
              <span class="option-desc">允许系统根据您的兴趣和行为推荐内容</span>
            </div>
            <a-switch v-model:checked="privacySettings.dataPrivacy.personalizedRecommendation" />
          </div>

          <div class="option-wrapper">
            <div class="option-info">
              <span class="option-title">分享位置信息</span>
              <span class="option-desc">是否在发布内容时显示您的位置</span>
            </div>
            <a-switch v-model:checked="privacySettings.dataPrivacy.shareLocation" />
          </div>

          <div class="option-wrapper">
            <div class="option-info">
              <span class="option-title">保存浏览历史</span>
              <span class="option-desc">关闭后将不记录您的浏览历史</span>
            </div>
            <a-switch v-model:checked="privacySettings.dataPrivacy.saveBrowsingHistory" />
          </div>
        </div>

        <a-divider />

        <!-- 黑名单管理 -->
        <div class="section">
          <h3 class="section-title">黑名单管理</h3>
          <p class="section-desc">被加入黑名单的用户将无法查看您的内容、给您发送私信或评论您的内容</p>

          <!-- 黑名单列表 -->
          <div class="blacklist-container">
            <template v-if="privacySettings.blacklist.length > 0">
              <div class="blacklist-item" v-for="(user, index) in privacySettings.blacklist" :key="`blacklist-${index}`">
                <div class="user-info">
                  <a-avatar :src="user.avatar" :size="40" />
                  <span class="user-name">{{ user.name }}</span>
                </div>
                <a-button
                    type="text"
                    danger
                    @click="removeFromBlacklist(index)"
                >
                  <template #icon><delete-outlined /></template>
                  移除
                </a-button>
              </div>
            </template>
            <div v-else class="empty-blacklist">
              <a-empty
                  description="您的黑名单中暂无用户"
                  :image="Empty.PRESENTED_IMAGE_SIMPLE"
              />
            </div>
          </div>

          <!-- 添加黑名单按钮 -->
          <a-button
              type="link"
              class="add-blacklist-btn"
              @click="showAddBlacklistModal"
          >
            <template #icon><user-add-outlined /></template>
            添加用户到黑名单
          </a-button>

          <!-- 添加黑名单模态框 -->
          <a-modal
              v-model:visible="blacklistModalVisible"
              title="添加用户到黑名单"
              @ok="addToBlacklist"
              okText="确认添加"
              cancelText="取消"
              :confirmLoading="addingToBlacklist"
          >
            <a-input-search
                v-model:value="searchUserQuery"
                placeholder="搜索用户名..."
                enter-button="搜索"
                :loading="searchingUser"
                @search="searchUser"
            />
            <div class="search-results" v-if="searchResults.length > 0">
              <div
                  class="search-result-item"
                  v-for="user in searchResults"
                  :key="user.id"
                  @click="selectUserToBlacklist(user)"
                  :class="{ 'selected': selectedUser && selectedUser.id === user.id }"
              >
                <a-avatar :src="user.avatar" :size="40" />
                <span class="user-name">{{ user.name }}</span>
              </div>
            </div>
            <a-empty
                v-else-if="searchUserQuery && !searchingUser"
                description="未找到匹配的用户"
                :image="Empty.PRESENTED_IMAGE_SIMPLE"
            />
          </a-modal>
        </div>

        <!-- 保存按钮 -->
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
import { message, Empty } from 'ant-design-vue';
import { UserAddOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import type { PrivacySettings, BlacklistUser } from '@/types/privacy';

// 加载和保存状态
const loading = ref(false);
const saving = ref(false);

// 黑名单相关状态
const blacklistModalVisible = ref(false);
const searchUserQuery = ref('');
const searchingUser = ref(false);
const searchResults = ref<BlacklistUser[]>([]);
const selectedUser = ref<BlacklistUser | null>(null);
const addingToBlacklist = ref(false);

// 隐私设置数据
const privacySettings = reactive<PrivacySettings>({
  privacyMode: true,
  visibility: {
    personalInfo: 'followers',
    contactInfo: 'private',
    recipes: 'public',
    favorites: 'followers'
  },
  permissions: {
    comment: 'public',
    message: 'followers',
    mention: 'public',
    followApproval: false
  },
  dataPrivacy: {
    allowSearch: true,
    personalizedRecommendation: true,
    shareLocation: false,
    saveBrowsingHistory: true
  },
  blacklist: []
});

// 可见性选项定义
const visibilityOptions = {
  personalInfo: {
    title: '个人信息',
    description: '姓名、简介、个人照片等'
  },
  contactInfo: {
    title: '联系方式',
    description: '手机号、邮箱等'
  },
  recipes: {
    title: '发布的菜谱',
    description: '您分享的菜谱和烹饪技巧'
  },
  favorites: {
    title: '收藏内容',
    description: '您收藏的菜谱和文章'
  }
};

// 可见性级别
const visibilityLevels = [
  { value: 'public', label: '所有人可见' },
  { value: 'followers', label: '仅关注者可见' },
  { value: 'private', label: '仅自己可见' }
];

// 评论权限选项
const commentOptions = [
  { value: 'public', label: '所有人' },
  { value: 'followers', label: '仅关注者' },
  { value: 'disabled', label: '关闭评论' }
];

// 私信权限选项
const messageOptions = [
  { value: 'public', label: '所有人' },
  { value: 'followers', label: '仅关注者' },
  { value: 'disabled', label: '关闭私信' }
];

// 提及权限选项
const mentionOptions = [
  { value: 'public', label: '所有人' },
  { value: 'followers', label: '仅关注者' },
  { value: 'disabled', label: '关闭提及' }
];

// 页面加载时获取隐私设置
onMounted(async () => {
  try {
    loading.value = true;
    // 在实际应用中，这里会从API获取用户隐私设置
    // const { data } = await fetch('/api/user/privacy-settings');

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    // 模拟获取数据成功
    // Object.assign(privacySettings, data);
  } catch (error) {
    console.error('获取隐私设置失败:', error);
    message.error('获取隐私设置失败，请稍后重试');
  } finally {
    loading.value = false;
  }
});

// 保存设置
const saveSettings = async () => {
  try {
    saving.value = true;

    // 在实际应用中，这里会将设置发送到API
    // await fetch('/api/user/privacy-settings', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(privacySettings)
    // });

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    message.success('隐私设置已保存');
  } catch (error) {
    console.error('保存隐私设置失败:', error);
    message.error('保存隐私设置失败，请稍后重试');
  } finally {
    saving.value = false;
  }
};

// 重置为默认设置
const resetToDefault = () => {
  // 默认设置
  const defaultSettings: PrivacySettings = {
    privacyMode: true,
    visibility: {
      personalInfo: 'followers',
      contactInfo: 'private',
      recipes: 'public',
      favorites: 'followers'
    },
    permissions: {
      comment: 'public',
      message: 'followers',
      mention: 'public',
      followApproval: false
    },
    dataPrivacy: {
      allowSearch: true,
      personalizedRecommendation: true,
      shareLocation: false,
      saveBrowsingHistory: true
    },
    blacklist: []
  };

  // 更新设置
  Object.assign(privacySettings, defaultSettings);
  message.info('已恢复默认设置');
};

// 显示添加黑名单模态框
const showAddBlacklistModal = () => {
  blacklistModalVisible.value = true;
  searchUserQuery.value = '';
  searchResults.value = [];
  selectedUser.value = null;
};

// 搜索用户
const searchUser = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = [];
    return;
  }

  try {
    searchingUser.value = true;

    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 模拟搜索结果
    searchResults.value = [
      {
        id: '1',
        name: '张大厨',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      {
        id: '2',
        name: '李小厨',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      {
        id: '3',
        name: '王厨师',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
      }
    ].filter(user => user.name.includes(query));

  } catch (error) {
    console.error('搜索用户失败:', error);
    message.error('搜索用户失败，请稍后重试');
  } finally {
    searchingUser.value = false;
  }
};

// 选择要添加到黑名单的用户
const selectUserToBlacklist = (user: BlacklistUser) => {
  selectedUser.value = user;
};

// 添加用户到黑名单
const addToBlacklist = async () => {
  if (!selectedUser.value) {
    message.warning('请先选择要添加到黑名单的用户');
    return;
  }

  try {
    addingToBlacklist.value = true;

    // 检查是否已经在黑名单中
    const isAlreadyBlacklisted = privacySettings.blacklist.some(
        user => user.id === selectedUser.value?.id
    );

    if (isAlreadyBlacklisted) {
      message.warning('该用户已在黑名单中');
      blacklistModalVisible.value = false;
      return;
    }

    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    // 添加到黑名单
    privacySettings.blacklist.push(selectedUser.value);

    message.success(`已将 ${selectedUser.value.name} 添加到黑名单`);
    blacklistModalVisible.value = false;

  } catch (error) {
    console.error('添加到黑名单失败:', error);
    message.error('添加到黑名单失败，请稍后重试');
  } finally {
    addingToBlacklist.value = false;
  }
};

// 从黑名单中移除用户
const removeFromBlacklist = async (index: number) => {
  const user = privacySettings.blacklist[index];

  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 300));

    // 从黑名单中移除
    privacySettings.blacklist.splice(index, 1);

    message.success(`已将 ${user.name} 从黑名单中移除`);
  } catch (error) {
    console.error('从黑名单中移除失败:', error);
    message.error('从黑名单中移除失败，请稍后重试');
  }
};
</script>

<style scoped>
.privacy-settings {
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

.section-desc {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin-bottom: 16px;
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
  max-width: 70%;
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

.visibility-select,
.permission-select {
  width: 140px;
}

.blacklist-container {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  min-height: 100px;
}

.empty-blacklist {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

.blacklist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e8e8e8;
}

.blacklist-item:last-child {
  border-bottom: none;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  margin-left: 12px;
  font-size: 14px;
}

.add-blacklist-btn {
  margin-bottom: 16px;
  padding-left: 0;
  height: auto;
}

.search-results {
  margin-top: 16px;
  max-height: 200px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.search-result-item:hover {
  background-color: #f5f5f5;
}

.search-result-item.selected {
  background-color: #f0f7ff;
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

:deep(.ant-select-item-option-selected:not(.ant-select-item-option-disabled)) {
  color: #f6925c;
  font-weight: 600;
  background-color: #fff7e6;
}

:deep(.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  border-color: #f6925c;
  box-shadow: 0 0 0 2px rgba(246, 146, 92, 0.2);
}

:deep(.ant-btn-primary) {
  background-color: #f6925c;
  border-color: #f6925c;
}

:deep(.ant-btn-primary:hover) {
  background-color: #ff8b48;
  border-color: #ff8b48;
}

:deep(.ant-btn-link) {
  color: #f6925c;
}

:deep(.ant-btn-link:hover) {
  color: #ff8b48;
}

:deep(.ant-modal-content .ant-btn-primary) {
  background-color: #f6925c;
  border-color: #f6925c;
}
</style>