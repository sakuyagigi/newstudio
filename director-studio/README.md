# 墨枢光影导演台 - AI影视制片系统

## 🎬 项目简介

墨枢光影导演台是一个基于多AI导演协同的智能影视制片平台，支持从剧本分析到成片交付的全流程AI辅助制作。

## 🔒 安全特性

- **API Key 全程保密**：所有外部API调用通过服务端转发，前端永不接触密钥
- **用户数据隔离**：多用户系统，项目数据完全隔离
- **服务端渲染**：敏感逻辑全部在服务端执行
- **支持付费接入**：可接入支付系统实现商业化

## 🏗️ 架构方案

### 方案一：Next.js 全栈（推荐，生产环境）
- 技术栈：Next.js 14 + React + Tailwind CSS
- 优势：SSR/SSG、API Routes、完整的用户系统、支付接入
- 部署：Vercel / 自建服务器

### 方案二：轻量 Node.js 服务器
- 技术栈：纯 Node.js（零依赖）+ 静态HTML
- 优势：无需安装依赖，开箱即用
- 适用：快速部署、演示验证

## 📁 项目结构

```
director-studio/
├── app/                    # Next.js 页面与API
│   ├── layout.js          # 根布局（侧边栏+小光助手）
│   ├── page.js            # 首页（项目总览）
│   ├── script/page.js     # 剧本分析
│   ├── character/page.js  # 角色定妆
│   ├── storyboard/page.js # 分镜生成
│   ├── render/page.js     # 视频渲染
│   ├── delivery/page.js   # 成片交付
│   ├── conflicts/page.js  # 冲突看板
│   ├── settings/page.js   # 系统设置
│   └── api/               # 服务端API路由（安全转发）
│       ├── script/analyze/route.js
│       ├── character/generate/route.js
│       └── storyboard/generate/route.js
├── components/             # React组件
│   ├── Sidebar.jsx       # 侧边导航
│   └── XiaoGuangChat.jsx # 小光助手悬浮窗
├── lib/                    # 工具库
│   └── api516.js         # 516平台API封装
├── server.js              # 轻量Node服务器（备选方案）
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 快速开始

### 方式一：Next.js 部署（推荐）

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的API Key

# 3. 启动开发服务器
npm run dev

# 4. 生产构建
npm run build
npm start
```

### 方式二：轻量服务器（零依赖）

```bash
# 1. 设置环境变量
export STRAPP_API_KEY=your_api_key_here
export API_BASE_URL=https://api.516platform.com

# 2. 启动服务器
node server.js

# 3. 访问 http://localhost:3000
```

## 🔧 环境变量配置

| 变量名 | 说明 | 必填 |
|--------|------|------|
| `STRAPP_API_KEY` | 516平台API密钥 | 是 |
| `NEXT_PUBLIC_516_API_URL` | 516平台API地址 | 否（默认已配置） |
| `DATABASE_URL` | 数据库连接（生产环境） | 否 |
| `NEXTAUTH_SECRET` | 认证密钥（多用户） | 否 |

## 🎨 设计规范

- **风格**：海外胶片电影质感
- **主色调**：琥珀橙 → 橙色渐变
- **字体**：Noto Sans SC
- **交互**：卡片悬浮、呼吸动画、平滑过渡
- **约束**：真人风格禁CG/UE5/cartoon，3D卡通禁photorealistic

## 📱 功能模块

### 1. 剧本分析（ALPHA导演）
- 剧本智能拆解
- 人物关系图谱
- 场景识别提取
- 冲突点标记

### 2. 角色定妆（KAPPA导演）
- 角色视觉生成
- 多版本迭代
- 铁律禁令设置
- 视觉DNA提取
- 锁定机制

### 3. 分镜生成（GAMMA导演）
- 自动分镜拆解
- ABC三级镜头密度
- 景别/运镜/光线配置
- 批量生成
- 分镜表导出

### 4. 视频渲染
- 分镜转视频
- 多模型支持
- 批量渲染队列
- 进度实时追踪

### 5. 冲突检测
- 角色一致性检查
- 场景连续性检查
- 风格一致性检查
- 导演间意见冲突

### 6. 小光助手
- 对话式交互
- 斜杠命令
- 快捷操作
- 全程辅助

## 🔐 安全架构

```
用户浏览器 → 前端页面 → 服务端API路由 → 外部API
               ↑              ↑
               │              └── API Key 存储在服务端环境变量
               │                  前端永远无法访问
               └── 只接收处理后的渲染结果
```

## 💳 付费系统接入（可选）

支持以下付费模式：
- 按次付费：每次生成扣费
- 会员订阅：月/年卡无限使用
- 点数系统：充值点数，消耗点数

接入方式：
1. 微信支付 / 支付宝
2. Stripe（海外）
3. 平台内购

## 📦 部署指南

### Vercel 部署（最简单）
1. Fork 项目到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 一键部署

### Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 自建服务器
```bash
# 使用PM2托管
npm install -g pm2
pm2 start npm --name "director-studio" -- start
```

## 🛠️ 技术栈

- **前端框架**：React 18 + Next.js 14
- **样式方案**：Tailwind CSS 3.4
- **后端**：Next.js API Routes（Node.js）
- **数据库**：PostgreSQL / MongoDB（可选）
- **认证**：NextAuth.js（可选）
- **部署**：Vercel / Docker / PM2

## 📝 更新日志

### v1.0.0 (2026-06-07)
- ✅ 完整的Next.js项目架构
- ✅ 7大功能模块页面
- ✅ 服务端API安全转发
- ✅ 六导演协同UI
- ✅ 小光AI助手
- ✅ 暖色调胶片风格设计
- ✅ 角色定妆系统（含版本管理、锁定机制）
- ✅ 分镜时间线（ABC三级）
- ✅ 冲突看板框架
