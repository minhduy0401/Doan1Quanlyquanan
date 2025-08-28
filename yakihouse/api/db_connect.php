<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$DB_HOST = getenv('DB_HOST') ?: 'localhost';
$DB_USER = getenv('DB_USER') ?: 'root';
$DB_PASS = getenv('DB_PASS') ?: '';
$DB_NAME = getenv('DB_NAME') ?: 'yakihouse';
$DB_PORT = getenv('DB_PORT') ?: 3306;


try {
    $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, (int)$DB_PORT);

    // tránh lỗi ký tự tiếng Việt
    if (! $conn->set_charset('utf8mb4')) {
        $conn->query("SET NAMES utf8mb4");
    }
    $conn->query("SET collation_connection = 'utf8mb4_unicode_ci'");

} catch (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Không thể kết nối CSDL',
        'error'   => $e->getMessage(),
    ]);
    exit;
}

