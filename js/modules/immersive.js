/**
 * 时锦起始页 - 沉浸模式模块
 * 处理沉浸模式的切换
 */

import { state } from '../config.js';
import { showToast } from '../utils/dom.js';

/**
 * 初始化沉浸模式
 */
export function init() {
    const mainContainer = document.getElementById('mainContainer');
    if (!mainContainer) return;
    
    mainContainer.addEventListener('dblclick', (e) => {
        // 设置面板打开时不触发
        if (state.isSettingsOpen) return;
        
        // 不触发在交互元素上
        if (e.target.closest('.search-box') || 
            e.target.closest('.shortcut-item') ||
            e.target.closest('.time-module')) {
            return;
        }
        
        toggleImmersiveMode();
    });
}

/**
 * 切换沉浸模式
 */
export function toggleImmersiveMode() {
    state.isImmersive = !state.isImmersive;
    const mainContainer = document.getElementById('mainContainer');
    if (mainContainer) {
        mainContainer.classList.toggle('immersive', state.isImmersive);
    }
    
    if (state.isImmersive) {
        showToast('双击空白处退出沉浸模式');
    }
}
