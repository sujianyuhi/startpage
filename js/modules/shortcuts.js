/**
 * 时锦起始页 - 快捷方式模块
 * 处理快捷方式的渲染、添加、删除和排序
 */

import { state, CONFIG } from '../config.js';
import * as storage from '../utils/storage.js';
import { escapeHtml, getHashColor, showToast, showConfirm } from '../utils/dom.js';

// ==================== 排序状态管理 ====================
let isSorting = false;
let dragSrcEl = null;
let dragSrcIndex = -1;
let shortcutsBeforeSort = [];
let placeholderEl = null;

/**
 * 初始化快捷方式模块
 */
export function init() {
    renderShortcuts();
    initSortMode();

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
 * 初始化排序模式
 */
function initSortMode() {
    const sortTrigger = document.getElementById('sortTrigger');
    const sortConfirmBtn = document.getElementById('sortConfirmBtn');
    const sortCancelBtn = document.getElementById('sortCancelBtn');

    if (sortTrigger) {
        sortTrigger.addEventListener('click', enterSortMode);
    }
    if (sortConfirmBtn) {
        sortConfirmBtn.addEventListener('click', confirmSort);
    }
    if (sortCancelBtn) {
        sortCancelBtn.addEventListener('click', cancelSort);
    }
}

/**
 * 进入排序模式
 */
function enterSortMode() {
    if (state.shortcuts.length < 2) {
        showToast('至少需要两个快捷方式才能排序');
        return;
    }

    isSorting = true;
    shortcutsBeforeSort = JSON.parse(JSON.stringify(state.shortcuts));

    const container = document.getElementById('shortcutsContainer');
    const sortActions = document.getElementById('sortActions');
    const sortHint = document.getElementById('sortHint');

    if (container) container.classList.add('sorting');
    if (sortActions) sortActions.classList.remove('hidden');
    if (sortHint) sortHint.classList.remove('hidden');

    // 重新渲染为可拖拽状态
    renderShortcuts(true);
    showToast('进入排序模式，拖拽图标调整顺序');
}

/**
 * 确认排序
 */
function confirmSort() {
    isSorting = false;

    const container = document.getElementById('shortcutsContainer');
    const sortActions = document.getElementById('sortActions');
    const sortHint = document.getElementById('sortHint');

    if (container) container.classList.remove('sorting');
    if (sortActions) sortActions.classList.add('hidden');
    if (sortHint) sortHint.classList.add('hidden');

    // 保存排序后的数据
    storage.set('shortcuts', state.shortcuts);
    shortcutsBeforeSort = [];

    // 重新渲染为正常状态
    renderShortcuts(false);
    showToast('排序已保存');
}

/**
 * 取消排序
 */
function cancelSort() {
    isSorting = false;

    const container = document.getElementById('shortcutsContainer');
    const sortActions = document.getElementById('sortActions');
    const sortHint = document.getElementById('sortHint');

    if (container) container.classList.remove('sorting');
    if (sortActions) sortActions.classList.add('hidden');
    if (sortHint) sortHint.classList.add('hidden');

    // 恢复排序前的数据
    if (shortcutsBeforeSort.length > 0) {
        state.shortcuts = shortcutsBeforeSort;
        shortcutsBeforeSort = [];
    }

    // 重新渲染为正常状态
    renderShortcuts(false);
    showToast('已取消排序');
}

/**
 * 渲染快捷方式列表
 * @param {boolean} draggable - 是否启用拖拽
 */
export function renderShortcuts(draggable = false) {
    const grid = document.getElementById('shortcutsGrid');
    if (!grid) return;

    const showNames = state.settings.showShortcutNames;
    const isDragMode = draggable || isSorting;

    let html = state.shortcuts.map((s, index) => `
        <div class="shortcut-item ${isDragMode ? 'sortable' : ''}" 
             href="${isDragMode ? '#' : s.url}" 
             target="${isDragMode ? '' : '_blank'}"
             data-id="${s.id}" 
             data-index="${index}"
             ${isDragMode ? 'draggable="true"' : ''}>
            <div class="shortcut-icon" style="background: ${getHashColor(s.name)}">
                ${s.icon ? `<img src="${s.icon}" alt="" onerror="this.style.display='none'; this.parentNode.textContent='${s.name[0]}'">` : s.name[0]}
            </div>
            ${showNames ? `<span class="shortcut-name">${escapeHtml(s.name)}</span>` : ''}
        </div>
    `).join('');

    grid.innerHTML = html;

    // 更新网格列数
    const perRow = state.settings.shortcutsPerRow;
    grid.style.gridTemplateColumns = `repeat(${perRow}, 1fr)`;

    if (isDragMode) {
        initDragEvents(grid);
    } else {
        // 正常模式：绑定右键菜单
        grid.querySelectorAll('.shortcut-item').forEach(item => {
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const id = item.dataset.id;
                showShortcutContextMenu(e, id);
            });
        });
    }
}

/**
 * 初始化拖拽事件
 * @param {HTMLElement} grid - 快捷方式网格容器
 */
