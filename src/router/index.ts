import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/home/Home.vue')
    },
    {
        path: '/recipes',
        name: 'Recipes',
        component: () => import('@/pages/home/Home.vue') // 暂时重定向到首页
    },
    {
        path: '/ingredients',
        name: 'Ingredients',
        component: () => import('@/pages/home/Home.vue') // 暂时重定向到首页
    },
    {
        path: '/collections',
        name: 'Collections',
        component: () => import('@/pages/home/Home.vue') // 暂时重定向到首页
    },
    {
        path: '/tips',
        name: 'CookingTips',
        component: () => import('@/pages/home/Home.vue') // 暂时重定向到首页
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router