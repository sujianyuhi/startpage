/**
 * 时锦起始页 - 本地存储管理模块
 * 封装 localStorage 操作，添加命名空间前缀
 */

const STORAGE_PREFIX = 'qingning_';

/**
 * 从本地存储获取数据
 * @param {string} key - 存储键名
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储的值或默认值
 */
export function get(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.warn('Storage get error:', e);
        return defaultValue;
    }
}

/**
 * 保存数据到本地存储
 * @param {string} key - 存储键名
 * @param {*} value - 要存储的值
 */
export function set(key, value) {
    try {
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (e) {
        console.warn('Storage set error:', e);
    }
}

/**
 * 从本地存储删除数据
 * @param {string} key - 存储键名
 */
export function remove(key) {
    try {
        localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (e) {
        console.warn('Storage remove error:', e);
    }
}

/**
 * 清空所有应用相关的本地存储数据
 */
export function clear() {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(STORAGE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    } catch (e) {
        console.warn('Storage clear error:', e);
    }
}

/**
 * 导出所有应用数据为 JSON
 * @returns {Object} 包含所有设置和数据的对象
 */
export function exportAll() {
    const data = {};
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
            const shortKey = key.replace(STORAGE_PREFIX, '');
            try {
                data[shortKey] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
                data[shortKey] = localStorage.getItem(key);
            }
        }
    });
    return data;
}

/**
 * 导入应用数据
 * @param {Object} data - 要导入的数据对象
 */
export function importAll(data) {
    Object.keys(data).forEach(key => {
        set(key, data[key]);
    });
}
