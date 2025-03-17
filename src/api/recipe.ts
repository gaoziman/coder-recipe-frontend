import type {
    Recipe,
    PaginatedResponse,
    RecipeQueryParams,
    CategoryInfo,
    CategoryRecipeParams,
    Tag,
    PopularRecipe,
    Chef,
    AddCommentParams
} from '@/types/recipe'
import { message } from 'ant-design-vue'
import { generateMockRecipes, generateMockRelatedRecipes } from '@/utils/mockDataGenerator'

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取菜谱列表
 */
export const fetchRecipes = async (params: RecipeQueryParams): Promise<PaginatedResponse<Recipe>> => {
    try {
        // 模拟API请求延迟
        await delay(800)

        // 生成模拟数据
        const data = generateMockRecipes(30)

        // 应用搜索过滤
        let filteredData = [...data]
        if (params.search) {
            const searchLower = params.search.toLowerCase()
            filteredData = filteredData.filter(recipe =>
                recipe.title.toLowerCase().includes(searchLower) ||
                recipe.description.toLowerCase().includes(searchLower) ||
                recipe.tags.some(tag => tag.toLowerCase().includes(searchLower))
            )
        }

        // 应用分类过滤
        if (params.category) {
            // 这里应该根据实际需求设计过滤逻辑
            filteredData = filteredData.filter(recipe => recipe.tags.includes(params.category!))
        }

        // 应用烹饪方式过滤
        if (params.cookingMethod) {
            filteredData = filteredData.filter(recipe => recipe.tags.includes(params.cookingMethod!))
        }

        // 应用难度过滤
        if (params.difficulty) {
            filteredData = filteredData.filter(recipe => recipe.difficulty === params.difficulty)
        }

        // 应用烹饪时间过滤
        if (params.cookingTime) {
            // 这里需要根据烹饪时间的格式进行适当的过滤
            // 例如 '15分钟' 应该小于 '30分钟'
            // 简化处理，仅按字符串匹配
            filteredData = filteredData.filter(recipe => recipe.cookingTime.includes(params.cookingTime!))
        }

        // 应用标签过滤
        if (params.tags && params.tags.length > 0) {
            filteredData = filteredData.filter(recipe =>
                params.tags!.some(tag => recipe.tags.includes(tag))
            )
        }

        // 应用排序
        if (params.sort) {
            switch (params.sort) {
                case 'latest':
                    filteredData.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
                    break
                case 'rating':
                    filteredData.sort((a, b) => b.rating - a.rating)
                    break
                case 'fast':
                    // 简化处理，只按时间字符串的首个数字比较
                    filteredData.sort((a, b) => {
                        const aTime = parseInt(a.cookingTime.match(/\d+/)?.[0] || '0')
                        const bTime = parseInt(b.cookingTime.match(/\d+/)?.[0] || '0')
                        return aTime - bTime
                    })
                    break
                default: // 默认按人气（likes）排序
                    filteredData.sort((a, b) => b.likes - a.likes)
            }
        }

        // 应用分页
        const start = (params.page - 1) * params.pageSize
        const end = start + params.pageSize
        const paginatedData = filteredData.slice(start, end)

        return {
            data: paginatedData,
            total: filteredData.length,
            page: params.page,
            pageSize: params.pageSize
        }

    } catch (error) {
        console.error('获取菜谱列表失败:', error)
        message.error('获取菜谱列表失败')
        throw error
    }
}

/**
 * 获取菜谱详情
 */
export const fetchRecipeDetail = async (id: string): Promise<Recipe> => {
    try {
        // 模拟API请求延迟
        await delay(500)

        // 生成模拟数据
        const mockRecipes = generateMockRecipes(1)
        const recipe = mockRecipes[0]

        // 设置ID，保证与请求的ID一致
        recipe.id = id

        return recipe
    } catch (error) {
        console.error('获取菜谱详情失败:', error)
        message.error('获取菜谱详情失败')
        throw error
    }
}

