#!/bin/bash
echo "Приложение работает от имени $(whoami)"
echo "UID: $(id -u), GID: $(id -g)"
echo "Создание файлов..."
touch /app/output.txt && echo "OK" || echo "ERROR1"
touch /etc/test.txt && echo "System file OK" || echo "ERROR2 for system file"
sleep 3600
