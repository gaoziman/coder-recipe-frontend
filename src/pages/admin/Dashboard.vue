<template>
  <div class="admin-dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1>
          <span class="welcome-icon"></span>
          欢迎回来<span class="username">{{ userName }}</span>
        </h1>
        <p>
          <span class="clock-icon"></span>
          今天是 {{ formattedDate }} 星期{{ weekday }}
          <span class="time-container">
        {{ hours }}:{{ minutes }}:<span class="second-highlight">{{ seconds }}</span>
      </span>
          <span class="greeting-container">{{ greeting }}</span>
        </p>
      </div>
      <div class="welcome-actions">
        <a-button class="action-button" type="primary" @click="navigateToCreateRecipe">
          <template #icon>
            <plus-outlined/>
          </template>
          新增菜谱
        </a-button>
        <a-button class="action-button">
          <template #icon>
            <file-search-outlined/>
          </template>
          查看报表
        </a-button>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <a-row :gutter="[24, 24]" class="stats-row">
      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card recipe-card">
          <div class="stat-card-body">
            <div class="stat-card-icon">
              <appstore-outlined/>
            </div>
            <div class="stat-card-content">
              <div class="stat-label">菜谱总数</div>
              <div class="stat-value">{{ dashboardData.totalRecipes }}</div>
              <div class="stat-trend positive">
                <arrow-up-outlined/>
                <span>{{ dashboardData.recipeIncrease }}%</span>
              </div>
            </div>
          </div>
          <div class="stat-card-footer">
            <calendar-outlined/>
            <span>相比上周</span>
          </div>
        </div>
      </a-col>

      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card user-card">
          <div class="stat-card-body">
            <div class="stat-card-icon">
              <user-outlined/>
            </div>
            <div class="stat-card-content">
              <div class="stat-label">用户总数</div>
              <div class="stat-value">{{ dashboardData.totalUsers }}</div>
              <div class="stat-trend positive">
                <arrow-up-outlined/>
                <span>{{ dashboardData.userIncrease }}%</span>
              </div>
            </div>
          </div>
          <div class="stat-card-footer">
            <calendar-outlined/>
            <span>相比上周</span>
          </div>
        </div>
      </a-col>

      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card view-card">
          <div class="stat-card-body">
            <div class="stat-card-icon">
              <eye-outlined/>
            </div>
            <div class="stat-card-content">
              <div class="stat-label">总访问量</div>
              <div class="stat-value">{{ dashboardData.totalViews }}</div>
              <div class="stat-trend positive">
                <arrow-up-outlined/>
                <span>{{ dashboardData.viewIncrease }}%</span>
              </div>
            </div>
          </div>
          <div class="stat-card-footer">
            <calendar-outlined/>
            <span>相比上周</span>
          </div>
        </div>
      </a-col>

      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card ingredient-card">
          <div class="stat-card-body">
            <div class="stat-card-icon">
              <database-outlined/>
            </div>
            <div class="stat-card-content">
              <div class="stat-label">食材总数</div>
              <div class="stat-value">{{ dashboardData.totalIngredients }}</div>
              <div class="stat-trend positive">
                <arrow-up-outlined/>
                <span>{{ dashboardData.ingredientIncrease }}%</span>
              </div>
            </div>
          </div>
          <div class="stat-card-footer">
            <calendar-outlined/>
            <span>相比上周</span>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 图表区域 -->
    <a-row :gutter="[24, 24]" class="chart-row">
      <a-col :xs="24" :lg="16">
        <div class="chart-card">
          <div class="chart-card-header">
            <div class="chart-title">
              <h3>访问量趋势</h3>
              <p>过去7天的网站访问量统计</p>
            </div>
            <div class="chart-actions">
              <a-select v-model:value="visitPeriod" style="width: 120px">
                <a-select-option value="weekly">最近7天</a-select-option>
                <a-select-option value="monthly">最近30天</a-select-option>
                <a-select-option value="yearly">今年</a-select-option>
              </a-select>
            </div>
          </div>
          <div id="visitChart" class="chart-container"></div>
          <div class="chart-stats">
            <div class="chart-stat-item">
              <div class="chart-stat-value">8,500</div>
              <div class="chart-stat-label">最高访问量</div>
            </div>
            <div class="chart-stat-item">
              <div class="chart-stat-value">3,200</div>
              <div class="chart-stat-label">最低访问量</div>
            </div>
            <div class="chart-stat-item">
              <div class="chart-stat-value">5,728</div>
              <div class="chart-stat-label">日均访问量</div>
            </div>
          </div>
        </div>
      </a-col>

      <a-col :xs="24" :lg="8">
        <div class="chart-card">
          <div class="chart-card-header">
            <div class="chart-title">
              <h3>菜谱分类占比</h3>
              <p>各类菜谱的数量分布</p>
            </div>
          </div>
          <div id="categoryChart" class="chart-container"></div>
          <div class="category-legend">
            <div class="legend-item">
              <div class="legend-color" style="background-color: #5B8FF9;"></div>
              <div class="legend-text">家常菜 <span>420</span></div>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #61DDAA;"></div>
              <div class="legend-text">西餐 <span>180</span></div>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #F6BD16;"></div>
              <div class="legend-text">川菜 <span>280</span></div>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #FF6B3B;"></div>
              <div class="legend-text">粤菜 <span>220</span></div>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background-color: #78D3F8;"></div>
              <div class="legend-text">其他 <span>147</span></div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 热门内容和最新内容 -->
    <a-row :gutter="[24, 24]" class="content-row">
      <a-col :xs="24" :lg="12">
        <div class="content-card">
          <div class="content-card-header">
            <h3>热门菜谱排行</h3>
            <div class="recipe-tabs">
              <button
                  class="recipe-tab-button"
                  :class="{ active: popularPeriod === 'weekly' }"
                  @click="popularPeriod = 'weekly'">
                本周
              </button>
              <button
                  class="recipe-tab-button"
                  :class="{ active: popularPeriod === 'monthly' }"
                  @click="popularPeriod = 'monthly'">
                本月
              </button>
              <button
                  class="recipe-tab-button"
                  :class="{ active: popularPeriod === 'yearly' }"
                  @click="popularPeriod = 'yearly'">
                全年
              </button>
            </div>
          </div>
          <div class="popular-list">
            <div v-for="(item, index) in popularRecipes" :key="item.id" class="popular-item">
              <div class="popular-rank">{{ index + 1 }}</div>
              <div class="popular-image">
                <img :src="item.image || 'https://via.placeholder.com/40'" alt="菜谱图片"/>
              </div>
              <div class="popular-info">
                <div class="popular-title">{{ item.title }}</div>
                <div class="popular-meta">
                  <eye-outlined/>
                  {{ item.views }} 浏览
                </div>
              </div>
              <div class="popular-trend">
                <arrow-up-outlined style="color: #52C41A;"/>
                <span>{{ item.increase }}%</span>
              </div>
            </div>
          </div>
        </div>
      </a-col>

      <a-col :xs="24" :lg="12">
        <div class="content-card">
          <div class="content-card-header">
            <h3>最新菜谱</h3>
            <a-button type="link">查看全部</a-button>
          </div>
          <a-table
              :dataSource="latestRecipes"
              :columns="recipeColumns"
              :pagination="false"
              size="middle"
              class="latest-table"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'title'">
                <div class="table-title-cell">
                  <a-avatar shape="square" size="small" :src="record.image || 'https://via.placeholder.com/40'"/>
                  <a>{{ record.title }}</a>
                </div>
              </template>
              <template v-if="column.key === 'operation'">
                <div class="table-operation">
                  <a-button type="link" size="small">
                    <template #icon>
                      <eye-outlined/>
                    </template>
                    查看
                  </a-button>
                  <a-button type="link" size="small">
                    <template #icon>
                      <edit-outlined/>
                    </template>
                    编辑
                  </a-button>
                </div>
              </template>
              <template v-if="column.key === 'status'">
                <a-tag :color="record.status === 1 ? '#E8F7EF' : '#F5F0FF'"
                       :style="{color: record.status === 1 ? '#36A45E' : '#7759B2', borderColor: record.status === 1 ? '#C5EBD6' : '#E2D7F4'}">
                  {{ record.status === 1 ? '已发布' : '草稿' }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </div>
      </a-col>
    </a-row>

    <!-- 系统状态和快速行动区 -->
    <a-row :gutter="[24, 24]" class="status-row">
      <a-col :xs="24" :lg="16">
        <div class="status-card">
          <div class="status-card-header">
            <h3>系统状态</h3>
          </div>
          <div class="status-grid">
            <div class="status-item">
              <div class="status-icon healthy">
                <check-circle-outlined/>
              </div>
              <div class="status-info">
                <div class="status-title">服务器状态</div>
                <div class="status-desc">运行正常</div>
              </div>
            </div>
            <div class="status-item">
              <div class="status-icon healthy">
                <check-circle-outlined/>
              </div>
              <div class="status-info">
                <div class="status-title">数据库状态</div>
                <div class="status-desc">运行正常</div>
              </div>
            </div>
            <div class="status-item">
              <div class="status-icon healthy">
                <check-circle-outlined/>
              </div>
              <div class="status-info">
                <div class="status-title">存储空间</div>
                <div class="status-desc">76% 可用</div>
              </div>
            </div>
            <div class="status-item">
              <div class="status-icon healthy">
                <check-circle-outlined/>
              </div>
              <div class="status-info">
                <div class="status-title">CDN状态</div>
                <div class="status-desc">正常</div>
              </div>
            </div>
          </div>
        </div>
      </a-col>

      <a-col :xs="24" :lg="8">
        <div class="action-card">
          <div class="action-card-header">
            <h3>快速操作</h3>
          </div>
          <div class="action-buttons">
            <a-button class="quick-action-btn" type="primary">
              <template #icon>
                <file-add-outlined/>
              </template>
              新建菜谱
            </a-button>
            <a-button class="quick-action-btn">
              <template #icon>
                <user-add-outlined/>
              </template>
              添加用户
            </a-button>
            <a-button class="quick-action-btn">
              <template #icon>
                <database-outlined/>
              </template>
              添加食材
            </a-button>
            <a-button class="quick-action-btn">
              <template #icon>
                <setting-outlined/>
              </template>
              系统设置
            </a-button>
            <a-button class="quick-action-btn">
              <template #icon>
                <bar-chart-outlined/>
              </template>
              数据报表
            </a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>


<script setup lang="ts">
import {ref, reactive, onMounted, computed, onUnmounted} from 'vue'
import {message} from 'ant-design-vue'
import * as echarts from 'echarts'
import {
  AppstoreOutlined,
  UserOutlined,
  EyeOutlined,
  DatabaseOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  FileSearchOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  FileAddOutlined,
  UserAddOutlined,
  SettingOutlined,
  BarChartOutlined,
  EditOutlined,
  SendOutlined
} from '@ant-design/icons-vue'
import {useUserStore} from "@/stores/user";
import router from "@/router";

// 获取用户信息
const userStore = useUserStore()
const userName = computed(() => userStore.userInfo?.username || '管理员')

// 分离时分秒为独立的响应式变量，便于动态更新
const hours = ref('00')
const minutes = ref('00')
const seconds = ref('00')

// 动态时间处理
const currentTimeText = ref('')
let timeInterval: number | null = null

// 计算属性，分解日期和时间
const formattedDate = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  return `${year}年${month}月${day}日`
})

