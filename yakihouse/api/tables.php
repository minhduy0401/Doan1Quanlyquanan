<?php
require_once 'db_connect.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

// Lấy tất cả bàn
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM Tables");
    $tables = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $tables[] = $row;
        }
        $response['success'] = true;
        $response['tables'] = $tables;
    } else {
        $response['message'] = 'Không tìm thấy bàn nào.';
        $response['tables'] = [];
    }
}
// Cập nhật trạng thái bàn
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $tableID = $input['tableId'] ?? '';
    $status = $input['status'] ?? ''; // 'trống', 'occupied', 'ready-to-bill'

    if (empty($tableID) || empty($status)) {
        $response['message'] = 'Vui lòng cung cấp ID bàn và trạng thái.';
    } else {
        $stmt = $conn->prepare("UPDATE Tables SET ENUM = ? WHERE TableID = ?"); // ENUM == Trạng thái
        $stmt->bind_param("ss", $status, $tableID);
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Cập nhật trạng thái bàn thành công!';
        } else {
            $response['message'] = 'Lỗi khi cập nhật trạng thái bàn: ' . $stmt->error;
        }
        $stmt->close();
    }
}
else {
    $response['message'] = 'Phương thức yêu cầu không hợp lệ.';
}

echo json_encode($response);
$conn->close();
?>
