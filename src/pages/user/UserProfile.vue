<!-- UserProfile.vue -->
<template>
  <div class="user-profile">
    <!-- 基本信息区块 -->
    <div class="info-section">
      <div class="section-title">
        <profile-outlined class="section-icon" />
        <span>基本信息</span>
      </div>

      <a-form :model="profileForm" layout="vertical" class="profile-form">
        <div class="form-group">
          <div class="form-item">
            <div class="form-label">用户名</div>
            <a-input v-model:value="profileForm.username" placeholder="请输入用户名" />
          </div>

          <div class="form-item">
            <div class="form-label">昵称</div>
            <a-input v-model:value="profileForm.nickname" placeholder="请输入昵称" />
          </div>
        </div>

        <div class="form-group">
          <div class="form-item">
            <div class="form-label">性别</div>
            <a-radio-group v-model:value="profileForm.gender">
              <a-radio value="female">女</a-radio>
              <a-radio value="male">男</a-radio>
              <a-radio value="private">不公开</a-radio>
            </a-radio-group>
          </div>
        </div>

        <div class="form-group">
          <div class="form-item">
            <div class="form-label">生日</div>
            <a-date-picker
                v-model:value="profileForm.birthday"
                style="width: 100%"
                :format="dateFormat"
            />
          </div>
        </div>

        <div class="form-group">
          <div class="form-item wide">
            <div class="form-label">地区</div>
            <div class="region-selects">
              <a-select
                  v-model:value="profileForm.province"
                  placeholder="请选择省/市"
              >
                <a-select-option value="beijing">北京市</a-select-option>
                <a-select-option value="shanghai">上海市</a-select-option>
                <a-select-option value="guangzhou">广州市</a-select-option>
                <a-select-option value="shenzhen">深圳市</a-select-option>
              </a-select>
              <a-select
                  v-model:value="profileForm.city"
                  placeholder="请选择区/县"
              >
                <a-select-option value="chaoyang">朝阳区</a-select-option>
                <a-select-option value="haidian">海淀区</a-select-option>
                <a-select-option value="dongcheng">东城区</a-select-option>
                <a-select-option value="xicheng">西城区</a-select-option>
              </a-select>
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="form-item wide">
            <div class="form-label">个人简介</div>
            <a-textarea
                v-model:value="profileForm.bio"
                :rows="4"
                placeholder="分享一些关于您的信息..."
                :maxlength="100"
            />
            <div class="char-count">个人简介不超过100字</div>
          </div>
        </div>

        <div class="form-actions">
          <a-button type="primary" class="primary-btn">保存修改</a-button>
        </div>
      </a-form>
    </div>

    <!-- 联系方式区块 -->
    <div class="info-section">
      <div class="section-title">
        <contacts-outlined class="section-icon" />
        <span>联系方式</span>
      </div>

      <div class="form-group">
        <div class="form-item wide">
          <div class="form-label">手机号码</div>
          <div class="input-with-action">
            <a-input value="138****5678" disabled />
            <a-button class="action-btn">修改</a-button>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="form-item wide">
          <div class="form-label">邮箱</div>
          <div class="input-with-action">
            <a-input value="example@mail.com" />
            <a-button class="action-btn">验证</a-button>
          </div>
          <div class="alert-text">
            <warning-outlined />
            <span>邮箱未验证</span>
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="form-item wide">
          <div class="form-label">微信</div>
          <div class="input-with-action">
            <a-input value="未绑定" disabled />
            <a-button class="action-btn">绑定</a-button>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <a-button type="primary" class="primary-btn">保存修改</a-button>
      </div>
    </div>

    <!-- 偏好设置区块 -->
    <div class="info-section">
      <div class="section-title">
        <setting-outlined class="section-icon" />
        <span>偏好设置</span>
      </div>

      <div class="preference-section">
        <h3 class="preference-title">喜爱的菜系</h3>
        <div class="tag-group">
          <label class="preference-tag active">
            <input type="checkbox" checked class="tag-checkbox" />
            <span>川菜</span>
          </label>
          <label class="preference-tag active">
            <input type="checkbox" checked class="tag-checkbox" />
            <span>粤菜</span>
          </label>
          <label class="preference-tag active">
            <input type="checkbox" checked class="tag-checkbox" />
            <span>东北菜</span>
          </label>
          <label class="preference-tag">
            <input type="checkbox" class="tag-checkbox" />
            <span>日料</span>
          </label>
          <label class="preference-tag active">
            <input type="checkbox" checked class="tag-checkbox" />
            <span>意大利菜</span>
          </label>
          <label class="preference-tag">
            <input type="checkbox" class="tag-checkbox" />
            <span>+ 添加</span>
          </label>
        </div>
      </div>

      <div class="preference-section">
        <h3 class="preference-title">饮食禁忌</h3>
        <div class="tag-group">
          <label class="preference-tag">
            <input type="checkbox" class="tag-checkbox" />
            <span>海鲜</span>
          </label>
          <label class="preference-tag">
            <input type="checkbox" class="tag-checkbox" />
            <span>牛肉</span>
          </label>
          <label class="preference-tag active">
            <input type="checkbox" checked class="tag-checkbox" />
            <span>花生</span>
          </label>
          <label class="preference-tag">
            <input type="checkbox" class="tag-checkbox" />
            <span>乳制品</span>
          </label>
          <label class="preference-tag">
            <input type="checkbox" class="tag-checkbox" />
            <span>麸质</span>
          </label>
        </div>
      </div>

      <div class="preference-section">
        <h3 class="preference-title">通知设置</h3>
        <div class="notification-settings">
          <div class="notification-item">
            <span class="notification-label">菜谱点赞通知</span>
            <a-switch v-model:checked="notifications.likes" />
          </div>
          <div class="notification-item">
            <span class="notification-label">菜谱评论通知</span>
            <a-switch v-model:checked="notifications.comments" defaultChecked />
          </div>
          <div class="notification-item">
            <span class="notification-label">新粉丝通知</span>
            <a-switch v-model:checked="notifications.followers" defaultChecked />
          </div>
          <div class="notification-item">
            <span class="notification-label">私信通知</span>
            <a-switch v-model:checked="notifications.messages" defaultChecked />
          </div>
          <div class="notification-item">
            <span class="notification-label">每周美食推荐</span>
            <a-switch v-model:checked="notifications.weeklyRecommendations" />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <a-button type="primary" class="primary-btn">保存修改</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import dayjs from 'dayjs';
