# Next.js 開発用コンテナ
# 本番デプロイは Vercel を想定しているため、開発用途に特化した構成
FROM node:22-alpine

WORKDIR /app

# package.json と package-lock.json を先にコピーすることで、
# 依存関係に変更がない限り npm ci のレイヤーキャッシュが効く
COPY package.json package-lock.json ./
RUN npm ci

# 残りのソースをコピー（node_modules や .next は .dockerignore で除外済み）
COPY . .

EXPOSE 3000

# WSL2 環境ではバインドマウント越しの inotify が効かないため、
# ポーリングベースのファイル監視を有効化してホットリロードを動作させる
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "run", "dev"]
