<template>
  <div class="cooking-tips-detail">
    <!-- 文章标题和作者信息 -->
    <div class="article-header">
      <h1 class="article-title">完美煎鱼不粘锅的技巧</h1>
      <div class="article-meta">
        <a-tag color="error">烹饪技巧</a-tag>
        <div class="author-info">
          <a-avatar :src="authorAvatar" :size="32" />
          <span class="author-name">赵师傅</span>
          <span class="divider">|</span>
          <span class="publish-date">2023-03-15</span>
          <span class="divider">|</span>
          <span class="view-count">
            <EyeOutlined /> 3.5K
          </span>
        </div>
      </div>
    </div>

    <!-- 文章内容 -->
    <a-card class="article-content">
      <!-- 封面图 -->
      <div class="cover-image">
        <img
            src="https://images.unsplash.com/photo-1630385703461-35fdecec9f4b"
            alt="煎鱼技巧"
        />
      </div>

      <!-- 导语 -->
      <div class="article-intro">
        <p>
          煎鱼是许多家庭常见的烹饪方法，但很多人都被鱼肉粘锅、鱼皮破裂的问题所困扰。本文将分享专业厨师的煎鱼技巧，帮助你轻松煎出外酥里嫩、完美不粘锅的鱼。
        </p>
      </div>

      <!-- 正文内容 -->
      <div class="article-body">
        <h2>选择合适的鱼</h2>
        <p>
          不同的鱼种适合不同的烹饪方法。对于煎鱼来说，肉质紧实、骨刺少的鱼种更容易操作，比如鲈鱼、罗非鱼、龙利鱼等。新鲜的鱼肉表面应该光滑湿润，没有异味，眼睛清亮突出。
        </p>

        <h2>准备工作很重要</h2>
        <p>煎鱼前的准备工作决定了最终成品的品质：</p>
        <ul>
          <li>彻底擦干鱼表面的水分，可以用厨房纸巾轻轻按压吸干</li>
          <li>在鱼皮上划几道浅口，这样可以防止鱼在煎制过程中卷曲</li>
          <li>均匀撒上盐和胡椒粉腌制10-15分钟，这样可以增加风味并帮助锁住水分</li>
          <li>可以在鱼身上轻轻涂抹一层薄薄的面粉，这有助于形成酥脆的外皮并防止粘锅</li>
        </ul>

        <h2>锅和油的选择</h2>
        <p>不粘锅是煎鱼的理想选择，但高质量的铸铁锅或碳钢锅在正确使用的情况下也很适合：</p>
        <ul>
          <li>确保锅面完全干燥且没有残留物</li>
          <li>使用中高温加热锅至适当温度</li>
          <li>选择高温烹饪油，如葵花籽油、玉米油或精炼橄榄油</li>
          <li>油量要适中，覆盖锅底即可，过多的油会导致鱼肉油腻</li>
        </ul>

        <div class="tip-box">
          <h3 class="tip-title">
            <InfoCircleOutlined class="tip-icon" /> 温度测试小窍门
          </h3>
          <p>
            如何知道锅已经达到合适的温度？可以试试"水滴测试"：将几滴水滴在锅面上，如果水珠在锅面上"跳跃"而不是立即蒸发或静止不动，说明温度正好。
          </p>
        </div>

        <h2>正确的煎制技巧</h2>
        <p>掌握这些技巧，可以让你的煎鱼更加完美：</p>
        <ol>
          <li>
            <strong>先煎鱼皮面：</strong>如果是带皮的鱼，应该先煎皮面。将鱼皮面朝下轻轻放入锅中，注意方向是从远离自己的一侧向近侧放，这样可以避免油溅到自己身上。
          </li>
          <li>
            <strong>不要急着翻动：</strong>放入鱼后，不要立即移动或翻面。等待鱼皮自然形成金黄色外壳并轻松脱离锅底，通常需要3-5分钟（视鱼的厚度而定）。
          </li>
          <li>
            <strong>轻柔翻面：</strong>用宽大的鱼铲或两把铲子一起操作，轻柔地将鱼翻面。翻面时动作要快而准确。
          </li>
          <li>
            <strong>控制好另一面的烹饪时间：</strong>另一面的烹饪时间通常比第一面短。可以通过观察鱼肉的侧面变化来判断熟度，从半透明变为不透明即为熟透。
          </li>
          <li>
            <strong>最后的点睛之笔：</strong>在煎制的最后阶段，可以加入黄油、大蒜、迷迭香等增香，并不断舀起锅中的油脂浇在鱼肉上，这样可以使鱼肉更加香鲜可口。
          </li>
        </ol>

        <div class="image-container">
          <img
              src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2"
              alt="煎鱼示范"
          />
          <p class="image-caption">使用鱼铲轻柔翻面的正确姿势</p>
        </div>

        <h2>常见问题及解决方法</h2>

        <div class="qa-item">
          <h3 class="qa-question">问题：鱼还是粘锅了怎么办？</h3>
          <p class="qa-answer">
            解决方法：很可能是锅温不够或鱼表面水分未完全擦干。下次尝试将锅预热更充分，并确保鱼表面完全干燥。如果鱼已经粘锅，不要强行铲起，而是耐心等待，随着烹饪继续，鱼皮会逐渐变脆并自然脱离锅底。
          </p>
        </div>

        <div class="qa-item">
          <h3 class="qa-question">问题：鱼皮不够酥脆怎么办？</h3>
          <p class="qa-answer">
            解决方法：确保鱼表面完全干燥，可以在煎前将鱼放入冰箱冷藏30分钟，让表面更干燥。另外，确保锅温足够高，油也要预热到足够温度。
          </p>
        </div>

        <div class="qa-item">
          <h3 class="qa-question">问题：鱼肉外面焦了里面还没熟怎么办？</h3>
          <p class="qa-answer">
            解决方法：火候可能太大了。可以先用中高温煎至两面金黄，然后降低火力，盖上锅盖焖煮1-2分钟，这样可以保证鱼肉内部熟透而不会过度烹饪表面。
          </p>
        </div>

        <h2>总结</h2>
        <p>完美煎鱼的秘诀在于充分的准备工作、正确的工具选择和耐心的操作。记住这些要点：</p>
        <ul>
          <li>选择新鲜、适合煎制的鱼</li>
          <li>彻底擦干鱼表面，必要时撒些薄面粉</li>
          <li>锅和油要充分预热</li>
          <li>放入鱼后不要急着翻动</li>
          <li>轻柔翻面，控制好两面的烹饪时间</li>
          <li>最后可以加入黄油和香草增香</li>
        </ul>
        <p>掌握这些技巧，相信你很快就能煎出完美的鱼，让家人赞不绝口！</p>
      </div>

      <!-- 标签 -->
      <div class="article-tags">
        <span class="tag-label">标签：</span>
        <a-tag v-for="tag in tags" :key="tag" class="article-tag">{{ tag }}</a-tag>
      </div>
    </a-card>

    <!-- 分享和收藏 -->
    <div class="action-buttons">
      <a-button class="action-btn">
        <template #icon><ShareAltOutlined /></template>
        分享
      </a-button>
      <a-button class="action-btn">
        <template #icon><StarOutlined /></template>
        收藏
      </a-button>
      <a-button class="action-btn">
        <template #icon><MessageOutlined /></template>
        评论 (15)
      </a-button>
    </div>

    <!-- 评论区域 -->
    <a-card class="comments-section">
      <h3 class="section-title">评论 (15)</h3>

      <!-- 评论输入框 -->
      <div class="comment-form">
        <a-avatar :src="currentUserAvatar" :size="40" />
        <div class="comment-input">
          <a-textarea
              placeholder="分享你的想法..."
              :rows="3"
              v-model:value="commentText"
          />
          <div class="comment-actions">
            <a-button type="primary" class="submit-btn">发表评论</a-button>
          </div>
        </div>
      </div>

      <!-- 评论列表 -->
      <div class="comment-list">
        <div class="comment-item" v-for="comment in comments" :key="comment.id">
          <a-avatar :src="comment.avatar" :size="40" />
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.author }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <div class="comment-footer">
              <a-button type="text" class="like-btn">
                <LikeOutlined /> 点赞 ({{ comment.likes }})
              </a-button>
              <a-button type="text">回复</a-button>
            </div>

            <!-- 回复列表 -->
            <div class="reply-list" v-if="comment.replies && comment.replies.length > 0">
              <div class="reply-item" v-for="reply in comment.replies" :key="reply.id">
                <a-avatar :src="reply.avatar" :size="32" />
                <div class="reply-content">
                  <div class="reply-header">
                    <span class="reply-author">{{ reply.author }}</span>
                    <a-tag v-if="reply.isAuthor" size="small" class="author-tag">作者</a-tag>
                    <span class="reply-time">{{ reply.time }}</span>
                  </div>
                  <p class="reply-text">{{ reply.content }}</p>
                  <div class="reply-footer">
                    <a-button type="text" class="like-btn">
                      <LikeOutlined /> 点赞 ({{ reply.likes }})
                    </a-button>
                    <a-button type="text">回复</a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 查看更多评论 -->
      <div class="more-comments">
        <a-button class="more-btn">查看更多评论</a-button>
      </div>
    </a-card>

    <!-- 相关推荐 -->
    <div class="related-recommendations">
      <h3 class="section-title">相关推荐</h3>
      <div class="recommendation-list">
        <a-card
            v-for="item in recommendations"
            :key="item.id"
            hoverable
            class="recommendation-item"
        >
          <img :src="item.image" alt="推荐文章" class="recommendation-image" />
          <div class="recommendation-card-content">
            <a-tag color="error" v-if="item.category === '烹调方法'">{{ item.category }}</a-tag>
            <a-tag color="processing" v-else>{{ item.category }}</a-tag>
            <h3 class="recommendation-title">{{ item.title }}</h3>
            <p class="recommendation-desc">{{ item.desc }}</p>
            <div class="recommendation-footer">
              <div class="recommendation-author">
                <a-avatar :src="item.authorAvatar" :size="24" />
                <span class="author-name">{{ item.author }}</span>
              </div>
              <span class="publish-time">{{ item.time }}</span>
            </div>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  EyeOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  StarOutlined,
  MessageOutlined,
  LikeOutlined
} from '@ant-design/icons-vue'

