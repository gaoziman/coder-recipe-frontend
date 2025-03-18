<!-- src/pages/admin/RecipeManagement.vue -->
<template>
  <div class="recipe-management">
    <div class="page-header">
      <h2 class="page-title">菜谱管理</h2>
      <div class="page-actions">
        <a-button type="primary" @click="handleAdd">
          <template #icon>
            <plus-outlined/>
          </template>
          新增菜谱
        </a-button>
      </div>
    </div>

    <div class="page-filter">
      <a-form layout="inline" :model="filterForm">
        <a-form-item label="菜谱名称">
          <a-input
              v-model:value="filterForm.title"
              placeholder="请输入菜谱名称"
              allowClear
          />
        </a-form-item>
        <a-form-item label="分类">
          <a-select
              v-model:value="filterForm.categoryId"
              placeholder="请选择分类"
              style="width: 160px"
              allowClear
          >
            <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
              v-model:value="filterForm.status"
              placeholder="请选择状态"
              style="width: 120px"
              allowClear
          >
            <a-select-option value="1">已发布</a-select-option>
            <a-select-option value="0">草稿</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">
            <template #icon>
              <search-outlined/>
            </template>
            搜索
          </a-button>
          <a-button style="margin-left: 8px" @click="handleReset">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <a-table
        :dataSource="recipeList"
        :columns="columns"
        :loading="loading"
        :pagination="{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: handlePageChange,
        onShowSizeChange: handleSizeChange,
        showTotal: total => `共 ${total} 条数据`
      }"
        rowKey="id"
    >
      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'title'">
          <div class="recipe-title-cell">
            <img :src="record.coverImage" class="recipe-cover"/>
            <span>{{ record.title }}</span>
          </div>
        </template>


        <!-- 分类标签 -->
        <template v-if="column.key === 'categoryName'">
          <span
              class="category-tag"
              :style="{
              backgroundColor: getCategoryStyle(record.categoryId).background,
              borderColor: getCategoryStyle(record.categoryId).border,
              color: getCategoryStyle(record.categoryId).text
            }"
          >
            {{ record.categoryName }}
          </span>
        </template>

        <!-- 发布标签 -->
        <template v-if="column.key === 'status'">
          <a-tag :class="[record.status === 1 ? 'status-tag status-published' : 'status-tag status-draft']">
            {{ record.status === 1 ? '已发布' : '草稿' }}
          </a-tag>
        </template>

        <!-- 难度标签 -->
        <template v-if="column.key === 'difficulty'">
            <span
                class="difficulty-tag"
                :style="{
                backgroundColor: getDifficultyStyle(record.difficulty).background,
                borderColor: getDifficultyStyle(record.difficulty).border,
                color: getDifficultyStyle(record.difficulty).text
              }"
            >
              {{ getDifficultyText(record.difficulty) }}
            </span>
        </template>

        <!-- 操作按钮 -->
        <template v-if="column.key === 'operation'">
          <div class="operation-btns">
            <a-button type="link" size="small" class="operation-btn-view" @click="handleView(record)">
              <template #icon>
                <eye-outlined/>
              </template>
              预览
            </a-button>
            <a-button type="link" size="small" class="operation-btn-edit" @click="handleEdit(record)">
              <template #icon>
                <edit-outlined/>
              </template>
              编辑
            </a-button>
            <a-popconfirm
                title="确定删除此菜谱？此操作不可恢复。"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record)"
            >
              <a-button type="link" danger size="small" class="operation-btn-delete">
                <template #icon>
                  <delete-outlined/>
                </template>
                删除
              </a-button>
            </a-popconfirm>
          </div>
        </template>
      </template>
    </a-table>

      <!-- 新增/编辑菜谱弹窗 -->
      <a-modal
          v-model:visible="modalVisible"
          :title="isEditing ? '编辑菜谱' : '新增菜谱'"
          width="700px"
          :footer="null"
          @cancel="modalVisible = false"
      >
        <a-form
            :model="recipeForm"
            :rules="rules"
            ref="recipeFormRef"
            layout="vertical"
        >
          <a-row :gutter="16">
            <a-col :span="16">
              <a-form-item label="菜谱名称" name="title">
                <a-input v-model:value="recipeForm.title" placeholder="请输入菜谱名称"/>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="分类" name="categoryId">
                <a-select v-model:value="recipeForm.categoryId" placeholder="请选择分类">
                  <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item label="简介" name="description">
            <a-textarea v-model:value="recipeForm.description" placeholder="请输入菜谱简介" :rows="3"/>
          </a-form-item>

          <a-form-item label="封面图" name="coverImage">
            <a-upload
                v-model:fileList="fileList"
                :action="uploadAction"
                list-type="picture-card"
                :show-upload-list="true"
                :before-upload="beforeUpload"
                :headers="uploadHeaders"
                @change="handleUploadChange"
            >
              <div v-if="fileList.length < 1">
                <plus-outlined/>
                <div style="margin-top: 8px">上传</div>
              </div>
            </a-upload>
          </a-form-item>

          <a-form-item label="烹饪时间(分钟)" name="cookingTime">
            <a-input-number v-model:value="recipeForm.cookingTime" :min="1" style="width: 100%"/>
          </a-form-item>

          <a-form-item label="难度" name="difficulty">
            <a-rate v-model:value="recipeForm.difficulty" :count="3"/>
          </a-form-item>

          <a-form-item label="状态" name="status">
            <a-radio-group v-model:value="recipeForm.status">
              <a-radio :value="1">发布</a-radio>
              <a-radio :value="0">草稿</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item class="form-footer">
            <div class="form-footer-buttons">
              <a-space>
                <a-button @click="modalVisible = false">取消</a-button>
                <a-button type="primary" @click="handleSubmit">保存</a-button>
              </a-space>
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {message} from 'ant-design-vue'
import {
  DeleteOutlined,
  EditOutlined, EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()

// 分类数据
const categories = ref([
  {id: 'c001', name: '家常菜'},
  {id: 'c002', name: '西餐'},
  {id: 'c003', name: '川菜'},
  {id: 'c004', name: '粤菜'},
  {id: 'c005', name: '其他'}
])

// 筛选表单
const filterForm = reactive({
  title: '',
  categoryId: undefined,
  status: undefined
})

// 表格数据
const loading = ref(false)
const recipeList = ref([
  {
    id: 'r001',
    title: '香煎三文鱼配蔬菜沙拉',
    coverImage: 'https://via.placeholder.com/60',
    categoryId: 'c002',
    categoryName: '西餐',
    cookingTime: 30,
    difficulty: 2,
    author: '张厨师',
    createTime: '2023-05-28 14:30',
    views: 1253,
    status: 1
  },
  {
    id: 'r002',
    title: '番茄牛腩汤',
    coverImage: 'https://via.placeholder.com/60',
    categoryId: 'c001',
    categoryName: '家常菜',
    cookingTime: 120,
    difficulty: 1,
    author: '美食达人',
    createTime: '2023-05-27 09:15',
    views: 876,
    status: 1
  },
  {
    id: 'r003',
    title: '黑椒牛排',
    coverImage: 'https://via.placeholder.com/60',
    categoryId: 'c002',
    categoryName: '西餐',
    cookingTime: 45,
    difficulty: 3,
    author: '西餐主厨',
    createTime: '2023-05-26 18:40',
    views: 1890,
    status: 1
  },
  {
    id: 'r004',
    title: '青椒土豆丝',
    coverImage: 'https://via.placeholder.com/60',
    categoryId: 'c003',
    categoryName: '川菜',
    cookingTime: 20,
    difficulty: 1,
    author: '家常菜爱好者',
    createTime: '2023-05-25 11:20',
    views: 623,
    status: 1
  },
  {
    id: 'r005',
    title: '川味麻婆豆腐',
    coverImage: 'https://via.placeholder.com/60',
    categoryId: 'c003',
    categoryName: '川菜',
    cookingTime: 30,
    difficulty: 2,
    author: '川菜师傅',
    createTime: '2023-05-24 16:05',
    views: 1420,
    status: 0
  }
])

// 表格列定义
const columns = [
  {
    title: '菜谱名称',
    align: 'center',
    key: 'title',
    width: 250
  },
  {
    title: '分类',
    align: 'center',
    dataIndex: 'categoryName',
    key: 'categoryName',
    width: 100
  },
  {
    title: '烹饪时间',
    align: 'center',
    dataIndex: 'cookingTime',
    key: 'cookingTime',
    width: 100,
    customRender: ({text}) => `${text} 分钟`
  },
  {
    align: 'center',
    title: '难度',
    dataIndex: 'difficulty',
    key: 'difficulty',
    width: 100,
    customRender: ({text}) => {
      const levels = ['简单', '普通', '困难']
      return levels[text - 1]
    }
  },
  {
    title: '创建者',
    align: 'center',
    dataIndex: 'author',
    key: 'author',
    width: 120
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160
  },
  {
    title: '浏览量',
    align: 'center',
    dataIndex: 'views',
    key: 'views',
    width: 100
  },
  {
    title: '状态',
    align: 'center',
    key: 'status',
    width: 100
  },
  {
    title: '操作',
    align: 'center',
    key: 'operation',
    width: 180
  }
]


// 修改分类样式配置，更加精细化
const categoryStyles = {
  'c001': {
    background: '#FFF1F0',
    border: '#FFCCC7',
    text: '#FF4D4F'
  },
  'c002': {
    background: '#E8F5E9',
    border: '#C8E6C9',
    text: '#4CAF50'
  },
  'c003': {
    background: '#FFFBE6',
    border: '#FFE58F',
    text: '#FAAD14'
  },
  'c004': {
    background: '#E6FFFB',
    border: '#87E8DE',
    text: '#13C2C2'
  },
  'c005': {
    background: '#FFF0F6',
    border: '#FFADD2',
    text: '#EB2F96'
  },
  'c006': {
    background: '#FFE0EC',
    border: '#FFAAC9',
    text: '#EB2F96'
  },
}

// 获取分类标签样式的方法
const getCategoryStyle = (categoryId) => {
  return categoryStyles[categoryId] || {
    background: '#F5F5F5',
    border: '#D9D9D9',
    text: '#999999'
  }
}

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 5
})

