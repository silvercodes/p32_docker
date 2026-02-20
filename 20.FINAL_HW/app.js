const http = require('http');
const fs = require('fs');
const os = require('os');

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <p>Запущено от пользователя: ${os.userInfo().username}</p>
            <p>UID: ${os.userInfo().uid}</p>
            <p>GID: ${os.userInfo().gid}</p>
            <p>Hostname: ${os.hostname()}</p>
            <a href="/info">Информация о системе</a>
        `);
    } else if (req.url === '/info') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            user: os.userInfo(),
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus().length,
            totalMemory: os.totalmem(),
            freeMemory: os.freemem()
        }, null, 2));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен от: ${os.userInfo().username} (UID: ${os.userInfo().uid})`);
    console.log(`Сервер слушает порт ${PORT}`);
});