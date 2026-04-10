# 时锦起始页 - 重构说明文档

## 一、重构目标

将原本单文件 HTML 网站按照"低耦合、高内聚"原则进行拆分重构，实现：

1. **样式与结构分离**：CSS 独立为模块化文件
2. **逻辑与结构分离**：JavaScript 按功能模块拆分
3. **语义化 HTML**：使用恰当的 HTML5 语义标签
4. **可维护性提升**：清晰的文件结构和命名规范

---

## 二、目录结构

```
startpage/
├── index.html              # 主 HTML 文件（仅包含结构和引用）
├── manifest.json           # PWA 配置文件
├── REFACTOR.md            # 本重构说明文档
├── css/                   # 样式文件目录
│   ├── main.css           # 主样式入口（导入所有模块）
│   ├── variables.css      # CSS 变量定义
│   ├── base.css           # 基础重置和工具类
│   ├── layout.css         # 布局样式
│   └── components/        # 组件样式目录
│       ├── wallpaper.css  # 壁纸背景
│       ├── time.css       # 时间日期
│       ├── search.css     # 搜索组件
│       ├── shortcuts.css  # 快捷方式
│       ├── weather.css    # 天气模块
│       ├── todo.css       # 待办事项
│       ├── settings.css   # 设置面板
│       ├── context-menu.css # 右键菜单
│       ├── modal.css      # 弹窗组件
│       ├── toast.css      # 提示消息
│       └── about.css      # 关于页面
├── js/                    # JavaScript 文件目录
│   ├── main.js            # 主入口文件
│   ├── config.js          # 配置和状态管理
│   ├── utils/             # 工具函数目录
│   │   ├── storage.js     # 本地存储管理
│   │   └── dom.js         # DOM 操作工具
│   └── modules/           # 功能模块目录
│       ├── theme.js       # 主题管理
│       ├── wallpaper.js   # 壁纸管理
│       ├── time.js        # 时间管理
│       ├── weather.js     # 天气管理
│       ├── search.js      # 搜索功能
│       ├── shortcuts.js   # 快捷方式管理
│       ├── todo.js        # 待办事项
│       ├── settings.js    # 设置面板
│       ├── contextMenu.js # 右键菜单
│       ├── immersive.js   # 沉浸模式
│       └── keyboard.js    # 键盘快捷键
└── assets/                # 静态资源目录（图片等）
```

---

## 三、文件职责说明

### 3.1 HTML 文件

**index.html**
- 职责：定义页面结构，引入 CSS 和 JS 文件
- 特点：
  - 使用语义化标签（`<main>`, `<section>`, `<aside>`, `<nav>`, `<header>` 等）
  - 添加 ARIA 无障碍属性
  - 移除所有内联样式和脚本

### 3.2 CSS 文件

| 文件 | 职责 | 依赖 |
|------|------|------|
| `variables.css` | 定义 CSS 变量（颜色、尺寸、动画等） | 无 |
| `base.css` | 全局重置、工具类、动画定义 | variables.css |
| `layout.css` | 主容器布局、响应式布局 | variables.css |
| `components/*.css` | 各组件的具体样式 | variables.css, base.css |
| `main.css` | 导入所有样式文件 | 所有其他 CSS |

### 3.3 JavaScript 文件

| 文件 | 职责 | 依赖 |
|------|------|------|
| `config.js` | 应用常量、默认配置、全局状态 | 无 |
| `utils/storage.js` | localStorage 封装 | 无 |
| `utils/dom.js` | DOM 操作工具函数 | 无 |
| `modules/theme.js` | 深色/浅色模式切换 | config.js, storage.js |
| `modules/wallpaper.js` | 壁纸加载、缓存、自动切换 | config.js, storage.js |
| `modules/time.js` | 时间显示、日期格式化、问候语 | 无 |
| `modules/weather.js` | 天气数据获取和显示 | config.js, dom.js |
| `modules/search.js` | 搜索功能、搜索引擎切换、建议 | config.js, storage.js, dom.js |
| `modules/shortcuts.js` | 快捷方式渲染、添加、删除 | config.js, storage.js, dom.js |
| `modules/todo.js` | 待办事项管理 | config.js, storage.js, dom.js |
| `modules/settings.js` | 设置面板交互和数据管理 | 多个模块 |
| `modules/contextMenu.js` | 右键菜单 | settings.js, shortcuts.js |
| `modules/immersive.js` | 沉浸模式切换 | config.js, dom.js |
| `modules/keyboard.js` | 全局键盘快捷键 | 多个模块 |
| `main.js` | 初始化所有模块 | 所有模块 |