// 模态框相关
const modalVisible = ref(false)
const isEditing = ref(false)
const recipeFormRef = ref()
const recipeForm = reactive({
  id: '',
  title: '',
  categoryId: undefined,
  description: '',
  coverImage: '',
  cookingTime: 30,
  difficulty: 1,
  status: 1
})

// 表单验证规则
const rules = {
  title: [{required: true, message: '请输入菜谱名称', trigger: 'blur'}],
  categoryId: [{required: true, message: '请选择分类', trigger: 'change'}],
  cookingTime: [{required: true, message: '请输入烹饪时间', trigger: 'blur'}]
}

// 文件上传相关
const fileList = ref([])
const uploadAction = '/api/upload' // 替换为实际的上传接口
const uploadHeaders = {
  authorization: 'Bearer ' + localStorage.getItem('token')
}

// 搜索处理
const handleSearch = () => {
  loading.value = true
  pagination.current = 1

  // 模拟请求延迟
  setTimeout(() => {
    loading.value = false
    // 这里应该调用实际的API获取数据
    message.success('搜索成功')
  }, 500)
}

// 重置筛选
const handleReset = () => {
  filterForm.title = ''
  filterForm.categoryId = undefined
  filterForm.status = undefined
  handleSearch()
}

// 页码变化
const handlePageChange = (page, pageSize) => {
  pagination.current = page
  pagination.pageSize = pageSize
  // 获取对应页的数据
}

