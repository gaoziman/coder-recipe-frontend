<template>
  <div class="create-recipe-container">
    <!-- 页面标题栏 -->
    <div class="page-header">
      <h1 class="page-title">创建新菜谱</h1>
      <div class="action-buttons">
        <a-button class="draft-btn" @click="saveDraft">
          <template #icon>
            <SaveOutlined/>
          </template>
          保存草稿
        </a-button>
        <a-button type="primary" class="publish-btn" @click="publishRecipe">
          <template #icon>
            <CheckOutlined/>
          </template>
          发布菜谱
        </a-button>
      </div>
    </div>

    <!-- 菜谱表单内容 -->
    <a-form
        :model="recipeForm"
        :rules="rules"
        ref="recipeFormRef"
        layout="vertical"
        class="recipe-form"
    >
      <a-card class="form-card">
        <!-- 基本信息 -->
        <div class="section">
          <PublishSettings :recipeForm="recipeForm"/>
        </div>

        <!-- 食材清单 -->
        <div class="section">
          <h2 class="section-title">
            <UnorderedListOutlined class="section-icon"/>
            食材清单
          </h2>

          <!-- 主要食材 -->
          <div class="ingredient-section">
            <h3 class="subsection-title">主要食材</h3>
            <div class="ingredients-list">
              <div
                  v-for="(item, index) in recipeForm.mainIngredients"
                  :key="index"
                  class="ingredient-item"
              >
                <a-input
                    v-model:value="item.name"
                    placeholder="食材名称，如西兰花"
                    class="ingredient-name"
                />
                <a-input
                    v-model:value="item.amount"
                    placeholder="用量，如300"
                    class="ingredient-amount"
                />
                <a-select
                    v-model:value="item.unit"
                    placeholder="单位"
                    class="ingredient-unit"
                >
                  <a-select-option value="g">克</a-select-option>
                  <a-select-option value="kg">千克</a-select-option>
                  <a-select-option value="ml">毫升</a-select-option>
                  <a-select-option value="l">升</a-select-option>
                  <a-select-option value="tbsp">勺</a-select-option>
                  <a-select-option value="piece">个</a-select-option>
                  <a-select-option value="other">其他</a-select-option>
                </a-select>
                <a-button
                    type="text"
                    class="delete-btn"
                    @click="removeIngredient('main', index)"
                >
                  <DeleteOutlined/>
                </a-button>
              </div>
            </div>
            <a-button
                type="dashed"
                class="add-btn"
                @click="addIngredient('main')"
            >
              <PlusOutlined/>
              添加主要食材
            </a-button>
          </div>

          <!-- 调料 -->
          <div class="ingredient-section">
            <h3 class="subsection-title">调料</h3>
            <div class="ingredients-list">
              <div
                  v-for="(item, index) in recipeForm.seasonings"
                  :key="index"
                  class="ingredient-item"
              >
                <a-input
                    v-model:value="item.name"
                    placeholder="调料名称，如盐"
                    class="ingredient-name"
                />
                <a-input
                    v-model:value="item.amount"
                    placeholder="用量，如2"
                    class="ingredient-amount"
                />
                <a-select
                    v-model:value="item.unit"
                    placeholder="单位"
                    class="ingredient-unit"
                >
                  <a-select-option value="g">克</a-select-option>
                  <a-select-option value="kg">千克</a-select-option>
                  <a-select-option value="ml">毫升</a-select-option>
                  <a-select-option value="l">升</a-select-option>
                  <a-select-option value="tbsp">勺</a-select-option>
                  <a-select-option value="piece">个</a-select-option>
                  <a-select-option value="other">适量</a-select-option>
                </a-select>
                <a-button
                    type="text"
                    class="delete-btn"
                    @click="removeIngredient('seasoning', index)"
                >
                  <DeleteOutlined/>
                </a-button>
              </div>
            </div>
            <a-button
                type="dashed"
                class="add-btn"
                @click="addIngredient('seasoning')"
            >
              <PlusOutlined/>
              添加调料
            </a-button>
          </div>
        </div>

        <!-- 烹饪步骤 -->
        <div class="section">
          <h2 class="section-title">
            <OrderedListOutlined class="section-icon"/>
            烹饪步骤
          </h2>

          <div class="steps-list">
            <div
                v-for="(step, index) in recipeForm.steps"
                :key="index"
                class="step-item"
            >
              <div class="step-header">
                <h3 class="step-title">步骤 {{ index + 1 }}</h3>
                <div class="step-actions">
                  <a-button
                      type="text"
                      class="step-btn"
                      :disabled="index === 0"
                      @click="moveStep(index, 'up')"
                  >
                    <ArrowUpOutlined/>
                  </a-button>
                  <a-button
                      type="text"
                      class="step-btn"
                      :disabled="index === recipeForm.steps.length - 1"
                      @click="moveStep(index, 'down')"
                  >
                    <ArrowDownOutlined/>
                  </a-button>
                  <a-button
                      type="text"
                      class="step-btn delete"
                      @click="removeStep(index)"
                  >
                    <DeleteOutlined/>
                  </a-button>
                </div>
              </div>

              <a-textarea
                  v-model:value="step.description"
                  placeholder="描述这一步的操作，如：将西兰花洗净，切成小朵..."
                  :rows="2"
                  class="step-content"
              />

              <div class="step-footer">
                <div class="step-images" v-if="step.images && step.images.length > 0">
                  <div
                      v-for="(img, imgIndex) in step.images"
                      :key="imgIndex"
                      class="step-image-item"
                  >
                    <img :src="img" alt="步骤图片"/>
                    <a-button
                        type="text"
                        class="image-delete-btn"
                        @click="removeStepImage(index, imgIndex)"
                    >
                      <CloseOutlined/>
                    </a-button>
                  </div>
                </div>
                <div class="step-footer-actions">
                  <a-upload
                      :customRequest="(options) => customStepImageUpload(options, index)"
                      :showUploadList="false"
                      accept="image/jpeg,image/png"
                  >
                    <a-button type="link" class="upload-step-image-btn">
                      <PictureOutlined/>
                      添加步骤图片
                    </a-button>
                  </a-upload>
                  <span class="char-count">{{ step.description.length }}/500字</span>
                </div>
              </div>
            </div>
          </div>

          <a-button
              type="dashed"
              class="add-step-btn"
              @click="addStep"
          >
            <PlusOutlined/>
            添加步骤
          </a-button>
        </div>

        <!-- 小贴士 -->
        <div class="section">
          <h2 class="section-title">
            <BulbOutlined class="section-icon"/>
            烹饪小贴士
          </h2>

          <a-form-item name="tips">
            <a-textarea
                v-model:value="recipeForm.tips"
                placeholder="分享一些烹饪这道菜的窍门、替代食材的建议、保存方法等..."
                :rows="4"
            />
          </a-form-item>
        </div>
      </a-card>

      <!-- 底部操作栏 -->
      <div class="form-actions">
        <a-button @click="cancelSubmit">取消</a-button>
        <div class="action-right">
          <a-button class="draft-btn" @click="saveDraft">
            <template #icon>
              <SaveOutlined/>
            </template>
            保存草稿
          </a-button>
          <a-button type="primary" class="publish-btn" @click="publishRecipe">
            <template #icon>
              <CheckOutlined/>
            </template>
            发布菜谱
          </a-button>
        </div>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, nextTick} from 'vue'
