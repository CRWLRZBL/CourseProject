# Стадия сборки
FROM node:20-alpine AS build
WORKDIR /app

# Копируем package.json и package-lock.json по отдельности
COPY frontend/package.json ./
COPY frontend/package-lock.json* ./
RUN npm ci

# Копируем остальные файлы проекта
COPY frontend/ ./

# Устанавливаем переменные окружения для сборки (Vite требует их во время сборки)
ARG VITE_API_URL=http://localhost:5171/api
ENV VITE_API_URL=$VITE_API_URL

# Собираем проект
RUN npm run build

# Стадия запуска с nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Удаляем дефолтные файлы nginx
RUN rm -rf ./*

# Копируем собранные файлы из стадии сборки (включая папку public с изображениями)
COPY --from=build /app/dist .

# Копируем конфигурацию nginx
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

