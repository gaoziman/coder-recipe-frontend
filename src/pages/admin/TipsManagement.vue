<!-- src/pages/admin/TipsManagement.vue -->
<template>
  <div class="tips-management">
    <div class="page-header">
      <h2 class="page-title">烹饪小贴士管理</h2>
      <div class="page-actions">
        <a-button type="primary" @click="handleAdd">
          <template #icon>
            <plus-outlined/>
          </template>
          新增贴士
        </a-button>
      </div>
    </div>

    <div class="page-filter">
      <a-form layout="inline" :model="filterForm">
        <a-form-item label="贴士标题">
          <a-input
              v-model:value="filterForm.title"
              placeholder="请输入贴士标题"
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
        :dataSource="tipsList"
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
          <div class="tip-title-cell">
            <img :src="record.coverImage" class="tip-cover"/>
            <span>{{ record.title }}</span>
          </div>
        </template>

        <!-- 分类 -->
        <template v-if="column.key === 'categoryName'">
            <span
                class="category-tag"
                :style="{
                backgroundColor: getTipCategoryStyle(record.categoryId).background,
                borderColor: getTipCategoryStyle(record.categoryId).border,
                color: getTipCategoryStyle(record.categoryId).text
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

        <!--   操作按钮   -->
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

    <!-- 新增/编辑贴士弹窗 -->
    <a-modal
        v-model:visible="modalVisible"
        :title="isEditing ? '编辑烹饪小贴士' : '新增烹饪小贴士'"
        width="700px"
        :footer="null"
        @cancel="modalVisible = false"
    >
      <a-form
          :model="tipForm"
          :rules="rules"
          ref="tipFormRef"
          layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item label="贴士标题" name="title">
              <a-input v-model:value="tipForm.title" placeholder="请输入贴士标题"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="分类" name="categoryId">
              <a-select v-model:value="tipForm.categoryId" placeholder="请选择分类">
                <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="简介" name="summary">
          <a-textarea v-model:value="tipForm.summary" placeholder="请输入简介" :rows="2"/>
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

        <a-form-item label="内容" name="content">
          <a-textarea v-model:value="tipForm.content" placeholder="请输入贴士内容" :rows="6"/>
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-radio-group v-model:value="tipForm.status">
            <a-radio :value="1">发布</a-radio>
            <a-radio :value="0">草稿</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="标签" name="tags">
          <a-select
              v-model:value="tipForm.tags"
              mode="multiple"
              placeholder="请选择标签"
              style="width: 100%"
              allowClear
          >
            <a-select-option v-for="tag in tags" :key="tag.id" :value="tag.id">
              {{ tag.name }}
            </a-select-option>
          </a-select>
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
  {id: 'tc001', name: '基础厨艺'},
  {id: 'tc002', name: '调味技巧'},
  {id: 'tc003', name: '刀工技巧'},
  {id: 'tc004', name: '火候掌握'},
  {id: 'tc005', name: '食材保存'}
])

// 标签数据
const tags = ref([
  {id: 't006', name: '油炸技巧'},
  {id: 't007', name: '刀工技巧'},
  {id: 't008', name: '食材保鲜'},
  {id: 't009', name: '新手必学'},
  {id: 't010', name: '大厨秘籍'}
])

// 修改分类标签色彩映射 - 使用更饱和的颜色
const tipCategoryStyles = {
  'tc001': { // 基础厨艺
    background: '#E6F7FF',
    border: '#91CAFF',
    text: '#1890FF'
  },
  'tc002': { // 调味技巧
    background: '#F9F0FF',
    border: '#D3ADF7',
    text: '#722ED1'
  },
  'tc003': { // 刀工技巧
    background: '#FFF2E8',
    border: '#FFBB96',
    text: '#FA541C'
  },
  'tc004': { // 火候掌握
    background: '#FFF7E6',
    border: '#FFD591',
    text: '#FA8C16'
  },
  'tc005': { // 食材保存
    background: '#F6FFED',
    border: '#B7EB8F',
    text: '#52C41A'
  }
}

// 获取分类标签样式
const getTipCategoryStyle = (categoryId) => {
  return tipCategoryStyles[categoryId] || {
    background: '#F5F5F5',
    border: '#D9D9D9',
    text: '#999999'
  }
}


