/**
 * 时锦起始页 - 设置模块
 * 处理设置面板的交互和数据管理
 */

import { state, defaultSettings, CONFIG } from '../config.js';
import * as storage from '../utils/storage.js';
import { showToast, showConfirm } from '../utils/dom.js';
import { renderShortcuts } from './shortcuts.js';
import { renderTodos } from './todo.js';
import * as weather from './weather.js';
import * as todo from './todo.js';
import { updateWallpaper } from './wallpaper.js';

/**
 * 初始化设置模块
 */
export function init() {
    const trigger = document.getElementById('settingsTrigger');
    const overlay = document.getElementById('settingsOverlay');
    const panel = document.getElementById('settingsPanel');
    const closeBtn = document.getElementById('settingsClose');
    const tabs = document.querySelectorAll('.settings-tab');
    
    // 打开设置
    if (trigger) {
        trigger.addEventListener('click', openSettings);
    }
    
    // 关闭设置
    if (overlay) {
        overlay.addEventListener('click', closeSettings);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSettings);
    }
    
    // Tab切换
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
            const section = document.getElementById(`tab-${tabName}`);
            if (section) {
                section.classList.add('active');
            }
        });
    });
    
    // 初始化设置项
    initSettingControls();
}

/**
 * 打开设置面板
 */
export function openSettings() {
    state.isSettingsOpen = true;
    const overlay = document.getElementById('settingsOverlay');
    const panel = document.getElementById('settingsPanel');
    if (overlay) overlay.classList.add('active');
    if (panel) panel.classList.add('active');
}

/**
 * 关闭设置面板
 */
export function closeSettings() {
    state.isSettingsOpen = false;
    const overlay = document.getElementById('settingsOverlay');
    const panel = document.getElementById('settingsPanel');
    if (overlay) overlay.classList.remove('active');
    if (panel) panel.classList.remove('active');
}

/**
 * 初始化设置控件
 */
