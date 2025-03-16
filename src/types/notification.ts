/**
 * 通知设置类型定义
 */
export interface NotificationSettings {
    /** 是否开启所有通知 */
    enableAll: boolean;

    /** 通知渠道设置 */
    channels: {
        /** 网站通知 */
        website: boolean;
        /** 邮件通知 */
        email: boolean;
        /** 短信通知 */
        sms: boolean;
    };

    /** 通知类型设置 */
    types: {
        /** 系统通知 - 账户安全、系统更新等 */
        system: boolean;
        /** 互动通知 - 评论、点赞等 */
        interaction: boolean;
        /** 关注通知 - 关注的用户发布内容 */
        follow: boolean;
        /** 私信通知 */
        message: boolean;
        /** 活动通知 - 促销、活动等 */
        activity: boolean;
    };

    /** 通知频率设置 */
    frequency: 'immediate' | 'daily' | 'weekly';
}

/**
 * 通知项类型
 */
export interface NotificationItem {
    /** 通知ID */
    id: string;
    /** 通知标题 */
    title: string;
    /** 通知内容 */
    content: string;
    /** 通知类型 */
    type: 'system' | 'interaction' | 'follow' | 'message' | 'activity';
    /** 是否已读 */
    read: boolean;
    /** 通知时间 */
    createdAt: string;
    /** 相关链接 */
    link?: string;
    /** 相关用户信息 */
    user?: {
        id: string;
        name: string;
        avatar: string;
    };
}

/**
 * 通知API响应类型
 */
export interface NotificationResponse {
    /** 通知列表 */
    items: NotificationItem[];
    /** 总数量 */
    total: number;
    /** 未读数量 */
    unread: number;
}