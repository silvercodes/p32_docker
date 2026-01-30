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

# Выполнение команд
RUN npm install
RUN RUN ["executable", "param1", "param2"]
RUN npm run build
RUN npm cache clean --force && \
rm -rf /tmp/* var/tmp/*

# Переменные окружения (доступны во время сборки и выполнения)
ENV NODE_ENV=production
ENV PORT=3000
ENV APP_VERSION=1.0.0

# Аргументы сборки (доступны во время сборки)
# Можно переопределить при build ---> docker build --build-arg NODE_VERSION=18.16.0 .....
ARG NODE_VERSION=20.12.0
ARG APP_DIR=/usr/src/app

FROM node:${NODE_VERSION}
WORKDIR ${APP_DIR}

# Открытие портов (Разрешение на открытие портов)
EXPOSE 3000
EXPOSE 3000/tcp
EXPOSE 3010/udp

# Монтирование тома
VOLUME ["./src", "/usr/src"]

# Изменение командной оболочки
SHELL ["/bin/bash"]

# Команда по-умолчанию
# Можно переопределить ----> docker run my_img npm start
CMD ["node", "server.js"]
# :-( CMD node server.js

# Точка входа
# Moжно переопределить ----> docker run my_img --entrypoint bash
ENTRYPOINT [ "node" ]

#######################################################
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]

# docker run my_img             ---> запуск приложения
# docker run -it my_img bash    ---> запуск bash


#######################################################
FROM golang as builder
WORKDIR /app
COPY . .
RUN go build -o /myapp

FROM golang
COPY --from=builder /myapp /myapp
ENTRYPOINT ["/myapp"]

# docker run my_img                         ---> старт /myapp
# docker run my_img --config /config.yaml   ---> старт /myapp --config /config.yaml


########################################################
FROM alpine
RUN apk add --no-cache curl
ENTRYPOINT [ "curl" ]
CMD ["--help"]

# docker run my_img                         ---> curl --help
# docker run my_img https://wikipedia.org   ---> curl https://wikipedia.org




FROM node
COPY docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

WORKDIR /app
COPY . .

ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]
CMD [ "start" ]


# #!/bin/bash
#
# if ["$1" = 'start']; then
#   exec node app.js
# elif ["$1" = 'debug']; then
#   exec node --env=debug app.js
# elif ["$1" = 'test']; then
#   exec npm test
# else
#   exec "$@"
# fi








