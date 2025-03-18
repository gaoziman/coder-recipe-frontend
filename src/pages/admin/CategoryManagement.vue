<template>
  <div class="category-management">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h2 class="page-title">分类管理</h2>
      <div class="page-actions">
        <a-button type="primary" @click="handleAdd">
          <template #icon><plus-outlined /></template>
          新增分类
        </a-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-filter">
      <a-form layout="inline" :model="filterForm">
        <a-form-item label="分类名称">
          <a-input
              v-model:value="filterForm.name"
              placeholder="请输入分类名称"
              allowClear
          />
        </a-form-item>
        <a-form-item label="分类类型">
          <a-select
              v-model:value="filterForm.type"
              placeholder="请选择分类类型"
              style="width: 160px"
              allowClear
          >
            <a-select-option value="recipe">菜谱分类</a-select-option>
            <a-select-option value="ingredient">食材分类</a-select-option>
            <a-select-option value="tip">烹饪技巧分类</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">
            <template #icon><search-outlined /></template>
            搜索
          </a-button>
          <a-button style="margin-left: 8px" @click="handleReset">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 分类内容区域 -->
    <div class="category-content">
      <a-row :gutter="24">
        <!-- 菜谱分类卡片 -->
        <a-col :span="8">
          <a-card class="category-card recipe-card" :bordered="false">
            <template #title>
              <div class="card-title-container">
                <div class="card-title-left">
                  <app-store-outlined class="card-icon recipe-icon" />
                  <span class="card-title">菜谱分类</span>
                </div>
                <a-tag color="#F0884C">{{ recipeCategories.length }}</a-tag>
              </div>
            </template>
            <a-tree
                :treeData="filteredRecipeTreeData"
                :expandedKeys="expandedKeys"
                :selectedKeys="selectedKeys"
                :replaceFields="{ key: 'id', title: 'name' }"
                @select="onSelect"
                @expand="onExpand"
                blockNode
            >
              <template #title="{ name, id }">
                <div class="tree-node">
                  <span>{{ name }}</span>
                  <div class="tree-node-actions">
                    <edit-outlined class="action-icon" @click.stop="handleEdit('recipe', id)" />
                    <delete-outlined class="action-icon action-delete" @click.stop="showDeleteConfirm('recipe', id)" />
                  </div>
                </div>
              </template>
            </a-tree>
          </a-card>
        </a-col>

        <!-- 食材分类卡片 -->
        <a-col :span="8">
          <a-card class="category-card ingredient-card" :bordered="false">
            <template #title>
              <div class="card-title-container">
                <div class="card-title-left">
                  <database-outlined class="card-icon ingredient-icon" />
                  <span class="card-title">食材分类</span>
                </div>
                <a-tag color="#36CFC9">{{ ingredientCategories.length }}</a-tag>
              </div>
            </template>
            <a-tree
                :treeData="filteredIngredientTreeData"
                :expandedKeys="expandedKeys"
                :selectedKeys="selectedKeys"
                :replaceFields="{ key: 'id', title: 'name' }"
                @select="onSelect"
                @expand="onExpand"
                blockNode
            >
              <template #title="{ name, id }">
                <div class="tree-node">
                  <span>{{ name }}</span>
                  <div class="tree-node-actions">
                    <edit-outlined class="action-icon" @click.stop="handleEdit('ingredient', id)" />
                    <delete-outlined class="action-icon action-delete" @click.stop="showDeleteConfirm('ingredient', id)" />
                  </div>
                </div>
              </template>
            </a-tree>
          </a-card>
        </a-col>

        <!-- 烹饪技巧分类卡片 -->
        <a-col :span="8">
          <a-card class="category-card tip-card" :bordered="false">
            <template #title>
              <div class="card-title-container">
                <div class="card-title-left">
                  <bulb-outlined class="card-icon tip-icon" />
                  <span class="card-title">烹饪技巧分类</span>
                </div>
                <a-tag color="#73D13D">{{ tipCategories.length }}</a-tag>
              </div>
            </template>
            <a-tree
                :treeData="filteredTipTreeData"
                :expandedKeys="expandedKeys"
                :selectedKeys="selectedKeys"
                :replaceFields="{ key: 'id', title: 'name' }"
                @select="onSelect"
                @expand="onExpand"
                blockNode
            >
              <template #title="{ name, id }">
                <div class="tree-node">
                  <span>{{ name }}</span>
                  <div class="tree-node-actions">
                    <edit-outlined class="action-icon" @click.stop="handleEdit('tip', id)" />
                    <delete-outlined class="action-icon action-delete" @click.stop="showDeleteConfirm('tip', id)" />
                  </div>
                </div>
              </template>
            </a-tree>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 新增/编辑分类弹窗 -->
    <a-modal
        v-model:visible="modalVisible"
        :title="isEditing ? '编辑分类' : '新增分类'"
        :footer="null"
        @cancel="modalVisible = false"
        width="500px"
    >
      <a-form
          :model="categoryForm"
          :rules="rules"
          ref="categoryFormRef"
          layout="vertical"
      >
        <a-form-item label="分类名称" name="name">
          <a-input v-model:value="categoryForm.name" placeholder="请输入分类名称" />
        </a-form-item>

        <a-form-item label="分类类型" name="type">
          <a-select v-model:value="categoryForm.type" placeholder="请选择分类类型">
            <a-select-option value="recipe">菜谱分类</a-select-option>
            <a-select-option value="ingredient">食材分类</a-select-option>
            <a-select-option value="tip">烹饪技巧分类</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="上级分类" name="parentId">
          <a-select
              v-model:value="categoryForm.parentId"
              placeholder="请选择上级分类"
              allowClear
          >
            <a-select-option value="0">无上级分类</a-select-option>
            <a-select-option
                v-for="item in getCategoriesByType(categoryForm.type)"
                :key="item.id"
                :value="item.id"
                :disabled="item.id === categoryForm.id"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="categoryForm.sort" :min="0" style="width: 100%" />
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-switch
              v-model:checked="categoryForm.status"
              checked-children="启用"
              un-checked-children="禁用"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  BulbOutlined
} from '@ant-design/icons-vue'

