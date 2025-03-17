<template>
  <div class="publish-settings">
    <h2 class="section-title">
      <SettingOutlined class="section-icon" />
      发布设置
    </h2>

    <div class="settings-grid">
      <div class="setting-group">
        <a-form-item name="privacy">
          <div class="radio-container">
            <div
                class="radio-option"
                :class="{ 'active': recipeForm.privacy === 'public' }"
                @click="recipeForm.privacy = 'public'"
            >
              <div class="radio-header">
                <div class="radio-circle">
                  <div class="radio-inner" v-if="recipeForm.privacy === 'public'"></div>
                </div>
                <span class="radio-label">公开分享</span>
              </div>
              <div class="radio-desc">所有用户都可以看到这个菜谱</div>
            </div>

            <div
                class="radio-option"
                :class="{ 'active': recipeForm.privacy === 'private' }"
                @click="recipeForm.privacy = 'private'"
            >
              <div class="radio-header">
                <div class="radio-circle">
                  <div class="radio-inner" v-if="recipeForm.privacy === 'private'"></div>
                </div>
                <span class="radio-label">仅自己可见</span>
              </div>
              <div class="radio-desc">只有您自己能看到这个菜谱</div>
            </div>
          </div>
        </a-form-item>
      </div>

      <div class="setting-group">
        <a-form-item name="comments">
          <div class="radio-container">
            <div
                class="radio-option"
                :class="{ 'active': recipeForm.comments === 'enabled' }"
                @click="recipeForm.comments = 'enabled'"
            >
              <div class="radio-header">
                <div class="radio-circle">
                  <div class="radio-inner" v-if="recipeForm.comments === 'enabled'"></div>
                </div>
                <span class="radio-label">允许评论</span>
              </div>
              <div class="radio-desc">其他用户可以对您的菜谱发表评论</div>
            </div>

            <div
                class="radio-option"
                :class="{ 'active': recipeForm.comments === 'disabled' }"
                @click="recipeForm.comments = 'disabled'"
            >
              <div class="radio-header">
                <div class="radio-circle">
                  <div class="radio-inner" v-if="recipeForm.comments === 'disabled'"></div>
                </div>
                <span class="radio-label">关闭评论</span>
              </div>
              <div class="radio-desc">其他用户不能对此菜谱发表评论</div>
            </div>
          </div>
        </a-form-item>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这里需要接收父组件传递的recipeForm
defineProps({
  recipeForm: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.publish-settings {
  padding: 24px 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.section-icon {
  color: #FF9966;
  margin-right: 8px;
  font-size: 20px;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.setting-group {
  margin-bottom: 16px;
}

.radio-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.radio-option {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.radio-option:hover {
  border-color: #FF9966;
  background-color: #FFEBE0;
}

.radio-option.active {
  border-color: #FF9966;
  background-color: #FFEBE0;
}

.radio-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.radio-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #d9d9d9;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.radio-option:hover .radio-circle,
.radio-option.active .radio-circle {
  border-color: #FF9966;
}

.radio-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #FF9966;
}

.radio-label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.radio-desc {
  margin-left: 28px;
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}
</style>