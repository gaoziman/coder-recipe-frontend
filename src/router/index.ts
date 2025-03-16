import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/home/Home.vue')
    },
    // {
    //     path: '/recipes',
    //     name: 'Recipes',
    //     component: () => import('@/pages/recipes/RecipeList.vue')
    // },
    // {
    //     path: '/recipes/:id',
    //     name: 'RecipeDetail',
    //     component: () => import('@/pages/recipes/RecipeDetail.vue')
    // },
    // {
    //     path: '/ingredients',
    //     name: 'Ingredients',
    //     component: () => import('@/pages/ingredients/IngredientList.vue')
    // },
    // {
    //     path: '/collections',
    //     name: 'Collections',
    //     component: () => import('@/pages/collections/CollectionList.vue')
    // },
    // {
    //     path: '/tips',
    //     name: 'CookingTips',
    //     component: () => import('@/pages/tips/CookingTipsList.vue')
    // },
    // {
    //     path: '/search',
    //     name: 'Search',
    //     component: () => import('@/pages/search/SearchResults.vue')
    // },
    // 用户相关路由 - 需要登录权限
    {
        path: '/user',
        name: 'UserLayout',
        component: () => import('@/pages/user/UserLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: 'profile',
                name: 'UserProfile',
                component: () => import('@/pages/user/UserProfile.vue'),
                meta: { requiresAuth: true }
            },
            // {
            //     path: 'favorites',
            //     name: 'UserFavorites',
            //     component: () => import('@/pages/user/UserFavorites.vue'),
            //     meta: { requiresAuth: true }
            // },
            // {
            //     path: 'settings',
            //     name: 'UserSettings',
            //     component: () => import('@/pages/user/UserSettings.vue'),
            //     meta: { requiresAuth: true }
            // },
            // {
            //     path: 'recipes',
            //     name: 'UserRecipes',
            //     component: () => import('@/pages/user/UserRecipes.vue'),
            //     meta: { requiresAuth: true }
            // }
        ]
    },
    // 创建菜谱路由 - 需要登录权限
    // {
    //     path: '/create-recipe',
    //     name: 'CreateRecipe',
    //     component: () => import('@/pages/recipes/CreateRecipe.vue'),
    //     meta: { requiresAuth: true }
    // },
    // // 编辑菜谱路由 - 需要登录权限
    // {
    //     path: '/edit-recipe/:id',
    //     name: 'EditRecipe',
    //     component: () => import('@/pages/recipes/EditRecipe.vue'),
    //     meta: { requiresAuth: true }
    // },
    // // 404 路由
    // {
    //     path: '/:pathMatch(.*)*',
    //     name: 'NotFound',
    //     component: () => import('@/pages/errors/NotFound.vue')
    // }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        // 始终滚动到顶部
        return { top: 0 }
    }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 检查路由是否需要登录权限
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth) {
        // 获取用户登录状态
        const userStore = useUserStore()

        if (!userStore.isLoggedIn) {
            // 用户未登录，显示提示并重定向到首页
            message.warning('请先登录以访问此页面')

            // 把目标路由信息存到 localStorage，登录后可以重定向回来
            localStorage.setItem('redirectPath', to.fullPath)

            // 重定向到首页
            next({ path: '/' })

            // 通过事件总线触发显示登录弹窗
            // 这里需要一个全局事件总线来触发登录弹窗显示
            // 这个功能将在 main.ts 中实现
            window.dispatchEvent(new CustomEvent('show-login-modal'))

            return
        }
    }

    // 允许访问
    next()
})

export default router