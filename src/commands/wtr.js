'use strict';

const { getJSON } = require('../lib/http');

// 默认位置：上海
const DEFAULT_LOCATION = {
  name: '上海',
  latitude: 31.23,
  longitude: 121.47,
  timezone: 'Asia/Shanghai',
};

// 通过 Open-Meteo 的地理编码接口把城市名转成经纬度
async function geocode(name) {
  const url =
    'https://geocoding-api.open-meteo.com/v1/search' +
    `?name=${encodeURIComponent(name)}&count=1&language=zh&format=json`;
  const data = await getJSON(url);
  if (!data.results || data.results.length === 0) {
    throw new Error(`找不到城市「${name}」`);
  }
  const r = data.results[0];
  return {
    name: r.name + (r.admin1 ? ` (${r.admin1})` : ''),
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone || 'auto',
  };
}

// 调用 Open-Meteo 天气预报接口
async function fetchForecast(loc) {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${loc.latitude}&longitude=${loc.longitude}` +
    '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum' +
    `&timezone=${encodeURIComponent(loc.timezone)}&forecast_days=2`;
  return getJSON(url);
}

function render(loc, data) {
  const d = data.daily || {};
  const units = data.daily_units || {};
  const tUnit = units.temperature_2m_max || '°C';
  const pUnit = units.precipitation_sum || 'mm';
  const times = d.time || [];

  const out = [];
  out.push('');
  out.push(`  📍 ${loc.name}  (纬度 ${data.latitude}, 经度 ${data.longitude})`);
  out.push(`  🕐 时区 ${data.timezone}`);
  out.push('');

  for (let i = 0; i < times.length; i++) {
    const label = i === 0 ? '今天' : i === 1 ? '明天' : '   ';
    const min = d.temperature_2m_min[i];
    const max = d.temperature_2m_max[i];
    const precip = d.precipitation_sum[i];
    out.push(
      `  ${label} ${times[i]}   🌡 ${min} ~ ${max}${tUnit}   ☔ ${precip}${pUnit}`
    );
  }
  out.push('');
  console.log(out.join('\n'));
}

// 对应 song wtr [城市] [--json]
module.exports = async function wtr(args) {
  const asJson = args.includes('--json');
  const cityParts = args.filter((a) => !a.startsWith('-'));

  let loc = DEFAULT_LOCATION;
  if (cityParts.length > 0) {
    loc = await geocode(cityParts.join(' '));
  }

  const data = await fetchForecast(loc);

  if (asJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }
  render(loc, data);
};
