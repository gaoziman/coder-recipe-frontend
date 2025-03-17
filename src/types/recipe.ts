// 菜谱详情类型
export interface Recipe {
    id: string;
    title: string;
    description: string;
    coverImage: string;
    publishDate: string;
    cookingTime: string;
    difficulty: string;
    servings: string;
    calories: string;
    rating: number;
    reviewCount: number;
    views: number;
    likes: number;
    tags: string[];
    author: {
        id: string;
        name: string;
        avatar: string;
    };
    ingredients: {
        main: Array<{
            name: string;
            amount: string;
        }>;
        seasoning: Array<{
            name: string;
            amount: string;
        }>;
    };
    tools: Array<{
        name: string;
        amount: string;
    }>;
    steps: Array<{
        title: string;
        description: string;
        image?: string;
    }>;
    cookingTips: string[];
    nutrition: Array<{
        name: string;
        value: string;
        percentage: number;
    }>;
    nutritionTip: string;
    reviews: Array<Review>;
}

// 评论类型
export interface Review {
    id: string;
    username: string;
    avatar: string;
    date: string;
    rating: number;
    comment: string;
    image?: string;
    likes: number;
    isLiked: boolean;
    replies?: Array<{
        username: string;
        avatar: string;
        date: string;
        content: string;
        isAuthor: boolean;
    }>;
}

// 相关菜谱类型
export interface RelatedRecipe {
    id: string;
    title: string;
    image: string;
    cookingTime: string;
    difficulty: string;
    description: string;
}

// 菜谱过滤条件类型
export interface RecipeFilters {
    category?: string;
    cookingMethod?: string;
    difficulty?: string;
    cookingTime?: string;
    tags: string[];
}

// 分页查询参数类型
export interface PaginationParams {
    page: number;
    pageSize: number;
}

// 分页结果类型
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

// 菜谱查询参数类型
export interface RecipeQueryParams extends PaginationParams {
    search?: string;
    sort?: string;
    category?: string;
    cookingMethod?: string;
    difficulty?: string;
    cookingTime?: string;
    tags?: string[];
}

// 分类信息类型
export interface CategoryInfo {
    id: string;
    name: string;
    description: string;
    coverImage: string;
    stats: Array<{
        label: string;
        value: string;
    }>;
    subCategories: Array<{
        id: string;
        name: string;
    }>;
}

// 分类菜谱查询参数类型
export interface CategoryRecipeParams extends PaginationParams {
    categoryId: string;
    subCategoryId?: string;
    sort?: string;
    difficulty?: string;
}

// 标签类型
export interface Tag {
    id: string;
    name: string;
    count: number;
}

// 热门菜谱类型
export interface PopularRecipe {
    id: string;
    title: string;
    image: string;
    rating: number;
    views: number;
    difficulty: string;
    cookingTime: string;
}

// 厨师类型
export interface Chef {
    id: string;
    name: string;
    avatar: string;
    recipeCount: number;
    followers: number;
}

// 添加评论参数类型
export interface AddCommentParams {
    recipeId: string;
    content: string;
    rating: number;
}