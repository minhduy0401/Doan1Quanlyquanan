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

    // Hàm tính giờ làm việc
    function calculateWorkHours(checkIn, checkOut) {
        if (!checkOut) return 'N/A';
        try {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffMs = end - start;
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            return `${diffHours}h ${diffMinutes}m`;
        } catch (e) {
            return 'N/A';
        }
    }

    // Hàm cập nhật stat cards
    function updateStatsCards(shifts) {
        const totalShifts = shifts.length;
        const totalRevenue = shifts.reduce((sum, shift) => sum + parseFloat(shift.TotalRevenue || 0), 0);
        const avgRevenue = totalShifts > 0 ? totalRevenue / totalShifts : 0;
        const activeStaffCount = shifts.filter(shift => !shift.CheckOutTime).length;

        document.getElementById('totalShifts').textContent = totalShifts;
        document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
        document.getElementById('avgRevenue').textContent = formatCurrency(avgRevenue);
        document.getElementById('activeStaffCount').textContent = activeStaffCount;
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
                    messageEl.style.display = 'none';
                    
                    // Update stat cards
                    updateStatsCards(data.shifts);
                    
                    // Render table rows
                    data.shifts.forEach(shift => {
                        const row = shiftsTableBody.insertRow();
                        row.insertCell(0).textContent = shift.StaffName;
                        row.insertCell(1).textContent = shift.StaffCode;
                        row.insertCell(2).textContent = shift.Position || 'N/A';
                        row.insertCell(3).textContent = shift.CheckInTime;
                        row.insertCell(4).textContent = shift.CheckOutTime ? shift.CheckOutTime : 'Chưa Check-out';
                        row.insertCell(5).textContent = calculateWorkHours(shift.CheckInTime, shift.CheckOutTime);
                        row.insertCell(6).textContent = formatCurrency(shift.TotalRevenue);
                    });
                } else {
                    messageEl.textContent = data.message || 'Không có dữ liệu ca làm việc.';
                    messageEl.style.display = 'block';
                    // Reset stats
                    updateStatsCards([]);
                }
            } else {
                messageEl.textContent = data.message || 'Không thể tải dữ liệu ca làm việc.';
                messageEl.style.display = 'block';
                // Reset stats
                updateStatsCards([]);
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