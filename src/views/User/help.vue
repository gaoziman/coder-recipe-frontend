<template>
  <div class="help-container">
    <div class="help-content">
      <!-- 左侧个人信息 -->
      <div class="profile-sidebar">
        <user-profile-card :user="userInfo"/>
      </div>

      <!-- 右侧内容区 -->
      <div class="help-main">
        <a-card class="help-card" :bordered="false">
          <template #title>
            <h3 class="card-title">帮助与反馈</h3>
          </template>

          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="常见问题">
              <div class="faq-section">
                <a-collapse
                    v-model:activeKey="activeKeys"
                    :bordered="false"
                    expand-icon-position="right"
                >
                  <a-collapse-panel key="1" header="如何创建自己的菜谱？">
                    <div class="faq-content">
                      <p>创建菜谱非常简单，请按照以下步骤操作：</p>
                      <ol>
                        <li>点击顶部导航栏中的"创建菜谱"按钮</li>
                        <li>填写菜谱名称、烹饪时间、难度等基本信息</li>
                        <li>添加所需食材及其用量</li>
                        <li>详细描述烹饪步骤，可以为每个步骤上传图片</li>
                        <li>添加烹饪小贴士（可选）</li>
                        <li>选择菜谱分类和标签</li>
                        <li>点击"发布"按钮完成创建</li>
                      </ol>
                      <p>发布后，你可以随时在个人中心中查看和编辑你的菜谱。</p>
                    </div>
                  </a-collapse-panel>

                  <a-collapse-panel key="2" header="如何管理我的食材库？">
                    <div class="faq-content">
                      <p>食材库帮助你记录家中现有的食材，以便查找适合的菜谱：</p>
                      <ol>
                        <li>在个人中心页面点击"食材库"</li>
                        <li>使用"添加食材"按钮新增食材</li>
                        <li>输入食材名称、数量、购买日期和保质期</li>
                        <li>食材添加后会自动显示在你的食材库列表中</li>
                        <li>你可以通过搜索、筛选来管理大量食材</li>
                        <li>系统会根据保质期提醒你及时使用即将过期的食材</li>
                      </ol>
                      <p>你还可以通过扫描购物小票快速添加多个食材，或者使用语音输入功能。</p>
                    </div>
                  </a-collapse-panel>

                  <a-collapse-panel key="3" header="如何根据现有食材推荐菜谱？">
                    <div class="faq-content">
                      <p>我们的智能推荐功能可以帮你解决"冰箱里有什么可以做"的问题：</p>
                      <ol>
                        <li>确保你的食材库已更新</li>
                        <li>在首页点击"基于食材推荐"功能</li>
                        <li>系统会根据你的食材库内容推荐可以制作的菜谱</li>
                        <li>你可以设置偏好，如烹饪时间、难度、菜系等</li>
                        <li>点击"开始推荐"获取个性化菜谱建议</li>
                      </ol>
                      <p>你还可以手动选择特定食材，查找包含这些食材的菜谱。</p>
                    </div>
                  </a-collapse-panel>

                  <a-collapse-panel key="4" header="如何记录我的烹饪日志？">
                    <div class="faq-content">
                      <p>烹饪日志帮助你跟踪烹饪体验和改进：</p>
                      <ol>
                        <li>烹饪完成后，在菜谱页面点击"记录烹饪"</li>
                        <li>上传成品照片（可选但推荐）</li>
                        <li>评分这次的烹饪体验（1-5星）</li>
                        <li>记录你的心得、调整或改进</li>
                        <li>标记使用的食材是否已从食材库中扣除</li>
                        <li>点击"保存"完成记录</li>
                      </ol>
                      <p>所有烹饪记录都会在你的个人中心"烹饪日志"区域显示，帮助你追踪烹饪进步。</p>
                    </div>
                  </a-collapse-panel>

                  <a-collapse-panel key="5" header="如何分享我的菜谱和烹饪成果？">
                    <div class="faq-content">
                      <p>分享你的烹饪创作很容易：</p>
                      <ol>
                        <li>在菜谱或烹饪日志页面，点击"分享"按钮</li>
                        <li>选择分享平台（微信、微博、QQ等）</li>
                        <li>或复制链接手动分享给朋友</li>
                        <li>你也可以将菜谱分享到社区，获得其他用户的点赞和评论</li>
                      </ol>
                      <p>如果你担心隐私，可以在设置中调整菜谱和烹饪记录的可见性。</p>
                    </div>
                  </a-collapse-panel>
                </a-collapse>
              </div>

              <div class="help-actions">
                <p>没有找到你的问题？</p>
                <a-button type="primary" @click="activeKey = '2'">提交反馈</a-button>
              </div>
            </a-tab-pane>

            <a-tab-pane key="2" tab="意见反馈">
              <div class="feedback-form">
                <a-form :model="feedbackForm" layout="vertical">
                  <a-form-item label="反馈类型" name="type">
                    <a-radio-group v-model:value="feedbackForm.type">
                      <a-radio value="bug">问题反馈</a-radio>
                      <a-radio value="suggestion">功能建议</a-radio>
                      <a-radio value="content">内容纠错</a-radio>
                      <a-radio value="other">其他</a-radio>
                    </a-radio-group>
                  </a-form-item>

                  <a-form-item label="反馈内容" name="content">
                    <a-textarea
                        v-model:value="feedbackForm.content"
                        placeholder="请描述你遇到的问题或建议，尽可能提供详细信息..."
                        :auto-size="{ minRows: 6, maxRows: 12 }"
                        :maxlength="1000"
                        show-count
                    />
                  </a-form-item>

                  <a-form-item label="上传截图（可选）" name="screenshots">
                    <a-upload
                        list-type="picture-card"
                        :file-list="fileList"
                        @preview="handlePreview"
                        @change="handleChange"
                    >
                      <div v-if="fileList.length < 3">
                        <plus-outlined/>
                        <div style="margin-top: 8px">上传</div>
                      </div>
                    </a-upload>
                    <a-modal
                        :visible="previewVisible"
                        :title="previewTitle"
                        :footer="null"
                        @cancel="previewVisible = false"
                    >
                      <img alt="example" style="width: 100%" :src="previewImage"/>
                    </a-modal>
                  </a-form-item>

                  <a-form-item label="联系方式（可选）" name="contact">
                    <a-input
                        v-model:value="feedbackForm.contact"
                        placeholder="填写你的邮箱或手机号，方便我们联系你反馈处理结果"
                    />
                  </a-form-item>

                  <a-form-item>
                    <a-button type="primary" @click="submitFeedback">提交反馈</a-button>
                  </a-form-item>
                </a-form>
              </div>
            </a-tab-pane>

            <a-tab-pane key="3" tab="联系我们">
              <div class="contact-section">
                <div class="contact-cards">
                  <div class="contact-card">
                    <div class="contact-icon">
                      <mail-outlined/>
                    </div>
                    <h4 class="contact-title">电子邮件</h4>
                    <p class="contact-desc">工作日 9:00-18:00</p>
                    <p class="contact-value">support@recipecenter.com</p>
                  </div>

                  <div class="contact-card">
                    <div class="contact-icon">
                      <phone-outlined/>
                    </div>
                    <h4 class="contact-title">客服热线</h4>
                    <p class="contact-desc">工作日 9:00-20:00</p>
                    <p class="contact-value">400-123-4567</p>
                  </div>

                  <div class="contact-card">
                    <div class="contact-icon">
                      <wechat-outlined/>
                    </div>
                    <h4 class="contact-title">微信公众号</h4>
                    <p class="contact-desc">随时获取最新资讯</p>
                    <div class="qrcode-wrapper">
                      <img src="https://via.placeholder.com/120" alt="微信公众号二维码"/>
                    </div>
                  </div>
                </div>

                <div class="social-media">
                  <h4 class="social-title">关注我们</h4>
                  <div class="social-icons">
                    <a href="#" class="social-icon">
                      <weibo-outlined/>
                    </a>
                    <a href="#" class="social-icon">
                      <instagram-outlined/>
                    </a>
                    <a href="#" class="social-icon">
                      <youtube-outlined/>
                    </a>
                  </div>
                </div>

                <div class="faq-link">
                  <p>想了解更多问题的答案？查看我们的</p>
                  <a-button type="link" @click="() => window.open('/faq', '_blank')">完整帮助中心</a-button>
                </div>
              </div>
            </a-tab-pane>

            <a-tab-pane key="4" tab="我的反馈">
              <div class="my-feedback-section">
                <a-empty v-if="myFeedbacks.length === 0" description="暂无反馈记录">
                  <template #description>
                    <span>你还没有提交过反馈</span>
                  </template>
                  <a-button type="primary" @click="activeKey = '2'">去提交反馈</a-button>
                </a-empty>

                <div v-else class="feedback-list">
                  <a-timeline>
                    <a-timeline-item
                        v-for="(feedback, index) in myFeedbacks"
                        :key="index"
                        :color="getFeedbackStatusColor(feedback.status)"
                    >
                      <template #dot>
                        <component :is="getFeedbackStatusIcon(feedback.status)"/>
                      </template>

                      <div class="feedback-item">
                        <div class="feedback-header">
                          <div class="feedback-type">
                            <a-tag :color="getFeedbackTypeColor(feedback.type)">
                              {{ getFeedbackTypeText(feedback.type) }}
                            </a-tag>
                          </div>
                          <div class="feedback-time">{{ feedback.time }}</div>
                        </div>

                        <div class="feedback-content">{{ feedback.content }}</div>

                        <div v-if="feedback.reply" class="feedback-reply">
                          <div class="reply-title">官方回复：</div>
                          <div class="reply-content">{{ feedback.reply }}</div>
                          <div class="reply-time">{{ feedback.replyTime }}</div>
                        </div>

                        <div class="feedback-status">
                          <a-steps :current="getFeedbackStepsCurrent(feedback.status)" size="small">
                            <a-step title="已提交"/>
                            <a-step title="处理中"/>
                            <a-step title="已解决"/>
                          </a-steps>
                        </div>
                      </div>
                    </a-timeline-item>
                  </a-timeline>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, computed, onMounted} from 'vue'