// 当前用户头像
const currentUserAvatar = ref('/images/default-avatar.jpg')

// 作者头像
const authorAvatar = ref('https://randomuser.me/api/portraits/men/55.jpg')

// 标签数据
const tags = ref(['煎鱼', '不粘锅', '烹饪技巧', '海鲜', '家常菜'])

// 评论文本
const commentText = ref('')

// 评论数据
const comments = ref([
  {
    id: 1,
    author: '陈小美',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    time: '3天前',
    content: '谢谢分享这么详细的技巧！之前一直煎鱼粘锅，原来是没擦干水分的原因。今天按照文章的方法试了一下，成功了！鱼皮金黄酥脆，一点都没粘锅！',
    likes: 23,
    replies: []
  },
  {
    id: 2,
    author: '王大厨',
    avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
    time: '5天前',
    content: '可以补充一点，如果是厚一点的鱼片，在皮面煎至金黄后翻面，可以改用小火慢慢煎，这样肉质会更嫩。另外，如果怕腥味，可以在煎前用料酒和盐腌一下。',
    likes: 15,
    replies: [
      {
        id: 1,
        author: '赵师傅',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        time: '4天前',
        content: '非常感谢您的补充！确实，对于厚切鱼片，控制火候非常重要。料酒去腥的建议也很棒，下次我会在文章中加入这些细节。',
        likes: 8,
        isAuthor: true
      }
    ]
  },
  {
    id: 3,
    author: '林小厨',
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    time: '1周前',
    content: '请问煎鲈鱼和煎三文鱼的火候控制有什么不同吗？我煎三文鱼总是觉得不够嫩，但又怕里面没熟透。',
    likes: 5,
    replies: []
  }
])

