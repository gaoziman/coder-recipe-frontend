<template>
  <div class="edit-recipe-container">
    <!-- 页面标题栏 -->
    <div class="page-header">
      <h1 class="page-title">编辑菜谱</h1>
      <div class="action-buttons">
        <a-button class="draft-btn" @click="saveDraft">
          <template #icon>
            <SaveOutlined/>
          </template>
          保存草稿
        </a-button>
        <a-button type="primary" class="publish-btn" @click="updateRecipe">
          <template #icon>
            <CheckOutlined/>
          </template>
          更新菜谱
        </a-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large"/>
      <p class="loading-text">正在加载菜谱数据...</p>
    </div>

    <!-- 菜谱表单内容 -->
    <a-form
        v-else
        :model="recipeForm"
        :rules="rules"
        ref="recipeFormRef"
        layout="vertical"
        class="recipe-form"
    >
      <a-card class="form-card">
        <!-- 基本信息 -->
        <div class="section">
          <h2 class="section-title">
            <InfoCircleOutlined class="section-icon"/>
            基本信息
          </h2>

          <div class="basic-info-grid">
            <!-- 左侧表单 -->
            <div class="form-left">
              <a-form-item label="菜谱名称" name="title" required>
                <a-input
                    v-model:value="recipeForm.title"
                    placeholder="例如: 蒜蓉西兰花"
                />
              </a-form-item>

              <a-form-item label="菜谱描述" name="description">
                <a-textarea
                    v-model:value="recipeForm.description"
                    placeholder="简单描述一下这道菜的特点、口感或由来..."
                    :rows="3"
                />
              </a-form-item>

              <div class="form-row">
                <a-form-item label="分类" name="category" required class="form-col">
                  <a-select
                      v-model:value="recipeForm.category"
                      placeholder="选择分类"
                  >
                    <a-select-option value="home">家常菜</a-select-option>
                    <a-select-option value="quick">快手菜</a-select-option>
                    <a-select-option value="soup">汤羹</a-select-option>
                    <a-select-option value="dessert">甜点</a-select-option>
                    <a-select-option value="staple">主食</a-select-option>
                    <a-select-option value="veg">素食</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="难度" name="difficulty" required class="form-col">
                  <a-select
                      v-model:value="recipeForm.difficulty"
                      placeholder="选择难度"
                  >
                    <a-select-option value="easy">简单</a-select-option>
                    <a-select-option value="medium">中等</a-select-option>
                    <a-select-option value="hard">困难</a-select-option>
                  </a-select>
                </a-form-item>
              </div>

              <div class="form-row">
                <a-form-item label="烹饪时间" name="cookTime" required class="form-col">
                  <a-input-group compact>
                    <a-input-number
                        v-model:value="recipeForm.cookTime"
                        placeholder="30"
                        class="time-input"
                    />
                    <a-input
                        class="time-unit"
                        placeholder="分钟"
                        disabled
                    />
                  </a-input-group>
                </a-form-item>

                <a-form-item label="份量" name="servings" required class="form-col">
                  <a-input-group compact>
                    <a-input-number
                        v-model:value="recipeForm.servings"
                        placeholder="2"
                        class="servings-input"
                    />
                    <a-input
                        class="servings-unit"
                        placeholder="人份"
                        disabled
                    />
                  </a-input-group>
                </a-form-item>
              </div>

              <a-form-item label="标签" name="tags">
                <div class="tags-wrapper">
                  <a-tag
                      v-for="(tag, index) in recipeForm.tags"
                      :key="index"
                      closable
                      class="recipe-tag"
                      @close="handleRemoveTag(tag)"
                  >
                    {{ tag }}
                  </a-tag>
                  <a-tag v-if="!tagInputVisible" class="tag-add-btn" @click="showTagInput">
                    <PlusOutlined/>
                    添加标签
                  </a-tag>
                  <a-input
                      v-else
                      ref="tagInputRef"
                      v-model:value="tagInputValue"
                      class="tag-input"
                      size="small"
                      @blur="handleTagInputConfirm"
                      @pressEnter="handleTagInputConfirm"
                  />
                </div>
              </a-form-item>
            </div>

            <!-- 右侧图片上传 -->
            <div class="form-right">
              <a-form-item label="菜谱成品图" name="coverImage" required>
                <a-upload-dragger
                    v-model:fileList="coverImageList"
                    :customRequest="customUploadRequest"
                    :beforeUpload="beforeUpload"
                    :showUploadList="false"
                    accept="image/jpeg,image/png"
                    class="upload-area"
                >
                  <div v-if="coverImageUrl" class="image-preview">
                    <img :src="coverImageUrl" alt="菜谱成品图"/>
                    <div class="image-preview-mask">
                      <DeleteOutlined class="delete-icon" @click.stop="removeCoverImage"/>
                    </div>
                  </div>
                  <div v-else class="upload-content">
                    <p class="upload-icon">
                      <PictureOutlined/>
                    </p>
                    <p class="upload-text">点击上传或拖拽图片到这里</p>
                    <p class="upload-hint">支持JPG、PNG格式，最大5MB</p>
                  </div>
                </a-upload-dragger>
                <div class="upload-extra">
                  <p class="upload-tip">
                    <InfoCircleOutlined/>
                    建议上传清晰、有食欲感的成品图
                  </p>
                  <a-button type="link" size="small" class="add-more-btn">
                    添加更多图片
                  </a-button>
                </div>
              </a-form-item>
            </div>
          </div>
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

        <!-- 发布设置 -->
        <div class="section">
          <h2 class="section-title">
            <SettingOutlined class="section-icon"/>
            发布设置
          </h2>

          <div class="settings-grid">
            <div class="setting-group">
              <a-form-item name="privacy">
                <div class="custom-radio-group">
                  <div
                      class="custom-radio-option"
                      :class="{ 'active': recipeForm.privacy === 'public' }"
                      @click="recipeForm.privacy = 'public'"
                  >
                    <div class="custom-radio-indicator">
                      <div class="custom-radio-dot" v-if="recipeForm.privacy === 'public'"></div>
                    </div>
                    <div class="custom-radio-content">
                      <div class="custom-radio-label">公开分享</div>
                      <div class="custom-radio-description">所有用户都可以看到这个菜谱</div>
                    </div>
                  </div>

                  <div
                      class="custom-radio-option"
                      :class="{ 'active': recipeForm.privacy === 'private' }"
                      @click="recipeForm.privacy = 'private'"
                  >
                    <div class="custom-radio-indicator">
                      <div class="custom-radio-dot" v-if="recipeForm.privacy === 'private'"></div>
                    </div>
                    <div class="custom-radio-content">
                      <div class="custom-radio-label">仅自己可见</div>
                      <div class="custom-radio-description">只有您自己能看到这个菜谱</div>
                    </div>
                  </div>
                </div>
              </a-form-item>
            </div>

            <div class="setting-group">
              <a-form-item name="comments">
                <div class="custom-radio-group">
                  <div
                      class="custom-radio-option"
                      :class="{ 'active': recipeForm.comments === 'enabled' }"
                      @click="recipeForm.comments = 'enabled'"
                  >
                    <div class="custom-radio-indicator">
                      <div class="custom-radio-dot" v-if="recipeForm.comments === 'enabled'"></div>
                    </div>
                    <div class="custom-radio-content">
                      <div class="custom-radio-label">允许评论</div>
                      <div class="custom-radio-description">其他用户可以对您的菜谱发表评论</div>
                    </div>
                  </div>

                  <div
                      class="custom-radio-option"
                      :class="{ 'active': recipeForm.comments === 'disabled' }"
                      @click="recipeForm.comments = 'disabled'"
                  >
                    <div class="custom-radio-indicator">
                      <div class="custom-radio-dot" v-if="recipeForm.comments === 'disabled'"></div>
                    </div>
                    <div class="custom-radio-content">
                      <div class="custom-radio-label">关闭评论</div>
                      <div class="custom-radio-description">其他用户不能对此菜谱发表评论</div>
                    </div>
                  </div>
                </div>
              </a-form-item>
            </div>
          </div>
        </div>
      </a-card>

      <!-- 底部操作栏 -->
      <div class="form-actions">
        <a-button @click="cancelEdit">取消</a-button>
        <div class="action-right">
          <a-button class="draft-btn" @click="saveDraft">
            <template #icon>
              <SaveOutlined/>
            </template>
            保存草稿
          </a-button>
          <a-button type="primary" class="publish-btn" @click="updateRecipe">
            <template #icon>
              <CheckOutlined/>
            </template>
            更新菜谱
          </a-button>
        </div>
      </div>
    </a-form>

    <!-- 无法找到菜谱的提示 -->
    <div v-if="notFound" class="not-found">
      <a-result
          status="404"
          title="菜谱未找到"
          sub-title="很抱歉，您要编辑的菜谱不存在或已被删除"
      >
        <template #extra>
          <a-button type="primary" @click="goToMyRecipes">
            返回我的菜谱
          </a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, nextTick, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {message} from 'ant-design-vue'
