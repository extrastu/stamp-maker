# 💌 Stamp Maker — 复古邮票生成器

<div align="center">

![Stamp Maker Banner](./public/logo.png)

### 把日常随手拍，一键变成专属复古齿孔小邮票

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Xiaohongshu](https://img.shields.io/badge/Xiaohongshu-关注作者-FF2442.svg)](https://xhslink.cn/m/lTR6WMDnhB)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

[功能特性](#-功能特性) • [在线体验](#-快速开始) • [关注作者](#-关注作者) • [小红书小工具适配](#-小红书离线小工具集成) • [开源协议](#-开源协议)

</div>

---

## 📖 项目简介

**Stamp Maker** 是一款轻量、优雅且功能强大的复古齿孔邮票图片制作工具。专为手账爱好者、摄影博主及小红书图文创作者打造。

支持一键将日常照片转换为具有真实物理镂空齿孔的复古邮票，提供满幅直接打孔、经典留白、多种齿孔密度调节与高清透明 PNG 导出。**100% 浏览器纯本地 Canvas 离线渲染，无需上传任何服务器，极致保障用户照片隐私安全。**

---

## ✨ 功能特性

- ✂️ **真实物理齿孔镂空算法**：基于 HTML5 Canvas `destination-out` 复合图层运算，生成逼真的圆弧边缘镂空效果。
- 🖼️ **满幅切图与留白自由调节**：
  - **满幅打孔（0 留白）**：齿孔直接咬合在照片边缘，画面满幅呈现。
  - **经典留白（14px+）**：模拟传统邮票与相框衬纸白边。
- 📐 **多画幅智能裁剪**：支持 `1:1`、`3:4`、`4:3`、`2:3`、`9:16` 常见比例构图，支持画面缩放、平移与一键旋转/回正（`0°` / `90°` / `180°` / `270°`）。
- 🎨 **多款经典齿孔预设**：
  - **标准齿**：经典邮票齿孔比例，均衡耐看。
  - **复古密齿**：高密度细密齿孔，精致复古。
  - **艺术大齿**：现代几何大齿孔，张力十足。
- 🌈 **个性化衬纸底色**：提供纯白、复古浅黄、薄荷青绿、柔粉、淡蓝、曜黑等多款高级纸张底衬。
- 📕 **小红书图文一键发布**：原生集成小红书 JSBridge `postNote` 能力，一键将生成的邮票带入小红书发布器。
- 💾 **高精度多格式导出**：支持 `1080p` 社交快传、`2160p` 超清手账级与 `3240p` 极清印刷级分辨率，支持透明 PNG、JPEG、WEBP 格式。
- 🔒 **100% 离线与隐私安全**：纯客户端本地运行，无后端、无接口请求，零数据泄露风险。
- 📱 **单屏零滚动自适应**：深度针对移动端与小红书 App 视口设计，操作一屏搞定。

---

## 🎨 设计语言

本项目的 UI / UX 深度参考了 **Sticker-Sheet Neo-Brutalism（贴纸风新野兽派）** 现代设计语言：

- **暖奶油纸质底色** (`#FFF4DD`)：还原复古纸张与手账本温润触感。
- **纯正墨黑粗边框** (`2px solid #26201A`) 与 **实体下沉硬投影** (`shadow-neo`)。
- **扎实的物理按压微交互**：所有按钮点击时实体投影瞬间压平（`.btn-neo`），提供极具质感的交互回弹反馈。

---

## 🛠️ 技术栈

- **Core**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [TailwindCSS 3](https://tailwindcss.com/)
- **Image Cropper**: [react-easy-crop](https://github.com/ValentinH/react-easy-crop)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [canvas-confetti](https://github.com/catdad/canvas-confetti)

---

## 🚀 快速开始

### 环境准备

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐) 或 npm / yarn

### 1. 克隆代码仓库

```bash
git clone https://github.com/extrastu/stamp-maker.git
cd stamp-maker
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 本地启动开发服务器

```bash
pnpm run dev
```

打开浏览器访问 `http://localhost:5173` 即可开始体验。

### 4. 生产环境构建

```bash
pnpm run build
```

---

## 📦 小红书离线小工具集成与打包

本项目原生适配 **小红书离线小工具（XHS Mini-Tool）** 容器规范：

- 内置经典脚本加载器格式转换（无外链跨域限制）。
- 离线静态资源全部内联/本地打包（体积仅 ~600KB，远低于 10MB 规范限制）。
- 原生支持 `window.xhs.miniTool.saveImageToPhotosAlbum` 与 `window.xhs.miniTool.postNote`。

### 一键构建离线 ZIP 安装包

```bash
pnpm run zip
```

构建完成后将在根目录生成 `stamp-maker-1.0.3.zip`，可直接上传至小红书小工具开放平台。

---

## 👤 关注作者

如果你喜欢这个小工具，欢迎关注作者的小红书账号，获取更多好玩实用的创意小工具、前端开源项目与设计分享：

- 📕 **小红书主页**：[点击关注作者小红书 extrastu](https://xhslink.cn/m/lTR6WMDnhB)
- 💬 欢迎在小红书交流反馈、提出新功能需求，或带上 `#StampMaker` 标签分享你制作的专属邮票手账作品！

---

## 📄 开源协议

本项目基于 [MIT License](./LICENSE) 开源协议分发与使用。
欢迎自由使用、修改、分发与商业化，请保留原作者版权声明。

Copyright (c) 2026 [extrastu](https://github.com/extrastu) · [小红书](https://xhslink.cn/m/lTR6WMDnhB)
