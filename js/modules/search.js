/**
 * 时锦起始页 - 搜索模块
 * 处理搜索功能、搜索引擎切换和搜索建议
 */

import { state } from '../config.js';
import * as storage from '../utils/storage.js';
import { escapeHtml, isValidUrl } from '../utils/dom.js';

// 建议请求超时定时器
let suggestionTimeout = null;

/**
 * 初始化搜索模块
 */
export function init() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const searchBtn = document.getElementById('searchBtn');
    const engineSelector = document.getElementById('searchEngineSelector');
    
    if (!searchInput) return;
    
    // 更新当前搜索引擎图标
    updateCurrentEngineIcon();
    
    // 渲染搜索引擎下拉
    renderEngineDropdown();
    
    // 输入事件
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (clearBtn) {
            clearBtn.classList.toggle('visible', value.length > 0);
        }
        
        clearTimeout(suggestionTimeout);
        if (value && state.settings.enableSuggestions) {
            suggestionTimeout = setTimeout(() => fetchSuggestions(value), 300);
        } else {
            hideSuggestions();
        }
    });
    
    // 键盘事件
    searchInput.addEventListener('keydown', handleSearchKeydown);
    
    // 清空按钮
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.classList.remove('visible');
            hideSuggestions();
            searchInput.focus();
        });
    }
    
    // 搜索按钮
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            performSearch(searchInput.value.trim());
        });
    }
    
    // 搜索引擎选择器
    if (engineSelector) {
        engineSelector.addEventListener('click', (e) => {
            e.stopPropagation();
            engineSelector.classList.toggle('active');
            const dropdown = document.getElementById('searchEngineDropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        });
    }
    
    // 点击外部关闭下拉
    document.addEventListener('click', () => {
        if (engineSelector) engineSelector.classList.remove('active');
        const dropdown = document.getElementById('searchEngineDropdown');
        if (dropdown) dropdown.classList.remove('active');
        hideSuggestions();
    });
    
    // 阻止搜索框内点击冒泡
    const searchContainer = document.getElementById('searchContainer');
    if (searchContainer) {
        searchContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

/**
 * 处理搜索框键盘事件
 * @param {KeyboardEvent} e - 键盘事件
 */
function handleSearchKeydown(e) {
    const suggestionsEl = document.getElementById('searchSuggestions');
    if (!suggestionsEl) return;
    
    const suggestions = suggestionsEl.querySelectorAll('.suggestion-item');
    const searchInput = document.getElementById('searchInput');
    
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            state.suggestionIndex = Math.min(state.suggestionIndex + 1, suggestions.length - 1);
            updateSuggestionSelection(suggestions);
            break;
        case 'ArrowUp':
            e.preventDefault();
            state.suggestionIndex = Math.max(state.suggestionIndex - 1, -1);
            updateSuggestionSelection(suggestions);
            break;
        case 'Enter':
            e.preventDefault();
            if (state.suggestionIndex >= 0 && suggestions[state.suggestionIndex]) {
                const text = suggestions[state.suggestionIndex].querySelector('.suggestion-text').textContent;
                searchInput.value = text;
                hideSuggestions();
            }
            performSearch(searchInput.value.trim());
            break;
        case 'Escape':
            hideSuggestions();
            searchInput.blur();
            break;
    }
}

/**
 * 更新当前搜索引擎图标
 */
function updateCurrentEngineIcon() {
    const icon = document.getElementById('currentEngineIcon');
    if (icon && state.currentEngine) {
        icon.src = state.currentEngine.icon;
        icon.alt = state.currentEngine.name;
    }
}

/**
 * 渲染搜索引擎下拉菜单
 */
function renderEngineDropdown() {
    const dropdown = document.getElementById('searchEngineDropdown');
    if (!dropdown) return;
    
    dropdown.innerHTML = state.searchEngines.map(engine => `
        <div class="search-engine-item ${engine.id === state.currentEngine.id ? 'active' : ''}" data-engine-id="${engine.id}">
            <img src="${engine.icon}" alt="${engine.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2214%22>${engine.name[0]}</text></svg>'">
            <span>${engine.name}</span>
        </div>
    `).join('');
    
    dropdown.querySelectorAll('.search-engine-item').forEach(item => {
        item.addEventListener('click', () => {
            const engineId = item.dataset.engineId;
            state.currentEngine = state.searchEngines.find(e => e.id === engineId);
            state.settings.currentEngineId = engineId;
            storage.set('settings', state.settings);
            updateCurrentEngineIcon();
            renderEngineDropdown();
        });
    });
}

/**
 * 获取搜索建议
 * @param {string} query - 搜索关键词
 */
async function fetchSuggestions(query) {
    if (!query) return;
    
    try {
        // 使用百度的联想API
        const script = document.createElement('script');
        const callbackName = 'suggestionCallback_' + Date.now();
        
        window[callbackName] = (data) => {
            renderSuggestions(data.s || []);
            delete window[callbackName];
            if (script.parentNode) {
                document.head.removeChild(script);
            }
        };
        
        script.src = `https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&cb=${callbackName}`;
        document.head.appendChild(script);
        
        // 超时清理
        setTimeout(() => {
            if (window[callbackName]) {
                delete window[callbackName];
                if (script.parentNode) {
                    document.head.removeChild(script);
                }
            }
        }, 5000);
    } catch (e) {
        console.warn('Suggestions fetch error:', e);
    }
}

/**
 * 渲染搜索建议
 * @param {string[]} suggestions - 建议列表
 */
function renderSuggestions(suggestions) {
    const el = document.getElementById('searchSuggestions');
    if (!el) return;
    
    const count = state.settings.suggestionCount;
    const limited = suggestions.slice(0, count);
    
    if (limited.length === 0) {
        hideSuggestions();
        return;
    }
    
    el.innerHTML = limited.map((s, i) => `
        <div class="suggestion-item" data-index="${i}">
            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <span class="suggestion-text">${escapeHtml(s)}</span>
        </div>
    `).join('');
    
    el.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const text = item.querySelector('.suggestion-text').textContent;
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = text;
            }
            hideSuggestions();
            performSearch(text);
        });
    });
    
    el.classList.add('active');
    state.suggestionIndex = -1;
}

