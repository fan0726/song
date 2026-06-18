'use strict';

// 轻量的 HTTP JSON 请求封装，带超时控制。
// Node 18+ / pkg 的 node22 运行时都内置了全局 fetch 和 AbortController。
async function getJSON(url, options = {}) {
  const timeout = options.timeout || 10000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'song-cli' },
    });
    if (!res.ok) {
      throw new Error(`请求失败 (HTTP ${res.status})`);
    }
    return await res.json();
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw new Error(`请求超时 (${timeout}ms)`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { getJSON };