// 筛选表单
const filterForm = reactive({
  title: '',
  categoryId: undefined,
  status: undefined
})

// 表格数据
const loading = ref(false)
const tipsList = ref([
  {
    id: 'tip001',
    title: '如何正确切洋葱不流泪',
    summary: '切洋葱时避免流泪的小技巧',
    content: '将洋葱放入冰箱冷藏30分钟再切，或者在切之前将刀浸泡在冷水中，这样可以减少挥发性刺激物质的释放，避免流泪。',
    coverImage: 'https://via.placeholder.com/60',
    categoryId: 'tc003',
    categoryName: '刀工技巧',
    author: '厨艺指导',
    createTime: '2023-05-18 14:30',
    views: 1253,
    status: 1,
    tags: ['t007', 't009']
  },
  {
    id: 'tip002',
    title: '煎鱼不粘锅的秘诀',
    summary: '教你如何完美煎制鱼肉',
    content: '1. 确保鱼完全干燥，可以用厨房纸巾吸干表面水分；\n2. 锅要充分预热，倒入适量油，油热后再放入鱼；\n3. 煎制时不要频繁翻动鱼，等一面完全凝固并形成金黄色后再翻面。',
    coverImage: 'https://via.placeholder.com/60',
    categoryId: 'tc001',
    categoryName: '基础厨艺',
    author: '海鲜专家',
    createTime: '2023-05-17 09:15',
    views: 876,
    status: 1,
    tags: ['t009', 't010']
  },
  {
    id: 'tip003',
    title: '如何正确储存新鲜蔬菜',
    summary: '延长蔬菜保鲜期的存储方法',
    content: '不同类型的蔬菜需要不同的储存方法：\n1. 绿叶蔬菜：用纸巾包裹后放入保鲜袋，存入冰箱蔬菜保鲜层；\n2. 根茎类蔬菜：可放在阴凉干燥处，不需冷藏；\n3. 番茄、黄瓜等：避免与香蕉、苹果等释放乙烯的水果一起存放。',
    coverImage: 'https://via.placeholder.com/60',
    categoryId: 'tc005',
    categoryName: '食材保存',
    author: '食材专家',
    createTime: '2023-05-16 18:40',
    views: 1890,
    status: 1,
    tags: ['t008', 't009']
  },
  {
    id: 'tip004',
    title: '高温炒菜的注意事项',
    summary: '高温快炒的要点和注意事项',
    content: '1. 食材要提前切好并控干水分；\n2. 锅要完全预热，油温达到七成热；\n3. 注意调小火候避免糊锅；\n4. 快速翻炒不停顿，确保均匀受热。',
    coverImage: 'https://via.placeholder.com/60',
    categoryId: 'tc004',
    categoryName: '火候掌握',
    author: '中餐大厨',
    createTime: '2023-05-15 11:20',
    views: 623,
    status: 1,
    tags: ['t010']
  },
  {
    id: 'tip005',
    title: '调味品的正确使用顺序',
    summary: '调味品使用的时间和顺序',
    content: '不同调味品有最佳的添加时机：\n1. 食用盐：肉类提前腌制，蔬菜临出锅前；\n2. 酱油：中期添加，避免高温久炒；\n3. 糖：可提前或中期添加；\n4. 醋：通常在菜品即将出锅时添加；\n5. 香油、芝麻：起锅前撒入提香。',
    coverImage: 'https://via.placeholder.com/60',
    categoryId: 'tc002',
    categoryName: '调味技巧',
    author: '调味专家',
    createTime: '2023-05-14 16:05',
    views: 1420,
    status: 0,
    tags: ['t009', 't010']
  }
])

// 表格列定义
const columns = [
  {
    title: '贴士标题',
    align: 'center',
    key: 'title',
    width: 250
  },
  {
    title: '分类',
    align: 'center',
    dataIndex: 'categoryName',
    key: 'categoryName',
    width: 120
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
    width: 160
  }
]

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 5
})

// 模态框相关
const modalVisible = ref(false)
const isEditing = ref(false)
const tipFormRef = ref()
const tipForm = reactive({
  id: '',
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  categoryId: undefined,
  status: 1,
  tags: []
})

