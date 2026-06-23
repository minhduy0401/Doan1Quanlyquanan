# 🍖 Quán Buffet BBQ - Hệ Thống Quản Lý Nhà Hàng

<div align="center">
  <img src="image/logo.png" alt="Quán Buffet BBQ Logo" width="200"/>
  
  ### Hệ thống quản lý nhà hàng Buffet BBQ toàn diện
  
  [![PHP](https://img.shields.io/badge/PHP-8.0-blue)](https://www.php.net/)
  [![MySQL](https://img.shields.io/badge/MySQL-10.4-orange)](https://www.mysql.com/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![License](https://img.shields.io/badge/License-Personal-red)]()
</div>

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng](#-tính-năng)
- [Công Nghệ](#-công-nghệ)
- [Cài Đặt](#-cài-đặt)
- [Sử Dụng](#-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Đóng Góp](#-đóng-góp)
- [License](#-license)

---

## 🎯 Giới Thiệu

**Quán Buffet BBQ** là hệ thống quản lý nhà hàng được phát triển với mục đích:

- ✅ Quản lý gọi món và tính tiền nhanh chóng
- ✅ Quản lý bàn ăn theo thời gian thực
- ✅ Quản lý menu và giá món ăn
- ✅ Quản lý kho nguyên liệu
- ✅ Quản lý nhân viên và ca làm việc
- ✅ Báo cáo doanh thu chi tiết
- ✅ Dashboard thống kê trực quan

**Phiên bản hiện tại:** 2.0  
**Ngày phát hành:** 2024  
**Phát triển bởi:** Đồ án 1 - Quản lý quán ăn

---

## ✨ Tính Năng

### 🏠 Dashboard
- Thống kê doanh thu hôm nay
- Biểu đồ doanh thu 7 ngày gần nhất
- Số lượng đơn hàng, món ăn, bàn
- Danh sách đơn hàng mới nhất
- Top món bán chạy
- Cảnh báo nguyên liệu sắp hết

### 🍽️ Quản Lý Món Ăn
- Thêm/sửa/xóa món ăn
- Upload hình ảnh món ăn
- Quản lý danh mục: Món nướng, Món lẩu, Món tráng miệng, Buffet
- Tìm kiếm món theo tên
- Lọc món theo danh mục
- Sắp xếp theo tên, giá
- Chỉnh giá nhanh
- Trạng thái món: Đang bán / Hết món / Ẩn

### 🪑 Quản Lý Bàn
- 20 bàn ăn với trạng thái real-time
- Trạng thái: Trống / Đang dùng / Chờ thanh toán
- Phân khu vực: Khu A, B, C, D
- Số lượng ghế mỗi bàn
- Lọc bàn theo trạng thái
- Chuyển bàn (có thể mở rộng)

### 📦 Quản Lý Đơn Hàng
- Tạo đơn hàng mới
- Thêm/xóa món vào đơn
- Tăng/giảm số lượng món
- Ghi chú đơn hàng
- Tính tiền tự động
- Giảm giá theo %
- Trạng thái đơn: Mới tạo / Đang chế biến / Đã phục vụ / Chờ thanh toán / Đã thanh toán / Đã hủy
- Hủy đơn hàng
- In hóa đơn

### 💰 Thanh Toán & Hóa Đơn
- 2 bước thanh toán: Chuẩn bị → Xác nhận
- Tính tổng tiền, giảm giá
- Phương thức thanh toán: Tiền mặt / Chuyển khoản / Thẻ / Ví điện tử
- Hóa đơn chi tiết với logo, thông tin quán
- In hóa đơn (Ctrl+P)
- Lưu lịch sử giao dịch

### 👥 Quản Lý Nhân Viên
- Thêm/sửa/xóa nhân viên
- Phân quyền: Quản lý / Thu ngân / Phục vụ / Bếp trưởng / Đầu bếp
- Mật khẩu được mã hóa bcrypt
- Thông tin: Tên, mã, chức vụ, SĐT, email, địa chỉ
- Trạng thái: Đang làm / Nghỉ việc

### ⏰ Quản Lý Ca Làm Việc
- Check-in / Check-out ca làm
- Báo cáo ca làm theo ngày
- Tính doanh thu theo ca của nhân viên
- Lịch sử ca làm việc

### 📦 Quản Lý Kho Nguyên Liệu
- Danh sách nguyên liệu
- Nhập kho / Xuất kho
- Đơn vị tính, số lượng tồn
- Mức cảnh báo tồn kho
- Danh mục nguyên liệu: Thịt / Hải sản / Rau củ / Gia vị / Khác
- Lịch sử nhập/xuất kho
- Cảnh báo nguyên liệu sắp hết
- Nhà cung cấp

### 📊 Báo Cáo & Thống Kê
- Doanh thu theo ngày, tuần, tháng, năm
- Biểu đồ doanh thu (Chart.js)
- Lọc doanh thu theo khoảng thời gian
- Lịch sử giao dịch chi tiết
- Số lượng đơn hàng
- Món bán chạy
- Export dữ liệu (có thể mở rộng)

### 🔐 Bảo Mật
- Đăng nhập với mã nhân viên và mật khẩu
- Mật khẩu mã hóa bcrypt
- Session management
- Phân quyền theo chức vụ
- Prepared statements chống SQL Injection
- Auto logout khi hết session

### 📱 Responsive Design
- Tối ưu cho desktop (> 1024px)
- Tối ưu cho tablet (768px - 1024px)
- Tối ưu cho mobile (< 768px)
- Hamburger menu cho mobile
- Touch-friendly buttons

---

## 🛠️ Công Nghệ

### Backend
- **PHP 8.0+** - Server-side scripting
- **MySQL 10.4+** (MariaDB) - Database
- **MySQLi** - Database connector
- **bcrypt** - Password hashing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript ES6+** - Client-side logic
- **Chart.js 4.4.0** - Charts & graphs
- **jsPDF 2.5.1** - PDF generation

### Development Tools
- **XAMPP** - Development environment
- **phpMyAdmin** - Database management
- **Git** - Version control
- **VS Code** - Code editor

### Architecture
- **MVC Pattern** - Separation of concerns
- **RESTful API** - API design
- **AJAX** - Async communication
- **SessionStorage** - Client-side storage

---

## 📥 Cài Đặt

### Yêu Cầu Hệ Thống

- Windows 10/11 hoặc Linux
- XAMPP 8.0+ (Apache, MySQL, PHP)
- Trình duyệt hiện đại (Chrome, Firefox, Edge)
- RAM: >= 4GB
- Dung lượng: >= 1GB

### Bước 1: Tải Project

```bash
# Clone repository
git clone https://github.com/your-repo/yakihouse.git

# Hoặc download ZIP và giải nén vào:
C:\xampp\htdocs\Doan1Quanlyquanan\yakihouse
```

### Bước 2: Import Database

1. Mở XAMPP Control Panel
2. Start Apache và MySQL
3. Mở phpMyAdmin: `http://localhost/phpmyadmin`
4. Tạo database mới tên `yakihouse`
5. Import file: `data/yakihouse.sql`

### Bước 3: Cấu Hình Database

File: `api/db_connect.php`

```php
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = '';  // Mật khẩu MySQL (mặc định trống)
$DB_NAME = 'yakihouse';
$DB_PORT = 3306;
```

### Bước 4: Nâng Cấp Database (v2.0)

```sql
-- Chạy migration script trong phpMyAdmin
-- File: data/upgrade_migration.sql
```

### Bước 5: Khởi Chạy

```
URL: http://localhost/Doan1Quanlyquanan/yakihouse/
```

### Tài Khoản Mặc Định

**Quản lý:**
- Mã: `nv1001`
- Mật khẩu: `1234`

**Thu ngân:**
- Mã: `nv1002`
- Mật khẩu: `1234`

---

## 🚀 Sử Dụng

### 1. Đăng Nhập

```
URL: http://localhost/Doan1Quanlyquanan/yakihouse/login.html
```

### 2. Dashboard

```
URL: http://localhost/Doan1Quanlyquanan/yakihouse/dashboard.html
```

### 3. Gọi Món & Tính Bill

```
URL: http://localhost/Doan1Quanlyquanan/yakihouse/index.html
```

**Luồng:**
1. Check-in ca làm việc (sidebar)
2. Chọn bàn
3. Thêm món vào order
4. Điều chỉnh số lượng
5. Nhập giảm giá (nếu có)
6. Click "Thanh Toán"
7. Click "Xác Nhận Thanh Toán"
8. In hóa đơn
9. Check-out khi hết ca

### 4. Quản Lý Món Ăn (Quản lý)

```
URL: http://localhost/Doan1Quanlyquanan/yakihouse/dishes.html
```

### 5. Quản Lý Nhân Viên (Quản lý)

```
URL: http://localhost/Doan1Quanlyquanan/yakihouse/staff.html
```

### 6. Quản Lý Kho

```
URL: http://localhost/Doan1Quanlyquanan/yakihouse/ingredients.html
```

### 7. Báo Cáo Doanh Thu (Quản lý)

```
URL: http://localhost/Doan1Quanlyquanan/yakihouse/revenue.html
```

---

## 📁 Cấu Trúc Dự Án

```
yakihouse/
│
├── api/                          # Backend API
│   ├── auth.php                  # Authentication
│   ├── db_connect.php            # Database connection
│   ├── dishes.php                # Dishes CRUD
│   ├── tables.php                # Tables management
│   ├── orders.php                # Orders management
│   ├── ingredients.php           # Ingredients management
│   ├── staff.php                 # Staff management
│   ├── shifts.php                # Shifts management
│   ├── shifts_report.php         # Shifts reporting
│   └── transactions.php          # Transactions management
│
├── data/                         # Database files
│   ├── yakihouse.sql             # Original database
│   └── upgrade_migration.sql     # v2.0 migration
│
├── image/                        # Images
│   ├── logo.png                  # Logo
│   ├── uploaded_dishes/          # Uploaded dish images
│   └── [other images]
│
├── *.html                        # Frontend pages
│   ├── login.html                # Login page
│   ├── dashboard.html            # Dashboard (v2.0)
│   ├── index.html                # Order & billing
│   ├── dishes.html               # Dishes management (v2.0)
│   ├── staff.html                # Staff management
│   ├── ingredients.html          # Ingredients management
│   ├── revenue.html              # Revenue reporting
│   ├── shifts_report.html        # Shifts reporting
│   └── change_password.html      # Change password
│
├── *.js                          # JavaScript files
│   ├── script.js                 # Main order logic
│   ├── dashboard-script.js       # Dashboard logic (v2.0)
│   ├── dishes-script.js          # Dishes management logic (v2.0)
│   ├── ingredients.js            # Ingredients logic
│   ├── revenue-script.js         # Revenue logic
│   ├── shifts_report.js          # Shifts report logic
│   └── change_password.js        # Change password logic
│
├── style.css                     # Main stylesheet
├── README.md                     # This file
└── .gitignore                    # Git ignore file
```

---

## 📡 API Documentation

### Authentication

#### POST `/api/auth.php`
Đăng nhập nhân viên

**Request:**
```json
{
  "code": "nv1001",
  "password": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "user": {
    "id": "nv1001",
    "name": "Nguyễn Văn A",
    "code": "nv1001",
    "position": "Quản lý",
    "role": "Quản lý",
    "phone": "0123456789"
  }
}
```

### Dishes API

#### GET `/api/dishes.php`
Lấy danh sách món ăn

**Response:**
```json
{
  "success": true,
  "dishes": [
    {
      "DishID": "m1",
      "Name": "Bắp Bò",
      "Price": "80000.00",
      "Category": "Món nướng",
      "ImagePath": "image/bapbo.jpg",
      "Status": "available",
      "Description": "Bắp bò Úc"
    }
  ]
}
```

#### POST `/api/dishes.php`
Thêm món mới

**Request:**
```json
{
  "name": "Tên món",
  "price": 80000,
  "category": "Món nướng",
  "description": "Mô tả",
  "image": "data:image/jpeg;base64,..."
}
```

#### PUT `/api/dishes.php`
Cập nhật giá món

**Request:**
```json
{
  "dishId": "m1",
  "price": 85000
}
```

#### DELETE `/api/dishes.php`
Xóa món

**Request:**
```json
{
  "dishId": "m1"
}
```

### Orders API

#### GET `/api/orders.php`
Lấy danh sách đơn hàng

#### POST `/api/orders.php`
Actions: `create_or_update`, `get_order`, `cancel_order`, `checkout`

**Create/Update Order:**
```json
{
  "action": "create_or_update",
  "orderId": "ord123" or null,
  "tableId": "b1",
  "staffId": "nv1001",
  "items": [
    {
      "id": "m1",
      "name": "Bắp Bò",
      "price": 80000,
      "quantity": 2
    }
  ],
  "subtotal": 160000,
  "discountPercent": 10,
  "total": 144000
}
```

### Tables API

#### GET `/api/tables.php`
Lấy danh sách bàn

#### PUT `/api/tables.php`
Cập nhật trạng thái bàn

```json
{
  "tableId": "b1",
  "status": "occupied"
}
```

---

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Quản Lý Món Ăn
![Dishes](docs/screenshots/dishes.png)

### Gọi Món & Tính Bill
![Orders](docs/screenshots/orders.png)

### Báo Cáo Doanh Thu
![Revenue](docs/screenshots/revenue.png)

---

## 🤝 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Để đóng góp:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Quy Tắc Đóng Góp

- Code phải clean và có comment
- Tuân thủ coding style hiện tại
- Test kỹ trước khi commit
- Viết commit message rõ ràng

---

## 📄 License

Dự án cá nhân - Bảo lưu mọi quyền

Copyright (c) 2024 Nguyễn Minh Duy

---

## 🙏 Cảm Ơn

Cảm ơn các công nghệ và thư viện mã nguồn mở:
- PHP
- MySQL
- Chart.js
- jsPDF
- Font Awesome (icons)

---

<div align="center">
  Made with ❤️ by Nguyễn Minh Duy

  [⬆ Về đầu trang](#-quán-buffet-bbq---hệ-thống-quản-lý-nhà-hàng)
</div>