const weekday = computed(() => {
  return ['日', '一', '二', '三', '四', '五', '六'][new Date().getDay()]
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好！'
  else if (hour < 9) return '早上好！'
  else if (hour < 12) return '上午好！'
  else if (hour < 14) return '中午好！'
  else if (hour < 17) return '下午好！'
  else if (hour < 19) return '傍晚好！'
  else return '晚上好！'
})

// 格式化日期和时间
const updateTime = () => {
  const now = new Date()
  hours.value = String(now.getHours()).padStart(2, '0')
  minutes.value = String(now.getMinutes()).padStart(2, '0')
  seconds.value = String(now.getSeconds()).padStart(2, '0')
}

// 组件挂载和卸载时的处理
onMounted(() => {
  const visitChart = echarts.init(document.getElementById('visitChart'))
  visitChart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#f0f0f0',
      textStyle: {
        color: '#333'
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(240, 136, 76, 0.05)'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      },
      axisLabel: {
        color: '#999'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#999'
      },
      splitLine: {
        lineStyle: {
          color: '#f5f5f5'
        }
      }
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: [3200, 4500, 5800, 4900, 6000, 7200, 8500],
        itemStyle: {
          color: '#F0884C'
        },
        lineStyle: {
          width: 4
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(240, 136, 76, 0.4)'
              },
              {
                offset: 1,
                color: 'rgba(240, 136, 76, 0.05)'
              }
            ]
          }
        }
      }
    ]
  })
  // 立即更新一次时间
  updateTime()

  // 设置定时器，每分钟更新一次时间
  timeInterval = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  // 清除定时器
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
// 仪表盘数据
const dashboardData = ref({
  totalRecipes: 1247,
  recipeIncrease: 5.2,
  totalUsers: 8760,
  userIncrease: 12.8,
  totalViews: 45920,
  viewIncrease: 8.5,
  totalIngredients: 583,
  ingredientIncrease: 2.3
})

