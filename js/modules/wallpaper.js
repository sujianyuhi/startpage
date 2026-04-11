/**
 * 时锦起始页 - 壁纸管理模块
 * 处理壁纸加载、缓存和自动切换
 */

import { state } from '../config.js';
import * as storage from '../utils/storage.js';

// 自动切换定时器
let autoChangeTimer = null;

/**
 * 初始化壁纸
 */
export function init() {
    updateWallpaper();
    
    // 自动切换壁纸
    const autoChange = state.settings.wallpaperAutoChange;
    if (autoChange !== 'never') {
        const intervals = {
            'startup': null,
            '10min': 10 * 60 * 1000,
            '30min': 30 * 60 * 1000,
            '1hour': 60 * 60 * 1000,
            'daily': 24 * 60 * 60 * 1000
        };
        
        if (intervals[autoChange]) {
            autoChangeTimer = setInterval(updateWallpaper, intervals[autoChange]);
        }
    }
}

/**
 * 更新壁纸
 */
export async function updateWallpaper() {
    const source = state.settings.wallpaperSource;
    const wallpaperEl = document.getElementById('wallpaper');
    const overlayEl = document.getElementById('wallpaperOverlay');
    
    if (!wallpaperEl || !overlayEl) return;
    
    // 更新遮罩层
    const blur = state.settings.wallpaperBlur;
    const overlay = state.settings.wallpaperOverlay;
    overlayEl.style.backdropFilter = `blur(${blur}px)`;
    overlayEl.style.webkitBackdropFilter = `blur(${blur}px)`;
    overlayEl.style.background = `rgba(0, 0, 0, ${overlay / 100})`;
    
    try {
        let url = '';
        
        switch (source) {
            case 'gradient':
                wallpaperEl.style.display = 'none';
                document.body.style.background = state.settings.backgroundGradient || 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
                return;
            case 'bing':
                url = await getBingWallpaper();
                break;
            case 'unsplash':
                url = getUnsplashWallpaper();
                break;
            case 'local':
                url = storage.get('localWallpaper', '');
                break;
            case 'color':
                wallpaperEl.style.display = 'none';
                document.body.style.background = state.settings.backgroundColor;
                return;
        }
        
        if (url) {
            wallpaperEl.style.display = 'block';
            document.body.style.background = '';
            wallpaperEl.src = url;
            cacheWallpaper(url);
        }
    } catch (e) {
        console.warn('Wallpaper update error:', e);
        // 使用缓存的壁纸
        const cached = getCachedWallpaper();
        if (cached) {
            wallpaperEl.src = cached;
        }
    }
}

/**
 * 获取必应每日壁纸
 * @returns {Promise<string>} 壁纸 URL
 */
async function getBingWallpaper() {
    try {
        const response = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN');
        const data = await response.json();
        if (data.images && data.images[0]) {
            return `https://www.bing.com${data.images[0].url}`;
        }
    } catch (e) {
        console.warn('Bing wallpaper error:', e);
    }
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80';
}

/**
 * 获取 Unsplash 随机壁纸
 * @returns {string} 壁纸 URL
 */
function getUnsplashWallpaper() {
    const keyword = state.settings.unsplashKeyword || 'nature';
    return `https://source.unsplash.com/1920x1080/?${encodeURIComponent(keyword)}&random=${Date.now()}`;
}

/**
 * 缓存壁纸 URL
 * @param {string} url - 壁纸 URL
 */
function cacheWallpaper(url) {
    let cache = storage.get('wallpaperCache', []);
    cache = cache.filter(u => u !== url);
    cache.unshift(url);
    cache = cache.slice(0, 3);
    storage.set('wallpaperCache', cache);
}

/**
 * 获取缓存的壁纸
 * @returns {string} 缓存的壁纸 URL
 */
function getCachedWallpaper() {
    const cache = storage.get('wallpaperCache', []);
    return cache[0] || '';
}

/**
 * 清理自动切换定时器
 */
export function cleanup() {
    if (autoChangeTimer) {
        clearInterval(autoChangeTimer);
        autoChangeTimer = null;
    }
}
