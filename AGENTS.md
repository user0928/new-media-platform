# 新媒体协作平台项目汇总

## 项目定位

这是一个面向学校社团新媒体团队的协作平台 MVP。目标是把推文项目从微信群零散沟通中整理出来，集中管理选题、采编、封面、发布、审批、文件链接和成员权限。

平台当前是 Vite + React + TypeScript 前端静态 Demo，使用模拟数据展示完整业务流程，暂未接入真实后端、数据库、登录系统或微信公众号接口。

## 当前网站能力

- 工作台：展示今日优先项目、我的任务、待审批、待发布和风险提醒。
- 我的：提供注册 / 登录模拟、当前身份切换、个人任务、待我审核和发布任务入口。
- 项目看板：按状态查看推文项目流转，包括待采编、采编中、待封面、封面中、待审批、待发布、已发布、需返工。
- 项目详情：展示单篇推文的三阶段任务、部门提交入口、提交动态、文件与链接、评论与修改意见、审批记录。
- 部门任务：采编部、技术部、运维部可查看任务池并提交交付物；高级角色可查看全部部门。
- 技术部图片提交：技术部提交表单默认使用“图片文件”，支持点击选择图片或拖拽上传。
- 提交审核流：部门提交后进入待审核，部门负责人可审核本部门提交，老师、主任和开发人员可审核全部提交。
- 成员与权限：展示成员角色、部门、启用状态、上级关系、注册审核和下级人员调动模拟。
- 移动端适配：小屏下导航改为横向滑动顶部导航，看板横向滑动，表单和卡片单列排布。

## 权限设计

- 开发人员：开发阶段默认最高权限，查看全部部门、全部任务、全部提交，并可审核和发布任务。
- 负责老师：查看全部项目，审批重点内容，查看复盘数据，可调动新媒体主任及以下成员。
- 新媒体主任：创建项目，分配任务，调整排期，可调动部门负责人和干事。
- 部门负责人：管理本部门任务，审核本部门交付物和提交记录，不开放跨部门调动。
- 干事：查看自己的任务，提交链接文件，回复修改意见。

## 用户固定要求

后续所有开发工作必须遵守以下约定：

- 禁止批量删除文件或目录。
- 不要使用 `del /s`、`rd /s`、`rmdir /s`、`Remove-Item -Recurse`、`rm -rf`。
- 如需删除文件，只能一次删除一个明确路径的文件。
- 如果需要批量删除文件，应停止操作，并让用户手动删除。
- 每次完成修改后，默认执行构建检查，并同步到 GitHub。
- GitHub 同步目标为 `https://github.com/user0928/new-media-platform` 的 `main` 分支。
- GitHub Pages 访问地址为 `https://user0928.github.io/new-media-platform/`。
- 开发阶段默认登录身份为 `Codex 开发者`，拥有最高权限。
- 新功能应优先保证任务流转清晰，不要把侧边栏做得过多、过重。
- 部门提交必须能被对应部门负责人审核。
- 老师、主任、开发人员应能选择查看全部部门和全部审核事项。
- 技术部提交封面时，图片上传应作为默认入口，支持选择文件或拖拽上传。

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
AGENTS.md                      当前项目汇总说明和用户固定要求
新媒体平台设计/开发流程记录.md  阶段开发流程、提交记录和权限流转说明
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
