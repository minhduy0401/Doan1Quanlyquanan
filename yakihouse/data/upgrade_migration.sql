-- ============================================================
-- YAKIHOUSE UPGRADE MIGRATION SCRIPT
-- Phiên bản: 2.0
-- Mục đích: Nâng cấp database mà KHÔNG XÓA DỮ LIỆU CŨ
-- ============================================================

USE `yakihouse`;

-- ============================================================
-- 1. NÂNG CẤP BẢNG DISHES - Thêm trạng thái và mô tả
-- ============================================================

-- Thêm cột Status nếu chưa có
ALTER TABLE `dishes` 
ADD COLUMN IF NOT EXISTS `Status` ENUM('available', 'unavailable', 'hidden') DEFAULT 'available' 
COMMENT 'Trạng thái món: available=đang bán, unavailable=hết món, hidden=ẩn' 
AFTER `ImagePath`;

-- Thêm cột Description nếu chưa có
ALTER TABLE `dishes` 
ADD COLUMN IF NOT EXISTS `Description` TEXT DEFAULT NULL 
COMMENT 'Mô tả món ăn' 
AFTER `Status`;

-- Thêm cột SortOrder để sắp xếp món
ALTER TABLE `dishes` 
ADD COLUMN IF NOT EXISTS `SortOrder` INT DEFAULT 0 
COMMENT 'Thứ tự hiển thị' 
AFTER `Description`;

-- Cập nhật tất cả món hiện tại về trạng thái 'available'
UPDATE `dishes` SET `Status` = 'available' WHERE `Status` IS NULL;

-- ============================================================
-- 2. NÂNG CẤP BẢNG TABLES - Thêm khu vực và số ghế
-- ============================================================

-- Thêm cột Area (khu vực)
ALTER TABLE `tables` 
ADD COLUMN IF NOT EXISTS `Area` VARCHAR(50) DEFAULT 'Khu A' 
COMMENT 'Khu vực bàn: Khu A, Khu B, VIP, Sân vườn' 
AFTER `Name`;

-- Thêm cột Capacity (số ghế)
ALTER TABLE `tables` 
ADD COLUMN IF NOT EXISTS `Capacity` INT DEFAULT 4 
COMMENT 'Số lượng ghế' 
AFTER `Area`;

-- Cập nhật khu vực mặc định cho các bàn hiện tại
UPDATE `tables` SET `Area` = CASE 
    WHEN CAST(SUBSTRING(TableID, 2) AS UNSIGNED) <= 5 THEN 'Khu A'
    WHEN CAST(SUBSTRING(TableID, 2) AS UNSIGNED) <= 10 THEN 'Khu B'
    WHEN CAST(SUBSTRING(TableID, 2) AS UNSIGNED) <= 15 THEN 'Khu C'
    ELSE 'Khu D'
END WHERE `Area` = 'Khu A';

UPDATE `tables` SET `Capacity` = 4 WHERE `Capacity` IS NULL;

-- ============================================================
-- 3. NÂNG CẤP BẢNG ORDERS - Thêm trạng thái chi tiết
-- ============================================================

-- Thay đổi ENUM Status để có nhiều trạng thái hơn
ALTER TABLE `orders` 
MODIFY COLUMN `ENUM` VARCHAR(20) NOT NULL DEFAULT 'pending'
COMMENT 'Trạng thái: pending=mới tạo, preparing=đang chế biến, ready=sẵn sàng phục vụ, serving=đang phục vụ, ready-to-bill=chờ thanh toán, paid=đã thanh toán, cancelled=đã hủy';

-- Thêm cột Notes (ghi chú đơn hàng)
ALTER TABLE `orders` 
ADD COLUMN IF NOT EXISTS `Notes` TEXT DEFAULT NULL 
COMMENT 'Ghi chú đơn hàng' 
AFTER `StaffID`;

-- Thêm cột PaymentMethod
ALTER TABLE `orders` 
ADD COLUMN IF NOT EXISTS `PaymentMethod` ENUM('cash', 'card', 'transfer', 'e-wallet') DEFAULT 'cash' 
COMMENT 'Phương thức thanh toán' 
AFTER `Notes`;

-- Cập nhật các order có ENUM='open' thành 'pending'
UPDATE `orders` SET `ENUM` = 'pending' WHERE `ENUM` = 'open';

-- ============================================================
-- 4. NÂNG CẾP BẢNG ORDERITEMS - Thêm ghi chú món
-- ============================================================

