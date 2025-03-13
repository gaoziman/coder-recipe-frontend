import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '@/style.css'
import { useUserStore } from '@/stores/user'

// 创建pinia实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 创建应用实例
const app = createApp(App)

// 挂载插件
app.use(router)
app.use(pinia)
app.use(Antd)

// 初始化时加载用户信息
const userStore = useUserStore()
userStore.loadUserFromStorage()

// 挂载应用
app.mount('#app')