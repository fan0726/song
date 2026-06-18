#!/usr/bin/env bash
# 把 song CLI 打包成「独立二进制」(内含 Node 运行时，目标机器无需安装 Node)。
# 默认产出 Linux x64 / arm64 两个版本，输出到 dist/ 目录。
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> 安装依赖 ..."
npm install --no-audit --no-fund

# 目标平台 : 输出文件名（显式命名，确保和 install.sh 约定一致）
TARGETS=(
  "node22-linux-x64:song-linux-x64"
  "node22-linux-arm64:song-linux-arm64"
)

mkdir -p dist
for entry in "${TARGETS[@]}"; do
  target="${entry%%:*}"
  out="${entry##*:}"
  echo "==> 构建 $out  ($target) ..."
  npx pkg . -t "$target" -o "dist/$out"
done

echo ""
echo "==> 构建完成，产物如下："
ls -lh dist/

cat <<'EOF'

下一步：
  1. 把 dist/ 里的二进制 和 install.sh 放到你的 Linux 服务器(用任意 Web 服务托管)。
  2. 别人即可通过 curl 下载使用，详见 README.md。
EOF
