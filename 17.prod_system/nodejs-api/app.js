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

const upload = multer({storage: storage});

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

app.post('/upload', upload.single('file'), async(req, res) => {
    try {
        if (! req.file) {
            return res.status(400).json({error: 'No file uploaded'});
        }

        const connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'INSERT INTO files (filename, original_name) VALUES (?, ?)',
            [req.file.filename, req.file.originalname]
        );

        await connection.end();

        res.json({
            message: 'File uploaded successfully',
            fileId: result.insertId,
            filename: req.file.filename,
        });
    } catch (error) {
        console.log(`Uploaded error: ${error}`);
        res.status(500).json({error: 'Uploaded failed'});
    }
});

app.get('/files', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.execute('SELECT * FROM files ORDER BY upload_time DESC');

        await connection.end();

    res.json(rows);
    } catch (error) {
        console.log(`Error fetching files: ${error}`);
        res.status(500).json({error: 'Failed to fetch files list'});
    }
});

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join('/app/files', filename);

    if (! fs.existsSync(filePath)) {
        res.status(404).json({error: 'File not found'});
    }

    res.download(filePath);
});


app.listen(port, () => {
    console.log('🟢', `File server started at port ${port}`);
});



