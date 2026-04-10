/**
 * 时锦起始页 - DOM 工具函数模块
 * 提供常用的 DOM 操作辅助函数
 */

/**
 * 获取单个元素
 * @param {string} selector - CSS 选择器
 * @param {HTMLElement} parent - 父元素（可选，默认为 document）
 * @returns {HTMLElement|null}
 */
export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * 获取多个元素
 * @param {string} selector - CSS 选择器
 * @param {HTMLElement} parent - 父元素（可选，默认为 document）
 * @returns {NodeList}
 */
export function $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * 转义 HTML 特殊字符
 * @param {string} text - 要转义的文本
 * @returns {string} 转义后的文本
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 检查字符串是否为有效 URL
 * @param {string} string - 要检查的字符串
 * @returns {boolean}
 */
export function isValidUrl(string) {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/;
    return urlPattern.test(string) || ipPattern.test(string);
}

/**
 * 生成基于字符串的哈希颜色
 * @param {string} name - 输入字符串
 * @returns {string} 颜色值
 */
export function getHashColor(name) {
    const colors = [
        '#42b883', '#3498db', '#e74c3c', '#f39c12', '#9b59b6',
        '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

/**
 * 显示提示消息
 * @param {string} message - 消息内容
 * @param {number} duration - 显示时长（毫秒）
 */
export function showToast(message, duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, duration);
}

/**
 * 显示确认弹窗
 * @param {string} title - 标题
 * @param {string} text - 内容文本
 * @param {Function} onConfirm - 确认回调
 */
export function showConfirm(title, text, onConfirm) {
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmText = document.getElementById('confirmText');
    const confirmModal = document.getElementById('confirmModal');
    const confirmBtn = document.getElementById('confirmActionBtn');
    
    if (!confirmModal) return;
    
    confirmTitle.textContent = title;
    confirmText.textContent = text;
    confirmModal.classList.add('active');
    
    confirmBtn.onclick = () => {
        confirmModal.classList.remove('active');
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    };
}

/**
 * 切换元素的显示状态
 * @param {HTMLElement} element - 目标元素
 * @param {boolean} show - 是否显示
 */
export function toggleVisibility(element, show) {
    if (element) {
        element.classList.toggle('hidden', !show);
    }
}

/**
 * 切换元素的激活状态
 * @param {HTMLElement} element - 目标元素
 * @param {boolean} active - 是否激活
 */
export function toggleActive(element, active) {
    if (element) {
        element.classList.toggle('active', active);
    }
}
