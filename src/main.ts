// src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from '@/router';

// 导入样式
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '@/assets/styles/base.css';

// 创建Vue应用
const app = createApp(App);

// 使用插件
app.use(createPinia());
app.use(router);
app.use(Antd);

// 挂载应用
app.mount('#app');