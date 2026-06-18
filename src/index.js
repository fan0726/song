'use strict';

const help = require('./commands/help');
const version = require('./commands/version');
const wtr = require('./commands/wtr');

// 指令注册表。以后要加新的第三方接口指令，只需在这里加一条 + 写一个 handler。
const commands = {
  wtr: {
    handler: wtr,
    usage: 'song wtr [城市] [--json]',
    summary: '获取天气预报（默认上海），例如 song wtr 北京',
  },
};

async function run(argv) {
  const first = argv[0];

  // 帮助：song / song -h / song --help / song help
  if (!first || first === '-h' || first === '--help' || first === 'help') {
    help(commands);
    return;
  }

  // 版本：song -v / song --version / song version
  if (first === '-v' || first === '--version' || first === 'version') {
    version();
    return;
  }

  const cmd = commands[first];
  if (!cmd) {
    process.stderr.write(`未知指令：${first}\n\n`);
    help(commands);
    process.exitCode = 1;
    return;
  }

  await cmd.handler(argv.slice(1));
}

module.exports = { run, commands };
