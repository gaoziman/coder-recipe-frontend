import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    Recipe,
    RecipeQueryParams,
    Pagination,
    getRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe
} from '@/services/recipe'

export const useRecipeStore = defineStore('recipe', () => {
    // 菜谱列表
    const recipeList = ref<Recipe[]>([])

    // 当前菜谱详情
    const currentRecipe = ref<Recipe | null>(null)

    // 加载状态
    const loading = ref(false)
    const saving = ref(false)
    const deleting = ref(false)

    // 分页信息
    const pagination = ref<Pagination>({
        current: 1,
        pageSize: 10,
        total: 0
    })

    // 查询参数
    const queryParams = ref<RecipeQueryParams>({
        page: 1,
        pageSize: 10
    })

    // 获取菜谱列表
    const fetchRecipes = async (params?: RecipeQueryParams) => {
        try {
            loading.value = true

            // 合并查询参数
            const mergedParams = { ...queryParams.value, ...params }
            queryParams.value = mergedParams

            const response = await getRecipes(mergedParams)

            recipeList.value = response.recipes
            pagination.value = response.pagination

            return response
        } catch (error) {
            console.error('加载菜谱列表失败:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    // 获取菜谱详情
    const fetchRecipeById = async (id: number | string) => {
        try {
            loading.value = true

            const recipe = await getRecipeById(id)
            currentRecipe.value = recipe

            return recipe
        } catch (error) {
            console.error('加载菜谱详情失败:', error)
            currentRecipe.value = null
            throw error
        } finally {
            loading.value = false
        }
    }

    // 创建菜谱
    const addRecipe = async (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'author'>, imageFile?: File) => {
        try {
            saving.value = true

            const newRecipe = await createRecipe(recipeData, imageFile)

            // 添加到列表首位（如果列表是当前用户的菜谱列表）
            if (recipeList.value.length > 0 && (
                !queryParams.value.authorId || // 全部菜谱
                newRecipe.author?.id === queryParams.value.authorId // 当前用户的菜谱
            )) {
                recipeList.value = [newRecipe, ...recipeList.value]
                // 更新总数
                pagination.value.total += 1
            }

            return newRecipe
        } catch (error) {
            console.error('创建菜谱失败:', error)
            throw error
        } finally {
            saving.value = false
        }
    }

    // 更新菜谱
    const editRecipe = async (id: number | string, recipeData: Partial<Recipe>, imageFile?: File) => {
        try {
            saving.value = true

            const updatedRecipe = await updateRecipe(id, recipeData, imageFile)

            // 更新当前查看的菜谱（如果ID匹配）
            if (currentRecipe.value && currentRecipe.value.id === updatedRecipe.id) {
                currentRecipe.value = updatedRecipe
            }

            // 更新列表中的菜谱（如果存在）
            const index = recipeList.value.findIndex(recipe => recipe.id === updatedRecipe.id)
            if (index !== -1) {
                recipeList.value[index] = updatedRecipe
            }

            return updatedRecipe
        } catch (error) {
            console.error('更新菜谱失败:', error)
            throw error
        } finally {
            saving.value = false
        }
    }

    // 删除菜谱
    const removeRecipe = async (id: number | string) => {
        try {
            deleting.value = true

            await deleteRecipe(id)

            // 从列表中移除
            recipeList.value = recipeList.value.filter(recipe => recipe.id !== id)

            // 更新总数
            pagination.value.total -= 1

            // 如果当前查看的菜谱被删除，清空当前菜谱
            if (currentRecipe.value && currentRecipe.value.id === id) {
                currentRecipe.value = null
            }

            return true
        } catch (error) {
            console.error('删除菜谱失败:', error)
            throw error
        } finally {
            deleting.value = false
        }
    }

    // 清空当前菜谱
    const clearCurrentRecipe = () => {
        currentRecipe.value = null
    }

    // 重置查询参数
    const resetQueryParams = () => {
        queryParams.value = {
            page: 1,
            pageSize: 10
        }
    }

    return {
        recipeList,
        currentRecipe,
        loading,
        saving,
        deleting,
        pagination,
        queryParams,
        fetchRecipes,
        fetchRecipeById,
        addRecipe,
        editRecipe,
        removeRecipe,
        clearCurrentRecipe,
        resetQueryParams
    }
})