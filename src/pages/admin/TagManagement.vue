<template>
  <div class="tag-management">
    <div class="page-header">
      <h2 class="page-title">标签管理</h2>
      <div class="page-actions">
        <a-button type="primary" @click="handleAdd">
          <template #icon>
            <plus-outlined/>
          </template>
          新增标签
        </a-button>
      </div>
    </div>

    <div class="search-filter">
      <a-form layout="inline" :model="filterForm">
        <a-form-item label="标签名称">
          <a-input
              v-model:value="filterForm.name"
              placeholder="请输入标签名称"
              allowClear
          />
        </a-form-item>
        <a-form-item label="标签类型">
          <a-select
              v-model:value="filterForm.type"
              placeholder="请选择标签类型"
              style="width: 160px"
              allowClear
          >
            <a-select-option value="recipe">菜谱标签</a-select-option>
            <a-select-option value="ingredient">食材标签</a-select-option>
            <a-select-option value="tip">烹饪技巧标签</a-select-option>
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
        :dataSource="tagList"
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
        <!-- 标签类型列 -->
        <template v-if="column.key === 'type'">
          <a-tag :color="getTypeColor(record.type)">
            {{ getTypeText(record.type) }}
          </a-tag>
        </template>

        <!-- 标签颜色列 -->
        <template v-if="column.key === 'color'">
          <div style="display: flex; align-items: center;">
            <div
                :style="{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                backgroundColor: record.color,
                marginRight: '8px'
              }"
            ></div>
            <span>{{ record.color }}</span>
          </div>
        </template>

        <!-- 状态列 -->
        <template v-if="column.key === 'status'">
          <div class="status-indicator">
            <span class="status-dot" :class="record.status ? 'status-active' : 'status-disabled'"></span>
            <span class="status-text">{{ record.status ? '正常' : '禁用' }}</span>
          </div>
        </template>

        <!-- 操作列 -->
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

    <!-- 新增/编辑标签弹窗 -->
    <a-modal
        v-model:visible="modalVisible"
        :title="isEditing ? '编辑标签' : '新增标签'"
        :footer="null"
        @cancel="modalVisible = false"
    >
      <a-form
          :model="tagForm"
          :rules="rules"
          ref="tagFormRef"
          layout="vertical"
      >
        <a-form-item label="标签名称" name="name">
          <a-input v-model:value="tagForm.name" placeholder="请输入标签名称"/>
        </a-form-item>

        <a-form-item label="标签类型" name="type">
          <a-select v-model:value="tagForm.type" placeholder="请选择标签类型">
            <a-select-option value="recipe">菜谱标签</a-select-option>
            <a-select-option value="ingredient">食材标签</a-select-option>
            <a-select-option value="tip">烹饪技巧标签</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="tagForm.sort" :min="0" style="width: 100%"/>
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-switch
              v-model:checked="tagForm.status"
              checked-children="启用"
              un-checked-children="禁用"
          />
        </a-form-item>

        <a-form-item label="标签颜色" name="color">
          <a-input v-model:value="tagForm.color" placeholder="请输入标签颜色，例如：#FF5E62">
            <template #prefix>
              <div class="color-preview" :style="{ backgroundColor: tagForm.color || '#d9d9d9' }"></div>
            </template>
          </a-input>
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
import {message} from 'ant-design-vue'
import {
  DeleteOutlined,
  EditOutlined, EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'

// 标签数据
const tagList = ref([
  {
    id: 't001',
    name: '家常味',
    type: 'recipe',
    color: '#F0884C',
    sort: 1,
    status: true,
    createTime: '2023-05-10 10:30:00'
  },
  {
    id: 't002',
    name: '减脂',
    type: 'recipe',
    color: '#36CFC9',
    sort: 2,
    status: true,
    createTime: '2023-05-10 11:00:00'
  },
  {
    id: 't003',
    name: '快手菜',
    type: 'recipe',
    color: '#FF5E62',
    sort: 3,
    status: true,
    createTime: '2023-05-11 09:15:00'
  },
  {
    id: 't004',
    name: '高蛋白',
    type: 'ingredient',
    color: '#73D13D',
    sort: 1,
    status: true,
    createTime: '2023-05-12 14:00:00'
  },
  {
    id: 't005',
    name: '富含维C',
    type: 'ingredient',
    color: '#597EF7',
    sort: 2,
    status: true,
    createTime: '2023-05-13 16:30:00'
  },
  {
    id: 't006',
    name: '油炸技巧',
    type: 'tip',
    color: '#9254DE',
    sort: 1,
    status: true,
    createTime: '2023-05-14 10:00:00'
  },
  {
    id: 't007',
    name: '刀工技巧',
    type: 'tip',
    color: '#FFA940',
    sort: 2,
    status: true,
    createTime: '2023-05-15 11:20:00'
  }
])

// 筛选表单
const filterForm = reactive({
  name: '',
  type: undefined
})

// 表格数据
const loading = ref(false)
const columns = [
  {
    title: '标签名称',
    align: 'center',
    dataIndex: 'name',
    key: 'name',
    width: 180
  },
  {
    title: '标签类型',
    align: 'center',
    key: 'type',
    width: 120
  },
  {
    title: '标签颜色',
    align: 'center',
    dataIndex: 'color',
    key: 'color',
    width: 120
  },
  {
    title: '排序',
    align: 'center',
    dataIndex: 'sort',
    key: 'sort',
    width: 80
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
    width: 160
  }
]

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 7
})

