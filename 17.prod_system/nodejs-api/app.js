const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');

const path = require('path')
const fs = require('fs');

const port = process.env.NODE_API_PORT || 3000;

const app = express();
app.use(express.json());

// Настройка хранилища multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = '/app/files';
        if (! fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath)
        }

        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Настройка БД
const dbConfig = {
    host: process.env.MYSQL_HOST || 'mysql-db',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || 'rootpassword',
    database: process.env.MYSQL_DB || 'file_server_db'
};


app.get('/', (req, res) => {
    res.json({
        message: 'NodeJS API works!!!',
    });
});


app.listen(port, () => {
    console.log('🟢', `File server started at port ${port}`);
});



