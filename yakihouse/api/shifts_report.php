<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$response = ['success' => false, 'message' => ''];
$request_method = $_SERVER['REQUEST_METHOD'];

if ($request_method === 'GET') {
    $startDate = $_GET['startDate'] ?? null;
    $endDate = $_GET['endDate'] ?? null;
    $staffId = $_GET['staffId'] ?? null;
    $role = $_GET['role'] ?? null;

    // Truy vấn SQL mới để lấy cả doanh thu
    $query = "
        SELECT 
            s.Name AS StaffName, 
            s.Code AS StaffCode, 
            sh.CheckInTime, 
            sh.CheckOutTime,
            COALESCE(SUM(t.Amount), 0) AS TotalRevenue
        FROM 
            Shifts sh
        JOIN 
            Staffs s ON sh.StaffID = s.StaffID
        LEFT JOIN
    Orders o ON sh.StaffID = o.StaffID
LEFT JOIN
    Transactions t ON o.OrderID = t.OrderID AND t.Timestamp BETWEEN sh.CheckInTime AND sh.CheckOutTime
    ";
    
    $params = [];
    $types = "";
    $whereClauses = [];

    // Thêm điều kiện lọc
    if ($startDate) {
        $whereClauses[] = "DATE(sh.CheckInTime) >= ?";
        $params[] = $startDate;
        $types .= "s";
    }
    if ($endDate) {
        $whereClauses[] = "DATE(sh.CheckOutTime) <= ?";
        $params[] = $endDate;
        $types .= "s";
    }

    // Lọc theo nhân viên nếu không phải quản lý
    if ($role !== 'Quản lý' && $staffId) {
        $whereClauses[] = "sh.StaffID = ?";
        $params[] = $staffId;
        $types .= "s";
    }

    // Kết hợp các điều kiện WHERE
    if (!empty($whereClauses)) {
        $query .= " WHERE " . implode(" AND ", $whereClauses);
    }

    $query .= "
        GROUP BY
            sh.ShiftID
        ORDER BY 
            sh.CheckInTime DESC
    ";

    $stmt = $conn->prepare($query);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    $shifts = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $shifts[] = $row;
        }
        $response['success'] = true;
        $response['shifts'] = $shifts;
    } else {
        $response['success'] = true;
        $response['message'] = 'Không có ca làm việc nào được ghi nhận.';
        $response['shifts'] = [];
    }
    $stmt->close();
} else {
    $response['message'] = 'Phương thức yêu cầu không hợp lệ.';
}

$conn->close();
echo json_encode($response);
?>