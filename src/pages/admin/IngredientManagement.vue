<!-- src/pages/admin/IngredientManagement.vue -->
<template>
  <div class="ingredient-management">
    <div class="page-header">
      <h2 class="page-title">食材管理</h2>
      <div class="page-actions">
        <a-button type="primary" @click="handleAdd">
          <template #icon>
            <plus-outlined/>
          </template>
          新增食材
        </a-button>
      </div>
    </div>

    <div class="page-filter">
      <a-form layout="inline" :model="filterForm">
        <a-form-item label="食材名称">
          <a-input
              v-model:value="filterForm.name"
              placeholder="请输入食材名称"
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
        <a-form-item label="季节">
          <a-select
              v-model:value="filterForm.season"
              placeholder="请选择季节"
              style="width: 120px"
              allowClear
          >
            <a-select-option value="spring">春季</a-select-option>
            <a-select-option value="summer">夏季</a-select-option>
            <a-select-option value="autumn">秋季</a-select-option>
            <a-select-option value="winter">冬季</a-select-option>
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
        :dataSource="ingredientList"
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
        <template v-if="column.key === 'name'">
          <div class="ingredient-name-cell">
            <img :src="record.image" class="ingredient-image"/>
            <span>{{ record.name }}</span>
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

        <!--  适应季节   -->
        <template v-if="column.key === 'seasons'">
          <div class="season-tags">
            <a-tooltip title="春季">
              <a-tag v-if="record.seasons.includes('spring')" color="#73D13D" class="season-tag">春</a-tag>
              <a-tag v-else color="#F5F5F5" class="season-tag-inactive">春</a-tag>
            </a-tooltip>
            <a-tooltip title="夏季">
              <a-tag v-if="record.seasons.includes('summer')" color="#FF9966" class="season-tag">夏</a-tag>
              <a-tag v-else color="#F5F5F5" class="season-tag-inactive">夏</a-tag>
            </a-tooltip>
            <a-tooltip title="秋季">
              <a-tag v-if="record.seasons.includes('autumn')" color="#F0884C" class="season-tag">秋</a-tag>
              <a-tag v-else color="#F5F5F5" class="season-tag-inactive">秋</a-tag>
            </a-tooltip>
            <a-tooltip title="冬季">
              <a-tag v-if="record.seasons.includes('winter')" color="#597EF7" class="season-tag">冬</a-tag>
              <a-tag v-else color="#F5F5F5" class="season-tag-inactive">冬</a-tag>
            </a-tooltip>
          </div>
        </template>

        <!--  状态   -->
        <template v-if="column.key === 'status'">
          <a-badge :status="record.status ? 'success' : 'default'" :text="record.status ? '正常' : '下架'"/>
        </template>

        <!--  操作按钮   -->
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

    <!-- 新增/编辑食材弹窗 -->
    <a-modal
        v-model:visible="modalVisible"
        :title="isEditing ? '编辑食材' : '新增食材'"
        width="700px"
        :footer="null"
        @cancel="modalVisible = false"
    >
      <a-form
          :model="ingredientForm"
          :rules="rules"
          ref="ingredientFormRef"
          layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item label="食材名称" name="name">
              <a-input v-model:value="ingredientForm.name" placeholder="请输入食材名称"/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="分类" name="categoryId">
              <a-select v-model:value="ingredientForm.categoryId" placeholder="请选择分类">
                <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="食材图片" name="image">
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

        <a-form-item label="简介" name="description">
          <a-textarea v-model:value="ingredientForm.description" placeholder="请输入食材简介" :rows="3"/>
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="营养成分" name="nutrition">
              <a-textarea v-model:value="ingredientForm.nutrition" placeholder="请输入营养成分" :rows="4"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="存储方法" name="storage">
              <a-textarea v-model:value="ingredientForm.storage" placeholder="请输入存储方法" :rows="4"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="适宜季节" name="seasons">
          <a-checkbox-group v-model:value="ingredientForm.seasons">
            <a-checkbox value="spring">春季</a-checkbox>
            <a-checkbox value="summer">夏季</a-checkbox>
            <a-checkbox value="autumn">秋季</a-checkbox>
            <a-checkbox value="winter">冬季</a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-switch
              v-model:checked="ingredientForm.status"
              checked-children="正常"
              un-checked-children="下架"
          />
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
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'

const router = useRouter()

// 分类数据
const categories = ref([
  {id: 'ic001', name: '肉类'},
  {id: 'ic002', name: '蔬菜'},
  {id: 'ic003', name: '水果'},
  {id: 'ic004', name: '海鲜'},
  {id: 'ic005', name: '豆制品'},
  {id: 'ic006', name: '猪肉'},
  {id: 'ic007', name: '牛肉'},
  {id: 'ic008', name: '羊肉'}
])


