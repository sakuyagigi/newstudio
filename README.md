# 墨枢光影导演台

AI 驱动的影视制片全流程平台——剧本拆解、五导演分析、角色定妆、场景概念、分镜生成，一站式完成。

## 功能特性

- 🎬 **剧本智能分析**：五导演（叙事/视觉/节奏/角色/制片）多维度拆解剧本
- 👤 **角色定妆**：基于角色描述生成一致的角色概念图
- 🏞 **场景概念**：一键生成关键场景氛围图
- 🎞 **分镜生成**：自动拆分镜头，生成专业分镜表
- 📁 **多项目管理**：支持多项目、多集数管理，数据持久化
- 🔗 **甲方协作**：分享链接，支持评论与审核（一期）
- 🎨 **深色主题**：深棕灰 + 橙棕配色，专业影视工作流界面

## 技术栈

- **后端**：Python 原生 HTTP 服务器，无框架依赖
- **前端**：原生 HTML/JS + Tailwind CSS CDN
- **数据存储**：JSON 文件持久化，无需数据库
- **AI 能力**：五导演大模型 API + 图像生成 API

## 快速开始

### 1. 环境配置

复制环境变量模板并填写你的 API 密钥：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入以下必填项：

```
# 五导演 API（OpenAI 兼容格式）
ALPHA_API_KEY=xxx    # 叙事导演
BETA_API_KEY=xxx     # 视觉导演
GAMMA_API_KEY=xxx    # 节奏导演
KAPPA_API_KEY=xxx    # 角色导演
EPSILON_API_KEY=xxx  # 制片导演

# 图像生成 API
IMAGE_API_KEY=xxx

# 服务配置
PORT=3000
HOST=0.0.0.0
```

### 2. 启动服务

```bash
python server_real.py
```

服务启动后访问：`http://localhost:3000`

### 3. 部署到公网

推荐使用 Cloudflare Tunnel 或其他内网穿透工具：

```bash
# Cloudflare Tunnel 示例
cloudflared tunnel --url http://localhost:3000
```

## 项目结构

```
.
├── server_real.py      # 主后端服务（API + 静态文件）
├── project_manager.py  # 项目/分集/分享数据管理
├── generate_ui.py      # UI 生成脚本
├── public/
│   └── index.html      # 前端单页应用
├── data/               # 项目数据（运行时生成，已忽略）
│   ├── projects/       # 各项目数据
│   └── shares/         # 分享链接数据
├── .env.example        # 环境变量模板
└── .env.local          # 本地环境变量（已忽略）
```

## API 概览

| 路径 | 方法 | 说明 |
|------|------|------|
| `/api/projects` | GET/POST | 项目列表 / 创建项目 |
| `/api/projects/{id}` | GET/PUT/DELETE | 项目详情 / 更新 / 删除 |
| `/api/projects/{pid}/episodes` | GET/POST | 分集列表 / 创建分集 |
| `/api/projects/{pid}/episodes/{eid}` | GET/PUT/DELETE | 分集详情 / 更新 / 删除 |
| `/api/analyze` | POST | 发起五导演剧本分析 |
| `/api/analyze/{task_id}` | GET | 查询分析任务状态 |
| `/api/generate/character` | POST | 生成角色定妆图 |
| `/api/generate/scene` | POST | 生成场景概念图 |
| `/api/generate/storyboard` | POST | 生成分镜 |
| `/api/share/{sid}` | GET | 获取分享内容 |

## 数据持久化

所有项目和分集数据以 JSON 格式存储在 `data/projects/` 目录下，每个项目一个文件夹，每集一个 JSON 文件。分享链接数据存储在 `data/shares/` 目录。

## License

MIT
