<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="image-container">
        <img src="https://cdn-icons-png.flaticon.com/512/473/473104.png" alt="404" class="not-found-image" />
      </div>
      <h1 class="title">页面不存在</h1>
      <p class="description">抱歉，您访问的页面似乎已经被厨师带走了...</p>
      <div class="actions">
        <a-button type="primary" size="large" @click="goHome">
          返回首页
        </a-button>
        <a-button size="large" @click="goBack">
          返回上一页
        </a-button>
      </div>
      <div class="suggestions">
        <h3>您可能想要尝试:</h3>
        <ul>
          <li>
            <router-link to="/recipes">浏览我们的菜谱库</router-link>
          </li>
          <li>
            <router-link to="/collections">查看精选菜谱合集</router-link>
          </li>
          <li>
            <router-link to="/tips">阅读烹饪小贴士</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px);
  padding: 50px 20px;
  background: #f5f5f7;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.image-container {
  margin-bottom: 24px;
}

.not-found-image {
  width: 180px;
  margin: 0 auto;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
}

.description {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 32px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}

.suggestions {
  text-align: left;
  border-top: 1px dashed #f0f0f0;
  padding-top: 24px;
}

.suggestions h3 {
  margin-bottom: 16px;
  color: rgba(0, 0, 0, 0.75);
  font-size: 16px;
}

.suggestions ul {
  list-style-type: none;
  padding: 0;
}

.suggestions li {
  margin-bottom: 12px;
}

.suggestions a {
  color: #fa8c16;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.suggestions a:hover {
  color: #fd9a30;
  text-decoration: underline;
}

@media (max-width: 576px) {
  .not-found-content {
    padding: 24px;
  }

  .actions {
    flex-direction: column;
    gap: 12px;
  }

  .not-found-image {
    width: 140px;
  }
}
</style>