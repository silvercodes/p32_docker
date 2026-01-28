# Базовый образ
FROM node:20.12-alpine3.19 AS build

# Метаданные
LABEL maintainer="vasia"
LABEL description="...."
LABEL version="1.0.12"
LABEL org.opencontainers.image.source="https://github.com/...."

# Рабочая директория
WORKDIR /usr/src/app

# Копирование файлов
COPY package*.json .
COPY --chown=node:node . /usr/src/app

# Копирование с доп возможностями  :-(
ADD https://lib.com/data.tar.gz /var/tmp
