<!-- ContentReview.vue -->
<template>
  <div class="content-review">
    <div class="page-header">
      <h2 class="page-title">内容审核</h2>
      <div class="page-actions">
        <a-select
            v-model:value="reviewStatus"
            style="width: 120px; margin-right: 12px"
            @change="handleStatusChange"
        >
          <a-select-option value="pending">待审核</a-select-option>
          <a-select-option value="approved">已通过</a-select-option>
          <a-select-option value="rejected">已拒绝</a-select-option>
        </a-select>
        <a-button type="primary" @click="processBatchAction" :disabled="!selectedRows.length">
          批量操作
          <template #icon><down-outlined /></template>
        </a-button>
      </div>
    </div>

    <div class="page-filter">
      <a-form layout="inline" :model="filterForm">
        <a-form-item label="内容类型">
          <a-select
              v-model:value="filterForm.contentType"
              placeholder="选择内容类型"
              style="width: 140px"
              allowClear
          >
            <a-select-option value="recipe">菜谱</a-select-option>
            <a-select-option value="comment">评论</a-select-option>
            <a-select-option value="tip">烹饪技巧</a-select-option>
            <a-select-option value="question">问答</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="提交时间">
          <a-range-picker
              v-model:value="filterForm.dateRange"
              format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item label="关键词">
          <a-input
              v-model:value="filterForm.keyword"
              placeholder="内容关键词"
              allowClear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">
            <template #icon><search-outlined /></template>
            搜索
          </a-button>
          <a-button style="margin-left: 8px" @click="resetFilterForm">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <a-table
        :dataSource="contentList"
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
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        rowKey="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'content'">
          <div class="content-cell">
            <div class="content-type-tag" :class="`type-${record.contentType}`">
              {{ getContentTypeText(record.contentType) }}
            </div>
            <div class="content-text">{{ record.content }}</div>
          </div>
        </template>

        <template v-if="column.key === 'submitter'">
          <div class="submitter-cell">
            <a-avatar :src="record.avatar" size="small">
              {{ record.submitter.charAt(0).toUpperCase() }}
            </a-avatar>
            <span>{{ record.submitter }}</span>
          </div>
        </template>

        <template v-if="column.key === 'status'">
          <a-tag :class="`status-${record.status}`">
            {{ getStatusText(record.status) }}
          </a-tag>
        </template>

        <template v-if="column.key === 'operation'">
          <div class="operation-btns">
            <a-button type="link" size="small"  class="operation-btn-view" @click="handleView(record)">
              <template #icon><eye-outlined /></template>
              查看
            </a-button>
            <a-button v-if="record.status === 'pending'" type="link" size="small" class="approve-btn" @click="handleApprove(record)">
              <template #icon><check-outlined /></template>
              通过
            </a-button>
            <a-button v-if="record.status === 'pending'" type="link" size="small" class="reject-btn" @click="handleReject(record)">
              <template #icon><close-outlined /></template>
              拒绝
            </a-button>
            <a-button v-if="record.status !== 'pending'" type="link" size="small"  class="operation-btn-view"  @click="handleReset(record)">
              <template #icon><undo-outlined /></template>
              重置
            </a-button>
            <a-button type="link" danger size="small" @click="handleDelete(record)">
              <template #icon><delete-outlined /></template>
              删除
            </a-button>
          </div>
        </template>
      </template>
    </a-table>

    <!-- 内容详情抽屉 -->
    <a-drawer
        title="内容详情"
        :visible="drawerVisible"
        :width="600"
        @close="drawerVisible = false"
    >
      <div v-if="currentItem" class="content-detail">
        <div class="detail-header">
          <div class="detail-type">
            <div class="content-type-tag" :class="`type-${currentItem.contentType}`">
              {{ getContentTypeText(currentItem.contentType) }}
            </div>
            <div class="detail-status">
              <a-tag :class="`status-${currentItem.status}`">
                {{ getStatusText(currentItem.status) }}
              </a-tag>
            </div>
          </div>
          <div class="submitter-info">
            <a-avatar :src="currentItem.avatar" size="small">
              {{ currentItem.submitter.charAt(0).toUpperCase() }}
            </a-avatar>
            <span>{{ currentItem.submitter }}</span>
            <span class="submit-time">
              {{ currentItem.submitTime }}
            </span>
          </div>
        </div>

        <div class="detail-content">
          <h3 v-if="currentItem.title">{{ currentItem.title }}</h3>
          <div class="content-body">
            {{ currentItem.content }}
          </div>
          <div v-if="currentItem.images && currentItem.images.length > 0" class="content-images">
            <a-image
                v-for="img in currentItem.images"
                :key="img"
                :src="img"
                :width="160"
                class="content-image"
            />
          </div>
        </div>

        <div class="related-info" v-if="currentItem.relatedContent">
          <h4>相关内容</h4>
          <div class="related-content">
            {{ currentItem.relatedContent }}
          </div>
        </div>

        <div class="review-actions" v-if="currentItem.status === 'pending'">
          <a-textarea
              v-model:value="reviewComment"
              placeholder="审核意见（可选）"
              :rows="3"
              style="margin-bottom: 16px"
          />
          <div class="action-buttons">
            <a-button class="reject-button" @click="confirmReject(currentItem)">
              <template #icon><close-outlined /></template>
              拒绝
            </a-button>
            <a-button type="primary" class="approve-button" @click="confirmApprove(currentItem)">
              <template #icon><check-outlined /></template>
              通过
            </a-button>
          </div>
        </div>
      </div>
    </a-drawer>

    <!-- 批量操作确认对话框 -->
    <a-modal
        title="批量操作"
        :visible="batchModalVisible"
        @ok="confirmBatchAction"
        @cancel="batchModalVisible = false"
    >
      <p>请选择要对{{ selectedRows.length }}条内容执行的操作：</p>
      <a-radio-group v-model:value="batchAction">
        <a-radio value="approve">批量通过</a-radio>
        <a-radio value="reject">批量拒绝</a-radio>
        <a-radio value="delete">批量删除</a-radio>
      </a-radio-group>
      <div v-if="batchAction === 'reject'" style="margin-top: 16px">
        <a-textarea
            v-model:value="batchRejectReason"
            placeholder="拒绝原因（可选）"
            :rows="3"
        />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  UndoOutlined,
  DeleteOutlined,
  SearchOutlined,
  DownOutlined
} from '@ant-design/icons-vue';

