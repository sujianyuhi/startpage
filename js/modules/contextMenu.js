/**
 * 时锦起始页 - 右键菜单模块
 * 处理右键菜单的显示和交互
 */

import { showToast } from '../utils/dom.js';
import { openSettings } from './settings.js';
import { openShortcutModal } from './shortcuts.js';
import { updateWallpaper } from './wallpaper.js';
import { toggleImmersiveMode } from './immersive.js';

/**
 * 初始化右键菜单
 */
export function init() {
    const menu = document.getElementById('contextMenu');
    if (!menu) return;
    
    document.addEventListener('contextmenu', (e) => {
        // 不显示在交互元素上
        if (e.target.closest('.search-box') || 
            e.target.closest('.shortcut-item') ||
            e.target.closest('.todo-module') ||
            e.target.closest('.settings-panel') ||
            e.target.closest('.modal')) {
            return;
        }
        
        e.preventDefault();
        menu.style.left = `${Math.min(e.clientX, window.innerWidth - 200)}px`;
        menu.style.top = `${Math.min(e.clientY, window.innerHeight - 250)}px`;
        menu.classList.add('active');
    });
    
    document.addEventListener('click', () => {
        menu.classList.remove('active');
    });
    
    // 刷新壁纸
    const ctxRefreshWallpaper = document.getElementById('ctxRefreshWallpaper');
    if (ctxRefreshWallpaper) {
        ctxRefreshWallpaper.addEventListener('click', () => {
            updateWallpaper();
            showToast('壁纸已刷新');
        });
    }
    
    // 打开设置
    const ctxSettings = document.getElementById('ctxSettings');
    if (ctxSettings) {
        ctxSettings.addEventListener('click', openSettings);
    }
    
    // 添加快捷方式
    const ctxAddShortcut = document.getElementById('ctxAddShortcut');
    if (ctxAddShortcut) {
        ctxAddShortcut.addEventListener('click', openShortcutModal);
    }
    
    // 沉浸模式
    const ctxImmersive = document.getElementById('ctxImmersive');
    if (ctxImmersive) {
        ctxImmersive.addEventListener('click', toggleImmersiveMode);
    }
}
