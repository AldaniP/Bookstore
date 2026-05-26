# Build stage
FROM node:20-alpine AS build
WORKDIR /app
RUN npm install -g pnpm

# Define build-time arguments for Firebase & API
ARG VITE_API_KEY
ARG VITE_Auth_Domain
ARG VITE_PROJECT_ID
ARG VITE_STORAGE_BUCKET
ARG VITE_MESSAGING_SENDERID
ARG VITE_APPID
ARG VITE_BACKEND_URL

# Expose them as environment variables during build
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_Auth_Domain=$VITE_Auth_Domain
ENV VITE_PROJECT_ID=$VITE_PROJECT_ID
ENV VITE_STORAGE_BUCKET=$VITE_STORAGE_BUCKET
ENV VITE_MESSAGING_SENDERID=$VITE_MESSAGING_SENDERID
ENV VITE_APPID=$VITE_APPID
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf.template /etc/nginx/templates/default.conf.template
ENV PORT=80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