import {useRouter} from 'vue-router'
import {message} from 'ant-design-vue'
import {
  UnorderedListOutlined,
  OrderedListOutlined,
  BulbOutlined,
  SaveOutlined,
  CheckOutlined,
  PlusOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloseOutlined,
  PictureOutlined
} from '@ant-design/icons-vue'
import type {UploadProps} from 'ant-design-vue'
import PublishSettings from "@/components/common/PublishSettings.vue";

// 路由
const router = useRouter()

// 表单引用
const recipeFormRef = ref()

// 表单数据
const recipeForm = reactive({
  title: '',
  description: '',
  category: undefined,
  difficulty: undefined,
  cookTime: 30,
  servings: 2,
  tags: ['早餐', '健康'],
  coverImage: '',
  mainIngredients: [
    {name: '', amount: '', unit: 'g'},
    {name: '', amount: '', unit: 'piece'}
  ],
  seasonings: [
    {name: '', amount: '', unit: 'g'},
    {name: '', amount: '', unit: 'other'}
  ],
  steps: [
    {description: '', images: []},
    {description: '', images: []}
  ],
  tips: '',
  privacy: 'public',
  comments: 'enabled'
})

// 表单验证规则
const rules = {
  title: [{required: true, message: '请输入菜谱名称', trigger: 'blur'}],
  category: [{required: true, message: '请选择分类', trigger: 'change'}],
  difficulty: [{required: true, message: '请选择难度', trigger: 'change'}],
  cookTime: [{required: true, message: '请输入烹饪时间', trigger: 'blur'}],
  servings: [{required: true, message: '请输入份量', trigger: 'blur'}],
  coverImage: [{required: true, message: '请上传菜谱成品图', trigger: 'change'}]
}

// 封面图片相关
const coverImageList = ref([])
const coverImageUrl = ref('')

// 标签相关
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref()