// 表单验证规则
const rules = {
  title: [{required: true, message: '请输入贴士标题', trigger: 'blur'}],
  categoryId: [{required: true, message: '请选择分类', trigger: 'change'}],
  summary: [{required: true, message: '请输入简介', trigger: 'blur'}],
  content: [{required: true, message: '请输入贴士内容', trigger: 'blur'}]
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

// 新增贴士
const handleAdd = () => {
  isEditing.value = false
  // 重置表单
  Object.assign(tipForm, {
    id: '',
    title: '',
    summary: '',
    content: '',
    coverImage: '',
    categoryId: undefined,
    status: 1,
    tags: []
  })
  fileList.value = []
  modalVisible.value = true
}

// 编辑贴士
const handleEdit = (record) => {
  isEditing.value = true
  // 填充表单
  Object.assign(tipForm, {
    id: record.id,
    title: record.title,
    summary: record.summary,
    content: record.content,
    coverImage: record.coverImage,
    categoryId: record.categoryId,
    status: record.status,
    tags: record.tags || []
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

// 查看贴士
const handleView = (record) => {
  router.push(`/tips/${record.id}`)
}

// 删除贴士
const handleDelete = (record) => {
  // 这里应该调用实际的API删除数据
  tipsList.value = tipsList.value.filter(item => item.id !== record.id)
  message.success('删除成功')
}

// 表单提交
const handleSubmit = () => {
  tipFormRef.value.validate().then(() => {
    // 这里应该调用实际的API保存数据
    if (isEditing.value) {
      // 更新现有数据
      const index = tipsList.value.findIndex(item => item.id === tipForm.id)
      if (index !== -1) {
        const categoryObj = categories.value.find(c => c.id === tipForm.categoryId)
        tipsList.value[index] = {
          ...tipsList.value[index],
          title: tipForm.title,
          summary: tipForm.summary,
          content: tipForm.content,
          coverImage: tipForm.coverImage,
          categoryId: tipForm.categoryId,
          categoryName: categoryObj ? categoryObj.name : '',
          status: tipForm.status,
          tags: tipForm.tags
        }
      }
      message.success('贴士更新成功')
    } else {
      // 添加新数据
      const categoryObj = categories.value.find(c => c.id === tipForm.categoryId)
      tipsList.value.unshift({
        id: 'tip' + Date.now(),
        title: tipForm.title,
        summary: tipForm.summary,
        content: tipForm.content,
        coverImage: tipForm.coverImage || 'https://via.placeholder.com/60',
        categoryId: tipForm.categoryId,
        categoryName: categoryObj ? categoryObj.name : '',
        author: '当前用户',
        createTime: new Date().toLocaleString(),
        views: 0,
        status: tipForm.status,
        tags: tipForm.tags
      })
      message.success('贴士添加成功')
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
    tipForm.coverImage = info.file.response.url
    message.success(`${info.file.name} 上传成功`)
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败`)
  }
}

// 初始化数据
onMounted(() => {
  // 这里应该调用实际的API获取数据
})
</script>

<style scoped>
.tips-management {
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

.tip-title-cell {
  display: flex;
  align-items: center;
}

.tip-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
  object-fit: cover;
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

:deep(.category-tag.ant-tag-tc001) {
  border-color: #69B7FF;
  color: #1890FF;
  background-color: #CCE6FF;
}

:deep(.category-tag.ant-tag-tc002) {
  border-color: #B37EFF;
  color: #722ED1;
  background-color: #ECD9FF;
}

:deep(.category-tag.ant-tag-tc003) {
  border-color: #FFA87D;
  color: #FA541C;
  background-color: #FFE0CC;
}

:deep(.category-tag.ant-tag-tc004) {
  border-color: #FFB84D;
  color: #FA8C16;
  background-color: #FFEACC;
}

:deep(.category-tag.ant-tag-tc005) {
  border-color: #87E350;
  color: #52C41A;
  background-color: #DFFFD1;
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

:deep(.ant-btn-link) {
  color: #F0884C;
}

:deep(.ant-btn-link:hover) {
  color: #FF9966;
}

:deep(.ant-select-selection-item-content) {
  color: #F0884C;
}
</style>