// 模态框相关
const modalVisible = ref(false)
const isEditing = ref(false)
const tagFormRef = ref()
const tagForm = reactive({
  id: '',
  name: '',
  type: 'recipe',
  color: '#F0884C',
  sort: 0,
  status: true
})

// 表单验证规则
const rules = {
  name: [{required: true, message: '请输入标签名称', trigger: 'blur'}],
  type: [{required: true, message: '请选择标签类型', trigger: 'change'}],
  sort: [{required: true, message: '请输入排序值', trigger: 'blur'}]
}

// 获取标签类型文本
const getTypeText = (type) => {
  switch (type) {
    case 'recipe':
      return '菜谱标签'
    case 'ingredient':
      return '食材标签'
    case 'tip':
      return '烹饪技巧标签'
    default:
      return '未知类型'
  }
}

// 获取标签类型颜色
const getTypeColor = (type) => {
  switch (type) {
    case 'recipe':
      return '#F0884C'
    case 'ingredient':
      return '#36CFC9'
    case 'tip':
      return '#73D13D'
    default:
      return '#d9d9d9'
  }
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
  filterForm.type = undefined
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

// 新增标签
const handleAdd = () => {
  isEditing.value = false
  // 重置表单
  Object.assign(tagForm, {
    id: '',
    name: '',
    type: 'recipe',
    color: '#F0884C',
    sort: 0,
    status: true
  })
  modalVisible.value = true
}

// 编辑标签
const handleEdit = (record) => {
  isEditing.value = true
  // 填充表单
  Object.assign(tagForm, {
    id: record.id,
    name: record.name,
    type: record.type,
    color: record.color,
    sort: record.sort,
    status: record.status
  })
  modalVisible.value = true
}

// 删除标签
const handleDelete = (record) => {
  // 这里应该调用实际的API删除数据
  tagList.value = tagList.value.filter(item => item.id !== record.id)
  message.success('删除成功')
}

// 表单提交
const handleSubmit = () => {
  tagFormRef.value.validate().then(() => {
    // 这里应该调用实际的API保存数据
    if (isEditing.value) {
      // 更新现有数据
      const index = tagList.value.findIndex(item => item.id === tagForm.id)
      if (index !== -1) {
        tagList.value[index] = {
          ...tagList.value[index],
          name: tagForm.name,
          type: tagForm.type,
          color: tagForm.color,
          sort: tagForm.sort,
          status: tagForm.status
        }
      }
      message.success('标签更新成功')
    } else {
      // 添加新数据
      tagList.value.unshift({
        id: 't' + Date.now(),
        name: tagForm.name,
        type: tagForm.type,
        color: tagForm.color,
        sort: tagForm.sort,
        status: tagForm.status,
        createTime: new Date().toLocaleString()
      })
      message.success('标签添加成功')
    }
    modalVisible.value = false
  }).catch(error => {
    console.log('验证失败:', error)
  })
}

// 初始化数据
onMounted(() => {
  // 这里应该调用实际的API获取数据
})
</script>

<style scoped>
.tag-management {
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


.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 8px;
}

.operation-btns {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}


/* 搜索区域样式 - 使用白色背景卡片 */
.search-filter {
  margin-bottom: 24px;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(240, 136, 76, 0.08);
  border: 1px solid #f0f0f0;
}

/* 表单组件样式优化 */
:deep(.ant-form-item-label > label) {
  color: #595959;
  font-weight: 500;
}

:deep(.ant-input),
:deep(.ant-select-selector) {
  border-radius: 6px;
  border-color: #e8e8e8;
}

:deep(.ant-input:hover),
:deep(.ant-select-selector:hover) {
  border-color: #F0884C;
}

:deep(.ant-input:focus),
:deep(.ant-select-focused .ant-select-selector) {
  border-color: #F0884C;
  box-shadow: 0 0 0 2px rgba(240, 136, 76, 0.2);
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 8px;
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


/* 状态指示器样式 */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-active {
  background-color: #52C41A;
  box-shadow: 0 0 0 3px rgba(82, 196, 26, 0.1);
}

.status-disabled {
  background-color: #8551BD; /* 紫色，与菜谱管理草稿状态协调 */
  box-shadow: 0 0 0 3px rgba(133, 81, 189, 0.1);
}

.status-text {
  font-size: 14px;
  color: #595959;
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

/* Ant Design 样式覆盖 */
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
</style>