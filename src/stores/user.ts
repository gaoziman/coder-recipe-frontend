// src/stores/ProfileSidebar.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 用户信息接口
export interface UserInfo {
    id: number
    nickname: string
    avatarUrl?: string
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
    monthlyCookingCount: 28
}

// 定义用户 Store
export const useUserStore = defineStore('user', () => {
    // 用户信息状态
    const userInfo = ref<UserInfo>(initialUserInfo)

    // 加载状态
    const loading = ref(false)
    const isLoaded = ref(true) // 已经加载过初始数据

    // 是否登录
    const isLoggedIn = computed(() => !!userInfo.value?.id)

    // 获取用户信息
    const fetchUserInfo = async () => {
        loading.value = true
        try {
            // 在真实项目中，这里应该调用API
            // const response = await api.get('/ProfileSidebar/profile')
            // userInfo.value = response.data

            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 500))

            // 使用模拟数据
            userInfo.value = { ...initialUserInfo }

            isLoaded.value = true
        } catch (error) {
            console.error('获取用户信息失败', error)
        } finally {
            loading.value = false
        }
    }

    // 更新用户信息
    const updateUserInfo = async (data: Partial<UserInfo>) => {
        loading.value = true
        try {
            // 在真实项目中，这里应该调用API
            // await api.put('/ProfileSidebar/profile', data)

            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 500))

            // 更新本地状态
            userInfo.value = {
                ...userInfo.value,
                ...data
            }

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
        userInfo.value = {} as UserInfo
        isLoaded.value = false
        // 在真实项目中，这里应该调用API注销登录
    }

    return {
        userInfo,
        loading,
        isLoaded,
        isLoggedIn,
        fetchUserInfo,
        updateUserInfo,
        logout
    }
}, {
    // 配置持久化
    persist: {
        // 存储键名
        key: 'ProfileSidebar-store',
        storage: window.localStorage
    }
})