// 显示标签输入框
const showTagInput = () => {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

// 处理标签输入完成
const handleTagInputConfirm = () => {
  if (tagInputValue.value) {
    if (!recipeForm.tags.includes(tagInputValue.value)) {
      recipeForm.tags.push(tagInputValue.value)
    }
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

// 移除标签
const handleRemoveTag = (removedTag: string) => {
  recipeForm.tags = recipeForm.tags.filter(tag => tag !== removedTag)
}

// 图片上传前检查
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('只能上传JPG或PNG格式的图片！')
    return false
  }
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    message.error('图片必须小于5MB！')
    return false
  }
  return isJpgOrPng && isLt5M
}

// 自定义上传请求（模拟上传）
const customUploadRequest = (options: any) => {
  const {file} = options
  // 在实际应用中，这里应该调用API上传图片
  // 这里使用FileReader来模拟上传并生成预览
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    coverImageUrl.value = reader.result as string
    recipeForm.coverImage = reader.result as string
  }
}

// 自定义步骤图片上传
const customStepImageUpload = (options: any, stepIndex: number) => {
  const {file} = options
  // 在实际应用中，这里应该调用API上传图片
  // 这里使用FileReader来模拟上传并生成预览
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    const imageUrl = reader.result as string
    if (!recipeForm.steps[stepIndex].images) {
      recipeForm.steps[stepIndex].images = []
    }
    recipeForm.steps[stepIndex].images.push(imageUrl)
  }
}

// 删除封面图片
const removeCoverImage = () => {
  coverImageUrl.value = ''
  recipeForm.coverImage = ''
  coverImageList.value = []
}

// 删除步骤图片
const removeStepImage = (stepIndex: number, imageIndex: number) => {
  recipeForm.steps[stepIndex].images.splice(imageIndex, 1)
}

// 添加食材
const addIngredient = (type: 'main' | 'seasoning') => {
  const newIngredient = {name: '', amount: '', unit: type === 'main' ? 'g' : 'other'}
  if (type === 'main') {
    recipeForm.mainIngredients.push(newIngredient)
  } else {
    recipeForm.seasonings.push(newIngredient)
  }
}

// 移除食材
const removeIngredient = (type: 'main' | 'seasoning', index: number) => {
  if (type === 'main') {
    recipeForm.mainIngredients.splice(index, 1)
  } else {
    recipeForm.seasonings.splice(index, 1)
  }
}

// 添加步骤
const addStep = () => {
  recipeForm.steps.push({
    description: '',
    images: []
  })
}

// 移除步骤
const removeStep = (index: number) => {
  recipeForm.steps.splice(index, 1)
}

// 移动步骤
const moveStep = (index: number, direction: 'up' | 'down') => {
  if (direction === 'up' && index > 0) {
    const temp = recipeForm.steps[index]
    recipeForm.steps[index] = recipeForm.steps[index - 1]
    recipeForm.steps[index - 1] = temp
  } else if (direction === 'down' && index < recipeForm.steps.length - 1) {
    const temp = recipeForm.steps[index]
    recipeForm.steps[index] = recipeForm.steps[index + 1]
    recipeForm.steps[index + 1] = temp
  }
}

// 保存草稿
const saveDraft = () => {
  recipeFormRef.value.validate().then(() => {
    // 这里应该调用API保存草稿
    message.success('草稿保存成功！')
  }).catch((error: any) => {
    message.error('表单验证未通过，请检查必填项！')
    console.error('表单验证错误:', error)
  })
}

// 发布菜谱
const publishRecipe = () => {
  recipeFormRef.value.validate().then(() => {
    // 这里应该调用API发布菜谱
    message.success('菜谱发布成功！')
    // 发布成功后跳转到菜谱详情页
    // router.push({ name: 'RecipeDetail', params: { id: 'new-recipe-id' } })
  }).catch((error: any) => {
    message.error('表单验证未通过，请检查必填项！')
    console.error('表单验证错误:', error)
  })
}

// 取消提交
const cancelSubmit = () => {
  router.back()
}

// 组件挂载后处理
onMounted(() => {
  // 可以在这里初始化数据，例如从API获取分类列表等
})
</script>

<style scoped>
/* 页面容器 */
.create-recipe-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;
  background-color: #FFF8F0;
}

/* 页面标题栏 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.draft-btn {
  display: flex;
  align-items: center;
  border-color: #d9d9d9;
}

.publish-btn {
  display: flex;
  align-items: center;
  background-color: #FF9966;
  border-color: #FF9966;
}

.publish-btn:hover {
  background-color: #FF8C66;
  border-color: #FF8C66;
}

/* 表单卡片 */
.form-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

/* 表单部分 */
.section {
  padding: 24px 0;
  border-bottom: 1px solid #f0f0f0;
}

