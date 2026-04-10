/**
 * 时锦起始页 - 配置文件
 * 包含应用常量、默认配置和状态管理
 */

// ==================== 应用配置 ====================
export const CONFIG = {
    version: '1.0.0',
    
    // 默认搜索引擎
    defaultEngines: [
        { id: 'bing', name: '必应', url: 'https://www.bing.com/search?q={q}', icon: 'https://www.bing.com/favicon.ico', shortcut: 'b' },
        { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd={q}', icon: 'https://www.baidu.com/favicon.ico', shortcut: 'bd' },
        { id: 'google', name: '谷歌', url: 'https://www.google.com/search?q={q}', icon: 'https://www.google.com/favicon.ico', shortcut: 'g' },
        { id: 'sogou', name: '搜狗', url: 'https://www.sogou.com/web?query={q}', icon: 'https://www.sogou.com/favicon.ico', shortcut: 'sg' },
        { id: 'zhihu', name: '知乎', url: 'https://www.zhihu.com/search?q={q}', icon: 'https://www.zhihu.com/favicon.ico', shortcut: 'zh' },
        { id: 'bilibili', name: 'B站', url: 'https://search.bilibili.com/all?keyword={q}', icon: 'https://www.bilibili.com/favicon.ico', shortcut: 'bil' },
        { id: 'github', name: 'GitHub', url: 'https://github.com/search?q={q}', icon: 'https://github.com/favicon.ico', shortcut: 'gh' },
        { id: 'juejin', name: '掘金', url: 'https://juejin.cn/search?query={q}', icon: 'https://juejin.cn/favicon.ico', shortcut: 'jj' }
    ],
    
    // 默认快捷方式
    defaultShortcuts: [
        { id: '1', name: '时锦闲记', url: 'https://me.sujianyu.cn/', icon: '' },
        { id: '2', name: '作者主页', url: 'https://myself.sujianyu.cn/', icon: '' },
        { id: '3', name: '时锦工具箱', url: 'https://shijintools.sujianyu.cn/', icon: '' },
        { id: '4', name: 'Github', url: 'https://github.com/', icon: '' },
        { id: '5', name: '抖音', url: 'https://www.douyin.com/', icon: '' },
        { id: '6', name: '豆包', url: 'https://www.doubao.com/', icon: '' },
        { id: '7', name: 'B站', url: 'https://www.bilibili.com/', icon: '' },
        { id: '8', name: 'QQ邮箱', url: 'https://mail.qq.com/', icon: '' }
    ],
    
    // 天气图标 SVG
    weatherIcons: {
        '晴': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
        '多云': '<svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor"/></svg>',
        '阴': '<svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor" opacity="0.7"/></svg>',
        '雨': '<svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor"/><path d="M8 21v-2M12 21v-2M16 21v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
        '雪': '<svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor"/><circle cx="8" cy="22" r="1" fill="currentColor"/><circle cx="12" cy="22" r="1" fill="currentColor"/><circle cx="16" cy="22" r="1" fill="currentColor"/></svg>'
    }
};

// ==================== 默认设置 ====================
export const defaultSettings = {
    darkMode: false,
    followSystemTheme: true,
    showSeconds: false,
    showLunar: false,
    showWeather: true,
    showTodo: true,
    enableAnimations: true,
    enableSuggestions: true,
    suggestionCount: 8,
    searchPosition: 'top',
    shortcutsPerRow: 8,
    showShortcutNames: true,
    wallpaperSource: 'color',
    unsplashKeyword: 'nature',
    wallpaperBlur: 0,
    wallpaperOverlay: 0,
    wallpaperAutoChange: 'never',
    backgroundColor: '#ffffff',
    currentEngineId: 'bing'
};

// ==================== 状态管理 ====================
export const state = {
    settings: {},
    shortcuts: [],
    todos: [],
    searchEngines: [],
    currentEngine: null,
    isSettingsOpen: false,
    isImmersive: false,
    isTodoOpen: false,
    suggestionIndex: -1,
    wallpaperCache: []
};
