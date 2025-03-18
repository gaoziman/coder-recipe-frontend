import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import {useUserStore} from '@/stores/user'
import {message} from 'ant-design-vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/home/Home.vue'),
        meta: {
            title: '首页',
            requiresAuth: false
        }
    },
    {
        path: '/ai',
        name: 'KitchenAssistant',
        component: () => import('@/pages/kitchenai/KitchenAssistant.vue'),
        meta: {
            title: 'AI食材搭配',
            requiresAuth: false
        }
    },
    {
        path: '/ingredients',
        name: 'IngredientList',
        component: () => import('@/pages/ingredient/IngredientList.vue'),
        meta: {
            title: '食材库',
            requiresAuth: false
        }
    },
    {
        path: '/ingredient/category/:categoryId',
        name: 'IngredientCategory',
        component: () => import('@/pages/ingredient/IngredientCategory.vue'),
        meta: {
            title: '食材分类',
            requiresAuth: false
        }
    },
    {
        path: '/ingredient/:id',
        name: 'IngredientDetail',
        component: () => import('@/pages/ingredient/IngredientDetail.vue'),
        meta: {
            title: '食材详情',
            requiresAuth: false
        }
    },
    {
        path: '/ingredient/seasonal',
        name: 'SeasonalIngredients',
        component: () => import('@/pages/ingredient/SeasonalIngredients.vue'),
        meta: {
            title: '当季食材',
            requiresAuth: false
        }
    },
    {
        path: '/recipes',
        name: 'RecipeList',
        component: () => import('@/pages/recipes/RecipeList.vue'),
        meta: {
            title: '菜谱列表',
            requiresAuth: false
        }
    },
    {
        path: '/recipes/:id',
        name: 'RecipeDetail',
        component: () => import('@/pages/recipes/RecipeDetail.vue'),
        meta: {
            title: '菜谱详情',
            requiresAuth: false
        }
    },
    {
        path: '/recipes/category/:categoryId',
        name: 'RecipeCategory',
        component: () => import('@/pages/recipes/RecipeCategory.vue'),
        meta: {
            title: '菜谱分类',
            requiresAuth: false
        }
    },
    {
        path: '/create-recipe',
        name: 'CreateRecipe',
        component: () => import('@/pages/recipes/RecipeAdd.vue'),
        meta: {
            title: '创建菜谱',
            requiresAuth: true
        }
    },
    {
        path: '/edit-recipe/:id',
        name: 'EditRecipe',
        component: () => import('@/pages/recipes/EditRecipe.vue'),
        meta: {
            title: '编辑菜谱',
            requiresAuth: true
        }
    },
    {
        path: '/collections',
        name: 'CollectionList',
        component: () => import('@/pages/collections/CollectionList.vue'),
        meta: {
            title: '合集列表',
            requiresAuth: false
        }
    },
    {
        path: '/collections/:id',
        name: 'CollectionDetail',
        component: () => import('@/pages/collections/CollectionDetail.vue'),
        meta: {
            title: '合集详情',
            requiresAuth: false
        }
    },
    {
        path: '/tips',
        name: 'CookingTipsList',
        component: () => import('@/pages/tips/CookingTipsList.vue'),
        meta: {
            title: '烹饪技巧列表',
            requiresAuth: false
        }
    },
    {
        path: '/tips/:id',
        name: 'CookingTipDetail',
        component: () => import('@/pages/tips/CookingTipsDetail.vue'),
        meta: {
            title: '烹饪技巧详情',
            requiresAuth: false
        }
    },
    // 用户相关路由 - 需要登录权限
    {
        path: '/user',
        name: 'UserLayout',
        component: () => import('@/pages/user/UserLayout.vue'),
        meta: {
            title: '用户中心',
            requiresAuth: true
        },
        children: [
            {
                path: 'profile',
                name: 'UserProfile',
                component: () => import('@/pages/user/UserProfile.vue'),
                meta: {
                    title: '个人资料',
                    requiresAuth: true
                }
            },
            {
                path: 'recipes',
                name: 'Recipes',
                component: () => import('@/pages/user/MyRecipes.vue'),
                meta: {
                    title: '我的菜谱',
                    requiresAuth: true
                }
            },
            {
                path: 'favorites',
                name: 'UserFavorites',
                component: () => import('@/pages/user/UserFavorites.vue'),
                meta: {
                    title: '我的收藏',
                    requiresAuth: true
                }
            },
            {
                path: 'ingredients',
                name: 'IngredientManagement',
                component: () => import('@/pages/user/IngredientManagement.vue'),
                meta: {
                    title: '食材管理',
                    requiresAuth: true
                }
            },
            {
                path: 'shopping',
                name: 'ShoppingList',
                component: () => import('@/pages/user/ShoppingList.vue'),
                meta: {
                    title: '购物清单',
                    requiresAuth: true
                }
            },
            {
                path: 'statistics',
                name: 'DataStatistics',
                component: () => import('@/pages/user/DataStatistics.vue'),
                meta: {
                    title: '数据统计',
                    requiresAuth: true
                }
            },
            {
                path: 'history',
                name: 'BrowseHistory',
                component: () => import('@/pages/user/BrowseHistory.vue'),
                meta: {
                    title: '浏览历史',
                    requiresAuth: true
                }
            },
            {
                path: 'notification',
                name: 'NotificationSettings',
                component: () => import('@/pages/settings/NotificationSettings.vue'),
                meta: {
                    title: '通知设置',
                    requiresAuth: true
                }
            },
            {
                path: 'privacy',
                name: 'PrivacySettings',
                component: () => import('@/pages/settings/PrivacySettings.vue'),
                meta: {
                    title: '隐私设置',
                    requiresAuth: true
                }
            }
        ]
    },
    // 添加管理员相关路由 - 需要放在现有路由的适当位置
    {
        path: '/admin',
        name: 'AdminLayout',
        component: () => import('@/pages/admin/AdminLayout.vue'),
        meta: {
            title: '管理中心',
            requiresAuth: true,
            requiresAdmin: true  // 新增权限标识
        },
        redirect: '/admin/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'AdminDashboard',
                component: () => import('@/pages/admin/Dashboard.vue'),
                meta: {
                    title: '管理控制台',
                    requiresAuth: true,
                    requiresAdmin: true
                }
            },
            {
                path: 'recipes',
                name: 'AdminRecipes',
                component: () => import('@/pages/admin/RecipeManagement.vue'),
                meta: {
                    title: '菜谱管理',
                    requiresAuth: true,
                    requiresAdmin: true
                }
            },
            {
                path: 'categories',
                name: 'AdminCategories',
                component: () => import('@/pages/admin/CategoryManagement.vue'),
                meta: {
                    title: '分类管理',
                    requiresAuth: true,
                    requiresAdmin: true
                }
            },
            {
                path: 'tags',
                name: 'AdminTags',
                component: () => import('@/pages/admin/TagManagement.vue'),
                meta: {
                    title: '标签管理',
                    requiresAuth: true,
                    requiresAdmin: true
                }
            },
            {
                path: 'tips',
                name: 'AdminTips',
                component: () => import('@/pages/admin/TipsManagement.vue'),
                meta: {
                    title: '烹饪小贴士管理',
                    requiresAuth: true,
                    requiresAdmin: true
                }
            },
            {
                path: 'ingredients',
                name: 'AdminIngredients',
                component: () => import('@/pages/admin/IngredientManagement.vue'),
                meta: {
                    title: '食材管理',
                    requiresAuth: true,
                    requiresAdmin: true
                }
            },
            {
                path: 'users',
                name: 'AdminUsers',
                component: () => import('@/pages/admin/UserManagement.vue'),
                meta: {
                    title: '用户管理',
                    requiresAuth: true,
                    requiresAdmin: true
                }
            },
            {
                path: 'systemSettings',
                name: 'SystemSettings',
                component: () => import('@/pages/admin/SystemSettings.vue'),
                meta: {
                    title: '系统管理',
                    requiresAuth: true,
                    requiresAdmin: true
                }
            },
            {
                path: 'contentReview',
                name: 'ContentReview',
                component: () => import('@/pages/admin/ContentReview.vue'),
                meta: {
                    title: '审核管理',
                    requiresAuth: true,
                    requiresAdmin: true
                }
            }
        ]
    },
    // 404 路由
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/pages/errors/NotFound.vue'),
        meta: {
            title: '页面未找到',
            requiresAuth: false
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        // 始终滚动到顶部
        return {top: 0}
    }
})

// 全局前置守卫
// 在router/index.ts的全局前置守卫中添加权限检查逻辑
router.beforeEach((to, from, next) => {
    // 设置文档标题的逻辑
    if (to.meta.title) {
        document.title = `${to.meta.title} - 味见好时光`
    }

    // 检查路由是否需要登录权限
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    // 检查路由是否需要管理员权限
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

    if (requiresAuth || requiresAdmin) {
        // 获取用户登录状态
        const userStore = useUserStore()

        if (!userStore.isLoggedIn) {
            // 用户未登录，显示提示并重定向到首页
            message.warning('请先登录以访问此页面')
            localStorage.setItem('redirectPath', to.fullPath)
            next({path: '/'})
            window.dispatchEvent(new CustomEvent('show-login-modal'))
            return
        }

        // 检查管理员权限
        if (requiresAdmin && !userStore.userInfo.isAdmin) {
            message.error('您没有管理员权限访问此页面')
            next({path: '/'})
            return
        }
    }

    // 允许访问
    next()
})

export default router