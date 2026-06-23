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
    const transactionListTbody = document.getElementById('transactionList');
    const ctx = document.getElementById('revenueChart').getContext('2d');
    let revenueChart = null; // Biến để lưu instance biểu đồ

    // Hàm định dạng tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    // Hàm tải và hiển thị doanh thu
    async function loadAndDisplayRevenue(startDate = '', endDate = '') {
        let apiUrl = 'api/transactions.php';
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
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
                transactionListTbody.innerHTML = '';
                
                data.transactions.forEach(transaction => {
                    const timestampParts = transaction.Timestamp.split(' ');
                    const dateParts = timestampParts[0].split('-');
                    const timeParts = timestampParts[1].split(':');
                    
                    const tDate = new Date(
                        parseInt(dateParts[0]), 
                        parseInt(dateParts[1]) - 1, 
                        parseInt(dateParts[2]),
                        parseInt(timeParts[0]),
                        parseInt(timeParts[1]),
                        parseInt(timeParts[2] || 0)
                    );
                    
                    const formattedDateTime = tDate.toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    // Render table row
                    const row = transactionListTbody.insertRow();
                    row.insertCell(0).textContent = formattedDateTime;
                    row.insertCell(1).textContent = transaction.TableName || 'N/A';
                    
                    const methodText = transaction.PaymentMethod === 'transfer' ? '🏦 Chuyển khoản' : '💵 Tiền mặt';
                    row.insertCell(2).textContent = methodText;
                    
                    row.insertCell(3).textContent = formatCurrency(transaction.Amount);

                    // Tính toán doanh thu tổng quan
                    const amount = parseFloat(transaction.Amount);

                    const datePart = timestampParts[0]; // YYYY-MM-DD
                    const todayStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

                    if (datePart === todayStr) {
                        dailyRevenue += amount;
                    }
                    if (tDate >= startOfWeek && tDate <= endOfWeek) {
                        weeklyRevenue += amount;
                    }
                    if (tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear()) {
                        monthlyRevenue += amount;
                    }
                    if (tDate.getFullYear() === now.getFullYear()) {
                        yearlyRevenue += amount;
                    }

                    // Tính toán dữ liệu cho biểu đồ
                    const dateKey = datePart;
                    if (!dailyRevenueData[dateKey]) {
                        dailyRevenueData[dateKey] = 0;
                    }
                    dailyRevenueData[dateKey] += amount;
                });
            } else {
                transactionListTbody.innerHTML = `<tr><td colspan="3" class="text-center">${data.message || 'Không có giao dịch nào được ghi nhận.'}</td></tr>`;
            }

            // Hiển thị tổng doanh thu đã lọc
            if (data.success) {
                const totalRevenue = data.transactions.reduce((sum, t) => sum + parseFloat(t.Amount), 0);
                totalFilteredRevenueEl.textContent = formatCurrency(totalRevenue);
            } else {
                totalFilteredRevenueEl.textContent = formatCurrency(0);
            }

            // Cập nhật doanh thu tổng quan (stat cards)
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
                        backgroundColor: 'rgba(0, 123, 255, 0.7)',
                        borderColor: 'rgba(0, 123, 255, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Doanh thu (VND)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString('vi-VN') + 'đ';
                                }
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
                        },
                        legend: {
                            display: false
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu doanh thu:', error);
            totalFilteredRevenueEl.textContent = formatCurrency(0);
            transactionListTbody.innerHTML = '<tr><td colspan="3" class="text-center">Đã xảy ra lỗi khi kết nối máy chủ.</td></tr>';
        }
    }

    // Xóa lịch sử giao dịch
    deleteHistoryBtn.addEventListener('click', async () => {
        if (confirm('⚠️ BẠN CÓ CHẮC CHẮN MUỐN XÓA TOÀN BỘ LỊCH SỬ DOANH THU?\n\nHành động này KHÔNG THỂ HOÀN TÁC!')) {
            try {
                const response = await fetch('api/transactions.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                if (data.success) {
                    alert('✅ ' + data.message);
                    loadAndDisplayRevenue();
                } else {
                    alert('❌ Lỗi khi xóa: ' + data.message);
                }
            } catch (error) {
                console.error('Lỗi API khi xóa:', error);
                alert('❌ Không thể xóa dữ liệu doanh thu.');
            }
        }
    });

    // Lọc doanh thu
    filterRevenueBtn.addEventListener('click', () => {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        if (startDate && endDate && startDate > endDate) {
            alert('⚠️ Ngày bắt đầu không được lớn hơn ngày kết thúc!');
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