import {
  InfoCircleOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  BulbOutlined,
  SettingOutlined,
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
import {useUserStore} from '@/stores/user'

// 路由和获取参数
const router = useRouter()
const route = useRoute()
const recipeId = ref(route.params.id as string)

// 用户状态
const userStore = useUserStore()

// 加载和错误状态
const loading = ref(true)
const notFound = ref(false)

// 表单引用
const recipeFormRef = ref()

// 表单数据 - 初始化为空以便后续填充
const recipeForm = reactive({
  title: '',
  description: '',
  category: undefined,
  difficulty: undefined,
  cookTime: 30,
  servings: 2,
  tags: [],
  coverImage: '',
  mainIngredients: [],
  seasonings: [],
  steps: [],
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
    message.success('草稿已保存！')
  }).catch((error: any) => {
    message.error('表单验证未通过，请检查必填项！')
    console.error('表单验证错误:', error)
  })
}

// 更新菜谱
const updateRecipe = () => {
  recipeFormRef.value.validate().then(() => {
    // 这里应该调用API更新菜谱
    message.success('菜谱更新成功！')
    // 更新成功后跳转到菜谱详情页
    router.push({name: 'RecipeDetail', params: {id: recipeId.value}})
  }).catch((error: any) => {
    message.error('表单验证未通过，请检查必填项！')
    console.error('表单验证错误:', error)
  })
}