function initSettingControls() {
    // 显示秒数
    bindCheckbox('showSeconds', (checked) => {
        state.settings.showSeconds = checked;
        storage.set('settings', state.settings);
    });
    
    // 显示农历
    bindCheckbox('showLunar', (checked) => {
        state.settings.showLunar = checked;
        storage.set('settings', state.settings);
    });
    
    // 显示天气
    bindCheckbox('showWeather', (checked) => {
        state.settings.showWeather = checked;
        storage.set('settings', state.settings);
        weather.toggleWeather(checked);
    });
    
    // 显示待办
    bindCheckbox('showTodo', (checked) => {
        state.settings.showTodo = checked;
        storage.set('settings', state.settings);
        todo.toggleTodo(checked);
    });
    
    // 页面动画
    bindCheckbox('enableAnimations', (checked) => {
        state.settings.enableAnimations = checked;
        storage.set('settings', state.settings);
        document.body.style.setProperty('--transition-fast', checked ? '150ms' : '0ms');
        document.body.style.setProperty('--transition-normal', checked ? '250ms' : '0ms');
        document.body.style.setProperty('--transition-slow', checked ? '350ms' : '0ms');
    });
    
    // 搜索建议
    bindCheckbox('enableSuggestions', (checked) => {
        state.settings.enableSuggestions = checked;
        storage.set('settings', state.settings);
    });
    
    // 建议数量
    bindSlider('suggestionCount', (value) => {
        state.settings.suggestionCount = parseInt(value);
        storage.set('settings', state.settings);
    });
    
    // 搜索框位置
    bindSelect('searchPosition', (value) => {
        state.settings.searchPosition = value;
        storage.set('settings', state.settings);
        const container = document.getElementById('mainContainer');
        if (container) {
            if (value === 'top') {
                container.style.justifyContent = 'flex-start';
                container.style.paddingTop = '15vh';
            } else {
                container.style.justifyContent = 'center';
                container.style.paddingTop = '';
            }
        }
    });
    
    // 快捷方式每行数量
    bindSlider('shortcutsPerRow', (value) => {
        state.settings.shortcutsPerRow = parseInt(value);
        storage.set('settings', state.settings);
        renderShortcuts();
    });
    
    // 显示快捷方式名称
    bindCheckbox('showShortcutNames', (checked) => {
        state.settings.showShortcutNames = checked;
        storage.set('settings', state.settings);
        renderShortcuts();
    });
    
    // 壁纸源
    bindSelect('wallpaperSource', (value) => {
        state.settings.wallpaperSource = value;
        storage.set('settings', state.settings);
        updateWallpaperSourceUI();
        updateWallpaper();
    });
    
    // Unsplash关键词
    const unsplashInput = document.getElementById('unsplashKeyword');
    if (unsplashInput) {
        unsplashInput.value = state.settings.unsplashKeyword;
        unsplashInput.addEventListener('change', (e) => {
            state.settings.unsplashKeyword = e.target.value;
            storage.set('settings', state.settings);
            updateWallpaper();
        });
    }
    
    // 本地壁纸上传
    const localWallpaperInput = document.getElementById('localWallpaperInput');
    if (localWallpaperInput) {
        localWallpaperInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    storage.set('localWallpaper', e.target.result);
                    updateWallpaper();
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // 颜色选择
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            state.settings.backgroundColor = option.dataset.color;
            storage.set('settings', state.settings);
            updateWallpaper();
        });
    });
    
    // 壁纸模糊度
    bindSlider('wallpaperBlur', (value) => {
        state.settings.wallpaperBlur = parseInt(value);
        storage.set('settings', state.settings);
        updateWallpaper();
    });
    
    // 遮罩层透明度
    bindSlider('wallpaperOverlay', (value) => {
        state.settings.wallpaperOverlay = parseInt(value);
        storage.set('settings', state.settings);
        updateWallpaper();
    });
    
    // 自动切换壁纸
    bindSelect('wallpaperAutoChange', (value) => {
        state.settings.wallpaperAutoChange = value;
        storage.set('settings', state.settings);
    });
    
    // 导出配置
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportSettings);
    }
    
    // 导入配置
    const importInput = document.getElementById('importInput');
    if (importInput) {
        importInput.addEventListener('change', importSettings);
    }
    
    // 重置设置
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            showConfirm('重置设置', '确定要恢复所有设置为默认值吗？', () => {
                state.settings = { ...defaultSettings };
                storage.set('settings', state.settings);
                location.reload();
            });
        });
    }
    
    // 清空所有数据
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            showConfirm('清空数据', '确定要删除所有本地存储的数据吗？此操作不可恢复。', () => {
                storage.clear();
                location.reload();
            });
        });
    }
    
    // 快捷方式弹窗
    const cancelShortcutBtn = document.getElementById('cancelShortcutBtn');
    const confirmShortcutBtn = document.getElementById('confirmShortcutBtn');
    
    if (cancelShortcutBtn) {
        cancelShortcutBtn.addEventListener('click', closeShortcutModal);
    }
    
    if (confirmShortcutBtn) {
        confirmShortcutBtn.addEventListener('click', confirmAddShortcut);
    }
    
    // 确认弹窗
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    if (cancelConfirmBtn) {
        cancelConfirmBtn.addEventListener('click', () => {
            const confirmModal = document.getElementById('confirmModal');
            if (confirmModal) {
                confirmModal.classList.remove('active');
            }
        });
    }
    
    updateWallpaperSourceUI();
}

/**
 * 绑定复选框
 * @param {string} id - 元素ID
 * @param {Function} callback - 回调函数
 */
function bindCheckbox(id, callback) {
    const element = document.getElementById(id);
    if (!element) return;
    
    element.checked = state.settings[id];
    element.addEventListener('change', (e) => {
        callback(e.target.checked);
    });
}

/**
 * 绑定滑块
 * @param {string} id - 元素ID
 * @param {Function} callback - 回调函数
 */
