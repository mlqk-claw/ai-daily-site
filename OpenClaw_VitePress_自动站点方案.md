# OpenClaw + VitePress 每日自动发布静态站方案

> 目标：用 **OpenClaw**（开源 AI agent 平台）自动生成“每日摘要 + 今日历史/节气”内容，  
> 并通过 **VitePress + GitHub Pages** 每天自动发布。  
> 本方案面向“零资源起步、低维护、可持续扩展”。

---

## 1. 目标与范围
**功能目标**
- 每天自动生成当天内容（每日摘要 + 今日历史/节气）
- 自动更新首页与归档页
- 自动发布到 GitHub Pages

**非目标（可后续扩展）**
- 用户系统/评论/搜索
- 复杂后台管理

---

## 2. 技术选型
| 模块 | 选型 | 说明 |
|---|---|---|
| 静态站 | **VitePress** | 现代、轻量、Markdown 驱动、构建快 |
| 自动化 | **OpenClaw** | 负责抓取/摘要/生成 Markdown |
| 运行环境 | Node.js 18/20 LTS | VitePress 依赖 |
| 部署 | GitHub Pages + Actions | 免运维、自动发布 |
| 定时任务 | Linux Cron | 每天触发 OpenClaw |

**选择 VitePress 的理由**
- Markdown 驱动内容，非常适合“每日文章”
- 构建速度快，适合每日自动发布
- 未来可扩展 Vue 组件（图表/订阅/排行榜等）

---

## 3. 总体架构
```
OpenClaw (服务器定时)
   ↓ 生成 Markdown
Git 仓库 (GitHub)
   ↓ push 触发
GitHub Actions 构建 VitePress
   ↓
GitHub Pages 发布
```

---

## 4. 项目创建与初始化

### 4.1 初始化 VitePress
```bash
npm init vitepress@latest daily-site
cd daily-site
npm install
```

推荐初始化选项：
- Theme: Default  
- Directory: `docs`  
- TypeScript config: Yes

### 4.2 基础配置
编辑 `docs/.vitepress/config.ts`：
```ts
export default {
  title: '每日简报',
  description: '每日摘要 + 今日历史/节气',
  base: '/',   // 自定义域名部署时为 '/'，GitHub Pages 子路径为 '/ai-daily-site/'
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '归档', link: '/daily/' }
    ]
  }
}
```

> 若使用自定义域名（如 mlqk.me），base 设为 `/`；若部署在 GitHub Pages 子路径，改为 `/仓库名/`

---

## 5. 推荐目录结构
```
daily-site/
├─ docs/
│  ├─ index.md                # 首页（每天自动更新）
│  ├─ daily/
│  │  ├─ 2026-03-13.md
│  │  └─ 2026-03-14.md
│  └─ .vitepress/
│     └─ config.ts
├─ scripts/
│  ├─ generate_daily.py       # 生成今日内容（OpenClaw 输出）
│  └─ run_daily.sh            # 自动执行+提交+推送
└─ package.json
```

---

## 6. 内容生成规范（OpenClaw 输出）

### 6.1 每日页面模板（Markdown）
```
---
title: 2026-03-13 每日摘要
date: 2026-03-13
---

## 今日摘要
1. ...
2. ...
3. ...

## 今日历史 / 节气
- ...
- ...
- ...
```

输出路径示例：
```
docs/daily/2026-03-13.md
```

### 6.2 首页模板（仅显示当天）
OpenClaw 每天更新 `docs/index.md`：
```
---
title: 每日简报
---

# 2026-03-13

## 今日摘要
1. ...
2. ...

## 今日历史 / 节气
- ...
- ...

> 查看归档：/daily/
```

---

## 7. OpenClaw 工作流建议
**每日工作流步骤：**
1. 拉取摘要数据（RSS/API/网页）
2. 清洗 + 摘要（保持 3~8 条）
3. 拉取今日历史/节气数据
4. 生成 Markdown（每日页面 + 首页）
5. 写入文件（docs/）

**最小化数据来源建议**
- 今日历史/节气：公开历史数据源
- 每日摘要：先选 3~5 个稳定 RSS

---

## 8. 自动发布流程

### 8.1 GitHub 仓库初始化
```bash
git init
git add .
git commit -m "init vitepress"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

### 8.2 GitHub Actions 部署（VitePress → Pages）
创建 `.github/workflows/deploy.yml`：
```yaml
name: Deploy VitePress

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run docs:build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**GitHub 设置：**
- Settings → Pages → Source 选择 **GitHub Actions**

---

## 9. 服务器定时任务（Cron）

### 9.1 脚本示例：`scripts/run_daily.sh`
```bash
#!/usr/bin/env bash
set -e

cd /path/to/daily-site
git pull

# 运行 OpenClaw 工作流（示意）
# openclaw run workflow_daily.yaml

git add docs
git commit -m "daily: $(date +%F)"
git push
```

### 9.2 设置定时任务
每天早上 6 点自动执行：
```
0 6 * * * /path/to/daily-site/scripts/run_daily.sh
```

---

## 10. MVP 里程碑（建议）
**Day 1**
- 完成 VitePress 初始化 + GitHub Pages 发布  
- 手动写一篇 daily 页面

**Day 2**
- OpenClaw 输出 Markdown（仅今日历史）

**Day 3**
- 加入每日摘要来源  
- 自动生成首页 + 归档

---

## 11. 运维与质量建议
| 风险 | 建议 |
|---|---|
| 数据源失效 | 保持多来源 + fallback |
| 摘要质量波动 | 固定模板 + 最多 3~8 条 |
| 空白日 | 输出“暂无更新”占位 |
| 发布失败 | GitHub Actions 通知 + 日志 |

---

## 12. 下一步建议
1. 明确“每日摘要”主题（AI/安全/开源/电商等）  
2. 选定 3~5 个稳定 RSS 或 API 来源  
3. 根据 OpenClaw 实际配置，落地工作流脚本  
4. 上线 MVP  

---

## 13. 附录：快速检查清单
- [ ] VitePress 能本地 `npm run docs:dev`  
- [ ] GitHub Actions 成功构建  
- [ ] Pages 发布成功  
- [ ] OpenClaw 每天生成 Markdown  
- [ ] Cron 正常执行  

---

如果你需要，我可以继续补充：
- OpenClaw 的具体 workflow 模板  
- RSS 清单建议（按主题）  
- 自动归档/分页脚本  
