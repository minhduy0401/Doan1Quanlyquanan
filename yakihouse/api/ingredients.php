<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';

    // Lấy danh sách nguyên liệu
    if ($action === '' || $action === 'get_ingredients') {
        $sql = "SELECT * FROM ingredients ORDER BY name ASC";
        $result = $conn->query($sql);
        $ingredients = [];
        while ($row = $result->fetch_assoc()) {
            $ingredients[] = $row;
        }
        echo json_encode(['success' => true, 'ingredients' => $ingredients]);
        exit;
    }

    // Lấy lịch sử nhập/xuất kho
    if ($action === 'get_logs') {
        $sql = "SELECT l.id, i.name AS ingredient_name, i.unit, l.type, l.quantity, l.timestamp, l.note
                FROM ingredient_logs l
                JOIN ingredients i ON l.ingredient_id = i.id
                ORDER BY l.timestamp DESC";
        $result = $conn->query($sql);
        $logs = [];
        while ($row = $result->fetch_assoc()) {
            $logs[] = $row;
        }
        echo json_encode(['success' => true, 'logs' => $logs]);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $name   = trim($_POST['ingredient_name'] ?? '');
    $unit   = trim($_POST['ingredient_unit'] ?? '');
    $qty    = floatval($_POST['quantity'] ?? 0);
    $note   = trim($_POST['note'] ?? '');

    // Xoá log
    if (isset($_GET['action']) && $_GET['action'] === 'delete_log') {
        $id = intval($_GET['id']);
        $stmt = $conn->prepare("DELETE FROM ingredient_logs WHERE id=?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        echo json_encode(['success' => true]);
        exit;
    }

    if (!$name || $qty <= 0) {
        echo json_encode(['success' => false, 'message' => 'Tên nguyên liệu và số lượng không hợp lệ']);
        exit;
    }

    // Tìm nguyên liệu
    $stmt = $conn->prepare("SELECT * FROM ingredients WHERE name=? LIMIT 1");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($row = $res->fetch_assoc()) {
        $ingredient_id = $row['id'];
        $current_qty   = floatval($row['quantity']);

        if ($action === 'add') {
            $newQty = $current_qty + $qty;
            $type = 'import';
        } else {
            $newQty = max(0, $current_qty - $qty);
            $type = 'export';
        }

        // Cập nhật số lượng
        $up = $conn->prepare("UPDATE ingredients SET quantity=? WHERE id=?");
        $up->bind_param("di", $newQty, $ingredient_id);
        $up->execute();

        // Ghi log
        $log = $conn->prepare("INSERT INTO ingredient_logs (ingredient_id, type, quantity, note) VALUES (?, ?, ?, ?)");
        $log->bind_param("isds", $ingredient_id, $type, $qty, $note);
        $log->execute();

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Không tìm thấy nguyên liệu']);
    }
    exit;
}
