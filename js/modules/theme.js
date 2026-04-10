/**
 * 时锦起始页 - 主题管理模块
 * 处理深色/浅色模式切换和系统主题监听
 */

import { state } from '../config.js';
import * as storage from '../utils/storage.js';

/**
 * 初始化主题
 */
export function init() {
    updateTheme();
    
    // 监听系统主题变化
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (state.settings.followSystemTheme) {
                state.settings.darkMode = e.matches;
                storage.set('settings', state.settings);
                updateTheme();
            }
        });
    }
}

/**
 * 更新主题
 */
export function updateTheme() {
    const isDark = state.settings.darkMode;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

/**
 * 切换主题
 */
export function toggleTheme() {
    state.settings.darkMode = !state.settings.darkMode;
    storage.set('settings', state.settings);
    updateTheme();
}

/**
 * 设置主题模式
 * @param {boolean} isDark - 是否为深色模式
 */
export function setDarkMode(isDark) {
    state.settings.darkMode = isDark;
    storage.set('settings', state.settings);
    updateTheme();
}