/**
 * 更新建议选中状态
 * @param {NodeList} suggestions - 建议元素列表
 */
function updateSuggestionSelection(suggestions) {
    suggestions.forEach((item, i) => {
        item.classList.toggle('selected', i === state.suggestionIndex);
    });
}

/**
 * 隐藏搜索建议
 */
function hideSuggestions() {
    const el = document.getElementById('searchSuggestions');
    if (el) {
        el.classList.remove('active');
    }
    state.suggestionIndex = -1;
}

/**
 * 执行搜索
 * @param {string} query - 搜索关键词
 */
export function performSearch(query) {
    if (!query) return;
    
    // 检查快捷指令
    const parts = query.split(' ');
    if (parts.length >= 2) {
        const shortcut = parts[0];
        const keyword = parts.slice(1).join(' ');
        const engine = state.searchEngines.find(e => e.shortcut === shortcut);
        
        if (engine) {
            window.open(engine.url.replace('{q}', encodeURIComponent(keyword)), '_blank');
            const searchInput = document.getElementById('searchInput');
            const clearBtn = document.getElementById('clearBtn');
            if (searchInput) searchInput.value = '';
            if (clearBtn) clearBtn.classList.remove('visible');
            return;
        }
    }
    
    // 检查是否为URL
    if (isValidUrl(query)) {
        let url = query;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        window.open(url, '_blank');
    } else {
        // 使用当前搜索引擎
        const searchUrl = state.currentEngine.url.replace('{q}', encodeURIComponent(query));
        window.open(searchUrl, '_blank');
    }
    
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.classList.remove('visible');
}
