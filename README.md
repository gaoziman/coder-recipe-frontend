# 我的菜谱管家 🍳

![Banner](https://images.unsplash.com/photo-1506368249639-73a05d6f6488?ixlib=rb-1.2.1&auto=format&fit=crop)

## 📌 项目简介

「我的菜谱管家」是一款现代化的食谱管理与烹饪辅助应用，专为热爱烹饪的用户设计。无论您是烹饪新手还是经验丰富的厨师，我们都能帮助您轻松管理菜谱、规划膳食、探索新食谱，让您的烹饪之旅更加愉快和有条理。

通过精心设计的界面和实用功能，「我的菜谱管家」致力于解决现代人在家庭烹饪中面临的常见问题：忘记喜欢的菜谱、不知道做什么好吃的、食材管理困难以及膳食规划无序等。

## ✨ 核心功能

### 🍲 个性化菜谱库

- **多样化分类**：按照早餐、午餐、晚餐、快手菜、素食等多维度分类，轻松查找
- **智能推荐**：基于您的烹饪习惯和喜好，智能推荐适合的菜谱
- **烹饪记录**：自动跟踪每道菜的烹饪次数和最近烹饪时间
- **收藏功能**：一键收藏喜爱的菜谱，随时查看

![菜谱库](https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-1.2.1&auto=format&fit=crop)

### 🥗 食材管理系统

- **食材库存**：记录家中现有食材，及时提醒临期食材
- **智能匹配**：根据库存食材推荐可制作的菜谱，减少食材浪费
- **购物清单**：自动生成所需食材的购物清单，支持一键分享

### 📊 烹饪数据统计

- **烹饪习惯分析**：可视化展示您的烹饪频率、菜系偏好等数据
- **营养均衡评估**：分析膳食营养构成，提供均衡饮食建议
- **定期报告**：生成周/月烹饪概览，帮助您了解饮食习惯

### 📅 膳食规划助手

- **每周菜单**：轻松规划一周三餐，告别"今天吃什么"的困扰
- **自动配菜**：根据主菜智能推荐搭配菜品，打造营养均衡的一餐
- **节日特色菜谱**：节假日专属菜谱推荐，让节日餐桌更有仪式感

## 🛠️ 技术架构

### 前端技术栈

- **框架**：Vue 3 (3.5.13) + TypeScript (5.8.2)
- **UI 组件库**：Ant Design Vue (4.2.6)
- **状态管理**：Pinia (3.0.1)
- **路由管理**：Vue Router (4.5.0)
- **构建工具**：Vite (6.2.0)
- **HTTP 客户端**：Axios (1.8.3)
- **日期处理**：Day.js (1.11.13)

### 后端技术栈

- **框架**：Spring Boot 3.3
- **数据库**：MySQL 8.0
- **缓存**：Redis 7.2
- **接口文档**：Swagger 3.0
- **安全认证**：Spring Security + JWT

## 📱 应用界面展示

### 首页 - 推荐菜谱与快速访问

![首页](https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop)

### 菜谱详情 - 直观清晰的烹饪指南

![菜谱详情](https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-1.2.1&auto=format&fit=crop)

### 膳食规划 - 轻松安排一周菜单

![膳食规划](https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-1.2.1&auto=format&fit=crop)

### 数据统计 - 了解您的烹饪习惯

![数据统计](https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop)

## 🔮 未来功能规划

- **社区功能**：与其他烹饪爱好者分享菜谱和烹饪技巧
- **智能语音助手**：解放双手，语音操控烹饪流程
- **多设备同步**：手机、平板、智能电视多端数据同步
- **AR 辅助烹饪**：通过增强现实技术，提供直观的烹饪指导
- **个性化营养建议**：根据用户健康目标提供定制化饮食方案

## 🚀 快速开始

### 环境要求

- Node.js 18.0+
- Java 17+
- MySQL 8.0+
- Redis 7.0+

### 前端启动

```bash
# 克隆仓库
git clone https://github.com/gaoziman/coder-recipe-frontend.git

# 进入前端项目目录
cd coder-recipe-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 后端启动

```bash
# 进入后端项目目录
cd coder-recipe-backend

# 使用Maven编译
mvn clean package

# 运行Spring Boot应用
java -jar target/recipe-manager-0.1.0.jar
```

## 🤝 贡献指南

我们欢迎各种形式的贡献，无论是新功能、文档改进还是错误修复。如果您对项目感兴趣并希望贡献代码，请遵循以下步骤：

1. Fork 仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 📮 联系我们

- 邮箱：m2942894660@163.com
- 微信公众号：程序员Leo
- GitHub Issues：[https://github.com/gaoziman/coder-recipe-backend/issues](https://github.com/gaoziman/coder-recipe-backend/issues)

---

> "烹饪是爱的语言，而我们的应用是您厨房里的得力助手。"

---