// 修改分类样式配置，更加精细化
const categoryStyles = {
  'ic001': { // 肉类
    background: '#FFF1F0',
    border: '#FFCCC7',
    text: '#FF4D4F'
  },
  'ic002': { // 蔬菜
    background: '#F6FFED',
    border: '#B7EB8F',
    text: '#52C41A'
  },
  'ic003': { // 水果
    background: '#FFFBE6',
    border: '#FFE58F',
    text: '#FAAD14'
  },
  'ic004': { // 海鲜
    background: '#E6FFFB',
    border: '#87E8DE',
    text: '#13C2C2'
  },
  'ic005': { // 豆制品
    background: '#FFF0F6',
    border: '#FFADD2',
    text: '#EB2F96'
  },
  'ic006': { // 猪肉
    background: '#FFE0EC',
    border: '#FFAAC9',
    text: '#EB2F96'
  },
  'ic007': { // 牛肉
    background: '#F9F0FF',
    border: '#D3ADF7',
    text: '#722ED1'
  },
  'ic008': { // 羊肉
    background: '#E6F7FF',
    border: '#91D5FF',
    text: '#1890FF'
  }
}

// 获取分类标签样式的方法
const getCategoryStyle = (categoryId) => {
  return categoryStyles[categoryId] || {
    background: '#F5F5F5',
    border: '#D9D9D9',
    text: '#999999'
  }
}

// 筛选表单
const filterForm = reactive({
  name: '',
  categoryId: undefined,
  season: undefined
})

// 表格数据
const loading = ref(false)
const ingredientList = ref([
  {
    id: 'ing001',
    name: '猪里脊肉',
    image: 'https://via.placeholder.com/60',
    categoryId: 'ic006',
    categoryName: '猪肉',
    description: '猪里脊肉是猪的脊椎骨两侧的肉，肉质鲜嫩，几乎没有筋膜。',
    nutrition: '蛋白质：21g/100g\n脂肪：8g/100g\n热量：143kcal/100g',
    storage: '冷藏保存2-3天，冷冻可保存1-2个月。',
    seasons: ['spring', 'autumn', 'winter'],
    status: true,
    createTime: '2023-05-18 14:30'
  },
  {
    id: 'ing002',
    name: '西兰花',
    image: 'https://via.placeholder.com/60',
    categoryId: 'ic002',
    categoryName: '蔬菜',
    description: '西兰花富含维生素C和纤维素，是非常健康的绿色蔬菜。',
    nutrition: '维生素C：80mg/100g\n纤维素：3g/100g\n热量：35kcal/100g',
    storage: '冷藏保存3-5天，可以用保鲜袋包裹保存。',
    seasons: ['spring', 'autumn', 'winter'],
    status: true,
    createTime: '2023-05-17 09:15'
  },
  {
    id: 'ing003',
    name: '三文鱼',
    image: 'https://via.placeholder.com/60',
    categoryId: 'ic004',
    categoryName: '海鲜',
    description: '三文鱼肉质鲜嫩，富含omega-3脂肪酸，是高蛋白低脂肪的健康食材。',
    nutrition: '蛋白质：20g/100g\nOmega-3：2g/100g\n热量：208kcal/100g',
    storage: '冷藏保存1-2天，冷冻可保存1-2个月。',
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    status: true,
    createTime: '2023-05-16 18:40'
  },
  {
    id: 'ing004',
    name: '草莓',
    image: 'https://via.placeholder.com/60',
    categoryId: 'ic003',
    categoryName: '水果',
    description: '草莓香甜可口，富含维生素C和抗氧化物质，是春季的代表性水果。',
    nutrition: '维生素C：60mg/100g\n糖分：5g/100g\n热量：33kcal/100g',
    storage: '冷藏保存2-3天，不宜冷冻，食用前再清洗。',
    seasons: ['spring'],
    status: true,
    createTime: '2023-05-15 11:20'
  },
  {
    id: 'ing005',
    name: '豆腐',
    image: 'https://via.placeholder.com/60',
    categoryId: 'ic005',
    categoryName: '豆制品',
    description: '豆腐是大豆制成的传统食品，富含植物蛋白，低热量高营养。',
    nutrition: '蛋白质：8g/100g\n钙：350mg/100g\n热量：76kcal/100g',
    storage: '冷藏保存3-5天，需要浸泡在水中并每天换水。',
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    status: true,
    createTime: '2023-05-14 16:05'
  }
])

