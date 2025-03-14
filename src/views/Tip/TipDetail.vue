<template>
  <div class="tip-detail-container">
    <!-- 页面标题区域 -->
    <div class="breadcrumb-nav">
      <a @click="goToHome">首页</a>
      <component :is="RightOutlined" class="separator" />
      <a @click="goToTipsList">烹饪小贴士</a>
      <component :is="RightOutlined" class="separator" />
      <span>{{ tip ? tip.title : '加载中...' }}</span>
    </div>

    <!-- 加载中状态 -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" :indicator="indicator" />
      <p>正在加载内容...</p>
    </div>

    <!-- 404状态 -->
    <div v-else-if="!tip" class="not-found">
      <a-result
          status="404"
          title="未找到该小贴士"
          sub-title="您访问的小贴士可能已被删除或不存在"
      >
        <template #extra>
          <a-button type="primary" @click="goToTipsList">
            返回小贴士列表
          </a-button>
        </template>
      </a-result>
    </div>

    <!-- 小贴士详情内容 -->
    <div v-else class="tip-detail-content">
      <!-- 标题区域 -->
      <div class="tip-header">
        <div class="tip-category-tag">
          <component :is="getCategoryIcon(tip?.category)" />
          <span>{{ tip?.category }}</span>
        </div>
        <h1 class="tip-title">{{ tip?.title }}</h1>
        <div class="tip-meta">
          <div class="tip-author">
            <component :is="UserOutlined" />
            <span>{{ tip?.author || '匿名用户' }}</span>
          </div>
          <div class="tip-date">
            <component :is="CalendarOutlined" />
            <span>{{ formatDate(tip?.publishDate) }}</span>
          </div>
          <div class="tip-likes">
            <component :is="HeartOutlined" />
            <span>{{ tip?.likes }} 人觉得有用</span>
          </div>
        </div>
      </div>

      <!-- 封面图区域 -->
      <div v-if="tip?.imageUrl" class="tip-cover">
        <img :src="tip.imageUrl" :alt="tip?.title" />
      </div>

      <!-- 正文内容区域 -->
      <div class="tip-content">
        <div class="tip-summary">
          <p>{{ tip?.description }}</p>
        </div>

        <div class="tip-sections" v-if="tip?.content">
          <div v-for="(section, index) in tip.content" :key="index" class="tip-section">
            <h2 v-if="section.title" class="section-title">{{ section.title }}</h2>
            <div v-if="section.text" class="section-content" v-html="section.text"></div>

            <div v-if="section.steps" class="section-steps">
              <div v-for="(step, stepIndex) in section.steps" :key="stepIndex" class="step-item">
                <div class="step-number">{{ stepIndex + 1 }}</div>
                <div class="step-content">
                  <h3 v-if="step.title" class="step-title">{{ step.title }}</h3>
                  <p class="step-text">{{ step.text }}</p>
                  <img v-if="step.imageUrl" :src="step.imageUrl" :alt="step.title || '步骤图片'" class="step-image" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 小提示和注意事项 -->
        <div v-if="tip?.tips && tip.tips.length > 0" class="tip-notes">
          <h2 class="notes-title">小贴士与注意事项</h2>
          <div class="notes-list">
            <div v-for="(note, index) in tip.tips" :key="index" class="note-item">
              <component :is="BulbOutlined" class="note-icon" />
              <p class="note-text">{{ note }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关推荐区域 -->
      <div class="related-tips" v-if="relatedTips.length > 0">
        <h2 class="related-title">相关小贴士</h2>
        <div class="related-grid">
          <div
              v-for="relatedTip in relatedTips"
              :key="relatedTip.id"
              class="related-tip-card"
              @click="viewTipDetail(relatedTip.id)"
          >
            <div class="related-tip-icon">
              <component :is="getCategoryIcon(relatedTip.category)" />
            </div>
            <div class="related-tip-content">
              <h3 class="related-tip-title">{{ relatedTip.title }}</h3>
              <div class="related-tip-meta">
                <span class="related-tip-category">{{ relatedTip.category }}</span>
                <span class="related-tip-likes">
                  <component :is="HeartOutlined" /> {{ relatedTip.likes }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户反馈区域 -->
      <div class="feedback-section">
        <h2 class="feedback-title">这个贴士对您有帮助吗？</h2>
        <div class="feedback-buttons">
          <a-button
              type="primary"
              class="like-btn"
              :class="{ 'liked': liked }"
              @click="toggleLike"
          >
            <template #icon><component :is="LikeOutlined" /></template>
            有帮助
          </a-button>
          <a-button class="share-btn" @click="shareTip">
            <template #icon><component :is="ShareAltOutlined" /></template>
            分享给朋友
          </a-button>
        </div>

        <div class="feedback-comment">
          <h3 class="comment-title">留下您的评论或建议</h3>
          <a-textarea
              v-model:value="userComment"
              placeholder="分享您的想法或补充..."
              :rows="4"
              class="comment-input"
          />
          <div class="comment-buttons">
            <a-button type="primary" @click="submitComment">提交评论</a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 返回顶部 -->
    <a-back-top>
      <div class="back-top">
        <component :is="UpOutlined" />
      </div>
    </a-back-top>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, h, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import {
  RightOutlined,
  UserOutlined,
  CalendarOutlined,
  HeartOutlined,
  BulbOutlined,
  FireOutlined,
  StarOutlined,
  LikeOutlined,
  ShareAltOutlined,
  UpOutlined,
  LoadingOutlined,
  InboxOutlined
} from '@ant-design/icons-vue'

// 设置中文语言
dayjs.locale('zh-cn')

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const tip = ref()
const liked = ref(false)
const userComment = ref('')

// 加载中图标
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '24px',
  },
  spin: true,
})

