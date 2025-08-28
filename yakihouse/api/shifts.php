<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

$response = ['success' => false, 'message' => ''];
$request_method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);
$staffId = $input['staffId'] ?? $_GET['staffId'] ?? '';

if (empty($staffId)) {
    $response['message'] = 'ID nhân viên không được để trống.';
    echo json_encode($response);
    exit;
}

// Xử lý Check-in (POST)
if ($request_method === 'POST') {
    $stmt = $conn->prepare("SELECT ShiftID FROM Shifts WHERE StaffID = ? AND CheckOutTime IS NULL");
    $stmt->bind_param("s", $staffId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $response['message'] = 'Bạn đã check-in rồi.';
    } else {
        $stmt = $conn->prepare("INSERT INTO Shifts (StaffID, CheckInTime) VALUES (?, NOW())");
        $stmt->bind_param("s", $staffId);
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Check-in thành công!';
        } else {
            $response['message'] = 'Lỗi khi check-in: ' . $stmt->error;
        }
    }
    $stmt->close();
}
// Xử lý Check-out (PUT)
elseif ($request_method === 'PUT') {
    $stmt = $conn->prepare("UPDATE Shifts SET CheckOutTime = NOW() WHERE StaffID = ? AND CheckOutTime IS NULL ORDER BY CheckInTime DESC LIMIT 1");
    $stmt->bind_param("s", $staffId);
    if ($stmt->execute() && $stmt->affected_rows > 0) {
        $response['success'] = true;
        $response['message'] = 'Check-out thành công!';
    } else {
        $response['message'] = 'Bạn chưa check-in để check-out.';
    }
    $stmt->close();
}
// Kiểm tra trạng thái ca làm (GET)
elseif ($request_method === 'GET') {
    $stmt = $conn->prepare("SELECT ShiftID FROM Shifts WHERE StaffID = ? AND CheckOutTime IS NULL");
    $stmt->bind_param("s", $staffId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $response['success'] = true;
        $response['shiftStatus'] = 'checked-in';
    } else {
        $response['success'] = true;
        $response['shiftStatus'] = 'checked-out';
    }
    $stmt->close();
} else {
    $response['message'] = 'Phương thức yêu cầu không hợp lệ.';
}

$conn->close();
echo json_encode($response);
?>