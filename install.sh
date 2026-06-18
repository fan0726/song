#!/usr/bin/env bash
# song CLI 一键安装脚本。
# 用法(在目标机器上)：
#   curl -fsSL http://你的服务器/song/install.sh | bash
# 可选环境变量：
#   SONG_BASE_URL    二进制所在目录的 URL，默认见下方
#   SONG_INSTALL_DIR 安装目录，默认 /usr/local/bin
set -euo pipefail

# ↓↓↓ 部署后把这里改成你自己服务器上存放二进制的目录 URL ↓↓↓
BASE_URL="${SONG_BASE_URL:-http://YOUR_SERVER/song}"
INSTALL_DIR="${SONG_INSTALL_DIR:-/usr/local/bin}"

# 根据 CPU 架构选择对应二进制
arch="$(uname -m)"
case "$arch" in
  x86_64|amd64)   asset="song-linux-x64"   ;;
  aarch64|arm64)  asset="song-linux-arm64" ;;
  *) echo "不支持的架构: $arch" >&2; exit 1 ;;
esac

url="$BASE_URL/$asset"
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
