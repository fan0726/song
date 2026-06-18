#!/usr/bin/env bash
# 把 song CLI 打包成「单文件 Node 脚本」(带 shebang)。
# 产物 dist/song 体积只有几十 KB，但运行时需要目标机器已安装 Node.js。
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> 安装依赖 ..."
npm install --no-audit --no-fund

echo "==> 使用 esbuild 打包为单文件 ..."
mkdir -p dist
# 入口 bin/song.js 自带 #!/usr/bin/env node，esbuild 会原样保留，无需 banner
npx esbuild bin/song.js \
  --bundle \
  --platform=node \
  --target=node18 \
  --outfile=dist/song

chmod +x dist/song

echo ""
echo "==> 构建完成："
ls -lh dist/song
echo ""
echo "目标机器需已安装 Node.js (>=18)，下载 dist/song 后即可直接运行。"
