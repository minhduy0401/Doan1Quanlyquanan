-- ============================================================
-- FIX LOGIN ACCOUNTS - Tạo tài khoản test
-- ============================================================

USE `yakihouse`;

-- Kiểm tra và tạo tài khoản nếu chưa có
INSERT INTO `staffs` (`StaffID`, `Name`, `Code`, `Password`, `Position`, `Phone`) 
VALUES 
('nv1001', 'Nguyễn Văn Admin', 'nv1001', '1234', 'Quản lý', '0123456789'),
('nv1002', 'Trần Thị Thu Ngân', 'nv1002', '1234', 'Thu ngân', '0987654321'),
('nv1003', 'Lê Văn Phục Vụ', 'nv1003', '1234', 'Phục vụ', '0912345678')
ON DUPLICATE KEY UPDATE 
    Password = VALUES(Password),
    Name = VALUES(Name),
    Position = VALUES(Position),
    Phone = VALUES(Phone);

-- Kiểm tra kết quả
SELECT StaffID, Name, Code, Position, Phone FROM staffs WHERE Code IN ('nv1001', 'nv1002', 'nv1003');

SELECT 'Tài khoản đã được tạo/cập nhật thành công!' AS Status;
SELECT 'Login với: Code=nv1001, Password=1234' AS Info;
