<?php
require_once 'db_connect.php';
header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  $response['message'] = 'Phương thức yêu cầu không hợp lệ.';
  echo json_encode($response); exit;
}

$input    = json_decode(file_get_contents('php://input'), true);
$code     = trim($input['code'] ?? '');
$password = $input['password'] ?? '';

if ($code === '' || $password === '') {
  $response['message'] = 'Vui lòng nhập mã nhân viên và mật khẩu.';
  echo json_encode($response); exit;
}


$stmt = $conn->prepare("SELECT StaffID, Name, Position, Password, Code, Phone FROM staffs WHERE Code = ?");
$stmt->bind_param("s", $code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
  $response['message'] = 'Mã nhân viên không tồn tại.';
  echo json_encode($response); exit;
}

$user    = $result->fetch_assoc();
$stored  = (string)$user['Password'];
$is_hash = str_starts_with($stored, '$2y$') || str_starts_with($stored, '$argon2id$');

$valid = $is_hash ? password_verify($password, $stored) : hash_equals($stored, $password);

if (!$valid) {
  $response['message'] = 'Mật khẩu không đúng.';
  echo json_encode($response); exit;
}

// plaintext -> migrate sang hash an toàn (dùng bcrypt)
if (!$is_hash) {
  $newHash = password_hash($password, PASSWORD_BCRYPT);
  $upd = $conn->prepare("UPDATE staffs SET Password = ? WHERE StaffID = ?");
  $upd->bind_param("ss", $newHash, $user['StaffID']);
  $upd->execute();
} else {
  if (password_needs_rehash($stored, PASSWORD_BCRYPT)) {
    $newHash = password_hash($password, PASSWORD_BCRYPT);
    $upd = $conn->prepare("UPDATE staffs SET Password = ? WHERE StaffID = ?");
    $upd->bind_param("ss", $newHash, $user['StaffID']);
    $upd->execute();
  }
}

$response['success'] = true;
$response['message'] = 'Đăng nhập thành công!';
$response['user'] = [
  'id'       => $user['StaffID'],
  'name'     => $user['Name'],
  'code'     => $user['Code'],
  'position' => $user['Position'],
  'role'     => $user['Position'],
  'phone'    => $user['Phone'] ?? null
];

echo json_encode($response);
$stmt->close();
$conn->close();