// 筛选表单
const filterForm = reactive({
  name: '',
  type: undefined
})

// 菜谱分类数据
const recipeCategories = ref([
  { id: 'rc001', name: '家常菜', parentId: '0', sort: 1, status: true },
  { id: 'rc002', name: '西餐', parentId: '0', sort: 2, status: true },
  { id: 'rc003', name: '川菜', parentId: '0', sort: 3, status: true },
  { id: 'rc004', name: '粤菜', parentId: '0', sort: 4, status: true },
  { id: 'rc005', name: '早餐', parentId: '0', sort: 5, status: true },
  { id: 'rc006', name: '午餐', parentId: '0', sort: 6, status: true },
  { id: 'rc007', name: '晚餐', parentId: '0', sort: 7, status: true },
  { id: 'rc008', name: '意大利菜', parentId: 'rc002', sort: 1, status: true },
  { id: 'rc009', name: '法国菜', parentId: 'rc002', sort: 2, status: true }
])

// 食材分类数据
const ingredientCategories = ref([
  { id: 'ic001', name: '肉类', parentId: '0', sort: 1, status: true },
  { id: 'ic002', name: '蔬菜', parentId: '0', sort: 2, status: true },
  { id: 'ic003', name: '水果', parentId: '0', sort: 3, status: true },
  { id: 'ic004', name: '海鲜', parentId: '0', sort: 4, status: true },
  { id: 'ic005', name: '豆制品', parentId: '0', sort: 5, status: true },
  { id: 'ic006', name: '猪肉', parentId: 'ic001', sort: 1, status: true },
  { id: 'ic007', name: '牛肉', parentId: 'ic001', sort: 2, status: true },
  { id: 'ic008', name: '羊肉', parentId: 'ic001', sort: 3, status: true }
])

// 烹饪技巧分类数据
const tipCategories = ref([
  { id: 'tc001', name: '基础厨艺', parentId: '0', sort: 1, status: true },
  { id: 'tc002', name: '调味技巧', parentId: '0', sort: 2, status: true },
  { id: 'tc003', name: '刀工技巧', parentId: '0', sort: 3, status: true },
  { id: 'tc004', name: '火候掌握', parentId: '0', sort: 4, status: true },
  { id: 'tc005', name: '食材保存', parentId: '0', sort: 5, status: true }
])

// 过滤函数
const filterCategories = (categories, keyword) => {
  if (!keyword) return categories
  return categories.filter(item => item.name.includes(keyword))
}

// 将分类数据转换为树形结构
const recipeTreeData = computed(() => {
  return convertToTree(recipeCategories.value)
})

const ingredientTreeData = computed(() => {
  return convertToTree(ingredientCategories.value)
})

const tipTreeData = computed(() => {
  return convertToTree(tipCategories.value)
})