.section:last-child {
  border-bottom: none;
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

/* 基本信息栏 */
.basic-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-col {
  flex: 1;
}

/* 时间和份量输入框 */
.time-input, .servings-input {
  width: 75%;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.time-unit, .servings-unit {
  width: 25%;
  text-align: center;
  background-color: #f5f5f5;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  pointer-events: none;
}

/* 标签 */
.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recipe-tag {
  background-color: #FFEBE0;
  color: #FF9966;
  border: none;
  font-size: 14px;
}

.tag-add-btn {
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
}

.tag-input {
  width: 100px;
}

/* 图片上传区域 */
.upload-area {
  height: 220px;
  border: 2px dashed #FF9966;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.upload-area:hover {
  background-color: rgba(255, 153, 102, 0.05);
}

.upload-content {
  text-align: center;
}

.upload-icon {
  font-size: 36px;
  color: #FF9966;
  margin-bottom: 8px;
}

.upload-text {
  color: #333;
  margin-bottom: 4px;
}

.upload-hint {
  color: #999;
  font-size: 12px;
}

.upload-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.upload-tip {
  color: #999;
  font-size: 12px;
  margin: 0;
}

.add-more-btn {
  color: #FF9966;
  padding: 0;
}

.image-preview {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.image-preview-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s;
  border-radius: 6px;
}

.image-preview:hover .image-preview-mask {
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 1;
}

.delete-icon {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}

/* 食材清单 */
.ingredient-section {
  margin-bottom: 24px;
}

.ingredient-section:last-child {
  margin-bottom: 0;
}

.subsection-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
}

.ingredients-list {
  margin-bottom: 12px;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.ingredient-name {
  flex: 2;
}

.ingredient-amount {
  flex: 1;
}

.ingredient-unit {
  flex: 1;
}

.delete-btn {
  color: #999;
  transition: color 0.3s;
}

.delete-btn:hover {
  color: #ff4d4f;
}

.add-btn {
  border-color: #FF9966;
  color: #FF9966;
  background: none;
}

.add-btn:hover {
  background-color: #FFEBE0;
  border-color: #FF9966;
  color: #FF9966;
}

/* 烹饪步骤 */
.steps-list {
  margin-bottom: 16px;
}

.step-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.step-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.step-actions {
  display: flex;
  gap: 4px;
}

.step-btn {
  color: #999;
}

.step-btn:hover {
  color: #FF9966;
}

.step-btn.delete:hover {
  color: #ff4d4f;
}

.step-content {
  margin-bottom: 12px;
}

.step-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upload-step-image-btn {
  color: #666;
  padding: 0;
}

.upload-step-image-btn:hover {
  color: #FF9966;
}

.char-count {
  color: #999;
  font-size: 12px;
}

.step-images {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.step-image-item {
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.step-image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  font-size: 12px;
  padding: 0;
  color: #666;
}

.image-delete-btn:hover {
  background-color: #fff;
  color: #ff4d4f;
}

.add-step-btn {
  width: 100%;
  border-color: #FF9966;
  color: #FF9966;
  background: none;
}

.add-step-btn:hover {
  background-color: #FFEBE0;
  border-color: #FF9966;
  color: #FF9966;
}

/* 发布设置 */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.radio-item {
  margin-bottom: 16px;
}

.radio-desc {
  margin-left: 24px;
  font-size: 12px;
  color: #999;
}

/* 底部操作栏 */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.action-right {
  display: flex;
  gap: 12px;
}

/* 响应式布局适配 */
@media (max-width: 768px) {
  .basic-info-grid {
    grid-template-columns: 1fr;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    flex-direction: column;
    gap: 8px;
  }

  .ingredient-item {
    flex-wrap: wrap;
  }

  .ingredient-name {
    flex: 1 1 100%;
  }

  .ingredient-amount, .ingredient-unit {
    flex: 1;
  }

  .form-actions {
    flex-direction: column;
    gap: 16px;
  }

  .action-right {
    justify-content: flex-end;
  }
}


.custom-radio-option:hover .custom-radio-indicator,
.custom-radio-option.active .custom-radio-indicator {
  border-color: #FF9966;
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

/* 覆盖Ant Design Radio样式（如果需要在其他地方使用） */
:deep(.ant-radio-wrapper:hover .ant-radio-inner) {
  border-color: #FF9966 !important;
}

:deep(.ant-radio-checked .ant-radio-inner) {
  border-color: #FF9966 !important;
  background-color: #fff !important;
}

:deep(.ant-radio-inner::after) {
  background-color: #FF9966 !important;
}

:deep(.ant-radio-wrapper-checked:hover .ant-radio-inner) {
  border-color: #FF9966 !important;
}
</style>