/**
 * 获取分类信息
 */
export const fetchCategoryInfo = async (categoryId: string): Promise<CategoryInfo> => {
    try {
        // 模拟API请求延迟
        await delay(300)

        // 返回模拟数据
        return {
            id: categoryId,
            name: getCategoryName(categoryId),
            description: '探索多样化的美食，从家常便饭到宴客佳肴，总有一款适合您的口味和场合',
            coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
            stats: [
                { label: '菜谱总数', value: '287' },
                { label: '平均评分', value: '4.6' },
                { label: '烹饪难度', value: '中等' }
            ],
            subCategories: [
                { id: 'popular', name: '人气菜品' },
                { id: 'seasonal', name: '时令特色' },
                { id: 'quick', name: '快手菜' },
                { id: 'vegetarian', name: '素食主义' },
                { id: 'festival', name: '节日菜谱' },
                { id: 'health', name: '养生保健' }
            ]
        }
    } catch (error) {
        console.error('获取分类信息失败:', error)
        message.error('获取分类信息失败')
        throw error
    }
}

/**
 * 获取分类下的菜谱
 */
export const fetchCategoryRecipes = async (params: CategoryRecipeParams): Promise<PaginatedResponse<Recipe>> => {
    try {
        // 模拟API请求延迟
        await delay(600)

        // 生成模拟数据
        const data = generateMockRecipes(24)

        // 应用子分类过滤
        let filteredData = [...data]
        if (params.subCategoryId && params.subCategoryId !== 'all') {
            // 根据子分类ID过滤，这里简单处理
            filteredData = filteredData.filter((_, index) => index % 3 === 0)
        }

        // 应用难度过滤
        if (params.difficulty) {
            filteredData = filteredData.filter(recipe => recipe.difficulty === params.difficulty)
        }

        // 应用排序
        if (params.sort) {
            switch (params.sort) {
                case 'latest':
                    filteredData.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
                    break
                case 'rating':
                    filteredData.sort((a, b) => b.rating - a.rating)
                    break
                default: // 默认按人气（likes）排序
                    filteredData.sort((a, b) => b.likes - a.likes)
            }
        }

        // 应用分页
        const start = (params.page - 1) * params.pageSize
        const end = start + params.pageSize
        const paginatedData = filteredData.slice(start, end)

        return {
            data: paginatedData,
            total: filteredData.length,
            page: params.page,
            pageSize: params.pageSize
        }

    } catch (error) {
        console.error('获取分类菜谱失败:', error)
        message.error('获取分类菜谱失败')
        throw error
    }
}

/**
 * 获取热门标签
 */
export const fetchPopularTags = async (categoryId: string): Promise<Tag[]> => {
    try {
        // 模拟API请求延迟
        await delay(200)

        // 返回模拟数据
        return [
            { id: 'tag1', name: '家常菜', count: 56 },
            { id: 'tag2', name: '快手菜', count: 43 },
            { id: 'tag3', name: '下饭菜', count: 38 },
            { id: 'tag4', name: '美容', count: 32 },
            { id: 'tag5', name: '减脂', count: 29 },
            { id: 'tag6', name: '增肌', count: 25 },
            { id: 'tag7', name: '早餐', count: 24 },
            { id: 'tag8', name: '晚餐', count: 22 },
            { id: 'tag9', name: '宵夜', count: 19 },
            { id: 'tag10', name: '下午茶', count: 17 },
            { id: 'tag11', name: '儿童', count: 15 },
            { id: 'tag12', name: '老人', count: 12 }
        ]
    } catch (error) {
        console.error('获取热门标签失败:', error)
        throw error
    }
}

/**
 * 获取热门菜谱
 */