// 小贴士数据库 - 在实际应用中应该从API获取
const tipsDatabase = [
  {
    id: 1,
    title: '正确处理蔬菜',
    author: '王大厨',
    description: '如何洗净、切割和保存蔬菜以保持最佳口感和营养。先用流动水冲洗蔬菜，再浸泡5分钟去除农药残留。',
    category: '食材处理',
    likes: 328,
    publishDate: '2024-01-15',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
    content: [
      {
        title: '蔬菜清洗的正确步骤',
        text: '蔬菜的清洗是烹饪前的重要一步，正确的清洗方法不仅能去除农药残留，还能保持蔬菜的新鲜度和营养价值。以下是清洗各类蔬菜的通用步骤和特定蔬菜的处理方法。',
        steps: [
          {
            title: '初步冲洗',
            text: '将蔬菜放在流动的自来水下冲洗，去除表面的泥土和杂质。对于叶菜类，需要将每片叶子都冲洗到。',
            imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb'
          },
          {
            title: '浸泡处理',
            text: '将蔬菜放入盆中，加入适量清水和食用盐或小苏打（约5克/升水），浸泡5-10分钟，可有效去除农药残留。',
            imageUrl: 'https://images.unsplash.com/photo-1620589125118-b558371e0b5c'
          },
          {
            title: '二次冲洗',
            text: '浸泡后，再次用流动水彻底冲洗蔬菜，确保清除所有清洁剂和残留物。',
            imageUrl: 'https://images.unsplash.com/photo-1563699498778-aa3a7c455ac6'
          }
        ]
      },
      {
        title: '不同类型蔬菜的处理方法',
        text: '不同种类的蔬菜需要不同的处理方法，以下是常见蔬菜的具体清洗指南：',
        steps: [
          {
            title: '叶菜类（如生菜、菠菜）',
            text: '拆开每片叶子单独清洗，特别注意叶子褶皱处可能藏有泥沙。清洗后甩干或用厨房纸吸干水分。'
          },
          {
            title: '根茎类（如萝卜、土豆）',
            text: '使用蔬菜刷刷洗表面，去除泥土。某些根茎类蔬菜如胡萝卜，可以去皮后再使用。'
          },
          {
            title: '花菜类（如西兰花、花椰菜）',
            text: '将花菜头朝下浸泡在盐水中10分钟，可以使藏在花蕊中的小虫浮出。然后冲洗干净。'
          }
        ]
      },
      {
        title: '蔬菜保存技巧',
        text: '正确的保存方法可以延长蔬菜的保鲜期，保持其营养价值：',
        steps: [
          {
            title: '叶菜类保存',
            text: '清洗后用厨房纸包裹，放入保鲜袋中，排出空气后密封，放入冰箱蔬果层。'
          },
          {
            title: '根茎类保存',
            text: '不要清洗，带着表面的泥土放在阴凉干燥处。需要时再清洗使用。'
          },
          {
            title: '水果蔬菜分开存放',
            text: '某些水果会释放乙烯气体，加速蔬菜老化，因此应分开存放。'
          }
        ]
      }
    ],
    tips: [
      '清洗蔬菜时水温不宜过高，以免破坏营养成分。',
      '不同颜色的蔬菜富含不同的营养物质，搭配多种颜色的蔬菜可以获取全面的营养。',
      '切菜前刀具要保持锋利，可减少细胞破坏，保留更多营养。',
      '大部分蔬菜适合快速烹饪，过长的烹饪时间会使维生素流失。'
    ]
  },
  {
    id: 2,
    title: '掌握火候技巧',
    author: '李老师',
    description: '了解不同食材的最佳烹饪温度和时间，做出完美菜品。肉类煎制前要回温，鱼类宜用中小火慢煎保持鲜嫩。',
    category: '烹饪技巧',
    likes: 256,
    publishDate: '2024-01-18',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    content: [
      {
        title: '火候的重要性',
        text: '火候是烹饪中最为关键的技术点之一，掌握适当的火候可以让食材保持最佳口感和营养价值，同时避免过度烹饪导致食材变硬、失去水分或口感不佳。'
      },
      {
        title: '常见食材的火候控制',
        steps: [
          {
            title: '肉类烹饪',
            text: '肉类在煎制前应该回到室温，这样能够保证受热均匀。牛排煎制时，高温煎封表面后改中小火慢煎，可保持肉质鲜嫩多汁。'
          },
          {
            title: '鱼类烹饪',
            text: '鱼肉质地细嫩，容易熟透，建议使用中小火慢煎。当鱼肉从半透明变为不透明，且肉质能轻易用筷子分离时，表示烹饪恰当。'
          },
          {
            title: '蔬菜烹饪',
            text: '绿叶蔬菜适合大火快炒，保持脆嫩口感和鲜亮色泽。根茎类蔬菜则需要较长时间烹饪，可先用中火炒至表面微软，再加水焖煮至熟透。'
          }
        ]
      },
      {
        title: '火候判断技巧',
        steps: [
          {
            title: '油温判断',
            text: '冷锅冷油开始加热，当油面上出现细小波纹为小火（约120℃）；放入筷子尖有小气泡缓慢上升为中火（约150-160℃）；筷子周围气泡迅速上升为大火（约180-200℃）。'
          },
          {
            title: '肉类熟度判断',
            text: '对于牛肉，可以根据手感判断：用拇指和食指轻触，感觉类似手掌肉垫偏软为三分熟；用拇指和中指轻触，感觉稍硬为五分熟；用拇指和无名指轻触，感觉较硬为七分熟；用拇指和小指轻触，感觉很硬为全熟。'
          }
        ]
      }
    ],
    tips: [
      '炒菜时先热锅后加油，可防止食材粘锅。',
      '煎肉时不要频繁翻动，让其充分煎出表面的香气。',
      '蒸鱼时，水开后再上锅，可保持鱼肉鲜嫩。',
      '炖肉类食材时，先用大火煮沸，再转小火慢炖，能使肉质更加酥烂。'
    ]
  },
  {
    id: 3,
    title: '高效厨房管理',
    author: '张师傅',
    description: '如何规划烹饪流程，节省时间并保持厨房整洁。建立"边做边清洁"的习惯，准备食材时按烹饪顺序排列。合理规划厨房空间，常用工具放在触手可及的位置，提高烹饪效率。',
    category: '厨房管理',
    likes: 187,
    publishDate: '2024-01-20',
    imageUrl: 'https://images.unsplash.com/photo-1556911261-6bd341186b2f',
    content: [
      {
        title: '厨房工作流程优化',
        text: '科学合理的工作流程是高效厨房管理的关键。合理安排烹饪步骤，减少重复动作和等待时间，能够显著提高烹饪效率。',
        steps: [
          {
            title: '提前规划菜单',
            text: '在开始烹饪前，先确定完整的菜单，列出所有需要的食材和工具，避免中途发现缺少材料而打断烹饪流程。'
          },
          {
            title: '准备工作（Mise en Place）',
            text: '烹饪前完成所有切配工作，将食材分类并放入小碗中，按照烹饪顺序排列。这样在烹饪过程中可以专注于火候控制，不必分心准备下一步的食材。'
          },
          {
            title: '清理同步进行',
            text: '建立"边做边清洁"的习惯，在等待某道菜品烹饪的间隙清洗已使用的工具和容器，避免厨房杂乱和器具堆积。'
          }
        ]
      },
      {
        title: '厨房空间规划',
        text: '合理的厨房空间规划可以减少烹饪过程中的移动距离，让工作更加高效流畅。',
        steps: [
          {
            title: '工作三角区',
            text: '按照"储存区-准备区-烹饪区"的工作三角形原则布置厨房，减少在不同工作区域之间的走动距离。'
          },
          {
            title: '分区存放工具',
            text: '将工具按照使用频率和功能分区存放：常用工具放在触手可及的位置，不常用的收纳在较高或较低的柜子中。'
          },
          {
            title: '合理利用垂直空间',
            text: '利用墙面和柜门内侧安装挂钩或磁条，悬挂常用的刀具、铲勺等，既节省空间又方便取用。'
          }
        ]
      },
      {
        title: '食材管理技巧',
        text: '有效的食材管理可以减少浪费，确保食材新鲜，并简化烹饪准备过程。',
        steps: [
          {
            title: 'FIFO原则（先进先出）',
            text: '储存食材时遵循"先进先出"原则，新购买的食材放在后面，先前购买的放在前面优先使用，避免食材过期造成浪费。'
          },
          {
            title: '定期整理冰箱',
            text: '每周至少整理一次冰箱，检查食材保鲜情况，及时处理即将过期的食材，保持冰箱整洁有序。'
          },
          {
            title: '剩余食材再利用',
            text: '创意利用剩余食材，如将剩余蔬菜做成汤品或煎饼，剩饭可以做炒饭，减少食材浪费的同时变废为宝。'
          }
        ]
      }
    ],
    tips: [
      '使用计时器提醒烹饪时间，避免因分心而导致过熟或烧焦。',
      '保持刀具锋利可以提高切配效率，也更加安全。',
      '清洁工作从上到下进行：先擦拭台面和灶台，最后清洁地面。',
      '使用多层蒸锅同时蒸制不同食材，节省时间和燃气/电力。'
    ]
  },
  {
    id: 5,
    title: '油温判断方法',
    author: '张师傅',
    description: '学会不用温度计也能准确判断油温。筷尖入油有气泡缓慢上升是中温，筷尖周围气泡快速上升是高温。',
    category: '烹饪技巧',
    likes: 215,
    publishDate: '2024-01-25',
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2'
  }
]

