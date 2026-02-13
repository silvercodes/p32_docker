<?php

// phpinfo();
// exit;

header('Content-Type: application/json');

// DB config
$host = getenv('POSTGRES_HOST') ?: 'postgres-db';
$dbname = getenv('POSTGRES_DB') ?: 'php_app';
$user = getenv('POSTGRES_USER') ?: 'root';
$password = getenv('POSTGRES_PASSWORD') ?: 'rootpassword';

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);            // FIX: на паре объясню :-)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = trim($_SERVER['PATH_INFO'] ?? '', '/');

switch ($method) {
    case 'POST':
        if ($path === 'tasks') {
            $input = json_decode(file_get_contents('php://input'), true);

            $title = $input['title'] ?? '';
            $description = $input['description'] ?? '';

            if (empty($title)) {
                http_response_code(400);
                echo json_encode(['error' => 'Title is required']);
                break;
            }

            $stmt = $pdo->prepare("INSERT INTO tasks (title, description) VALUES(?, ?)");
            $stmt->execute([$title, $description]);
            $taskId = $pdo->lastInsertId();                         // FIX: было $taskId = $pdo->lastInsertedId();

            http_response_code(201);
            echo json_encode(['message' => 'Task created', 'id' => $taskId]);
        }
    break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}






