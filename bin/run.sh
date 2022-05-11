
set -e # 任意命令出错时终止运行
set -u # 变量不存在时报错
set -x # 在运行结果之前，先输出执行的那一行命令

# 脚本参数 $1: 'n' - npm 包有更新
cd ..

if [[ ($# > 0) && $1 = "n" ]]; then
  npm i
  echo "[NPM I SUCCESS]"
fi

npm run dev

echo "[SUCCESS]"
