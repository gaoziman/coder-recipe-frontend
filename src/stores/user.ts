import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 定义用户信息接口
export interface UserInfo {
    id: string
    username: string
    isAdmin:boolean,
    email: string
    avatar?: string
    token?: string
}

export const useUserStore = defineStore('user', () => {
    // 状态
    const userInfo = ref<UserInfo | null>(null)
    const isLoggedIn = computed(() => !!userInfo.value)

    // 模拟API调用 - 实际项目中应替换为真实API请求
    const login = async (email: string, password: string) => {
        try {
            // 这里是模拟的API调用，实际项目中应该调用真实的登录API
            // const response = await api.post('/login', { email, password })

            // 模拟成功登录返回数据
            const userData: UserInfo = {
                id: '1',
                username: email.split('@')[0],
                email: email,
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                isAdmin:true,
                token: 'mock-jwt-token'
            }

            // 存储用户信息
            userInfo.value = userData

            return { success: true, data: userData }
        } catch (error) {
            return { success: false, error: '登录失败，请检查邮箱和密码' }
        }
    }

    const register = async (username: string, email: string, password: string) => {
        try {
            // 这里是模拟的API调用，实际项目中应该调用真实的注册API
            // const response = await api.post('/register', { username, email, password })

            // 模拟成功注册返回数据
            const userData: UserInfo = {
                id: '1',
                username,
                email,
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                token: 'mock-jwt-token'
            }

            // 存储用户信息
            userInfo.value = userData

            return { success: true, data: userData }
        } catch (error) {
            return { success: false, error: '注册失败，请稍后再试' }
        }
    }

    const logout = () => {
        // 清除用户信息
        userInfo.value = null
    }

    return {
        userInfo,
        isLoggedIn,
        login,
        register,
        logout
    }
}, {
    persist: {
        // 启用持久化
        enabled: true,
        // 使用localStorage存储
        storage: window.localStorage,
        // 只持久化userInfo
        paths: ['userInfo']
    }
})