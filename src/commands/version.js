'use strict';

const { VERSION } = require('../version');

// 对应 song -v / song --version
module.exports = function version() {
  console.log(`song v${VERSION}`);
};
