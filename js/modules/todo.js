/**
 * 时锦起始页 - 待办事项模块
 * 处理待办事项的增删改查
 */

import { state } from '../config.js';
import * as storage from '../utils/storage.js';
import { escapeHtml, showToast } from '../utils/dom.js';

/**
 * 初始化待办事项模块
 */
export function init() {
    if (!state.settings.showTodo) {
        const todoModule = document.getElementById('todoModule');
        if (todoModule) {
            todoModule.classList.add('hidden');
        }
        return;
    }
    
    const toggle = document.getElementById('todoToggle');
    const panel = document.getElementById('todoPanel');
    const input = document.getElementById('todoInput');
    const clearBtn = document.getElementById('clearCompletedBtn');
    
    // 切换面板
    if (toggle) {
        toggle.addEventListener('click', () => {
            state.isTodoOpen = !state.isTodoOpen;
            if (panel) {
                panel.classList.toggle('active', state.isTodoOpen);
            }
        });
    }
    
    // 添加待办
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const text = input.value.trim();
                if (text) {
                    addTodo(text);
                    input.value = '';
                }
            }
        });
    }
    
    // 清空已完成
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            state.todos = state.todos.filter(t => !t.completed);
            storage.set('todos', state.todos);
            renderTodos();
            showToast('已清空已完成事项');
        });
    }
    
    // 点击外部关闭
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.todo-module')) {
            state.isTodoOpen = false;
            if (panel) {
                panel.classList.remove('active');
            }
        }
    });
    
    renderTodos();
}

/**
 * 渲染待办事项列表
 */
export function renderTodos() {
    const list = document.getElementById('todoList');
    const badge = document.getElementById('todoBadge');
    
    if (!list) return;
    
    const uncompleted = state.todos.filter(t => !t.completed).length;
    if (badge) {
        badge.textContent = uncompleted;
        badge.classList.toggle('hidden', uncompleted === 0);
    }
    
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
        
        if (!todo) return;
        
        const checkbox = item.querySelector('.todo-checkbox');
        const deleteBtn = item.querySelector('.todo-delete');
        
        if (checkbox) {
            checkbox.addEventListener('click', () => {
                todo.completed = !todo.completed;
                storage.set('todos', state.todos);
                renderTodos();
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                state.todos = state.todos.filter(t => t.id !== id);
                storage.set('todos', state.todos);
                renderTodos();
            });
        }
    });
}

/**
 * 添加待办事项
 * @param {string} text - 待办内容
 */
export function addTodo(text) {
    state.todos.push({
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: Date.now()
    });
    storage.set('todos', state.todos);
    renderTodos();
}

/**
 * 切换待办事项显示
 * @param {boolean} show - 是否显示
 */
export function toggleTodo(show) {
    const todoModule = document.getElementById('todoModule');
    if (todoModule) {
        todoModule.classList.toggle('hidden', !show);
    }
}