// 每页条数变化
const handleSizeChange = (current, size) => {
  pagination.pageSize = size
  // 获取对应数量的数据
}

// 新增菜谱
const handleAdd = () => {
  isEditing.value = false
  // 重置表单
  Object.assign(recipeForm, {
    id: '',
    title: '',
    categoryId: undefined,
    description: '',
    coverImage: '',
    cookingTime: 30,
    difficulty: 1,
    status: 1
  })
  fileList.value = []
  modalVisible.value = true
}

// 编辑菜谱
const handleEdit = (record) => {
  isEditing.value = true
  // 填充表单
  Object.assign(recipeForm, {
    id: record.id,
    title: record.title,
    categoryId: record.categoryId,
    description: record.description || '',
    coverImage: record.coverImage,
    cookingTime: record.cookingTime,
    difficulty: record.difficulty,
    status: record.status
  })
  // 设置文件列表
  fileList.value = record.coverImage ? [
    {
      uid: '-1',
      name: 'cover.jpg',
      status: 'done',
      url: record.coverImage
    }
  ] : []
  modalVisible.value = true
}

// 查看菜谱
const handleView = (record) => {
  router.push(`/recipes/${record.id}`)
}

// 删除菜谱
const handleDelete = (record) => {
  // 这里应该调用实际的API删除数据
  recipeList.value = recipeList.value.filter(item => item.id !== record.id)
  message.success('删除成功')
}

// 表单提交
const handleSubmit = () => {
  recipeFormRef.value.validate().then(() => {
    // 这里应该调用实际的API保存数据
    if (isEditing.value) {
      // 更新现有数据
      const index = recipeList.value.findIndex(item => item.id === recipeForm.id)
      if (index !== -1) {
        const categoryObj = categories.value.find(c => c.id === recipeForm.categoryId)
        recipeList.value[index] = {
          ...recipeList.value[index],
          title: recipeForm.title,
          categoryId: recipeForm.categoryId,
          categoryName: categoryObj ? categoryObj.name : '',
          description: recipeForm.description,
          coverImage: recipeForm.coverImage,
          cookingTime: recipeForm.cookingTime,
          difficulty: recipeForm.difficulty,
          status: recipeForm.status
        }
      }
      message.success('菜谱更新成功')
    } else {
      // 添加新数据
      const categoryObj = categories.value.find(c => c.id === recipeForm.categoryId)
      recipeList.value.unshift({
        id: 'r' + Date.now(),
        title: recipeForm.title,
        categoryId: recipeForm.categoryId,
        categoryName: categoryObj ? categoryObj.name : '',
        description: recipeForm.description,
        coverImage: recipeForm.coverImage || 'https://via.placeholder.com/60',
        cookingTime: recipeForm.cookingTime,
        difficulty: recipeForm.difficulty,
        author: '当前用户',
        createTime: new Date().toLocaleString(),
        views: 0,
        status: recipeForm.status
      })
      message.success('菜谱添加成功')
    }
    modalVisible.value = false
  }).catch(error => {
    console.log('验证失败:', error)
  })
}