// 图表周期选择
const visitPeriod = ref('weekly')
const popularPeriod = ref('weekly')

// 热门菜谱数据
const popularRecipes = ref([
  {id: 1, title: '香煎三文鱼配蔬菜沙拉', views: 3526, increase: 32, image: 'https://via.placeholder.com/40'},
  {id: 2, title: '番茄牛腩汤', views: 2845, increase: 18, image: 'https://via.placeholder.com/40'},
  {id: 3, title: '黑椒牛排', views: 2356, increase: 15, image: 'https://via.placeholder.com/40'},
  {id: 4, title: '川味麻婆豆腐', views: 2041, increase: 12, image: 'https://via.placeholder.com/40'},
  {id: 5, title: '青椒土豆丝', views: 1896, increase: 8, image: 'https://via.placeholder.com/40'}
])

// 最新菜谱数据
const latestRecipes = ref([
  {
    id: 'r001',
    title: '香煎三文鱼配蔬菜沙拉',
    image: 'https://via.placeholder.com/40',
    author: '张厨师',
    createTime: '2023-05-28 14:30',
    views: 1253,
    status: 1
  },
  {
    id: 'r002',
    title: '番茄牛腩汤',
    image: 'https://via.placeholder.com/40',
    author: '美食达人',
    createTime: '2023-05-27 09:15',
    views: 876,
    status: 1
  },
  {
    id: 'r003',
    title: '黑椒牛排',
    image: 'https://via.placeholder.com/40',
    author: '西餐主厨',
    createTime: '2023-05-26 18:40',
    views: 1890,
    status: 1
  },
  {
    id: 'r004',
    title: '青椒土豆丝',
    image: 'https://via.placeholder.com/40',
    author: '家常菜爱好者',
    createTime: '2023-05-25 11:20',
    views: 623,
    status: 1
  },
  {
    id: 'r005',
    title: '川味麻婆豆腐',
    image: 'https://via.placeholder.com/40',
    author: '川菜师傅',
    createTime: '2023-05-24 16:05',
    views: 1420,
    status: 0
  }
])