import {message} from 'ant-design-vue'
import {useUserStore} from '@/stores/user'
import {
  PlusOutlined,
  MailOutlined,
  PhoneOutlined,
  WechatOutlined,
  WeiboOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue';
import UserProfileCard from '@/components/ProfileSidebar/index.vue'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 常见问题展开面板的激活key
const activeKeys = ref(['1'])

// 当前激活的标签页
const activeKey = ref('1')

// 表单数据
const feedbackForm = reactive({
  type: 'bug',
  content: '',
  contact: userInfo.value?.email || userInfo.value?.phone || ''
})

// 图片上传相关
const fileList = ref([])
const previewVisible = ref(false)
const previewImage = ref('')
const previewTitle = ref('')

// 处理图片预览
const handlePreview = async (file) => {
  previewImage.value = file.url || file.preview
  previewVisible.value = true
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
}

// 处理图片变更
const handleChange = ({fileList: newFileList}) => {
  fileList.value = newFileList
}

// 提交反馈
const submitFeedback = () => {
  if (!feedbackForm.content) {
    message.error('请填写反馈内容')
    return
  }

  // 调用API提交反馈
  message.success('感谢你的反馈，我们会尽快处理')

  // 重置表单
  feedbackForm.content = ''
  fileList.value = []

  // 切换到我的反馈标签
  activeKey.value = '4'
}

// 模拟我的反馈数据
const myFeedbacks = ref([
  {
    id: 1,
    type: 'bug',
    content: '在创建菜谱时，上传的第三张图片无法显示。',
    time: '2025-03-08 14:23',
    status: 'resolved',
    reply: '感谢反馈！我们已修复了图片上传问题，请更新到最新版本试试。',
    replyTime: '2025-03-10 09:15'
  },
  {
    id: 2,
    type: 'suggestion',
    content: '希望能够增加按周计划膳食的功能，方便一次性采购一周的食材。',
    time: '2025-03-01 18:42',
    status: 'processing',
    reply: '',
    replyTime: ''
  },
  {
    id: 3,
    type: 'content',
    content: '番茄炒蛋的做法中，步骤3和步骤4似乎颠倒了。',
    time: '2025-02-25 10:17',
    status: 'submitted',
    reply: '',
    replyTime: ''
  }
])

// 获取反馈类型文本
const getFeedbackTypeText = (type) => {
  switch (type) {
    case 'bug':
      return '问题反馈'
    case 'suggestion':
      return '功能建议'
    case 'content':
      return '内容纠错'
    case 'other':
      return '其他'
    default:
      return '其他'
  }
}

// 获取反馈类型颜色
const getFeedbackTypeColor = (type) => {
  switch (type) {
    case 'bug':
      return 'error'
    case 'suggestion':
      return 'processing'
    case 'content':
      return 'warning'
    case 'other':
      return 'default'
    default:
      return 'default'
  }
}

// 获取反馈状态颜色
const getFeedbackStatusColor = (status) => {
  switch (status) {
    case 'submitted':
      return 'blue'
    case 'processing':
      return 'orange'
    case 'resolved':
      return 'green'
    default:
      return 'blue'
  }
}

// 获取反馈状态图标
const getFeedbackStatusIcon = (status) => {
  switch (status) {
    case 'submitted':
      return ClockCircleOutlined
    case 'processing':
      return SyncOutlined
    case 'resolved':
      return CheckCircleOutlined
    default:
      return ClockCircleOutlined
  }
}

// 获取反馈处理步骤当前步骤
const getFeedbackStepsCurrent = (status) => {
  switch (status) {
    case 'submitted':
      return 0
    case 'processing':
      return 1
    case 'resolved':
      return 2
    default:
      return 0
  }
}

// 初始化 - 在真实项目中应该从API获取数据
onMounted(() => {
  // 加载用户数据
  if (!userStore.isLoaded) {
    userStore.fetchUserInfo()
  }

  // 加载反馈数据
  // 在这里你可以添加获取用户反馈记录的API调用
})
</script>

<style scoped>
.help-container {
  padding: 24px 0;
}

.help-content {
  display: flex;
  gap: this . description = 32px;
}

.profile-sidebar {
  width: 320px;
  flex-shrink: 0;
}

.help-main {
  flex: 1;
}

.help-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0;
}

