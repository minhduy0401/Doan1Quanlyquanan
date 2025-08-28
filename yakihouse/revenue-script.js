document.addEventListener('DOMContentLoaded', async () => {
    const deleteHistoryBtn = document.getElementById('deleteHistoryBtn');
    const dailyRevenueEl = document.getElementById('dailyRevenue');
    const weeklyRevenueEl = document.getElementById('weeklyRevenue');
    const monthlyRevenueEl = document.getElementById('monthlyRevenue');
    const yearlyRevenueEl = document.getElementById('yearlyRevenue');
    const totalFilteredRevenueEl = document.getElementById('totalFilteredRevenue');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const filterRevenueBtn = document.getElementById('filterRevenueBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const transactionListUl = document.getElementById('transactionList');
    const ctx = document.getElementById('revenueChart').getContext('2d');
    let revenueChart = null; // Biến để lưu instance biểu đồ

    // Hàm định dạng tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    // Hàm kiểm tra quyền
    const userRole = sessionStorage.getItem('role');
    if (userRole !== 'Quản lý') {
        alert('Bạn không có quyền truy cập vào trang này.');
        window.location.href = 'index.html'; // Chuyển hướng về trang chính
    }

    // Hàm tải và hiển thị doanh thu
    async function loadAndDisplayRevenue(startDate = null, endDate = null) {
        let apiUrl = 'api/transactions.php';
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
        if (endDate) params.append('endDate', endDate.toISOString().split('T')[0]);
        
        if (startDate || endDate) {
            apiUrl += '?' + params.toString();
        }

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            let dailyRevenue = 0;
            let weeklyRevenue = 0;
            let monthlyRevenue = 0;
            let yearlyRevenue = 0;
            const now = new Date();
            const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()); 
            const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay())); 
            
            const dailyRevenueData = {};

            if (data.success && data.transactions.length > 0) {
                transactionListUl.innerHTML = '';
                
                data.transactions.forEach(transaction => {
                    const li = document.createElement('li');
                    const transactionDate = new Date(transaction.Timestamp); 
                    
                    const formattedDateTime = transactionDate.toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    li.innerHTML = `
                        <strong>${formattedDateTime}</strong>
                        ${transaction.TableName} -
                        Tổng cộng: ${formatCurrency(transaction.Amount)}
                    `;
                    transactionListUl.appendChild(li);

                    // Tính toán doanh thu tổng quan
                    const amount = parseFloat(transaction.Amount);

                    if (transactionDate.getDate() === now.getDate() && transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()) {
                        dailyRevenue += amount;
                    }
                    if (transactionDate >= startOfWeek && transactionDate <= endOfWeek) {
                        weeklyRevenue += amount;
                    }
                    if (transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()) {
                        monthlyRevenue += amount;
                    }
                    if (transactionDate.getFullYear() === now.getFullYear()) {
                        yearlyRevenue += amount;
                    }

                    // Tính toán dữ liệu cho biểu đồ
                    const dateKey = transactionDate.toISOString().split('T')[0];
                    if (!dailyRevenueData[dateKey]) {
                        dailyRevenueData[dateKey] = 0;
                    }
                    dailyRevenueData[dateKey] += amount;
                });
            } else {
                transactionListUl.innerHTML = `<li class="empty-message">${data.message || 'Không có giao dịch nào được ghi nhận.'}</li>`;
            }

            // Hiển thị tổng doanh thu đã lọc
            if (data.success) {
                const totalRevenue = data.transactions.reduce((sum, t) => sum + parseFloat(t.Amount), 0);
                totalFilteredRevenueEl.textContent = formatCurrency(totalRevenue);
            } else {
                totalFilteredRevenueEl.textContent = formatCurrency(0);
            }

            // Cập nhật doanh thu tổng quan
            dailyRevenueEl.textContent = formatCurrency(dailyRevenue);
            weeklyRevenueEl.textContent = formatCurrency(weeklyRevenue);
            monthlyRevenueEl.textContent = formatCurrency(monthlyRevenue);
            yearlyRevenueEl.textContent = formatCurrency(yearlyRevenue);

            // Cập nhật biểu đồ doanh thu
            if (revenueChart) {
                revenueChart.destroy(); // Xóa biểu đồ cũ nếu có
            }
            
            const labels = Object.keys(dailyRevenueData).sort();
            const revenues = labels.map(key => dailyRevenueData[key]);
            
            revenueChart = new Chart(ctx, {
                type: 'bar', 
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Doanh thu (VND)',
                        data: revenues,
                        backgroundColor: 'rgba(0, 80, 241, 0.85)',
                        borderColor: 'rgba(0, 1, 74, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Doanh thu (VND)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Ngày'
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += formatCurrency(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu doanh thu:', error);
            totalFilteredRevenueEl.textContent = formatCurrency(0);
            transactionListUl.innerHTML = '<li class="empty-message">Đã xảy ra lỗi khi kết nối máy chủ.</li>';
        }
    }

    // Xóa lịch sử giao dịch
    deleteHistoryBtn.addEventListener('click', async () => {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử doanh thu?')) {
            try {
                const response = await fetch('api/transactions.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                if (data.success) {
                    alert(data.message);
                    loadAndDisplayRevenue();
                } else {
                    alert('Lỗi khi xóa: ' + data.message);
                }
            } catch (error) {
                console.error('Lỗi API khi xóa:', error);
                alert('Không thể xóa dữ liệu doanh thu.');
            }
        }
    });

    // Lọc doanh thu
    filterRevenueBtn.addEventListener('click', () => {
        const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
        if (startDate && endDate && startDate > endDate) {
            alert('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
            return;
        }
        loadAndDisplayRevenue(startDate, endDate);
    });

    // Đặt lại bộ lọc
    resetFilterBtn.addEventListener('click', () => {
        startDateInput.value = '';
        endDateInput.value = '';
        loadAndDisplayRevenue();
    });

    // Tải dữ liệu lần đầu khi trang được mở
    loadAndDisplayRevenue();
});