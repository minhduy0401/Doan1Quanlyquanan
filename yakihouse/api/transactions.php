<?php
require_once 'db_connect.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

// Lấy lịch sử giao dịch
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $startDate = $_GET['startDate'] ?? null;
    $endDate = $_GET['endDate'] ?? null;

    $query = "SELECT tr.*, t.Name as TableName FROM Transactions tr JOIN Orders o ON tr.OrderID = o.OrderID JOIN Tables t ON o.TableID = t.TableID";
    $params = [];
    $types = "";

    if ($startDate && $endDate) {
        $query .= " WHERE tr.Timestamp BETWEEN ? AND ?";
        $params[] = $startDate . " 00:00:00";
        $params[] = $endDate . " 23:59:59";
        $types .= "ss";
    } else if ($startDate) {
        $query .= " WHERE tr.Timestamp >= ?";
        $params[] = $startDate . " 00:00:00";
        $types .= "s";
    } else if ($endDate) {
        $query .= " WHERE tr.Timestamp <= ?";
        $params[] = $endDate . " 23:59:59";
        $types .= "s";
    }

    $query .= " ORDER BY tr.Timestamp DESC";

    $stmt = $conn->prepare($query);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    $transactions = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $transactions[] = $row;
        }
        $response['success'] = true;
        $response['transactions'] = $transactions;
    } else {
        $response['message'] = 'Không có giao dịch nào được ghi nhận.';
        $response['transactions'] = [];
    }
    $stmt->close();
}
// Xóa lịch sử giao dịch
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $conn->begin_transaction();
    try {
        $conn->query("DELETE FROM Transactions");

        $conn->commit();
        $response['success'] = true;
        $response['message'] = 'Lịch sử doanh thu đã được xóa thành công.';
    } catch (mysqli_sql_exception $exception) {
        $conn->rollback();
        $response['message'] = 'Lỗi khi xóa lịch sử doanh thu: ' . $exception->getMessage();
    }
}
else {
    $response['message'] = 'Phương thức yêu cầu không hợp lệ.';
}

echo json_encode($response);
$conn->close();
?>
