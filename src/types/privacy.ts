/**
 * 隐私设置类型定义
 */
export interface PrivacySettings {
    /** 隐私保护模式 */
    privacyMode: boolean;

    /** 可见性设置 */
    visibility: {
        /** 个人信息 - 姓名、简介、个人照片等 */
        personalInfo: VisibilityLevel;
        /** 联系方式 - 手机号、邮箱等 */
        contactInfo: VisibilityLevel;
        /** 发布的菜谱 */
        recipes: VisibilityLevel;
        /** 收藏内容 */
        favorites: VisibilityLevel;
    };

    /** 互动权限设置 */
    permissions: {
        /** 评论权限 - 谁可以评论您的内容 */
        comment: PermissionLevel;
        /** 私信权限 - 谁可以给您发私信 */
        message: PermissionLevel;
        /** 提及权限 - 谁可以@您 */
        mention: PermissionLevel;
        /** 关注申请 - 是否需要审核关注请求 */
        followApproval: boolean;
    };

    /** 数据隐私设置 */
    dataPrivacy: {
        /** 允许搜索引擎索引个人主页 */
        allowSearch: boolean;
        /** 个性化推荐 */
        personalizedRecommendation: boolean;
        /** 分享位置信息 */
        shareLocation: boolean;
        /** 保存浏览历史 */
        saveBrowsingHistory: boolean;
    };

    /** 黑名单列表 */
    blacklist: BlacklistUser[];
}

/**
 * 可见性级别
 * - public: 所有人可见
 * - followers: 仅关注者可见
 * - private: 仅自己可见
 */
export type VisibilityLevel = 'public' | 'followers' | 'private';

/**
 * 权限级别
 * - public: 所有人
 * - followers: 仅关注者
 * - disabled: 关闭此功能
 */
export type PermissionLevel = 'public' | 'followers' | 'disabled';

/**
 * 黑名单用户信息
 */
export interface BlacklistUser {
    /** 用户ID */
    id: string;
    /** 用户名称 */
    name: string;
    /** 用户头像 */
    avatar: string;
}

/**
 * 隐私设置API响应
 */
export interface PrivacySettingsResponse {
    /** 是否成功 */
    success: boolean;
    /** 错误信息 */
    message?: string;
    /** 隐私设置数据 */
    data?: PrivacySettings;
}