// 初始化数据
onMounted(async () => {
  await loadTipData()
})

// 监听路由变化，重新加载数据
watch(() => route.params.id, async (newId) => {
  if (newId) {
    loading.value = true
    await loadTipData()
  }
})

// 加载小贴士数据
const loadTipData = async () => {
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    // 从路由参数获取ID
    const tipId = parseInt(route.params.id as string)

    // 从数据库查找对应小贴士
    const foundTip = tipsDatabase.find(t => t.id === tipId)

    tip.value = foundTip || null
  } catch (error) {
    console.error('Failed to load tip data:', error)
    message.error('加载数据失败，请稍后再试')
    tip.value = null
  } finally {
    loading.value = false
  }
}

// 获取分类图标
const getCategoryIcon = (category :any) => {
  const iconMap = {
    '食材处理': BulbOutlined,
    '烹饪技巧': FireOutlined,
    '厨房管理': InboxOutlined,
    '营养搭配': StarOutlined
  }
  return iconMap[category] || BulbOutlined
}

// 格式化日期
const formatDate = (dateString :any) => {
  return dayjs(dateString).format('YYYY年MM月DD日')
}

// 相关小贴士推荐 - 根据相同分类推荐
const relatedTips = computed(() => {
  if (!tip.value) return []

  return tipsDatabase
      .filter(t => t.category === tip.value.category && t.id !== tip.value.id)
      .slice(0, 3)
})

