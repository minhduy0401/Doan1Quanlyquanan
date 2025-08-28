<?php
require_once 'db_connect.php';
header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];
$method = $_SERVER['REQUEST_METHOD'];

// GET: trả danh sách cho staff-script.js (trường y như frontend đang dùng)
if ($method === 'GET') {
  $result = $conn->query("SELECT StaffID, Name, Code, Position, Phone FROM staffs ORDER BY StaffID DESC");
  $rows = [];
  if ($result && $result->num_rows > 0) {
    while ($r = $result->fetch_assoc()) { $rows[] = $r; }
  }
  echo json_encode(['success' => true, 'staffs' => $rows]);
  exit;
}

// Helper đọc JSON body
$input = json_decode(file_get_contents('php://input'), true) ?? [];

// POST: thêm/cập nhật (frontend hiện đang dùng POST cho cả hai)
if ($method === 'POST') {
  $staffID  = $input['id'] ?? null;
  $name     = trim($input['name'] ?? '');
  $code     = trim($input['code'] ?? '');
  $password = (string)($input['password'] ?? '');
  $phone    = trim($input['phone'] ?? '');
  $position = trim($input['position'] ?? '');

  if ($name === '' || $code === '' || $position === '') {
    $response['message'] = 'Vui lòng điền đầy đủ thông tin nhân viên.';
    echo json_encode($response); exit;
  }

  // Code phải duy nhất
  if ($staffID) {
    $chk = $conn->prepare("SELECT StaffID FROM staffs WHERE Code = ? AND StaffID <> ?");
    $chk->bind_param("ss", $code, $staffID);
  } else {
    $chk = $conn->prepare("SELECT StaffID FROM staffs WHERE Code = ?");
    $chk->bind_param("s", $code);
  }
  $chk->execute();
  $exists = $chk->get_result()->num_rows > 0;
  $chk->close();
  if ($exists) { echo json_encode(['success'=>false,'message'=>'Mã nhân viên đã tồn tại.']); exit; }

  if ($staffID) {
    // Update
    if ($password !== '') {
      if (strlen($password) < 6) { echo json_encode(['success'=>false,'message'=>'Mật khẩu tối thiểu 6 ký tự']); exit; }
      $hash = password_hash($password, PASSWORD_BCRYPT);
      $stmt = $conn->prepare("UPDATE staffs SET Name=?, Code=?, Password=?, Position=?, Phone=? WHERE StaffID=?");
      $stmt->bind_param("ssssss", $name, $code, $hash, $position, $phone, $staffID);
    } else {
      $stmt = $conn->prepare("UPDATE staffs SET Name=?, Code=?, Position=?, Phone=? WHERE StaffID=?");
      $stmt->bind_param("sssss", $name, $code, $position, $phone, $staffID);
    }
    if ($stmt->execute()) {
      echo json_encode(['success'=>true,'message'=>'Cập nhật nhân viên thành công!']); 
    } else {
      echo json_encode(['success'=>false,'message'=>'Lỗi khi cập nhật nhân viên: '.$stmt->error]); 
    }
    $stmt->close();
    exit;
  } else {
    // Create
    if ($password === '' || strlen($password) < 6) { echo json_encode(['success'=>false,'message'=>'Mật khẩu tối thiểu 6 ký tự']); exit; }
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $newStaffID = 'nv'.uniqid();
    $stmt = $conn->prepare("INSERT INTO staffs (StaffID, Name, Code, Password, Position, Phone) VALUES (?,?,?,?,?,?)");
    $stmt->bind_param("ssssss", $newStaffID, $name, $code, $hash, $position, $phone);
    if ($stmt->execute()) {
      echo json_encode(['success'=>true,'message'=>'Thêm nhân viên thành công!']);
    } else {
      echo json_encode(['success'=>false,'message'=>'Lỗi khi thêm nhân viên: '.$stmt->error]);
    }
    $stmt->close();
    exit;
  }
}

// DELETE
if ($method === 'DELETE') {
  $staffID = $input['id'] ?? '';
  if ($staffID === '') { echo json_encode(['success'=>false,'message'=>'Vui lòng cung cấp ID nhân viên để xóa.']); exit; }

  // Không cho xóa nếu có Order liên quan
  $check = $conn->prepare("SELECT COUNT(*) AS cnt FROM orders WHERE StaffID = ?");
  $check->bind_param("s", $staffID);
  $check->execute();
  $cnt = $check->get_result()->fetch_assoc()['cnt'] ?? 0;
  $check->close();

  if ((int)$cnt > 0) {
    echo json_encode(['success'=>false,'message'=>'Không thể xóa nhân viên này vì có đơn hàng liên quan.']); exit;
  }

  $stmt = $conn->prepare("DELETE FROM staffs WHERE StaffID = ?");
  $stmt->bind_param("s", $staffID);
  if ($stmt->execute()) echo json_encode(['success'=>true,'message'=>'Xóa nhân viên thành công!']);
  else echo json_encode(['success'=>false,'message'=>'Lỗi khi xóa nhân viên: '.$stmt->error]);
  $stmt->close(); exit;
}

// PUT: đổi mật khẩu
if ($method === 'PUT') {
  $action  = $input['action'] ?? '';
  if ($action !== 'change_password') { echo json_encode(['success'=>false,'message'=>'Action không hợp lệ']); exit; }

  $staffID = $input['staffId'] ?? '';
  $current = (string)($input['currentPassword'] ?? '');
  $new     = (string)($input['newPassword'] ?? '');

  if ($staffID === '' || strlen($new) < 6) {
    echo json_encode(['success'=>false,'message'=>'Dữ liệu đổi mật khẩu không hợp lệ']); exit;
  }

  $st = $conn->prepare("SELECT Password FROM staffs WHERE StaffID = ?");
  $st->bind_param("s", $staffID);
  $st->execute();
  $res = $st->get_result();
  if ($res->num_rows === 0) { echo json_encode(['success'=>false,'message'=>'Không tìm thấy nhân viên']); exit; }
  $row = $res->fetch_assoc(); $st->close();

  $stored  = (string)$row['Password'];
  $is_hash = str_starts_with($stored, '$2y$') || str_starts_with($stored, '$argon2id$');
  $ok      = $is_hash ? password_verify($current, $stored) : hash_equals($stored, $current);

  if (!$ok) { echo json_encode(['success'=>false,'message'=>'Mật khẩu hiện tại không đúng']); exit; }

  $newHash = password_hash($new, PASSWORD_BCRYPT);
  $upd = $conn->prepare("UPDATE staffs SET Password = ? WHERE StaffID = ?");
  $upd->bind_param("ss", $newHash, $staffID);
  $upd->execute();
  $upd->close();

  echo json_encode(['success'=>true,'message'=>'Đổi mật khẩu thành công']); exit;
}

echo json_encode(['success'=>false,'message'=>'Method không hỗ trợ']);
