import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 用户信息接口
export interface UserInfo {
    id: number
    username?: string
    nickname: string
    avatarUrl?: string
    avatar?: string
    email?: string
    phone?: string
    bio?: string
    registerDate: string
    recipesCount: number
    ingredientsCount: number
    monthlyCookingCount: number
}

// 定义初始状态
const initialUserInfo: UserInfo = {
    id: 1,
    nickname: '小厨师',
    registerDate: '2024-01-01',
    recipesCount: 32,
    ingredientsCount: 15,
    monthlyCookingCount: 28,
    avatar: 'https://joeschmoe.io/api/v1/xiaochef',
    bio: '热爱烹饪的美食爱好者，擅长中式家常菜。'
}

// 定义用户 Store
export const useUserStore = defineStore('user', () => {
    // 用户信息状态
    const userInfo = ref<UserInfo | null>(null)

    // Token状态
    const token = ref<string | null>(null)

    // 加载状态
    const loading = ref(false)
    const isLoaded = ref(false)

    // 是否登录
    const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

    // 从本地存储加载用户信息
    const loadUserFromStorage = () => {
        try {
            // 先尝试从localStorage获取数据
            const storedToken = localStorage.getItem('token')
            const storedUserInfo = localStorage.getItem('user-info')

            if (storedToken) {
                token.value = storedToken
            }

            if (storedUserInfo) {
                userInfo.value = JSON.parse(storedUserInfo)
            } else {
                // 如果没有存储的用户信息，使用初始值
                userInfo.value = {...initialUserInfo}
            }

            isLoaded.value = true
        } catch (error) {
            console.error('从本地存储加载用户数据失败:', error)
            userInfo.value = {...initialUserInfo}
            isLoaded.value = true
        }
    }

    // 设置用户信息
    const setUserInfo = (info: UserInfo) => {
        userInfo.value = info
        isLoaded.value = true
        // 存储到localStorage
        localStorage.setItem('user-info', JSON.stringify(info))
    }

    // 设置Token
    const setToken = (newToken: string) => {
        token.value = newToken
        localStorage.setItem('token', newToken)
    }

    // 清除用户数据
    const clearUserData = () => {
        token.value = null
        userInfo.value = null
        isLoaded.value = false
        localStorage.removeItem('token')
        localStorage.removeItem('user-info')
    }

    // 获取用户信息
    const fetchUserInfo = async () => {
        loading.value = true
        try {
            // 在真实项目中，这里应该调用API
            // const response = await api.get('/user/profile')
            // userInfo.value = response.data

            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 500))

            // 使用模拟数据
            userInfo.value = { ...initialUserInfo }

            isLoaded.value = true
            // 更新本地存储
            localStorage.setItem('user-info', JSON.stringify(userInfo.value))

            return userInfo.value
        } catch (error) {
            console.error('获取用户信息失败', error)
            return null
        } finally {
            loading.value = false
        }
    }

    // 更新用户信息
    const updateUserInfo = async (data: Partial<UserInfo>) => {
        loading.value = true
        try {
            // 在真实项目中，这里应该调用API
            // await api.put('/user/profile', data)

            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 500))

            // 确保userInfo.value不为null
            if (!userInfo.value) {
                userInfo.value = {...initialUserInfo}
            }

            // 更新本地状态
            userInfo.value = {
                ...userInfo.value,
                ...data
            }

            // 更新本地存储
            localStorage.setItem('user-info', JSON.stringify(userInfo.value))

            return true
        } catch (error) {
            console.error('更新用户信息失败', error)
            return false
        } finally {
            loading.value = false
        }
    }

    // 退出登录
    const logout = () => {
        clearUserData()
        // 在真实项目中，这里应该调用API注销登录
    }

    return {
        userInfo,
        token,
        loading,
        isLoaded,
        isLoggedIn,
        loadUserFromStorage,
        setUserInfo,
        setToken,
        clearUserData,
        fetchUserInfo,
        updateUserInfo,
        logout
    }
})