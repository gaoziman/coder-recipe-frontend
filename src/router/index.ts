import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import {useUserStore} from "@/stores/user";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: BasicLayout,
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/views/Home/index.vue'),
                meta: {
                    title: '首页',
                    requiresAuth: false
                }
            },
            // {
            //     path: '/recipes',
            //     name: 'Recipes',
            //     component: () => import('@/views/Recipes/index.vue'),
            //     meta: {
            //         title: '我的菜谱',
            //         requiresAuth: true
            //     }
            // },
            // {
            //     path: '/recipes/add',
            //     name: 'AddRecipe',
            //     component: () => import('@/views/Recipes/Add.vue'),
            //     meta: {
            //         title: '新建菜谱',
            //         requiresAuth: true
            //     }
            // },
            // {
            //     path: '/ingredients',
            //     name: 'Ingredients',
            //     component: () => import('@/views/Ingredients/index.vue'),
            //     meta: {
            //         title: '食材管理',
            //         requiresAuth: true
            //     }
            // },
            // {
            //     path: '/ingredients/:id',
            //     name: 'IngredientDetail',
            //     component: () => import('@/views/Ingredients/Detail.vue'),
            //     meta: {
            //         title: '食材详情',
            //         requiresAuth: true
            //     }
            // },
            // {
            //     path: '/shopping',
            //     name: 'Shopping',
            //     component: () => import('@/views/Shopping/index.vue'),
            //     meta: {
            //         title: '购物清单',
            //         requiresAuth: true
            //     }
            // },
            // {
            //     path: '/statistics',
            //     name: 'Statistics',
            //     component: () => import('@/views/Statistics/index.vue'),
            //     meta: {
            //         title: '数据统计',
            //         requiresAuth: true
            //     }
            // },
            // 用户相关路由
            {
                path: 'ProfileSidebar/profile',
                name: 'UserProfile',
                component: () => import('@/views/User/index.vue'),
                meta: { title: '个人中心', requiresAuth: true }
            },
            {
                path: '/settings',
                name: 'Settings',
                component: () => import('@/views/User/setting.vue'),
                meta: {
                    title: '设置',
                    requiresAuth: true
                }
            },
            {
                path: '/help',
                name: 'Help',
                component: () => import('@/views/User/help.vue'),
                meta: {
                    title: '帮助与反馈',
                    requiresAuth: true
                }
            }
        ]
    },
    /*{
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login/index.vue'),
        meta: {
            title: '登录',
            requiresAuth: false
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register/index.vue'),
        meta: {
            title: '注册',
            requiresAuth: false
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound/index.vue'),
        meta: {
            title: '404',
            requiresAuth: false
        }
    }*/
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    document.title = `${to.meta.title} - 我的菜谱管家`

    // 获取用户信息
    const userStore = useUserStore()
    const isLoggedIn = userStore.isLoggedIn

    // 需要登录但未登录
    if (to.meta.requiresAuth && !isLoggedIn) {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
        return
    }

    // 已登录用户访问登录页，重定向到首页
    if (isLoggedIn && (to.name === 'Login' || to.name === 'Register')) {
        next({ name: 'Home' })
        return
    }

    next()
})

// 全局前置守卫
/*router.beforeEach((to, from, next) => {
    // 设置页面标题
    document.title = `${to.meta.title || '食谱中心'} - 美食爱好者的社区`

    // 检查是否需要身份验证
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // 这里检查用户是否已登录
        const isLoggedIn = localStorage.getItem('token') !== null

        if (!isLoggedIn) {
            // 如果未登录，重定向到登录页
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next() // 已登录，继续导航
        }
    } else {
        next() // 不需要身份验证，继续导航
    }
})*/

export default router