// 表格列定义
const recipeColumns = [
  {
    title: '菜谱名称',
    key: 'title',
    width: '40%'
  },
  {
    title: '创建者',
    dataIndex: 'author',
    key: 'author'
  },
  {
    title: '状态',
    key: 'status'
  },
  {
    title: '操作',
    key: 'operation',
    width: 120
  }
]


// 导航到创建菜谱页面
const navigateToCreateRecipe = () => {
  // 检查用户是否已登录
  if (userStore.isLoggedIn) {
    // 用户已登录，直接导航到创建菜谱页面
    router.push({ name: 'CreateRecipe' })
  } else {
    // 用户未登录，记住当前要跳转的路径
    localStorage.setItem('redirectPath', '/create-recipe')

    // 触发登录弹窗显示
    window.dispatchEvent(new CustomEvent('show-login-modal'))
  }
}

// 初始化图表
onMounted(() => {
  // 初始化访问量趋势图
  const visitChart = echarts.init(document.getElementById('visitChart'))
  visitChart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#f0f0f0',
      textStyle: {
        color: '#333'
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(240, 136, 76, 0.05)'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      },
      axisLabel: {
        color: '#999'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#999'
      },
      splitLine: {
        lineStyle: {
          color: '#f5f5f5'
        }
      }
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: [3200, 4500, 5800, 4900, 6000, 7200, 8500],
        itemStyle: {
          color: '#F0884C'
        },
        lineStyle: {
          width: 4
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(240, 136, 76, 0.4)'
              },
              {
                offset: 1,
                color: 'rgba(240, 136, 76, 0.05)'
              }
            ]
          }
        }
      }
    ]
  })

  // 初始化菜谱分类占比图
  const categoryChart = echarts.init(document.getElementById('categoryChart'))
  categoryChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#f0f0f0',
      textStyle: {
        color: '#333'
      }
    },
    series: [
      {
        name: '分类占比',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        emphasis: {
          scaleSize: 10,
          focus: 'self'
        },
        data: [
          {value: 420, name: '家常菜', itemStyle: {color: '#5B8FF9'}},
          {value: 180, name: '西餐', itemStyle: {color: '#61DDAA'}},
          {value: 280, name: '川菜', itemStyle: {color: '#F6BD16'}},
          {value: 220, name: '粤菜', itemStyle: {color: '#FF6B3B'}},
          {value: 147, name: '其他', itemStyle: {color: '#78D3F8'}}
        ]
      }
    ]
  })

  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    visitChart.resize()
    categoryChart.resize()
  })
})
</script>

