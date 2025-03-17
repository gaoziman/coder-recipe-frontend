import type { Recipe, RelatedRecipe } from '@/types/recipe'

/**
 * 生成随机菜谱数据
 * @param count 生成的菜谱数量
 * @returns 菜谱数组
 */
export const generateMockRecipes = (count: number): Recipe[] => {
    const recipes: Recipe[] = []

    // 菜谱标题集合
    const recipeTitles = [
        '香煎三文鱼', '红烧排骨', '麻婆豆腐', '糖醋里脊', '清蒸鲈鱼',
        '干锅花菜', '可乐鸡翅', '酸辣土豆丝', '西红柿炒鸡蛋', '葱爆羊肉',
        '蒜蓉西兰花', '蚝油生菜', '鱼香肉丝', '宫保鸡丁', '东坡肉',
        '水煮牛肉', '青椒肉丝', '干煸四季豆', '酸菜鱼', '炖牛腩',
        '蛋炒饭', '小鸡炖蘑菇', '红烧茄子', '京酱肉丝', '锅包肉',
        '青椒土豆丝', '西湖醋鱼', '扬州炒饭', '冬瓜排骨汤', '番茄牛肉面'
    ]

    // 食材名称集合
    const ingredientNames = [
        '三文鱼', '猪排骨', '豆腐', '里脊肉', '鲈鱼', '花菜', '鸡翅', '土豆',
        '西红柿', '鸡蛋', '羊肉', '西兰花', '生菜', '猪肉丝', '鸡胸肉', '五花肉',
        '牛肉', '四季豆', '酸菜', '牛腩', '米饭', '小鸡', '蘑菇', '茄子',
        '黄瓜', '大葱', '姜', '蒜', '青椒', '胡萝卜', '冬瓜', '面条'
    ]

    // 调料名称集合
    const seasoningNames = [
        '盐', '糖', '生抽', '老抽', '蚝油', '料酒', '醋', '豆瓣酱', '辣椒酱',
        '花椒', '八角', '桂皮', '香叶', '小茴香', '白胡椒', '黑胡椒', '五香粉',
        '十三香', '干辣椒', '葱花', '姜末', '蒜末', '香菜', '香葱', '植物油',
        '芝麻油', '蜂蜜', '番茄酱', '沙拉酱', '咖喱粉'
    ]

    // 烹饪步骤标题集合
    const stepTitles = [
        '准备食材', '清洗处理', '切配', '腌制', '焯水', '热锅', '下油', '爆香料头',
        '翻炒食材', '调味', '勾芡', '焖煮', '收汁', '出锅', '装盘', '烧制', '炖煮',
        '蒸制', '烘焙', '冷却', '发酵', '揉面', '搅拌', '烹炸', '煎制', '煸炒',
        '打发', '过筛', '组装', '装饰'
    ]

    // 食谱标签集合
    const recipeTags = [
        '家常菜', '快手菜', '下饭菜', '宴客菜', '素食', '低脂', '高蛋白', '低碳水',
        '儿童', '老人', '养生', '海鲜', '肉食', '素菜', '小吃', '主食', '汤羹',
        '早餐', '午餐', '晚餐', '宵夜', '下午茶', '烘焙', '甜品', '饮品', '凉菜',
        '热菜', '懒人食谱', '微波炉', '电饭煲', '空气炸锅', '节日', '春季', '夏季',
        '秋季', '冬季'
    ]

    // 菜谱描述集合
    const recipeDescriptions = [
        '外酥里嫩的经典做法，简单又营养，是家庭必备的美味佳肴',
        '鲜香可口，肉质鲜嫩，口感丰富，色香味俱全的传统美食',
        '麻辣鲜香，下饭神器，简单易学，新手也能轻松掌握',
        '酸甜可口，色泽诱人，口感独特，老少皆宜的经典菜肴',
        '清淡鲜美，营养丰富，制作简单，适合全家人享用的健康料理',
        '香辣可口，口感爽脆，下饭神器，十分钟快手完成',
        '甜中带咸，肉质软嫩多汁，色泽红亮，老少皆宜',
        '酸辣开胃，爽脆可口，简单易做，下饭神器',
        '家常经典，营养均衡，色彩鲜艳，制作简单',
        '鲜香可口，肉质鲜嫩，搭配蔬菜，营养全面'
    ]

    // 用户名集合
    const usernames = [
        '舌尖上的美食家', '家常美食达人', '厨房小白', '美食猎人', '烹饪爱好者',
        '厨艺达人', '味蕾冒险家', '健康饮食控', '甜品爱好者', '美食摄影师',
        '家的味道', '香飘万里', '美食与爱', '厨房实验室', '美食旅行家'
    ]

    // 烹饪小贴士集合
    const cookingTips = [
        '选购食材时注意观察新鲜度，色泽鲜亮、有弹性的食材最佳',
        '烹饪前先将所有食材准备好并按顺序摆放，可以提高烹饪效率',
        '肉类在烹饪前最好先用厨房纸吸干表面水分，这样能煎出更酥脆的表面',
        '腌制肉类时加入少量的淀粉可以锁住肉汁，使成品更加鲜嫩',
        '热菜出锅前再加入一点点盐和香油，可以提升菜肴的香气',
        '烹饪蔬菜时，先放入茎部再放入叶部，可以使其熟度均匀',
        '煎鱼时先将鱼皮一面煎至金黄再翻面，可以避免鱼肉散开',
        '烹饪豆腐前可以先用热水焯一下，去除豆腥味并使其更容易入味',
        '炒菜时如果火候过大，可以随时加入少量冷水降温',
        '做汤时，先用大火煮沸后再转小火慢炖，可以使汤更加浓郁',
        '煮面条时加入少量食用油，可以防止面条粘连',
        '炒菜时最后加入葱花，可以保持葱的香气和脆嫩口感',
        '煮饭时加入一小片姜或几滴醋，可以使米饭更加蓬松',
        '冷冻肉解冻时最好放在冰箱中慢慢解冻，避免直接用热水',
        '烘焙前将黄油和鸡蛋提前取出室温回温，成品会更加松软'
    ]

    // 作者信息集合
    const authors = [
        { id: 'author1', name: '家的味道', avatar: 'https://i.pravatar.cc/150?img=56' },
        { id: 'author2', name: '日食记', avatar: 'https://i.pravatar.cc/150?img=46' },
        { id: 'author3', name: '美食小当家', avatar: 'https://i.pravatar.cc/150?img=33' },
        { id: 'author4', name: '舌尖上的厨师', avatar: 'https://i.pravatar.cc/150?img=60' },
        { id: 'author5', name: '阳光厨房', avatar: 'https://i.pravatar.cc/150?img=27' }
    ]

    // 食材图片集合
    const foodImages = [
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2',
        'https://images.unsplash.com/photo-1579888944880-d98341245702',
        'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369',
        'https://images.unsplash.com/photo-1558030006-450675393462',
        'https://images.unsplash.com/photo-1599084993091-1cb5c0129922',
        'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2',
        'https://images.unsplash.com/photo-1547573854-74d2a71d0826',
        'https://images.unsplash.com/photo-1544025162-d76694265947',
        'https://images.unsplash.com/photo-1518492104633-130d0cc84637',
        'https://images.unsplash.com/photo-1541379889336-70f26e4c4617',
        'https://images.unsplash.com/photo-1563245372-f21724e3856d',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        'https://images.unsplash.com/photo-1551248429-40975aa4de74',
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
        'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1',
        'https://images.unsplash.com/photo-1574484284002-952d92456975'
    ]

    // 难度级别
    const difficultyLevels = ['简单', '适中', '困难']

    // 生成指定数量的菜谱
    for (let i = 0; i < count; i++) {
        // 随机选择菜谱标题和相关数据
        const titleIndex = Math.floor(Math.random() * recipeTitles.length)
        const title = recipeTitles[titleIndex]

        // 随机生成评分 (4.0-5.0)
        const rating = 4 + Math.random()

        // 随机生成评论数量 (10-100)
        const reviewCount = Math.floor(Math.random() * 90) + 10

        // 随机生成浏览量 (1000-50000)
        const views = Math.floor(Math.random() * 49000) + 1000

        // 随机生成点赞数 (100-5000)
        const likes = Math.floor(Math.random() * 4900) + 100

        // 随机选择3-5个标签
        const tagCount = Math.floor(Math.random() * 3) + 3
        const tags: string[] = []
        for (let j = 0; j < tagCount; j++) {
            const tag = recipeTags[Math.floor(Math.random() * recipeTags.length)]
            if (!tags.includes(tag)) {
                tags.push(tag)
            }
        }

        // 随机选择作者
        const author = authors[Math.floor(Math.random() * authors.length)]

        // 随机选择描述
        const description = recipeDescriptions[Math.floor(Math.random() * recipeDescriptions.length)]

        // 随机生成烹饪时间 (10-60分钟)
        const cookingTime = `${Math.floor(Math.random() * 50) + 10}分钟`

        // 随机选择难度
        const difficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)]

        // 随机生成份量 (1-6人份)
        const servings = `${Math.floor(Math.random() * 5) + 1}人份`

        // 随机生成热量 (200-800大卡/份)
        const calories = `${Math.floor(Math.random() * 600) + 200}大卡/份`

        // 随机生成发布日期 (最近一年内)
        const today = new Date()
        const publishDate = new Date(today.getTime() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString()

        // 随机选择封面图片
        const coverImage = foodImages[Math.floor(Math.random() * foodImages.length)]

        // 生成主料食材 (3-6种)
        const mainIngredientCount = Math.floor(Math.random() * 4) + 3
        const mainIngredients = []
        for (let j = 0; j < mainIngredientCount; j++) {
            const name = ingredientNames[Math.floor(Math.random() * ingredientNames.length)]
            const amount = `${Math.floor(Math.random() * 500) + 100}克`
            mainIngredients.push({ name, amount })
        }

        // 生成调料 (4-8种)
        const seasoningCount = Math.floor(Math.random() * 5) + 4
        const seasonings = []
        for (let j = 0; j < seasoningCount; j++) {
            const name = seasoningNames[Math.floor(Math.random() * seasoningNames.length)]
            const amount = Math.random() > 0.5 ? `${Math.floor(Math.random() * 10) + 1}克` : '适量'
            seasonings.push({ name, amount })
        }

        // 生成厨具 (2-4种)
        const toolCount = Math.floor(Math.random() * 3) + 2
        const tools = []
        const toolNames = ['炒锅', '煮锅', '烤箱', '电饭煲', '蒸锅', '砧板', '刀具', '筷子', '铲子', '烘焙模具']
        for (let j = 0; j < toolCount; j++) {
            const name = toolNames[Math.floor(Math.random() * toolNames.length)]
            const amount = '1个'
            tools.push({ name, amount })
        }

        // 生成烹饪步骤 (3-6步)
        const stepCount = Math.floor(Math.random() * 4) + 3
        const steps = []
        for (let j = 0; j < stepCount; j++) {
            const title = stepTitles[Math.floor(Math.random() * stepTitles.length)]
            const description = `这是${title}的详细步骤说明，您需要按照指示完成这一步操作，确保菜品的口感和品质。`
            const image = foodImages[Math.floor(Math.random() * foodImages.length)]
            steps.push({ title, description, image })
        }

        // 生成烹饪小贴士 (3-5条)
        const tipCount = Math.floor(Math.random() * 3) + 3
        const tips = []
        for (let j = 0; j < tipCount; j++) {
            tips.push(cookingTips[Math.floor(Math.random() * cookingTips.length)])
        }

        // 生成营养成分
        const nutrition = [
            { name: '蛋白质', value: `${Math.floor(Math.random() * 30) + 10}g`, percentage: Math.floor(Math.random() * 50) + 30 },
            { name: '脂肪', value: `${Math.floor(Math.random() * 20) + 5}g`, percentage: Math.floor(Math.random() * 40) + 20 },
            { name: '碳水化合物', value: `${Math.floor(Math.random() * 30) + 5}g`, percentage: Math.floor(Math.random() * 30) + 10 },
            { name: '纤维素', value: `${Math.floor(Math.random() * 5) + 1}g`, percentage: Math.floor(Math.random() * 20) + 10 }
        ]

        // 营养小贴士
        const nutritionTips = [
            `${title}富含蛋白质和维生素，有助于增强免疫力和促进新陈代谢。`,
            `${title}中的成分有助于保持心血管健康，适量食用对身体有益。`,
            `${title}热量适中，是减脂期的理想选择，搭配运动效果更佳。`,
            `${title}富含膳食纤维，有助于促进肠道蠕动，保持消化系统健康。`,
            `${title}中的营养成分丰富均衡，适合作为日常饮食的一部分。`
        ]

        const nutritionTip = nutritionTips[Math.floor(Math.random() * nutritionTips.length)]

        // 生成评论
        const reviewsCount = Math.min(5, Math.floor(Math.random() * 5) + 1)
        const reviews = []
        for (let j = 0; j < reviewsCount; j++) {
            const username = usernames[Math.floor(Math.random() * usernames.length)]
            const avatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
            const date = new Date(today.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
            const userRating = Math.floor(Math.random() * 2) + 4 // 4-5星
            const commentTemplates = [
                `我严格按照步骤做了这道${title}，味道太棒了！家人都很喜欢，下次还会再做。`,
                `第一次尝试做${title}，味道还不错，但我觉得可以再多加点调料。总体来说很满意！`,
                `作为烹饪新手，这个食谱很容易上手。${title}的味道比我想象的还要好，谢谢分享！`,
                `按照食谱做了${title}，香气四溢，全家人都抢着吃，一定会收藏这个食谱。`,
                `食材准备很简单，做法也不复杂，但是味道特别好！${title}已经成为我家的常备菜了。`
            ]
            const comment = commentTemplates[Math.floor(Math.random() * commentTemplates.length)]

            // 是否有图片 (30%几率)
            const hasImage = Math.random() < 0.3
            const image = hasImage ? foodImages[Math.floor(Math.random() * foodImages.length)] : undefined

            // 点赞数 (5-50)
            const likes = Math.floor(Math.random() * 45) + 5

            // 是否有回复 (50%几率)
            const hasReply = Math.random() < 0.5
            const replies = hasReply ? [
                {
                    username: author.name,
                    avatar: author.avatar,
                    date: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString(),
                    content: `感谢您的评价和反馈！很高兴您喜欢这道${title}，欢迎继续关注我的更多分享。`,
                    isAuthor: true
                }
            ] : []

            reviews.push({
                id: `review-${i}-${j}`,
                username,
                avatar,
                date,
                rating: userRating,
                comment,
                image,
                likes,
                isLiked: false,
                replies
            })
        }

        // 构建完整的菜谱对象
        const recipe: Recipe = {
            id: `recipe-${i + 1}`,
            title,
            description,
            coverImage,
            publishDate,
            cookingTime,
            difficulty,
            servings,
            calories,
            rating,
            reviewCount,
            views,
            likes,
            tags,
            author,
            ingredients: {
                main: mainIngredients,
                seasoning: seasonings
            },
            tools,
            steps,
            cookingTips: tips,
            nutrition,
            nutritionTip,
            reviews
        }

        recipes.push(recipe)
    }

    return recipes
}

