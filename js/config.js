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
        '晴': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1.5" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22.5"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1.5" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22.5" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>',
        '多云': '<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3" fill="currentColor" opacity="0.5"/><g stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="2.5" x2="8" y2="4"/><line x1="3.5" y1="8" x2="5" y2="8"/><line x1="8" y1="12" x2="8" y2="13"/><line x1="4.2" y1="4.2" x2="5.3" y2="5.3"/><line x1="4.2" y1="11.8" x2="5.3" y2="10.7"/><line x1="11.8" y1="4.2" x2="10.7" y2="5.3"/></g><path d="M19 12h-1.26A6 6 0 1 0 11 18h8a4 4 0 0 0 0-8z" fill="currentColor"/></svg>',
        '阴': '<svg viewBox="0 0 24 24"><path d="M19 12h-1.26A6 6 0 1 0 11 18h8a4 4 0 0 0 0-8z" fill="currentColor" opacity="0.85"/><path d="M7 15h-1a3 3 0 0 1 0-6h.26A5 5 0 0 1 15 7.5 4.5 4.5 0 0 1 19 12" fill="currentColor" opacity="0.5"/></svg>',
        '雨': '<svg viewBox="0 0 24 24"><path d="M19 10h-1.26A6 6 0 1 0 11 16h8a4 4 0 0 0 0-8z" fill="currentColor"/><g stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round"><line x1="8" y1="19" x2="7" y2="22"/><line x1="12" y1="19" x2="11" y2="22"/><line x1="16" y1="19" x2="15" y2="22"/></g></svg>',
        '雪': '<svg viewBox="0 0 24 24"><path d="M19 10h-1.26A6 6 0 1 0 11 16h8a4 4 0 0 0 0-8z" fill="currentColor"/><g fill="currentColor" opacity="0.8"><circle cx="8" cy="20" r="1.2"/><circle cx="12" cy="21.5" r="1"/><circle cx="16" cy="20" r="1.2"/><circle cx="10" cy="22.5" r="0.8"/><circle cx="14" cy="22.5" r="0.8"/></g></svg>'
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
    wallpaperSource: 'gradient',
    unsplashKeyword: 'nature',
    wallpaperBlur: 0,
    wallpaperOverlay: 0,
    wallpaperAutoChange: 'never',
    backgroundColor: '#ffffff',
    backgroundGradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
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