import {
  ProfileOutlined,
  ContactsOutlined,
  SettingOutlined,
  LinkOutlined,
  WechatOutlined,
  WeiboOutlined,
  ReadOutlined,
  InstagramOutlined,
  InfoCircleOutlined,
  WarningOutlined
} from '@ant-design/icons-vue';

// 日期格式
const dateFormat = 'YYYY-MM-DD';

// 表单数据
const profileForm = reactive({
  username: '阳光厨房',
  nickname: '小厨娘',
  gender: 'female',
  birthday: dayjs('1995-05-20'),
  province: 'beijing',
  city: 'chaoyang',
  bio: '分享美食，传递快乐。热爱烹饪的90后，擅长家常菜和甜点制作，希望通过美食记录生活的点滴。'
});

// 通知设置
const notifications = reactive({
  likes: false,
  comments: true,
  followers: true,
  messages: true,
  weeklyRecommendations: false
});
</script>

<style scoped>
.user-profile {
  width: 100%;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
}

/* 内容区块通用样式 */
.info-section {
  background-color: #fff;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
}

.section-icon {
  color: var(--primary-color);
  margin-right: var(--spacing-sm);
  font-size: var(--font-size-lg);
}

/* 表单样式 */
.form-group {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-lg);
}

.form-item {
  flex: 1;
  min-width: 240px;
  margin-right: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.form-item.wide {
  width: 100%;
  flex-basis: 100%;
}

.form-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.region-selects {
  display: flex;
  gap: var(--spacing-md);
}

.region-selects .ant-select {
  width: 100%;
}

/* 自定义 Ant Design 组件样式 */
:deep(.ant-input:focus),
:deep(.ant-input-focused) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(255, 153, 102, 0.2) !important;
}

:deep(.ant-input:hover) {
  border-color: var(--primary-color) !important;
}

:deep(.ant-select:hover .ant-select-selector) {
  border-color: var(--primary-color) !important;
}

:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-select-selector:focus),
:deep(.ant-select-selector:active),
:deep(.ant-select-open .ant-select-selector) {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(255, 153, 102, 0.2) !important;
}

:deep(.ant-radio-checked .ant-radio-inner) {
  border-color: var(--primary-color) !important;
}

:deep(.ant-radio-inner::after) {
  background-color: var(--primary-color) !important;
}

:deep(.ant-radio-wrapper:hover .ant-radio-inner) {
  border-color: var(--primary-color) !important;
}

:deep(.ant-picker:hover),
:deep(.ant-picker-focused) {
  border-color: var(--primary-color) !important;
}

:deep(.ant-picker-focused) {
  box-shadow: 0 0 0 2px rgba(255, 153, 102, 0.2) !important;
}

:deep(.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner) {
  background-color: var(--primary-color) !important;
}

:deep(.ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before) {
  border-color: var(--primary-color) !important;
}

.char-count {
  text-align: right;
  color: var(--text-tertiary);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xs);
}

/* 按钮样式 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
}

.primary-btn {
  background: var(--primary-color);
  border-color: var(--primary-color);
  border-radius: var(--border-radius-sm);
  font-weight: 500;
}

.primary-btn:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}

.input-with-action {
  display: flex;
  gap: var(--spacing-md);
}

.action-btn {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: transparent;
}

.action-btn:hover {
  background: var(--tag-background);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-btn.gray {
  border-color: #d9d9d9;
  color: var(--text-secondary);
}

.action-btn.gray:hover {
  background: #f5f5f5;
  border-color: #d9d9d9;
}

.alert-text {
  color: var(--warning-color);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xs);
  display: flex;
  align-items: center;
}

.alert-text span {
  margin-left: var(--spacing-xs);
}

/* 账号绑定样式 */
.connection-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.connection-item {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.connection-left {
  display: flex;
  align-items: center;
}

.app-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-md);
  font-size: 20px;
}

.app-icon.wechat {
  background-color: #ecf9ec;
  color: #07c160;
}

.app-icon.weibo {
  background-color: #ffeeee;
  color: #e6162d;
}

.app-icon.douban {
  background-color: #fff7e6;
  color: #e09015;
}

.app-icon.instagram {
  background-color: #f5efff;
  color: #c13584;
}

.app-info {
  display: flex;
  flex-direction: column;
}

.app-name {
  font-weight: 500;
  color: var(--text-primary);
}

.app-status {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.message-box {
  background-color: #f9f9f9;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  display: flex;
  align-items: flex-start;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.info-icon {
  color: var(--info-color);
  margin-right: var(--spacing-sm);
  margin-top: 2px;
  flex-shrink: 0;
}

/* 偏好设置样式 */
.preference-section {
  margin-bottom: var(--spacing-lg);
}

.preference-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.preference-tag {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-pill);
  padding: 5px 12px;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
}

.preference-tag.active {
  background-color: var(--tag-background);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.tag-checkbox {
  display: none;
}

/* 通知设置样式 */
.notification-settings {
  margin-bottom: var(--spacing-md);
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-label {
  color: var(--text-primary);
}
</style>