// 取消编辑
const cancelEdit = () => {
  // 弹出确认框确认用户是否要放弃更改
  if (window.confirm('确定要放弃当前的编辑内容吗？未保存的更改将丢失。')) {
    router.back()
  }
}

// 跳转到我的菜谱页面
const goToMyRecipes = () => {
  router.push({name: 'Recipes'})
}

// 获取菜谱数据
const fetchRecipeData = async () => {
  try {
    loading.value = true

    // 这里应该是从API获取数据
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟菜谱数据
    // 在实际应用中，这里应该是API返回的数据
    const mockRecipeData = {
      id: recipeId.value,
      title: '香煎三文鱼配蔬菜',
      description: '鲜嫩多汁的三文鱼搭配时令蔬菜，简单又营养的一餐。',
      category: 'quick',
      difficulty: 'medium',
      cookTime: 25,
      servings: 2,
      tags: ['海鲜', '快手菜', '低碳水'],
      coverImage: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      mainIngredients: [
        {name: '三文鱼', amount: '300', unit: 'g'},
        {name: '西兰花', amount: '200', unit: 'g'},
        {name: '西红柿', amount: '2', unit: 'piece'}
      ],
      seasonings: [
        {name: '橄榄油', amount: '2', unit: 'tbsp'},
        {name: '盐', amount: '', unit: 'other'},
        {name: '黑胡椒', amount: '', unit: 'other'}
      ],
      steps: [
        {
          description: '将三文鱼洗净，用厨房纸吸干表面水分。撒上适量盐和黑胡椒，腌制10分钟。',
          images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60']
        },
        {
          description: '西兰花洗净，切成小朵。西红柿洗净，切成小块。',
          images: []
        },
        {
          description: '热锅倒入橄榄油，中小火将三文鱼皮朝下放入锅中，煎至皮酥脆，约3-4分钟。',
          images: ['https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60']
        },
        {
          description: '翻面继续煎2-3分钟，至三文鱼熟透但仍保持嫩滑。取出备用。',
          images: []
        },
        {
          description: '同一锅中加入西兰花翻炒约2分钟，加入少量水焖1分钟，最后加入西红柿块略微翻炒。',
          images: []
        },
        {
          description: '将炒好的蔬菜铺盘，放上煎好的三文鱼，撒上黑胡椒即可享用。',
          images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60']
        }
      ],
      tips: '1. 三文鱼最好选择新鲜的，这样肉质更加鲜嫩。\n2. 煎三文鱼时不要频繁翻动，以免破坏鱼肉完整性。\n3. 可以根据个人口味添加柠檬汁或者迷迭香增加风味。',
      privacy: 'public',
      comments: 'enabled'
    }

    // 检查是否找到菜谱数据
    if (mockRecipeData) {
      // 填充表单数据
      Object.assign(recipeForm, mockRecipeData)
      // 设置封面图片URL
      coverImageUrl.value = mockRecipeData.coverImage
    } else {
      notFound.value = true
    }
  } catch (error) {
    console.error('获取菜谱数据出错:', error)
    message.error('获取菜谱数据失败，请稍后再试')
    notFound.value = true
  } finally {
    loading.value = false
  }
}

