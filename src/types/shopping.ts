// types/shopping.ts

import { Component } from 'vue';

/**
 * 购物清单项目接口
 */
export interface ShoppingItem {
    /** 唯一标识 */
    id: number;
    /** 食材名称 */
    name: string;
    /** 数量 */
    quantity: number;
    /** 单位 */
    unit: string;
    /** 分类 */
    category: 'vegetable' | 'meat' | 'grain' | 'seasoning' | 'snack' | 'other';
    /** 价格 */
    price: number;
    /** 是否已购买 */
    completed: boolean;
    /** 所属清单ID */
    listId: string;
    /** 备注 */
    notes?: string;
}

/**
 * 购物清单列表接口
 */
export interface ShoppingList {
    /** 唯一标识 */
    id: string;
    /** 清单名称 */
    name: string;
    /** 是否为默认清单 */
    isDefault?: boolean;
    /** 创建时间 */
    createdAt?: Date;
}

/**
 * 菜谱接口
 */
export interface Recipe {
    /** 唯一标识 */
    id: number;
    /** 菜谱名称 */
    name: string;
    /** 菜谱图片 */
    image: string;
    /** 所需食材数量 */
    ingredientCount: number;
    /** 评分 */
    rating?: number;
    /** 已有食材数量 */
    availableIngredients?: number;
}

/**
 * 常买清单分类接口
 */
export interface FrequentCategory {
    /** 唯一标识 */
    id: number;
    /** 分类名称 */
    name: string;
    /** 图标组件 */
    icon: Component | string;
    /** 图标CSS类名 */
    iconClass: string;
}

/**
 * 分享方式接口
 */
export interface ShareMethod {
    /** 唯一标识 */
    id: string;
    /** 方式名称 */
    name: string;
    /** 图标组件 */
    icon: Component | string;
    /** 图标CSS类名 */
    className: string;
}

/**
 * 购物统计接口
 */
export interface ShoppingStats {
    /** 总计项目 */
    total: number;
    /** 已购项目 */
    completed: number;
    /** 已完成百分比 */
    completedPercentage: number;
    /** 总计金额 */
    totalPrice: number;
    /** 已花费金额 */
    spentAmount: number;
}