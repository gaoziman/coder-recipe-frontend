// stores/shoppingStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ShoppingItem, ShoppingList, Recipe } from '@/types/shopping';

/**
 * 购物清单状态管理
 */
export const useShoppingStore = defineStore('shopping', () => {
    // 购物清单列表
    const shoppingLists = ref<ShoppingList[]>([
        { id: 'all', name: '全部清单', isDefault: true },
        { id: 'weekend', name: '周末购物' },
        { id: 'birthday', name: '生日聚会' },
        { id: 'daily', name: '日常采购' }
    ]);

    // 当前选中的清单ID
    const currentListId = ref('all');

    // 购物项列表
    const items = ref<ShoppingItem[]>([
        // 蔬果类
        {
            id: 1,
            name: '西红柿',
            quantity: 500,
            unit: '克',
            category: 'vegetable',
            price: 8.5,
            completed: true,
            listId: 'all'
        },
        {
            id: 2,
            name: '黄瓜',
            quantity: 2,
            unit: '根',
            category: 'vegetable',
            price: 4.0,
            completed: false,
            listId: 'all'
        },
        {
            id: 3,
            name: '青椒',
            quantity: 300,
            unit: '克',
            category: 'vegetable',
            price: 6.5,
            completed: false,
            listId: 'all'
        },
        {
            id: 4,
            name: '胡萝卜',
            quantity: 2,
            unit: '根',
            category: 'vegetable',
            price: 3.5,
            completed: true,
            listId: 'all'
        },
        // 肉禽蛋奶
        {
            id: 5,
            name: '鸡胸肉',
            quantity: 500,
            unit: '克',
            category: 'meat',
            price: 28.0,
            completed: true,
            listId: 'all'
        },
        {
            id: 6,
            name: '猪里脊',
            quantity: 400,
            unit: '克',
            category: 'meat',
            price: 32.0,
            completed: false,
            listId: 'all'
        },
        {
            id: 7,
            name: '鸡蛋',
            quantity: 1,
            unit: '盒',
            category: 'meat',
            price: 15.8,
            completed: true,
            listId: 'all'
        },
        // 调味品
        {
            id: 8,
            name: '生抽',
            quantity: 1,
            unit: '瓶',
            category: 'seasoning',
            price: 16.8,
            completed: true,
            listId: 'all'
        },
        {
            id: 9,
            name: '蚝油',
            quantity: 1,
            unit: '瓶',
            category: 'seasoning',
            price: 22.5,
            completed: false,
            listId: 'all'
        }
    ]);

    // 推荐菜谱
    const recommendedRecipes = ref<Recipe[]>([
        {
            id: 1,
            name: '糖醋排骨',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
            ingredientCount: 8,
            rating: 4.8,
            availableIngredients: 5
        },
        {
            id: 2,
            name: '香煎三文鱼',
            image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
            ingredientCount: 6,
            rating: 4.5,
            availableIngredients: 4
        }
    ]);

    // 搜索关键词
    const searchKeyword = ref('');

    // 根据当前清单和搜索关键词过滤购物项
    const filteredItems = computed(() => {
        return items.value.filter(item => {
            // 如果不是查看全部，且不属于当前清单，则过滤掉
            if (currentListId.value !== 'all' && item.listId !== currentListId.value) {
                return false;
            }

            // 如果有搜索关键词，但名称中不包含关键词，则过滤掉
            if (searchKeyword.value && !item.name.includes(searchKeyword.value)) {
                return false;
            }

            return true;
        });
    });

    // 按分类分组的购物项
    const categorizedItems = computed(() => {
        const result = {
            vegetable: filteredItems.value.filter(item => item.category === 'vegetable'),
            meat: filteredItems.value.filter(item => item.category === 'meat'),
            grain: filteredItems.value.filter(item => item.category === 'grain'),
            seasoning: filteredItems.value.filter(item => item.category === 'seasoning'),
            snack: filteredItems.value.filter(item => item.category === 'snack'),
            other: filteredItems.value.filter(item => item.category === 'other')
        };

        return result;
    });

    // 统计数据
    const stats = computed(() => {
        const filtered = filteredItems.value;
        const total = filtered.length;
        const completed = filtered.filter(item => item.completed).length;
        const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        const totalPrice = filtered.reduce((sum, item) => sum + item.price, 0);
        const spentAmount = filtered
            .filter(item => item.completed)
            .reduce((sum, item) => sum + item.price, 0);

        return {
            total,
            completed,
            completedPercentage,
            totalPrice,
            spentAmount
        };
    });

    // 添加购物项
    const addItem = (item: Omit<ShoppingItem, 'id'>) => {
        const newId = items.value.length > 0
            ? Math.max(...items.value.map(i => i.id)) + 1
            : 1;

        items.value.push({
            id: newId,
            ...item
        });

        return newId;
    };

    // 更新购物项
    const updateItem = (id: number, updates: Partial<Omit<ShoppingItem, 'id'>>) => {
        const index = items.value.findIndex(item => item.id === id);
        if (index !== -1) {
            items.value[index] = { ...items.value[index], ...updates };
            return true;
        }
        return false;
    };

    // 删除购物项
    const deleteItem = (id: number) => {
        const index = items.value.findIndex(item => item.id === id);
        if (index !== -1) {
            items.value.splice(index, 1);
            return true;
        }
        return false;
    };

    // 切换购物项完成状态
    const toggleItemStatus = (id: number) => {
        const index = items.value.findIndex(item => item.id === id);
        if (index !== -1) {
            items.value[index].completed = !items.value[index].completed;
            return true;
        }
        return false;
    };

    // 清空已完成项目
    const clearCompleted = () => {
        items.value = items.value.filter(item => !item.completed);
    };

    // 添加购物清单
    const addList = (name: string) => {
        const id = `list_${Date.now()}`;
        shoppingLists.value.push({
            id,
            name,
            createdAt: new Date()
        });
        return id;
    };

    // 从菜谱添加食材
    const addIngredientsFromRecipe = (recipeId: number) => {
        // 实际项目中，这里会根据菜谱ID获取所需食材并添加到购物清单
        // 这里仅作示意
        console.log(`Adding ingredients from recipe ${recipeId}`);
        return true;
    };

    // 更新搜索关键词
    const updateSearchKeyword = (keyword: string) => {
        searchKeyword.value = keyword;
    };

    // 设置当前清单
    const setCurrentList = (listId: string) => {
        currentListId.value = listId;
    };

    return {
        // 状态
        shoppingLists,
        currentListId,
        items,
        recommendedRecipes,
        searchKeyword,

        // 计算属性
        filteredItems,
        categorizedItems,
        stats,

        // 方法
        addItem,
        updateItem,
        deleteItem,
        toggleItemStatus,
        clearCompleted,
        addList,
        addIngredientsFromRecipe,
        updateSearchKeyword,
        setCurrentList
    };
});