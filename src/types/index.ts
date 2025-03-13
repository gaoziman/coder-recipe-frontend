// src/types/index.ts

export interface IMenuItem {
    key: string;
    label: string;
    children?: IMenuItem[];
}

export interface UserInfo {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
    avatarUrl: string;
    bio: string;
    registerDate: string;
    recipesCount: number;
    ingredientsCount: number;
    monthlyCookingCount: number;
}

export interface LoginForm {
    username: string;
    password: string;
    remember: boolean;
}

export interface RegisterForm {
    username: string;
    password: string;
    confirmPassword: string;
}