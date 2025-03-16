<!-- IngredientManagement.vue -->
<template>
  <div class="ingredient-management">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2 class="page-title">我的食材库</h2>
      <div class="action-buttons">
        <a-button type="primary" class="add-btn" @click="showAddModal">
          <plus-outlined />
          添加食材
        </a-button>
        <a-button class="shopping-list-btn">
          <shopping-outlined />
          生成购物清单
        </a-button>
      </div>
    </div>

    <!-- 统计卡片区域 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon total-icon">
          <inbox-outlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">食材总数</div>
          <div class="stat-value">{{ stats.total }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon fresh-icon">
          <check-circle-outlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">新鲜食材</div>
          <div class="stat-value">{{ stats.fresh }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon soon-expiring-icon">
          <warning-outlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">即将过期</div>
          <div class="stat-value">{{ stats.soonExpiring }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon expired-icon">
          <close-circle-outlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">已过期</div>
          <div class="stat-value">{{ stats.expired }}</div>
        </div>
      </div>
    </div>

    <!-- 筛选和搜索区域 -->
    <div class="filter-section">
      <!-- 筛选下拉菜单 -->
      <div class="filters">
        <a-dropdown>
          <a-button class="filter-btn">
            所有分类
            <down-outlined />
          </a-button>
          <template #overlay>
            <a-menu @click="handleCategoryChange">
              <a-menu-item key="all">所有分类</a-menu-item>
              <a-menu-item key="meat">肉类</a-menu-item>
              <a-menu-item key="vegetable">蔬菜</a-menu-item>
              <a-menu-item key="fruit">水果</a-menu-item>
              <a-menu-item key="seafood">海鲜</a-menu-item>
              <a-menu-item key="spice">调料</a-menu-item>
              <a-menu-item key="grain">粮食</a-menu-item>
              <a-menu-item key="other">其他</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-dropdown>
          <a-button class="filter-btn">
            所有状态
            <down-outlined />
          </a-button>
          <template #overlay>
            <a-menu @click="handleStatusChange">
              <a-menu-item key="all">所有状态</a-menu-item>
              <a-menu-item key="fresh">新鲜</a-menu-item>
              <a-menu-item key="soon-expiring">即将过期</a-menu-item>
              <a-menu-item key="expired">已过期</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-dropdown>
          <a-button class="filter-btn">
            存储位置
            <down-outlined />
          </a-button>
          <template #overlay>
            <a-menu @click="handleStorageChange">
              <a-menu-item key="all">所有位置</a-menu-item>
              <a-menu-item key="refrigerator">冰箱冷藏</a-menu-item>
              <a-menu-item key="freezer">冰箱冷冻</a-menu-item>
              <a-menu-item key="cabinet">厨房橱柜</a-menu-item>
              <a-menu-item key="other">其他位置</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>

      <!-- 搜索框 -->
      <a-input-search
          placeholder="搜索食材..."
          class="search-input"
          @search="onSearch"
          allow-clear
      />
    </div>

    <!-- 分类标签 -->
    <div class="category-tags">
      <a-tag
          v-for="tag in categoryTags"
          :key="tag.value"
          :class="{ 'active-tag': activeCategory === tag.value }"
          @click="selectCategory(tag.value)"
      >
        {{ tag.label }}
      </a-tag>
    </div>

    <!-- 食材内容区域 -->
    <div class="ingredients-container">
      <!-- 即将过期食材 -->
      <div class="ingredient-section" v-if="soonExpiringIngredients.length > 0">
        <div class="section-header">
          <warning-outlined class="warning-icon" />
          <h3>即将过期 ({{ soonExpiringIngredients.length }})</h3>
        </div>

        <div class="ingredient-list">
          <div
              v-for="ingredient in soonExpiringIngredients"
              :key="ingredient.id"
              class="ingredient-item soon-expiring"
          >
            <div class="ingredient-info">
              <a-avatar :src="ingredient.image" :size="48" class="ingredient-image" />
              <div class="ingredient-details">
                <h4 class="ingredient-name">{{ ingredient.name }}</h4>
                <div class="ingredient-meta">
                  <span class="ingredient-meta-item">
                    <balance-outlined /> {{ ingredient.quantity }}{{ ingredient.unit }}
                  </span>
                  <span class="ingredient-meta-item">
                    <calendar-outlined /> 还剩{{ ingredient.daysLeft }}天
                  </span>
                  <span class="ingredient-meta-item">
                    <container-outlined /> {{ ingredient.storage }}
                  </span>
                </div>
              </div>
            </div>
            <div class="ingredient-actions">
              <a-tooltip title="建议菜谱">
                <a-button shape="circle" class="action-btn">
                  <read-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="添加到购物清单">
                <a-button shape="circle" class="action-btn">
                  <shopping-cart-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="编辑">
                <a-button shape="circle" class="action-btn" @click="editIngredient(ingredient)">
                  <edit-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="删除">
                <a-button shape="circle" class="action-btn delete-btn" @click="deleteIngredient(ingredient.id)">
                  <delete-outlined />
                </a-button>
              </a-tooltip>
            </div>
          </div>
        </div>
      </div>

      <!-- 蔬菜水果区域 -->
      <div class="ingredient-section" v-if="vegetablesAndFruits.length > 0">
        <div class="section-header">
          <leaf-outlined class="vegetable-icon" />
          <h3>蔬菜水果 ({{ vegetablesAndFruits.length }})</h3>
        </div>

        <div class="ingredient-list">
          <div
              v-for="ingredient in visibleVegetablesAndFruits"
              :key="ingredient.id"
              :class="['ingredient-item', getStatusClass(ingredient)]"
          >
            <div class="ingredient-info">
              <a-avatar :src="ingredient.image" :size="48" class="ingredient-image" />
              <div class="ingredient-details">
                <h4 class="ingredient-name">{{ ingredient.name }}</h4>
                <div class="ingredient-meta">
                  <span class="ingredient-meta-item">
                    <balance-outlined /> {{ ingredient.quantity }}{{ ingredient.unit }}
                  </span>
                  <span class="ingredient-meta-item">
                    <calendar-outlined /> 还剩{{ ingredient.daysLeft }}天
                  </span>
                  <span class="ingredient-meta-item">
                    <container-outlined /> {{ ingredient.storage }}
                  </span>
                </div>
              </div>
            </div>
            <div class="ingredient-actions">
              <a-tooltip title="建议菜谱">
                <a-button shape="circle" class="action-btn">
                  <read-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="添加到购物清单">
                <a-button shape="circle" class="action-btn">
                  <shopping-cart-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="编辑">
                <a-button shape="circle" class="action-btn" @click="editIngredient(ingredient)">
                  <edit-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="删除">
                <a-button shape="circle" class="action-btn delete-btn" @click="deleteIngredient(ingredient.id)">
                  <delete-outlined />
                </a-button>
              </a-tooltip>
            </div>
          </div>
        </div>

        <a-button
            v-if="vegetablesAndFruits.length > maxVisibleItems"
            block
            class="view-more-btn"
            @click="toggleVegetablesExpand"
        >
          {{ expandVegetables ? '收起' : `查看更多蔬菜水果 (${vegetablesAndFruits.length - maxVisibleItems})` }}
        </a-button>
      </div>

      <!-- 肉类区域 -->
      <div class="ingredient-section" v-if="meats.length > 0">
        <div class="section-header">
          <fire-outlined class="meat-icon" />
          <h3>肉类 ({{ meats.length }})</h3>
        </div>

        <div class="ingredient-list">
          <div
              v-for="ingredient in visibleMeats"
              :key="ingredient.id"
              :class="['ingredient-item', getStatusClass(ingredient)]"
          >
            <div class="ingredient-info">
              <a-avatar :src="ingredient.image" :size="48" class="ingredient-image" />
              <div class="ingredient-details">
                <h4 class="ingredient-name">{{ ingredient.name }}</h4>
                <div class="ingredient-meta">
                  <span class="ingredient-meta-item">
                    <balance-outlined /> {{ ingredient.quantity }}{{ ingredient.unit }}
                  </span>
                  <span class="ingredient-meta-item">
                    <calendar-outlined /> 还剩{{ ingredient.daysLeft }}天
                  </span>
                  <span class="ingredient-meta-item">
                    <container-outlined /> {{ ingredient.storage }}
                  </span>
                </div>
              </div>
            </div>
            <div class="ingredient-actions">
              <a-tooltip title="建议菜谱">
                <a-button shape="circle" class="action-btn">
                  <read-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="添加到购物清单">
                <a-button shape="circle" class="action-btn">
                  <shopping-cart-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="编辑">
                <a-button shape="circle" class="action-btn" @click="editIngredient(ingredient)">
                  <edit-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="删除">
                <a-button shape="circle" class="action-btn delete-btn" @click="deleteIngredient(ingredient.id)">
                  <delete-outlined />
                </a-button>
              </a-tooltip>
            </div>
          </div>
        </div>

        <a-button
            v-if="meats.length > maxVisibleItems"
            block
            class="view-more-btn"
            @click="toggleMeatsExpand"
        >
          {{ expandMeats ? '收起' : `查看更多肉类 (${meats.length - maxVisibleItems})` }}
        </a-button>
      </div>

      <!-- 其他食材区域 -->
      <div class="ingredient-section" v-if="others.length > 0">
        <div class="section-header">
          <inbox-outlined class="other-icon" />
          <h3>其他食材 ({{ others.length }})</h3>
        </div>

        <div class="ingredient-list">
          <div
              v-for="ingredient in visibleOthers"
              :key="ingredient.id"
              :class="['ingredient-item', getStatusClass(ingredient)]"
          >
            <div class="ingredient-info">
              <a-avatar :src="ingredient.image" :size="48" class="ingredient-image" />
              <div class="ingredient-details">
                <h4 class="ingredient-name">{{ ingredient.name }}</h4>
                <div class="ingredient-meta">
                  <span class="ingredient-meta-item">
                    <balance-outlined /> {{ ingredient.quantity }}{{ ingredient.unit }}
                  </span>
                  <span class="ingredient-meta-item">
                    <calendar-outlined /> 还剩{{ ingredient.daysLeft }}天
                  </span>
                  <span class="ingredient-meta-item">
                    <container-outlined /> {{ ingredient.storage }}
                  </span>
                </div>
              </div>
            </div>
            <div class="ingredient-actions">
              <a-tooltip title="建议菜谱">
                <a-button shape="circle" class="action-btn">
                  <read-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="添加到购物清单">
                <a-button shape="circle" class="action-btn">
                  <shopping-cart-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="编辑">
                <a-button shape="circle" class="action-btn" @click="editIngredient(ingredient)">
                  <edit-outlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="删除">
                <a-button shape="circle" class="action-btn delete-btn" @click="deleteIngredient(ingredient.id)">
                  <delete-outlined />
                </a-button>
              </a-tooltip>
            </div>
          </div>
        </div>

        <a-button
            v-if="others.length > maxVisibleItems"
            block
            class="view-more-btn"
            @click="toggleOthersExpand"
        >
          {{ expandOthers ? '收起' : `查看更多其他食材 (${others.length - maxVisibleItems})` }}
        </a-button>
      </div>
    </div>

    <!-- 推荐菜谱区域 -->
    <div class="recipe-recommendations">
      <div class="section-header">
        <fire-outlined class="recommendation-icon" />
        <h3>根据您的食材推荐</h3>
      </div>

      <div class="recipe-grid">
        <div v-for="recipe in recommendedRecipes" :key="recipe.id" class="recipe-card">
          <div class="recipe-image-container">
            <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
            <div class="recipe-badge">已有食材</div>
          </div>
          <div class="recipe-content">
            <h4 class="recipe-title">{{ recipe.title }}</h4>
            <div class="recipe-meta">
              <span class="ingredients-info">
                <inbox-outlined /> 已有{{ recipe.availableIngredients }}/{{ recipe.totalIngredients }}种食材
              </span>
              <div class="rating">
                <a-rate :value="recipe.rating" disabled allow-half :count="5" />
              </div>
            </div>
            <a-button type="primary" block class="view-recipe-btn">
              查看菜谱
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑食材模态框 -->
    <a-modal
        v-model:visible="modalVisible"
        :title="isEditing ? '编辑食材' : '添加食材'"
        @cancel="cancelModal"
        :footer="null"
        width="500px"
        class="ingredient-modal"
    >
      <a-form
          :model="ingredientForm"
          layout="vertical"
      >
        <a-form-item label="食材名称" name="name" required>
          <a-input v-model:value="ingredientForm.name" placeholder="例如：西兰花" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="数量" name="quantity" required>
              <a-input-number v-model:value="ingredientForm.quantity" :min="1" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="单位" name="unit" required>
              <a-select v-model:value="ingredientForm.unit">
                <a-select-option value="克">克</a-select-option>
                <a-select-option value="千克">千克</a-select-option>
                <a-select-option value="毫升">毫升</a-select-option>
                <a-select-option value="升">升</a-select-option>
                <a-select-option value="个">个</a-select-option>
                <a-select-option value="勺">勺</a-select-option>
                <a-select-option value="其他">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="分类" name="category" required>
              <a-select v-model:value="ingredientForm.category">
                <a-select-option value="vegetable">蔬菜</a-select-option>
                <a-select-option value="fruit">水果</a-select-option>
                <a-select-option value="meat">肉类</a-select-option>
                <a-select-option value="seafood">海鲜</a-select-option>
                <a-select-option value="dairy">奶制品</a-select-option>
                <a-select-option value="spice">调料</a-select-option>
                <a-select-option value="grain">粮食</a-select-option>
                <a-select-option value="other">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="存储位置" name="storage" required>
              <a-select v-model:value="ingredientForm.storage">
                <a-select-option value="冰箱冷藏">冰箱冷藏</a-select-option>
                <a-select-option value="冰箱冷冻">冰箱冷冻</a-select-option>
                <a-select-option value="厨房橱柜">厨房橱柜</a-select-option>
                <a-select-option value="其他">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="购买日期" name="purchaseDate">
              <a-date-picker v-model:value="ingredientForm.purchaseDate" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="过期日期" name="expiryDate" required>
              <a-date-picker v-model:value="ingredientForm.expiryDate" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="食材图片" name="image">
          <a-upload
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
          >
            <div v-if="fileList.length < 1">
              <plus-outlined />
              <div style="margin-top: 8px">上传</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="备注" name="notes">
          <a-textarea v-model:value="ingredientForm.notes" :rows="2" placeholder="添加关于这个食材的备注..." />
        </a-form-item>

        <div class="form-actions">
          <a-button @click="cancelModal">取消</a-button>
          <a-button type="primary" @click="saveIngredient">
            {{ isEditing ? '保存修改' : '添加食材' }}
          </a-button>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import type { UploadProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import {
  PlusOutlined,
  ShoppingOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  DownOutlined,
  CalendarOutlined,
  ContainerOutlined,
  ReadOutlined,
  ShoppingCartOutlined,
  EditOutlined,
  DeleteOutlined,
  FireOutlined
} from '@ant-design/icons-vue';

// 模拟统计数据
const stats = reactive({
  total: 43,
  fresh: 28,
  soonExpiring: 8,
  expired: 7
});

// 筛选状态
const activeFilter = reactive({
  category: 'all',
  status: 'all',
  storage: 'all'
});

// 搜索关键词
const searchKeyword = ref('');

// 分类标签
const categoryTags = [
  { label: '全部', value: 'all' },
  { label: '肉类', value: 'meat' },
  { label: '蔬菜', value: 'vegetable' },
  { label: '水果', value: 'fruit' },
  { label: '海鲜', value: 'seafood' },
  { label: '调料', value: 'spice' },
  { label: '粮食', value: 'grain' },
  { label: '其他', value: 'other' },
];

// 激活的分类
const activeCategory = ref('all');

// 食材数据
const ingredients = ref([
  // 即将过期食材
  {
    id: 1,
    name: '牛肉',
    image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=240&h=240&fit=crop',
    quantity: 500,
    unit: '克',
    category: 'meat',
    daysLeft: 2,
    storage: '冰箱冷藏',
    status: 'soon-expiring'
  },
  {
    id: 2,
    name: '牛奶',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=240&h=240&fit=crop',
    quantity: 1,
    unit: '升',
    category: 'dairy',
    daysLeft: 3,
    storage: '冰箱冷藏',
    status: 'soon-expiring'
  },
  // 蔬菜水果
  {
    id: 3,
    name: '南瓜',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=240&h=240&fit=crop',
    quantity: 1,
    unit: '个',
    category: 'vegetable',
    daysLeft: 14,
    storage: '厨房橱柜',
    status: 'fresh'
  },
  {
    id: 4,
    name: '西兰花',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=240&h=240&fit=crop',
    quantity: 300,
    unit: '克',
    category: 'vegetable',
    daysLeft: 7,
    storage: '冰箱冷藏',
    status: 'fresh'
  },
  {
    id: 5,
    name: '草莓',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=240&h=240&fit=crop',
    quantity: 250,
    unit: '克',
    category: 'fruit',
    daysLeft: 2,
    storage: '冰箱冷藏',
    status: 'soon-expiring'
  },
  {
    id: 6,
    name: '番茄',
    image: 'https://images.unsplash.com/photo-1579282240050-352db0a14c21?w=240&h=240&fit=crop',
    quantity: 500,
    unit: '克',
    category: 'vegetable',
    daysLeft: 5,
    storage: '冰箱冷藏',
    status: 'fresh'
  },
  {
    id: 7,
    name: '苹果',
    image: 'https://images.unsplash.com/photo-1603489606744-53697229cfca?w=240&h=240&fit=crop',
    quantity: 5,
    unit: '个',
    category: 'fruit',
    daysLeft: 10,
    storage: '冰箱冷藏',
    status: 'fresh'
  },
  {
    id: 8,
    name: '香蕉',
    image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=240&h=240&fit=crop',
    quantity: 3,
    unit: '个',
    category: 'fruit',
    daysLeft: 4,
    storage: '厨房橱柜',
    status: 'fresh'
  },
  // 肉类
  {
    id: 9,
    name: '鸡胸肉',
    image: 'https://images.unsplash.com/photo-1595777216528-071e0127ccbf?w=240&h=240&fit=crop',
    quantity: 400,
    unit: '克',
    category: 'meat',
    daysLeft: 5,
    storage: '冰箱冷冻',
    status: 'fresh'
  },
  {
    id: 10,
    name: '三文鱼',
    image: 'https://images.unsplash.com/photo-1603103256281-31f744e1c5e6?w=240&h=240&fit=crop',
    quantity: 300,
    unit: '克',
    category: 'seafood',
    daysLeft: 4,
    storage: '冰箱冷冻',
    status: 'fresh'
  },
  // 其他食材
  {
    id: 11,
    name: '大米',
    image: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=240&h=240&fit=crop',
    quantity: 5,
    unit: '千克',
    category: 'grain',
    daysLeft: 90,
    storage: '厨房橱柜',
    status: 'fresh'
  },
  {
    id: 12,
    name: '面条',
    image: 'https://images.unsplash.com/photo-1533088339612-0df4a27d5b38?w=240&h=240&fit=crop',
    quantity: 1,
    unit: '千克',
    category: 'grain',
    daysLeft: 120,
    storage: '厨房橱柜',
    status: 'fresh'
  }
]);

// 推荐菜谱
const recommendedRecipes = ref([
  {
    id: 1,
    title: '香煎三文鱼',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    availableIngredients: 4,
    totalIngredients: 6,
    rating: 4.5,
  },
  {
    id: 2,
    title: '西兰花炒鸡胸肉',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82561?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    availableIngredients: 5,
    totalIngredients: 7,
    rating: 4.0,
  },
  {
    id: 3,
    title: '南瓜奶油浓汤',
    image: 'https://images.unsplash.com/photo-1593095948071-474c06a461e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    availableIngredients: 3,
    totalIngredients: 5,
    rating: 4.5,
  }
]);

// 计算属性：不同类型的食材
const soonExpiringIngredients = computed(() => {
  return filterIngredients().filter(item => item.status === 'soon-expiring');
});

const vegetablesAndFruits = computed(() => {
  return filterIngredients().filter(item =>
      item.category === 'vegetable' || item.category === 'fruit'
  );
});

const meats = computed(() => {
  return filterIngredients().filter(item =>
      item.category === 'meat' || item.category === 'seafood'
  );
});

const others = computed(() => {
  return filterIngredients().filter(item =>
      item.category !== 'meat' && item.category !== 'seafood' &&
      item.category !== 'vegetable' && item.category !== 'fruit'
  );
});

// 控制"查看更多"功能
const maxVisibleItems = 3;
const expandVegetables = ref(false);
const expandMeats = ref(false);
const expandOthers = ref(false);

// 计算显示的食材列表
const visibleVegetablesAndFruits = computed(() => {
  return expandVegetables.value
      ? vegetablesAndFruits.value
      : vegetablesAndFruits.value.slice(0, maxVisibleItems);
});

const visibleMeats = computed(() => {
  return expandMeats.value ? meats.value : meats.value.slice(0, maxVisibleItems);
});

const visibleOthers = computed(() => {
  return expandOthers.value ? others.value : others.value.slice(0, maxVisibleItems);
});

// 切换展开/收起状态
const toggleVegetablesExpand = () => {
  expandVegetables.value = !expandVegetables.value;
};

const toggleMeatsExpand = () => {
  expandMeats.value = !expandMeats.value;
};

const toggleOthersExpand = () => {
  expandOthers.value = !expandOthers.value;
};

// 筛选食材
function filterIngredients() {
  return ingredients.value.filter(item => {
    // 根据分类筛选
    if (activeCategory.value !== 'all' && item.category !== activeCategory.value) {
      return false;
    }

    // 根据筛选器筛选
    if (activeFilter.category !== 'all' && item.category !== activeFilter.category) {
      return false;
    }

    if (activeFilter.status !== 'all' && item.status !== activeFilter.status) {
      return false;
    }

    if (activeFilter.storage !== 'all' && item.storage !== getStorageDisplay(activeFilter.storage)) {
      return false;
    }

    // 搜索关键词
    if (searchKeyword.value && !item.name.includes(searchKeyword.value)) {
      return false;
    }

    return true;
  });
}

// 获取存储位置显示文本
function getStorageDisplay(storage: string) {
  const map: Record<string, string> = {
    'refrigerator': '冰箱冷藏',
    'freezer': '冰箱冷冻',
    'cabinet': '厨房橱柜',
    'other': '其他'
  };
  return map[storage] || storage;
}

// 获取食材状态样式类
function getStatusClass(ingredient: any) {
  switch (ingredient.status) {
    case 'expired':
      return 'expired';
    case 'soon-expiring':
      return 'soon-expiring';
    case 'fresh':
      return 'fresh';
    default:
      return '';
  }
}

// 处理筛选操作
const handleCategoryChange = (e: any) => {
  activeFilter.category = e.key;
};

const handleStatusChange = (e: any) => {
  activeFilter.status = e.key;
};

const handleStorageChange = (e: any) => {
  activeFilter.storage = e.key;
};

// 处理搜索
const onSearch = (value: string) => {
  searchKeyword.value = value;
};

// 选择分类标签
const selectCategory = (category: string) => {
  activeCategory.value = category;
};

// 添加食材模态框
const modalVisible = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);
const fileList = ref<any[]>([]);

// 食材表单数据
const ingredientForm = reactive({
  name: '',
  quantity: 1,
  unit: '克',
  category: 'vegetable',
  storage: '冰箱冷藏',
  purchaseDate: null as Dayjs | null,
  expiryDate: null as Dayjs | null,
  image: '',
  notes: ''
});

// 显示添加食材模态框
const showAddModal = () => {
  isEditing.value = false;
  editingId.value = null;
  resetForm();
  modalVisible.value = true;
};

// 编辑食材
const editIngredient = (ingredient: any) => {
  isEditing.value = true;
  editingId.value = ingredient.id;

  // 填充表单数据
  ingredientForm.name = ingredient.name;
  ingredientForm.quantity = ingredient.quantity;
  ingredientForm.unit = ingredient.unit;
  ingredientForm.category = ingredient.category;
  ingredientForm.storage = ingredient.storage;

  // 从剩余天数计算过期日期
  const expiryDate = dayjs().add(ingredient.daysLeft, 'day');
  ingredientForm.expiryDate = expiryDate;
  ingredientForm.purchaseDate = dayjs(); // 模拟数据，实际应从食材数据中获取

  ingredientForm.notes = ingredient.notes || '';

  // 设置图片
  fileList.value = [{
    uid: '-1',
    name: ingredient.name,
    status: 'done',
    url: ingredient.image,
  }];

  modalVisible.value = true;
};

// 删除食材
const deleteIngredient = (id: number) => {
  ingredients.value = ingredients.value.filter(item => item.id !== id);
  message.success('食材已删除');
};

// 取消模态框
const cancelModal = () => {
  modalVisible.value = false;
  resetForm();
};

// 重置表单
const resetForm = () => {
  ingredientForm.name = '';
  ingredientForm.quantity = 1;
  ingredientForm.unit = '克';
  ingredientForm.category = 'vegetable';
  ingredientForm.storage = '冰箱冷藏';
  ingredientForm.purchaseDate = null;
  ingredientForm.expiryDate = null;
  ingredientForm.notes = '';
  fileList.value = [];
};

// 保存食材
const saveIngredient = () => {
  if (!ingredientForm.name) {
    message.error('请输入食材名称');
    return;
  }

  if (!ingredientForm.expiryDate) {
    message.error('请选择过期日期');
    return;
  }

  const daysLeft = ingredientForm.expiryDate ?
      ingredientForm.expiryDate.diff(dayjs(), 'day') : 0;

  const status = daysLeft <= 0 ? 'expired' :
      daysLeft <= 3 ? 'soon-expiring' : 'fresh';

  const imageUrl = fileList.value.length > 0 ? fileList.value[0].url :
      'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=240&h=240&fit=crop';

  if (isEditing.value && editingId.value !== null) {
    // 更新现有食材
    const index = ingredients.value.findIndex(i => i.id === editingId.value);
    if (index !== -1) {
      ingredients.value[index] = {
        ...ingredients.value[index],
        name: ingredientForm.name,
        quantity: ingredientForm.quantity,
        unit: ingredientForm.unit,
        category: ingredientForm.category,
        storage: ingredientForm.storage,
        daysLeft,
        status,
        image: imageUrl,
        notes: ingredientForm.notes
      };
      message.success('食材已更新');
    }
  } else {
    // 添加新食材
    const newId = Math.max(...ingredients.value.map(i => i.id)) + 1;
    ingredients.value.push({
      id: newId,
      name: ingredientForm.name,
      quantity: ingredientForm.quantity,
      unit: ingredientForm.unit,
      category: ingredientForm.category,
      storage: ingredientForm.storage,
      daysLeft,
      status,
      image: imageUrl,
      notes: ingredientForm.notes
    });
    message.success('食材已添加');
  }

  modalVisible.value = false;
  resetForm();
};

// 图片上传相关
const handlePreview = (file: any) => {
  // 实际项目中处理预览
  console.log('Preview file', file);
};

const handleChange: UploadProps['onChange'] = (info) => {
  let fileList = [...info.fileList];

  // 只保留最新的文件
  fileList = fileList.slice(-1);

  // 处理上传状态
  fileList = fileList.map(file => {
    if (file.response) {
      file.url = file.response.url;
    }
    return file;
  });

  fileList.value = fileList;
};

// 生命周期钩子
onMounted(() => {
  // 初始化时可以执行额外操作，如从API获取数据
});
</script>

<style scoped>
.ingredient-management {
  width: 100%;
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

.add-btn {
  background-color: #FF9966;
  border-color: #FF9966;
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-btn:hover {
  background-color: #FF8044;
  border-color: #FF8044;
}

.shopping-list-btn {
  border-color: #ddd;
  color: #666;
  background-color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.shopping-list-btn:hover {
  background-color: #f5f5f5;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  font-size: 20px;
}

.total-icon {
  background-color: #fff0e6;
  color: #FF9966;
}

.fresh-icon {
  background-color: #e6f7f0;
  color: #66CC99;
}

.soon-expiring-icon {
  background-color: #fff6e0;
  color: #FFBB33;
}

.expired-icon {
  background-color: #ffe6e6;
  color: #FF5E62;
}

.stat-content {
  flex: 1;
}

.stat-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-value {
  color: #333;
  font-size: 22px;
  font-weight: 600;
}

/* 筛选和搜索区域 */
.filter-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 12px;
}

.filter-btn {
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  border-color: #ddd;
  background-color: white;
}

.filter-btn:hover {
  color: #FF9966;
  border-color: #FF9966;
}

.search-input {
  width: 240px;
  border-radius: 20px;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 20px;
}

:deep(.ant-input-search-button) {
  border-radius: 0 20px 20px 0 !important;
}

/* 分类标签 */
.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.category-tags :deep(.ant-tag) {
  padding: 4px 12px;
  border-radius: 16px;
  cursor: pointer;
  margin-right: 0;
  font-size: 14px;
  border: none;
  background-color: #f1f1f1;
  color: #666;
}

.category-tags :deep(.ant-tag:hover) {
  background-color: #ffe6d9;
  color: #FF9966;
}

.category-tags :deep(.active-tag) {
  background-color: #FF9966 !important;
  color: white !important;
}

/* 食材内容区域 */
.ingredients-container {
  margin-bottom: 32px;
}

.ingredient-section {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.warning-icon {
  color: #FFBB33;
  font-size: 18px;
  margin-right: 8px;
}

.vegetable-icon {
  color: #66CC99;
  font-size: 18px;
  margin-right: 8px;
}

.meat-icon {
  color: #FF9966;
  font-size: 18px;
  margin-right: 8px;
}

.other-icon {
  color: #5C8AE6;
  font-size: 18px;
  margin-right: 8px;
}

.recommendation-icon {
  color: #FF9966;
  font-size: 18px;
  margin-right: 8px;
}

.ingredient-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ingredient-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  transition: all 0.2s;
}

.ingredient-item:hover {
  background-color: #fff8f0;
}

.ingredient-item.expired {
  border-left: 3px solid #FF5E62;
}

.ingredient-item.soon-expiring {
  border-left: 3px solid #FFBB33;
}

.ingredient-item.fresh {
  border-left: 3px solid #66CC99;
}

.ingredient-info {
  display: flex;
  align-items: center;
}

.ingredient-image {
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.ingredient-details {
  display: flex;
  flex-direction: column;
}

.ingredient-name {
  font-weight: 500;
  margin: 0 0 4px 0;
  color: #333;
}

.ingredient-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.ingredient-meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ingredient-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  color: #666;
  border: none;
  background-color: #f5f5f5;
}

.action-btn:hover {
  color: #FF9966;
  background-color: #ffe6d9;
}

.delete-btn:hover {
  color: #FF5E62 !important;
  background-color: #ffe6e6 !important;
}

.view-more-btn {
  margin-top: 16px;
  border: 1px dashed #FF9966;
  color: #FF9966;
  background-color: transparent;
}

.view-more-btn:hover {
  background-color: #fff0e6;
  border-color: #FF9966;
  color: #FF9966;
}

/* 推荐菜谱区域 */
.recipe-recommendations {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 16px;
}

.recipe-card {
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.recipe-image-container {
  height: 160px;
  position: relative;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #FF9966;
  color: white;
  padding: 2px 8px;
  border-radius: 0 8px 8px 0;
  font-size: 12px;
}

.recipe-content {
  padding: 12px;
}

.recipe-title {
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #333;
}

.recipe-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.ingredients-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.rating {
  font-size: 12px;
}

:deep(.ant-rate) {
  font-size: 12px;
}

.view-recipe-btn {
  background-color: #FF9966;
  border-color: #FF9966;
  width: 100%;
  font-size: 14px;
}

.view-recipe-btn:hover {
  background-color: #FF8044;
  border-color: #FF8044;
}

/* 模态框样式 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-input:focus),
:deep(.ant-input-focused),
:deep(.ant-select-focused .ant-select-selector),
:deep(.ant-picker-focused),
:deep(.ant-input-number-focused) {
  border-color: #FF9966 !important;
  box-shadow: 0 0 0 2px rgba(255, 153, 102, 0.2) !important;
}

:deep(.ant-btn-primary) {
  background-color: #FF9966;
  border-color: #FF9966;
}

:deep(.ant-btn-primary:hover) {
  background-color: #FF8044;
  border-color: #FF8044;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-cards {
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

  .filter-section {
    flex-direction: column;
    gap: 12px;
  }

  .filters {
    flex-wrap: wrap;
  }

  .search-input {
    width: 100%;
  }

  .recipe-grid {
    grid-template-columns: 1fr;
  }
}
</style>