/* FAQ样式 */
.faq-content {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.6;
}

.faq-content ol {
  padding-left: 24px;
}

.faq-content li {
  margin-bottom: 8px;
}

.help-actions {
  margin-top: 24px;
  text-align: center;
  background-color: #f5f5f5;
  padding: 24px;
  border-radius: 8px;
}

.help-actions p {
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.65);
}

/* 反馈表单样式 */
.feedback-form {
  max-width: 800px;
  margin: 0 auto;
}

/* 联系方式样式 */
.contact-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.contact-card {
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.contact-icon {
  width: 60px;
  height: 60px;
  background-color: #fff7e6;
  color: #fa8c16;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
}

.contact-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin: 0 0 8px 0;
}

.contact-desc {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
  margin: 0 0 12px 0;
}

.contact-value {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  font-weight: 500;
}

.qrcode-wrapper {
  margin-top: 12px;
}

.qrcode-wrapper img {
  max-width: 120px;
  border-radius: 4px;
}

/* 社交媒体样式 */
.social-media {
  text-align: center;
  margin-bottom: 32px;
}

.social-title {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.social-icon {
  width: 40px;
  height: 40px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.65);
  font-size: 20px;
  transition: all 0.3s;
}

.social-icon:hover {
  background-color: #fa8c16;
  color: white;
}

/* FAQ链接样式 */
.faq-link {
  text-align: center;
  background-color: #f5f5f5;
  padding: 24px;
  border-radius: 8px;
  margin-top: 24px;
}

.faq-link p {
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.65);
}

/* 我的反馈样式 */
.feedback-list {
  padding: 0 16px;
}

.feedback-item {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.feedback-time {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.feedback-content {
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 14px;
}

.feedback-reply {
  background-color: #fff7e6;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.reply-title {
  font-weight: 500;
  color: #fa8c16;
  margin-bottom: 8px;
  font-size: 14px;
}

.reply-content {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.reply-time {
  text-align: right;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 8px;
}

.feedback-status {
  margin-top: 16px;
}

/* 响应式适配 */
@media (max-width: 992px) {
  .help-content {
    flex-direction: column;
  }

  .profile-sidebar {
    width: 100%;
  }

  .contact-cards {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media (max-width: 576px) {
  .contact-cards {
    grid-template-columns: 1fr;
  }
}
</style>