// 过滤后的树形数据
const filteredRecipeTreeData = computed(() => {
  if (filterForm.type && filterForm.type !== 'recipe') return []
  return convertToTree(filterCategories(recipeCategories.value, filterForm.name))
})

const filteredIngredientTreeData = computed(() => {
  if (filterForm.type && filterForm.type !== 'ingredient') return []
  return convertToTree(filterCategories(ingredientCategories.value, filterForm.name))
})

const filteredTipTreeData = computed(() => {
  if (filterForm.type && filterForm.type !== 'tip') return []
  return convertToTree(filterCategories(tipCategories.value, filterForm.name))
})

// 转换函数
function convertToTree(list) {
  const map = {}
  const roots = []

  // 先创建映射
  list.forEach(item => {
    map[item.id] = { ...item, children: [] }
  })

  // 构建树
  list.forEach(item => {
    if (item.parentId === '0') {
      roots.push(map[item.id])
    } else if (map[item.parentId]) {
      map[item.parentId].children.push(map[item.id])
    }
  })

  return roots
}

// 树展开和选中状态
const expandedKeys = ref([])
const selectedKeys = ref([])

// 模态框相关
const modalVisible = ref(false)
const isEditing = ref(false)
const categoryFormRef = ref()
const categoryForm = reactive({
  id: '',
  name: '',
  type: 'recipe',
  parentId: '0',
  sort: 0,
  status: true
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择分类类型', trigger: 'change' }],
  sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }]
}

// 根据类型获取分类列表
const getCategoriesByType = (type) => {
  switch (type) {
    case 'recipe':
      return recipeCategories.value
    case 'ingredient':
      return ingredientCategories.value
    case 'tip':
      return tipCategories.value
    default:
      return []
  }
}

// 搜索处理
const handleSearch = () => {
  // 这里执行搜索逻辑，通过计算属性自动过滤
  message.success('搜索成功')
}

// 重置筛选
const handleReset = () => {
  filterForm.name = ''
  filterForm.type = undefined
  message.success('已重置搜索条件')
}

// 树节点选择事件
const onSelect = (selectedKeys, info) => {
  selectedKeys.value = selectedKeys
}

// 树节点展开事件
const onExpand = (expandedKeys) => {
  expandedKeys.value = expandedKeys
}

// 新增分类
const handleAdd = () => {
  isEditing.value = false
  // 重置表单
  Object.assign(categoryForm, {
    id: '',
    name: '',
    type: 'recipe',
    parentId: '0',
    sort: 0,
    status: true
  })
  modalVisible.value = true
}

// 编辑分类
const handleEdit = (type, id) => {
  isEditing.value = true
  let category = null

  switch (type) {
    case 'recipe':
      category = recipeCategories.value.find(item => item.id === id)
      break
    case 'ingredient':
      category = ingredientCategories.value.find(item => item.id === id)
      break
    case 'tip':
      category = tipCategories.value.find(item => item.id === id)
      break
  }

  if (category) {
    Object.assign(categoryForm, {
      id: category.id,
      name: category.name,
      type: type,
      parentId: category.parentId,
      sort: category.sort,
      status: category.status
    })
    modalVisible.value = true
  }
}

// 删除确认
const showDeleteConfirm = (type, id) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除此分类吗？删除后将无法恢复，且会影响关联的数据。',
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      handleDelete(type, id)
    }
  })
}

// 删除分类
const handleDelete = (type, id) => {
  switch (type) {
    case 'recipe':
      recipeCategories.value = recipeCategories.value.filter(item => item.id !== id)
      break
    case 'ingredient':
      ingredientCategories.value = ingredientCategories.value.filter(item => item.id !== id)
      break
    case 'tip':
      tipCategories.value = tipCategories.value.filter(item => item.id !== id)
      break
  }
  message.success('删除成功')
}

