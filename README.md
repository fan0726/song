# song

一个用 Node.js 写的命令行工具，封装了对第三方接口的调用。可打包成**独立二进制**（内含 Node 运行时），部署到 Linux 服务器后，别人通过 `curl` 下载即可直接使用，无需安装 Node。

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

## 打包成独立二进制

在**有 Node 环境的机器**（如你的 Mac）上执行：

```bash
npm run build
# 等价于 bash scripts/build.sh
```

产物在 `dist/` 目录：

```
dist/
├── song-linux-x64      # x86_64 服务器用
└── song-linux-arm64    # ARM 服务器用
```

> 目标平台在 `package.json` 的 `"pkg".targets` 里配置，可按需增删。
> 这些二进制内置了 Node 运行时，**目标机器无需安装 Node**。

## 发布新版本（维护者）

二进制通过 **GitHub Releases** 分发，不进 git 仓库：

```bash
npm run build          # 生成 dist/song-linux-x64、dist/song-linux-arm64
gh release create v1.0.1 dist/song-linux-* --title "song v1.0.1" --notes "..."
```

`install.sh` 默认从 `releases/latest/download` 拉取，因此发完新 Release 无需改任何地址。

## 别人怎么用（在他们的机器上）

仓库是 **Public**，以下命令无需任何认证。

**方式一：一键安装脚本（推荐，自动识别架构）**

```bash
curl -fsSL https://github.com/fan0726/song/releases/latest/download/install.sh | bash
song -v
song wtr
```

> 注：要让上面这条生效，需把 `install.sh` 也作为 Release 资产上传一次：
> `gh release upload v1.0.0 install.sh`

**方式二：直接 curl 下载二进制**

```bash
# x86_64
curl -fsSL https://github.com/fan0726/song/releases/latest/download/song-linux-x64 -o /usr/local/bin/song
chmod +x /usr/local/bin/song

# ARM64 则把上面的 song-linux-x64 换成 song-linux-arm64

song -v
song wtr 北京
```

**方式三：用 gh CLI**

```bash
gh release download -R fan0726/song -p 'song-linux-*'
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
├── scripts/build.sh     # 打包脚本（pkg 交叉编译）
├── install.sh           # 终端用户一键安装脚本
└── package.json
```
