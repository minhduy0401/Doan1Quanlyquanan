-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 23, 2025 lúc 01:18 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `yakihouse`
--
CREATE DATABASE IF NOT EXISTS `yakihouse` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `yakihouse`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dishes`
--

CREATE TABLE `dishes` (
  `DishID` varchar(20) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Price` decimal(18,2) NOT NULL,
  `Category` varchar(50) NOT NULL,
  `ImagePath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `dishes`
--

INSERT INTO `dishes` (`DishID`, `Name`, `Price`, `Category`, `ImagePath`) VALUES
('buffet', 'Ve Buffet 199', 199000.00, 'Buffet', 'image/buffet.jpg'),
('d684c6649be57b', 'Lòng bò nướng', 100000.00, 'Món nướng', 'image/uploaded_dishes/Longbonuong.jpg'),
('d684e94bf68829', 'Nước ép cà rốt', 25000.00, 'Món tráng miệng', 'image/uploaded_dishes/epcarot.png'),
('d684e9501eee55', 'Nước ép cam', 25000.00, 'Món tráng miệng', 'image/uploaded_dishes/epcam.jpg'),
('d684e954ce75fc', 'Moctail dâu', 25000.00, 'Món tráng miệng', 'image/uploaded_dishes/mtdau.jpg'),
('d684e9604721c0', 'Trái cây (theo mùa)', 30000.00, 'Món tráng miệng', 'image/uploaded_dishes/traicay.jpg'),
('d684e962e256c3', 'Moctail chanh dây', 25000.00, 'Món tráng miệng', 'image/uploaded_dishes/mtday.jpg'),
('d684e96e1a4b05', 'Coca lon', 22000.00, 'Món tráng miệng', 'image/uploaded_dishes/coca.png'),
('d684e9718c337f', 'Fanta lon', 22000.00, 'Món tráng miệng', 'image/uploaded_dishes/ft.jpg'),
('d684e973083e9e', 'Nước suối', 17000.00, 'Món tráng miệng', 'image/uploaded_dishes/aquafina.jpg'),
('d684e97fc1e5ff', 'Sprite lon', 22000.00, 'Món tráng miệng', 'image/uploaded_dishes/sp.jpg'),
('d684e9ba30cb4b', 'Sting lon', 22000.00, 'Món tráng miệng', 'image/uploaded_dishes/sting.jpg'),
('d684e9c420efb8', 'Bia Tiger/Heineken', 26000.00, 'Món tráng miệng', 'image/uploaded_dishes/bia.jpg'),
('d684e9cc9e8c62', 'Rượu mơ', 89000.00, 'Món nướng', 'image/uploaded_dishes/Ruou-MOjpg.jpg'),
('d684e9d3e20983', 'Rượu Soju', 89000.00, 'Món tráng miệng', 'image/uploaded_dishes/soju.jpg'),
('d684e9d970c8de', 'Sữa chua', 10000.00, 'Món tráng miệng', 'image/uploaded_dishes/Sua-chua.jpg'),
('d684e9df5f15ca', 'Trà sữa thái xanh', 25000.00, 'Món tráng miệng', 'image/uploaded_dishes/Trasua.jpeg'),
('d684e9e2d9955c', 'Trà tắc thái xanh', 25000.00, 'Món tráng miệng', 'image/uploaded_dishes/tra-tac-thai-xanh.jpg'),
('d684e9e7addcd4', 'Trà trái cây nhiệt đới', 25000.00, 'Món tráng miệng', 'image/uploaded_dishes/tra-hoa-qua-nhiet-doi.jpg'),
('d684eca9d8c30d', 'Kimbap Hàn Quốc', 40000.00, 'Món nướng', 'image/uploaded_dishes/kimbap.jpg'),
('d684ecae0eb972', 'Tokbokki sốt cay', 80000.00, 'Món nướng', 'image/uploaded_dishes/tokbokki cay.jpg'),
('d684ecafa901d5', 'Tokbokki phô mai', 80000.00, 'Món nướng', 'image/uploaded_dishes/tokbokki-pho-mai.jpg'),
('d684ecb1053a9a', 'Cánh gà lốc cay', 90000.00, 'Món nướng', 'image/uploaded_dishes/canhgaloccay.jpg'),
('d684ecb4db5fa0', 'Canh tương đậu', 80000.00, 'Món lẩu', 'image/uploaded_dishes/canhtuongdau.jpg'),
('d684ecb66ebba2', 'Canh rong biển', 80000.00, 'Món lẩu', 'image/uploaded_dishes/canhrongbien.jpg'),
('d684ecb9b3239c', 'Cơm trộn Hàn Quốc', 90000.00, 'Món nướng', 'image/uploaded_dishes/comtron.jpg'),
('d684ecbe2c2357', 'Miến trộn tổng hợp', 100000.00, 'Món nướng', 'image/uploaded_dishes/mientrontonghop.jpg'),
('d684ecbfc1aeb4', 'Canh kim chi', 80000.00, 'Món lẩu', 'image/uploaded_dishes/canhkimchi.jpg'),
('d684eccb193fa7', 'Chân gà sốt thái', 100000.00, 'Món nướng', 'image/uploaded_dishes/Changasotthai.jpg'),
('d684ecd85348a5', 'Lưỡi Heo Sốt Cay/Yaki', 90000.00, 'Món nướng', 'image/uploaded_dishes/luoiheocay.jpg'),
('d684ecffb98fb4', 'Vú heo sốt cay', 90000.00, 'Món nướng', 'image/uploaded_dishes/vu-heo-cay.jpg'),
('m1', 'Bắp Bò', 80000.00, 'Món nướng', 'image/bapbo.jpg'),
('m10', 'Hàu nướng phô mai', 125000.00, 'Món nướng', 'image/haumai.jpg'),
('m11', 'Cánh gà sốt cay', 120000.00, 'Món nướng', 'image/canhgasotcay.jpg'),
('m12', 'Chân gà sốt cay Hàn Quốc', 125000.00, 'Món nướng', 'image/chan-ga-sot-cay-han-quoc.jpg'),
('m13', 'Sườn sụn heo sốt tiêu đen', 125000.00, 'Món nướng', 'image/suonsunheosottieuden.jpg'),
('m14', 'Lẩu kim chi', 159000.00, 'Món lẩu', 'image/laukimchi.jpg'),
('m15', 'Lẩu Bull', 159000.00, 'Món lẩu', 'image/bull.png'),
('m16', 'Lẩu quân đội', 125000.00, 'Món lẩu', 'image/lauquandoi.png'),
('m17', 'Bánh su kem', 12000.00, 'Món tráng miệng', 'image/sukem.jpg'),
('m18', 'Bánh flan', 12000.00, 'Món tráng miệng', 'image/flan.jpg'),
('m19', 'Panna cotta', 12000.00, 'Món tráng miệng', 'image/panna.jpg'),
('m2', 'Bò tảng', 45000.00, 'Món nướng', 'image/botang.jpg'),
('m20', 'Bánh mochi', 12000.00, 'Món tráng miệng', 'image/mochi.png'),
('m21', 'Nước ép dưa hấu', 25000.00, 'Món tráng miệng', 'image/epduahau.jpg'),
('m22', 'Nước ép dưa lưới', 25000.00, 'Món tráng miệng', 'image/epduoilua.jpg'),
('m23', 'Sâm bí đao', 22000.00, 'Món tráng miệng', 'image/sambidao.jpg'),
('m24', 'Chè khúc bạch', 22000.00, 'Món tráng miệng', 'image/khucbach.png'),
('m25', 'Chè dưỡng nhan', 22000.00, 'Món tráng miệng', 'image/cheduongnhan.jpg'),
('m3', 'Bò cuộn nấm kim châm', 60000.00, 'Món nướng', 'image/bonam.jpg'),
('m4', 'Bò cuộn phô mai', 80000.00, 'Món nướng', 'image/bomai.jpg'),
('m5', 'Mực tỉa', 77000.00, 'Món nướng', 'image/muctia.jpg'),
('m6', 'Râu mực', 89000.00, 'Món nướng', 'image/raumuc.jpg'),
('m7', 'Bạch tuột Baby', 71000.00, 'Món nướng', 'image/btbaby.jpg'),
('m8', 'Tôm sốt cay', 125000.00, 'Món nướng', 'image/tomcay.jpg'),
('m9', 'Hàu nướng mỡ hành', 125000.00, 'Món nướng', 'image/haunuongmohanh.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `quantity` decimal(10,2) DEFAULT 0.00,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ingredients`
--

