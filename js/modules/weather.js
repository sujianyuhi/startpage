/**
 * 时锦起始页 - 天气管理模块
 * 使用高德地图 API 获取天气数据
 */

import { state, CONFIG } from '../config.js';
import { $, showToast } from '../utils/dom.js';

const AMAP_KEY = 'e2432a4b3e865870924d9a2bc14e6ba5';

const WEATHER_CLASS_MAP = {
    '晴': 'weather-sunny',
    '多云': 'weather-cloudy',
    '阴': 'weather-overcast',
    '小雨': 'weather-rainy',
    '中雨': 'weather-rainy',
    '大雨': 'weather-rainy',
    '暴雨': 'weather-rainy',
    '阵雨': 'weather-rainy',
    '雷阵雨': 'weather-rainy',
    '雨夹雪': 'weather-snowy',
    '小雪': 'weather-snowy',
    '中雪': 'weather-snowy',
    '大雪': 'weather-snowy',
    '暴雪': 'weather-snowy',
    '雾': 'weather-overcast',
    '霾': 'weather-overcast',
    '浮尘': 'weather-overcast',
    '扬沙': 'weather-overcast',
    '沙尘暴': 'weather-overcast'
};

function setWeatherClass(condition) {
    const module = document.getElementById('weatherModule');
    if (!module) return;
    const weatherClasses = ['weather-sunny', 'weather-cloudy', 'weather-overcast', 'weather-rainy', 'weather-snowy'];
    weatherClasses.forEach(cls => module.classList.remove(cls));
    const targetClass = WEATHER_CLASS_MAP[condition] || 'weather-sunny';
    module.classList.add(targetClass);
}

export async function init() {
    if (!state.settings.showWeather) {
        const weatherModule = document.getElementById('weatherModule');
        if (weatherModule) {
            weatherModule.classList.add('hidden');
        }
        return;
    }
    
    if (AMAP_KEY === 'YOUR_AMAP_KEY_HERE') {
        console.warn('请配置高德地图 API Key');
        await updateWeatherFallback();
    } else {
        await updateWeather();
    }
    
    setInterval(() => {
        if (AMAP_KEY !== 'YOUR_AMAP_KEY_HERE') {
            updateWeather();
        } else {
            updateWeatherFallback();
        }
    }, 30 * 60 * 1000);
}

async function updateWeather() {
    try {
        const locationRes = await fetch(`https://restapi.amap.com/v3/ip?key=${AMAP_KEY}`);
        const locationData = await locationRes.json();
        
        if (locationData.status !== '1') {
            throw new Error('定位失败: ' + locationData.info);
        }
        
        const adcode = locationData.adcode;
        const city = locationData.city || '本地';
        
        const weatherRes = await fetch(`https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}&city=${adcode}&extensions=base`);
        const weatherData = await weatherRes.json();
        
        if (weatherData.status === '1' && weatherData.lives && weatherData.lives.length > 0) {
            const live = weatherData.lives[0];
            const temp = live.temperature;
            const weather = live.weather;
            const humidity = live.humidity;
            const windDirection = live.winddirection;
            const windPower = live.windpower;
            
            setWeatherClass(weather);
            
            const weatherTemp = document.getElementById('weatherTemp');
            const weatherDesc = document.getElementById('weatherDesc');
            const weatherCity = document.getElementById('weatherCity');
            const weatherIcon = document.getElementById('weatherIcon');
            
            if (weatherTemp) weatherTemp.textContent = `${temp}°`;
            if (weatherDesc) weatherDesc.textContent = weather;
            if (weatherCity) weatherCity.textContent = city.replace('市', '');
            if (weatherIcon) weatherIcon.innerHTML = getWeatherIcon(weather);
            
            const weatherHumidity = document.getElementById('weatherHumidity');
            const weatherWind = document.getElementById('weatherWind');
            
            if (weatherHumidity) weatherHumidity.textContent = `${humidity}%`;
            if (weatherWind) weatherWind.textContent = `${windDirection}${windPower}级`;
        } else {
            throw new Error('获取天气失败');
        }
    } catch (e) {
        console.warn('高德天气 API 错误:', e);
        await updateWeatherFallback();
    }
}

async function updateWeatherFallback() {
    try {
        const locationRes = await fetch('https://ipapi.co/json/');
        const locationData = await locationRes.json();
        const city = locationData.city || '北京';
        
        const lat = locationData.latitude || 39.9042;
        const lon = locationData.longitude || 116.4074;
        
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
        const weatherData = await weatherRes.json();
        
        if (weatherData.current_weather) {
            const temp = Math.round(weatherData.current_weather.temperature);
            const weatherCode = weatherData.current_weather.weathercode;
            const condition = getWeatherCondition(weatherCode);
            
            setWeatherClass(condition);
            
            const weatherTemp = document.getElementById('weatherTemp');
            const weatherDesc = document.getElementById('weatherDesc');
            const weatherCity = document.getElementById('weatherCity');
            const weatherIcon = document.getElementById('weatherIcon');
            
            if (weatherTemp) weatherTemp.textContent = `${temp}°`;
            if (weatherDesc) weatherDesc.textContent = condition;
            if (weatherCity) weatherCity.textContent = city;
            if (weatherIcon) weatherIcon.innerHTML = CONFIG.weatherIcons[condition] || CONFIG.weatherIcons['晴'];
            
            const weatherDetails = document.getElementById('weatherDetails');
            if (weatherDetails) {
                weatherDetails.style.display = 'none';
            }
        }
    } catch (e) {
        console.warn('备用天气更新错误:', e);
        const weatherModule = document.getElementById('weatherModule');
        if (weatherModule) {
            weatherModule.classList.add('hidden');
        }
    }
}

function getWeatherIcon(weather) {
    const weatherMap = {
        '晴': '晴',
        '多云': '多云',
        '阴': '阴',
        '小雨': '雨',
        '中雨': '雨',
        '大雨': '雨',
        '暴雨': '雨',
        '阵雨': '雨',
        '雷阵雨': '雨',
        '雨夹雪': '雨',
        '小雪': '雪',
        '中雪': '雪',
        '大雪': '雪',
        '暴雪': '雪',
        '雾': '阴',
        '霾': '阴',
        '浮尘': '阴',
        '扬沙': '阴',
        '沙尘暴': '阴'
    };
    
    const condition = weatherMap[weather] || '晴';
    return CONFIG.weatherIcons[condition] || CONFIG.weatherIcons['晴'];
}

function getWeatherCondition(code) {
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

export function toggleWeather(show) {
    const weatherModule = document.getElementById('weatherModule');
    if (weatherModule) {
        weatherModule.classList.toggle('hidden', !show);
    }
}
