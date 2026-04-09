    
        // ==================== 配置与状态管理 ====================
        const CONFIG = {
            version: '1.0.0',
            defaultEngines: [
                { id: 'bing', name: '必应', url: 'https://www.bing.com/search?q={q}', icon: 'https://www.bing.com/favicon.ico', shortcut: 'b' },
                { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd={q}', icon: 'https://www.baidu.com/favicon.ico', shortcut: 'bd' },
                { id: 'google', name: '谷歌', url: 'https://www.google.com/search?q={q}', icon: 'https://www.google.com/favicon.ico', shortcut: 'g' },
                { id: 'sogou', name: '搜狗', url: 'https://www.sogou.com/web?query={q}', icon: 'https://www.sogou.com/favicon.ico', shortcut: 'sg' },
                { id: 'zhihu', name: '知乎', url: 'https://www.zhihu.com/search?q={q}', icon: 'https://www.zhihu.com/favicon.ico', shortcut: 'zh' },
                { id: 'bilibili', name: 'B站', url: 'https://search.bilibili.com/all?keyword={q}', icon: 'https://www.bilibili.com/favicon.ico', shortcut: 'bil' },
                { id: 'github', name: 'GitHub', url: 'https://github.com/search?q={q}', icon: 'https://github.com/favicon.ico', shortcut: 'gh' },
                { id: 'juejin', name: '掘金', url: 'https://juejin.cn/search?query={q}', icon: 'https://juejin.cn/favicon.ico', shortcut: 'jj' }
            ],
            defaultShortcuts: [
                { id: '1', name: '百度', url: 'https://www.baidu.com', icon: '' },
                { id: '2', name: 'B站', url: 'https://www.bilibili.com', icon: '' },
                { id: '3', name: '知乎', url: 'https://www.zhihu.com', icon: '' },
                { id: '4', name: 'GitHub', url: 'https://github.com', icon: '' }
            ],
            weatherIcons: {
                '晴': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
                '多云': '<svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor"/></svg>',
                '阴': '<svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor" opacity="0.7"/></svg>',
                '雨': '<svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor"/><path d="M8 21v-2M12 21v-2M16 21v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
                '雪': '<svg viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="currentColor"/><circle cx="8" cy="22" r="1" fill="currentColor"/><circle cx="12" cy="22" r="1" fill="currentColor"/><circle cx="16" cy="22" r="1" fill="currentColor"/></svg>'
            }
        };

        // 状态管理
        const state = {
            settings: {},
            shortcuts: [],
            todos: [],
            searchEngines: [],
            currentEngine: null,
            isSettingsOpen: false,
            isImmersive: false,
            isTodoOpen: false,
            suggestionIndex: -1,
            wallpaperCache: []
        };

        // 默认设置
        const defaultSettings = {
            darkMode: false,
            followSystemTheme: true,
            showSeconds: false,
            showLunar: false,
            showWeather: true,
            showTodo: true,
            enableAnimations: true,
            enableSuggestions: true,
            suggestionCount: 8,
            searchPosition: 'center',
            shortcutsPerRow: 8,
            showShortcutNames: true,
            wallpaperSource: 'bing',
            unsplashKeyword: 'nature',
            wallpaperBlur: 0,
            wallpaperOverlay: 0,
            wallpaperAutoChange: 'never',
            backgroundColor: '#121212',
            currentEngineId: 'bing'
        };

        // ==================== 本地存储管理 ====================
        const Storage = {
            get(key, defaultValue = null) {
                try {
                    const item = localStorage.getItem(`qingning_${key}`);
                    return item ? JSON.parse(item) : defaultValue;
                } catch (e) {
                    console.warn('Storage get error:', e);
                    return defaultValue;
                }
            },
            set(key, value) {
                try {
                    localStorage.setItem(`qingning_${key}`, JSON.stringify(value));
                } catch (e) {
                    console.warn('Storage set error:', e);
                }
            },
            remove(key) {
                try {
                    localStorage.removeItem(`qingning_${key}`);
                } catch (e) {
                    console.warn('Storage remove error:', e);
                }
            },
            clear() {
                try {
                    const keys = Object.keys(localStorage);
                    keys.forEach(key => {
                        if (key.startsWith('qingning_')) {
                            localStorage.removeItem(key);
                        }
                    });
                } catch (e) {
                    console.warn('Storage clear error:', e);
                }
            }
        };

        // ==================== 初始化 ====================
        function init() {
            loadSettings();
            loadShortcuts();
            loadTodos();
            loadSearchEngines();
            initTheme();
            initWallpaper();
            initTime();
            initWeather();
            initSearch();
            initShortcuts();
            initTodo();
            initSettings();
            initKeyboard();
            initContextMenu();
            initImmersiveMode();
            
            // 聚焦搜索框
            setTimeout(() => {
                document.getElementById('searchInput').focus();
            }, 100);
        }

        function loadSettings() {
            state.settings = { ...defaultSettings, ...Storage.get('settings', {}) };
        }

        function loadShortcuts() {
            state.shortcuts = Storage.get('shortcuts', CONFIG.defaultShortcuts);
        }

        function loadTodos() {
            state.todos = Storage.get('todos', []);
        }

        function loadSearchEngines() {
            state.searchEngines = Storage.get('searchEngines', CONFIG.defaultEngines);
            state.currentEngine = state.searchEngines.find(e => e.id === state.settings.currentEngineId) || state.searchEngines[0];
        }

        function saveSettings() {
            Storage.set('settings', state.settings);
        }

        function saveShortcuts() {
            Storage.set('shortcuts', state.shortcuts);
        }

        function saveTodos() {
            Storage.set('todos', state.todos);
        }

        // ==================== 主题管理 ====================
        function initTheme() {
            updateTheme();
            
            // 监听系统主题变化
            if (window.matchMedia) {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    if (state.settings.followSystemTheme) {
                        state.settings.darkMode = e.matches;
                        saveSettings();
                        updateTheme();
                    }
                });
            }
        }

        function updateTheme() {
            const isDark = state.settings.darkMode;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            document.getElementById('darkModeToggle').checked = isDark;
            document.getElementById('followSystemTheme').checked = state.settings.followSystemTheme;
        }

        function toggleDarkMode() {
            state.settings.darkMode = !state.settings.darkMode;
            state.settings.followSystemTheme = false;
            saveSettings();
            updateTheme();
            document.getElementById('followSystemTheme').checked = false;
        }

        // ==================== 壁纸管理 ====================
        function initWallpaper() {
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
                    setInterval(updateWallpaper, intervals[autoChange]);
                }
            }
        }

        async function updateWallpaper() {
            const source = state.settings.wallpaperSource;
            const wallpaperEl = document.getElementById('wallpaper');
            const overlayEl = document.getElementById('wallpaperOverlay');
            
            // 更新遮罩层
            const blur = state.settings.wallpaperBlur;
            const overlay = state.settings.wallpaperOverlay;
            overlayEl.style.backdropFilter = `blur(${blur}px)`;
            overlayEl.style.webkitBackdropFilter = `blur(${blur}px)`;
            overlayEl.style.background = `rgba(0, 0, 0, ${overlay / 100})`;
            
            try {
                let url = '';
                
                switch (source) {
                    case 'bing':
                        url = await getBingWallpaper();
                        break;
                    case 'unsplash':
                        url = getUnsplashWallpaper();
                        break;
                    case 'local':
                        url = Storage.get('localWallpaper', '');
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

        function getUnsplashWallpaper() {
            const keyword = state.settings.unsplashKeyword || 'nature';
            return `https://source.unsplash.com/1920x1080/?${encodeURIComponent(keyword)}&random=${Date.now()}`;
        }

        function cacheWallpaper(url) {
            let cache = Storage.get('wallpaperCache', []);
            cache = cache.filter(u => u !== url);
            cache.unshift(url);
            cache = cache.slice(0, 3);
            Storage.set('wallpaperCache', cache);
        }

        function getCachedWallpaper() {
            const cache = Storage.get('wallpaperCache', []);
            return cache[0] || '';
        }

        // ==================== 时间管理 ====================
        function initTime() {
            updateTime();
            setInterval(updateTime, 1000);
            
            // 点击切换12/24小时制
            document.getElementById('timeDisplay').addEventListener('click', () => {
                state.settings.showSeconds = !state.settings.showSeconds;
                saveSettings();
                updateTime();
                document.getElementById('showSeconds').checked = state.settings.showSeconds;
            });
        }

        function updateTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            let timeStr = `${hours}:${minutes}`;
            if (state.settings.showSeconds) {
                timeStr += `<span class="seconds">:${seconds}</span>`;
            }
            document.getElementById('timeDisplay').innerHTML = timeStr;
            
            // 日期
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const date = now.getDate();
            const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const weekDay = weekDays[now.getDay()];
            
            let dateStr = `${year}年${month}月${date}日 ${weekDay}`;
            document.getElementById('dateDisplay').textContent = dateStr;
        }

        // ==================== 天气管理 ====================
        async function initWeather() {
            if (!state.settings.showWeather) {
                document.getElementById('weatherModule').classList.add('hidden');
                return;
            }
            
            await updateWeather();
            // 每30分钟更新一次
            setInterval(updateWeather, 30 * 60 * 1000);
        }

        async function updateWeather() {
            try {
                // 使用IP定位获取城市
                const locationRes = await fetch('https://ipapi.co/json/');
                const locationData = await locationRes.json();
                const city = locationData.city || '北京';
                
                // 使用Open-Meteo免费天气API
                const lat = locationData.latitude || 39.9042;
                const lon = locationData.longitude || 116.4074;
                
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
                const weatherData = await weatherRes.json();
                
                if (weatherData.current_weather) {
                    const temp = Math.round(weatherData.current_weather.temperature);
                    const weatherCode = weatherData.current_weather.weathercode;
                    const condition = getWeatherCondition(weatherCode);
                    
                    document.getElementById('weatherTemp').textContent = `${temp}°C`;
                    document.getElementById('weatherCity').textContent = city;
                    document.getElementById('weatherIcon').innerHTML = CONFIG.weatherIcons[condition] || CONFIG.weatherIcons['晴'];
                }
            } catch (e) {
                console.warn('Weather update error:', e);
                document.getElementById('weatherModule').classList.add('hidden');
            }
        }

        function getWeatherCondition(code) {
            // WMO Weather interpretation codes
            if (code === 0) return '晴';
            if (code >= 1 && code <= 3) return '多云';
            if (code >= 45 && code <= 48) return '阴';
            if (code >= 51 && code <= 67) return '雨';
            if (code >= 71 && code <= 77) return '雪';
            if (code >= 80 && code <= 82) return '雨';
            if (code >= 85 && code <= 86) return '雪';
            if (code >= 95) return '雨';
            return '晴';
        }

        // ==================== 搜索管理 ====================
        function initSearch() {
            const searchInput = document.getElementById('searchInput');
            const clearBtn = document.getElementById('clearBtn');
            const searchBtn = document.getElementById('searchBtn');
            const engineSelector = document.getElementById('searchEngineSelector');
            const engineDropdown = document.getElementById('searchEngineDropdown');
            const suggestionsEl = document.getElementById('searchSuggestions');
            
            // 更新当前搜索引擎图标
            updateCurrentEngineIcon();
            
            // 渲染搜索引擎下拉
            renderEngineDropdown();
            
            // 输入事件
            let suggestionTimeout;
            searchInput.addEventListener('input', (e) => {
                const value = e.target.value.trim();
                clearBtn.classList.toggle('visible', value.length > 0);
                
                clearTimeout(suggestionTimeout);
                if (value && state.settings.enableSuggestions) {
                    suggestionTimeout = setTimeout(() => fetchSuggestions(value), 300);
                } else {
                    hideSuggestions();
                }
            });
            
            // 键盘事件
            searchInput.addEventListener('keydown', (e) => {
                const suggestions = suggestionsEl.querySelectorAll('.suggestion-item');
                
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
            });
            
            // 清空按钮
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                clearBtn.classList.remove('visible');
                hideSuggestions();
                searchInput.focus();
            });
            
            // 搜索按钮
            searchBtn.addEventListener('click', () => {
                performSearch(searchInput.value.trim());
            });
            
            // 搜索引擎选择器
            engineSelector.addEventListener('click', (e) => {
                e.stopPropagation();
                engineSelector.classList.toggle('active');
                engineDropdown.classList.toggle('active');
            });
            
            // 点击外部关闭下拉
            document.addEventListener('click', () => {
                engineSelector.classList.remove('active');
                engineDropdown.classList.remove('active');
                hideSuggestions();
            });
            
            // 阻止搜索框内点击冒泡
            document.getElementById('searchContainer').addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        function updateCurrentEngineIcon() {
            const icon = document.getElementById('currentEngineIcon');
            if (state.currentEngine) {
                icon.src = state.currentEngine.icon;
                icon.alt = state.currentEngine.name;
            }
        }

        function renderEngineDropdown() {
            const dropdown = document.getElementById('searchEngineDropdown');
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
                    saveSettings();
                    updateCurrentEngineIcon();
                    renderEngineDropdown();
                });
            });
        }

        async function fetchSuggestions(query) {
            if (!query) return;
            
            try {
                // 使用百度的联想API
                const script = document.createElement('script');
                const callbackName = 'suggestionCallback_' + Date.now();
                
                window[callbackName] = (data) => {
                    renderSuggestions(data.s || []);
                    delete window[callbackName];
                    document.head.removeChild(script);
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

        function renderSuggestions(suggestions) {
            const el = document.getElementById('searchSuggestions');
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
                    document.getElementById('searchInput').value = text;
                    hideSuggestions();
                    performSearch(text);
                });
            });
            
            el.classList.add('active');
            state.suggestionIndex = -1;
        }

        function updateSuggestionSelection(suggestions) {
            suggestions.forEach((item, i) => {
                item.classList.toggle('selected', i === state.suggestionIndex);
            });
        }

        function hideSuggestions() {
            document.getElementById('searchSuggestions').classList.remove('active');
            state.suggestionIndex = -1;
        }

        function performSearch(query) {
            if (!query) return;
            
            // 检查快捷指令
            const parts = query.split(' ');
            if (parts.length >= 2) {
                const shortcut = parts[0];
                const keyword = parts.slice(1).join(' ');
                const engine = state.searchEngines.find(e => e.shortcut === shortcut);
                
                if (engine) {
                    window.open(engine.url.replace('{q}', encodeURIComponent(keyword)), '_blank');
                    document.getElementById('searchInput').value = '';
                    document.getElementById('clearBtn').classList.remove('visible');
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
            
            document.getElementById('searchInput').value = '';
            document.getElementById('clearBtn').classList.remove('visible');
        }

        function isValidUrl(string) {
            const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            const ipPattern = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/;
            return urlPattern.test(string) || ipPattern.test(string);
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // ==================== 快捷方式管理 ====================
        function initShortcuts() {
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

        function renderShortcuts() {
            const grid = document.getElementById('shortcutsGrid');
            const showNames = state.settings.showShortcutNames;
            
            let html = state.shortcuts.map(s => `
                <a class="shortcut-item" href="${s.url}" target="_blank" data-id="${s.id}">
                    <div class="shortcut-icon" style="background: ${getIconColor(s.name)}">
                        ${s.icon ? `<img src="${s.icon}" alt="" onerror="this.style.display='none'; this.parentNode.textContent='${s.name[0]}'">` : s.name[0]}
                    </div>
                    ${showNames ? `<span class="shortcut-name">${s.name}</span>` : ''}
                </a>
            `).join('');
            
            // 添加快捷方式按钮
            html += `
                <div class="shortcut-item add-shortcut" id="addShortcutBtn">
                    <div class="shortcut-icon">+</div>
                    ${showNames ? `<span class="shortcut-name">添加</span>` : ''}
                </div>
            `;
            
            grid.innerHTML = html;
            
            // 更新网格列数
            const perRow = state.settings.shortcutsPerRow;
            grid.style.gridTemplateColumns = `repeat(${perRow}, 1fr)`;
            
            // 添加快捷方式事件
            document.getElementById('addShortcutBtn').addEventListener('click', () => {
                openShortcutModal();
            });
            
            // 右键菜单
            grid.querySelectorAll('.shortcut-item:not(.add-shortcut)').forEach(item => {
                item.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    const id = item.dataset.id;
                    showShortcutContextMenu(e, id);
                });
            });
        }

        function getIconColor(name) {
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

        function addShortcut(name, url) {
            const id = Date.now().toString();
            state.shortcuts.push({ id, name, url, icon: '' });
            saveShortcuts();
            renderShortcuts();
            showToast('快捷方式已添加');
        }

        function deleteShortcut(id) {
            state.shortcuts = state.shortcuts.filter(s => s.id !== id);
            saveShortcuts();
            renderShortcuts();
            showToast('快捷方式已删除');
        }

        function openShortcutModal() {
            document.getElementById('shortcutModal').classList.add('active');
            document.getElementById('shortcutNameInput').focus();
        }

        function closeShortcutModal() {
            document.getElementById('shortcutModal').classList.remove('active');
            document.getElementById('shortcutNameInput').value = '';
            document.getElementById('shortcutUrlInput').value = '';
        }

        function showShortcutContextMenu(e, id) {
            // 简化处理，直接删除
            if (confirm('确定要删除这个快捷方式吗？')) {
                deleteShortcut(id);
            }
        }

        // ==================== 待办事项管理 ====================
        function initTodo() {
            if (!state.settings.showTodo) {
                document.getElementById('todoModule').classList.add('hidden');
                return;
            }
            
            const toggle = document.getElementById('todoToggle');
            const panel = document.getElementById('todoPanel');
            const input = document.getElementById('todoInput');
            const clearBtn = document.getElementById('clearCompletedBtn');
            
            // 切换面板
            toggle.addEventListener('click', () => {
                state.isTodoOpen = !state.isTodoOpen;
                panel.classList.toggle('active', state.isTodoOpen);
            });
            
            // 添加待办
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const text = input.value.trim();
                    if (text) {
                        addTodo(text);
                        input.value = '';
                    }
                }
            });
            
            // 清空已完成
            clearBtn.addEventListener('click', () => {
                state.todos = state.todos.filter(t => !t.completed);
                saveTodos();
                renderTodos();
                showToast('已清空已完成事项');
            });
            
            // 点击外部关闭
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.todo-module')) {
                    state.isTodoOpen = false;
                    panel.classList.remove('active');
                }
            });
            
            renderTodos();
        }

        function renderTodos() {
            const list = document.getElementById('todoList');
            const badge = document.getElementById('todoBadge');
            
            const uncompleted = state.todos.filter(t => !t.completed).length;
            badge.textContent = uncompleted;
            badge.classList.toggle('hidden', uncompleted === 0);
            
            if (state.todos.length === 0) {
                list.innerHTML = '<div class="todo-empty">暂无待办事项</div>';
                return;
            }
            
            // 排序：未完成在前，按时间倒序
            const sorted = [...state.todos].sort((a, b) => {
                if (a.completed !== b.completed) return a.completed ? 1 : -1;
                return b.id - a.id;
            });
            
            list.innerHTML = sorted.map(todo => `
                <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                    <div class="todo-checkbox">
                        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </div>
                    <span class="todo-text">${escapeHtml(todo.text)}</span>
                    <button class="todo-delete">
                        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </button>
                </div>
            `).join('');
            
            // 事件绑定
            list.querySelectorAll('.todo-item').forEach(item => {
                const id = item.dataset.id;
                const todo = state.todos.find(t => t.id === id);
                
                item.querySelector('.todo-checkbox').addEventListener('click', () => {
                    todo.completed = !todo.completed;
                    saveTodos();
                    renderTodos();
                });
                
                item.querySelector('.todo-delete').addEventListener('click', (e) => {
                    e.stopPropagation();
                    state.todos = state.todos.filter(t => t.id !== id);
                    saveTodos();
                    renderTodos();
                });
            });
        }

        function addTodo(text) {
            state.todos.push({
                id: Date.now().toString(),
                text,
                completed: false,
                createdAt: Date.now()
            });
            saveTodos();
            renderTodos();
        }

        // ==================== 设置管理 ====================
        function initSettings() {
            const trigger = document.getElementById('settingsTrigger');
            const overlay = document.getElementById('settingsOverlay');
            const panel = document.getElementById('settingsPanel');
            const closeBtn = document.getElementById('settingsClose');
            const tabs = document.querySelectorAll('.settings-tab');
            
            // 打开设置
            trigger.addEventListener('click', openSettings);
            
            // 关闭设置
            overlay.addEventListener('click', closeSettings);
            closeBtn.addEventListener('click', closeSettings);
            
            // Tab切换
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    const tabName = tab.dataset.tab;
                    document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
                    document.getElementById(`tab-${tabName}`).classList.add('active');
                });
            });
            
            // 初始化设置项
            initSettingControls();
        }

        function openSettings() {
            state.isSettingsOpen = true;
            document.getElementById('settingsOverlay').classList.add('active');
            document.getElementById('settingsPanel').classList.add('active');
        }

        function closeSettings() {
            state.isSettingsOpen = false;
            document.getElementById('settingsOverlay').classList.remove('active');
            document.getElementById('settingsPanel').classList.remove('active');
        }

        function initSettingControls() {
            // 深色模式
            document.getElementById('darkModeToggle').addEventListener('change', (e) => {
                state.settings.darkMode = e.target.checked;
                state.settings.followSystemTheme = false;
                saveSettings();
                updateTheme();
                document.getElementById('followSystemTheme').checked = false;
            });
            
            // 跟随系统主题
            document.getElementById('followSystemTheme').addEventListener('change', (e) => {
                state.settings.followSystemTheme = e.target.checked;
                if (e.target.checked) {
                    state.settings.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                }
                saveSettings();
                updateTheme();
            });
            
            // 显示秒数
            document.getElementById('showSeconds').checked = state.settings.showSeconds;
            document.getElementById('showSeconds').addEventListener('change', (e) => {
                state.settings.showSeconds = e.target.checked;
                saveSettings();
            });
            
            // 显示农历
            document.getElementById('showLunar').checked = state.settings.showLunar;
            document.getElementById('showLunar').addEventListener('change', (e) => {
                state.settings.showLunar = e.target.checked;
                saveSettings();
            });
            
            // 显示天气
            document.getElementById('showWeather').checked = state.settings.showWeather;
            document.getElementById('showWeather').addEventListener('change', (e) => {
                state.settings.showWeather = e.target.checked;
                saveSettings();
                document.getElementById('weatherModule').classList.toggle('hidden', !e.target.checked);
            });
            
            // 显示待办
            document.getElementById('showTodo').checked = state.settings.showTodo;
            document.getElementById('showTodo').addEventListener('change', (e) => {
                state.settings.showTodo = e.target.checked;
                saveSettings();
                document.getElementById('todoModule').classList.toggle('hidden', !e.target.checked);
            });
            
            // 页面动画
            document.getElementById('enableAnimations').checked = state.settings.enableAnimations;
            document.getElementById('enableAnimations').addEventListener('change', (e) => {
                state.settings.enableAnimations = e.target.checked;
                saveSettings();
                document.body.style.setProperty('--transition-fast', e.target.checked ? '150ms' : '0ms');
                document.body.style.setProperty('--transition-normal', e.target.checked ? '250ms' : '0ms');
                document.body.style.setProperty('--transition-slow', e.target.checked ? '350ms' : '0ms');
            });
            
            // 搜索建议
            document.getElementById('enableSuggestions').checked = state.settings.enableSuggestions;
            document.getElementById('enableSuggestions').addEventListener('change', (e) => {
                state.settings.enableSuggestions = e.target.checked;
                saveSettings();
            });
            
            // 建议数量
            document.getElementById('suggestionCount').value = state.settings.suggestionCount;
            document.getElementById('suggestionCountValue').textContent = state.settings.suggestionCount;
            document.getElementById('suggestionCount').addEventListener('input', (e) => {
                state.settings.suggestionCount = parseInt(e.target.value);
                document.getElementById('suggestionCountValue').textContent = e.target.value;
                saveSettings();
            });
            
            // 搜索框位置
            document.getElementById('searchPosition').value = state.settings.searchPosition;
            document.getElementById('searchPosition').addEventListener('change', (e) => {
                state.settings.searchPosition = e.target.value;
                saveSettings();
                const container = document.getElementById('mainContainer');
                if (e.target.value === 'top') {
                    container.style.justifyContent = 'flex-start';
                    container.style.paddingTop = '15vh';
                } else {
                    container.style.justifyContent = 'center';
                    container.style.paddingTop = '';
                }
            });
            
            // 快捷方式每行数量
            document.getElementById('shortcutsPerRow').value = state.settings.shortcutsPerRow;
            document.getElementById('shortcutsPerRowValue').textContent = state.settings.shortcutsPerRow;
            document.getElementById('shortcutsPerRow').addEventListener('input', (e) => {
                state.settings.shortcutsPerRow = parseInt(e.target.value);
                document.getElementById('shortcutsPerRowValue').textContent = e.target.value;
                saveSettings();
                renderShortcuts();
            });
            
            // 显示快捷方式名称
            document.getElementById('showShortcutNames').checked = state.settings.showShortcutNames;
            document.getElementById('showShortcutNames').addEventListener('change', (e) => {
                state.settings.showShortcutNames = e.target.checked;
                saveSettings();
                renderShortcuts();
            });
            
            // 壁纸源
            document.getElementById('wallpaperSource').value = state.settings.wallpaperSource;
            document.getElementById('wallpaperSource').addEventListener('change', (e) => {
                state.settings.wallpaperSource = e.target.value;
                saveSettings();
                updateWallpaperSourceUI();
                updateWallpaper();
            });
            
            // Unsplash关键词
            document.getElementById('unsplashKeyword').value = state.settings.unsplashKeyword;
            document.getElementById('unsplashKeyword').addEventListener('change', (e) => {
                state.settings.unsplashKeyword = e.target.value;
                saveSettings();
                updateWallpaper();
            });
            
            // 本地壁纸上传
            document.getElementById('localWallpaperInput').addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        Storage.set('localWallpaper', e.target.result);
                        updateWallpaper();
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // 颜色选择
            document.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
                    option.classList.add('active');
                    state.settings.backgroundColor = option.dataset.color;
                    saveSettings();
                    updateWallpaper();
                });
            });
            
            // 壁纸模糊度
            document.getElementById('wallpaperBlur').value = state.settings.wallpaperBlur;
            document.getElementById('wallpaperBlurValue').textContent = state.settings.wallpaperBlur + 'px';
            document.getElementById('wallpaperBlur').addEventListener('input', (e) => {
                state.settings.wallpaperBlur = parseInt(e.target.value);
                document.getElementById('wallpaperBlurValue').textContent = e.target.value + 'px';
                saveSettings();
                updateWallpaper();
            });
            
            // 遮罩层透明度
            document.getElementById('wallpaperOverlay').value = state.settings.wallpaperOverlay;
            document.getElementById('wallpaperOverlayValue').textContent = state.settings.wallpaperOverlay + '%';
            document.getElementById('wallpaperOverlay').addEventListener('input', (e) => {
                state.settings.wallpaperOverlay = parseInt(e.target.value);
                document.getElementById('wallpaperOverlayValue').textContent = e.target.value + '%';
                saveSettings();
                updateWallpaper();
            });
            
            // 自动切换壁纸
            document.getElementById('wallpaperAutoChange').value = state.settings.wallpaperAutoChange;
            document.getElementById('wallpaperAutoChange').addEventListener('change', (e) => {
                state.settings.wallpaperAutoChange = e.target.value;
                saveSettings();
            });
            
            // 导出配置
            document.getElementById('exportBtn').addEventListener('click', exportSettings);
            
            // 导入配置
            document.getElementById('importInput').addEventListener('change', importSettings);
            
            // 重置设置
            document.getElementById('resetBtn').addEventListener('click', () => {
                showConfirm('重置设置', '确定要恢复所有设置为默认值吗？', () => {
                    state.settings = { ...defaultSettings };
                    saveSettings();
                    location.reload();
                });
            });
            
            // 清空所有数据
            document.getElementById('clearAllBtn').addEventListener('click', () => {
                showConfirm('清空数据', '确定要删除所有本地存储的数据吗？此操作不可恢复。', () => {
                    Storage.clear();
                    location.reload();
                });
            });
            
            // 快捷方式弹窗
            document.getElementById('cancelShortcutBtn').addEventListener('click', closeShortcutModal);
            document.getElementById('confirmShortcutBtn').addEventListener('click', () => {
                const name = document.getElementById('shortcutNameInput').value.trim();
                let url = document.getElementById('shortcutUrlInput').value.trim();
                
                if (!name || !url) {
                    showToast('请填写完整信息');
                    return;
                }
                
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                
                addShortcut(name, url);
                closeShortcutModal();
            });
            
            // 确认弹窗
            document.getElementById('cancelConfirmBtn').addEventListener('click', () => {
                document.getElementById('confirmModal').classList.remove('active');
            });
            
            updateWallpaperSourceUI();
        }

        function updateWallpaperSourceUI() {
            const source = state.settings.wallpaperSource;
            document.getElementById('unsplashKeywordContainer').style.display = source === 'unsplash' ? 'block' : 'none';
            document.getElementById('localWallpaperContainer').style.display = source === 'local' ? 'block' : 'none';
            document.getElementById('colorWallpaperContainer').style.display = source === 'color' ? 'block' : 'none';
        }

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

        function importSettings(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.settings) {
                        state.settings = { ...defaultSettings, ...data.settings };
                        saveSettings();
                    }
                    
                    if (data.shortcuts) {
                        state.shortcuts = data.shortcuts;
                        saveShortcuts();
                    }
                    
                    if (data.todos) {
                        state.todos = data.todos;
                        saveTodos();
                    }
                    
                    if (data.searchEngines) {
                        state.searchEngines = data.searchEngines;
                        Storage.set('searchEngines', state.searchEngines);
                    }
                    
                    showToast('配置已导入，页面即将刷新');
                    setTimeout(() => location.reload(), 1500);
                } catch (err) {
                    showToast('配置文件格式错误');
                }
            };
            reader.readAsText(file);
        }

        // ==================== 键盘快捷键 ====================
        function initKeyboard() {
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + K 聚焦搜索框
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    document.getElementById('searchInput').focus();
                }
                
                // Ctrl/Cmd + , 打开设置
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
                        document.getElementById('todoPanel').classList.remove('active');
                    } else {
                        document.getElementById('searchInput').blur();
                        hideSuggestions();
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

        // ==================== 右键菜单 ====================
        function initContextMenu() {
            const menu = document.getElementById('contextMenu');
            
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
            document.getElementById('ctxRefreshWallpaper').addEventListener('click', () => {
                updateWallpaper();
                showToast('壁纸已刷新');
            });
            
            // 打开设置
            document.getElementById('ctxSettings').addEventListener('click', openSettings);
            
            // 添加快捷方式
            document.getElementById('ctxAddShortcut').addEventListener('click', openShortcutModal);
            
            // 切换深色模式
            document.getElementById('ctxDarkMode').addEventListener('click', toggleDarkMode);
            
            // 沉浸模式
            document.getElementById('ctxImmersive').addEventListener('click', toggleImmersiveMode);
        }

        // ==================== 沉浸模式 ====================
        function initImmersiveMode() {
            let lastClickTime = 0;
            const mainContainer = document.getElementById('mainContainer');
            
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

        function toggleImmersiveMode() {
            state.isImmersive = !state.isImmersive;
            document.getElementById('mainContainer').classList.toggle('immersive', state.isImmersive);
            
            if (state.isImmersive) {
                showToast('双击空白处退出沉浸模式');
            }
        }

        // ==================== 工具函数 ====================
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('active');
            
            setTimeout(() => {
                toast.classList.remove('active');
            }, 2500);
        }

        function showConfirm(title, text, onConfirm) {
            document.getElementById('confirmTitle').textContent = title;
            document.getElementById('confirmText').textContent = text;
            document.getElementById('confirmModal').classList.add('active');
            
            const confirmBtn = document.getElementById('confirmActionBtn');
            confirmBtn.onclick = () => {
                document.getElementById('confirmModal').classList.remove('active');
                onConfirm();
            };
        }

        // ==================== 启动 ====================
        document.addEventListener('DOMContentLoaded', init);
    
