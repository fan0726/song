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

## 部署到 Linux 服务器（供他人下载）

1. 把 `dist/` 里的二进制和 `install.sh` 放到服务器某个目录，例如 `/var/www/song/`：

   ```
   /var/www/song/
   ├── song-linux-x64
   ├── song-linux-arm64
   └── install.sh
   ```

2. 用任意 Web 服务把该目录暴露出去（Nginx / Caddy / 甚至临时用 `python3 -m http.server`）。
   假设外网可访问地址是 `http://你的服务器/song/`。

3. 编辑 `install.sh`，把顶部的 `BASE_URL` 改成上面的地址（或安装时用环境变量覆盖）。

## 别人怎么用（在他们的机器上）

**方式一：一键安装脚本（推荐，自动识别架构）**

```bash
curl -fsSL http://你的服务器/song/install.sh | bash
song -v
song wtr
```

**方式二：直接 curl 下载二进制**

```bash
# x86_64 服务器
curl -fsSL http://你的服务器/song/song-linux-x64 -o /usr/local/bin/song
chmod +x /usr/local/bin/song

song -v
song wtr 北京
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