// 审核状态
const reviewStatus = ref('pending');

// 筛选表单
const filterForm = reactive({
  contentType: undefined,
  dateRange: [],
  keyword: ''
});

// 表格数据
const loading = ref(false);
const contentList = ref([
  {
    id: 'c001',
    contentType: 'recipe',
    title: '香煎三文鱼配蔬菜沙拉',
    content: '这是我的拿手好菜，希望大家喜欢。材料：三文鱼、蔬菜、橄榄油等...',
    submitter: '张厨师',
    avatar: 'https://via.placeholder.com/40',
    submitTime: '2023-03-15 14:30',
    status: 'pending',
    images: ['https://via.placeholder.com/300']
  },
  {
    id: 'c002',
    contentType: 'comment',
    content: '这个菜谱真的非常好，我做出来非常成功！给大家推荐一下！',
    submitter: '美食爱好者',
    avatar: 'https://via.placeholder.com/40',
    submitTime: '2023-03-16 09:15',
    status: 'pending',
    relatedContent: '菜谱：香煎三文鱼配蔬菜沙拉'
  },
  {
    id: 'c003',
    contentType: 'tip',
    title: '如何正确切洋葱不流泪',
    content: '将洋葱放入冰箱冷藏30分钟再切，或者在切之前将刀浸泡在冷水中，这样可以减少挥发性刺激物质的释放，避免流泪。',
    submitter: '厨艺指导',
    avatar: 'https://via.placeholder.com/40',
    submitTime: '2023-03-16 18:40',
    status: 'approved',
    images: ['https://via.placeholder.com/300']
  },
  {
    id: 'c004',
    contentType: 'question',
    content: '煎牛排时怎样才能保持肉质的多汁？总是做得太干',
    submitter: '新手厨师',
    avatar: 'https://via.placeholder.com/40',
    submitTime: '2023-03-17 11:20',
    status: 'pending'
  },
  {
    id: 'c005',
    contentType: 'comment',
    content: '这个食谱太复杂了，而且原料也很难买到，建议简化一下。',
    submitter: '家常菜爱好者',
    avatar: 'https://via.placeholder.com/40',
    submitTime: '2023-03-17 16:05',
    status: 'rejected',
    relatedContent: '菜谱：法式红酒烩牛肉'
  }
]);

// 表格列定义
const columns = [
  {
    title: '内容',
    key: 'content',
    width: '35%'
  },
  {
    title: '提交人',
    key: 'submitter',
    width: '15%'
  },
  {
    title: '提交时间',
    dataIndex: 'submitTime',
    key: 'submitTime',
    width: '15%',
    sorter: (a, b) => new Date(a.submitTime) - new Date(b.submitTime)
  },
  {
    title: '状态',
    key: 'status',
    width: '10%'
  },
  {
    title: '操作',
    key: 'operation',
    width: '25%'
  }
];

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 5
});

// 选择行相关
const selectedRowKeys = ref([]);
const selectedRows = ref([]);

// 抽屉相关
const drawerVisible = ref(false);
const currentItem = ref(null);
const reviewComment = ref('');

// 批量操作相关
const batchModalVisible = ref(false);
const batchAction = ref('approve');
const batchRejectReason = ref('');

// 获取内容类型文本
const getContentTypeText = (type) => {
  const typeMap = {
    recipe: '菜谱',
    comment: '评论',
    tip: '烹饪技巧',
    question: '问答'
  };
  return typeMap[type] || '未知类型';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  };
  return statusMap[status] || '未知状态';
};

// 处理状态变化
const handleStatusChange = (value) => {
  // 根据状态筛选数据
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    message.success(`已切换至${getStatusText(value)}内容`);
  }, 500);
};

