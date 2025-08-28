// Kiểm tra quyền truy cập: Chỉ Quản lý mới được xem báo cáo
const userRole = sessionStorage.getItem('role');
if (userRole !== 'Quản lý') {
    alert('Bạn không có quyền truy cập vào trang này.');
    window.location.href = 'index.html'; // Chuyển hướng về trang chính
}
document.addEventListener('DOMContentLoaded', () => {
    const shiftsTableBody = document.getElementById('shiftsTable').querySelector('tbody');
    const messageEl = document.getElementById('message');
    const filterBtn = document.getElementById('filterBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    // Lấy thông tin người dùng từ sessionStorage
    const currentUserRole = sessionStorage.getItem('role');
    const currentStaffId = sessionStorage.getItem('staffId');

    if (!currentUserRole || !currentStaffId) {
        const mainContent = document.querySelector('.container');
        if (mainContent) {
            mainContent.innerHTML = '<p class="error-message">Bạn cần đăng nhập để xem báo cáo này.</p>';
        }
        return;
    }

    // Hàm định dạng tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    // Hàm gọi API và hiển thị dữ liệu
    async function fetchAndRenderShifts(startDate = null, endDate = null) {
        let apiUrl = 'api/shifts_report.php';
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        // Thêm vai trò và ID nhân viên vào tham số
        params.append('role', currentUserRole);
        params.append('staffId', currentStaffId);

        if (params.toString()) {
            apiUrl += '?' + params.toString();
        }

        try {
            messageEl.textContent = 'Đang tải dữ liệu...';
            shiftsTableBody.innerHTML = '';
            
            const response = await fetch(apiUrl);
            
            // Kiểm tra phản hồi HTTP
            if (!response.ok) {
                throw new Error(`Lỗi HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                if (data.shifts && data.shifts.length > 0) {
                    messageEl.textContent = '';
                    data.shifts.forEach(shift => {
                        const row = shiftsTableBody.insertRow();
                            row.insertCell(0).textContent = shift.StaffName;
                            row.insertCell(1).textContent = shift.StaffCode;
                            row.insertCell(2).textContent = shift.CheckInTime;
                            row.insertCell(3).textContent = shift.CheckOutTime ? shift.CheckOutTime : 'Chưa Check-out';
                            row.insertCell(4).textContent = formatCurrency(shift.TotalRevenue);
                        });
                } else {
                    messageEl.textContent = data.message;
                }
            } else {
                messageEl.textContent = data.message || 'Không thể tải dữ liệu ca làm việc.';
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu ca làm việc:', error);
            messageEl.textContent = 'Đã xảy ra lỗi khi kết nối máy chủ: ' + error.message;
        }
    }

    // Xử lý sự kiện lọc
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            fetchAndRenderShifts(startDateInput.value, endDateInput.value);
        });
    }
    // Tải dữ liệu lần đầu
    fetchAndRenderShifts();
});