// 相关推荐数据
const recommendations = ref([
  {
    id: 1,
    title: '家常红烧鱼的完美做法',
    desc: '掌握正宗红烧鱼的烹饪技巧，选择合适的调料搭配，让鱼肉鲜嫩入味，汤汁浓郁不腻。',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae',
    category: '烹调方法',
    author: '徐厨师',
    authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    time: '3天前'
  },
  {
    id: 2,
    title: '如何挑选和保存新鲜鱼类',
    desc: '从眼睛、鳃、鱼鳞等方面辨别鱼的新鲜度，学习正确的冰鲜和冷冻保存方法，延长保质期。',
    image: 'https://images.unsplash.com/photo-1560717845-968823efbee1',
    category: '食材保存',
    author: '张营养师',
    authorAvatar: 'https://randomuser.me/api/portraits/women/43.jpg',
    time: '1周前'
  },
  {
    id: 3,
    title: '鲜嫩多汁的清蒸鱼技巧',
    desc: '最大限度保留鱼的原汁原味，掌握蒸鱼的时间和火候控制，让鱼肉细嫩鲜美，口感一流。',
    image: 'https://images.unsplash.com/photo-1595475207225-428b62bda831',
    category: '烹调方法',
    author: '赵师傅',
    authorAvatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    time: '2周前'
  }
])
</script>

<style scoped>
.cooking-tips-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  background-color: #f9f7f4;
}

.article-header {
  margin-bottom: 32px;
}