<style scoped>
.admin-dashboard {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* 欢迎区域样式 */
.welcome-section {
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 250, 245, 0.9));
  border-radius: 16px;
  padding: 28px 32px;
  box-shadow: 0 8px 24px rgba(240, 136, 76, 0.12), 0 2px 4px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(240, 136, 76, 0.1);
}

/* 添加装饰元素 */
.welcome-section::before {
  content: "";
  position: absolute;
  top: -30px;
  right: -30px;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, rgba(240, 136, 76, 0.2), rgba(255, 153, 102, 0.1));
  border-radius: 50%;
  z-index: 0;
}

.welcome-section::after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 30%;
  width: 180px;
  height: 10px;
  background: linear-gradient(90deg, rgba(240, 136, 76, 0.15), rgba(255, 153, 102, 0));
  border-radius: 50%;
  z-index: 0;
}


.greeting-container {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  background-color: rgba(240, 136, 76, 0.05);
  border-radius: 6px;
  font-weight: 500;
  color: #444;
}

.welcome-content {
  position: relative;
  z-index: 1;
}

.welcome-content h1 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-flex;
  align-items: center;
  padding-bottom: 8px;
}

.welcome-content h1::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg,
  rgba(240, 136, 76, 0.8) 0%,
  rgba(255, 153, 102, 0.4) 70%,
  rgba(255, 153, 102, 0) 100%);
  border-radius: 2px;
}

