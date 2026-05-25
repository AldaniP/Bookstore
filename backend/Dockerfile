FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod
COPY . .
EXPOSE 5000
ENV PORT=5000
CMD ["node", "index.js"]
