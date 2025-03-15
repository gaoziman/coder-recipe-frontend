import { message } from 'ant-design-vue';
import { useUserStore } from '@/stores/user';

// 食材接口定义
export interface Ingredient {
    id?: number;
    name: string;
    amount: string;
}

// 步骤接口定义
export interface Step {
    id?: number;
    stepNumber?: number;
    description: string;
    imageUrl?: string;
}

// 菜谱接口定义
export interface Recipe {
    id?: number;
    title: string;
    cookingTime: number;
    difficulty: string;
    tags: string[];
    ingredients: Ingredient[];
    steps: Step[];
    imageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
    author?: {
        id: number;
        nickname: string;
        avatar?: string;
    };
}

// 分页接口
export interface Pagination {
    current: number;
    pageSize: number;
    total: number;
}

// 查询参数接口
export interface RecipeQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    tags?: string[];
    difficulty?: string;
    cookingTimeMin?: number;
    cookingTimeMax?: number;
    authorId?: number;
}

// 响应数据接口
export interface RecipeResponse {
    recipes: Recipe[];
    pagination: Pagination;
}

/**
 * 获取菜谱列表
 * @param params 查询参数
 * @returns 菜谱列表数据
 */
export const getRecipes = async (params: RecipeQueryParams = {}): Promise<RecipeResponse> => {
    try {
        // 在实际项目中应该调用后端API
        // const response = await axios.get('/api/recipes', { params });
        // return response.data;

        // 这里使用模拟数据
        await new Promise(resolve => setTimeout(resolve, 500));

        // 模拟数据
        const recipes: Recipe[] = [
            {
                id: 1,
                title: '蒜蓉西兰花',
                cookingTime: 15,
                difficulty: '简单',
                tags: ['快手菜', '素食'],
                ingredients: [
                    { id: 1, name: '西兰花', amount: '300克' },
                    { id: 2, name: '大蒜', amount: '3瓣' },
                    { id: 3, name: '食用油', amount: '2勺' },
                    { id: 4, name: '盐', amount: '适量' }
                ],
                steps: [
                    { id: 1, stepNumber: 1, description: '西兰花洗净切小朵，大蒜切末' },
                    { id: 2, stepNumber: 2, description: '锅中加水烧开，放入西兰花焯水1分钟后捞出' },
                    { id: 3, stepNumber: 3, description: '锅中加油，爆香蒜末，放入西兰花翻炒均匀' },
                    { id: 4, stepNumber: 4, description: '加入适量盐调味即可' }
                ],
                imageUrl: 'https://images.unsplash.com/photo-1625944221836-62d2852838bd',
                createdAt: '2024-01-20T10:30:00Z',
                updatedAt: '2024-01-20T10:30:00Z',
                author: {
                    id: 1,
                    nickname: '小厨师',
                    avatar: 'https://joeschmoe.io/api/v1/xiaochef'
                }
            },
            {
                id: 2,
                title: '番茄炒蛋',
                cookingTime: 10,
                difficulty: '简单',
                tags: ['快手菜', '家常菜'],
                ingredients: [
                    { id: 5, name: '西红柿', amount: '2个' },
                    { id: 6, name: '鸡蛋', amount: '3个' },
                    { id: 7, name: '葱', amount: '1根' },
                    { id: 8, name: '盐', amount: '适量' },
                    { id: 9, name: '糖', amount: '1小勺' }
                ],
                steps: [
                    { id: 5, stepNumber: 1, description: '西红柿洗净切块，鸡蛋打散，葱切段' },
                    { id: 6, stepNumber: 2, description: '锅中加油，倒入鸡蛋液炒熟盛出' },
                    { id: 7, stepNumber: 3, description: '锅中加油，放入葱段爆香，倒入西红柿翻炒出汁' },
                    { id: 8, stepNumber: 4, description: '加入盐和糖调味，倒入炒好的鸡蛋翻炒均匀即可' }
                ],
                imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
                createdAt: '2024-01-18T14:20:00Z',
                updatedAt: '2024-01-18T14:20:00Z',
                author: {
                    id: 1,
                    nickname: '小厨师',
                    avatar: 'https://joeschmoe.io/api/v1/xiaochef'
                }
            }
        ];

        // 根据查询参数进行过滤
        let filteredRecipes = [...recipes];
        if (params.search) {
            const searchLower = params.search.toLowerCase();
            filteredRecipes = filteredRecipes.filter(
                recipe => recipe.title.toLowerCase().includes(searchLower)
            );
        }

        if (params.tags && params.tags.length > 0) {
            filteredRecipes = filteredRecipes.filter(
                recipe => params.tags!.some(tag => recipe.tags.includes(tag))
            );
        }

        if (params.difficulty) {
            filteredRecipes = filteredRecipes.filter(
                recipe => recipe.difficulty === params.difficulty
            );
        }

        if (params.authorId) {
            filteredRecipes = filteredRecipes.filter(
                recipe => recipe.author?.id === params.authorId
            );
        }

        // 分页处理
        const page = params.page || 1;
        const pageSize = params.pageSize || 10;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedRecipes = filteredRecipes.slice(start, end);

        return {
            recipes: paginatedRecipes,
            pagination: {
                current: page,
                pageSize,
                total: filteredRecipes.length
            }
        };
    } catch (error) {
        console.error('获取菜谱列表失败:', error);
        message.error('获取菜谱列表失败，请重试');
        throw error;
    }
};

