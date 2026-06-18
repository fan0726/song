#!/usr/bin/env node
'use strict';

// CLI 入口。真正的逻辑在 src/index.js 里，方便后续扩展更多指令。
const { run } = require('../src/index.js');

run(process.argv.slice(2)).catch((err) => {
  process.stderr.write(`错误: ${err && err.message ? err.message : err}\n`);
  process.exit(1);
});
