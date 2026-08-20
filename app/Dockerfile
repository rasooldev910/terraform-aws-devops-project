FROM node:24-alpine
WORKDIR /app
RUN npm install -g npm@latest
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]