// 表单提交
const handleSubmit = () => {
  categoryFormRef.value.validate().then(() => {
    if (isEditing.value) {
      // 更新现有分类
      switch (categoryForm.type) {
        case 'recipe':
          const recipeIndex = recipeCategories.value.findIndex(item => item.id === categoryForm.id)
          if (recipeIndex !== -1) {
            recipeCategories.value[recipeIndex] = {
              ...recipeCategories.value[recipeIndex],
              name: categoryForm.name,
              parentId: categoryForm.parentId,
              sort: categoryForm.sort,
              status: categoryForm.status
            }
          }
          break
        case 'ingredient':
          const ingredientIndex = ingredientCategories.value.findIndex(item => item.id === categoryForm.id)
          if (ingredientIndex !== -1) {
            ingredientCategories.value[ingredientIndex] = {
              ...ingredientCategories.value[ingredientIndex],
              name: categoryForm.name,
              parentId: categoryForm.parentId,
              sort: categoryForm.sort,
              status: categoryForm.status
            }
          }
          break
        case 'tip':
          const tipIndex = tipCategories.value.findIndex(item => item.id === categoryForm.id)
          if (tipIndex !== -1) {
            tipCategories.value[tipIndex] = {
              ...tipCategories.value[tipIndex],
              name: categoryForm.name,
              parentId: categoryForm.parentId,
              sort: categoryForm.sort,
              status: categoryForm.status
            }
          }
          break
      }
      message.success('分类更新成功')
    } else {
      // 添加新分类
      const newCategory = {
        id: categoryForm.type.charAt(0) + 'c' + Date.now(),
        name: categoryForm.name,
        parentId: categoryForm.parentId,
        sort: categoryForm.sort,
        status: categoryForm.status
      }

      switch (categoryForm.type) {
        case 'recipe':
          recipeCategories.value.push(newCategory)
          break
        case 'ingredient':
          ingredientCategories.value.push(newCategory)
          break
        case 'tip':
          tipCategories.value.push(newCategory)
          break
      }
      message.success('分类添加成功')
    }
    modalVisible.value = false
  }).catch(error => {
    console.log('验证失败:', error)
  })
}

// 初始化数据
onMounted(() => {
  // 展开所有节点
  const expandKeys = [
    ...recipeCategories.value.filter(item => item.parentId === '0').map(item => item.id),
    ...ingredientCategories.value.filter(item => item.parentId === '0').map(item => item.id),
    ...tipCategories.value.filter(item => item.parentId === '0').map(item => item.id)
  ]
  expandedKeys.value = expandKeys
})
</script>

<style scoped>
.category-management {
  width: 100%;
}

/* 页面标题样式 */
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

/* 搜索区域样式 */
.search-filter {
  margin-bottom: 24px;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(240, 136, 76, 0.08);
  border: 1px solid #f0f0f0;
}

/* 卡片样式 */
.category-content {
  margin-top: 24px;
}

.category-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
  overflow: hidden;
  transition: all 0.3s;
}

.category-card:hover {
  box-shadow: 0 4px 16px rgba(240, 136, 76, 0.15);
  transform: translateY(-2px);
}

.card-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
}

.card-icon {
  font-size: 18px;
}

.recipe-icon {
  color: #F0884C;
}

.ingredient-icon {
  color: #36CFC9;
}

.tip-icon {
  color: #73D13D;
}

/* 树节点样式 */
.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
  border-radius: 4px;
  transition: all 0.2s;
}

.tree-node:hover {
  background-color: rgba(240, 136, 76, 0.05);
}

.tree-node-actions {
  display: none;
  align-items: center;
}

.tree-node:hover .tree-node-actions {
  display: flex;
}

.action-icon {
  font-size: 14px;
  color: #999;
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-icon:hover {
  color: #F0884C;
}

.action-delete:hover {
  color: #ff4d4f;
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

/* 卡片特殊样式 */
.recipe-card :deep(.ant-card-head) {
  background-color: rgba(240, 136, 76, 0.05);
  border-bottom: 1px solid rgba(240, 136, 76, 0.1);
}

.ingredient-card :deep(.ant-card-head) {
  background-color: rgba(54, 207, 201, 0.05);
  border-bottom: 1px solid rgba(54, 207, 201, 0.1);
}

.tip-card :deep(.ant-card-head) {
  background-color: rgba(115, 209, 61, 0.05);
  border-bottom: 1px solid rgba(115, 209, 61, 0.1);
}

.recipe-card :deep(.ant-tree-node-selected) {
  background-color: rgba(240, 136, 76, 0.1) !important;
}

.ingredient-card :deep(.ant-tree-node-selected) {
  background-color: rgba(54, 207, 201, 0.1) !important;
}

.tip-card :deep(.ant-tree-node-selected) {
  background-color: rgba(115, 209, 61, 0.1) !important;
}

/* 表单样式 */
.form-footer {
  text-align: right;
  margin-bottom: 0;
  margin-top: 8px;
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

:deep(.ant-switch-checked) {
  background-color: #F0884C;
}

:deep(.ant-tree-treenode) {
  padding: 0 !important;
  margin: 4px 0;
}

:deep(.ant-tree-node-content-wrapper) {
  flex: 1;
}

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
</style>