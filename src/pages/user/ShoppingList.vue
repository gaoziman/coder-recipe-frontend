<!-- ShoppingList.vue -->
<template>
  <div class="shopping-list-page">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2 class="page-title">购物清单</h2>
      <div class="action-buttons">
        <a-button class="share-btn" @click="showShareModal">
          <share-alt-outlined />
          分享清单
        </a-button>
        <a-button type="primary" class="add-btn" @click="showAddModal">
          <plus-outlined />
          添加食材
        </a-button>
      </div>
    </div>

    <!-- 购物清单主体 -->
    <div class="shopping-content">
      <!-- 左侧：购物清单 -->
      <div class="shopping-list-container">
        <!-- 工具栏 -->
        <div class="tools-section">
          <div class="left-tools">
            <a-select
                v-model:value="currentList"
                style="width: 160px"
                class="list-selector"
            >
              <a-select-option value="all">全部清单</a-select-option>
              <a-select-option value="weekend">周末购物</a-select-option>
              <a-select-option value="birthday">生日聚会</a-select-option>
              <a-select-option value="daily">日常采购</a-select-option>
            </a-select>
            <a-button class="tool-btn" title="创建新清单">
              <plus-outlined />
            </a-button>
          </div>

          <div class="right-tools">
            <a-input-search
                placeholder="搜索食材..."
                v-model:value="searchText"
                style="width: 200px"
                class="search-input"
                @search="onSearch"
            />
            <div class="tool-buttons">
              <a-tooltip title="排序">
                <a-button class="tool-btn">
                  <sort-ascending-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="筛选">
                <a-button class="tool-btn">
                  <filter-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="清空已完成">
                <a-button class="tool-btn danger-btn">
                  <delete-outlined />
                </a-button>
              </a-tooltip>
            </div>
          </div>
        </div>

        <!-- 进度指示器 -->
        <div class="progress-section">
          <div class="progress-header">
            <h3>全部食材 ({{ stats.completed }}/{{ stats.total }})</h3>
            <span>{{ stats.completedPercentage }}% 已完成</span>
          </div>
          <a-progress
              :percent="stats.completedPercentage"
              :stroke-color="'#66CC99'"
              :show-info="false"
          />
        </div>

        <!-- 蔬果类 -->
        <div class="category-section" v-if="vegetables.length > 0">
          <div class="category-header">
            <h3>
              <plant-outlined class="category-icon vegetable-icon" />
              蔬果类 ({{ vegetablesStats.completed }}/{{ vegetables.length }})
            </h3>
          </div>

          <div class="items-list">
            <div
                v-for="item in vegetables"
                :key="item.id"
                :class="['shopping-item', {'item-completed': item.completed}]"
            >
              <div class="item-main">
                <a-checkbox
                    :checked="item.completed"
                    @change="toggleItemStatus(item)"
                ></a-checkbox>
                <div class="item-details">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <div class="item-meta">
                    <span class="meta-item">
                      <balance-outlined /> {{ item.quantity }}{{ item.unit }}
                    </span>
                    <span class="meta-item" :class="item.completed ? 'status-completed' : 'status-pending'">
                      <check-circle-outlined v-if="item.completed" />
                      <clock-circle-outlined v-else />
                      {{ item.completed ? '已购买' : '待购买' }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="item-actions">
                <span class="item-price">￥{{ item.price.toFixed(1) }}</span>
                <div class="action-buttons">
                  <a-tooltip title="编辑">
                    <a-button shape="circle" class="action-btn" @click="editItem(item)">
                      <edit-outlined />
                    </a-button>
                  </a-tooltip>
                  <a-tooltip title="删除">
                    <a-button shape="circle" class="action-btn danger-btn" @click="deleteItem(item.id)">
                      <delete-outlined />
                    </a-button>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 肉禽蛋奶 -->
        <div class="category-section" v-if="meats.length > 0">
          <div class="category-header">
            <h3>
              <fire-outlined class="category-icon meat-icon" />
              肉禽蛋奶 ({{ meatsStats.completed }}/{{ meats.length }})
            </h3>
          </div>

          <div class="items-list">
            <div
                v-for="item in meats"
                :key="item.id"
                :class="['shopping-item', {'item-completed': item.completed}]"
            >
              <div class="item-main">
                <a-checkbox
                    :checked="item.completed"
                    @change="toggleItemStatus(item)"
                ></a-checkbox>
                <div class="item-details">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <div class="item-meta">
                    <span class="meta-item">
                      <balance-outlined /> {{ item.quantity }}{{ item.unit }}
                    </span>
                    <span class="meta-item" :class="item.completed ? 'status-completed' : 'status-pending'">
                      <check-circle-outlined v-if="item.completed" />
                      <clock-circle-outlined v-else />
                      {{ item.completed ? '已购买' : '待购买' }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="item-actions">
                <span class="item-price">￥{{ item.price.toFixed(1) }}</span>
                <div class="action-buttons">
                  <a-tooltip title="编辑">
                    <a-button shape="circle" class="action-btn" @click="editItem(item)">
                      <edit-outlined />
                    </a-button>
                  </a-tooltip>
                  <a-tooltip title="删除">
                    <a-button shape="circle" class="action-btn danger-btn" @click="deleteItem(item.id)">
                      <delete-outlined />
                    </a-button>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 调味品 -->
        <div class="category-section" v-if="seasonings.length > 0">
          <div class="category-header">
            <h3>
              <experiment-outlined class="category-icon seasoning-icon" />
              调味品 ({{ seasoningsStats.completed }}/{{ seasonings.length }})
            </h3>
          </div>

          <div class="items-list">
            <div
                v-for="item in seasonings"
                :key="item.id"
                :class="['shopping-item', {'item-completed': item.completed}]"
            >
              <div class="item-main">
                <a-checkbox
                    :checked="item.completed"
                    @change="toggleItemStatus(item)"
                ></a-checkbox>
                <div class="item-details">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <div class="item-meta">
                    <span class="meta-item">
                      <balance-outlined /> {{ item.quantity }}{{ item.unit }}
                    </span>
                    <span class="meta-item" :class="item.completed ? 'status-completed' : 'status-pending'">
                      <check-circle-outlined v-if="item.completed" />
                      <clock-circle-outlined v-else />
                      {{ item.completed ? '已购买' : '待购买' }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="item-actions">
                <span class="item-price">￥{{ item.price.toFixed(1) }}</span>
                <div class="action-buttons">
                  <a-tooltip title="编辑">
                    <a-button shape="circle" class="action-btn" @click="editItem(item)">
                      <edit-outlined />
                    </a-button>
                  </a-tooltip>
                  <a-tooltip title="删除">
                    <a-button shape="circle" class="action-btn danger-btn" @click="deleteItem(item.id)">
                      <delete-outlined />
                    </a-button>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：统计和推荐 -->
      <div class="sidebar">
        <!-- 购物统计 -->
        <div class="stats-card">
          <h3 class="card-title">
            <pie-chart-outlined class="card-icon" /> 购物统计
          </h3>

          <div class="stats-list">
            <div class="stats-item">
              <span class="stats-label">总计项目</span>
              <span class="stats-value">{{ stats.total }} 项</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">已购项目</span>
              <span class="stats-value">{{ stats.completed }} 项</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">预估金额</span>
              <span class="stats-value">￥{{ stats.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">实际支出</span>
              <span class="stats-value">￥{{ stats.spentAmount.toFixed(2) }}</span>
            </div>
          </div>

          <div class="stats-chart">
            <div v-if="!chartLoaded" class="chart-placeholder">
              支出图表加载中...
            </div>
            <!-- 图表组件将在实际项目中实现 -->
          </div>
        </div>

        <!-- 按菜谱添加 -->
        <div class="recipe-card">
          <h3 class="card-title">
            <read-outlined class="card-icon" /> 按菜谱添加
          </h3>

          <a-input-search
              placeholder="搜索菜谱..."
              class="recipe-search"
              @search="searchRecipe"
          />

          <div class="recipe-list">
            <div
                v-for="recipe in recommendedRecipes"
                :key="recipe.id"
                class="recipe-item"
            >
              <div class="recipe-content">
                <a-avatar
                    :src="recipe.image"
                    shape="square"
                    :size="64"
                    class="recipe-image"
                />
                <div class="recipe-info">
                  <h4 class="recipe-name">{{ recipe.name }}</h4>
                  <p class="recipe-meta">{{ recipe.ingredientCount }}种食材</p>
                  <a-button
                      type="link"
                      class="add-ingredients-btn"
                      @click="addRecipeIngredients(recipe.id)"
                  >
                    添加全部食材
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 常买清单 -->
        <div class="frequent-card">
          <h3 class="card-title">
            <sync-outlined class="card-icon" /> 常买清单
          </h3>

          <div class="frequent-list">
            <div
                v-for="category in frequentCategories"
                :key="category.id"
                class="frequent-item"
            >
              <div class="frequent-content">
                <span class="frequent-icon" :class="category.iconClass">
                  <component :is="category.icon" />
                </span>
                <span class="frequent-name">{{ category.name }}</span>
              </div>
              <a-button
                  type="link"
                  class="add-btn"
                  @click="addFrequentCategory(category.id)"
              >
                添加
              </a-button>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons-container">
          <a-button type="primary" block class="print-btn" @click="printList">
            <printer-outlined /> 打印购物清单
          </a-button>
          <a-button block class="export-btn" @click="exportList">
            <download-outlined /> 导出购物清单
          </a-button>
        </div>
      </div>
    </div>

    <!-- 添加食材弹窗 -->
    <a-modal
        v-model:visible="addModalVisible"
        :title="isEditing ? '编辑购物项' : '添加购物项'"
        @cancel="cancelAddModal"
        :footer="null"
        width="500px"
        class="shopping-modal"
    >
      <a-form
          :model="itemForm"
          layout="vertical"
      >
        <a-form-item label="食材名称" name="name" required>
          <a-input v-model:value="itemForm.name" placeholder="例如：西红柿" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="数量" name="quantity" required>
              <a-input-number v-model:value="itemForm.quantity" :min="1" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="单位" name="unit" required>
              <a-select v-model:value="itemForm.unit">
                <a-select-option value="克">克</a-select-option>
                <a-select-option value="千克">千克</a-select-option>
                <a-select-option value="毫升">毫升</a-select-option>
                <a-select-option value="升">升</a-select-option>
                <a-select-option value="个">个</a-select-option>
                <a-select-option value="根">根</a-select-option>
                <a-select-option value="盒">盒</a-select-option>
                <a-select-option value="瓶">瓶</a-select-option>
                <a-select-option value="其他">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="分类" name="category" required>
              <a-select v-model:value="itemForm.category">
                <a-select-option value="vegetable">蔬果类</a-select-option>
                <a-select-option value="meat">肉禽蛋奶</a-select-option>
                <a-select-option value="grain">主食面点</a-select-option>
                <a-select-option value="seasoning">调味品</a-select-option>
                <a-select-option value="snack">零食饮料</a-select-option>
                <a-select-option value="other">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="预估价格" name="price">
              <a-input-number
                  v-model:value="itemForm.price"
                  :min="0"
                  :step="0.1"
                  :precision="2"
                  style="width: 100%"
                  prefix="￥"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="添加到清单" name="listId">
          <a-select v-model:value="itemForm.listId">
            <a-select-option value="all">全部清单</a-select-option>
            <a-select-option value="weekend">周末购物</a-select-option>
            <a-select-option value="birthday">生日聚会</a-select-option>
            <a-select-option value="daily">日常采购</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="备注" name="notes">
          <a-textarea
              v-model:value="itemForm.notes"
              :rows="2"
              placeholder="添加备注..."
          />
        </a-form-item>

        <div class="form-actions">
          <a-button @click="cancelAddModal">取消</a-button>
          <a-button type="primary" @click="saveItem">
            {{ isEditing ? '保存修改' : '添加' }}
          </a-button>
        </div>
      </a-form>
    </a-modal>

    <!-- 分享清单弹窗 -->
    <a-modal
        v-model:visible="shareModalVisible"
        title="分享购物清单"
        @cancel="cancelShareModal"
        :footer="null"
        width="500px"
        class="share-modal"
    >
      <div class="share-content">
        <div class="share-section">
          <p class="section-label">选择要分享的清单：</p>
          <a-select v-model:value="shareForm.listId" style="width: 100%">
            <a-select-option value="all">全部清单</a-select-option>
            <a-select-option value="weekend">周末购物</a-select-option>
            <a-select-option value="birthday">生日聚会</a-select-option>
            <a-select-option value="daily">日常采购</a-select-option>
          </a-select>
        </div>

        <div class="share-section">
          <p class="section-label">分享方式：</p>
          <div class="share-methods">
            <div
                v-for="method in shareMethods"
                :key="method.id"
                class="share-method-item"
                @click="selectShareMethod(method.id)"
            >
              <div class="share-method-icon" :class="method.className">
                <component :is="method.icon" />
              </div>
              <span class="share-method-name">{{ method.name }}</span>
            </div>
          </div>
        </div>

        <div class="share-section">
          <p class="section-label">链接分享：</p>
          <div class="share-link-input">
            <a-input
                v-model:value="shareForm.link"
                readonly
                class="link-input"
                ref="linkInput"
            />
            <a-button type="primary" @click="copyShareLink">
              复制
            </a-button>
          </div>
          <p class="share-link-expires">
            <clock-circle-outlined /> 链接有效期：7天
          </p>
        </div>

        <div class="collaboration-section">
          <div class="collaboration-content">
            <team-outlined class="collaboration-icon" />
            <div class="collaboration-text">
              <p class="collaboration-title">协作模式</p>
              <p class="collaboration-desc">邀请好友一起编辑购物清单</p>
            </div>
          </div>
          <a-button class="invite-btn">
            邀请
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import type { ShoppingItem, Recipe, FrequentCategory, ShareMethod } from '@/types/shopping';
import {
  PlusOutlined,
  ShareAltOutlined,
  SortAscendingOutlined,
  FilterOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  PieChartOutlined,
  ReadOutlined,
  SyncOutlined,
  PrinterOutlined,
  DownloadOutlined,
  FireOutlined,
  ExperimentOutlined,
  TeamOutlined
} from '@ant-design/icons-vue';

// 搜索文本
const searchText = ref('');

// 当前选中的清单
const currentList = ref('all');

// 图表加载状态
const chartLoaded = ref(false);

// 弹窗显示状态
const addModalVisible = ref(false);
const shareModalVisible = ref(false);

// 编辑状态
const isEditing = ref(false);
const editingId = ref<number | null>(null);

// 购物项表单数据
const itemForm = reactive({
  name: '',
  quantity: 1,
  unit: '克',
  category: 'vegetable',
  price: 0,
  listId: 'all',
  notes: ''
});

// 分享表单数据
const shareForm = reactive({
  listId: 'all',
  method: 'wechat',
  link: 'https://weijianhao.cn/list/a8f2e4'
});

// 购物项数据
const shoppingItems = ref<ShoppingItem[]>([
  // 蔬果类
  {
    id: 1,
    name: '西红柿',
    quantity: 500,
    unit: '克',
    category: 'vegetable',
    price: 8.5,
    completed: true,
    listId: 'all'
  },
  {
    id: 2,
    name: '黄瓜',
    quantity: 2,
    unit: '根',
    category: 'vegetable',
    price: 4.0,
    completed: false,
    listId: 'all'
  },
  {
    id: 3,
    name: '青椒',
    quantity: 300,
    unit: '克',
    category: 'vegetable',
    price: 6.5,
    completed: false,
    listId: 'all'
  },
  {
    id: 4,
    name: '胡萝卜',
    quantity: 2,
    unit: '根',
    category: 'vegetable',
    price: 3.5,
    completed: true,
    listId: 'all'
  },
  // 肉禽蛋奶
  {
    id: 5,
    name: '鸡胸肉',
    quantity: 500,
    unit: '克',
    category: 'meat',
    price: 28.0,
    completed: true,
    listId: 'all'
  },
  {
    id: 6,
    name: '猪里脊',
    quantity: 400,
    unit: '克',
    category: 'meat',
    price: 32.0,
    completed: false,
    listId: 'all'
  },
  {
    id: 7,
    name: '鸡蛋',
    quantity: 1,
    unit: '盒',
    category: 'meat',
    price: 15.8,
    completed: true,
    listId: 'all'
  },
  // 调味品
  {
    id: 8,
    name: '生抽',
    quantity: 1,
    unit: '瓶',
    category: 'seasoning',
    price: 16.8,
    completed: true,
    listId: 'all'
  },
  {
    id: 9,
    name: '蚝油',
    quantity: 1,
    unit: '瓶',
    category: 'seasoning',
    price: 22.5,
    completed: false,
    listId: 'all'
  }
]);

// 推荐菜谱
const recommendedRecipes = ref<Recipe[]>([
  {
    id: 1,
    name: '糖醋排骨',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    ingredientCount: 8
  },
  {
    id: 2,
    name: '香煎三文鱼',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
    ingredientCount: 6
  }
]);

// 常买清单分类
const frequentCategories = ref<FrequentCategory[]>([
  {
    id: 1,
    name: '蔬菜水果',
    icon: FireOutlined,
    iconClass: 'vegetable-icon'
  },
  {
    id: 2,
    name: '肉禽蛋奶',
    icon: FireOutlined,
    iconClass: 'meat-icon'
  },
  {
    id: 3,
    name: '主食面点',
    icon: 'cake-outlined',
    iconClass: 'grain-icon'
  }
]);

// 分享方式
const shareMethods = ref<ShareMethod[]>([
  {
    id: 'wechat',
    name: '微信',
    icon: 'wechat-outlined',
    className: 'wechat-icon'
  },
  {
    id: 'weibo',
    name: '微博',
    icon: 'weibo-outlined',
    className: 'weibo-icon'
  },
  {
    id: 'email',
    name: '邮件',
    icon: 'mail-outlined',
    className: 'email-icon'
  },
  {
    id: 'more',
    name: '更多',
    icon: 'more-outlined',
    className: 'more-icon'
  }
]);

// 按分类过滤的购物项
const vegetables = computed(() => {
  return shoppingItems.value.filter(item => item.category === 'vegetable');
});

const meats = computed(() => {
  return shoppingItems.value.filter(item => item.category === 'meat');
});

const seasonings = computed(() => {
  return shoppingItems.value.filter(item => item.category === 'seasoning');
});

// 统计数据
const stats = computed(() => {
  const total = shoppingItems.value.length;
  const completed = shoppingItems.value.filter(item => item.completed).length;
  const completedPercentage = Math.round((completed / total) * 100);

  const totalPrice = shoppingItems.value.reduce((sum, item) => sum + item.price, 0);
  const spentAmount = shoppingItems.value
      .filter(item => item.completed)
      .reduce((sum, item) => sum + item.price, 0);

  return {
    total,
    completed,
    completedPercentage,
    totalPrice,
    spentAmount
  };
});

// 蔬果统计
const vegetablesStats = computed(() => {
  const total = vegetables.value.length;
  const completed = vegetables.value.filter(item => item.completed).length;

  return { total, completed };
});

// 肉类统计
const meatsStats = computed(() => {
  const total = meats.value.length;
  const completed = meats.value.filter(item => item.completed).length;

  return { total, completed };
});

// 调味品统计
const seasoningsStats = computed(() => {
  const total = seasonings.value.length;
  const completed = seasonings.value.filter(item => item.completed).length;

  return { total, completed };
});

// 切换购物项状态
const toggleItemStatus = (item: ShoppingItem) => {
  const index = shoppingItems.value.findIndex(i => i.id === item.id);
  if (index !== -1) {
    shoppingItems.value[index].completed = !shoppingItems.value[index].completed;
  }
};

// 搜索食材
const onSearch = (value: string) => {
  searchText.value = value;
  // 实际项目中会进行过滤操作
};

// 显示添加食材弹窗
const showAddModal = () => {
  isEditing.value = false;
  editingId.value = null;
  resetItemForm();
  addModalVisible.value = true;
};

// 显示分享弹窗
const showShareModal = () => {
  shareModalVisible.value = true;
};

// 重置食材表单
const resetItemForm = () => {
  itemForm.name = '';
  itemForm.quantity = 1;
  itemForm.unit = '克';
  itemForm.category = 'vegetable';
  itemForm.price = 0;
  itemForm.listId = 'all';
  itemForm.notes = '';
};

// 编辑购物项
const editItem = (item: ShoppingItem) => {
  isEditing.value = true;
  editingId.value = item.id;

  // 填充表单数据
  itemForm.name = item.name;
  itemForm.quantity = item.quantity;
  itemForm.unit = item.unit;
  itemForm.category = item.category;
  itemForm.price = item.price;
  itemForm.listId = item.listId;
  itemForm.notes = item.notes || '';

  addModalVisible.value = true;
};

// 删除购物项
const deleteItem = (id: number) => {
  shoppingItems.value = shoppingItems.value.filter(item => item.id !== id);
  message.success('已删除购物项');
};

// 取消添加弹窗
const cancelAddModal = () => {
  addModalVisible.value = false;
  resetItemForm();
};

// 取消分享弹窗
const cancelShareModal = () => {
  shareModalVisible.value = false;
};

// 保存购物项
const saveItem = () => {
  if (!itemForm.name) {
    message.error('请输入食材名称');
    return;
  }

  if (isEditing.value && editingId.value !== null) {
    // 更新现有购物项
    const index = shoppingItems.value.findIndex(i => i.id === editingId.value);
    if (index !== -1) {
      shoppingItems.value[index] = {
        ...shoppingItems.value[index],
        name: itemForm.name,
        quantity: itemForm.quantity,
        unit: itemForm.unit,
        category: itemForm.category,
        price: itemForm.price,
        listId: itemForm.listId,
        notes: itemForm.notes
      };
      message.success('已更新购物项');
    }
  } else {
    // 添加新购物项
    const newId = Math.max(...shoppingItems.value.map(i => i.id)) + 1;
    shoppingItems.value.push({
      id: newId,
      name: itemForm.name,
      quantity: itemForm.quantity,
      unit: itemForm.unit,
      category: itemForm.category,
      price: itemForm.price,
      completed: false,
      listId: itemForm.listId,
      notes: itemForm.notes
    });
    message.success('已添加购物项');
  }

  addModalVisible.value = false;
  resetItemForm();
};

// 选择分享方式
const selectShareMethod = (methodId: string) => {
  shareForm.method = methodId;
  message.info(`已选择通过${methodId}分享`);
};

// 复制分享链接
const copyShareLink = () => {
  // 实际应用中需要使用clipboard API或其他库
  navigator.clipboard.writeText(shareForm.link)
      .then(() => {
        message.success('链接已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
};

// 搜索菜谱
const searchRecipe = (value: string) => {
  // 实际项目中会搜索菜谱
  message.info(`正在搜索菜谱: ${value}`);
};

// 添加菜谱中的所有食材
const addRecipeIngredients = (recipeId: number) => {
  message.success('已添加菜谱中的所有食材');
};

// 添加常买清单分类中的食材
const addFrequentCategory = (categoryId: number) => {
  message.success('已添加常买食材');
};

// 打印购物清单
const printList = () => {
  message.info('正在准备打印购物清单');
  // 实际项目中会调用打印API
};

// 导出购物清单
const exportList = () => {
  message.info('正在导出购物清单');
  // 实际项目中会导出为Excel或PDF
};

// 生命周期钩子
onMounted(() => {
  // 初始化图表或其他操作
  setTimeout(() => {
    chartLoaded.value = true;
  }, 1000);
});
</script>

<style scoped>
.shopping-list-page {
  width: 100%;
  color: white;
}
.category-section, .stats-card, .recipe-card, .frequent-card {
  background-color: #444444;
  color: white;
}

/* 页面标题和操作按钮 */
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

.share-btn {
  border-color: #ddd;
  color: #666;
  background-color: white;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 38px;
}

.share-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.add-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-btn:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

/* 购物清单主体 */
.shopping-content {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 24px;
}

/* 工具栏 */
.tools-section {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.left-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.right-tools {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tool-buttons {
  display: flex;
  gap: 8px;
}

.tool-btn {
  color: #666;
  border-color: #ddd;
}

.tool-btn:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.danger-btn:hover {
  color: #FF5E62 !important;
  border-color: #FF5E62 !important;
}

/* 进度指示器 */
.progress-section {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-header h3 {
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 分类区块 */
.category-section {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-header {
  margin-bottom: 16px;
}

.category-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
}

.category-icon {
  margin-right: 8px;
  font-size: 18px;
}

.vegetable-icon {
  color: #66CC99;
}

.meat-icon {
  color: var(--primary-color);
}

.seasoning-icon {
  color: #5C8AE6;
}

/* 购物项列表 */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shopping-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.2s;
  background-color: white;
}

.shopping-item:hover {
  background-color: #fff8f0;
}

.item-completed {
  background-color: #f9f9f9;
  opacity: 0.8;
}

.item-completed .item-name {
  text-decoration: line-through;
  color: #999;
}

.item-main {
  display: flex;
  align-items: center;
  flex: 1;
}

.item-details {
  margin-left: 12px;
}

.item-name {
  font-weight: 500;
  margin: 0 0 4px 0;
  color: #333;
}

.item-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-completed {
  color: #66CC99;
}

.status-pending {
  color: var(--primary-color);
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-price {
  font-weight: 500;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  color: #666;
  border: none;
  background-color: #f5f5f5;
}

.action-btn:hover {
  color: var(--primary-color);
  background-color: #ffe6d9;
}

.danger-btn:hover {
  color: #FF5E62 !important;
  background-color: #ffe6e6 !important;
}

/* 右侧栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-card, .recipe-card, .frequent-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
}

.card-icon {
  color: var(--primary-color);
  margin-right: 8px;
}

/* 统计卡片 */
.stats-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.stats-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-label {
  color: #666;
}

.stats-value {
  font-weight: 500;
  color: #333;
}

.stats-chart {
  width: 100%;
  height: 140px;
  background-color: #f9f9f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  color: #999;
  font-size: 14px;
}

/* 菜谱卡片 */
.recipe-search {
  margin-bottom: 16px;
}

.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recipe-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.2s;
}

.recipe-item:hover {
  border-color: var(--primary-color);
}

.recipe-content {
  display: flex;
  gap: 12px;
}

.recipe-image {
  border-radius: 6px;
  object-fit: cover;
}

.recipe-info {
  flex: 1;
}

.recipe-name {
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
}

.recipe-meta {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
}

.add-ingredients-btn {
  color: var(--primary-color);
  padding: 0;
  height: auto;
  font-size: 12px;
}

.add-ingredients-btn:hover {
  color: var(--primary-hover);
}

/* 常买清单 */
.frequent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.frequent-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.frequent-content {
  display: flex;
  align-items: center;
}

.frequent-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.vegetable-icon {
  color: #66CC99;
}

.meat-icon {
  color: var(--primary-color);
}



.frequent-name {
  color: #333;
}

.add-btn {
  background-color: var(--primary-color);
  border: none;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  padding: 6px 15px;
  box-shadow: 0 2px 4px rgba(255, 153, 102, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  height: 38px;
  transition: none;
}

.add-btn:hover,
.add-btn:focus {
  color: white !important;
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  box-shadow: 0 2px 4px rgba(255, 153, 102, 0.3) !important;
}

/* 操作按钮容器 */
.action-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.print-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.print-btn:hover {
  background-color: var(--primary-hover);
  border-color: var(--primary-hover);
}

.export-btn {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background-color: white;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.export-btn:hover {
  background-color: #fff0e6;
}

/* 表单 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

/* 分享内容 */
.share-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.share-section {
  margin-bottom: 4px;
}

.section-label {
  color: #333;
  margin-bottom: 8px;
}

.share-methods {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.share-method-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.share-method-item:hover {
  border-color: var(--primary-color);
}

.share-method-icon {
  font-size: 24px;
}

.wechat-icon {
  color: #07C160;
}

.weibo-icon {
  color: #E6162D;
}

.email-icon {
  color: #5C8AE6;
}

.more-icon {
  color: #666;
}

.share-method-name {
  font-size: 12px;
  color: #333;
}

.share-link-input {
  display: flex;
}

.share-link-expires {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.collaboration-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collaboration-content {
  display: flex;
  align-items: center;
}

.collaboration-icon {
  color: #5C8AE6;
  font-size: 20px;
  margin-right: 12px;
}

.collaboration-text {
  display: flex;
  flex-direction: column;
}

.collaboration-title {
  color: #333;
  font-weight: 500;
  margin: 0;
}

.collaboration-desc {
  color: #666;
  font-size: 12px;
  margin: 0;
}

.invite-btn {
  background-color: #ffe6d9;
  color: var(--primary-color);
  border: none;
  font-size: 12px;
  height: 26px;
  padding: 0 12px;
  border-radius: 14px;
}

.invite-btn:hover {
  background-color: #ffd9c1;
  color: var(--primary-color);
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .shopping-content {
    grid-template-columns: 2fr 1fr;
  }
}

@media (max-width: 768px) {
  .shopping-content {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .action-buttons {
    width: 100%;
  }

  .tools-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .left-tools, .right-tools {
    width: 100%;
  }

  .share-methods {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>