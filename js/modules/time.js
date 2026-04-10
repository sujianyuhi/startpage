/**
 * 时锦起始页 - 时间管理模块
 * 处理时间显示、日期格式化和问候语更新
 */

// 上次问候语，用于避免重复动画
let lastGreeting = '';

/**
 * 初始化时间模块
 */
export function init() {
    updateTime();
    setInterval(updateTime, 1000);
}

/**
 * 更新时间和日期显示
 */
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 始终显示秒，时分秒相同大小
    const timeStr = `<span class="time-unit">${hours}</span><span class="colon">:</span><span class="time-unit">${minutes}</span><span class="colon">:</span><span class="time-unit">${seconds}</span>`;
    
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        timeDisplay.innerHTML = timeStr;
        timeDisplay.style.opacity = '1';
    }
    
    // 日期
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[now.getDay()];
    
    const dateStr = `${year}年${month}月${date}日 ${weekDay}`;
    const dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay) {
        dateDisplay.textContent = dateStr;
    }
    
    // 更新问候语
    updateGreeting(now);
}

/**
 * 更新问候语
 * @param {Date} now - 当前时间
 */
function updateGreeting(now) {
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let greeting = '你好';
    
    if (isWeekend) {
        // 周末问候语
        if (hour >= 0 && hour < 8) greeting = '周末早安，睡个好觉';
        else if (hour >= 8 && hour < 12) greeting = '周末愉快，享受美好时光';
        else if (hour >= 12 && hour < 14) greeting = '周末中午好，记得好好吃饭';
        else if (hour >= 14 && hour < 18) greeting = '周末下午好，放松身心';
        else if (hour >= 18 && hour < 22) greeting = '周末晚上好，享受闲暇';
        else greeting = '夜深了，周末也要早睡哦';
    } else {
        // 工作日问候语
        if (hour >= 0 && hour < 5) greeting = '夜深了，早点休息吧';
        else if (hour >= 5 && hour < 7) greeting = '清晨好，新的一天开始了';
        else if (hour >= 7 && hour < 9) greeting = '早上好，早餐吃了吗';
        else if (hour >= 9 && hour < 12) greeting = '上午好，工作顺利';
        else if (hour >= 12 && hour < 14) greeting = '中午好，记得午休';
        else if (hour >= 14 && hour < 17) greeting = '下午好，继续加油';
        else if (hour >= 17 && hour < 19) greeting = '傍晚好，该下班了';
        else if (hour >= 19 && hour < 22) greeting = '晚上好，放松身心';
        else greeting = '夜深了，注意休息';
    }
    
    const greetingEl = document.getElementById('greetingDisplay');
    if (!greetingEl) return;
    
    // 只在问候语变化时添加动画
    if (greeting !== lastGreeting) {
        greetingEl.style.animation = 'none';
        greetingEl.offsetHeight; // 触发重绘
        greetingEl.style.animation = 'greetingFadeIn 0.8s var(--ease-out)';
        greetingEl.textContent = greeting;
        lastGreeting = greeting;
    }
}
