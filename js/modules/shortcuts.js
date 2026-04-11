/**
 * 时锦起始页 - 快捷方式模块
 * 处理快捷方式的渲染、添加和删除
 */

import { state, CONFIG } from '../config.js';
import * as storage from '../utils/storage.js';
import { escapeHtml, getHashColor, showToast, showConfirm } from '../utils/dom.js';

/**
 * 初始化快捷方式模块
 */
export function init() {
    renderShortcuts();
    
    // 预设快捷方式按钮
    document.querySelectorAll('[data-add-shortcut]').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.addShortcut;
            const url = btn.dataset.url;
            addShortcut(name, url);
        });
    });
}

/**
 * 渲染快捷方式列表
 */
export function renderShortcuts() {
    const grid = document.getElementById('shortcutsGrid');
    if (!grid) return;
    
    const showNames = state.settings.showShortcutNames;
    
    let html = state.shortcuts.map(s => `
        <a class="shortcut-item" href="${s.url}" target="_blank" data-id="${s.id}">
            <div class="shortcut-icon" style="background: ${getHashColor(s.name)}">
                ${s.icon ? `<img src="${s.icon}" alt="" onerror="this.style.display='none'; this.parentNode.textContent='${s.name[0]}'">` : s.name[0]}
            </div>
            ${showNames ? `<span class="shortcut-name">${escapeHtml(s.name)}</span>` : ''}
        </a>
    `).join('');
    
    grid.innerHTML = html;

    // 更新网格列数
    const perRow = state.settings.shortcutsPerRow;
    grid.style.gridTemplateColumns = `repeat(${perRow}, 1fr)`;

    // 右键菜单
    grid.querySelectorAll('.shortcut-item').forEach(item => {
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const id = item.dataset.id;
            showShortcutContextMenu(e, id);
        });
    });
}

/**
 * 添加快捷方式
 * @param {string} name - 网站名称
 * @param {string} url - 网站地址
 */
export function addShortcut(name, url) {
    const id = Date.now().toString();
    state.shortcuts.push({ id, name, url, icon: '' });
    storage.set('shortcuts', state.shortcuts);
    renderShortcuts();
    showToast('快捷方式已添加');
}

/**
 * 删除快捷方式
 * @param {string} id - 快捷方式ID
 */
export function deleteShortcut(id) {
    state.shortcuts = state.shortcuts.filter(s => s.id !== id);
    storage.set('shortcuts', state.shortcuts);
    renderShortcuts();
    showToast('快捷方式已删除');
}

/**
 * 打开添加快捷方式弹窗
 */
export function openShortcutModal() {
    const modal = document.getElementById('shortcutModal');
    const nameInput = document.getElementById('shortcutNameInput');
    if (modal) {
        modal.classList.add('active');
    }
    if (nameInput) {
        nameInput.focus();
    }
}

/**
 * 关闭添加快捷方式弹窗
 */
export function closeShortcutModal() {
    const modal = document.getElementById('shortcutModal');
    const nameInput = document.getElementById('shortcutNameInput');
    const urlInput = document.getElementById('shortcutUrlInput');
    
    if (modal) modal.classList.remove('active');
    if (nameInput) nameInput.value = '';
    if (urlInput) urlInput.value = '';
}

/**
 * 显示快捷方式右键菜单
 * @param {MouseEvent} e - 鼠标事件
 * @param {string} id - 快捷方式ID
 */
function showShortcutContextMenu(e, id) {
    showConfirm('删除快捷方式', '确定要删除这个快捷方式吗？', () => {
        deleteShortcut(id);
    });
}

/**
 * 确认添加快捷方式
 */
export function confirmAddShortcut() {
    const nameInput = document.getElementById('shortcutNameInput');
    const urlInput = document.getElementById('shortcutUrlInput');
    
    if (!nameInput || !urlInput) return;
    
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();
    
    if (!name || !url) {
        showToast('请填写完整信息');
        return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    addShortcut(name, url);
    closeShortcutModal();
}
