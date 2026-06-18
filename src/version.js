'use strict';

// 统一从 package.json 读取版本号，pkg 打包时会把 package.json 一起打进去。
let VERSION = '0.0.0';
try {
  VERSION = require('../package.json').version || VERSION;
} catch (_) {
  // 极端情况下读不到就用默认值，不影响其它指令
}

module.exports = { VERSION };