// 处理查看
const handleView = (record) => {
  currentItem.value = record;
  drawerVisible.value = true;
  reviewComment.value = '';
};

// 处理通过
const handleApprove = (record) => {
  // 调用API通过内容
  message.success(`已通过该${getContentTypeText(record.contentType)}`);
  record.status = 'approved';
};

// 确认通过
const confirmApprove = (record) => {
  record.status = 'approved';
  message.success(`已通过该${getContentTypeText(record.contentType)}`);
  drawerVisible.value = false;
};

// 处理拒绝
const handleReject = (record) => {
  // 调用API拒绝内容
  message.success(`已拒绝该${getContentTypeText(record.contentType)}`);
  record.status = 'rejected';
};

// 确认拒绝
const confirmReject = (record) => {
  record.status = 'rejected';
  message.success(`已拒绝该${getContentTypeText(record.contentType)}`);
  drawerVisible.value = false;
};

// 处理重置
const handleReset = (record) => {
  // 调用API重置内容状态
  record.status = 'pending';
  message.success(`已重置该${getContentTypeText(record.contentType)}的审核状态`);
};

// 处理删除
const handleDelete = (record) => {
  // 调用API删除内容
  contentList.value = contentList.value.filter(item => item.id !== record.id);
  message.success(`已删除该${getContentTypeText(record.contentType)}`);
};

// 搜索处理
const handleSearch = () => {
  loading.value = true;
  pagination.current = 1;

  // 模拟请求延迟
  setTimeout(() => {
    loading.value = false;
    // 这里应该调用实际的API获取数据
    message.success('搜索成功');
  }, 500);
};

// 重置筛选
const resetFilterForm = () => {
  filterForm.contentType = undefined;
  filterForm.dateRange = [];
  filterForm.keyword = '';
  handleSearch();
};

// 页码变化
const handlePageChange = (page, pageSize) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
  // 获取对应页的数据
};

// 每页条数变化
const handleSizeChange = (current, size) => {
  pagination.pageSize = size;
  // 获取对应数量的数据
};

// 选择行变化
const onSelectChange = (selectedKeys, selectedItems) => {
  selectedRowKeys.value = selectedKeys;
  selectedRows.value = selectedItems;
};

// 处理批量操作
const processBatchAction = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择要操作的内容');
    return;
  }
  batchModalVisible.value = true;
};

// 确认批量操作
const confirmBatchAction = () => {
  if (batchAction.value === 'approve') {
    selectedRows.value.forEach(item => {
      item.status = 'approved';
    });
    message.success(`已批量通过${selectedRows.value.length}条内容`);
  } else if (batchAction.value === 'reject') {
    selectedRows.value.forEach(item => {
      item.status = 'rejected';
    });
    message.success(`已批量拒绝${selectedRows.value.length}条内容`);
  } else if (batchAction.value === 'delete') {
    const ids = selectedRows.value.map(item => item.id);
    contentList.value = contentList.value.filter(item => !ids.includes(item.id));
    message.success(`已批量删除${selectedRows.value.length}条内容`);
  }

  selectedRowKeys.value = [];
  selectedRows.value = [];
  batchModalVisible.value = false;
};
</script>

<style scoped>
.content-review {
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
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(240, 136, 76, 0.08);
  border: 1px solid #f0f0f0;
}

.content-cell {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.content-type-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
  color: white;
  font-weight: 500;
  min-width: 48px;
  flex-shrink: 0;
}

.type-recipe {
  background-color: #F0884C;
}

.type-comment {
  background-color: #5B8FF9;
}

.type-tip {
  background-color: #73D13D;
}

.type-question {
  background-color: #9254DE;
}

.content-text {
  flex: 1;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.submitter-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-pending {
  color: #FAAD14;
  background-color: #FFFBE6;
  border-color: #FFE58F;
}

.status-approved {
  color: #52C41A;
  background-color: #F6FFED;
  border-color: #B7EB8F;
}

.status-rejected {
  color: #FF4D4F;
  background-color: #FFF1F0;
  border-color: #FFCCC7;
}

.operation-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.operation-btn-view) {
  color: #F0884C !important;
}

.approve-btn {
  color: #52C41A !important;
}

.reject-btn {
  color: #FF4D4F !important;
}

/* 抽屉内容详情样式 */
.content-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
}

.detail-type {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submitter-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-time {
  color: #999;
  font-size: 13px;
  margin-left: 8px;
}

.detail-content {
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 12px;
  color: #333;
}

.content-body {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
}

.content-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.content-image {
  border-radius: 8px;
  object-fit: cover;
}

.related-info {
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.related-info h4 {
  font-size: 16px;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 8px;
  color: #333;
}

.related-content {
  font-size: 14px;
  color: #666;
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
}

.review-actions {
  display: flex;
  flex-direction: column;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.reject-button {
  color: #FF4D4F;
  border-color: #FF4D4F;
}

.approve-button {
  background-color: #F0884C;
  border-color: #F0884C;
}

.approve-button:hover {
  background-color: #FF9966;
  border-color: #FF9966;
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

:deep(.ant-drawer-title) {
  font-weight: 600;
  color: #333;
}
</style>