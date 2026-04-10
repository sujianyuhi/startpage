/**
 * 时锦起始页 - 键盘快捷键模块
 * 处理全局键盘快捷键
 */

import { state } from '../config.js';
import { openSettings, closeSettings } from './settings.js';
import { openShortcutModal } from './shortcuts.js';
import { updateWallpaper } from './wallpaper.js';
import { performSearch } from './search.js';

/**
 * 初始化键盘快捷键
 */
export function init() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Ctrl/Cmd + , 打开/关闭设置
        if ((e.ctrlKey || e.metaKey) && e.key === ',') {
            e.preventDefault();
            state.isSettingsOpen ? closeSettings() : openSettings();
        }
        
        // Ctrl/Cmd + N 添加快捷方式
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openShortcutModal();
        }
        
        // Esc 关闭弹窗/面板
        if (e.key === 'Escape') {
            if (state.isSettingsOpen) {
                closeSettings();
            } else if (state.isTodoOpen) {
                state.isTodoOpen = false;
                const todoPanel = document.getElementById('todoPanel');
                if (todoPanel) {
                    todoPanel.classList.remove('active');
                }
            } else {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.blur();
                }
                // 隐藏搜索建议
                const suggestions = document.getElementById('searchSuggestions');
                if (suggestions) {
                    suggestions.classList.remove('active');
                }
                state.suggestionIndex = -1;
            }
        }
        
        // 空格键切换壁纸（搜索框未聚焦时）
        if (e.key === ' ' && document.activeElement !== document.getElementById('searchInput') 
            && document.activeElement !== document.getElementById('todoInput')
            && !document.activeElement.classList.contains('form-input')
            && !document.activeElement.classList.contains('setting-input')) {
            e.preventDefault();
            updateWallpaper();
        }
    });
}
