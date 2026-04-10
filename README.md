# 时锦起始页

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/ES6+-green?logo=javascript&logoColor=white" alt="ES6+">
  <img src="https://img.shields.io/badge/PWA-5A0FC8?logo=pwa&logoColor=white" alt="PWA">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT License">
</p>

<p align="center">
  <b>一款精致优雅的浏览器起始页，让每一次打开浏览器都成为一种享受</b>
</p>

<p align="center">
  <a href="#-功能特性">功能特性</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-使用指南">使用指南</a> •
  <a href="#-项目结构">项目结构</a> •
  <a href="#-自定义">自定义</a>
</p>

---

## ✨ 功能特性

### 🎯 核心优势

| 特性 | 说明 |
|------|------|
| **零依赖** | 纯原生技术栈，无需构建工具 |
| **隐私优先** | 数据本地存储，不上传任何服务器 |
| **开箱即用** | 双击即用，零配置部署 |
| **极致性能** | 首屏 < 80ms，体积 < 300KB |
| **PWA 支持** | 可安装为桌面应用，离线可用 |

### 🔍 智能搜索

- **多引擎聚合**：必应、百度、谷歌、搜狗、知乎、B站、GitHub、掘金
- **实时建议**：输入时即时显示搜索建议，支持键盘导航
- **快捷指令**：`g 关键词` 谷歌搜索、`b 关键词` 百度搜索等
- **智能识别**：自动识别 URL 和 IP 地址，一键直达

### 🖼️ 精美壁纸

- **必应每日**：自动同步必应每日高清壁纸
- **Unsplash**：随机高质量摄影图片，支持关键词筛选
- **本地上传**：使用个人收藏的图片作为背景
- **纯色/渐变**：简约风格随心切换
- **自动切换**：定时更换壁纸，保持新鲜感

### ⚡ 快捷导航

- **拖拽排序**：自由调整快捷方式位置
- **智能图标**：自动获取网站 favicon
- **右键管理**：快速编辑、删除快捷方式
- **预设库**：20+ 常用网站一键添加

### 📅 实用工具

- **实时时钟**：支持 12/24 小时制，可选显示秒数
- **农历日期**：传统农历与公历双显示
- **天气信息**：自动定位，实时天气、湿度、风力
- **待办事项**：简洁的任务管理，支持优先级排序

### 🎨 个性化设置

- **深色模式**：支持跟随系统或手动切换
- **模块开关**：自由显示/隐藏各功能模块
- **数据管理**：JSON 格式备份与恢复
- **沉浸模式**：双击空白处进入纯净壁纸模式

---

## 🚀 快速开始

### 方式一：直接使用（推荐）

1. 下载项目中的 `index.html` 文件
2. 双击打开，即刻使用

### 方式二：设为浏览器主页

#### Chrome / Edge

1. 安装扩展：[New Tab Redirect](https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna)
2. 在扩展设置中填入文件路径：`file:///C:/Users/你的用户名/Documents/startpage/index.html`

#### Firefox

1. 安装扩展：[New Tab Override](https://addons.mozilla.org/firefox/addon/new-tab-override/)
2. 设置本地文件路径

#### 高级方案（推荐）

将项目部署到本地服务器（如 `http://localhost:8080`），再使用上述扩展设置。

### 方式三：部署到服务器

```bash
# 克隆项目
git clone https://github.com/yourusername/shijin-startpage.git

# 进入目录
cd shijin-startpage

# 使用任意静态服务器部署
# Python 3
python -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```

---

## 📖 使用指南

### 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + K` | 聚焦搜索框 |
| `Ctrl/Cmd + ,` | 打开/关闭设置 |
| `Ctrl/Cmd + N` | 添加快捷方式 |
| `Esc` | 关闭面板 / 取消聚焦 |
| `Space` | 切换壁纸（搜索框未聚焦时） |
| `↑ / ↓` | 搜索建议导航 |

### 右键菜单

在页面空白处右键，可快速：
- 🔄 刷新壁纸
- ⚙️ 打开设置
- ➕ 添加快捷方式
- 🌙 切换深色模式
- 🖼️ 进入沉浸模式

### 沉浸模式

双击页面空白区域，所有界面元素优雅淡出，只留纯净壁纸；再次双击恢复。

---

## 📁 项目结构

```
startpage/
├── index.html              # 主入口文件（推荐直接使用）
├── manifest.json           # PWA 配置文件
├── README.md               # 项目说明
├── LICENSE                 # 许可证
├── css/                    # 样式文件
│   ├── main.css           # 样式入口
│   ├── variables.css      # CSS 变量
│   ├── base.css           # 基础重置
│   ├── layout.css         # 布局样式
│   └── components/        # 组件样式
│       ├── search.css
│       ├── shortcuts.css
│       ├── wallpaper.css
│       ├── time.css
│       ├── weather.css
│       ├── todo.css
│       ├── settings.css
│       └── ...
└── js/                     # 脚本文件
    ├── main.js            # 主入口
    ├── config.js          # 配置文件
    ├── utils/             # 工具函数
    │   ├── dom.js
    │   └── storage.js
    └── modules/           # 功能模块
        ├── search.js
        ├── shortcuts.js
        ├── wallpaper.js
        ├── time.js
        ├── weather.js
        ├── todo.js
        ├── settings.js
        ├── theme.js
        ├── keyboard.js
        ├── immersive.js
        └── contextMenu.js
```

---

## 🎨 自定义

### 修改主题色

编辑 `css/variables.css`：

```css
:root {
  --primary-color: #42b883;    /* 主色调 */
  --primary-hover: #3aa876;    /* 悬停色 */
}
```

### 添加搜索引擎

编辑 `js/config.js`：

```javascript
{
  id: 'custom',
  name: '自定义引擎',
  url: 'https://example.com/search?q={q}',
  icon: 'https://example.com/favicon.ico',
  shortcut: 'c'    // 快捷指令，如 "c 关键词"
}
```

### 修改默认快捷方式

在 `js/config.js` 的 `CONFIG.defaultShortcuts` 中修改预设网站。

### 更换天气 API

编辑 `js/modules/weather.js`，替换为高德地图或其他天气 API：

```javascript
// 高德地图 API（需申请 Key）
const AMAP_KEY = '你的高德Key';
```

---

## 🔌 API 说明

| 功能 | 服务 | 说明 |
|------|------|------|
| 壁纸 | Bing Image Archive | 微软官方 API，无需密钥 |
| 随机图片 | Unsplash Source | 免费高质量图片 API |
| 天气 | Open-Meteo + IPAPI | 免费天气和定位服务 |
| 搜索建议 | 百度 Suggestion | 公开 JSONP 接口 |

---

## 🌐 浏览器兼容

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 80+ |
| Edge | 80+ |
| Firefox | 75+ |
| Safari | 13+ |

---

## 🔒 隐私说明

- ✅ 所有数据仅存储在浏览器 `localStorage` 中
- ✅ 不向任何第三方服务器上传用户数据
- ✅ 壁纸、天气功能仅在初始化时请求公开 API
- ✅ 无埋点、无统计、无广告追踪

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

---

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证 - 可自由使用、修改、分发。

---

## 📝 更新日志

### v1.0.0 (2024-04-10)

- ✨ 初始版本发布
- 🔍 多引擎聚合搜索
- 🖼️ 智能壁纸系统
- ⚡ 快捷方式管理
- 📅 时间天气展示
- ✅ 待办事项功能
- 🎨 深色模式支持
- 📱 PWA 离线应用

---

<p align="center">
  Made with ❤️ by 时锦起始页
</p>