/**
 * 获取菜谱详情
 * @param id 菜谱ID
 * @returns 菜谱详情
 */
export const getRecipeById = async (id: number | string): Promise<Recipe> => {
    try {
        // 在实际项目中应该调用后端API
        // const response = await axios.get(`/api/recipes/${id}`);
        // return response.data;

        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        // 模拟数据
        const recipes: Recipe[] = [
            {
                id: 1,
                title: '蒜蓉西兰花',
                cookingTime: 15,
                difficulty: '简单',
                tags: ['快手菜', '素食'],
                ingredients: [
                    { id: 1, name: '西兰花', amount: '300克' },
                    { id: 2, name: '大蒜', amount: '3瓣' },
                    { id: 3, name: '食用油', amount: '2勺' },
                    { id: 4, name: '盐', amount: '适量' }
                ],
                steps: [
                    { id: 1, stepNumber: 1, description: '西兰花洗净切小朵，大蒜切末' },
                    { id: 2, stepNumber: 2, description: '锅中加水烧开，放入西兰花焯水1分钟后捞出' },
                    { id: 3, stepNumber: 3, description: '锅中加油，爆香蒜末，放入西兰花翻炒均匀' },
                    { id: 4, stepNumber: 4, description: '加入适量盐调味即可' }
                ],
                imageUrl: 'https://images.unsplash.com/photo-1625944221836-62d2852838bd',
                createdAt: '2024-01-20T10:30:00Z',
                updatedAt: '2024-01-20T10:30:00Z',
                author: {
                    id: 1,
                    nickname: '小厨师',
                    avatar: 'https://joeschmoe.io/api/v1/xiaochef'
                }
            },
            {
                id: 2,
                title: '番茄炒蛋',
                cookingTime: 10,
                difficulty: '简单',
                tags: ['快手菜', '家常菜'],
                ingredients: [
                    { id: 5, name: '西红柿', amount: '2个' },
                    { id: 6, name: '鸡蛋', amount: '3个' },
                    { id: 7, name: '葱', amount: '1根' },
                    { id: 8, name: '盐', amount: '适量' },
                    { id: 9, name: '糖', amount: '1小勺' }
                ],
                steps: [
                    { id: 5, stepNumber: 1, description: '西红柿洗净切块，鸡蛋打散，葱切段' },
                    { id: 6, stepNumber: 2, description: '锅中加油，倒入鸡蛋液炒熟盛出' },
                    { id: 7, stepNumber: 3, description: '锅中加油，放入葱段爆香，倒入西红柿翻炒出汁' },
                    { id: 8, stepNumber: 4, description: '加入盐和糖调味，倒入炒好的鸡蛋翻炒均匀即可' }
                ],
                imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
                createdAt: '2024-01-18T14:20:00Z',
                updatedAt: '2024-01-18T14:20:00Z',
                author: {
                    id: 1,
                    nickname: '小厨师',
                    avatar: 'https://joeschmoe.io/api/v1/xiaochef'
                }
            }
        ];

        // 查找匹配的菜谱
        const recipe = recipes.find(r => r.id === Number(id));

        if (!recipe) {
            throw new Error('菜谱不存在');
        }

        return recipe;
    } catch (error) {
        console.error('获取菜谱详情失败:', error);
        message.error('获取菜谱详情失败，请重试');
        throw error;
    }
};