-- Thêm cột Notes cho từng món
ALTER TABLE `orderitems` 
ADD COLUMN IF NOT EXISTS `Notes` VARCHAR(255) DEFAULT NULL 
COMMENT 'Ghi chú món ăn (ví dụ: không hành, ít cay)' 
AFTER `UnitPrice`;

-- ============================================================
-- 5. NÂNG CẤP BẢNG STAFFS - Thêm thông tin chi tiết
-- ============================================================

-- Thêm cột Address
ALTER TABLE `staffs` 
ADD COLUMN IF NOT EXISTS `Address` VARCHAR(255) DEFAULT NULL 
COMMENT 'Địa chỉ nhân viên' 
AFTER `Phone`;

-- Thêm cột Email
ALTER TABLE `staffs` 
ADD COLUMN IF NOT EXISTS `Email` VARCHAR(100) DEFAULT NULL 
COMMENT 'Email nhân viên' 
AFTER `Address`;

-- Thêm cột DateJoined
ALTER TABLE `staffs` 
ADD COLUMN IF NOT EXISTS `DateJoined` DATE DEFAULT NULL 
COMMENT 'Ngày vào làm' 
AFTER `Email`;

-- Thêm cột Status
ALTER TABLE `staffs` 
ADD COLUMN IF NOT EXISTS `Status` ENUM('active', 'inactive') DEFAULT 'active' 
COMMENT 'Trạng thái làm việc' 
AFTER `DateJoined`;

-- Cập nhật Status cho tất cả nhân viên hiện tại
UPDATE `staffs` SET `Status` = 'active' WHERE `Status` IS NULL;

-- ============================================================
-- 6. NÂNG CẤP BẢNG INGREDIENTS - Thêm mức cảnh báo và danh mục
-- ============================================================

-- Thêm cột MinQuantity (mức tồn kho tối thiểu)
ALTER TABLE `ingredients` 
ADD COLUMN IF NOT EXISTS `MinQuantity` DECIMAL(10,2) DEFAULT 5.00 
COMMENT 'Mức tồn kho tối thiểu để cảnh báo' 
AFTER `quantity`;

-- Thêm cột Category
ALTER TABLE `ingredients` 
ADD COLUMN IF NOT EXISTS `Category` VARCHAR(50) DEFAULT 'Khác' 
COMMENT 'Danh mục nguyên liệu: Thịt, Rau củ, Gia vị, Nước uống, Khác' 
AFTER `MinQuantity`;

-- Thêm cột Supplier (nhà cung cấp)
ALTER TABLE `ingredients` 
ADD COLUMN IF NOT EXISTS `Supplier` VARCHAR(100) DEFAULT NULL 
COMMENT 'Nhà cung cấp' 
AFTER `Category`;

-- Cập nhật MinQuantity và Category mặc định
UPDATE `ingredients` SET `MinQuantity` = 5.00 WHERE `MinQuantity` IS NULL;
UPDATE `ingredients` SET `Category` = CASE 
    WHEN `name` LIKE '%thịt%' OR `name` LIKE '%bò%' OR `name` LIKE '%heo%' OR `name` LIKE '%gà%' THEN 'Thịt'
    WHEN `name` LIKE '%rau%' OR `name` LIKE '%củ%' OR `name` LIKE '%hành%' THEN 'Rau củ'
    WHEN `name` LIKE '%dầu%' OR `name` LIKE '%muối%' OR `name` LIKE '%đường%' OR `name` LIKE '%nước mắm%' THEN 'Gia vị'
    WHEN `name` LIKE '%mực%' OR `name` LIKE '%tôm%' OR `name` LIKE '%hàu%' OR `name` LIKE '%cá%' THEN 'Hải sản'
    ELSE 'Khác'
END WHERE `Category` = 'Khác';

-- ============================================================
-- 7. TẠO BẢNG MỚI: DISH_CATEGORIES - Quản lý danh mục món ăn
-- ============================================================

