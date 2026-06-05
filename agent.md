# 新媒体协作平台项目汇总

## 项目定位

这是一个面向学校社团新媒体团队的协作平台 MVP。目标是把推文项目从微信群零散沟通中整理出来，集中管理选题、采编、封面、发布、审批、文件链接和成员权限。

平台当前是 Vite + React + TypeScript 前端静态 Demo，使用模拟数据展示完整业务流程，暂未接入真实后端、数据库、登录系统或微信公众号接口。

## 当前网站能力

- 工作台：展示今日优先项目、我的任务、待审批、待发布和风险提醒。
- 项目看板：按状态查看推文项目流转，包括待采编、采编中、待封面、封面中、待审批、待发布、已发布、需返工。
- 项目详情：展示单篇推文的三阶段任务、文件与链接、评论与修改意见、审批记录。
- 部门空间：采编部、技术部、运维部可分别查看本部门任务池。
- 成员与权限：展示成员角色、部门、启用状态和上级关系。
- 注册审核：支持成员注册申请、审核队列、老师/主任身份切换，以及下级人员调动模拟。
- 移动端适配：小屏下导航改为横向滑动顶部导航，看板横向滑动，表单和卡片单列排布。

## 权限设计

- 负责老师：查看全部项目，审批重点内容，查看复盘数据，可调动新媒体主任及以下成员。
- 新媒体主任：创建项目，分配任务，调整排期，可调动部门负责人和干事。
- 部门负责人：管理本部门任务，审核本部门交付物，不开放跨部门调动。
- 干事：查看自己的任务，提交链接文件，回复修改意见。

## 目录结构

当前正式 git 仓库位于：

```text
E:\Agent\codex\new-media-platform
```

主要文件：

```text
src/App.tsx                    页面结构、模拟数据、交互逻辑
src/styles.css                 整体视觉和响应式样式
index.html                     页面入口和 SEO 描述
vite.config.ts                 Vite 配置，base 使用 ./ 以适配 GitHub Pages
.github/workflows/pages.yml    GitHub Pages 自动部署 workflow
.gitignore                     忽略 node_modules、dist、npm cache 等本地文件
agent.md                       当前项目汇总说明
```

## Git 与部署

GitHub 仓库：

```text
https://github.com/user0928/new-media-platform
```

GitHub Pages 访问链接：

```text
https://user0928.github.io/new-media-platform/
```

已完成事项：

- 将网站整理到 `E:\Agent\codex\new-media-platform` 子文件夹。
- 让该子文件夹成为独立 git 仓库。
- 新建 GitHub 公开仓库 `user0928/new-media-platform`。
- 推送 `main` 分支。
- 启用 GitHub Pages。
- 添加 GitHub Actions workflow 自动构建并部署 `dist`。
- 验证 GitHub Pages 公网页面返回 HTTP 200。

## 本地运行

在项目目录中运行：

```powershell
cd E:\Agent\codex\new-media-platform
npm.cmd install
npm.cmd run dev -- --host localhost --port 5173
```

构建检查：

```powershell
npm.cmd run build
```

如果本机 npm cache 或权限异常，也可以在已有上级依赖可用时临时执行：

```powershell
..\node_modules\.bin\tsc.cmd --noEmit
..\node_modules\.bin\vite.cmd build --configLoader runner
```

## GitHub CLI 配置记录

由于本机没有 `gh` 和 `winget`，曾下载便携版 GitHub CLI 到：

```text
E:\Agent\codex\tools\gh
```

GitHub CLI 只作为本次建仓、推送、查询 Actions 和启用 Pages 使用。用户提供的 GitHub token 完成任务后应在 GitHub token 页面撤销。

## 后续建议

- 接入真实登录与角色权限。
- 将模拟数据迁移到数据库。
- 增加真实文件上传、评论保存、审批流保存。
- 增加通知中心和数据复盘页面。
- 为注册审核和人员调动增加真实后端接口。
