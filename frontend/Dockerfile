# Node.jsの公式イメージをベースにする
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonを先にコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# React開発サーバーを起動
CMD ["npm", "run", "dev"]