// 点赞功能
const toggleLike = () => {
  liked.value = !liked.value

  if (tip.value) {
    if (liked.value) {
      tip.value.likes++
      message.success('感谢您的点赞！')
    } else {
      tip.value.likes--
    }
  }
}

// 分享功能
const shareTip = () => {
  // 实际应用中可以实现社交分享功能
  message.success('分享链接已复制到剪贴板')
}

// 提交评论
const submitComment = () => {
  if (!userComment.value.trim()) {
    message.warning('请输入评论内容')
    return
  }

  message.success('评论提交成功，感谢您的反馈！')
  userComment.value = ''
}

// 查看小贴士详情
const viewTipDetail = (id :any) => {
  router.push(`/tips/${id}`)
}

// 返回首页
const goToHome = () => {
  router.push('/')
}

// 返回小贴士列表
const goToTipsList = () => {
  router.push('/tips')
}
</script>

<style scoped>
.tip-detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;
  background: #f5f5f7;
}

/* 面包屑导航 */
.breadcrumb-nav {
  display: flex;
  align-items: center;
  padding: 12px 0;
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.breadcrumb-nav a {
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
}

.breadcrumb-nav a:hover {
  color: #fa8c16;
}

.separator {
  margin: 0 8px;
  font-size: 10px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.loading-container p {
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.45);
}

/* 404状态 */
.not-found {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 详情内容 */
.tip-detail-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* 标题区域 */
.tip-header {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.tip-category-tag {
  display: inline-flex;
  align-items: center;
  background: rgba(250, 140, 22, 0.1);
  color: #fa8c16;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  margin-bottom: 16px;
}

.tip-category-tag :deep(.anticon) {
  margin-right: 6px;
}

.tip-title {
  font-size: 28px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 16px 0;
}

.tip-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.tip-author, .tip-date, .tip-likes {
  display: flex;
  align-items: center;
}

.tip-author :deep(.anticon),
.tip-date :deep(.anticon),
.tip-likes :deep(.anticon) {
  margin-right: 6px;
}

/* 封面图 */
.tip-cover {
  width: 100%;
}

.tip-cover img {
  width: 100%;
  height: auto;
  object-fit: cover;
  max-height: 480px;
}

/* 内容区域 */
.tip-content {
  padding: 32px 24px;
}

.tip-summary {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px dashed #f0f0f0;
}

.tip-sections {
  margin-bottom: 32px;
}

.tip-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 16px 0;
  border-left: 4px solid #fa8c16;
  padding-left: 12px;
}

.section-content {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.75);
  margin-bottom: 24px;
}

.section-steps {
  margin-top: 24px;
}

.step-item {
  display: flex;
  margin-bottom: 24px;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #fa8c16;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 16px;
  flex-shrink: 0;
  margin-top: 4px;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 8px 0;
}

.step-text {
  font-size: 16px;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.75);
  margin-bottom: 12px;
}

