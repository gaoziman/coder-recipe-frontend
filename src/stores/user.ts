import { defineStore } from 'pinia'
import type { IUser } from '@/types'

interface UserState {
    userInfo: IUser | null
    token: string | null
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        userInfo: null,
        token: null
    }),
    getters: {
        isLoggedIn: (state) => !!state.token
    },
    actions: {
        setUserInfo(userInfo: IUser) {
            this.userInfo = userInfo
        },
        setToken(token: string) {
            this.token = token
        },
        logout() {
            this.userInfo = null
            this.token = null
        }
    },
    persist: true
})