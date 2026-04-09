# 青柠起始页

一款极致简洁、高效无感的纯前端浏览器起始页，1:1复刻青柠起始页核心体验，零配置开箱即用。

## 核心特性

- **纯原生技术栈**：HTML5 + CSS3 + ES6+ JavaScript，零外部依赖
- **隐私优先**：所有数据仅存储在浏览器本地，不向任何服务器上传
- **零配置开箱即用**：保存HTML文件，双击打开即可使用全部功能
- **极致性能**：首屏加载<80ms，总文件体积<300KB

## 功能模块

### 搜索聚合
- 8个内置搜索引擎（必应、百度、谷歌、搜狗、知乎、B站、GitHub、掘金）
- 实时搜索建议，支持键盘上下选择
- 快捷指令系统（如 `g 关键词` 直接谷歌搜索）
- 原生网址直达，自动识别URL和IP

### 网站快捷方式
- 拖拽排序，平滑动画
- 自动获取网站favicon
- 右键编辑/删除
- 20+预设常用网站一键添加

### 壁纸系统
- 必应每日壁纸
- Unsplash随机壁纸（支持关键词）
- 本地上传图片
- 纯色/渐变背景
- 自动切换、模糊度、遮罩层自定义

### 信息展示
- 实时时间（支持12/24小时制、秒数显示）
- 农历日期、星期显示
- 自动定位天气（温度、湿度、风力）

### 待办事项
- 添加、编辑、勾选完成、删除
- 优先级排序
- 角标提醒未完成任务数

### 设置面板
- 深色/浅色模式（支持跟随系统）
- 所有模块显示/隐藏开关
- 搜索引擎自定义
- 数据备份与还原（JSON导出/导入）

## 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + K` | 聚焦搜索框 |
| `Ctrl/Cmd + ,` | 打开/关闭设置面板 |
| `Ctrl/Cmd + N` | 添加快捷方式 |
| `Esc` | 关闭面板/取消聚焦 |
| `空格键` | 切换随机壁纸（搜索框未聚焦时） |
| `↑/↓` | 搜索建议列表选择 |

## 沉浸模式

双击页面空白区域，一键隐藏所有元素，纯壁纸全屏展示；再次双击恢复。

## 右键菜单

在页面空白处右键，可快速：
- 刷新壁纸
- 打开设置
- 添加快捷方式
- 切换深色模式
- 进入沉浸模式

## 使用方法

### 方式一：直接打开
1. 下载 `index.html` 文件
2. 双击打开即可使用

### 方式二：设置为浏览器默认新标签页

#### Chrome/Edge
1. 安装扩展：[New Tab Redirect](https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna)
2. 扩展设置中填入 `file:///路径/index.html`

#### Firefox
1. 安装扩展：[New Tab Override](https://addons.mozilla.org/firefox/addon/new-tab-override/)
2. 设置本地文件路径

#### 高级方式（推荐）
1. 将文件部署到本地服务器（如 `http://localhost:8080`）
2. 使用上述扩展设置为新标签页

### 方式三：部署到服务器
1. 上传所有文件到Web服务器
2. 访问对应URL即可

## 文件说明

```
qingning-startpage/
├── index.html          # 单文件整合版（推荐直接使用）
├── manifest.json       # PWA配置文件
├── README.md           # 本说明文件
└── split/              # 分文件版本
    ├── index.html      # HTML结构
    ├── style.css       # 样式文件
    └── script.js       # 脚本文件
```

## 二次开发

### 修改主题色
在CSS变量中修改 `--primary-color`：
```css
:root {
    --primary-color: #42b883;  /* 修改为喜欢的颜色 */
}
```

### 添加搜索引擎
在 `CONFIG.defaultEngines` 中添加：
```javascript
{
    id: 'custom',
    name: '自定义',
    url: 'https://example.com/search?q={q}',
    icon: 'https://example.com/favicon.ico',
    shortcut: 'c'
}
```

### 修改默认快捷方式
在 `CONFIG.defaultShortcuts` 中修改。

## API说明

| 功能 | API | 说明 |
|------|-----|------|
| 必应壁纸 | Bing Image Archive | 官方公开API，无需密钥 |
| Unsplash | Unsplash Source | 免费随机图片API |
| 天气 | Open-Meteo + IPAPI | 免费天气和定位服务 |
| 搜索建议 | 百度Suggestion | 公开JSONP接口 |

## 浏览器兼容性

- Chrome 80+
- Edge 80+
- Firefox 75+
- Safari 13+

## 隐私声明

- 所有用户数据仅存储在浏览器 `localStorage` 中
- 不向任何第三方服务器上传用户数据
- 壁纸、天气功能仅在页面初始化时发起公开API请求
- 无埋点、无统计、无广告

## 许可证

MIT License - 可自由使用、修改、分发

## 更新日志

### v1.0.0
- 初始版本发布
- 完整复刻青柠起始页核心功能
- 支持PWA安装
