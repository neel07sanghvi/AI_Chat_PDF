FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm && pnpm install

COPY . .

CMD ["pnpm", "dev"]

