/**
 * 时锦起始页 - 更新公告通知模块
 * 控制更新公告弹窗的显示与缓存
 */

import * as storage from '../utils/storage.js';

// ==================== 公告配置（每次更新时修改此处）====================
const NOTIFICATION_KEY = 'notification_seen_20250616';

const NOTIFICATION_DATA = {
    title: '更新公告',
    version: '2025.06.16',
    intro: '时锦起始页又更新啦，本次带来以下优化：',
    items: [
        { highlight: '图标清晰度优化', text: '：提升了 Favicon 请求分辨率，图标显示更清晰锐利。' },
        { highlight: '图标展示优化', text: '：图标背景改为透明，圆角更大更现代，整体更美观。' },
        { highlight: '新增更新公告', text: '：以后有重要更新会通过弹窗第一时间通知你。' },
        { highlight: '更新预告', text: '：用户注册登录功能即将上线，敬请期待。' }
    ]
};

// ==================== 初始化 ====================

export function init() {
    if (hasSeenNotification()) {
        return;
    }

    renderNotification();
    showNotification();
}

function hasSeenNotification() {
    return storage.get(NOTIFICATION_KEY, false) === true;
}

function markAsSeen() {
    storage.set(NOTIFICATION_KEY, true);
}

// ==================== 渲染与交互 ====================

function renderNotification() {
    const overlay = document.getElementById('notificationOverlay');
    if (!overlay) return;

    const data = NOTIFICATION_DATA;

    overlay.innerHTML = `
        <div class="notification-modal">
            <div class="notification-header">
                <div class="notification-title-wrap">
                    <svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                        <path d="M4 2C2.8 3.7 2 5.7 2 8"/>
                        <path d="M22 8c0-2.3-.8-4.3-2-6"/>
                    </svg>
                    <span class="notification-title" id="notificationTitle">${escapeHtml(data.title)}</span>
                    <span class="notification-version">${escapeHtml(data.version)}</span>
                </div>
                <button class="notification-close" aria-label="关闭通知">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="notification-body">
                <p class="notification-intro">${escapeHtml(data.intro)}</p>
                <ul class="notification-list">
                    ${data.items.map(item => `
                        <li><strong>${escapeHtml(item.highlight)}</strong>${escapeHtml(item.text)}</li>
                    `).join('')}
                </ul>
            </div>
            <div class="notification-footer">
                <button class="notification-confirm">我知道了</button>
            </div>
        </div>
    `;
}

function showNotification() {
    const overlay = document.getElementById('notificationOverlay');
    if (!overlay) return;

    overlay.classList.add('active');
    bindEvents(overlay);
}

function hideNotification() {
    const overlay = document.getElementById('notificationOverlay');
    if (!overlay) return;

    overlay.classList.remove('active');
    markAsSeen();
}

function bindEvents(overlay) {
    const closeBtn = overlay.querySelector('.notification-close');
    const confirmBtn = overlay.querySelector('.notification-confirm');

    if (closeBtn) {
        closeBtn.addEventListener('click', hideNotification, { once: true });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', hideNotification, { once: true });
    }

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            hideNotification();
        }
    }, { once: true });

    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            hideNotification();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