function initDragEvents(grid) {
    const items = grid.querySelectorAll('.shortcut-item');

    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('drop', handleDrop);

        // 触摸设备支持
        item.addEventListener('touchstart', handleTouchStart, { passive: false });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd);
    });
}

/**
 * 处理拖拽开始
 * @param {DragEvent} e
 */
function handleDragStart(e) {
    dragSrcEl = this;
    dragSrcIndex = parseInt(this.dataset.index);

    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);

    // 创建占位符
    createPlaceholder(this);
}

/**
 * 处理拖拽结束
 * @param {DragEvent} e
 */
function handleDragEnd(e) {
    this.classList.remove('dragging');
    removePlaceholder();

    const grid = document.getElementById('shortcutsGrid');
    if (grid) {
        grid.querySelectorAll('.shortcut-item').forEach(item => {
            item.classList.remove('drag-over');
        });
    }

    dragSrcEl = null;
    dragSrcIndex = -1;
}

/**
 * 处理拖拽经过
 * @param {DragEvent} e
 */
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

/**
 * 处理拖拽进入
 * @param {DragEvent} e
 */
function handleDragEnter(e) {
    if (this !== dragSrcEl) {
        this.classList.add('drag-over');
    }
}

/**
 * 处理拖拽离开
 * @param {DragEvent} e
 */
function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

/**
 * 处理放置
 * @param {DragEvent} e
 */
function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    if (dragSrcEl !== this) {
        const dragDestIndex = parseInt(this.dataset.index);
        reorderShortcuts(dragSrcIndex, dragDestIndex);
    }

    return false;
}

// ==================== 触摸拖拽支持 ====================
let touchDragItem = null;
let touchDragIndex = -1;
let touchClone = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

/**
 * 处理触摸开始
 * @param {TouchEvent} e
 */
function handleTouchStart(e) {
    if (!isSorting) return;
    e.preventDefault();

    const touch = e.touches[0];
    touchDragItem = this;
    touchDragIndex = parseInt(this.dataset.index);

    const rect = this.getBoundingClientRect();
    touchOffsetX = touch.clientX - rect.left;
    touchOffsetY = touch.clientY - rect.top;

    // 创建克隆元素
    touchClone = this.cloneNode(true);
    touchClone.style.position = 'fixed';
    touchClone.style.width = rect.width + 'px';
    touchClone.style.height = rect.height + 'px';
    touchClone.style.left = rect.left + 'px';
    touchClone.style.top = rect.top + 'px';
    touchClone.style.zIndex = '1000';
    touchClone.style.opacity = '0.9';
    touchClone.style.pointerEvents = 'none';
    touchClone.classList.add('dragging');
    document.body.appendChild(touchClone);

    this.classList.add('dragging');
    createPlaceholder(this);
}

/**
 * 处理触摸移动
 * @param {TouchEvent} e
 */
function handleTouchMove(e) {
    if (!touchClone || !isSorting) return;
    e.preventDefault();

    const touch = e.touches[0];
    touchClone.style.left = (touch.clientX - touchOffsetX) + 'px';
    touchClone.style.top = (touch.clientY - touchOffsetY) + 'px';

    // 查找下方的元素
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elementBelow) {
        const targetItem = elementBelow.closest('.shortcut-item');
        if (targetItem && targetItem !== touchDragItem) {
            const targetIndex = parseInt(targetItem.dataset.index);
            reorderShortcuts(touchDragIndex, targetIndex);
            touchDragIndex = targetIndex;
        }
    }
}

/**
 * 处理触摸结束
 * @param {TouchEvent} e
 */
function handleTouchEnd(e) {
    if (!isSorting) return;

    if (touchClone) {
        touchClone.remove();
        touchClone = null;
    }

    if (touchDragItem) {
        touchDragItem.classList.remove('dragging');
        touchDragItem = null;
    }

    removePlaceholder();
    touchDragIndex = -1;
}

// ==================== 辅助函数 ====================

/**
 * 创建占位符
 * @param {HTMLElement} item - 被拖拽的元素
 */
function createPlaceholder(item) {
    removePlaceholder();

    placeholderEl = document.createElement('div');
    placeholderEl.className = 'shortcut-item shortcut-placeholder';
    placeholderEl.style.width = item.offsetWidth + 'px';
    placeholderEl.style.height = item.offsetHeight + 'px';
}

/**
 * 移除占位符
 */
function removePlaceholder() {
    if (placeholderEl && placeholderEl.parentNode) {
        placeholderEl.parentNode.removeChild(placeholderEl);
    }
    placeholderEl = null;
}

/**
 * 重新排序快捷方式
 * @param {number} fromIndex - 源索引
 * @param {number} toIndex - 目标索引
 */
function reorderShortcuts(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= state.shortcuts.length) return;
    if (toIndex < 0 || toIndex >= state.shortcuts.length) return;

    const item = state.shortcuts.splice(fromIndex, 1)[0];
    state.shortcuts.splice(toIndex, 0, item);

    // 重新渲染
    renderShortcuts(true);
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