/**
 * 生成相关菜谱推荐
 * @param count 生成数量
 * @returns 相关菜谱数组
 */
export const generateMockRelatedRecipes = (count: number): RelatedRecipe[] => {
    const relatedRecipes: RelatedRecipe[] = [
        {
            id: 'related1',
            title: '柠檬芝麻三文鱼',
            image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74',
            cookingTime: '25分钟',
            difficulty: '简单',
            description: '清新柠檬汁腌制，表面撒上香浓芝麻，健康美味的轻食选择'
        },
        {
            id: 'related2',
            title: '香煎鳕鱼',
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
            cookingTime: '20分钟',
            difficulty: '简单',
            description: '肉质细嫩的鳕鱼，搭配香草黄油酱汁，鲜美可口'
        },
        {
            id: 'related3',
            title: '时蔬沙拉',
            image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1',
            cookingTime: '15分钟',
            difficulty: '简单',
            description: '新鲜蔬菜配上特制的健康沙拉酱，清爽可口的完美搭配'
        },
        {
            id: 'related4',
            title: '牛油果三文鱼沙拉',
            image: 'https://images.unsplash.com/photo-1574484284002-952d92456975',
            cookingTime: '15分钟',
            difficulty: '简单',
            description: '三文鱼与牛油果的完美组合，健康又美味的营养搭配'
        },
        {
            id: 'related5',
            title: '蒜蓉烤虾',
            image: 'https://images.unsplash.com/photo-1579722820988-01a6260490c1',
            cookingTime: '20分钟',
            difficulty: '适中',
            description: '鲜香可口的烤虾，蒜香四溢，口感弹嫩'
        }
    ]

    return relatedRecipes.slice(0, count)
}