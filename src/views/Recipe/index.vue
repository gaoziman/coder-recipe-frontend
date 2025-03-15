<template>
  <div class="my-recipes-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="title-section">
        <h1 class="page-title">我的菜谱</h1>
        <p class="page-description">管理和探索您的创意厨艺</p>
      </div>
      <div class="action-section">
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="seasonal-planning" @click="handleSeasonalPlanning">
                <calendar-outlined />
                应季菜谱规划
              </a-menu-item>
              <a-menu-item key="nutritional-analysis" @click="handleNutritionalAnalysis">
                <pie-chart-outlined />
                营养分析报告
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="favorites" @click="handleManageFavorites">
                <heart-outlined />
                我的收藏夹
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="preferences" @click="handlePreferences">
                <setting-outlined />
                菜谱偏好设置
              </a-menu-item>
            </a-menu>
          </template>
          <a-button type="default" class="organize-btn">
            <appstore-outlined/>
            菜谱管理
            <down-outlined/>
          </a-button>
        </a-dropdown>

        <a-radio-group v-model:value="viewMode" button-style="solid" class="view-mode-toggle">
          <a-radio-button value="grid">
            <appstore-outlined/>
            卡片视图
          </a-radio-button>
          <a-radio-button value="list">
            <bars-outlined/>
            列表视图
          </a-radio-button>
        </a-radio-group>

        <a-button @click="handleBatchManage" class="batch-btn">
          <select-outlined/>
          批量管理
        </a-button>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="filter-section">
      <div class="search-area">
        <a-input-search
            v-model:value="searchText"
            placeholder="搜索菜谱名称、标签或食材..."
            style="width: 300px"
            @search="handleSearch"
        />
      </div>
      <div class="filter-area">
        <span class="filter-label">分类：</span>
        <a-radio-group v-model:value="currentCategory" buttonStyle="solid" class="custom-radio-group">
          <a-radio-button value="all" class="custom-radio-button">全部</a-radio-button>
          <a-radio-button value="breakfast" class="custom-radio-button">早餐</a-radio-button>
          <a-radio-button value="lunch" class="custom-radio-button">午餐</a-radio-button>
          <a-radio-button value="dinner" class="custom-radio-button">晚餐</a-radio-button>
          <a-radio-button value="fast" class="custom-radio-button">快手菜</a-radio-button>
          <a-radio-button value="vegetarian" class="custom-radio-button">素食</a-radio-button>
          <a-radio-button value="family" class="custom-radio-button">家常菜</a-radio-button>
        </a-radio-group>
      </div>
      <div class="sort-area">
        <span class="sort-label">排序：</span>
        <a-select
            v-model:value="sortBy"
            style="width: 150px"
            @change="handleSortChange"
        >
          <a-select-option value="latest">最近添加</a-select-option>
          <a-select-option value="name">名称</a-select-option>
          <a-select-option value="cookCount">烹饪次数</a-select-option>
          <a-select-option value="lastCooked">最近烹饪</a-select-option>
        </a-select>
      </div>
    </div>

    <!-- 菜谱统计摘要 -->
    <div class="statistics-section">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-card class="stat-card">
            <template #title>
              <fire-outlined class="stat-icon"/>
              总菜谱数
            </template>
            <div class="stat-value">{{ totalRecipes }}</div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <template #title>
              <coffee-outlined class="stat-icon"/>
              本月新增
            </template>
            <div class="stat-value">{{ newRecipesThisMonth }}</div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <template #title>
              <trophy-outlined class="stat-icon"/>
              最常烹饪
            </template>
            <div class="stat-value">{{ mostCookedName }}</div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card class="stat-card">
            <template #title>
              <calendar-outlined class="stat-icon"/>
              最近烹饪
            </template>
            <div class="stat-value">{{ lastCookedName }}</div>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 菜谱列表区域 -->
    <div class="recipes-section">
      <!-- 无数据时显示 -->
      <div v-if="filteredRecipes.length === 0" class="empty-data">
        <a-empty
            description="暂无符合条件的菜谱"
            :image="Empty.PRESENTED_IMAGE_SIMPLE"
        >
          <template #description>
            <span>{{ searchText ? '没有找到符合搜索条件的菜谱' : '还没有添加任何菜谱' }}</span>
          </template>
          <a-button type="primary" @click="handleAddRecipe">立即创建</a-button>
        </a-empty>
      </div>

      <!-- 卡片视图 -->
      <transition-group
          v-else-if="viewMode === 'grid'"
          name="view-transition"
          tag="div"
          class="recipe-grid"
          appear
      >

        <div
            class="recipe-wrapper"
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
        >
          <div class="recipe-card">
            <!-- 菜谱图片区 -->
            <div class="recipe-image" :style="{ backgroundImage: `url(${recipe.imageUrl})` }">
              <div class="recipe-actions">
                <a-tooltip title="编辑">
                  <a-button
                      type="text"
                      shape="circle"
                      class="action-btn"
                      @click.stop="handleEditRecipe(recipe.id)"
                  >
                    <edit-outlined/>
                  </a-button>
                </a-tooltip>
                <a-tooltip title="删除">
                  <a-button
                      type="text"
                      shape="circle"
                      class="action-btn delete-btn"
                      @click.stop="handleDeleteRecipe(recipe.id)"
                  >
                    <delete-outlined/>
                  </a-button>
                </a-tooltip>
              </div>
              <div class="cook-count">
                <fire-filled/>
                {{ recipe.cookCount }}次
              </div>
            </div>

            <!-- 菜谱信息区 -->
            <div class="recipe-info" @click="handleViewRecipe(recipe.id)">
              <h3 class="recipe-title">{{ recipe.title }}</h3>
              <div class="recipe-tags">
                <a-tag
                    v-for="tag in recipe.tags"
                    :key="tag"
                    :color="getTagColor(tag)"
                >
                  {{ tag }}
                </a-tag>
              </div>
              <div class="recipe-meta">
                <span class="meta-item">
                  <clock-circle-outlined/> 上次: {{ formatDate(recipe.lastCooked) }}
                </span>
                <span class="meta-item difficulty" :class="'difficulty-' + getDifficultyClass(recipe.difficulty)">
                  {{ recipe.difficulty || '简单' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- 列表视图 -->
      <transition
          v-else
          name="view-transition"
          appear
      >
        <div class="recipe-list">
          <a-table
              :dataSource="filteredRecipes"
              :columns="columns"
              :pagination="false"
              class="custom-table"
              rowKey="id"
          >
            <template #bodyCell="{ column, record }">
              <!-- 自定义表格单元格 -->
              <template v-if="column.dataIndex === 'image'">
                <div class="recipe-thumbnail" :style="{ backgroundImage: `url(${record.imageUrl})` }"></div>
              </template>

              <template v-else-if="column.dataIndex === 'title'">
                <div class="recipe-title-cell">
                  <div class="recipe-title-text">{{ record.title }}</div>
                  <div class="recipe-tags">
                    <a-tag v-for="tag in record.tags" :key="tag" :color="getTagColor(tag)">{{ tag }}</a-tag>
                  </div>
                </div>
              </template>

              <template v-else-if="column.dataIndex === 'cookCount'">
                <div class="cook-count-cell">
                  <fire-filled/>
                  {{ record.cookCount }}次
                </div>
              </template>

              <template v-else-if="column.dataIndex === 'lastCooked'">
                {{ formatDate(record.lastCooked) }}
              </template>

              <template v-else-if="column.dataIndex === 'difficulty'">
              <span class="difficulty" :class="'difficulty-' + getDifficultyClass(record.difficulty)">
                {{ record.difficulty || '简单' }}
              </span>
              </template>

              <template v-else-if="column.dataIndex === 'actions'">
                <div class="recipe-actions-list">
                  <a-button type="text" size="small" @click.stop="handleViewRecipe(record.id)">
                    <eye-outlined/>
                    查看
                  </a-button>
                  <a-button type="text" size="small" @click.stop="handleEditRecipe(record.id)">
                    <edit-outlined/>
                    编辑
                  </a-button>
                  <a-button type="text" size="small" class="delete-btn-list"
                            @click.stop="handleDeleteRecipe(record.id)">
                    <delete-outlined/>
                    删除
                  </a-button>
                </div>
              </template>
            </template>
          </a-table>
        </div>
      </transition>

    </div>

    <!-- 分页区域 -->
    <div class="pagination-section">
      <a-pagination
          v-model:current="currentPage"
          :total="totalRecipes"
          :pageSize="pageSize"
          show-quick-jumper
          @change="handlePageChange"
      />
    </div>

    <!-- 删除确认对话框 -->
    <a-modal
        v-model:visible="deleteModalVisible"
        title="删除菜谱"
        okText="确认删除"
        cancelText="取消"
        :okButtonProps="{ danger: true }"
        @ok="confirmDelete"
    >
      <p>确定要删除这个菜谱吗？此操作不可恢复。</p>
    </a-modal>
  </div>

  <!-- 应季菜谱规划模态框 -->
  <a-modal
      v-model:visible="seasonalPlanningVisible"
      title="应季菜谱规划"
      width="700px"
      :footer="null"
  >
    <div class="seasonal-container">
      <div class="season-tabs">
        <a-tabs default-active-key="spring">
          <a-tab-pane key="spring" tab="春季">
            <div class="season-info">
              <div class="season-header">
                <div class="season-icon">🌱</div>
                <div class="season-title">
                  <h3>春季当季食材</h3>
                  <p>3月-5月适合的新鲜食材和菜谱推荐</p>
                </div>
              </div>

              <div class="ingredients-section">
                <h4>当季食材</h4>
                <div class="ingredient-tags">
                  <a-tag color="green">春笋</a-tag>
                  <a-tag color="green">菠菜</a-tag>
                  <a-tag color="green">香椿</a-tag>
                  <a-tag color="green">荠菜</a-tag>
                  <a-tag color="green">豌豆</a-tag>
                  <a-tag color="green">茭白</a-tag>
                  <a-tag color="green">芦笋</a-tag>
                  <a-tag color="green">韭菜</a-tag>
                </div>
              </div>

              <div class="recipe-recommendation">
                <h4>推荐菜谱</h4>
                <div class="seasonal-recipes">
                  <div v-for="recipe in springRecipes" :key="recipe.id" class="seasonal-recipe-card">
                    <div class="recipe-thumbnail" :style="{ backgroundImage: `url(${recipe.imageUrl})` }"></div>
                    <div class="recipe-info">
                      <div class="recipe-name">{{ recipe.title }}</div>
                      <div class="recipe-tags">
                        <a-tag v-for="tag in recipe.tags" :key="tag" :color="getTagColor(tag)">{{ tag }}</a-tag>
                      </div>
                    </div>
                    <a-button type="link" @click="addToMyRecipes(recipe)">
                      <plus-outlined /> 添加到我的菜谱
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>

          <a-tab-pane key="summer" tab="夏季">
            <!-- 夏季内容，结构类似 -->
          </a-tab-pane>

          <a-tab-pane key="autumn" tab="秋季">
            <!-- 秋季内容，结构类似 -->
          </a-tab-pane>

          <a-tab-pane key="winter" tab="冬季">
            <!-- 冬季内容，结构类似 -->
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <div class="modal-footer">
      <a-button @click="seasonalPlanningVisible = false">关闭</a-button>
    </div>
  </a-modal>

  <!-- 营养分析报告模态框 -->
  <a-modal
      v-model:visible="nutritionalAnalysisVisible"
      title="营养分析报告"
      width="800px"
      :footer="null"
  >
    <div class="nutritional-container">
      <div class="analysis-header">
        <div class="analysis-period">
          <span class="period-label">分析周期：</span>
          <a-radio-group v-model:value="analysisPeriod" button-style="solid">
            <a-radio-button value="week">本周</a-radio-button>
            <a-radio-button value="month">本月</a-radio-button>
            <a-radio-button value="3months">近三个月</a-radio-button>
          </a-radio-group>
        </div>
        <a-button type="primary" @click="generateReport">
          <pie-chart-outlined /> 生成报告
        </a-button>
      </div>

      <a-spin :spinning="reportLoading">
        <div class="analysis-content">
          <div class="nutrition-overview">
            <h3>营养摄入概览</h3>
            <div class="nutrition-charts">
              <div class="chart-container">
                <h4>主要营养素分布</h4>
                <div class="chart-placeholder" ref="macronutrientChart"></div>
              </div>
              <div class="chart-container">
                <h4>每周营养素趋势</h4>
                <div class="chart-placeholder" ref="nutrientTrendChart"></div>
              </div>
            </div>
          </div>

          <a-divider />

          <div class="nutrition-details">
            <h3>详细营养素摄入</h3>
            <a-table
                :dataSource="nutritionData"
                :columns="nutritionColumns"
                :pagination="false"
                size="small"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'progress'">
                  <div class="progress-cell">
                    <a-progress
                        :percent="record.percentage"
                        :status="record.percentage >= 100 ? 'success' : 'active'"
                        :stroke-color="record.percentage >= 100 ? '#52c41a' : (record.percentage < 60 ? '#faad14' : '#1890ff')"
                    />
                  </div>
                </template>
              </template>
            </a-table>
          </div>

          <a-divider />

          <div class="nutrition-recommendations">
            <h3>个性化建议</h3>
            <a-alert
                v-for="(rec, index) in nutritionRecommendations"
                :key="index"
                :type="rec.type"
                :message="rec.title"
                :description="rec.description"
                class="recommendation-alert"
                show-icon
            />
          </div>
        </div>
      </a-spin>
    </div>

    <div class="modal-footer">
      <a-button @click="exportReport" style="margin-right: 8px;">
        <download-outlined /> 导出报告
      </a-button>
      <a-button @click="nutritionalAnalysisVisible = false">关闭</a-button>
    </div>
  </a-modal>

  <!-- 收藏夹管理模态框 -->
  <a-modal
      v-model:visible="favoritesModalVisible"
      title="我的收藏夹"
      width="800px"
      :footer="null"
  >
    <div class="favorites-container">
      <div class="favorites-header">
        <a-input-search
            placeholder="搜索收藏..."
            style="width: 250px"
            @search="searchFavorites"
        />
        <div class="favorites-view-toggle">
          <a-radio-group v-model:value="favoritesView" button-style="solid">
            <a-radio-button value="all">
              <appstore-outlined /> 全部
            </a-radio-button>
            <a-radio-button value="collections">
              <folder-outlined /> 收藏集
            </a-radio-button>
          </a-radio-group>
        </div>
      </div>

      <div class="favorites-content">
        <!-- 收藏集视图 -->
        <div v-if="favoritesView === 'collections'" class="collections-view">
          <div class="collections-grid">
            <div v-for="collection in favoriteCollections" :key="collection.id" class="collection-card">
              <div class="collection-cover" :style="{ backgroundImage: `url(${collection.coverUrl})` }">
                <div class="collection-count">{{ collection.recipeCount }}个菜谱</div>
              </div>
              <div class="collection-info">
                <div class="collection-title">{{ collection.name }}</div>
                <div class="collection-desc">{{ collection.description }}</div>
              </div>
              <div class="collection-actions">
                <a-button type="text" @click="viewCollection(collection.id)">
                  <eye-outlined /> 查看
                </a-button>
                <a-button type="text" @click="editCollection(collection.id)">
                  <edit-outlined /> 编辑
                </a-button>
                <a-button type="text" danger @click="deleteCollection(collection.id)">
                  <delete-outlined /> 删除
                </a-button>
              </div>
            </div>

            <div class="add-collection-card" @click="createFavoriteCollection">
              <plus-outlined />
              <div>新建收藏集</div>
            </div>
          </div>
        </div>

        <!-- 全部收藏视图 -->
        <div v-else class="all-favorites-view">
          <a-list
              :dataSource="filteredFavorites"
              :grid="{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <div class="favorite-recipe-card">
                  <div class="favorite-image" :style="{ backgroundImage: `url(${item.imageUrl})` }">
                    <div class="favorite-actions">
                      <a-dropdown>
                        <template #overlay>
                          <a-menu>
                            <a-menu-item @click="addToCollection(item.id)">
                              <folder-add-outlined /> 添加到收藏集
                            </a-menu-item>
                            <a-menu-item @click="removeFromFavorites(item.id)">
                              <delete-outlined /> 取消收藏
                            </a-menu-item>
                          </a-menu>
                        </template>
                        <a-button type="text" class="action-btn">
                          <more-outlined />
                        </a-button>
                      </a-dropdown>
                    </div>
                  </div>
                  <div class="favorite-info" @click="handleViewRecipe(item.id)">
                    <div class="favorite-title">{{ item.title }}</div>
                    <div class="favorite-tags">
                      <a-tag v-for="tag in item.tags" :key="tag" :color="getTagColor(tag)">{{ tag }}</a-tag>
                    </div>
                    <div class="favorite-meta">
                    <span class="meta-item">
                      <clock-circle-outlined/> 收藏于: {{ formatDate(item.favoriteDate) }}
                    </span>
                    </div>
                  </div>
                </div>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <a-button @click="favoritesModalVisible = false">关闭</a-button>
    </div>
  </a-modal>


  <!-- 菜谱偏好设置模态框 -->
  <a-modal
      v-model:visible="preferencesModalVisible"
      title="菜谱偏好设置"
      width="600px"
      :footer="null"
  >
    <div class="preferences-container">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="显示偏好">
          <div class="pref-section">
            <div class="pref-item">
              <div class="pref-label">默认视图模式</div>
              <a-radio-group v-model:value="viewMode">
                <a-radio value="grid">卡片视图</a-radio>
                <a-radio value="list">列表视图</a-radio>
              </a-radio-group>
            </div>

            <div class="pref-item">
              <div class="pref-label">默认排序方式</div>
              <a-select v-model:value="sortBy" style="width: 200px">
                <a-select-option value="latest">最近添加</a-select-option>
                <a-select-option value="name">名称</a-select-option>
                <a-select-option value="cookCount">烹饪次数</a-select-option>
                <a-select-option value="lastCooked">最近烹饪</a-select-option>
              </a-select>
            </div>

            <div class="pref-item">
              <div class="pref-label">每页显示数量</div>
              <a-slider
                  v-model:value="pageSize"
                  :min="4"
                  :max="24"
                  :step="4"
                  :marks="{ 4: '4', 8: '8', 12: '12', 16: '16', 20: '20', 24: '24' }"
              />
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="2" tab="饮食偏好">
          <div class="pref-section">
            <div class="pref-item">
              <div class="pref-label">饮食习惯</div>
              <a-checkbox-group v-model:value="dietaryPreferences">
                <a-row>
                  <a-col :span="12">
                    <a-checkbox value="vegetarian">素食主义</a-checkbox>
                  </a-col>
                  <a-col :span="12">
                    <a-checkbox value="vegan">纯素食主义</a-checkbox>
                  </a-col>
                  <a-col :span="12">
                    <a-checkbox value="low-carb">低碳水</a-checkbox>
                  </a-col>
                  <a-col :span="12">
                    <a-checkbox value="gluten-free">无麸质</a-checkbox>
                  </a-col>
                  <a-col :span="12">
                    <a-checkbox value="dairy-free">无乳制品</a-checkbox>
                  </a-col>
                  <a-col :span="12">
                    <a-checkbox value="keto">生酮饮食</a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </div>

            <div class="pref-item">
              <div class="pref-label">过敏原</div>
              <a-select
                  v-model:value="allergens"
                  mode="multiple"
                  placeholder="选择需要避免的食材"
                  style="width: 100%"
              >
                <a-select-option value="peanuts">花生</a-select-option>
                <a-select-option value="tree-nuts">坚果</a-select-option>
                <a-select-option value="dairy">乳制品</a-select-option>
                <a-select-option value="eggs">鸡蛋</a-select-option>
                <a-select-option value="seafood">海鲜</a-select-option>
                <a-select-option value="shellfish">贝类</a-select-option>
                <a-select-option value="wheat">小麦</a-select-option>
                <a-select-option value="soy">大豆</a-select-option>
              </a-select>
            </div>

            <div class="pref-item">
              <div class="pref-label">喜爱的口味</div>
              <a-rate
                  v-model:value="spicyLevel"
                  :tooltips="['不辣', '微辣', '中辣', '辣', '特辣']"
                  :character="h(FireOutlined)"
              />
              <div class="pref-sub-label">辣度偏好</div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="3" tab="通知设置">
          <div class="pref-section">
            <div class="pref-item">
              <div class="pref-label">提醒设置</div>
              <a-list size="small" bordered>
                <a-list-item>
                  <div class="notification-item">
                    <span>新菜谱推荐</span>
                    <a-switch v-model:checked="notifications.newRecipes" />
                  </div>
                </a-list-item>
                <a-list-item>
                  <div class="notification-item">
                    <span>应季食材提醒</span>
                    <a-switch v-model:checked="notifications.seasonalIngredients" />
                  </div>
                </a-list-item>
                <a-list-item>
                  <div class="notification-item">
                    <span>烹饪计划提醒</span>
                    <a-switch v-model:checked="notifications.cookingPlans" />
                  </div>
                </a-list-item>
              </a-list>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>

    <div class="modal-footer">
      <a-button type="primary" @click="savePreferences" style="margin-right: 8px;">
        保存设置
      </a-button>
      <a-button @click="preferencesModalVisible = false">取消</a-button>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import {useRouter} from 'vue-router'
import {
  AppstoreOutlined,
  BarsOutlined,
  DownOutlined,
  SelectOutlined,
  EditOutlined,
  DeleteOutlined,
  FireOutlined,
  FireFilled,
  ClockCircleOutlined,
  CoffeeOutlined,
  TrophyOutlined,
  EyeOutlined,
  PlusOutlined,
  DownloadOutlined,
  FolderOutlined,
  FolderAddOutlined,
  MoreOutlined,
} from '@ant-design/icons-vue'
import { h } from 'vue';
import {Empty, message} from 'ant-design-vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 路由跳转
const router = useRouter()

// 搜索和筛选状态
const searchText = ref('')
const currentCategory = ref('all')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = ref(8)
const deleteModalVisible = ref(false)
const recipeToDelete = ref(null)

// 添加状态变量
const seasonalPlanningVisible = ref(false)
const nutritionalAnalysisVisible = ref(false)
const favoritesModalVisible = ref(false)
const preferencesModalVisible = ref(false)

// 季节性菜谱规划
const handleSeasonalPlanning = () => {
  seasonalPlanningVisible.value = true
}

// 营养分析报告
const handleNutritionalAnalysis = () => {
  nutritionalAnalysisVisible.value = true
}

// 管理收藏夹
const handleManageFavorites = () => {
  favoritesModalVisible.value = true
}

// 菜谱偏好设置
const handlePreferences = () => {
  preferencesModalVisible.value = true
}

// 视图模式切换
const viewMode = ref('grid')

// 列表视图的表格列定义
const columns = [
  {
    title: '图片',
    dataIndex: 'image',
    width: 100,
    align: 'center'
  },
  {
    title: '菜谱名称',
    dataIndex: 'title',
    width: 300
  },
  {
    title: '烹饪次数',
    dataIndex: 'cookCount',
    width: 120,
    align: 'center'
  },
  {
    title: '最近烹饪',
    dataIndex: 'lastCooked',
    width: 150,
    align: 'center'
  },
  {
    title: '难度',
    dataIndex: 'difficulty',
    width: 100,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'actions',
    align: 'center'
  }
]

// 菜谱数据（模拟）
const recipes = ref([
  {
    id: 1,
    title: '蒜蓉西兰花',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    tags: ['素食', '快手菜'],
    cookCount: 12,
    lastCooked: '2024-01-20',
    difficulty: '简单',
    category: 'vegetarian'
  },
  {
    id: 2,
    title: '番茄炒蛋',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    tags: ['快手菜', '家常菜'],
    cookCount: 18,
    lastCooked: '2024-01-22',
    difficulty: '简单',
    category: 'fast'
  },
  {
    id: 3,
    title: '清蒸鱼',
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2',
    tags: ['晚餐', '家常菜'],
    cookCount: 5,
    lastCooked: '2024-01-25',
    difficulty: '适中',
    category: 'dinner'
  },
  {
    id: 4,
    title: '红烧肉',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    tags: ['晚餐', '家常菜'],
    cookCount: 8,
    lastCooked: '2024-01-15',
    difficulty: '困难',
    category: 'dinner'
  },
  {
    id: 5,
    title: '鸡蛋煎饼',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    tags: ['早餐', '快手菜'],
    cookCount: 14,
    lastCooked: '2024-01-27',
    difficulty: '简单',
    category: 'breakfast'
  },
  {
    id: 6,
    title: '沙拉三明治',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
    tags: ['早餐', '午餐', '素食'],
    cookCount: 6,
    lastCooked: '2024-01-18',
    difficulty: '简单',
    category: 'breakfast'
  }
])


// 计算属性：过滤后的菜谱
const filteredRecipes = computed(() => {
  let result = [...recipes.value]

  // 分类过滤
  if (currentCategory.value !== 'all') {
    result = result.filter(recipe =>
        recipe.category === currentCategory.value ||
        recipe.tags.some(tag => {
          if (currentCategory.value === 'breakfast') return tag === '早餐'
          if (currentCategory.value === 'lunch') return tag === '午餐'
          if (currentCategory.value === 'dinner') return tag === '晚餐'
          if (currentCategory.value === 'fast') return tag === '快手菜'
          if (currentCategory.value === 'vegetarian') return tag === '素食'
          if (currentCategory.value === 'family') return tag === '家常菜'
          return false
        })
    )
  }

  // 搜索过滤
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase()
    result = result.filter(recipe =>
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  // 排序
  result.sort((a, b) => {
    if (sortBy.value === 'latest') {
      return b.id - a.id // 假设id越大表示越新添加
    } else if (sortBy.value === 'name') {
      return a.title.localeCompare(b.title, 'zh-CN')
    } else if (sortBy.value === 'cookCount') {
      return b.cookCount - a.cookCount
    } else if (sortBy.value === 'lastCooked') {
      return new Date(b.lastCooked).getTime() - new Date(a.lastCooked).getTime()
    }
    return 0
  })

  return result
})

// 统计信息计算
const totalRecipes = computed(() => recipes.value.length)
const newRecipesThisMonth = computed(() => {
  // 假设id越大越新，这里简单返回最近的几个菜谱
  return Math.min(3, recipes.value.length)
})
const mostCookedName = computed(() => {
  const sorted = [...recipes.value].sort((a, b) => b.cookCount - a.cookCount)
  return sorted.length > 0 ? sorted[0].title : '无'
})
const lastCookedName = computed(() => {
  const sorted = [...recipes.value].sort((a, b) =>
      new Date(b.lastCooked).getTime() - new Date(a.lastCooked).getTime()
  )
  return sorted.length > 0 ? sorted[0].title : '无'
})

// 方法：处理搜索
const handleSearch = (value: any) => {
  searchText.value = value
  currentPage.value = 1 // 重置到第一页
}

// 方法：处理排序变化
const handleSortChange = (value: any) => {
  sortBy.value = value
}

// 方法：处理分页变化
const handlePageChange = (page: any) => {
  currentPage.value = page
}

// 方法：添加新菜谱
const handleAddRecipe = () => {
  router.push('/recipes/add')
}

// 方法：查看菜谱详情
const handleViewRecipe = (id: any) => {
  router.push(`/recipes/${id}`)
}

// 方法：编辑菜谱
const handleEditRecipe = (id: any) => {
  router.push(`/recipes/${id}/edit`)
}

// 方法：删除菜谱
const handleDeleteRecipe = (id: any) => {
  recipeToDelete.value = id
  deleteModalVisible.value = true
}

// 方法：确认删除
const confirmDelete = () => {
  if (recipeToDelete.value) {
    // 模拟删除操作
    recipes.value = recipes.value.filter(recipe => recipe.id !== recipeToDelete.value)
    message.success('菜谱已成功删除')
    recipeToDelete.value = null
    deleteModalVisible.value = false
  }
}

// 工具方法：格式化日期
const formatDate = (dateString: any) => {
  return dayjs(dateString).fromNow()
}

// 批量管理
const handleBatchManage = () => {
  // 批量管理的逻辑
  console.log('批量管理')
}


// 工具方法：获取标签颜色
const getTagColor = (tag: any) => {
  const tagColors = {
    '早餐': 'blue',
    '午餐': 'green',
    '晚餐': 'purple',
    '快手菜': 'orange',
    '素食': 'green',
    '家常菜': 'cyan'
  }
  return tagColors[tag] || 'default'
}

// 工具方法：获取难度等级样式
const getDifficultyClass = (difficulty: any) => {
  if (difficulty === '简单') return 'easy'
  if (difficulty === '适中') return 'medium'
  if (difficulty === '困难') return 'hard'
  return 'easy'
}

// 应季菜谱规划数据
const springRecipes = ref([
  {
    id: 101,
    title: '春笋炒肉',
    imageUrl: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f',
    tags: ['春季', '家常菜']
  },
  {
    id: 102,
    title: '韭菜炒鸡蛋',
    imageUrl: 'https://images.unsplash.com/photo-1551443874-e8d6a8456b59',
    tags: ['春季', '快手菜']
  },
  {
    id: 103,
    title: '香椿豆腐',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    tags: ['春季', '素食']
  },
  {
    id: 104,
    title: '荠菜馄饨',
    imageUrl: 'https://images.unsplash.com/photo-1500305614571-ae5b6592e65d',
    tags: ['春季', '主食']
  }
])

// 添加应季菜谱到我的菜谱
const addToMyRecipes = (recipe) => {
  // 检查菜谱是否已存在
  const existingRecipe = recipes.value.find(r => r.id === recipe.id)
  if (existingRecipe) {
    message.info(`菜谱 "${recipe.title}" 已在您的菜谱列表中`)
    return
  }

  // 添加菜谱
  const newRecipe = {
    ...recipe,
    cookCount: 0,
    lastCooked: null,
    difficulty: '简单',
    category: 'seasonal'
  }

  recipes.value.push(newRecipe)
  message.success(`菜谱 "${recipe.title}" 已添加到您的菜谱列表`)
}

// 营养分析报告数据
const analysisPeriod = ref('week')
const reportLoading = ref(false)
const nutritionData = ref([
  {
    key: '1',
    nutrient: '蛋白质',
    current: '56g',
    target: '60g',
    percentage: 93
  },
  {
    key: '2',
    nutrient: '脂肪',
    current: '65g',
    target: '70g',
    percentage: 93
  },
  {
    key: '3',
    nutrient: '碳水化合物',
    current: '320g',
    target: '300g',
    percentage: 106
  },
  {
    key: '4',
    nutrient: '纤维素',
    current: '18g',
    target: '25g',
    percentage: 72
  },
  {
    key: '5',
    nutrient: '钙',
    current: '600mg',
    target: '1000mg',
    percentage: 60
  },
  {
    key: '6',
    nutrient: '铁',
    current: '12mg',
    target: '15mg',
    percentage: 80
  }
])

const nutritionColumns = [
  {
    title: '营养素',
    dataIndex: 'nutrient',
    key: 'nutrient'
  },
  {
    title: '当前摄入',
    dataIndex: 'current',
    key: 'current'
  },
  {
    title: '推荐摄入',
    dataIndex: 'target',
    key: 'target'
  },
  {
    title: '达成率',
    dataIndex: 'progress',
    key: 'progress'
  }
]

const nutritionRecommendations = ref([
  {
    type: 'warning',
    title: '钙摄入不足',
    description: '您的钙摄入仅达到推荐量的60%。建议增加乳制品、豆制品或深绿色蔬菜的摄入。'
  },
  {
    type: 'info',
    title: '碳水略微超标',
    description: '您的碳水摄入略高于推荐量。可以考虑适当减少精制谷物，增加全谷物的比例。'
  },
  {
    type: 'success',
    title: '蛋白质摄入良好',
    description: '您的蛋白质摄入接近推荐量，保持良好的饮食习惯。'
  }
])

// 生成报告
const generateReport = () => {
  reportLoading.value = true

  // 模拟数据加载
  setTimeout(() => {
    reportLoading.value = false
    message.success(`已生成${analysisPeriod.value === 'week' ? '本周' : analysisPeriod.value === 'month' ? '本月' : '近三个月'}的营养分析报告`)
  }, 1500)
}

// 导出报告
const exportReport = () => {
  message.success('报告已导出，请查看下载文件夹')
}


// 收藏夹数据
const favoritesView = ref('all')
const favoriteCollections = ref([
  {
    id: 1,
    name: '家常菜合集',
    description: '收集家里常做的菜谱，方便快速查找',
    coverUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    recipeCount: 8
  },
  {
    id: 2,
    name: '健康低脂',
    description: '低热量、高蛋白的健康菜谱集合',
    coverUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    recipeCount: 5
  },
  {
    id: 3,
    name: '周末派对',
    description: '适合招待朋友的菜谱收藏',
    coverUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    recipeCount: 6
  }
])

const filteredFavorites = ref([
  {
    id: 1,
    title: '蒜蓉西兰花',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    tags: ['素食', '快手菜'],
    favoriteDate: '2024-02-15'
  },
  {
    id: 2,
    title: '番茄炒蛋',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    tags: ['快手菜', '家常菜'],
    favoriteDate: '2024-02-10'
  },
  {
    id: 3,
    title: '清蒸鱼',
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2',
    tags: ['晚餐', '家常菜'],
    favoriteDate: '2024-02-05'
  }
])

// 搜索收藏
const searchFavorites = (value) => {
  console.log('搜索收藏', value)
  // 实现搜索逻辑
}

// 查看收藏集
const viewCollection = (id) => {
  console.log('查看收藏集', id)
  // 实现查看收藏集逻辑
}

// 编辑收藏集
const editCollection = (id) => {
  console.log('编辑收藏集', id)
  // 实现编辑收藏集逻辑
}

// 删除收藏集
const deleteCollection = (id) => {
  console.log('删除收藏集', id)
  // 实现删除收藏集逻辑
}

// 创建收藏集
const createFavoriteCollection = () => {
  console.log('创建收藏集')
  // 实现创建收藏集逻辑
}

// 添加到收藏集
const addToCollection = (id) => {
  console.log('添加到收藏集', id)
  // 实现添加到收藏集逻辑
}

// 从收藏中移除
const removeFromFavorites = (id) => {
  console.log('从收藏中移除', id)
  // 实现从收藏中移除逻辑
}

// 偏好设置数据
const dietaryPreferences = ref(['vegetarian'])
const allergens = ref(['peanuts'])
const spicyLevel = ref(3)
const notifications = ref({
  newRecipes: true,
  seasonalIngredients: true,
  cookingPlans: false
})

// 保存偏好设置
const savePreferences = () => {
  message.success('偏好设置已保存')
  preferencesModalVisible.value = false
}

// 生命周期钩子
onMounted(() => {
  // 可以在这里获取菜谱数据
})
</script>

<style scoped>
.my-recipes-container {
  padding: 24px 16px;
  background: #f5f5f7;
  min-height: calc(100vh - 64px);
}

/* 页面标题区域 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

.page-description {
  color: rgba(0, 0, 0, 0.45);
  margin: 8px 0 0 0;
}

.action-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.organize-btn {
  border-color: #fa8c16;
  color: #fa8c16;
}

.organize-btn:hover {
  color: #fa9d31;
  border-color: #fa9d31;
}

/* 视图切换按钮组样式 */
.view-mode-toggle {
  margin-left: 8px;
  border: none !important;
  outline: none !important;
}

.view-mode-toggle :deep(.ant-radio-button-wrapper) {
  border: 1px solid #d9d9d9 !important;
  color: rgba(0, 0, 0, 0.65);
  border-radius: 0;
  outline: none !important;
  box-shadow: none !important;
}

/* 移除按钮之间的分隔线 */
.view-mode-toggle :deep(.ant-radio-button-wrapper:before) {
  display: none !important;
}

.view-mode-toggle :deep(.ant-radio-button-wrapper:first-child) {
  border-top-left-radius: 4px !important;
  border-bottom-left-radius: 4px !important;
}

.view-mode-toggle :deep(.ant-radio-button-wrapper:last-child) {
  border-top-right-radius: 4px !important;
  border-bottom-right-radius: 4px !important;
}

.view-mode-toggle :deep(.ant-radio-button-wrapper-checked) {
  background: #fef6e8 !important;
  color: #fa8c16 !important;
  border-color: #fa8c16 !important;
  box-shadow: none !important;
  outline: none !important;
  z-index: 1;
}

.view-mode-toggle :deep(.ant-radio-button-wrapper:hover) {
  color: #fa8c16 !important;
  border-color: #fa8c16 !important;
}

.batch-btn {
  border-color: #d9d9d9;
}

.batch-btn:hover {
  color: #fa8c16;
  border-color: #fa8c16;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-section {
    margin-top: 16px;
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 576px) {
  .action-section {
    flex-wrap: wrap;
    gap: 8px;
  }

  .view-mode-toggle {
    margin-left: 0;
    margin-top: 8px;
  }
}

/* 搜索和筛选区域 */
.filter-section {
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-label, .sort-label {
  color: rgba(0, 0, 0, 0.65);
  margin-right: 8px;
}

/* 自定义Radio按钮组样式 */
.custom-radio-group :deep(.ant-radio-button-wrapper) {
  border: none;
  background: #f0f0f0;
  color: rgba(0, 0, 0, 0.65);
  margin-right: 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.custom-radio-group :deep(.ant-radio-button-wrapper:before) {
  display: none;
}

.custom-radio-group :deep(.ant-radio-button-wrapper-checked) {
  background: #fef6e8 !important;
  color: #fa8c16 !important;
  font-weight: normal;
  box-shadow: 0 2px 6px rgba(250, 140, 22, 0.12);
}

.custom-radio-group :deep(.ant-radio-button-wrapper:hover) {
  color: #fa8c16;
  background: #fff5e6;
}

/* 统计卡片区域 */
.statistics-section {
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-card :deep(.ant-card-head) {
  background-color: #fef6e8;
  border-bottom: none;
}

.stat-card :deep(.ant-card-head-title) {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fa8c16;
}

.stat-icon {
  margin-right: 8px;
  color: #fa8c16;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  padding: 16px 0;
}



.empty-data {
  background: #fff;
  padding: 48px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.recipe-wrapper {
  transition: transform 0.3s;
}

.recipe-wrapper:hover {
  transform: translateY(-4px);
}

.recipe-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.recipe-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.recipe-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.recipe-card:hover .recipe-actions {
  opacity: 1;
}

.delete-btn:hover {
  color: #ff4d4f;
}

.cook-count {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.cook-count .anticon {
  margin-right: 4px;
  color: #fa8c16;
}

.recipe-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative; /* 添加相对定位以便于放置时间信息 */
  min-height: 120px; /* 确保卡片有足够的高度容纳所有内容 */
}

.recipe-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.4;
}


.recipe-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item .anticon {
  margin-right: 4px;
}

.difficulty {
  padding: 2px 8px;
  border-radius: 2px;
  text-align: center;
}

/* 列表视图样式 */
.recipe-list {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 自定义表格样式 */
.custom-table :deep(.ant-table-thead > tr > th) {
  background: #fef6e8;
  color: rgba(0, 0, 0, 0.85);
  border-bottom: 1px solid #f0f0f0;
}

/* 修复表格样式 - 移除蓝色边框线 */
.custom-table :deep(.ant-table-cell-fix-left),
.custom-table :deep(.ant-table-cell-fix-right) {
  background: #fff;
}

.custom-table :deep(.ant-table-tbody > tr.ant-table-row:hover > td) {
  background: #fff7e6;
}

.custom-table :deep(.ant-table-row-selected > td) {
  background: #fff7e6 !important;
}

.custom-table :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #f0f0f0;
}

/* 表格内菜谱缩略图 */
.recipe-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

/* 菜谱名称单元格 */
.recipe-title-cell {
  display: flex;
  flex-direction: column;
}

.recipe-title-text {
  font-weight: 500;
  margin-bottom: 8px;
}

/* 表格中的标签样式 */
.recipe-title-cell .recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 0;
}

/* 列表视图中的烹饪次数 */
.cook-count-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cook-count-cell .anticon {
  color: #fa8c16;
  margin-right: 4px;
}

/* 列表视图中的操作按钮 */
.recipe-actions-list {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.delete-btn-list:hover {
  color: #ff4d4f;
}

/* 分页区域 */
.pagination-section {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .recipe-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .recipe-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-area, .filter-area, .sort-area {
    width: 100%;
  }

  .custom-table {
    width: 100%;
    overflow-x: auto;
  }
}

@media (max-width: 576px) {
  .recipe-grid {
    grid-template-columns: 1fr;
  }

  .statistics-section .ant-row {
    display: flex;
    flex-direction: column;
  }

  .statistics-section .ant-col {
    margin-bottom: 16px;
  }

  .custom-radio-group {
    display: flex;
    overflow-x: auto;
    padding-bottom: 8px;
    margin-bottom: 8px;
    width: 100%;
  }

  .custom-radio-group::-webkit-scrollbar {
    display: none;
  }
}

/* 视图切换过渡动画 */
.view-transition-enter-active,
.view-transition-leave-active {
  transition: all 0.3s ease;
}

.view-transition-enter-from,
.view-transition-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 网格视图中的项目动画 */
.recipe-wrapper {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 确保表格行也有过渡动画 */
.animated-table-row {
  transition: all 0.3s ease;
}

/* 改进视图切换按钮的交互动画 */
.view-mode-toggle :deep(.ant-radio-button-wrapper) {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.view-mode-toggle :deep(.ant-radio-button-wrapper-checked) {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(250, 140, 22, 0.2) !important;
}

/* 卡片悬停时的优化动画 */
.recipe-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
  box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* 优化操作按钮显示动画 */
.recipe-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.recipe-card:hover .recipe-actions {
  opacity: 1;
  transform: translateY(0);
}

.action-btn {
  background: rgba(255, 255, 255, 0.8);
  color: rgba(0, 0, 0, 0.65);
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #fff;
  transform: scale(1.1);
}

/* 为表格行添加悬停动画 */
.custom-table :deep(.ant-table-tbody > tr.ant-table-row) {
  transition: background-color 0.3s ease;
}

.custom-table :deep(.ant-table-tbody > tr.ant-table-row:hover > td) {
  background: #fff7e6;
  transition: background-color 0.3s ease;
}

/* 优化分类按钮的交互动画 */
.custom-radio-group :deep(.ant-radio-button-wrapper) {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.custom-radio-group :deep(.ant-radio-button-wrapper-checked) {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(250, 140, 22, 0.2) !important;
}

/* 添加内容载入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.recipes-section {
  animation: fadeIn 0.5s ease-out;
}

/* 为统计卡片添加稍微错开的载入动画 */
.statistics-section .ant-col:nth-child(1) .stat-card {
  animation: fadeIn 0.3s ease-out;
}
.statistics-section .ant-col:nth-child(2) .stat-card {
  animation: fadeIn 0.4s ease-out;
}
.statistics-section .ant-col:nth-child(3) .stat-card {
  animation: fadeIn 0.5s ease-out;
}
.statistics-section .ant-col:nth-child(4) .stat-card {
  animation: fadeIn 0.6s ease-out;
}

/* 应季菜谱规划样式 */
.seasonal-container {
  max-height: 500px;
  overflow-y: auto;
}

.season-info {
  padding: 0 12px;
}

.season-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.season-icon {
  font-size: 28px;
  margin-right: 12px;
}

.season-title h3 {
  margin: 0;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.85);
}

.season-title p {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}

.ingredients-section {
  margin-bottom: 20px;
}

.ingredients-section h4 {
  margin-bottom: 12px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.ingredient-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recipe-recommendation h4 {
  margin-bottom: 12px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.seasonal-recipes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.seasonal-recipe-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.recipe-thumbnail {
  height: 120px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  margin-bottom: 12px;
}

.recipe-info {
  flex: 1;
}

.recipe-name {
  font-weight: 600;
  margin-bottom: 8px;
}

.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

/* 营养分析报告样式 */
.nutritional-container {
  max-height: 600px;
  overflow-y: auto;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nutrition-charts {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.chart-container {
  flex: 1;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.chart-container h4 {
  margin-top: 0;
  margin-bottom: 12px;
  text-align: center;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-radius: 4px;
}

.progress-cell {
  width: 200px;
}

.recommendation-alert {
  margin-bottom: 12px;
}

/* 收藏夹样式 */
.favorites-container {
  max-height: 600px;
  overflow-y: auto;
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.collections-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.collection-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.collection-cover {
  height: 120px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.collection-count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.collection-info {
  padding: 12px;
}

.collection-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.collection-desc {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.collection-actions {
  display: flex;
  border-top: 1px solid #f0f0f0;
  padding: 8px;
}

.collection-actions .ant-btn {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-collection-card {
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  cursor: pointer;
  transition: all 0.3s;
  color: rgba(0, 0, 0, 0.45);
}

.add-collection-card:hover {
  border-color: #fa8c16;
  color: #fa8c16;
}

.add-collection-card .anticon {
  font-size: 24px;
  margin-bottom: 8px;
}

.favorite-recipe-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s;
}

.favorite-recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.favorite-image {
  height: 140px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.favorite-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.favorite-image:hover .favorite-actions {
  opacity: 1;
}

.favorite-info {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.favorite-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.favorite-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.favorite-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

/* 偏好设置样式 */
.preferences-container {
  max-height: 500px;
  overflow-y: auto;
}

.pref-section {
  padding: 0 12px;
}

.pref-item {
  margin-bottom: 24px;
}

.pref-label {
  font-weight: 500;
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.85);
}

.pref-sub-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 4px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* 通用模态框底部按钮 */
.modal-footer {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}
</style>