function bindSlider(id, callback) {
    const element = document.getElementById(id);
    const valueElement = document.getElementById(id + 'Value');
    if (!element) return;
    
    element.value = state.settings[id];
    if (valueElement) {
        valueElement.textContent = state.settings[id] + (id.includes('Blur') ? 'px' : id.includes('Overlay') ? '%' : '');
    }
    
    element.addEventListener('input', (e) => {
        const value = e.target.value;
        if (valueElement) {
            valueElement.textContent = value + (id.includes('Blur') ? 'px' : id.includes('Overlay') ? '%' : '');
        }
        callback(value);
    });
}

/**
 * 绑定下拉选择
 * @param {string} id - 元素ID
 * @param {Function} callback - 回调函数
 */
function bindSelect(id, callback) {
    const element = document.getElementById(id);
    if (!element) return;
    
    element.value = state.settings[id];
    element.addEventListener('change', (e) => {
        callback(e.target.value);
    });
}

/**
 * 更新壁纸源UI显示
 */
function updateWallpaperSourceUI() {
    const source = state.settings.wallpaperSource;
    const unsplashContainer = document.getElementById('unsplashKeywordContainer');
    const localContainer = document.getElementById('localWallpaperContainer');
    const colorContainer = document.getElementById('colorWallpaperContainer');
    
    if (unsplashContainer) {
        unsplashContainer.style.display = source === 'unsplash' ? 'block' : 'none';
    }
    if (localContainer) {
        localContainer.style.display = source === 'local' ? 'block' : 'none';
    }
    if (colorContainer) {
        colorContainer.style.display = source === 'color' ? 'block' : 'none';
    }
}

/**
 * 导出设置
 */
function exportSettings() {
    const data = {
        version: CONFIG.version,
        settings: state.settings,
        shortcuts: state.shortcuts,
        todos: state.todos,
        searchEngines: state.searchEngines,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `起始页配置_${new Date().toLocaleDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('配置已导出');
}

/**
 * 导入设置
 * @param {Event} e - 文件选择事件
 */
function importSettings(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.settings) {
                state.settings = { ...defaultSettings, ...data.settings };
                storage.set('settings', state.settings);
            }
            
            if (data.shortcuts) {
                state.shortcuts = data.shortcuts;
                storage.set('shortcuts', state.shortcuts);
            }
            
            if (data.todos) {
                state.todos = data.todos;
                storage.set('todos', state.todos);
            }
            
            if (data.searchEngines) {
                state.searchEngines = data.searchEngines;
                storage.set('searchEngines', state.searchEngines);
            }
            
            showToast('配置已导入，页面即将刷新');
            setTimeout(() => location.reload(), 1500);
        } catch (err) {
            showToast('配置文件格式错误');
        }
    };
    reader.readAsText(file);
}

/**
 * 确认添加快捷方式
 */
function confirmAddShortcut() {
    const nameInput = document.getElementById('shortcutNameInput');
    const urlInput = document.getElementById('shortcutUrlInput');
    
    if (!nameInput || !urlInput) return;
    
    let name = nameInput.value.trim();
    let url = urlInput.value.trim();
    
    if (!name || !url) {
        showToast('请填写完整信息');
        return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    const id = Date.now().toString();
    state.shortcuts.push({ id, name, url, icon: '' });
    storage.set('shortcuts', state.shortcuts);
    renderShortcuts();
    
    closeShortcutModal();
    showToast('快捷方式已添加');
}

/**
 * 关闭快捷方式弹窗
 */
function closeShortcutModal() {
    const modal = document.getElementById('shortcutModal');
    const nameInput = document.getElementById('shortcutNameInput');
    const urlInput = document.getElementById('shortcutUrlInput');
    
    if (modal) modal.classList.remove('active');
    if (nameInput) nameInput.value = '';
    if (urlInput) urlInput.value = '';
}
