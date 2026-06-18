'use strict';

const { VERSION } = require('../version');

// 对应 song / song -h / song --help
module.exports = function help(commands) {
  const lines = [];
  lines.push(`song v${VERSION} —— 命令行第三方接口工具`);
  lines.push('');
  lines.push('用法:');
  lines.push('  song <指令> [参数]');
  lines.push('');
  lines.push('可用指令:');
  Object.keys(commands).forEach((name) => {
    const c = commands[name];
    lines.push(`  ${name.padEnd(12)}${c.summary || ''}`);
  });
  lines.push('');
  lines.push('选项:');
  lines.push(`  ${'-v, --version'.padEnd(16)}显示版本号`);
  lines.push(`  ${'-h, --help'.padEnd(16)}显示本帮助信息`);
  lines.push('');
  lines.push('示例:');
  lines.push('  song -v');
  lines.push('  song wtr');
  lines.push('  song wtr 北京');
  lines.push('  song wtr 广州 --json');
  console.log(lines.join('\n'));
};