// 检查用户权限
const checkPermission = () => {
  // 检查用户是否有权限编辑该菜谱
  // 在实际应用中，这里应该检查菜谱的创建者是否是当前用户
  // 或者用户是否有管理员权限
  return true
}

// 组件挂载后处理
onMounted(async () => {
  if (!userStore.isLoggedIn) {
    message.warning('请先登录以编辑菜谱')
    router.push({name: 'Home'})
    return
  }

  // 确保有菜谱ID
  if (!recipeId.value) {
    message.error('菜谱ID无效')
    router.push({name: 'Recipes'})
    return
  }

  // 获取菜谱数据
  await fetchRecipeData()

  // 检查权限
  if (!notFound.value && !checkPermission()) {
    message.error('您没有权限编辑此菜谱')
    router.push({name: 'RecipeDetail', params: {id: recipeId.value}})
  }
})
</script>

<style scoped>
/* 页面容器 */
.edit-recipe-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;
  background-color: #FFF8F0;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100px 0;
}

.loading-text {
  margin-top: 16px;
  color: #666;
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

/* 自定义单选按钮样式 */
.custom-radio-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.custom-radio-option {
  display: flex;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.custom-radio-option:hover {
  border-color: #FF9966;
  background-color: #FFEBE0;
}

.custom-radio-option.active {
  border-color: #FF9966;
  background-color: #FFEBE0;
}

.custom-radio-indicator {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #d9d9d9;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s;
}

.custom-radio-option:hover .custom-radio-indicator,
.custom-radio-option.active .custom-radio-indicator {
  border-color: #FF9966;
}

.custom-radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #FF9966;
}

.custom-radio-content {
  flex: 1;
}

.custom-radio-label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.custom-radio-description {
  font-size: 14px;
  color: #666;
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

/* 未找到菜谱的提示 */
.not-found {
  padding: 48px 0;
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
</style>