export const fetchPopularRecipes = async (categoryId: string): Promise<PopularRecipe[]> => {
    try {
        // 模拟API请求延迟
        await delay(300)

        // 返回模拟数据
        return [
            {
                id: 'pop1',
                title: '红烧排骨',
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
                rating: 4.8,
                views: 15820,
                difficulty: '简单',
                cookingTime: '40分钟'
            },
            {
                id: 'pop2',
                title: '糖醋里脊',
                image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637',
                rating: 4.7,
                views: 12456,
                difficulty: '适中',
                cookingTime: '30分钟'
            },
            {
                id: 'pop3',
                title: '麻婆豆腐',
                image: 'https://images.unsplash.com/photo-1541379889336-70f26e4c4617',
                rating: 4.6,
                views: 10235,
                difficulty: '简单',
                cookingTime: '20分钟'
            },
            {
                id: 'pop4',
                title: '水煮鱼',
                image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d',
                rating: 4.9,
                views: 9876,
                difficulty: '困难',
                cookingTime: '35分钟'
            },
            {
                id: 'pop5',
                title: '蔬菜沙拉',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
                rating: 4.5,
                views: 8754,
                difficulty: '简单',
                cookingTime: '15分钟'
            }
        ]
    } catch (error) {
        console.error('获取热门菜谱失败:', error)
        throw error
    }
}

/**
 * 获取精选厨师
 */
export const fetchFeaturedChefs = async (): Promise<Chef[]> => {
    try {
        // 模拟API请求延迟
        await delay(300)

        // 返回模拟数据
        return [
            {
                id: 'chef1',
                name: '小厨当家',
                avatar: 'https://i.pravatar.cc/150?img=32',
                recipeCount: 86,
                followers: 12500
            },
            {
                id: 'chef2',
                name: '美食达人',
                avatar: 'https://i.pravatar.cc/150?img=26',
                recipeCount: 62,
                followers: 9800
            },
            {
                id: 'chef3',
                name: '家常好味',
                avatar: 'https://i.pravatar.cc/150?img=48',
                recipeCount: 45,
                followers: 7600
            }
        ]
    } catch (error) {
        console.error('获取精选厨师失败:', error)
        throw error
    }
}

/**
 * 点赞评论
 */
export const likeReviewApi = async (reviewId: string): Promise<void> => {
    try {
        // 模拟API请求延迟
        await delay(200)

        // 实际项目中应调用API点赞评论
        // 这里只做模拟，实际应用中应返回更新后的点赞数据
        console.log(`点赞评论: ${reviewId}`)
    } catch (error) {
        console.error('点赞评论失败:', error)
        message.error('点赞评论失败')
        throw error
    }
}

/**
 * 添加评论回复
 */
export const addReplyApi = async (reviewId: string, content: string): Promise<void> => {
    try {
        // 模拟API请求延迟
        await delay(300)

        // 实际项目中应调用API添加回复
        console.log(`回复评论 ${reviewId}: ${content}`)
    } catch (error) {
        console.error('添加回复失败:', error)
        message.error('添加回复失败')
        throw error
    }
}

/**
 * 添加评论
 */
export const addCommentApi = async (params: AddCommentParams): Promise<void> => {
    try {
        // 模拟API请求延迟
        await delay(500)

        // 实际项目中应调用API添加评论
        console.log('添加评论:', params)
    } catch (error) {
        console.error('添加评论失败:', error)
        message.error('添加评论失败')
        throw error
    }
}

/**
 * 辅助函数：获取分类名称
 */
function getCategoryName(categoryId: string): string {
    const categoryMap: Record<string, string> = {
        'chinese': '中式料理',
        'western': '西式料理',
        'japanese': '日式料理',
        'korean': '韩式料理',
        'southeast': '东南亚料理',
        'fusion': '创意融合',
        'seafood': '海鲜料理',
        'meat': '肉类料理',
        'vegetable': '蔬菜料理',
        'dessert': '甜点烘焙',
        'breakfast': '早餐',
        'lunch': '午餐',
        'dinner': '晚餐',
        'snack': '小吃点心'
    }

    return categoryMap[categoryId] || '未知分类'
}