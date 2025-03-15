<template>
  <div class="recipe-add-container">
    <div class="recipe-content-wrapper">
      <!-- 左侧表单区域 -->
      <div class="left-content">
        <div class="title-area">
          <h2>添加新菜谱</h2>
        </div>

        <!-- 基本信息 -->
        <div class="form-group">
          <label class="form-label">菜品名称</label>
          <a-input
              v-model:value="recipeForm.title"
              placeholder="请输入菜品名称"
              class="base-input"
          />
        </div>

        <div class="time-difficulty-row">
          <div class="time-section">
            <label class="form-label">烹饪时间</label>
            <div class="time-input-wrapper">
              <a-input-number
                  v-model:value="recipeForm.cookingTime"
                  :min="1"
                  class="time-input"
                  :controls="true"
              />
              <div class="time-unit">
                <div class="unit-text">分钟</div>
              </div>
            </div>
          </div>
          <div class="difficulty-section">
            <label class="form-label">难度</label>
            <a-select
                v-model:value="recipeForm.difficulty"
                class="difficulty-select"
                :options="difficultyOptions"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">分类标签</label>
          <div class="tags-wrapper">
            <span
                v-for="tag in tagOptions"
                :key="tag.value"
                class="tag-item"
                :class="isTagSelected(tag.value) ? 'tag-selected' : ''"
                @click="toggleTag(tag.value)"
            >
              {{ tag.label }}
            </span>
          </div>
        </div>

        <!-- 食材清单 -->
        <div class="form-group">
          <label class="form-label">食材清单</label>

          <div class="ingredients-list">
            <!-- 食材行 -->
            <div v-for="(ingredient, index) in recipeForm.ingredients" :key="index" class="ingredient-row">
              <div class="field-container">
                <a-input
                    v-model:value="ingredient.name"
                    placeholder="食材名称"
                    class="ing-name-input"
                />
              </div>
              <div class="field-container">
                <a-input
                    v-model:value="ingredient.amount"
                    placeholder="用量"
                    class="ing-amount-input"
                />
              </div>
              <div class="field-container delete-container">
                <button class="ing-delete-btn" @click="removeIngredient(index)">删除</button>
              </div>
            </div>
          </div>

          <div class="add-item-btn" @click="addIngredient">
            <span class="add-text">+ 添加食材</span>
          </div>
        </div>

        <!-- 烹饪步骤 -->
        <div class="form-group">
          <label class="form-label">烹饪步骤</label>

          <div class="steps-wrapper">
            <div v-for="(step, index) in recipeForm.steps" :key="index" class="step-item">
              <div class="step-header">
                <span class="step-number">步骤 {{ index + 1 }}</span>
                <button class="step-delete-btn" @click="removeStep(index)">删除</button>
              </div>
              <!-- 原生textarea替代a-textarea，允许拉伸调整大小 -->
              <textarea
                  v-model="step.description"
                  placeholder="请输入烹饪步骤描述..."
                  class="native-textarea"
                  rows="4"
              ></textarea>
            </div>
          </div>

          <div class="add-item-btn" @click="addStep">
            <span class="add-text">+ 添加步骤</span>
          </div>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="right-content">
        <div class="upload-panel">
          <h3 class="upload-title">上传菜品图片</h3>
          <div class="upload-area" @click="triggerImageUpload">
            <img
                v-if="recipeForm.imageUrl"
                :src="recipeForm.imageUrl"
                alt="菜品图片预览"
                class="preview-image"
            />
            <template v-else>
              <div class="upload-placeholder">
                <div class="upload-icon">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI2LjY2NjcgMjBWNi42NjY2N0gyMFYyMEgxMy4zMzMzTDIwIDI2LjY2NjdMMjYuNjY2NyAyMEg2LjY2NjY3VjMzLjMzMzNIMzMuMzMzM1Y2LjY2NjY3SDI2LjY2NjdWMjBaIiBmaWxsPSIjQzRDNEM0Ii8+Cjwvc3ZnPgo=" alt="上传图标" class="upload-img" />
                </div>
                <p class="upload-text">点击上传菜品图片</p>
                <p class="upload-hint">建议尺寸 800x600px</p>
              </div>
            </template>
          </div>
          <input
              type="file"
              ref="fileInput"
              style="display: none;"
              accept="image/*"
              @change="handleImageUpload"
          />
          <a-button
              type="primary"
              class="save-button"
              @click="saveRecipe"
              :loading="saving"
          >
            保存菜谱
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { UploadOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

// 路由实例
const router = useRouter()
// 用户 Store
const userStore = useUserStore()

// 文件上传引用
const fileInput = ref<HTMLInputElement | null>(null)

// 是否正在保存
const saving = ref(false)

// 菜谱表单数据
const recipeForm = reactive({
  title: '',
  cookingTime: 15,
  difficulty: '简单',
  tags: ['快手菜'] as string[],
  ingredients: [{ name: '', amount: '' }],
  steps: [{ description: '' }],
  imageUrl: '',
  imageFile: null as File | null
})

// 难度选项
const difficultyOptions = [
  { value: '简单', label: '简单' },
  { value: '中等', label: '中等' },
  { value: '困难', label: '困难' }
]

// 标签选项
const tagOptions = [
  { value: '快手菜', label: '快手菜' },
  { value: '家常菜', label: '家常菜' },
  { value: '素食', label: '素食' },
  { value: '早餐', label: '早餐' },
  { value: '午餐', label: '午餐' },
  { value: '晚餐', label: '晚餐' }
]

// 检查标签是否被选中
const isTagSelected = (tag: string) => {
  return recipeForm.tags.includes(tag)
}

// 切换标签选中状态
const toggleTag = (tag: string) => {
  const index = recipeForm.tags.indexOf(tag)
  if (index === -1) {
    recipeForm.tags.push(tag)
  } else {
    recipeForm.tags.splice(index, 1)
  }
}

// 添加新食材
const addIngredient = () => {
  recipeForm.ingredients.push({ name: '', amount: '' })
}

// 删除食材
const removeIngredient = (index: number) => {
  if (recipeForm.ingredients.length > 1) {
    recipeForm.ingredients.splice(index, 1)
  } else {
    message.warning('至少需要一种食材')
  }
}

// 添加新步骤
const addStep = () => {
  recipeForm.steps.push({ description: '' })
}

// 删除步骤
const removeStep = (index: number) => {
  if (recipeForm.steps.length > 1) {
    recipeForm.steps.splice(index, 1)
  } else {
    message.warning('至少需要一个烹饪步骤')
  }
}

// 触发图片上传
const triggerImageUpload = () => {
  fileInput.value?.click()
}

// 处理图片上传
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    // 限制文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('图片大小不能超过 5MB')
      return
    }

    recipeForm.imageFile = file
    const reader = new FileReader()
    reader.onload = (e) => {
      recipeForm.imageUrl = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 保存菜谱
const saveRecipe = async () => {
  // 表单验证
  if (!recipeForm.title) {
    message.error('请输入菜品名称')
    return
  }

  if (!recipeForm.cookingTime || recipeForm.cookingTime <= 0) {
    message.error('请输入有效的烹饪时间')
    return
  }

  if (recipeForm.tags.length === 0) {
    message.error('请至少选择一个分类标签')
    return
  }

  const invalidIngredients = recipeForm.ingredients.some(
      (item) => !item.name || !item.amount
  )
  if (invalidIngredients) {
    message.error('请完整填写所有食材信息')
    return
  }

  const invalidSteps = recipeForm.steps.some(
      (item) => !item.description.trim()
  )
  if (invalidSteps) {
    message.error('请完整填写所有烹饪步骤')
    return
  }

  saving.value = true

  try {
    // 在实际项目中，这里应该调用 API 上传图片和保存菜谱数据
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    message.success('菜谱保存成功')
    // 保存成功后重定向到菜谱列表页
    router.push('/recipes')
  } catch (error) {
    console.error('保存菜谱失败:', error)
    message.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 组件挂载后检查登录状态
onMounted(() => {
  // 如果未登录，加载用户数据，如果登录失败则可以在这里处理重定向
  if (!userStore.isLoggedIn) {
    userStore.loadUserFromStorage()
  }
})
</script>

<style scoped>
/* 容器与布局 */
/* 整个页面容器 */
/* 在<style scoped>部分修改 */
.recipe-add-container {
  background-color: #f5f5f7; /* 使用!important提高优先级 */
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 24px;
}

/* 主内容包装器 */
.recipe-content-wrapper {
  display: flex;
  width: 100%;
  max-width: 1240px; /* 限制最大宽度 */
  gap: 24px;
  margin: 0; /* 移除外边距 */
}

/* 左侧内容区 */
.left-content {
  flex: 1;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 右侧内容区 */
.right-content {
  width: 320px; /* 明确设置宽度 */
}

.upload-panel {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 标题样式 */
.title-area h2, .upload-title {
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 30px;
  color: #000000;
}

.upload-title {
  font-size: 18px;
  margin-bottom: 24px;
}

/* 表单组样式 */
.form-group {
  margin-bottom: 30px;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #000000;
}

/* 输入框基础样式 */
.base-input {
  width: 100%;
  height: 48px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: #f9fafb;
  font-size: 16px;
}

/* 时间和难度行 */
.time-difficulty-row {
  display: flex;
  gap: 24px;
  margin-bottom: 30px;
}

.time-section, .difficulty-section {
  flex: 1;
}

.time-input-wrapper {
  display: flex;
  align-items: center;
}

.time-input {
  flex: 1;
  height: 48px;
  background-color: #f9fafb;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
}

.time-unit {
  margin-left: 12px;
  color: #666;
  font-size: 16px;
}

.difficulty-select {
  width: 100%;
}

/* 标签样式 */
.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-item {
  padding: 10px 18px;
  background-color: #f3f4f6;
  border-radius: 20px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
}

.tag-selected {
  background-color: #fff7ed;
  color: #f97316;
}

/* 食材清单样式 - 确保三个字段等宽 */
.ingredients-list {
  margin-bottom: 16px;
}

.ingredient-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
}

.field-container {
  width: 33.33%; /* 平均分配宽度，每个字段占据1/3 */
}

.delete-container {
  text-align: right;
}

.ing-name-input, .ing-amount-input {
  width: 100%;
  height: 42px;
  background-color: #f9fafb;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  padding: 0 16px;
}

/* 食材删除按钮样式 */
.ing-delete-btn {
  width: 100%;
  height: 42px;
  border-radius: 8px;
  font-size: 16px;
  background-color: #ffece8; /* 浅红色背景 */
  color: #ff4d4f; /* 红色文字 */
  border: none;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
  padding: 0;
  line-height: 42px;
}

.ing-delete-btn:hover {
  background-color: #ffd4d2;
}

/* 步骤样式 - 重新设计 */
.steps-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 16px;
}

.step-item {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.step-number {
  font-weight: 500;
  font-size: 16px;
  color: #333;
}

.step-delete-btn {
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 14px;
  background-color: #ffece8;
  color: #ff4d4f;
  border: none;
  cursor: pointer;
  line-height: 32px;
  text-align: center;
}

.step-delete-btn:hover {
  background-color: #ffd4d2;
}

/* 原生文本区域样式 - 可拉伸 */
.native-textarea {
  width: 100%;
  min-height: 120px; /* 初始高度 */
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  padding: 12px 16px;
  line-height: 1.6;
  color: #333;
  resize: vertical; /* 允许垂直方向拉伸 */
  transition: border-color 0.3s;
}

.native-textarea:hover {
  border-color: #d9d9d9;
}

.native-textarea:focus {
  border-color: #f97316;
  outline: none;
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
}

.native-textarea::placeholder {
  color: #aaa;
  font-size: 16px;
}

/* 添加按钮样式 */
.add-item-btn {
  width: 100%;
  height: 42px; /* 与输入框保持一致 */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  font-size: 16px;
}

.add-item-btn:hover {
  background-color: #f9fafb;
}

/* 上传区域样式 */
.upload-area {
  width: 100%;
  height: 200px;
  background-color: #f9fafb;
  border: 1px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 30px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  margin-bottom: 16px;
}

.upload-img {
  width: 48px;
  height: 48px;
}

.upload-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 6px;
}

.upload-hint {
  font-size: 14px;
  color: #999;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

/* 保存按钮样式 */
.save-button {
  width: 100%;
  height: 48px;
  font-size: 18px;
  font-weight: 500;
  background-color: #f97316;
  border-color: #f97316;
  border-radius: 10px !important;
}

.save-button:hover {
  background-color: #ea580c;
  border-color: #ea580c;
}

/* 覆盖Ant Design样式 */
:deep(.ant-input) {
  background-color: #f9fafb;
  border: 1px solid #e9ecef;
  height: 42px;
  border-radius: 8px;
  font-size: 16px;
  padding: 0 16px;
}

:deep(.ant-input-number) {
  width: 100%;
  background-color: #f9fafb;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

:deep(.ant-input-number-handler-wrap) {
  opacity: 1;
  border-left: 1px solid #e9ecef;
}

:deep(.ant-input-number-input) {
  height: 42px;
  padding: 0 16px;
  font-size: 16px;
}

:deep(.ant-select-selector) {
  height: 42px !important;
  background-color: #f9fafb !important;
  border: 1px solid #e9ecef !important;
  border-radius: 8px !important;
  padding: 0 16px !important;
}

:deep(.ant-select-selection-item) {
  line-height: 42px !important;
  font-size: 16px !important;
}

:deep(.ant-btn-primary) {
  background-color: #f97316;
  border-color: #f97316;
  border-radius: 8px;
}

:deep(.ant-btn-primary:hover) {
  background-color: #ea580c;
  border-color: #ea580c;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .recipe-content-wrapper {
    flex-direction: column;
  }

  .right-content {
    width: 100%;
  }

  .ingredient-row {
    flex-direction: column;
    gap: 8px;
  }

  .field-container {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>