.username {
  position: relative;
  background: linear-gradient(135deg, #F0884C, #FF9966);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: 700;
  margin-left: 15px;
  padding: 0 4px;
}

/* 给用户名添加光效 */
.username::before {
  content: "";
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: radial-gradient(ellipse at center, rgba(240, 136, 76, 0.15) 0%, rgba(240, 136, 76, 0) 70%);
  border-radius: 6px;
  z-index: -1;
}

/* 装饰小图标 */
.welcome-icon {
  font-size: 22px;
  margin-right: 10px;
  color: #F0884C;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
}

.welcome-content p {
  font-size: 15px;
  color: #595959;
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  line-height: 1.6;
}

.clock-icon {
  color: #F0884C;
  margin-right: 6px;
  display: inline-flex;
  align-items: center;
}

.time-container {
  display: inline-flex;
  align-items: center;
  background-color: rgba(240, 136, 76, 0.08);
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 500;
  margin-right: 10px; /* 添加明显的右侧间距 */
  color: #444;
  margin-left: 10px;
}

.second-highlight {
  display: inline-block;
  color: #F0884C;
  font-weight: 700;
  min-width: 26px;
  text-align: center;
  animation: pulse-highlight 1s infinite;
}

/* 加强动画效果 */
@keyframes pulse-highlight {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.second-highlight {
  animation: pulse-highlight 1s infinite;
}

.welcome-actions {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 12px;
}

.action-button {
  height: 44px;
  border-radius: 10px;
  padding: 0 18px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1);
}

/* 主按钮样式增强 */
.action-button:first-child {
  background: linear-gradient(to right, #F0884C, #FF9966) !important;
  border: none !important;
}

/* 响应式处理 */
@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 24px;
  }

  .welcome-content h1 {
    font-size: 22px;
  }

  .welcome-content p {
    font-size: 14px;
  }
}

.welcome-actions {
  display: flex;
  gap: 12px;
}

.action-button {
  height: 40px;
  border-radius: 8px;
}

/* 数据卡片样式 */
.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.stat-card-body {
  padding: 20px;
  display: flex;
  flex: 1;
}

.stat-card-icon {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin-right: 16px;
  color: white;
}

.recipe-card .stat-card-icon {
  background: linear-gradient(135deg, #F0884C, #FF9966);
}

.user-card .stat-card-icon {
  background: linear-gradient(135deg, #FF5E62, #FF9966);
}

.view-card .stat-card-icon {
  background: linear-gradient(135deg, #36CFC9, #6EE7B7);
}

.ingredient-card .stat-card-icon {
  background: linear-gradient(135deg, #73D13D, #B7EB8F);
}

.stat-card-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  line-height: 1;
}

.stat-trend {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend.positive {
  color: #52C41A;
}

.stat-trend.negative {
  color: #F5222D;
}

.stat-card-footer {
  padding: 10px 20px;
  background-color: #fafafa;
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 图表卡片样式 */
.chart-row {
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.chart-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.chart-title h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.chart-title p {
  font-size: 13px;
  color: #999;
  margin: 0;
}

.chart-container {
  height: 300px;
  margin-bottom: 16px;
}

.chart-stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
}

.chart-stat-item {
  text-align: center;
}

.chart-stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.chart-stat-label {
  font-size: 13px;
  color: #999;
}

.category-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 120px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-text {
  font-size: 13px;
  color: #666;
  display: flex;
  justify-content: space-between;
  flex: 1;
}

.legend-text span {
  font-weight: 600;
  color: #333;
}

/* 内容卡片样式 */
.content-row {
  margin-bottom: 24px;
}

.content-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.content-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.content-card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.popular-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.popular-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s;
}

.popular-item:hover {
  background-color: #fafafa;
}

.popular-rank {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f5f5f5;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 12px;
}

.popular-item:nth-child(1) .popular-rank {
  background: #FFD700;
  color: white;
}

.popular-item:nth-child(2) .popular-rank {
  background: #C0C0C0;
  color: white;
}

.popular-item:nth-child(3) .popular-rank {
  background: #CD7F32;
  color: white;
}

.popular-image {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  margin-right: 12px;
}

.popular-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.popular-info {
  flex: 1;
}

.popular-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  font-weight: 500;
}

.popular-meta {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 4px;
}

.popular-trend {
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.latest-table :deep(.ant-table) {
  background: transparent;
}

.latest-table :deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
}

.table-title-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-title-cell a {
  color: #333;
}

.table-title-cell a:hover {
  color: #F0884C;
}

.table-operation {
  display: flex;
  gap: 8px;
}

/* 状态和快速操作区样式 */
.status-row {
  margin-bottom: 24px;
}

.status-card, .action-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.status-card-header, .action-card-header {
  margin-bottom: 16px;
}

.status-card-header h3, .action-card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: A 16px;
}

.status-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #fafafa;
}

.status-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
}

