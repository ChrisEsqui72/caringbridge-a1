FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

RUN npm ci

COPY server ./server
COPY shared ./shared

WORKDIR /app/server

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]