.step-image {
  width: 100%;
  border-radius: 8px;
  margin-top: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 小贴士与注意事项 */
.tip-notes {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 20px;
  margin-top: 32px;
}

.notes-title {
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 16px 0;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note-item {
  display: flex;
  align-items: flex-start;
}

.note-icon {
  color: #faad14;
  font-size: 16px;
  margin-right: 10px;
  margin-top: 4px;
}

.note-text {
  flex: 1;
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.65);
}

/* 相关推荐 */
.related-tips {
  padding: 24px;
  background: #f9f9f9;
  border-top: 1px solid #f0f0f0;
}

.related-title {
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 16px 0;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.related-tip-card {
  display: flex;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s;
}

.related-tip-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  background: #fff5e6;
}

.related-tip-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fef6e8;
  color: #fa8c16;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 12px;
  flex-shrink: 0;
}

.related-tip-content {
  flex: 1;
}

.related-tip-title {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-tip-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.related-tip-category {
  color: #fa8c16;
}

.related-tip-likes {
  color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 用户反馈区域 */
.feedback-section {
  padding: 32px 24px;
  border-top: 1px solid #f0f0f0;
}

.feedback-title {
  font-size: 18px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  text-align: center;
  margin: 0 0 20px 0;
}

.feedback-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}

.like-btn {
  background: #fa8c16;
  border-color: #fa8c16;
}

.like-btn:hover {
  background: #fd9a30;
  border-color: #fd9a30;
}

.liked {
  background: #faad14;
  border-color: #faad14;
}

.feedback-comment {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.comment-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  margin: 0 0 16px 0;
}

.comment-input {
  margin-bottom: 16px;
}

.comment-buttons {
  display: flex;
  justify-content: flex-end;
}

/* 返回顶部按钮 */
.back-top {
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 50%;
  background-color: #fa8c16;
  color: #fff;
  text-align: center;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(250, 140, 22, 0.3);
}

/* 响应式布局 */
@media (max-width: 992px) {
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .tip-title {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .tip-header {
    padding: 20px;
  }

  .tip-content {
    padding: 24px 20px;
  }

  .section-title {
    font-size: 20px;
  }

  .feedback-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .feedback-buttons .ant-btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .related-grid {
    grid-template-columns: 1fr;
  }

  .tip-meta {
    flex-direction: column;
    gap: 8px;
  }

  .tip-title {
    font-size: 20px;
  }

  .step-item {
    flex-direction: column;
  }

  .step-number {
    margin-bottom: 12px;
  }
}
</style>