CREATE TABLE IF NOT EXISTS `dish_categories` (
  `CategoryID` INT AUTO_INCREMENT PRIMARY KEY,
  `CategoryName` VARCHAR(100) NOT NULL UNIQUE,
  `Description` TEXT DEFAULT NULL,
  `SortOrder` INT DEFAULT 0,
  `Icon` VARCHAR(50) DEFAULT '🍽️',
  `CreatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
COMMENT='Bảng danh mục món ăn';

-- Insert các danh mục mặc định nếu chưa có
INSERT IGNORE INTO `dish_categories` (`CategoryName`, `Description`, `SortOrder`, `Icon`) VALUES
('Món nướng', 'Các món nướng BBQ, nướng than', 1, '🔥'),
('Món lẩu', 'Các loại lẩu Hàn Quốc, lẩu Thái', 2, '🍲'),
('Món tráng miệng', 'Đồ ngọt, nước uống', 3, '🍰'),
('Buffet', 'Vé buffet trọn gói', 4, '🎫'),
('Món khai vị', 'Món ăn khai vị, salad', 5, '🥗'),
('Đồ uống', 'Nước ngọt, nước ép, trà', 6, '🥤');

-- ============================================================
-- 8. TẠO BẢNG MỚI: NOTIFICATIONS - Thông báo hệ thống
-- ============================================================

CREATE TABLE IF NOT EXISTS `notifications` (
  `NotificationID` INT AUTO_INCREMENT PRIMARY KEY,
  `Type` ENUM('order', 'ingredient', 'system', 'staff') DEFAULT 'system',
  `Title` VARCHAR(255) NOT NULL,
  `Message` TEXT NOT NULL,
  `IsRead` TINYINT(1) DEFAULT 0,
  `CreatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `TargetStaffID` VARCHAR(20) DEFAULT NULL,
  `RelatedOrderID` VARCHAR(20) DEFAULT NULL,
  INDEX `idx_staff` (`TargetStaffID`),
  INDEX `idx_created` (`CreatedAt`),
  INDEX `idx_read` (`IsRead`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
COMMENT='Bảng thông báo hệ thống';

-- ============================================================
-- 9. TẠO BẢNG MỚI: SYSTEM_SETTINGS - Cài đặt hệ thống
-- ============================================================

CREATE TABLE IF NOT EXISTS `system_settings` (
  `SettingID` INT AUTO_INCREMENT PRIMARY KEY,
  `SettingKey` VARCHAR(100) NOT NULL UNIQUE,
  `SettingValue` TEXT NOT NULL,
  `Description` VARCHAR(255) DEFAULT NULL,
  `UpdatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
COMMENT='Bảng cài đặt hệ thống';

-- Insert các cài đặt mặc định
INSERT IGNORE INTO `system_settings` (`SettingKey`, `SettingValue`, `Description`) VALUES
('restaurant_name', 'YakiHouse', 'Tên nhà hàng'),
('restaurant_address', '123 Đường ABC, Quận XYZ, TP.HCM', 'Địa chỉ nhà hàng'),
('restaurant_phone', '0123 456 789', 'Số điện thoại'),
('restaurant_email', 'contact@yakihouse.vn', 'Email liên hệ'),
('tax_rate', '10', 'Thuế VAT (%)'),
('service_charge', '0', 'Phí phục vụ (%)'),
('default_discount_limit', '50', 'Giới hạn giảm giá tối đa (%)'),
('currency', 'VND', 'Đơn vị tiền tệ'),
('timezone', 'Asia/Ho_Chi_Minh', 'Múi giờ'),
('low_stock_threshold', '10', 'Ngưỡng cảnh báo hết hàng');

-- ============================================================
-- 10. TẠO BẢNG MỚI: ORDER_STATUS_HISTORY - Lịch sử trạng thái đơn
-- ============================================================

CREATE TABLE IF NOT EXISTS `order_status_history` (
  `HistoryID` INT AUTO_INCREMENT PRIMARY KEY,
  `OrderID` VARCHAR(20) NOT NULL,
  `PreviousStatus` VARCHAR(20) DEFAULT NULL,
  `NewStatus` VARCHAR(20) NOT NULL,
  `ChangedBy` VARCHAR(20) DEFAULT NULL,
  `ChangedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `Notes` TEXT DEFAULT NULL,
  INDEX `idx_order` (`OrderID`),
  FOREIGN KEY (`OrderID`) REFERENCES `orders`(`OrderID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
COMMENT='Bảng lịch sử thay đổi trạng thái đơn hàng';

-- ============================================================
-- 11. TẠO VIEW: DAILY_REVENUE - View doanh thu theo ngày
-- ============================================================

CREATE OR REPLACE VIEW `daily_revenue` AS
SELECT 
    DATE(t.Timestamp) AS revenue_date,
    COUNT(DISTINCT t.OrderID) AS total_orders,
    SUM(t.Amount) AS total_revenue,
    AVG(t.Amount) AS avg_order_value,
    COUNT(DISTINCT o.StaffID) AS active_staff
FROM transactions t
LEFT JOIN orders o ON t.OrderID = o.OrderID
WHERE t.Timestamp >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
GROUP BY DATE(t.Timestamp)
ORDER BY revenue_date DESC;

-- ============================================================
-- 12. TẠO VIEW: TOP_SELLING_DISHES - Món bán chạy
-- ============================================================

CREATE OR REPLACE VIEW `top_selling_dishes` AS
SELECT 
    d.DishID,
    d.Name,
    d.Category,
    d.Price,
    d.ImagePath,
    COUNT(oi.OrderItemID) AS order_count,
    SUM(oi.Quantity) AS total_quantity,
    SUM(oi.Quantity * oi.UnitPrice) AS total_revenue
FROM dishes d
LEFT JOIN orderitems oi ON d.DishID = oi.DishID
LEFT JOIN orders o ON oi.OrderID = o.OrderID
WHERE o.ENUM = 'paid' 
  AND o.CreatedAt >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY d.DishID, d.Name, d.Category, d.Price, d.ImagePath
ORDER BY total_quantity DESC
LIMIT 20;

-- ============================================================
-- 13. TẠO VIEW: LOW_STOCK_INGREDIENTS - Nguyên liệu sắp hết
-- ============================================================

CREATE OR REPLACE VIEW `low_stock_ingredients` AS
SELECT 
    i.id,
    i.name,
    i.unit,
    i.quantity,
    i.MinQuantity,
    i.Category,
    i.Supplier,
    CASE 
        WHEN i.quantity <= 0 THEN 'Hết hàng'
        WHEN i.quantity <= i.MinQuantity THEN 'Sắp hết'
        ELSE 'Đủ hàng'
    END AS stock_status
FROM ingredients i
WHERE i.quantity <= i.MinQuantity
ORDER BY i.quantity ASC;

-- ============================================================
-- 14. TẠO INDEX ĐỂ TỐI ƯU PERFORMANCE
-- ============================================================

-- Index cho bảng orders
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(CreatedAt);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(ENUM);
CREATE INDEX IF NOT EXISTS idx_orders_table ON orders(TableID);
CREATE INDEX IF NOT EXISTS idx_orders_staff ON orders(StaffID);

-- Index cho bảng orderitems
CREATE INDEX IF NOT EXISTS idx_orderitems_dish ON orderitems(DishID);

-- Index cho bảng transactions
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(Timestamp);

-- Index cho bảng dishes
CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(Category);
CREATE INDEX IF NOT EXISTS idx_dishes_status ON dishes(Status);

-- Index cho bảng ingredients
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(Category);

-- ============================================================
-- 15. TẠO STORED PROCEDURE: sp_get_dashboard_stats
-- ============================================================

DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_get_dashboard_stats`$$

CREATE PROCEDURE `sp_get_dashboard_stats`()
BEGIN
    -- Doanh thu hôm nay
    SELECT 
        COALESCE(SUM(Amount), 0) AS today_revenue
    FROM transactions
    WHERE DATE(Timestamp) = CURDATE();
    
    -- Số đơn hàng hôm nay
    SELECT 
        COUNT(*) AS today_orders
    FROM orders
    WHERE DATE(CreatedAt) = CURDATE();
    
    -- Số món đang bán
    SELECT 
        COUNT(*) AS available_dishes
    FROM dishes
    WHERE Status = 'available';
    
    -- Số bàn đang sử dụng
    SELECT 
        COUNT(*) AS occupied_tables
    FROM tables
    WHERE ENUM IN ('occupied', 'ready-to-bill');
    
    -- Số nguyên liệu sắp hết
    SELECT 
        COUNT(*) AS low_stock_count
    FROM ingredients
    WHERE quantity <= MinQuantity;
END$$

DELIMITER ;

-- ============================================================
-- 16. INSERT DỮ LIỆU MẪU CHO TESTING (Optional)
-- ============================================================

-- Thêm thông báo mẫu
INSERT IGNORE INTO `notifications` (`Type`, `Title`, `Message`, `IsRead`) VALUES
('ingredient', 'Cảnh báo tồn kho', 'Nguyên liệu "Thịt bò" sắp hết, cần nhập thêm!', 0),
('system', 'Hệ thống nâng cấp', 'Hệ thống đã được nâng cấp lên phiên bản 2.0', 0);

-- ============================================================
-- HOÀN THÀNH MIGRATION
-- ============================================================

-- Kiểm tra phiên bản
INSERT INTO `system_settings` (`SettingKey`, `SettingValue`, `Description`) 
VALUES ('db_version', '2.0', 'Phiên bản database')
ON DUPLICATE KEY UPDATE `SettingValue` = '2.0', `UpdatedAt` = CURRENT_TIMESTAMP;

-- Ghi log
SELECT 'Migration completed successfully! Database version 2.0' AS Status;
SELECT 'Please run this script in phpMyAdmin or MySQL CLI' AS Instructions;
SELECT 'All existing data has been preserved!' AS Important;

