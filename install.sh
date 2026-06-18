#!/usr/bin/env bash
# song CLI 一键安装脚本（Node 脚本版，需目标机器已安装 Node.js）。
# 用法(在目标机器上)：
#   curl -fsSL https://github.com/fan0726/song/releases/latest/download/install.sh | bash
# 可选环境变量：
#   SONG_BASE_URL    song 脚本所在目录的 URL，默认指向 GitHub 最新 Release
#   SONG_INSTALL_DIR 安装目录，默认 /usr/local/bin
set -euo pipefail

BASE_URL="${SONG_BASE_URL:-https://github.com/fan0726/song/releases/latest/download}"
INSTALL_DIR="${SONG_INSTALL_DIR:-/usr/local/bin}"

# song 是 Node 脚本，运行需要 node
if ! command -v node >/dev/null 2>&1; then
  echo "错误：未检测到 Node.js，请先安装 Node.js (>=18) 再运行本脚本。" >&2
  echo "      参考：https://nodejs.org/  或  nvm install --lts" >&2
  exit 1
fi
echo "==> 已检测到 Node $(node -v)"

url="$BASE_URL/song"
echo "==> 正在下载 $url ..."
tmp="$(mktemp)"
curl -fsSL "$url" -o "$tmp"
chmod +x "$tmp"

target="$INSTALL_DIR/song"
echo "==> 安装到 $target ..."
if [ -w "$INSTALL_DIR" ]; then
  mv "$tmp" "$target"
else
  sudo mv "$tmp" "$target"
fi

echo "==> 安装完成！版本："
"$target" -v