---

## 四、依赖关系图

```
main.js
├── config.js (状态管理)
├── utils/
│   ├── storage.js
│   └── dom.js
└── modules/
    ├── theme.js ─────┐
    ├── wallpaper.js ─┤
    ├── time.js ──────┤
    ├── weather.js ───┤
    ├── search.js ────┤
    ├── shortcuts.js ─┤
    ├── todo.js ──────┤
    ├── settings.js ──┼──┬──┬──┬──┬──┬──┬── (依赖所有模块)
    ├── contextMenu.js ┘  │  │  │  │  │  │
    ├── immersive.js ─────┘  │  │  │  │  │
    └── keyboard.js ─────────┴──┴──┴──┴──┘
```

---

## 五、命名规范

### 5.1 CSS 类名（BEM 风格）

```
.block                    # 块级组件
.block__element          # 元素
.block--modifier         # 修饰符
.block__element--modifier # 元素修饰符

示例：
.search-container         # 搜索容器
.search-box               # 搜索框
.search-input             # 搜索输入框
.search-btn               # 搜索按钮
.search-btn--active       # 激活状态的搜索按钮
```

### 5.2 JavaScript 模块

- 文件名：小写，多词用连字符（如 `context-menu.js`）
- 导出：使用 ES6 命名导出（`export function`）
- 常量：全大写下划线（`CONFIG`, `DEFAULT_SETTINGS`）
- 函数：驼峰命名（`updateTheme`, `renderShortcuts`）

### 5.3 ID 命名

- 使用驼峰命名
- 前缀表示类型：`btn`（按钮）、`input`（输入框）、`container`（容器）

```
settingsTrigger    # 设置触发按钮
searchInput        # 搜索输入框
shortcutsGrid      # 快捷方式网格
```

---

## 六、低耦合设计

### 6.1 模块间通信

- 通过 `config.js` 中的 `state` 对象共享状态
- 模块通过事件监听响应变化
- 避免直接操作其他模块的 DOM

### 6.2 样式隔离

- 每个组件有独立的 CSS 文件
- 使用 CSS 变量统一管理主题
- 避免全局选择器污染

### 6.3 数据流

```
用户操作 → 模块函数 → 更新 state → 存储到 localStorage → 重新渲染
```

---

## 七、高内聚设计

### 7.1 功能内聚

每个模块只负责一个明确的功能：
- `theme.js`：只处理主题切换
- `search.js`：只处理搜索相关功能
- `shortcuts.js`：只处理快捷方式管理

### 7.2 数据内聚

相关数据集中管理：
- 设置项 → `state.settings`
- 快捷方式 → `state.shortcuts`
- 待办事项 → `state.todos`

---

## 八、后续维护指南

### 8.1 添加新功能

1. **添加新组件样式**：
   - 在 `css/components/` 创建新文件
   - 在 `css/main.css` 中导入

2. **添加新功能模块**：
   - 在 `js/modules/` 创建新文件
   - 在 `js/main.js` 中导入并初始化

3. **添加新设置项**：
   - 在 `config.js` 的 `defaultSettings` 中添加默认值
   - 在 `index.html` 的设置面板中添加 UI
   - 在 `settings.js` 中添加事件绑定

### 8.2 修改现有功能

1. **修改样式**：直接编辑对应的 `css/components/*.css` 文件
2. **修改逻辑**：直接编辑对应的 `js/modules/*.js` 文件
3. **修改结构**：编辑 `index.html`，注意保持 ID 一致性

### 8.3 调试技巧

- 使用浏览器 DevTools 的 Sources 面板查看模块化代码
- 在 `main.js` 的 `init()` 函数中添加断点
- 使用 `console.log(state)` 查看当前应用状态

---

## 九、与原文件的对比

| 项目 | 原文件 | 重构后 |
|------|--------|--------|
| 文件数量 | 1 个 HTML | 20+ 个文件 |
| 代码行数 | ~3500 行（单文件） | 分散到各模块 |
| CSS | 内联 `<style>` | 模块化 CSS 文件 |
| JavaScript | 内联 `<script>` | ES6 模块 |
| 可维护性 | 低 | 高 |
| 可扩展性 | 低 | 高 |
| 语义化 | 一般 | 良好（ARIA 支持） |

---

## 十、浏览器兼容性

- **Chrome/Edge**: 80+
- **Firefox**: 75+
- **Safari**: 13+

使用 ES6 模块，需要现代浏览器支持。如需支持旧浏览器，可使用构建工具（如 Vite、Webpack）进行打包转换。

---

## 十一、许可证

MIT License - 可自由使用、修改、分发
