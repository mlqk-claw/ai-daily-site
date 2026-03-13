# 每日简报 📰

> 一个基于 **OpenClaw** + **VitePress** 的每日自动发布静态站方案  
> 用 AI 自动生成"每日摘要 + 今日历史/节气"内容，每天自动发布到 GitHub Pages

![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0-brightgreen)

## ✨ 核心特性

- 🤖 **AI 驱动** — 使用 OpenClaw 自动生成每日内容
- 📄 **Markdown 驱动** — 基于 VitePress 构建现代化文档站点
- ⚡ **自动化发布** — GitHub Actions 每日自动构建与发布
- 📚 **内容管理** — 自动生成首页摘要 + 归档系统
- 🚀 **零成本部署** — GitHub Pages 免费托管

## 🏗️ 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| **静态站生成** | VitePress 1.0+ | 现代、轻量、Markdown 驱动 |
| **自动化框架** | OpenClaw | 内容生成与抓取 |
| **运行环境** | Node.js 18+ | LTS 稳定版本 |
| **部署方案** | GitHub Pages + Actions | 自动构建与发布 |
| **定时任务** | Cron（Linux/AWS Lambda） | 日程触发 |

## 📦 快速开始

### 1. 克隆或创建项目

```bash
# 如果从本仓库克隆
git clone git@github.com:yourusername/daily-site.git
cd daily-site
npm install

# 或初始化新项目
npm init vitepress@latest daily-site
```

### 2. 本地开发

```bash
# 启动文档服务器
npm run dev

# 构建静态网站
npm run build

# 预览构建后的网站
npm run serve
```

### 3. 配置 VitePress

编辑 `docs/.vitepress/config.ts`：

```typescript
export default {
  title: '每日简报',
  description: '每日摘要 + 今日历史/节气',
  base: '/daily-site/',  // 替换为您的仓库名
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '归档', link: '/archive/' },
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/daily-site' }
    ]
  }
}
```

> 如使用自定义域名，`base` 配置为 `'/'`

## 📂 项目结构

```
daily-site/
├── docs/                          # 文档根目录
│   ├── index.md                   # 首页（每日自动更新）
│   ├── archive/                   # 所有文章归档
│   │   ├── 2026-03-13.md
│   │   └── 2026-03-14.md
│   └── .vitepress/
│       ├── config.ts              # VitePress 配置
│       └── theme/                 # 自定义主题
├── scripts/                       # 自动化脚本
│   ├── generate_daily.py          # 生成每日内容（OpenClaw 输出）
│   └── run_daily.sh               # 执行+提交+推送脚本
├── .github/
│   └── workflows/
│       └── daily-publish.yml      # GitHub Actions 自动发布
├── package.json                   # npm 配置
├── .gitignore                     # git 忽略文件
└── README.md                      # 本文件
```

## 🔧 配置与部署

### GitHub Actions 自动发布

创建 `.github/workflows/daily-publish.yml`：

```yaml
name: 每日发布

on:
  push:
    branches:
      - main
  schedule:
    - cron: '0 8 * * *'  # 每天早上 8 点执行

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: 安装 Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: 安装依赖
        run: npm install
      
      - name: 构建网站
        run: npm run build
      
      - name: 部署到 GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/.vitepress/dist
```

### 首次部署到 GitHub Pages

1. 在 GitHub 仓库设置中，找到 **Settings → Pages**
2. **Source** 选择 `GitHub Actions`
3. 保存设置
4. 第一次推送时会自动触发 Action

## 📝 日常使用

### 手动添加每日内容

在 `docs/archive/` 下创建 `YYYY-MM-DD.md` 文件：

```markdown
---
title: 每日简报 - 2026年3月13日
date: 2026-03-13
---

## 📰 今日摘要

### 新闻标题 1
内容摘要...

### 新闻标题 2
内容摘要...

## 📅 今日历史

- 2020年：某重要事件
- 2015年：某历史事件

## 🌾 节气信息

春分即将到来（3月20日）
```

### 自动生成内容（OpenClaw 集成）

使用 OpenClaw 生成 Markdown：

```bash
# 调用 OpenClaw 生成今日内容
python scripts/generate_daily.py

# 自动提交并推送
bash scripts/run_daily.sh
```

## 🔐 SSH 密钥配置

如使用 SSH 推送，需配置密钥：

```bash
# 检查 SSH 密钥
ls ~/.ssh/

# 配置 git，使用特定密钥
git config core.sshCommand "ssh -i ~/.ssh/id_rsa_github"

# 或在 git 仓库级别配置
git config --local core.sshCommand "ssh -i ~/.ssh/id_rsa_github"
```

## 📖 完整工作流程

```
1. OpenClaw 或手动创建 → docs/archive/YYYY-MM-DD.md
        ↓
2. 更新 docs/index.md（首页）
        ↓
3. git add . && git commit && git push
        ↓
4. GitHub Actions 自动触发构建
        ↓
5. npm run build → 生成静态文件
        ↓
6. 自动部署到 GitHub Pages
        ↓
7. 网站自动更新 🎉
```

## 🚀 扩展方向

- [ ] 集成搜索功能（VitePress Search Plugin）
- [ ] 添加评论系统（Giscus/Utterances）
- [ ] RSS 订阅功能
- [ ] 分类与标签系统
- [ ] 暗色主题支持
- [ ] 多语言支持

## 📄 许可证

MIT License © 2026

## 👤 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- GitHub Issues：用于 bug 反馈与功能建议
- Discussions：用于讨论与经验分享

---

**快速导航**
- [VitePress 官方文档](https://vitepress.dev/)
- [OpenClaw 项目](https://github.com/openclaw/openclaw)
- [GitHub Pages 文档](https://pages.github.com/)