INSERT INTO `ingredients` (`id`, `name`, `unit`, `quantity`, `note`) VALUES
(1, 'Thịt bò', 'kg', 10.00, 'Thịt bò Úc'),
(4, 'Đường', 'kg', 23.00, 'Gia vị'),
(6, 'Thịt heo', 'kg', 32.00, 'các món nướng'),
(7, 'bắp bò', 'kg', 10.00, 'cắt lát'),
(8, 'Thịt gà', 'kg', 5.00, 'Cánh, má, đùi, chân'),
(9, 'Tôm', 'kg', 3.00, 'thả lẩu, sốt cay\r\n'),
(10, 'Mực', 'kg', 2.00, 'chiên, nướng, thả lẩu'),
(11, 'Bún', 'kg', 20.00, 'ăn lẩu'),
(12, 'Hàu sữa', 'kg', 10.00, 'nướng'),
(13, 'Miến', 'kg', 2.00, 'miến trộn, canh'),
(14, 'Gạo', 'kg', 50.00, 'Dùng nấu cơm'),
(15, 'Nước tương', 'lít', 5.00, 'Dùng làm gia vị'),
(16, 'Nước mắm', 'lít', 10.00, 'Gia vị chính'),
(17, 'Dầu ăn', 'lít', 5.00, 'Dùng chiên, xào'),
(19, 'Muối', 'kg', 2.00, 'Dùng nêm nếm'),
(20, 'Tiêu', 'kg', 1.00, 'Dùng nêm nếm'),
(21, 'Chanh', 'kg', 2.00, 'Dùng pha nước chấm, gia vị'),
(22, 'Ớt', 'kg', 1.00, 'Dùng pha nước chấm'),
(23, 'Hành tây', 'kg', 3.00, 'Dùng cho các món xào'),
(24, 'Hành lá', 'kg', 1.00, 'Trang trí, gia vị'),
(25, 'Tỏi', 'kg', 2.00, 'Gia vị'),
(26, 'Gừng', 'kg', 1.00, 'Gia vị'),
(27, 'Sả', 'kg', 1.00, 'Gia vị'),
(28, 'Rau sống', 'kg', 5.00, 'Dùng ăn kèm'),
(29, 'Bắp cải', 'kg', 3.00, 'Dùng làm gỏi'),
(30, 'Dưa chuột', 'kg', 3.00, 'Dùng làm gỏi, ăn kèm'),
(31, 'Ba chỉ bò', 'kg', 20.00, 'nướng'),
(33, 'Dê sườn', 'kg', 6.00, ''),
(34, 'Thăn bò', 'kg', 15.00, ''),
(35, 'Ba chỉ heo', 'kg', 6.00, ''),
(36, 'Ba chỉ heo (khối)', 'kg', 4.00, ''),
(37, 'Nạc vai heo', 'kg', 4.00, ''),
(38, 'Sườn sụn heo', 'kg', 4.00, ''),
(39, 'Xúc xích', 'gói', 3.00, ''),
(40, 'Đậu hủ phô mai', 'gói', 3.00, ''),
(41, 'Bánh gạo thỏi', 'gói', 4.00, ''),
(42, 'Bánh gạo phô mai', 'gói', 5.00, ''),
(43, 'Tôm viên', 'gói', 1.00, ''),
(44, 'Cá viên', 'gói', 2.00, ''),
(45, 'Bò viên', 'gói', 4.00, ''),
(46, 'Bánh bao hải sản', 'gói', 2.00, ''),
(47, 'Cánh gà', 'kg', 4.00, ''),
(49, 'Chân gà', 'kg', 5.00, ''),
(50, 'Đầu mực', 'kg', 10.00, ''),
(51, 'Mực hoa', 'kg', 9.00, ''),
(52, 'Vú heo', 'kg', 25.00, ''),
(53, 'Tôm thẻ', 'kg', 3.00, ''),
(57, 'Hàu bịt', 'kg', 6.00, ''),
(59, 'Hạt nêm', 'kg', 3.00, '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ingredient_logs`
--

CREATE TABLE `ingredient_logs` (
  `id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `type` enum('import','export') NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ingredient_logs`
--

INSERT INTO `ingredient_logs` (`id`, `ingredient_id`, `type`, `quantity`, `timestamp`, `note`) VALUES
(2, 57, 'import', 2.00, '2025-08-22 15:46:38', ''),
(3, 4, 'export', 10.00, '2025-08-22 16:28:13', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderitems`
--

CREATE TABLE `orderitems` (
  `OrderItemID` int(11) NOT NULL,
  `OrderID` varchar(20) NOT NULL,
  `DishID` varchar(20) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `UnitPrice` decimal(18,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orderitems`
--

INSERT INTO `orderitems` (`OrderItemID`, `OrderID`, `DishID`, `Quantity`, `UnitPrice`) VALUES
(7, 'ord68487a131622f', 'm10', 1, 125000.00),
(8, 'ord68487a131622f', 'm11', 1, 125000.00),
(9, 'ord68487a131622f', 'm1', 1, 80000.00),
(13, 'ord68487a23f2143', 'm10', 1, 125000.00),
(14, 'ord68487a23f2143', 'm1', 1, 80000.00),
(15, 'ord68487a23f2143', 'm11', 1, 125000.00),
(19, 'ord68487a2f8fe99', 'm11', 1, 125000.00),
(20, 'ord68487a2f8fe99', 'm10', 1, 125000.00),
(21, 'ord68487a2f8fe99', 'm1', 1, 80000.00),
(253, 'ord68487a3810058', 'buffet', 1, 199000.00),
(254, 'ord68487a3810058', 'm1', 1, 0.00),
(255, 'ord68487a3810058', 'm10', 1, 0.00),
(256, 'ord68487a3810058', 'm11', 1, 0.00),
(257, 'ord68487a3810058', 'm12', 1, 0.00),
(258, 'ord68487a3810058', 'm13', 1, 0.00),
(259, 'ord68487a3810058', 'm14', 1, 0.00),
(260, 'ord68487a3810058', 'm15', 1, 0.00),
(261, 'ord68487a3810058', 'm19', 1, 0.00),
(262, 'ord68487a3810058', 'm18', 1, 0.00),
(263, 'ord68487a3810058', 'm16', 1, 0.00),
(264, 'ord68487a3810058', 'm17', 1, 0.00),
(265, 'ord68487a3810058', 'm23', 1, 0.00),
(266, 'ord68487a3810058', 'm24', 1, 0.00),
(267, 'ord68487a3810058', 'm25', 1, 0.00),
(268, 'ord68487a3810058', 'm3', 1, 0.00),
(269, 'ord68487a3810058', 'm7', 1, 0.00),
(270, 'ord68487a3810058', 'm6', 1, 0.00),
(271, 'ord68487a3810058', 'm5', 1, 0.00),
(272, 'ord68487a3810058', 'm4', 1, 0.00),
(273, 'ord68487a3810058', 'm8', 1, 0.00),
(274, 'ord68487a3810058', 'm9', 1, 0.00),
(296, 'ord68487dc995499', 'm18', 1, 12000.00),
(297, 'ord68487dc995499', 'm20', 1, 10000.00),
(298, 'ord68487dc995499', 'm17', 1, 20000.00),
(299, 'ord68487dc995499', 'm2', 1, 45000.00),
(300, 'ord68487dc995499', 'm4', 1, 75000.00),
(301, 'ord68487dc995499', 'm3', 1, 60000.00),
(302, 'ord68487dc995499', 'm1', 1, 80000.00),
(303, 'ord6848814c7e18e', 'm20', 1, 10000.00),
(307, 'ord68488184715f8', 'm18', 1, 12000.00),
(308, 'ord68488184715f8', 'm17', 1, 20000.00),
(309, 'ord68488184715f8', 'm20', 1, 10000.00),
(313, 'ord6849b5258851d', 'm20', 1, 10000.00),
(314, 'ord6849b5258851d', 'm17', 1, 20000.00),
(315, 'ord6849b5258851d', 'm18', 1, 12000.00),
(352, 'ord6849b57cd5cb2', 'buffet', 1, 199000.00),
(353, 'ord6849b57cd5cb2', 'm17', 1, 0.00),
(354, 'ord6849b57cd5cb2', 'm20', 1, 0.00),
(355, 'ord6849b57cd5cb2', 'm18', 1, 0.00),
(356, 'ord6849b57cd5cb2', 'm7', 1, 0.00),
(357, 'ord6849b57cd5cb2', 'm1', 1, 0.00),
(358, 'ord6849b57cd5cb2', 'm3', 1, 0.00),
(359, 'ord6849b57cd5cb2', 'm4', 1, 0.00),
(360, 'ord6849b57cd5cb2', 'm2', 1, 0.00),
(367, 'ord684c62de701a8', 'buffet', 1, 199000.00),
(368, 'ord684c62de701a8', 'm24', 1, 0.00),
(369, 'ord684c62de701a8', 'm25', 1, 0.00),
(370, 'ord684c62de701a8', 'm4', 1, 0.00),
(379, 'ord684c6625008f9', 'm20', 2, 10000.00),
(380, 'ord684c6625008f9', 'm17', 1, 20000.00),
(381, 'ord684c6625008f9', 'm18', 2, 12000.00),
(385, 'ord684c6bc527ac8', 'm3', 1, 60000.00),
(386, 'ord684c6bc527ac8', 'm4', 1, 75000.00),
(387, 'ord684c6bc527ac8', 'm2', 1, 45000.00),
(423, 'ord684faed110c5b', 'm17', 2, 12000.00),
(424, 'ord684faed110c5b', 'm20', 1, 12000.00),
(425, 'ord684faed110c5b', 'm18', 1, 12000.00),
(426, 'ord684faed110c5b', 'm7', 1, 90000.00),
(427, 'ord684faed110c5b', 'm4', 1, 80000.00),
(428, 'ord684faed110c5b', 'm3', 1, 60000.00),
(429, 'ord684faed110c5b', 'd684e9c420efb8', 1, 26000.00),
(430, 'ord684faed110c5b', 'm1', 1, 80000.00),
(431, 'ord684fb0874196c', 'm20', 1, 12000.00),
(439, 'ord684fb1dd544e4', 'm18', 1, 12000.00),
(440, 'ord684fb1dd544e4', 'm20', 1, 12000.00),
(441, 'ord684fb1dd544e4', 'm17', 1, 12000.00),
(442, 'ord684fb1dd544e4', 'm7', 1, 90000.00),
(479, 'ord684fc36c08d5c', 'buffet', 1, 199000.00),
(480, 'ord684fc36c08d5c', 'd684e9e2d9955c', 1, 0.00),
(481, 'ord684fc36c08d5c', 'd684e9df5f15ca', 1, 0.00),
(482, 'ord684fc36c08d5c', 'm8', 1, 0.00),
(483, 'ord684fc36c08d5c', 'd684ecae0eb972', 1, 0.00),
(484, 'ord684fc36c08d5c', 'd684e9ba30cb4b', 1, 0.00),
(485, 'ord684fc36c08d5c', 'd684e9d970c8de', 1, 0.00),
(486, 'ord684fc36c08d5c', 'm13', 1, 0.00),
(487, 'ord684fc36c08d5c', 'd684ecafa901d5', 1, 0.00),
(494, 'ord684fc3f7b5c29', 'm7', 1, 90000.00),
(495, 'ord684fc3f7b5c29', 'm18', 1, 12000.00),
(496, 'ord684fc3f7b5c29', 'm17', 1, 12000.00),
(497, 'ord684fc3f7b5c29', 'd684e96e1a4b05', 1, 22000.00),
(504, 'ord684fc4a7b6136', 'm18', 1, 12000.00),
(505, 'ord684fc4a7b6136', 'm20', 1, 12000.00),
(506, 'ord684fc4a7b6136', 'm17', 1, 12000.00),
(507, 'ord684fc4a7b6136', 'm7', 1, 90000.00),
(516, 'ord68512e51eee12', 'm20', 2, 12000.00),
(517, 'ord68512e51eee12', 'm17', 1, 12000.00),
(518, 'ord68512e51eee12', 'm18', 1, 12000.00),
(519, 'ord68512e51eee12', 'm7', 1, 90000.00),
(521, 'ord687d0482a5ccd', 'm7', 1, 70000.00),
(522, 'ord687d0482a5ccd', 'm18', 1, 12000.00),
(529, 'ord687d0e5f53883', 'm17', 1, 12000.00),
(530, 'ord687d0e5f53883', 'm20', 1, 12000.00),
(531, 'ord687d0e5f53883', 'm18', 1, 12000.00),
(532, 'ord687d0e5f53883', 'm7', 1, 70000.00),
(558, 'ord687d113a59715', 'm18', 2, 12000.00),
(559, 'ord687d113a59715', 'm7', 1, 70000.00),
(560, 'ord687d113a59715', 'm17', 2, 12000.00),
(561, 'ord687d113a59715', 'm20', 2, 12000.00),
(562, 'ord687d113a59715', 'm1', 1, 80000.00),
(563, 'ord687d113a59715', 'd684e9c420efb8', 1, 26000.00),
(570, 'ord687f7200e7f2a', 'm17', 1, 12000.00),
(571, 'ord687f7200e7f2a', 'm20', 1, 12000.00),
(572, 'ord687f7200e7f2a', 'm18', 1, 12000.00),
(573, 'ord687f7200e7f2a', 'm7', 1, 70000.00),
(643, 'ord6890bc30a5e36', 'buffet', 1, 199000.00),
(644, 'ord6890bc30a5e36', 'd684ecffb98fb4', 1, 0.00),
(645, 'ord6890bc30a5e36', 'd684e9604721c0', 2, 0.00),
(646, 'ord6890bc30a5e36', 'd684e9e7addcd4', 1, 0.00),
(647, 'ord6890bc30a5e36', 'd684ecae0eb972', 1, 0.00),
(648, 'ord6890bc30a5e36', 'm8', 1, 0.00),
(649, 'ord6890bc30a5e36', 'd684e9df5f15ca', 1, 0.00),
(650, 'ord6890bc30a5e36', 'd684e9e2d9955c', 1, 0.00),
(729, 'ord6899e0fbd8a90', 'buffet', 1, 199000.00),
(730, 'ord6899e0fbd8a90', 'd684e9604721c0', 1, 0.00),
(731, 'ord6899e0fbd8a90', 'd684e9e7addcd4', 1, 0.00),
(732, 'ord6899e0fbd8a90', 'd684ecae0eb972', 1, 0.00),
(733, 'ord6899e0fbd8a90', 'd684e9df5f15ca', 1, 0.00),
(734, 'ord6899e0fbd8a90', 'd684e9e2d9955c', 1, 0.00),
(735, 'ord6899e0fbd8a90', 'd684ecafa901d5', 1, 0.00),
(736, 'ord6899e0fbd8a90', 'm13', 1, 0.00),
(737, 'ord6899e0fbd8a90', 'd684e9d970c8de', 1, 0.00),
(738, 'ord6899e0fbd8a90', 'd684e9ba30cb4b', 1, 0.00),
(739, 'ord6899e0fbd8a90', 'd684e9cc9e8c62', 1, 0.00),
(740, 'ord6899e0fbd8a90', 'm23', 1, 0.00),
(741, 'ord6899e0fbd8a90', 'd684e97fc1e5ff', 1, 0.00),
(797, 'ord6899e11de0cf7', 'm20', 1, 12000.00),
(798, 'ord6899e11de0cf7', 'm18', 1, 12000.00),
(799, 'ord6899e11de0cf7', 'm7', 1, 70000.00),
(800, 'ord6899e11de0cf7', 'm4', 1, 80000.00),
(801, 'ord6899e11de0cf7', 'm3', 1, 60000.00),
(802, 'ord6899e11de0cf7', 'd684e9c420efb8', 1, 26000.00),
(803, 'ord6899e11de0cf7', 'm1', 1, 80000.00),
(804, 'ord6899e11de0cf7', 'm2', 1, 45000.00),
(805, 'ord6899e11de0cf7', 'd684ecb1053a9a', 1, 90000.00),
(806, 'ord6899e11de0cf7', 'm11', 1, 125000.00),
(807, 'ord6899e11de0cf7', 'd684ecbfc1aeb4', 1, 80000.00),
(836, 'ord68a447d34c905', 'm20', 1, 12000.00),
(837, 'ord68a447d34c905', 'm18', 1, 12000.00),
(838, 'ord68a447d34c905', 'm7', 1, 70000.00),
(839, 'ord68a447d34c905', 'm17', 1, 12000.00),
(840, 'ord68a447d34c905', 'm4', 1, 80000.00),
(841, 'ord68a447d34c905', 'm3', 1, 60000.00),
(842, 'ord68a447d34c905', 'd684e9c420efb8', 1, 26000.00),
(843, 'ord68a447d34c905', 'm1', 1, 80000.00),
(865, 'ord68a44e899438b', 'm17', 1, 12000.00),
(866, 'ord68a44e899438b', 'm20', 1, 12000.00),
(867, 'ord68a44e899438b', 'm18', 1, 12000.00),
(868, 'ord68a44e899438b', 'm7', 1, 70000.00),
(869, 'ord68a44e899438b', 'm1', 1, 80000.00),
(870, 'ord68a44e899438b', 'd684e9c420efb8', 1, 26000.00),
(871, 'ord68a44e899438b', 'm3', 1, 60000.00),
(1307, 'ord68a4564562bc0', 'buffet', 1, 199000.00),
(1308, 'ord68a4564562bc0', 'd684e9604721c0', 1, 0.00),
(1309, 'ord68a4564562bc0', 'd684e9e7addcd4', 1, 0.00),
(1310, 'ord68a4564562bc0', 'm8', 1, 0.00),
(1311, 'ord68a4564562bc0', 'd684e9df5f15ca', 1, 0.00),
(1312, 'ord68a4564562bc0', 'd684e9e2d9955c', 1, 0.00),
(1313, 'ord68a4564562bc0', 'd684ecafa901d5', 1, 0.00),
(1314, 'ord68a4564562bc0', 'm13', 1, 0.00),
(1315, 'ord68a4564562bc0', 'd684e9d970c8de', 1, 0.00),
(1316, 'ord68a4564562bc0', 'd684e9ba30cb4b', 1, 0.00),
(1317, 'ord68a4564562bc0', 'd684e9cc9e8c62', 1, 0.00),
(1318, 'ord68a4564562bc0', 'd684e9d3e20983', 1, 0.00),
(1319, 'ord68a4564562bc0', 'm23', 1, 0.00),
(1320, 'ord68a4564562bc0', 'd684e97fc1e5ff', 1, 0.00),
(1321, 'ord68a4564562bc0', 'm6', 1, 0.00),
(1322, 'ord68a4564562bc0', 'm19', 1, 0.00),
(1323, 'ord68a4564562bc0', 'd684e973083e9e', 1, 0.00),
(1324, 'ord68a4564562bc0', 'm22', 1, 0.00),
(1325, 'ord68a4564562bc0', 'm5', 1, 0.00),
(1326, 'ord68a4564562bc0', 'd684e94bf68829', 1, 0.00),
(1327, 'ord68a4564562bc0', 'd684e9501eee55', 1, 0.00),
(1328, 'ord68a4564562bc0', 'm21', 1, 0.00),
(1329, 'ord68a4564562bc0', 'd684e954ce75fc', 1, 0.00),
(1330, 'ord68a4564562bc0', 'd684e962e256c3', 1, 0.00),
(1331, 'ord68a4564562bc0', 'd684ecbe2c2357', 1, 0.00),
(1332, 'ord68a4564562bc0', 'd684ecd85348a5', 1, 0.00),
(1333, 'ord68a4564562bc0', 'm15', 1, 0.00),
(1334, 'ord68a4564562bc0', 'm14', 1, 0.00),
(1335, 'ord68a4564562bc0', 'd684c6649be57b', 1, 0.00),
(1336, 'ord68a4564562bc0', 'm16', 1, 0.00),
(1365, 'ord68a45667b55ed', 'm17', 1, 12000.00),
(1366, 'ord68a45667b55ed', 'm20', 1, 12000.00),
(1367, 'ord68a45667b55ed', 'm18', 1, 12000.00),
(1368, 'ord68a45667b55ed', 'm7', 1, 70000.00),
(1369, 'ord68a45667b55ed', 'm1', 1, 80000.00),
(1370, 'ord68a45667b55ed', 'd684e9c420efb8', 1, 26000.00),
(1371, 'ord68a45667b55ed', 'm3', 1, 60000.00),
(1372, 'ord68a45667b55ed', 'm4', 1, 80000.00),
(1439, 'ord68a456756423c', 'm17', 1, 12000.00),
(1440, 'ord68a456756423c', 'm20', 1, 12000.00),
(1441, 'ord68a456756423c', 'm18', 1, 12000.00),
(1442, 'ord68a456756423c', 'm7', 1, 70000.00),
(1443, 'ord68a456756423c', 'm1', 1, 80000.00),
(1444, 'ord68a456756423c', 'd684e9c420efb8', 1, 26000.00),
(1445, 'ord68a456756423c', 'm3', 1, 60000.00),
(1446, 'ord68a456756423c', 'm4', 1, 80000.00),
(1447, 'ord68a456756423c', 'd684ecbfc1aeb4', 1, 80000.00),
(1448, 'ord68a456756423c', 'm11', 1, 120000.00),
(1449, 'ord68a456756423c', 'd684ecb1053a9a', 1, 90000.00),
(1450, 'ord68a456756423c', 'm2', 1, 45000.00),
(1485, 'ord68a4568713c9a', 'buffet', 7, 199000.00),
(1486, 'ord68a4568713c9a', 'm4', 1, 0.00),
(1487, 'ord68a4568713c9a', 'm3', 1, 0.00),
(1488, 'ord68a4568713c9a', 'd684e9c420efb8', 1, 0.00),
(1489, 'ord68a4568713c9a', 'm1', 1, 0.00),
(1490, 'ord68a4568713c9a', 'm18', 1, 0.00),
(1491, 'ord68a4568713c9a', 'm20', 1, 0.00),
(1492, 'ord68a4568713c9a', 'm17', 1, 0.00),
(1499, 'ord68a45abc82d78', 'm17', 1, 12000.00),
(1500, 'ord68a45abc82d78', 'm20', 1, 12000.00),
(1501, 'ord68a45abc82d78', 'm18', 1, 12000.00),
(1502, 'ord68a45abc82d78', 'm7', 1, 70000.00),
(1509, 'ord68a45c88b0fc8', 'm17', 1, 12000.00),
(1510, 'ord68a45c88b0fc8', 'm20', 1, 12000.00),
(1511, 'ord68a45c88b0fc8', 'm18', 1, 12000.00),
(1512, 'ord68a45c88b0fc8', 'm7', 1, 70000.00),
(1550, 'ord68a4606a9db26', 'm3', 1, 60000.00),
(1551, 'ord68a4606a9db26', 'm4', 1, 80000.00),
(1552, 'ord68a4606a9db26', 'd684e9c420efb8', 1, 26000.00),
(1553, 'ord68a4606a9db26', 'm7', 1, 70000.00),
(1554, 'ord68a4606a9db26', 'm17', 3, 12000.00),
(1555, 'ord68a4606a9db26', 'm20', 3, 12000.00),
(1584, 'ord68a46572ab14a', 'm17', 1, 12000.00),
(1585, 'ord68a46572ab14a', 'm20', 1, 12000.00),
(1586, 'ord68a46572ab14a', 'm18', 1, 12000.00),
(1587, 'ord68a46572ab14a', 'm7', 1, 70000.00),
(1588, 'ord68a46572ab14a', 'm1', 1, 80000.00),
(1589, 'ord68a46572ab14a', 'd684e9c420efb8', 1, 26000.00),
(1590, 'ord68a46572ab14a', 'm3', 1, 60000.00),
(1591, 'ord68a46572ab14a', 'm4', 1, 80000.00),
(1602, 'ord68a4657fee8cf', 'm3', 1, 60000.00),
(1603, 'ord68a4657fee8cf', 'd684e9c420efb8', 1, 26000.00),
(1604, 'ord68a4657fee8cf', 'm1', 1, 80000.00),
(1605, 'ord68a4657fee8cf', 'm18', 1, 12000.00),
(1606, 'ord68a4657fee8cf', 'm20', 1, 12000.00),
(1613, 'ord68a47cdb4b814', 'm20', 1, 12000.00),
(1614, 'ord68a47cdb4b814', 'm18', 1, 12000.00),
(1615, 'ord68a47cdb4b814', 'm7', 1, 70000.00),
(1616, 'ord68a47cdb4b814', 'm17', 1, 12000.00),
(1620, 'ord68a47d06c89cf', 'm17', 1, 12000.00),
(1621, 'ord68a47d06c89cf', 'm20', 1, 12000.00),
(1622, 'ord68a47d06c89cf', 'm18', 1, 12000.00),
(1633, 'ord68a82542ee0dd', 'm17', 1, 12000.00),
(1634, 'ord68a82542ee0dd', 'm20', 1, 12000.00),
(1635, 'ord68a82542ee0dd', 'm18', 1, 12000.00),
(1636, 'ord68a82542ee0dd', 'm7', 1, 70000.00),
(1637, 'ord68a82542ee0dd', 'm1', 1, 80000.00),
(1644, 'ord68a834204bb3a', 'm7', 1, 70000.00),
(1645, 'ord68a834204bb3a', 'm18', 1, 12000.00),
(1646, 'ord68a834204bb3a', 'm20', 1, 12000.00),
(1647, 'ord68a834204bb3a', 'm17', 1, 12000.00),
(1663, 'ord68a8342e441d5', 'buffet', 1, 199000.00),
(1664, 'ord68a8342e441d5', 'd684e9604721c0', 1, 0.00),
(1665, 'ord68a8342e441d5', 'd684ecffb98fb4', 1, 0.00),
(1666, 'ord68a8342e441d5', 'd684e9e2d9955c', 1, 0.00),
(1667, 'ord68a8342e441d5', 'd684e9df5f15ca', 1, 0.00),
(1668, 'ord68a8342e441d5', 'm8', 1, 0.00),
(1670, 'ord68a99d11bdd80', 'm17', 1, 12000.00),
(1671, 'ord68a99d11bdd80', 'm20', 1, 12000.00),
(1678, 'ord68a9a0ac0c328', 'm17', 1, 12000.00),
(1679, 'ord68a9a0ac0c328', 'm20', 1, 12000.00),
(1680, 'ord68a9a0ac0c328', 'm18', 1, 12000.00),
(1681, 'ord68a9a0ac0c328', 'm7', 1, 71000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `OrderID` varchar(20) NOT NULL,
  `TableID` varchar(20) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `ENUM` varchar(20) NOT NULL DEFAULT 'open',
  `Subtotal` decimal(18,2) DEFAULT 0.00,
  `DiscountPercent` int(11) DEFAULT 0,
  `Total` decimal(18,2) DEFAULT 0.00,
  `StaffID` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`OrderID`, `TableID`, `CreatedAt`, `ENUM`, `Subtotal`, `DiscountPercent`, `Total`, `StaffID`) VALUES
('ord68487a131622f', 'b11', '2025-06-11 01:31:47', 'paid', 330000.00, 0, 330000.00, 'nv68487452e1adc'),
('ord68487a23f2143', 'b12', '2025-06-11 01:32:03', 'paid', 330000.00, 0, 330000.00, 'nv68487452e1adc'),
('ord68487a2f8fe99', 'b13', '2025-06-11 01:32:15', 'paid', 330000.00, 0, 330000.00, 'nv68487452e1adc'),
('ord68487a3810058', 'b9', '2025-06-11 01:32:24', 'paid', 199000.00, 0, 199000.00, 'nv68487452e1adc'),
('ord68487dc995499', 'b1', '2025-06-11 01:47:37', 'paid', 302000.00, 0, 302000.00, 'nv68487452e1adc'),
('ord6848814c7e18e', 'b14', '2025-06-11 02:02:36', 'paid', 10000.00, 0, 10000.00, 'nv1001'),
('ord68488184715f8', 'b12', '2025-06-11 02:03:32', 'paid', 42000.00, 0, 42000.00, 'nv1001'),
('ord6849b5258851d', 'b12', '2025-06-11 23:56:05', 'paid', 42000.00, 0, 42000.00, 'nv1001'),
('ord6849b57cd5cb2', 'b12', '2025-06-11 23:57:32', 'paid', 199000.00, 0, 199000.00, 'nv1001'),
('ord684c62de701a8', 'b12', '2025-06-14 00:41:50', 'paid', 199000.00, 0, 199000.00, 'nv1001'),
('ord684c6625008f9', 'b11', '2025-06-14 00:55:49', 'paid', 64000.00, 0, 64000.00, 'nv1001'),
('ord684c6bc527ac8', 'b9', '2025-06-14 01:19:49', 'paid', 180000.00, 0, 180000.00, 'nv1001'),
('ord684faed110c5b', 'b4', '2025-06-16 12:42:41', 'paid', 384000.00, 0, 384000.00, 'nv684e8aa75ffc8'),
('ord684fb0874196c', 'b20', '2025-06-16 12:49:59', 'paid', 12000.00, 0, 12000.00, 'nv684e8aa75ffc8'),
('ord684fb1dd544e4', 'b20', '2025-06-16 12:55:41', 'paid', 126000.00, 0, 126000.00, 'nv684e8aa75ffc8'),
('ord684fc36c08d5c', 'b9', '2025-06-16 14:10:36', 'paid', 199000.00, 0, 199000.00, 'nv1001'),
('ord684fc3f7b5c29', 'b3', '2025-06-16 14:12:55', 'paid', 136000.00, 0, 136000.00, 'nv1001'),
('ord684fc4a7b6136', 'b19', '2025-06-16 14:15:51', 'paid', 126000.00, 0, 126000.00, 'nv1001'),
('ord68512e51eee12', 'b20', '2025-06-17 15:58:57', 'paid', 138000.00, 0, 138000.00, 'nv1001'),
('ord687d0482a5ccd', 'b16', '2025-07-20 22:00:18', 'paid', 82000.00, 0, 82000.00, 'nv1001'),
('ord687d0e5f53883', 'b9', '2025-07-20 22:42:23', 'paid', 106000.00, 0, 106000.00, 'nv1001'),
('ord687d113a59715', 'b3', '2025-07-20 22:54:34', 'paid', 248000.00, 0, 248000.00, 'nv1001'),
('ord687f7200e7f2a', 'b14', '2025-07-22 18:12:00', 'paid', 106000.00, 0, 106000.00, 'nv68487452e1adc'),
('ord6890bc30a5e36', 'b20', '2025-08-04 20:57:04', 'paid', 199000.00, 0, 199000.00, 'nv1001'),
('ord6899e0fbd8a90', 'b9', '2025-08-11 19:24:27', 'paid', 199000.00, 0, 199000.00, 'nv1001'),
('ord6899e11de0cf7', 'b20', '2025-08-11 19:25:01', 'paid', 680000.00, 0, 680000.00, 'nv1001'),
('ord68a447d34c905', 'b13', '2025-08-19 16:45:55', 'paid', 352000.00, 0, 352000.00, 'nv1001'),
('ord68a44e899438b', 'b4', '2025-08-19 17:14:33', 'paid', 272000.00, 0, 272000.00, 'nv1002'),
('ord68a4564562bc0', 'b3', '2025-08-19 17:47:33', 'paid', 199000.00, 0, 199000.00, 'nv1006'),
('ord68a45667b55ed', 'b4', '2025-08-19 17:48:07', 'paid', 352000.00, 0, 352000.00, 'nv1006'),
('ord68a456756423c', 'b6', '2025-08-19 17:48:21', 'paid', 687000.00, 0, 687000.00, 'nv1006'),
('ord68a4568713c9a', 'b4', '2025-08-19 17:48:39', 'paid', 1393000.00, 0, 1393000.00, 'nv1006'),
('ord68a45abc82d78', 'b5', '2025-08-19 18:06:36', 'paid', 106000.00, 0, 106000.00, 'nv1001'),
('ord68a45c88b0fc8', 'b4', '2025-08-19 18:14:16', 'paid', 106000.00, 0, 106000.00, 'nv1001'),
('ord68a4606a9db26', 'b9', '2025-08-19 18:30:50', 'paid', 308000.00, 0, 308000.00, 'nv1001'),
('ord68a46572ab14a', 'b16', '2025-08-19 18:52:18', 'paid', 352000.00, 0, 352000.00, 'nv1009'),
('ord68a4657fee8cf', 'b9', '2025-08-19 18:52:31', 'paid', 190000.00, 0, 190000.00, 'nv1009'),
('ord68a47cdb4b814', 'b12', '2025-08-19 20:32:11', 'paid', 106000.00, 0, 106000.00, 'nv1001'),
('ord68a47d06c89cf', 'b13', '2025-08-19 20:32:54', 'paid', 36000.00, 0, 36000.00, 'nv1006'),
('ord68a82542ee0dd', 'b9', '2025-08-22 15:07:30', 'paid', 186000.00, 0, 186000.00, 'nv1001'),
('ord68a834204bb3a', 'b6', '2025-08-22 16:10:56', 'paid', 106000.00, 0, 106000.00, 'nv68487452e1adc'),
('ord68a8342e441d5', 'b2', '2025-08-22 16:11:10', 'paid', 199000.00, 0, 199000.00, 'nv68487452e1adc'),
('ord68a99d11bdd80', 'b3', '2025-08-23 17:50:57', 'paid', 24000.00, 0, 24000.00, 'nv1001'),
('ord68a9a0ac0c328', 'b3', '2025-08-23 18:06:20', 'paid', 107000.00, 0, 107000.00, 'nv1001');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shifts`
--

CREATE TABLE `shifts` (
  `ShiftID` int(11) NOT NULL,
  `StaffID` varchar(50) NOT NULL,
  `CheckInTime` datetime NOT NULL,
  `CheckOutTime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shifts`
--

INSERT INTO `shifts` (`ShiftID`, `StaffID`, `CheckInTime`, `CheckOutTime`) VALUES
(2, 'nv1002', '2025-08-19 17:14:29', '2025-08-19 17:14:54'),
(3, 'nv1006', '2025-08-19 17:47:26', '2025-08-19 17:48:58'),
(12, 'nv1009', '2025-08-19 18:52:14', '2025-08-19 18:52:45'),
(13, 'nv1001', '2025-08-19 20:32:05', '2025-08-19 20:32:21'),
(14, 'nv1006', '2025-08-19 20:32:52', '2025-08-19 20:33:01'),
(15, 'nv1006', '2025-08-19 20:33:44', '2025-08-19 20:33:55'),
(16, 'nv1001', '2025-08-22 15:07:28', '2025-08-22 15:07:46'),
(17, 'nv68487452e1adc', '2025-08-22 16:10:52', '2025-08-22 16:11:21'),
(18, 'nv1001', '2025-08-23 17:51:08', '2025-08-23 17:51:17'),
(19, 'nv1001', '2025-08-23 18:06:17', '2025-08-23 18:06:33');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `staffs`
--

CREATE TABLE `staffs` (
  `StaffID` varchar(20) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Code` varchar(50) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Position` varchar(50) NOT NULL,
  `Phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `staffs`
--

INSERT INTO `staffs` (`StaffID`, `Name`, `Code`, `Password`, `Position`, `Phone`) VALUES
('nv1001', 'Tiến Duy', 'ad01', '$2y$10$VFb3TsAZmzvX7j81gCzp4urHE4m7L/TjBHRvFQkCxWVA21w6RG7lK', 'Quản lý', '0901000001'),
('nv1002', 'Quyền Linh', 'tn02', '123456', 'Thu ngân', '0901000002'),
('nv1003', 'Nguyễn Tuấn Đạt', 'tn03', '123456', 'Thu ngân', '0901000003'),
('nv1004', 'Phú Thịnh', 'tn04', '123456', 'Thu ngân', '0901000004'),
('nv1005', 'Tường Vy', 'tn05', '123456', 'Thu ngân', '0901000005'),
('nv1006', 'Nguyễn Gia Khánh', 'nv06', '$2y$10$HztvtUAr7h9teeMBu/NMve0VA84qnv5o92HaGEw6Uv6YcK4D4FqzK', 'Phục vụ', '0901000006'),
('nv1007', 'Thanh Em', 'nv07', '123456', 'Phục vụ', '0901000007'),
('nv1008', 'Hoàng HIẾU', 'nv08', '123456', 'Phục vụ', '0901000008'),
('nv1009', 'Lê Kỳ', 'nv09', '123456', 'Phục vụ', '0901000009'),
('nv1010', 'Hào', 'nv10', '123456', 'Phục vụ', '0901000010'),
('nv1011', 'Nguyên', 'nv11', '123456', 'Phục vụ', '0901000011'),
('nv1012', 'Lê Minh Khang', 'nv12', '123456', 'Phục vụ', '0901000012'),
('nv1013', 'Nguyễn Chí Hiếu', 'nv13', '123456', 'Phục vụ', '0901000013'),
('nv1014', 'Huỳnh Lê Chí Thanh', 'nv14', '123456', 'Phục vụ', '0901000014'),
('nv1015', 'Huỳnh Hoàng Tân', 'nv15', '123456', 'Phục vụ', '0901000015'),
('nv1016', 'Huỳnh Trịnh Thông', 'nv16', '123456', 'Phục vụ', '0901000016'),
('nv1017', 'Trương Vĩnh Kỳ', 'nv17', '123456', 'Phục vụ', '0901000017'),
('nv1018', 'Giang Lộc Phát', 'nv18', '123456', 'Phục vụ', '0901000018'),
('nv1019', 'Nguyễn Đức Thắng', 'nv19', '123456', 'Phục vụ', '0901000019'),
('nv1020', 'Nguyễn Thụy Hoàng Anh', 'nv20', '123456', 'Phục vụ', '0901000020'),
('nv1021', 'Trần Thị Ngọc Thi', 'nv21', '123456', 'Phục vụ', '0901000021'),
('nv1022', 'Phương Anh lê', 'nv22', '123456', 'Phục vụ', '0901000022'),
('nv1023', 'Nguyễn Ngọc Tố Anh', 'nv23', '123456', 'Phục vụ', '0901000023'),
('nv1025', 'Phạm Quỳnh Lam', 'nv25', '123456', 'Phục vụ', '0901000025'),
('nv1026', 'Bùi Thị Xuân Mai', 'nv26', '123456', 'Phục vụ', '0901000026'),
('nv1027', 'Nguyễn Diễm Quỳnh YK4', 'nv27', '123456', 'Phục vụ', '0901000027'),
('nv1028', 'Hồng Nhung', 'nv28', '123456', 'Phục vụ', '0901000028'),
('nv1029', 'Phương Anh', 'nv29', '123456', 'Phục vụ', '0901000029'),
('nv1030', 'Trịnh Hoàng Minh', 'nv30', '123456', 'Phục vụ', '0901000030'),
('nv1031', 'Hữu Tài', 'nv31', '123456', 'Thu ngân', '0901000031'),
('nv1032', 'Hữu Liên', 'nv32', '123456', 'Thu ngân', '0901000032'),
('nv1033', 'Phạm Nhật Anh', 'db02', '123456', 'Đầu bếp', '0901000033'),
('nv1034', 'La Tường Bửu', 'db03', '123456', 'Đầu bếp', '0901000034'),
('nv1035', 'Ngô Văn Ngoan', 'db04', '123456', 'Đầu bếp', '0901000035'),
('nv1036', 'Lê Thị Mỹ Ngọc', 'db05', '123456', 'Đầu bếp', '0901000036'),
('nv1037', 'Trần Anh Duy yaki3', 'db06', '123456', 'Đầu bếp', '0901000037'),
('nv1038', 'Uyên Nhi', 'db07', '123456', 'Đầu bếp', '0901000038'),
('nv1039', 'phú', 'db08', '123456', 'Đầu bếp', '0901000039'),
('nv1040', 'Chí Nguyên', 'db09', '123456', 'Đầu bếp', '0901000040'),
('nv1041', 'khánh duy', 'db10', '123456', 'Đầu bếp', '0901000041'),
('nv68487452e1adc', 'Minh Duy', 'ad02', '123456', 'Quản lý', '0987762516'),
('nv684e8aa75ffc8', 'Minh Duy', 'md1', '111111', 'Quản lý', '0986727162');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tables`
--

CREATE TABLE `tables` (
  `TableID` varchar(20) NOT NULL,
  `Name` varchar(50) DEFAULT NULL,
  `ENUM` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tables`
--

INSERT INTO `tables` (`TableID`, `Name`, `ENUM`) VALUES
('b1', 'Bàn 1', 'trống'),
('b10', 'Bàn 10', 'trống'),
('b11', 'Bàn 11', 'trống'),
('b12', 'Bàn 12', 'trống'),
('b13', 'Bàn 13', 'trống'),
('b14', 'Bàn 14', 'trống'),
('b15', 'Bàn 15', 'trống'),
('b16', 'Bàn 16', 'trống'),
('b17', 'Bàn 17', 'trống'),
('b18', 'Bàn 18', 'trống'),
('b19', 'Bàn 19', 'trống'),
('b2', 'Bàn 2', 'trống'),
('b20', 'Bàn 20', 'trống'),
('b3', 'Bàn 3', 'trống'),
('b4', 'Bàn 4', 'trống'),
('b5', 'Bàn 5', 'trống'),
('b6', 'Bàn 6', 'trống'),
('b7', 'Bàn 7', 'trống'),
('b8', 'Bàn 8', 'trống'),
('b9', 'Bàn 9', 'trống');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `transactions`
--

CREATE TABLE `transactions` (
  `TransactionID` varchar(20) NOT NULL,
  `OrderID` varchar(20) NOT NULL,
  `Amount` decimal(18,2) NOT NULL,
  `Timestamp` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `transactions`
--

INSERT INTO `transactions` (`TransactionID`, `OrderID`, `Amount`, `Timestamp`) VALUES
('trans68487a1c6aba8', 'ord68487a131622f', 330000.00, '2025-06-11 01:31:56'),
('trans68487a2991b17', 'ord68487a23f2143', 330000.00, '2025-06-11 01:32:09'),
('trans68487a335e7ab', 'ord68487a2f8fe99', 330000.00, '2025-06-11 01:32:19'),
('trans68487a47199ca', 'ord68487a3810058', 199000.00, '2025-06-11 01:32:39'),
('trans68487dd5c0e81', 'ord68487dc995499', 271800.00, '2025-06-11 01:47:49'),
('trans6848815096a17', 'ord6848814c7e18e', 10000.00, '2025-06-11 02:02:40'),
('trans684881a1d528f', 'ord68488184715f8', 42000.00, '2025-06-11 02:04:01'),
('trans6849b53d3b6eb', 'ord6849b5258851d', 42000.00, '2025-06-11 23:56:29'),
('trans6849b5ac701a2', 'ord6849b57cd5cb2', 199000.00, '2025-06-11 23:58:20'),
('trans684c62e6f0181', 'ord684c62de701a8', 199000.00, '2025-06-14 00:41:58'),
('trans684c66294fdcf', 'ord684c6625008f9', 64000.00, '2025-06-14 00:55:53'),
('trans684c6bc86c0d6', 'ord684c6bc527ac8', 180000.00, '2025-06-14 01:19:52'),
('trans684faedcdfd69', 'ord684faed110c5b', 307200.00, '2025-06-16 12:42:52'),
('trans684fb090bf13d', 'ord684fb0874196c', 12000.00, '2025-06-16 12:50:08'),
('trans684fb1e1eec76', 'ord684fb1dd544e4', 126000.00, '2025-06-16 12:55:45'),
('trans684fc37874437', 'ord684fc36c08d5c', 199000.00, '2025-06-16 14:10:48'),
('trans684fc3fe440cf', 'ord684fc3f7b5c29', 136000.00, '2025-06-16 14:13:02'),
('trans684fc4abe333d', 'ord684fc4a7b6136', 126000.00, '2025-06-16 14:15:55'),
('trans687cfae97cb0e', 'ord68512e51eee12', 138000.00, '2025-07-20 21:19:21'),
('trans687d0577e643a', 'ord687d0482a5ccd', 82000.00, '2025-07-20 22:04:23'),
('trans687d0e627aa43', 'ord687d0e5f53883', 106000.00, '2025-07-20 22:42:26'),
('trans687d1148618a1', 'ord687d113a59715', 248000.00, '2025-07-20 22:54:48'),
('trans687f7204aeb9f', 'ord687f7200e7f2a', 106000.00, '2025-07-22 18:12:04'),
('trans6890bc4739c3e', 'ord6890bc30a5e36', 199000.00, '2025-08-04 20:57:27'),
('trans6899e108f12b9', 'ord6899e0fbd8a90', 199000.00, '2025-08-11 19:24:40'),
('trans6899e13e20fba', 'ord6899e11de0cf7', 612000.00, '2025-08-11 19:25:34'),
('trans68a447d92b95a', 'ord68a447d34c905', 352000.00, '2025-08-19 16:46:01'),
('trans68a44e9028ded', 'ord68a44e899438b', 272000.00, '2025-08-19 17:14:40'),
('trans68a45658afe99', 'ord68a4564562bc0', 199000.00, '2025-08-19 17:47:52'),
('trans68a4566d30001', 'ord68a45667b55ed', 352000.00, '2025-08-19 17:48:13'),
('trans68a4567bde423', 'ord68a456756423c', 687000.00, '2025-08-19 17:48:27'),
('trans68a456926d2cd', 'ord68a4568713c9a', 1393000.00, '2025-08-19 17:48:50'),
('trans68a45ac02845a', 'ord68a45abc82d78', 106000.00, '2025-08-19 18:06:40'),
('trans68a45c8c029e9', 'ord68a45c88b0fc8', 106000.00, '2025-08-19 18:14:20'),
('trans68a4606fd2c9e', 'ord68a4606a9db26', 308000.00, '2025-08-19 18:30:55'),
('trans68a4657a28b0b', 'ord68a46572ab14a', 352000.00, '2025-08-19 18:52:26'),
('trans68a46583ebdb3', 'ord68a4657fee8cf', 190000.00, '2025-08-19 18:52:35'),
('trans68a47cdfb3474', 'ord68a47cdb4b814', 106000.00, '2025-08-19 20:32:15'),
('trans68a47d0996a6f', 'ord68a47d06c89cf', 36000.00, '2025-08-19 20:32:57'),
('trans68a825494bce7', 'ord68a82542ee0dd', 186000.00, '2025-08-22 15:07:37'),
('trans68a8342373d9f', 'ord68a834204bb3a', 106000.00, '2025-08-22 16:10:59'),
('trans68a83433cc181', 'ord68a8342e441d5', 199000.00, '2025-08-22 16:11:15'),
('trans68a99d1481b3a', 'ord68a99d11bdd80', 24000.00, '2025-08-23 17:51:00'),
('trans68a9a0b28ed00', 'ord68a9a0ac0c328', 107000.00, '2025-08-23 18:06:26');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `dishes`
--
ALTER TABLE `dishes`
  ADD PRIMARY KEY (`DishID`);

--
-- Chỉ mục cho bảng `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name_unique` (`name`);

--
-- Chỉ mục cho bảng `ingredient_logs`
--
ALTER TABLE `ingredient_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ingredient_id` (`ingredient_id`);

--
-- Chỉ mục cho bảng `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`OrderItemID`),
  ADD KEY `OrderID` (`OrderID`),
  ADD KEY `DishID` (`DishID`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `TableID` (`TableID`),
  ADD KEY `StaffID` (`StaffID`);

--
-- Chỉ mục cho bảng `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`ShiftID`),
  ADD KEY `StaffID` (`StaffID`);

--
-- Chỉ mục cho bảng `staffs`
--
ALTER TABLE `staffs`
  ADD PRIMARY KEY (`StaffID`),
  ADD UNIQUE KEY `Code` (`Code`);

--
-- Chỉ mục cho bảng `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`TableID`);

--
-- Chỉ mục cho bảng `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`TransactionID`),
  ADD KEY `OrderID` (`OrderID`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT cho bảng `ingredient_logs`
--
ALTER TABLE `ingredient_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `OrderItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1682;

--
-- AUTO_INCREMENT cho bảng `shifts`
--
ALTER TABLE `shifts`
  MODIFY `ShiftID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `ingredient_logs`
--
ALTER TABLE `ingredient_logs`
  ADD CONSTRAINT `ingredient_logs_ibfk_1` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`);

--
-- Các ràng buộc cho bảng `orderitems`
--
ALTER TABLE `orderitems`
  ADD CONSTRAINT `orderitems_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`),
  ADD CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`DishID`) REFERENCES `dishes` (`DishID`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`TableID`) REFERENCES `tables` (`TableID`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`StaffID`) REFERENCES `staffs` (`StaffID`);

--
-- Các ràng buộc cho bảng `shifts`
--
ALTER TABLE `shifts`
  ADD CONSTRAINT `shifts_ibfk_1` FOREIGN KEY (`StaffID`) REFERENCES `staffs` (`StaffID`);

--
-- Các ràng buộc cho bảng `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