// 表格列定义
const columns = [
  {
    title: '食材名称',
    align: 'center',
    key: 'name',
    width: 160
  },
  {
    title: '分类',
    align: 'center',
    dataIndex: 'categoryName',
    key: 'categoryName',
    width: 100
  },
  {
    title: '简介',
    align: 'center',
    dataIndex: 'description',
    key: 'description',
    width: 300,
    ellipsis: true
  },
  {
    title: '适宜季节',
    align: 'center',
    key: 'seasons',
    width: 140
  },
  {
    title: '状态',
    align: 'center',
    key: 'status',
    width: 100
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 160
  },
  {
    title: '操作',
    align: 'center',
    key: 'operation',
    width: 200
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
const ingredientFormRef = ref()
const ingredientForm = reactive({
  id: '',
  name: '',
  image: '',
  categoryId: undefined,
  description: '',
  nutrition: '',
  storage: '',
  seasons: [],
  status: true
})

// 表单验证规则
const rules = {
  name: [{required: true, message: '请输入食材名称', trigger: 'blur'}],
  categoryId: [{required: true, message: '请选择分类', trigger: 'change'}],
  description: [{required: true, message: '请输入食材简介', trigger: 'blur'}]
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
  filterForm.name = ''
  filterForm.categoryId = undefined
  filterForm.season = undefined
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

// 新增食材
const handleAdd = () => {
  isEditing.value = false
  // 重置表单
  Object.assign(ingredientForm, {
    id: '',
    name: '',
    image: '',
    categoryId: undefined,
    description: '',
    nutrition: '',
    storage: '',
    seasons: [],
    status: true
  })
  fileList.value = []
  modalVisible.value = true
}

// 编辑食材
const handleEdit = (record) => {
  isEditing.value = true
  // 填充表单
  Object.assign(ingredientForm, {
    id: record.id,
    name: record.name,
    image: record.image,
    categoryId: record.categoryId,
    description: record.description,
    nutrition: record.nutrition,
    storage: record.storage,
    seasons: record.seasons,
    status: record.status
  })
  // 设置文件列表
  fileList.value = record.image ? [
    {
      uid: '-1',
      name: 'image.jpg',
      status: 'done',
      url: record.image
    }
  ] : []
  modalVisible.value = true
}

// 查看食材
const handleView = (record) => {
  router.push(`/ingredient/${record.id}`)
}

// 删除食材
const handleDelete = (record) => {
  // 这里应该调用实际的API删除数据
  ingredientList.value = ingredientList.value.filter(item => item.id !== record.id)
  message.success('删除成功')
}

// 表单提交
const handleSubmit = () => {
  ingredientFormRef.value.validate().then(() => {
    // 这里应该调用实际的API保存数据
    if (isEditing.value) {
      // 更新现有数据
      const index = ingredientList.value.findIndex(item => item.id === ingredientForm.id)
      if (index !== -1) {
        const categoryObj = categories.value.find(c => c.id === ingredientForm.categoryId)
        ingredientList.value[index] = {
          ...ingredientList.value[index],
          name: ingredientForm.name,
          image: ingredientForm.image,
          categoryId: ingredientForm.categoryId,
          categoryName: categoryObj ? categoryObj.name : '',
          description: ingredientForm.description,
          nutrition: ingredientForm.nutrition,
          storage: ingredientForm.storage,
          seasons: ingredientForm.seasons,
          status: ingredientForm.status
        }
      }
      message.success('食材更新成功')
    } else {
      // 添加新数据
      const categoryObj = categories.value.find(c => c.id === ingredientForm.categoryId)
      ingredientList.value.unshift({
        id: 'ing' + Date.now(),
        name: ingredientForm.name,
        image: ingredientForm.image || 'https://via.placeholder.com/60',
        categoryId: ingredientForm.categoryId,
        categoryName: categoryObj ? categoryObj.name : '',
        description: ingredientForm.description,
        nutrition: ingredientForm.nutrition,
        storage: ingredientForm.storage,
        seasons: ingredientForm.seasons,
        status: ingredientForm.status,
        createTime: new Date().toLocaleString()
      })
      message.success('食材添加成功')
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
    ingredientForm.image = info.file.response.url
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
.ingredient-management {
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
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
}

.ingredient-name-cell {
  display: flex;
  align-items: center;
}

.ingredient-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
  object-fit: cover;
}

.season-tags {
  display: flex;
  gap: 4px;
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

.season-tags {
  display: flex;
  gap: 6px;
}

.season-tag {
  min-width: 28px;
  text-align: center;
  border-radius: 12px;
  margin-right: 0;
}

.season-tag-inactive {
  min-width: 28px;
  text-align: center;
  border-radius: 12px;
  margin-right: 0;
  opacity: 0.4;
  color: #999;
}

/* 操作按钮组样式优化 */
.operation-btns {
  display: flex;
  align-items: center;
  gap: 3px;
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

:deep(.ant-switch-checked) {
  background-color: #F0884C;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #F0884C;
  border-color: #F0884C;
}

:deep(.ant-checkbox-wrapper:hover .ant-checkbox-inner),
:deep(.ant-checkbox:hover .ant-checkbox-inner) {
  border-color: #F0884C;
}
</style>