.status-icon.healthy {
  background: #F6FFED;
  color: #52C41A;
}

.status-icon.warning {
  background: #FFF7E6;
  color: #FAAD14;
}

.status-icon.error {
  background: #FFF1F0;
  color: #F5222D;
}

.status-info {
  flex: 1;
}

.status-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.status-desc {
  font-size: 13px;
  color: #999;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.quick-action-btn {
  height: 44px;
  border-radius: 8px;
  text-align: left;
  display: flex;
  align-items: center;
}

.quick-action-btn:first-child {
  grid-column: span 2;
  background: linear-gradient(to right, #F0884C, #FF9966);
  border: none;
  color: white;
}

/* 覆盖链接按钮颜色 */
:deep(.ant-btn-link) {
  color: #F0884C !important;
}

:deep(.ant-btn-link:hover) {
  color: #FF9966 !important;
}

/* 特定操作按钮样式 */
.operation-btn-view:deep(.ant-btn-link) {
  color: #F0884C !important;
}

.operation-btn-edit:deep(.ant-btn-link) {
  color: #5E72E4 !important;
}

.operation-btn-delete:deep(.ant-btn-link) {
  color: #FF5E62 !important;
}

/* 覆盖主按钮样式 */
:deep(.ant-btn-primary) {
  background-color: #F0884C !important;
  border-color: #F0884C !important;
}

:deep(.ant-btn-primary:hover) {
  background-color: #FF9966 !important;
  border-color: #FF9966 !important;
}


/* 只添加秒钟高亮样式，不修改原有布局 */
.time-wrapper {
  display: inline;
}

.second-highlight {
  display: inline;
  color: #F0884C;
  font-weight: 600;
  position: relative;
}

/* 可选：添加一个非常微妙的动画效果，不影响整体布局 */
@keyframes subtle-blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

.second-highlight {
  animation: subtle-blink 1s infinite;
}

/* 热门菜谱排行标签页样式优化 */
.recipe-tabs {
  display: flex;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(240, 136, 76, 0.1);
  border: 1px solid rgba(240, 136, 76, 0.1);
}

/* 单个标签按钮 */
.recipe-tab-button {
  flex: 1;
  padding: 8px 14px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: #666;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

/* 激活状态的标签 */
.recipe-tab-button.active {
  background: linear-gradient(to right, #F0884C, #FF9966);
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(240, 136, 76, 0.2);
}

/* 非激活标签悬浮效果 */
.recipe-tab-button:not(.active):hover {
  background-color: rgba(240, 136, 76, 0.05);
  color: #F0884C;
}

/* 全年标签特殊样式 */
.recipe-tab-button.yearly {
  color: #4D7CFF;
}
.recipe-tab-button.yearly.active {
  background: linear-gradient(to right, #4D7CFF, #6E9AFF);
}
.recipe-tab-button.yearly:not(.active):hover {
  background-color: rgba(77, 124, 255, 0.05);
  color: #4D7CFF;
}

/* 内容卡片头部样式优化 */
.content-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.content-card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 响应式调整 */
@media (max-width: 576px) {
  .content-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .recipe-tabs {
    width: 100%;
  }

  .recipe-tab-button {
    padding: 6px 12px;
    font-size: 13px;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }

  .quick-action-btn:first-child {
    grid-column: span 1;
  }
}
</style>