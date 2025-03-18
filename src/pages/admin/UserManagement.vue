<!-- src/pages/admin/UserManagement.vue -->
<template>
  <div class="user-management">
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
      <div class="page-actions">
        <a-button type="primary" @click="exportUsers">
          <template #icon>
            <export-outlined/>
          </template>
          导出用户
        </a-button>
      </div>
    </div>

    <div class="page-filter">
      <a-form layout="inline" :model="filterForm">
        <a-form-item label="用户名/昵称">
          <a-input
              v-model:value="filterForm.keyword"
              placeholder="请输入用户名或昵称"
              allowClear
          />
        </a-form-item>
        <a-form-item label="注册时间">
          <a-range-picker
              v-model:value="filterForm.dateRange"
              format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
              v-model:value="filterForm.status"
              placeholder="请选择状态"
              style="width: 120px"
              allowClear
          >
            <a-select-option value="1">正常</a-select-option>
            <a-select-option value="0">禁用</a-select-option>
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
        :dataSource="userList"
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
        showTotal: total => `共 ${total} 条用户`
      }"
        rowKey="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'username'">
          <div class="user-info-cell">
            <a-avatar :src="record.avatar" :size="40">
              {{ record.username.charAt(0).toUpperCase() }}
            </a-avatar>
            <div class="user-info">
              <div class="username">{{ record.username }}</div>
              <div class="email">{{ record.email }}</div>
            </div>
          </div>
        </template>

        <template v-if="column.key === 'statistics'">
          <div class="user-statistics">
            <div class="stat-item">
              <span class="stat-label">菜谱：</span>
              <span class="stat-value">{{ record.recipeCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">收藏：</span>
              <span class="stat-value">{{ record.favoriteCount }}</span>
            </div>
          </div>
        </template>

        <!-- 角色标签 -->
        <template v-if="column.key === 'role'">
          <a-tag :class="record.isAdmin ? 'role-tag role-admin' : 'role-tag role-user'">
            {{ record.isAdmin ? '管理员' : '普通用户' }}
          </a-tag>
        </template>

        <!-- 状态标签 -->
        <template v-if="column.key === 'status'">
          <div class="status-indicator">
            <span class="status-dot" :class="record.status ? 'status-active' : 'status-disabled'"></span>
            <span class="status-text">{{ record.status ? '正常' : '禁用' }}</span>
          </div>
        </template>

        <!-- 操作按钮 -->
        <template v-if="column.key === 'operation'">
          <div class="operation-btns">
            <a-button class="op-btn op-btn-edit" type="link" size="small" @click="handleEdit(record)">编辑</a-button>
            <a-button
                v-if="record.status"
                class="op-btn op-btn-disable"
                type="link"
                size="small"
                @click="handleDisable(record)"
            >禁用</a-button>
            <a-button
                v-else
                class="op-btn op-btn-enable"
                type="link"
                size="small"
                @click="handleEnable(record)"
            >启用</a-button>
            <a-dropdown class="more-dropdown">
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="resetPassword(record)">重置密码</a-menu-item>
                  <a-menu-item v-if="!record.isAdmin" key="2" @click="setAdmin(record)">设为管理员</a-menu-item>
                  <a-menu-item v-else key="3" @click="removeAdmin(record)">取消管理员</a-menu-item>
                </a-menu>
              </template>
              <a-button class="op-btn op-btn-more" type="link" size="small">
                更多 <down-outlined />
              </a-button>
            </a-dropdown>
          </div>
        </template>
      </template>
    </a-table>

    <!-- 编辑用户弹窗 -->
    <a-modal
        v-model:visible="modalVisible"
        title="编辑用户信息"
        :footer="null"
        @cancel="modalVisible = false"
    >
      <a-form
          :model="userForm"
          :rules="rules"
          ref="userFormRef"
          layout="vertical"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="userForm.username" placeholder="请输入用户名"/>
        </a-form-item>

        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="userForm.nickname" placeholder="请输入昵称"/>
        </a-form-item>

        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="userForm.email" placeholder="请输入邮箱"/>
        </a-form-item>

        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="userForm.phone" placeholder="请输入手机号"/>
        </a-form-item>

        <a-form-item label="角色" name="isAdmin">
          <a-select v-model:value="userForm.isAdmin" placeholder="请选择角色">
            <a-select-option :value="false">普通用户</a-select-option>
            <a-select-option :value="true">管理员</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-switch
              v-model:checked="userForm.status"
              checked-children="正常"
              un-checked-children="禁用"
          />
        </a-form-item>

        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="userForm.remark" placeholder="请输入备注" :rows="2"/>
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
  SearchOutlined,
  ExportOutlined,
  DownOutlined
} from '@ant-design/icons-vue'

// 筛选表单
const filterForm = reactive({
  keyword: '',
  dateRange: [],
  status: undefined
})

// 表格数据
const loading = ref(false)
const userList = ref([
  {
    id: 'u001',
    username: 'zhang_san',
    nickname: '张三',
    avatar: 'https://via.placeholder.com/40',
    email: 'zhangsan@example.com',
    phone: '13812345678',
    recipeCount: 12,
    favoriteCount: 24,
    isAdmin: true,
    status: true,
    registerTime: '2023-01-15 10:30:00',
    lastLoginTime: '2023-05-18 09:45:22',
    remark: '系统管理员'
  },
  {
    id: 'u002',
    username: 'li_si',
    nickname: '李四',
    avatar: 'https://via.placeholder.com/40',
    email: 'lisi@example.com',
    phone: '13912345678',
    recipeCount: 5,
    favoriteCount: 18,
    isAdmin: false,
    status: true,
    registerTime: '2023-02-10 14:20:00',
    lastLoginTime: '2023-05-17 16:30:15',
    remark: ''
  },
  {
    id: 'u003',
    username: 'wang_wu',
    nickname: '王五',
    avatar: 'https://via.placeholder.com/40',
    email: 'wangwu@example.com',
    phone: '13712345678',
    recipeCount: 0,
    favoriteCount: 7,
    isAdmin: false,
    status: true,
    registerTime: '2023-03-05 09:15:00',
    lastLoginTime: '2023-05-10 11:20:40',
    remark: ''
  },
  {
    id: 'u004',
    username: 'zhao_liu',
    nickname: '赵六',
    avatar: 'https://via.placeholder.com/40',
    email: 'zhaoliu@example.com',
    phone: '13612345678',
    recipeCount: 8,
    favoriteCount: 15,
    isAdmin: false,
    status: false,
    registerTime: '2023-03-18 16:40:00',
    lastLoginTime: '2023-04-25 10:05:33',
    remark: '用户多次发布不良内容，暂时禁用'
  },
  {
    id: 'u005',
    username: 'zhao_qi',
    nickname: '赵七',
    avatar: 'https://via.placeholder.com/40',
    email: 'zhaoqi@example.com',
    phone: '13512345678',
    recipeCount: 3,
    favoriteCount: 9,
    isAdmin: false,
    status: true,
    registerTime: '2023-04-02 11:25:00',
    lastLoginTime: '2023-05-16 19:15:10',
    remark: ''
  }
])

// 表格列定义
const columns = [
  {
    title: '用户信息',
    align: 'center',
    key: 'username',
    width: 250
  },
  {
    title: '统计数据',
    align: 'center',
    key: 'statistics',
    width: 150
  },
  {
    title: '角色',
    align: 'center',
    key: 'role',
    width: 100
  },
  {
    title: '状态',
    align: 'center',
    key: 'status',
    width: 100
  },
  {
    title: '注册时间',
    align: 'center',
    dataIndex: 'registerTime',
    key: 'registerTime',
    width: 160
  },
  {
    title: '最后登录',
    align: 'center',
    dataIndex: 'lastLoginTime',
    key: 'lastLoginTime',
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
const userFormRef = ref()
const userForm = reactive({
  id: '',
  username: '',
  nickname: '',
  email: '',
  phone: '',
  isAdmin: false,
  status: true,
  remark: ''
})

// 表单验证规则
const rules = {
  username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
  email: [
    {required: true, message: '请输入邮箱', trigger: 'blur'},
    {type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur'}
  ]
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
  filterForm.keyword = ''
  filterForm.dateRange = []
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

// 编辑用户
const handleEdit = (record) => {
  // 填充表单
  Object.assign(userForm, {
    id: record.id,
    username: record.username,
    nickname: record.nickname,
    email: record.email,
    phone: record.phone,
    isAdmin: record.isAdmin,
    status: record.status,
    remark: record.remark
  })
  modalVisible.value = true
}

// 禁用用户
const handleDisable = (record) => {
  // 这里应该调用实际的API
  const index = userList.value.findIndex(item => item.id === record.id)
  if (index !== -1) {
    userList.value[index].status = false
    message.success(`已禁用用户 ${record.username}`)
  }
}

// 启用用户
const handleEnable = (record) => {
  // 这里应该调用实际的API
  const index = userList.value.findIndex(item => item.id === record.id)
  if (index !== -1) {
    userList.value[index].status = true
    message.success(`已启用用户 ${record.username}`)
  }
}

// 重置密码
const resetPassword = (record) => {
  // 这里应该调用实际的API
  message.success(`已重置 ${record.username} 的密码，新密码已发送至用户邮箱`)
}

// 设为管理员
const setAdmin = (record) => {
  // 这里应该调用实际的API
  const index = userList.value.findIndex(item => item.id === record.id)
  if (index !== -1) {
    userList.value[index].isAdmin = true
    message.success(`已将 ${record.username} 设为管理员`)
  }
}

// 取消管理员
const removeAdmin = (record) => {
  // 这里应该调用实际的API
  const index = userList.value.findIndex(item => item.id === record.id)
  if (index !== -1) {
    userList.value[index].isAdmin = false
    message.success(`已取消 ${record.username} 的管理员权限`)
  }
}

// 导出用户
const exportUsers = () => {
  // 这里应该调用实际的API
  message.success('用户数据导出成功')
}

// 表单提交
const handleSubmit = () => {
  userFormRef.value.validate().then(() => {
    // 这里应该调用实际的API保存数据
    const index = userList.value.findIndex(item => item.id === userForm.id)
    if (index !== -1) {
      userList.value[index] = {
        ...userList.value[index],
        username: userForm.username,
        nickname: userForm.nickname,
        email: userForm.email,
        phone: userForm.phone,
        isAdmin: userForm.isAdmin,
        status: userForm.status,
        remark: userForm.remark
      }
    }
    message.success('用户信息更新成功')
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
.user-management {
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

.user-info-cell {
  display: flex;
  align-items: center;
}

.user-info {
  margin-left: 12px;
}

.username {
  font-weight: 500;
  color: #333;
}

.email {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.user-statistics {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item {
  font-size: 13px;
}

.stat-label {
  color: #999;
}

.stat-value {
  font-weight: 500;
  color: #333;
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

/* 角色标签样式 */
.role-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.2;
  text-align: center;
  min-width: 80px;
  transition: all 0.3s;
  font-weight: 500;
}

.role-admin {
  color: #FFF;
  background-color: #F0884C;
  border: none;
}

.role-user {
  color: #FFF;
  background-color: #4288a8;
  border: none;
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

/* 操作按钮样式 */
.operation-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

.op-btn {
  position: relative;
  padding: 2px 12px;
  font-size: 13px;
  border-radius: 4px;
  transition: all 0.25s ease;
}

.op-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: currentColor;
  opacity: 0.2;
}

.op-btn:hover::after {
  opacity: 0.5;
}

.op-btn-edit {
  color: #F0884C !important;
}

.op-btn-disable {
  color: #FF5E62 !important;
}

.op-btn-enable {
  color: rgb(125, 129, 133) !important;
}

.op-btn-more {
  color: #8C8C8C !important;
}

/* 更多按钮下拉菜单 */
.more-dropdown :deep(.ant-dropdown-menu-item) {
  color: #595959;
  transition: all 0.3s;
}

.more-dropdown :deep(.ant-dropdown-menu-item:hover) {
  color: #F0884C;
  background-color: rgba(240, 136, 76, 0.05);
}

/* 导出用户按钮样式 */
.page-actions .ant-btn-primary {
  background-color: #F0884C;
  border-color: #F0884C;
  box-shadow: 0 2px 0 rgba(240, 136, 76, 0.1);
  transition: all 0.3s;
}

.page-actions .ant-btn-primary:hover {
  background-color: #FF9966;
  border-color: #FF9966;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(240, 136, 76, 0.2);
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