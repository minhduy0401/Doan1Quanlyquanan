<?php
require_once 'db_connect.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';

    error_log("Received POST action: " . $action);
    error_log("Full POST input: " . print_r($input, true)); 

    if ($action === 'create_or_update') {
        $tableID = $input['tableId'] ?? '';
        $staffID = $input['staffId'] ?? '';
        $orderItems = $input['items'] ?? [];
        $subtotal = $input['subtotal'] ?? 0;
        $discountPercent = $input['discountPercent'] ?? 0;
        $total = $input['total'] ?? 0;
        $orderID = $input['orderId'] ?? null; 

        error_log("create_or_update params: TableID=" . $tableID . ", StaffID=" . $staffID . ", OrderID=" . ($orderID ?? 'NULL') . ", Subtotal=" . $subtotal . ", Discount=" . $discountPercent . ", Total=" . $total);
        error_log("Order Items sent: " . json_encode($orderItems));

        if (empty($tableID) || empty($staffID)) {
            $response['message'] = 'Thiếu thông tin bàn hoặc nhân viên.';
            error_log("ERROR: Missing tableID or staffID in create_or_update.");
            echo json_encode($response);
            exit();
        }

        $conn->begin_transaction(); // Bắt đầu giao dịch

        try {
            if ($orderID) { 
                $stmt = $conn->prepare("UPDATE Orders SET Subtotal = ?, DiscountPercent = ?, Total = ?, ENUM = ? WHERE OrderID = ?");
                $status = !empty($orderItems) ? 'open' : 'cancelled';
                $stmt->bind_param("dddss", $subtotal, $discountPercent, $total, $status, $orderID);
                $stmt->execute();
                $stmt->close();
                error_log("Updated Order: OrderID=" . $orderID . ", Status=" . $status);

                $stmt = $conn->prepare("DELETE FROM OrderItems WHERE OrderID = ?");
                $stmt->bind_param("s", $orderID);
                $stmt->execute();
                $stmt->close();
                error_log("Deleted old OrderItems for OrderID=" . $orderID);

            } else { // Tạo đơn hàng mới
                $orderID = 'ord' . uniqid(); 
                
                $stmt = $conn->prepare("INSERT INTO Orders (OrderID, TableID, StaffID, Subtotal, DiscountPercent, Total) VALUES (?, ?, ?, ?, ?, ?)"); // Dòng 55 đã sửa
                $stmt->bind_param("sssddd", $orderID, $tableID, $staffID, $subtotal, $discountPercent, $total); // Dòng 56 đã sửa
                $stmt->execute();
                $stmt->close();
                error_log("Created new Order: OrderID=" . $orderID);
            }

            // Thêm lại các món ăn vào OrderItems
            foreach ($orderItems as $item) {
                $dishID = $item['id'];
                $quantity = $item['quantity'];
                $unitPrice = $item['price'];

                $stmt = $conn->prepare("INSERT INTO OrderItems (OrderID, DishID, Quantity, UnitPrice) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("ssis", $orderID, $dishID, $quantity, $unitPrice);
                $stmt->execute();
                $stmt->close();
                error_log("Added OrderItem: OrderID=" . $orderID . ", DishID=" . $dishID . ", Quantity=" . $quantity . ", Price=" . $unitPrice);
            }

            // Cập nhật trạng thái bàn
            $tableStatus = !empty($orderItems) ? 'occupied' : 'trống';

            $currentTableStatus = $conn->prepare("SELECT ENUM FROM Tables WHERE TableID = ?");
            $currentTableStatus->bind_param("s", $tableID);
            $currentTableStatus->execute();
            $resultTableStatus = $currentTableStatus->get_result()->fetch_assoc();
            $currentTableStatus->close();

            if ($resultTableStatus && $resultTableStatus['ENUM'] === 'ready-to-bill') {
                 error_log("Table " . $tableID . " is ready-to-bill, status not changed to occupied.");
            } else {
                $stmt = $conn->prepare("UPDATE Tables SET ENUM = ? WHERE TableID = ?");
                $stmt->bind_param("ss", $tableStatus, $tableID);
                $stmt->execute();
                $stmt->close();
                error_log("Updated Table status to " . $tableStatus . " for TableID=" . $tableID);
            }

            $conn->commit();
            $response['success'] = true;
            $response['message'] = 'Đơn hàng đã được lưu thành công!';
            $response['orderId'] = $orderID;

        } catch (mysqli_sql_exception $exception) {
            $conn->rollback();
            $response['message'] = 'Lỗi khi lưu đơn hàng: ' . $exception->getMessage();
            error_log("Transaction failed for create_or_update: " . $exception->getMessage(), 0);
        }

    } else if ($action === 'get_order') {
        $tableID = $input['tableId'] ?? '';
        error_log("get_order: TableID=" . $tableID);

        if (empty($tableID)) {
            $response['message'] = 'Thiếu ID bàn.';
            error_log("ERROR: Missing tableID in get_order.");
            echo json_encode($response);
            exit();
        }

        $stmt = $conn->prepare("SELECT OrderID, TableID, CreatedAt, ENUM, Subtotal, DiscountPercent, Total, StaffID FROM Orders WHERE TableID = ? AND ENUM = 'open' LIMIT 1");
        $stmt->bind_param("s", $tableID);
        $stmt->execute();
        $result = $stmt->get_result();
        $order = null;
        if ($result->num_rows > 0) {
            $order = $result->fetch_assoc();
            $order['items'] = [];
            $stmt_items = $conn->prepare("SELECT oi.DishID as id, d.Name as name, oi.Quantity as quantity, oi.UnitPrice as price FROM OrderItems oi JOIN Dishes d ON oi.DishID = d.DishID WHERE oi.OrderID = ?");
            $stmt_items->bind_param("s", $order['OrderID']);
            $stmt_items->execute();
            $items_result = $stmt_items->get_result();
            while ($item = $items_result->fetch_assoc()) {
                $item['price'] = (float)$item['price'];
                $order['items'][] = $item;
            }
            $stmt_items->close();
            error_log("Order fetched for table " . $tableID . ": " . print_r($order, true));
        } else {
            error_log("No open order found for TableID: " . $tableID);
        }
        $stmt->close();

        if ($order) {
            $response['success'] = true;
            $response['order'] = $order;
        } else {
            $response['message'] = 'Không tìm thấy đơn hàng cho bàn này.';
            $response['order'] = null;
        }
    } else if ($action === 'cancel_order') {
        $tableID = $input['tableId'] ?? '';
        error_log("cancel_order: TableID=" . $tableID);

        if (empty($tableID)) {
            $response['message'] = 'Thiếu ID bàn.';
            error_log("ERROR: Missing tableID in cancel_order.");
            echo json_encode($response);
            exit();
        }

        $conn->begin_transaction();
        try {
            $stmt = $conn->prepare("SELECT OrderID FROM Orders WHERE TableID = ? AND ENUM = 'open' LIMIT 1");
            $stmt->bind_param("s", $tableID);
            $stmt->execute();
            $result = $stmt->get_result();
            $order = $result->fetch_assoc();
            $stmt->close();

            if ($order) {
                $orderID = $order['OrderID'];

                $stmt = $conn->prepare("DELETE FROM OrderItems WHERE OrderID = ?");
                $stmt->bind_param("s", $orderID);
                $stmt->execute();
                $stmt->close();
                error_log("Deleted OrderItems for OrderID=" . $orderID);

                $stmt = $conn->prepare("DELETE FROM Orders WHERE OrderID = ?");
                $stmt->bind_param("s", $orderID);
                $stmt->execute();
                $stmt->close();
                error_log("Deleted Order for OrderID=" . $orderID);

                $stmt = $conn->prepare("UPDATE Tables SET ENUM = 'trống' WHERE TableID = ?");
                $stmt->bind_param("s", $tableID);
                $stmt->execute();
                $stmt->close();
                error_log("Updated Table status to 'trống' for TableID=" . $tableID);

                $conn->commit();
                $response['success'] = true;
                $response['message'] = 'Đơn hàng đã được hủy thành công.';
            } else {
                $response['message'] = 'Không tìm thấy đơn hàng đang mở cho bàn này.';
                error_log("WARNING: No open order found to cancel for TableID: " . $tableID);
            }
        } catch (mysqli_sql_exception $exception) {
            $conn->rollback();
            $response['message'] = 'Lỗi khi hủy đơn hàng: ' . $exception->getMessage();
            error_log("ERROR: Transaction failed for cancel_order: " . $exception->getMessage());
        }
    } else if ($action === 'checkout') {
        $tableID = $input['tableId'] ?? '';
        $orderID = $input['orderId'] ?? '';
        $finalAmount = $input['total'] ?? 0;
        $staffID = $input['staffId'] ?? '';

        error_log("checkout params: TableID=" . $tableID . ", OrderID=" . $orderID . ", Total=" . $finalAmount . ", StaffID=" . $staffID);

        if (empty($tableID) || empty($orderID) || $finalAmount <= 0 || empty($staffID)) {
            $response['message'] = 'Thiếu thông tin để thanh toán.';
            error_log("ERROR: Checkout validation failed: Missing tableID, orderID, finalAmount, or staffID. Provided: tableID=" . ($tableID ?? 'NULL') . ", orderID=" . ($orderID ?? 'NULL') . ", total=" . $finalAmount . ", staffID=" . ($staffID ?? 'NULL'));
            echo json_encode($response);
            exit();
        }

        $conn->begin_transaction();
        try {
            $stmt = $conn->prepare("UPDATE Orders SET ENUM = 'paid' WHERE OrderID = ?");
            $stmt->bind_param("s", $orderID);
            $stmt->execute();
            $stmt->close();
            error_log("Updated Order status to 'paid' for OrderID=" . $orderID);

            $transactionID = 'trans' . uniqid();
            $stmt = $conn->prepare("INSERT INTO Transactions (TransactionID, OrderID, Amount, Timestamp) VALUES (?, ?, ?, NOW())");
            $stmt->bind_param("ssd", $transactionID, $orderID, $finalAmount);
            $stmt->execute();
            $stmt->close();
            error_log("Inserted Transaction: TransactionID=" . $transactionID . ", Amount=" . $finalAmount);

            $stmt = $conn->prepare("UPDATE Tables SET ENUM = 'trống' WHERE TableID = ?");
            $stmt->bind_param("s", $tableID);
            $stmt->execute();
            $stmt->close();
            error_log("Updated Table status to 'trống' for TableID=" . $tableID);

            $conn->commit();
            $response['success'] = true;
            $response['message'] = 'Thanh toán thành công!';

        } catch (mysqli_sql_exception $exception) {
            $conn->rollback();
            $response['message'] = 'Lỗi khi thanh toán: ' . $exception->getMessage();
            error_log("ERROR: Transaction failed for checkout: " . $exception->getMessage());
        }
    }

} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $statusFilter = $_GET['status'] ?? null;
    $query = "SELECT o.*, t.Name as TableName, s.Name as StaffName FROM Orders o JOIN Tables t ON o.TableID = t.TableID JOIN Staffs s ON o.StaffID = s.StaffID";
    $params = [];
    $types = "";

    if ($statusFilter) {
        $query .= " WHERE o.ENUM = ?";
        $params[] = $statusFilter;
        $types .= "s";
    }

    $query .= " ORDER BY o.CreatedAt DESC";

    $stmt = $conn->prepare($query);
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    $response['success'] = true;
    $response['orders'] = $orders;
    $stmt->close();
    error_log("Fetched orders with status filter " . ($statusFilter ?? 'None') . ": " . count($orders) . " orders found.");

} else {
    $response['message'] = 'Phương thức yêu cầu không hợp lệ.';
    error_log("ERROR: Invalid request method: " . $_SERVER['REQUEST_METHOD']);
}

echo json_encode($response);
$conn->close();
?>
