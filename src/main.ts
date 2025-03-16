// src/main.ts
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 按正确顺序导入样式文件
import '@/assets/styles/variables.css'  // 先导入变量
import '@/assets/styles/base.css'       // 再导入主样式文件
// 可以选择性地导入我之前创建的global.css中的一些补充样式
// import './assets/styles/helpers.css'  // 如果需要辅助类

// 创建 Pinia 实例并配置持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 创建 Vue 应用实例
const app = createApp(App)

// 注册全局组件和插件
app.use(router)
app.use(pinia)
app.use(Antd)



// 挂载应用
app.mount('#app')

// 全局事件监听，用于在需要时显示登录弹窗
window.addEventListener('show-login-modal', () => {
    if (window.showGlobalLogin && typeof window.showGlobalLogin === 'function') {
        window.showGlobalLogin()
    }
})

// 声明全局方法类型
declare global {
    interface Window {
        showGlobalLogin?: () => void
    }
}