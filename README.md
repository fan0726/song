# song

一个用 Node.js 写的命令行工具，封装了对第三方接口的调用。打包成**单文件 Node 脚本**通过 GitHub Releases 分发，别人 `curl` 下载即可使用。

> ⚠️ **运行需要已安装 Node.js (>=18)。** 因为是纯 JS 脚本，**同一个 `song` 文件在 macOS / Linux / WSL 上都能用**，无需区分平台或 CPU 架构。

## 指令一览

| 指令 | 说明 |
| --- | --- |
| `song -v` / `song --version` | 显示版本号 |
| `song -h` / `song --help` | 显示所有可用指令 |
| `song wtr` | 获取天气预报（默认上海） |
| `song wtr <城市>` | 按城市名获取天气，如 `song wtr 北京` |
| `song wtr <城市> --json` | 返回原始 JSON |

天气数据来自 [Open-Meteo](https://open-meteo.com/)（免费、无需 API key）。

## 本地开发 / 运行

```bash
# 直接用 node 跑（开发时）
node bin/song.js -v
node bin/song.js wtr
node bin/song.js wtr 广州
```

## 打包成单文件脚本

在**有 Node 环境的机器**（如你的 Mac）上执行：

```bash
npm run build
# 等价于 bash scripts/build.sh
```

用 esbuild 把 `src/` 打包进一个带 shebang 的单文件，产物：

```
dist/
└── song     # 单文件 Node 脚本（几十 KB），需目标机器已装 Node
```

## 发布新版本（维护者）

脚本通过 **GitHub Releases** 分发，不进 git 仓库：

```bash
npm run build          # 生成 dist/song
gh release upload v1.0.0 dist/song install.sh --clobber   # 覆盖到已有 Release
# 或新建一个版本：
# gh release create v1.1.0 dist/song install.sh --title "song v1.1.0" --notes "..."
```

`install.sh` 默认从 `releases/latest/download` 拉取，因此发完新 Release 无需改任何地址。

## 别人怎么用（在他们的机器上）

仓库是 **Public**，以下命令无需任何认证。**前提：目标机器已安装 Node.js (>=18)。**

**方式一：一键安装脚本（推荐，会先检测 Node）**

```bash
curl -fsSL https://github.com/fan0726/song/releases/latest/download/install.sh | bash
song -v
song wtr
```

**方式二：直接 curl 下载脚本**

```bash
curl -fsSL https://github.com/fan0726/song/releases/latest/download/song -o /usr/local/bin/song
chmod +x /usr/local/bin/song

song -v
song wtr 北京
```

**方式三：用 gh CLI**

```bash
gh release download -R fan0726/song -p song
```

## 如何新增指令

1. 在 `src/commands/` 下新建一个 handler，例如 `src/commands/news.js`，导出一个 `async function(args)`。
2. 在 `src/index.js` 的 `commands` 注册表里加一条：

   ```js
   const news = require('./commands/news');
   const commands = {
     wtr: { /* ... */ },
     news: { handler: news, usage: 'song news', summary: '获取新闻' },
   };
   ```

3. `--help` 会自动列出新指令。重新 `npm run build` 即可。

## 项目结构

```
song/
├── bin/song.js          # 可执行入口（带 shebang）
├── src/
│   ├── index.js         # 指令分发 + 注册表
│   ├── version.js       # 读取版本号
│   ├── lib/http.js      # HTTP JSON 请求封装（带超时）
│   └── commands/        # 各个指令的实现
│       ├── help.js
│       ├── version.js
│       └── wtr.js
├── scripts/build.sh     # 打包脚本（esbuild 单文件打包）
├── install.sh           # 终端用户一键安装脚本
└── package.json
```
