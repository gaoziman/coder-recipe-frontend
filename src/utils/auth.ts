import { createVNode, render } from 'vue';
import AuthModals from '@/components/AuthModal/index.vue';

let instance: any = null;

// 创建模态框实例
const createInstance = () => {
    if (instance) {
        return instance;
    }

    // 创建挂载容器
    const container = document.createElement('div');
    document.body.appendChild(container);

    // 创建组件实例
    const vnode = createVNode(AuthModals);
    render(vnode, container);

    // 保存实例
    instance = vnode.component?.exposed;

    return instance;
};

// 销毁模态框实例
const destroyInstance = () => {
    if (instance) {
        render(null, document.body);
        instance = null;
    }
};

// 认证服务
const Auth = {
    // 显示登录模态框
    showLogin() {
        const instance = createInstance();
        instance?.showLoginModal();
    },

    // 显示注册模态框
    showRegister() {
        const instance = createInstance();
        instance?.showRegisterModal();
    },

    // 销毁模态框
    destroy() {
        destroyInstance();
    }
};

export default Auth;