/**
 * 创建新菜谱
 * @param recipeData 菜谱数据
 * @returns 创建成功的菜谱
 */
export const createRecipe = async (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'author'>, imageFile?: File): Promise<Recipe> => {
    try {
        // 在实际项目中，应该先上传图片，然后将图片URL与其他数据一起提交
        // 图片上传示例
        // let imageUrl = recipeData.imageUrl;
        // if (imageFile) {
        //   const formData = new FormData();
        //   formData.append('file', imageFile);
        //   const uploadRes = await axios.post('/api/upload', formData);
        //   imageUrl = uploadRes.data.url;
        // }

        // 提交菜谱数据
        // const response = await axios.post('/api/recipes', {
        //   ...recipeData,
        //   imageUrl
        // });
        // return response.data;

        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟创建成功的数据
        const userStore = useUserStore();
        const newRecipe: Recipe = {
            ...recipeData,
            id: Date.now(), // 使用时间戳作为临时ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: {
                id: userStore.userInfo?.id || 1,
                nickname: userStore.userInfo?.nickname || '小厨师',
                avatar: userStore.userInfo?.avatar
            }
        };

        return newRecipe;
    } catch (error) {
        console.error('创建菜谱失败:', error);
        message.error('创建菜谱失败，请重试');
        throw error;
    }
};

/**
 * 更新菜谱
 * @param id 菜谱ID
 * @param recipeData 菜谱数据
 * @returns 更新后的菜谱
 */
export const updateRecipe = async (id: number | string, recipeData: Partial<Recipe>, imageFile?: File): Promise<Recipe> => {
    try {
        // 处理逻辑类似于创建菜谱
        // 在实际项目中，应先处理图片上传，然后更新菜谱数据

        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));

        // 模拟更新成功的数据
        const updatedRecipe: Recipe = {
            ...(await getRecipeById(id)),
            ...recipeData,
            updatedAt: new Date().toISOString()
        };

        return updatedRecipe;
    } catch (error) {
        console.error('更新菜谱失败:', error);
        message.error('更新菜谱失败，请重试');
        throw error;
    }
};

/**
 * 删除菜谱
 * @param id 菜谱ID
 * @returns 是否删除成功
 */
export const deleteRecipe = async (id: number | string): Promise<boolean> => {
    try {
        // 在实际项目中应该调用后端API
        // await axios.delete(`/api/recipes/${id}`);

        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        return true;
    } catch (error) {
        console.error('删除菜谱失败:', error);
        message.error('删除菜谱失败，请重试');
        throw error;
    }
};

/**
 * 获取用户菜谱统计
 * @param userId 用户ID
 */
export const getUserRecipeStats = async (userId: number): Promise<{
    total: number;
    thisMonth: number;
    mostCooked: Recipe | null;
}> => {
    try {
        // 在实际项目中应该调用后端API
        // const response = await axios.get(`/api/users/${userId}/recipe-stats`);
        // return response.data;

        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 400));

        // 模拟数据
        return {
            total: 32,
            thisMonth: 5,
            mostCooked: {
                id: 2,
                title: '番茄炒蛋',
                cookingTime: 10,
                difficulty: '简单',
                tags: ['快手菜', '家常菜'],
                ingredients: [
                    { name: '西红柿', amount: '2个' },
                    { name: '鸡蛋', amount: '3个' }
                ],
                steps: [
                    { description: '西红柿洗净切块，鸡蛋打散' },
                    { description: '锅中加油，倒入鸡蛋液炒熟盛出' }
                ],
                imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
            }
        };
    } catch (error) {
        console.error('获取用户菜谱统计失败:', error);
        return {
            total: 0,
            thisMonth: 0,
            mostCooked: null
        };
    }
};