import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'

const service: AxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 5000
})

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const userStore = useUserStore()
        if (userStore.token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${userStore.token}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    (response: AxiosResponse) => {
        const { code, data, msg } = response.data
        if (code === 0) {
            return data
        }
        message.error(msg || '请求失败')
        return Promise.reject(new Error(msg || '请求失败'))
    },
    (error) => {
        message.error(error.message || '请求失败')
        return Promise.reject(error)
    }
)

export default service