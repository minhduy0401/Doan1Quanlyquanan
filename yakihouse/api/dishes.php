<?php
require_once 'db_connect.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

$request_method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

error_log("dishes.php - Request Method: " . $request_method);
error_log("dishes.php - Input data: " . print_r($input, true));

switch ($request_method) {
    case 'POST': // Thêm món ăn mới
        $name = $input['name'] ?? '';
        $price = $input['price'] ?? 0;
        $category = $input['category'] ?? '';
        $imageBase64 = $input['image'] ?? ''; 

        if (empty($name) || empty($price) || empty($category) || empty($imageBase64)) {
            $response['message'] = 'Vui lòng điền đầy đủ thông tin món ăn.';
            error_log("dishes.php POST error: Missing required fields (name, price, category, image).");
            break;
        }

        $imagePath = null;
        $filePath = null; 

        if (!empty($imageBase64)) {
          
            if (strpos($imageBase64, ',') !== false) {
                list($type, $data) = explode(';', $imageBase64);
                list(, $data) = explode(',', $data);
            } else {
               
                $data = $imageBase64;
                $type = 'image/png'; 
            }
            
            $data = base64_decode($data);

            // Xác định loại ảnh và đuôi file
            $fileExtension = 'png'; 
            if (strpos($type, 'jpeg') !== false || strpos($type, 'jpg') !== false) {
                $fileExtension = 'jpg';
            } else if (strpos($type, 'png') !== false) {
                $fileExtension = 'png';
            } else if (strpos($type, 'gif') !== false) {
                $fileExtension = 'gif';
            }
            
            $fileName = uniqid() . '.' . $fileExtension;
            // Đường dẫn lưu file trên server (tương đối từ file dishes.php)
            $uploadDir = '../image/uploaded_dishes/'; 
            
            // Tạo thư mục nếu chưa tồn tại
            if (!is_dir($uploadDir)) {
                if (!mkdir($uploadDir, 0777, true)) { 
                    $response['message'] = 'Lỗi khi tạo thư mục lưu ảnh. Vui lòng kiểm tra quyền.';
                    error_log("dishes.php POST error: Failed to create upload directory " . $uploadDir);
                    break; 
                }
            }

            $filePath = $uploadDir . $fileName; 
            
            
            if (file_put_contents($filePath, $data)) {
                $imagePath = 'image/uploaded_dishes/' . $fileName; 
                error_log("dishes.php POST: Image saved to " . $filePath);
            } else {
                $response['message'] = 'Lỗi khi lưu file ảnh. Vui lòng kiểm tra quyền ghi của thư mục.';
                error_log("dishes.php POST error: Failed to save image file to " . $filePath);
                break;
            }
        }

        $dishID = 'd' . uniqid(); // Tạo ID cho món ăn
        $stmt = $conn->prepare("INSERT INTO Dishes (DishID, Name, Price, Category, ImagePath) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdss", $dishID, $name, $price, $category, $imagePath);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Món ăn đã được thêm thành công!';
        } else {
            $response['message'] = 'Lỗi khi thêm món ăn vào cơ sở dữ liệu: ' . $stmt->error;
            error_log("dishes.php POST error: SQL error when inserting dish: " . $stmt->error);
            
            if ($filePath && file_exists($filePath)) {
                unlink($filePath);
                error_log("dishes.php POST: Deleted duplicate image file due to DB insertion error: " . $filePath);
            }
        }
        $stmt->close();
        break;

    case 'GET': // Lấy danh sách món ăn
        $stmt = $conn->prepare("SELECT DishID, Name, Price, Category, ImagePath FROM Dishes ORDER BY Name ASC");
        $stmt->execute();
        $result = $stmt->get_result();
        $dishes = [];
        while ($row = $result->fetch_assoc()) {
            $dishes[] = $row;
        }
        $response['success'] = true;
        $response['dishes'] = $dishes;
        $stmt->close();
        error_log("dishes.php GET: Fetched " . count($dishes) . " dishes.");
        break;

    case 'PUT': // Cập nhật giá món ăn
        $id = $input['id'] ?? '';
        $price = $input['price'] ?? 0;

        if (empty($id) || $price <= 0) {
            $response['message'] = 'Thiếu ID món ăn hoặc giá không hợp lệ.';
            error_log("dishes.php PUT error: Missing ID or invalid price.");
            break;
        }

        $stmt = $conn->prepare("UPDATE Dishes SET Price = ? WHERE DishID = ?");
        $stmt->bind_param("ds", $price, $id); 

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Giá món ăn đã được cập nhật thành công!';
        } else {
            $response['message'] = 'Lỗi khi cập nhật giá món ăn: ' . $stmt->error;
            error_log("dishes.php PUT error: SQL error when updating dish price: " . $stmt->error);
        }
        $stmt->close();
        break;

    case 'DELETE': // Xóa món ăn
        $id = $input['id'] ?? '';

        if (empty($id)) {
            $response['message'] = 'Thiếu ID món ăn để xóa.';
            error_log("dishes.php DELETE error: Missing ID.");
            break;
        }

      
        $stmt = $conn->prepare("SELECT ImagePath FROM Dishes WHERE DishID = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $dishToDelete = $result->fetch_assoc();
        $stmt->close();

        if ($dishToDelete && !empty($dishToDelete['ImagePath'])) {
            $fullImagePath = '../' . $dishToDelete['ImagePath']; 
            if (file_exists($fullImagePath)) {
                if (unlink($fullImagePath)) {
                    error_log("dishes.php DELETE: Image file deleted: " . $fullImagePath);
                } else {
                    error_log("dishes.php DELETE WARNING: Failed to delete image file: " . $fullImagePath . ". Check permissions.");
                }
            } else {
                error_log("dishes.php DELETE WARNING: Image file not found on disk: " . $fullImagePath . ". It might have been deleted manually or path is wrong.");
            }
        }


        $stmt = $conn->prepare("DELETE FROM Dishes WHERE DishID = ?");
        $stmt->bind_param("s", $id);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Món ăn đã được xóa thành công!';
        } else {
            $response['message'] = 'Lỗi khi xóa món ăn: ' . $stmt->error;
            error_log("dishes.php DELETE error: SQL error when deleting dish: " . $stmt->error);
        }
        $stmt->close();
        break;

    default:
        $response['message'] = 'Phương thức yêu cầu không hợp lệ.';
        error_log("dishes.php ERROR: Invalid request method: " . $request_method);
        break;
}

echo json_encode($response);
$conn->close();
?>
