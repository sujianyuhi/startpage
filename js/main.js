/**
 * 时锦起始页 - 主入口文件
 * 负责初始化所有模块
 */

import { state, defaultSettings, CONFIG } from './config.js';
import * as storage from './utils/storage.js';

// 导入各功能模块
import * as theme from './modules/theme.js';
import * as wallpaper from './modules/wallpaper.js';
import * as time from './modules/time.js';
import * as weather from './modules/weather.js';
import * as search from './modules/search.js';
import * as shortcuts from './modules/shortcuts.js';
import * as todo from './modules/todo.js';
import * as settings from './modules/settings.js';
import * as keyboard from './modules/keyboard.js';
import * as contextMenu from './modules/contextMenu.js';
import * as immersive from './modules/immersive.js';

/**
 * 初始化应用
 */
function init() {
    // 加载保存的数据
    loadData();
    
    // 初始化搜索框位置
    initSearchPosition();
    
    // 初始化各模块
    theme.init();
    wallpaper.init();
    time.init();
    weather.init();
    search.init();
    shortcuts.init();
    todo.init();
    settings.init();
    keyboard.init();
    contextMenu.init();
    immersive.init();
    
    // 聚焦搜索框
    setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }, 100);
}

/**
 * 加载本地存储的数据
 */
function loadData() {
    // 加载设置
    state.settings = { ...defaultSettings, ...storage.get('settings', {}) };
    
    // 加载快捷方式
    state.shortcuts = storage.get('shortcuts', CONFIG.defaultShortcuts);
    
    // 加载待办事项
    state.todos = storage.get('todos', []);
    
    // 加载搜索引擎
    state.searchEngines = storage.get('searchEngines', CONFIG.defaultEngines);
    state.currentEngine = state.searchEngines.find(e => e.id === state.settings.currentEngineId) || state.searchEngines[0];
}

/**
 * 初始化搜索框位置
 */
function initSearchPosition() {
    const container = document.getElementById('mainContainer');
    if (!container) return;

    if (state.settings.searchPosition === 'top') {
        container.style.justifyContent = 'flex-start';
        container.style.paddingTop = '8vh';
        container.style.gap = 'var(--spacing-lg)';
        container.classList.add('search-position-top');
    } else {
        container.style.justifyContent = 'center';
        container.style.paddingTop = '';
        container.style.gap = '';
        container.classList.remove('search-position-top');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
