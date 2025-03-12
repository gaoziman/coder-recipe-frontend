// src/components/icons.ts
import { defineComponent, h } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'

// 通用图标基础组件
const createIconComponent = (svgPath: string, displayName: string) => {
    return defineComponent({
        name: displayName,
        inheritAttrs: true,
        setup(_, { attrs }) {
            return () => h(
                'span',
                {
                    role: 'img',
                    'aria-label': displayName,
                    class: 'anticon',
                    ...attrs
                },
                h(
                    'svg',
                    {
                        viewBox: '0 0 24 24',
                        width: '1em',
                        height: '1em',
                        fill: 'none',
                        stroke: 'currentColor',
                        'stroke-width': '2',
                        'stroke-linecap': 'round',
                        'stroke-linejoin': 'round',
                    },
                    [h('path', { d: svgPath })]
                )
            )
        }
    })
}

// 餐具图标
export const UtensilsOutlined = defineComponent({
    name: 'UtensilsOutlined',
    setup(_, { attrs }) {
        return () => h(
            'span',
            {
                role: 'img',
                'aria-label': 'Utensils',
                class: 'anticon',
                ...attrs
            },
            h(
                'svg',
                {
                    viewBox: '0 0 24 24',
                    width: '1em',
                    height: '1em',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                },
                [
                    h('path', { d: 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2' }),
                    h('path', { d: 'M7 2v20' }),
                    h('path', { d: 'M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7' })
                ]
            )
        )
    }
})

// 购物袋图标
export const ShoppingOutlined = defineComponent({
    name: 'ShoppingOutlined',
    setup(_, { attrs }) {
        return () => h(
            'span',
            {
                role: 'img',
                'aria-label': 'Shopping Bag',
                class: 'anticon',
                ...attrs
            },
            h(
                'svg',
                {
                    viewBox: '0 0 24 24',
                    width: '1em',
                    height: '1em',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                },
                [
                    h('path', { d: 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z' }),
                    h('path', { d: 'M3 6h18' }),
                    h('path', { d: 'M16 10a4 4 0 0 1-8 0' })
                ]
            )
        )
    }
})

// 奖杯图标
export const AwardOutlined = defineComponent({
    name: 'AwardOutlined',
    setup(_, { attrs }) {
        return () => h(
            'span',
            {
                role: 'img',
                'aria-label': 'Award',
                class: 'anticon',
                ...attrs
            },
            h(
                'svg',
                {
                    viewBox: '0 0 24 24',
                    width: '1.2em',
                    height: '1.2em',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                },
                [
                    h('circle', { cx: '12', cy: '8', r: '7' }),
                    h('path', { d: 'M8.21 13.89 7 23l5-3 5 3-1.21-9.12' })
                ]
            )
        )
    }
})

// 厨师帽图标
export const ChefHatOutlined = defineComponent({
    name: 'ChefHatOutlined',
    setup(_, { attrs }) {
        return () => h(
            'span',
            {
                role: 'img',
                'aria-label': 'Chef Hat',
                class: 'anticon',
                ...attrs
            },
            h(
                'svg',
                {
                    viewBox: '0 0 24 24',
                    width: '1.2em',
                    height: '1.2em',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                },
                [
                    h('path', { d: 'M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z' }),
                    h('line', { x1: '6', y1: '17', x2: '18', y2: '17' })
                ]
            )
        )
    }
})

// 导出 Ant Design 图标
export { UserOutlined }