.article-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-name {
  margin-left: 8px;
  font-size: 14px;
  color: #666;
}

.divider {
  margin: 0 12px;
  color: #ddd;
}

.publish-date, .view-count {
  font-size: 14px;
  color: #666;
}

.article-content {
  margin-bottom: 24px;
  border-radius: 12px;
}

.cover-image {
  margin: -20px -20px 24px -20px;
  height: 400px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-intro {
  font-style: italic;
  padding: 16px;
  border-left: 4px solid #f6925c;
  background-color: #fff9f6;
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 1.6;
}

.article-body {
  color: #333;
  line-height: 1.8;
}

.article-body h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 32px 0 16px 0;
  color: #333;
}

.article-body p {
  margin-bottom: 16px;
}

.article-body ul, .article-body ol {
  padding-left: 24px;
  margin-bottom: 24px;
}

.article-body li {
  margin-bottom: 8px;
}

.tip-box {
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 24px 0;
}

.tip-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.tip-icon {
  color: #f6925c;
  margin-right: 8px;
}

.image-container {
  margin: 32px 0;
}

.image-container img {
  width: 100%;
  border-radius: 8px;
}

.image-caption {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 8px;
}

.qa-item {
  border-left: 4px solid #ffe58f;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fffbf0;
}

.qa-question {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
}

.qa-answer {
  margin: 0;
}

.article-tags {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.tag-label {
  margin-right: 8px;
  color: #666;
  font-size: 14px;
}

.article-tag {
  margin-right: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  background-color: #f5f5f5;
  color: #666;
}

.article-tag:hover {
  background-color: #e8e8e8;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.action-btn {
  margin: 0 8px;
  height: 36px;
  display: flex;
  align-items: center;
  border-radius: 18px;
  font-size: 14px;
  background-color: white;
  color: #666;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
  color: #f6925c !important;
  border-color: #f6925c !important;
}

.comments-section {
  margin-bottom: 32px;
  border-radius: 12px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
}

.comment-form {
  display: flex;
  margin-bottom: 32px;
}

.comment-input {
  flex: 1;
  margin-left: 16px;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.submit-btn {
  background-color: #f6925c;
  border-color: #f6925c;
  border-radius: 16px;
}

.submit-btn:hover {
  background-color: #e88550;
  border-color: #e88550;
}

.comment-list {
  margin-bottom: 32px;
}

.comment-item {
  display: flex;
  margin-bottom: 24px;
}

.comment-content {
  flex: 1;
  margin-left: 16px;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 500;
  color: #333;
  margin-right: 8px;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-text {
  margin-bottom: 12px;
  line-height: 1.6;
}

.comment-footer {
  display: flex;
  align-items: center;
}

.like-btn {
  margin-right: 16px;
}

.reply-list {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.reply-item {
  display: flex;
  margin-bottom: 16px;
}

.reply-content {
  flex: 1;
  margin-left: 12px;
}

.reply-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.reply-author {
  font-weight: 500;
  color: #333;
  margin-right: 8px;
}

.author-tag {
  background-color: #f5f5f5;
  color: #666;
  margin-right: 8px;
}

.reply-time {
  font-size: 12px;
  color: #999;
}

.reply-text {
  margin-bottom: 8px;
  line-height: 1.6;
}

.reply-footer {
  display: flex;
  align-items: center;
}

.more-comments {
  text-align: center;
}

.more-btn {
  border-color: #f6925c;
  color: #f6925c;
  border-radius: 20px;
}

.more-btn:hover {
  background-color: #f6925c;
  color: white;
}

.related-recommendations {
  margin-bottom: 48px;
}

.recommendation-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.recommendation-item {
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.recommendation-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.recommendation-image {
  height: 180px;
  width: 100%;
  object-fit: cover;
}

.recommendation-card-content {
  padding: 16px;
}

.recommendation-title {
  font-size: 16px;
  font-weight: 600;
  margin: 8px 0;
  line-height: 1.4;
}

.recommendation-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.recommendation-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recommendation-author {
  display: flex;
  align-items: center;
}

.recommendation-author .author-name {
  margin-left: 8px;
  font-size: 12px;
  color: #666;
}

.publish-time {
  font-size: 12px;
  color: #999;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .recommendation-list {
    grid-template-columns: 1fr;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .cover-image {
    height: 220px;
  }

  .image-container img {
    height: auto;
  }

  .action-buttons {
    flex-wrap: wrap;
    gap: 8px;
  }

  .comment-form {
    flex-direction: column;
  }

  .comment-input {
    margin-left: 0;
    margin-top: 16px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .recommendation-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>