// 上传前验证
const beforeUpload = (file) => {
  const isImage = file.type.indexOf('image/') === 0
  if (!isImage) {
    message.error('只能上传图片文件!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片必须小于2MB!')
  }
  return isImage && isLt2M
}

// 上传状态变化
const handleUploadChange = (info) => {
  fileList.value = info.fileList.slice(-1)
  if (info.file.status === 'done') {
    // 假设上传接口返回了图片URL
    recipeForm.coverImage = info.file.response.url
    message.success(`${info.file.name} 上传成功`)
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败`)
  }
}

// 添加难度标签样式配置对象
const difficultyStyles = {
  '1': { // 简单
    background: '#E8F5E9',
    border: '#C8E6C9',
    text: '#4CAF50'
  },
  '2': { // 普通
    background: '#FFF3E0',
    border: '#FFE0B2',
    text: '#FF9800'
  },
  '3': { // 困难
    background: '#FFEBEE',
    border: '#FFCDD2',
    text: '#F44336'
  }
}

// 获取难度标签样式
const getDifficultyStyle = (difficulty) => {
  return difficultyStyles[difficulty] || {
    background: '#F5F5F5',
    border: '#D9D9D9',
    text: '#999999'
  }
}

// 获取难度文本（如果您需要自定义显示文本）
const getDifficultyText = (difficulty) => {
  const levels = ['简单', '普通', '困难'];
  return levels[difficulty - 1] || '';
}

// 初始化数据
onMounted(() => {
  // 这里应该调用实际的API获取数据
})
</script>

<style scoped>
.recipe-management {
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

.page-filter {
  margin-bottom: 24px;
  padding: 20px;
  background: #ffffff; /* 修改为白色背景 */
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(240, 136, 76, 0.08); /* 添加轻微阴影 */
  border: 1px solid #f0f0f0; /* 添加细边框 */
}

.recipe-title-cell {
  display: flex;
  align-items: center;
}

.recipe-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
  object-fit: cover;
}

.operation-btns {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* 添加底部按钮样式 */
.form-footer {
  margin-bottom: 0;
  margin-top: 24px;
}

.form-footer-buttons {
  display: flex;
  justify-content: flex-end;
}

/* 已发布状态标签 */
.status-published {
  color: #36A45E;
  background-color: #E8F7EF;
  border: 1px solid #C5EBD6;
  border-radius: 4px;
  padding: 0 8px;
  font-size: 13px;
  line-height: 20px;
  display: inline-block;
}

/* 鼠标悬停效果 */
.status-published:hover {
  background-color: #D7F2E3;
}

/* 通用状态标签样式 */
.status-tag {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.2;
  display: inline-block;
  text-align: center;
  min-width: 64px;
  transition: all 0.3s;
}

.status-draft {
  color: #7759B2; /* 新的颜色：优雅的紫罗兰色 */
  background-color: #F5F0FF; /* 浅紫色背景 */
  border: 1px solid #E2D7F4; /* 浅紫色边框 */
}


.status-draft:hover {
  background-color: #EEE6FB;
}


/* 操作按钮组样式优化 */
.operation-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 预览按钮 */
:deep(.operation-btn-view) {
  color: #F0884C !important;
}

/* 编辑按钮 */
:deep(.operation-btn-edit) {
  color: #F0884C !important;
}

/* 删除按钮 */
:deep(.operation-btn-delete) {
  color: #FF5E62 !important;
}

/* 难度标签样式 */
.difficulty-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.2;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  font-weight: 500;
  min-width: 64px;
  transition: all 0.3s;
}

/* 分类标签样式 */
.category-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.2;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  font-weight: 500;
  min-width: 64px;
  transition: all 0.3s;
}


/* 覆盖 Ant Design 按钮样式 */
:deep(.ant-btn-primary) {
  background-color: #F0884C;
  border-color: #F0884C;
}

:deep(.ant-btn-primary:hover) {
  background-color: #FF9966;
  border-color: #FF9966;
}

:deep(.ant-btn-link) {
  color: #F0884C;
}

:deep(.ant-btn-link:hover) {
  color: #FF9966;
}

:deep(.ant-radio-checked .ant-radio-inner) {
  border-color: #F0884C;
  background-color: #F0884C;
}

:deep(.ant-radio:hover .ant-radio-inner) {
  border-color: #FF9966;
}

:deep(.ant-rate-star.ant-rate-star-full .ant-rate-star-second) {
  color: #F0884C;
}
</style>