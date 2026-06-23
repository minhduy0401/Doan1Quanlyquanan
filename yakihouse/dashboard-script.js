// ============================================================
// DASHBOARD SCRIPT - Quán Buffet BBQ v2.0
// ============================================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    let revenueChart = null;
    let tableChart = null;

    // Load all dashboard data
    await loadDashboardStats();
    await loadRevenueChart();
    await loadTableStatus();
    await loadRecentOrders();
    await loadTopDishes();
    await loadLowStockIngredients();

    // Refresh button handler
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.disabled = true;
            refreshBtn.textContent = '⏳';
            await loadDashboardStats();
            await loadRevenueChart();
            await loadTableStatus();
            await loadRecentOrders();
            await loadTopDishes();
            await loadLowStockIngredients();
            refreshBtn.textContent = '🔄';
            refreshBtn.disabled = false;
        });
    }

    // Auto refresh every 30 seconds
    setInterval(async () => {
        await loadDashboardStats();
        await loadRecentOrders();
    }, 30000);

    // ============================================================
    // LOAD DASHBOARD STATISTICS
    // ============================================================
    async function loadDashboardStats() {
        try {
            // Get today's revenue
            const revenueResponse = await fetch('api/transactions.php');
            const revenueData = await revenueResponse.json();
            
            let todayRevenue = 0;
            if (revenueData.success && revenueData.transactions) {
                const now = new Date();
                const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
                todayRevenue = revenueData.transactions
                    .filter(t => t.Timestamp.startsWith(today))
                    .reduce((sum, t) => sum + parseFloat(t.Amount), 0);
            }
            document.getElementById('todayRevenue').textContent = formatCurrency(todayRevenue);

            // Get today's orders
            const ordersResponse = await fetch('api/orders.php');
            const ordersData = await ordersResponse.json();
            
            let todayOrders = 0;
            if (ordersData.success && ordersData.orders) {
                const now = new Date();
                const today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
                todayOrders = ordersData.orders.filter(o => o.CreatedAt.startsWith(today)).length;
            }
            document.getElementById('todayOrders').textContent = todayOrders;

            // Get available dishes
            const dishesResponse = await fetch('api/dishes.php');
            const dishesData = await dishesResponse.json();
            
            let availableDishes = 0;
            if (dishesData.success && dishesData.dishes) {
                availableDishes = dishesData.dishes.length;
            }
            document.getElementById('availableDishes').textContent = availableDishes;

            // Get occupied tables
            const tablesResponse = await fetch('api/tables.php');
            const tablesData = await tablesResponse.json();
            
            let occupiedTables = 0;
            if (tablesData.success && tablesData.tables) {
                occupiedTables = tablesData.tables.filter(t => 
                    t.ENUM === 'occupied' || t.ENUM === 'ready-to-bill'
                ).length;
            }
            document.getElementById('occupiedTables').textContent = `${occupiedTables}/20`;

        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    // ============================================================
    // LOAD REVENUE CHART (Last 7 Days)
    // ============================================================
    async function loadRevenueChart() {
        try {
            const response = await fetch('api/transactions.php');
            const data = await response.json();

            if (!data.success || !data.transactions) {
                console.error('Failed to load transactions');
                return;
            }

            // Get last 7 days
            const last7Days = [];
            const revenueByDay = {};
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                last7Days.push(dateStr);
                revenueByDay[dateStr] = 0;
            }

            // Calculate revenue for each day
            data.transactions.forEach(t => {
                const date = t.Timestamp.split(' ')[0];
                if (revenueByDay.hasOwnProperty(date)) {
                    revenueByDay[date] += parseFloat(t.Amount);
                }
            });

            const labels = last7Days.map(date => {
                const d = new Date(date);
                return `${d.getDate()}/${d.getMonth() + 1}`;
            });

            const values = last7Days.map(date => revenueByDay[date]);

            // Destroy old chart if exists
            if (revenueChart) {
                revenueChart.destroy();
            }

            // Create new chart
            const ctx = document.getElementById('revenueChart').getContext('2d');
            revenueChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Doanh thu (VND)',
                        data: values,
                        backgroundColor: 'rgba(255, 107, 53, 0.8)',
                        borderColor: 'rgba(255, 107, 53, 1)',
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return formatCurrency(context.parsed.y);
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return (value / 1000) + 'k';
                                }
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error loading revenue chart:', error);
        }
    }

    // ============================================================
    // LOAD TABLE STATUS CHART
    // ============================================================
    async function loadTableStatus() {
        try {
            const response = await fetch('api/tables.php');
            const data = await response.json();

            if (!data.success || !data.tables) {
                console.error('Failed to load tables');
                return;
            }

            const statusCount = {
                'trống': 0,
                'occupied': 0,
                'ready-to-bill': 0
            };

            data.tables.forEach(t => {
                statusCount[t.ENUM]++;
            });

            // Destroy old chart if exists
            if (tableChart) {
                tableChart.destroy();
            }

            // Create new chart
            const ctx = document.getElementById('tableChart').getContext('2d');
            tableChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Trống', 'Đang Sử Dụng', 'Chờ Thanh Toán'],
                    datasets: [{
                        data: [statusCount['trống'], statusCount['occupied'], statusCount['ready-to-bill']],
                        backgroundColor: [
                            'rgba(156, 163, 175, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(40, 167, 69, 0.8)'
                        ],
                        borderColor: [
                            'rgba(156, 163, 175, 1)',
                            'rgba(245, 158, 11, 1)',
                            'rgba(40, 167, 69, 1)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error loading table status:', error);
        }
    }

    // ============================================================
    // LOAD RECENT ORDERS
    // ============================================================
    async function loadRecentOrders() {
        try {
            const response = await fetch('api/orders.php');
            const data = await response.json();

            const tbody = document.getElementById('recentOrdersBody');

            if (!data.success || !data.orders || data.orders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Chưa có đơn hàng</td></tr>';
                return;
            }

            // Sort by created date descending and take first 10
            const recentOrders = data.orders
                .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
                .slice(0, 10);

            tbody.innerHTML = '';

            recentOrders.forEach(order => {
                const row = document.createElement('tr');
                
                const statusClass = {
                    'pending': 'text-info',
                    'preparing': 'text-warning',
                    'serving': 'text-primary',
                    'ready-to-bill': 'text-success',
                    'paid': 'text-success',
                    'cancelled': 'text-danger'
                }[order.ENUM] || 'text-muted';

                const statusText = {
                    'pending': 'Mới tạo',
                    'open': 'Đang mở',
                    'preparing': 'Đang chế biến',
                    'serving': 'Đang phục vụ',
                    'ready-to-bill': 'Chờ thanh toán',
                    'paid': 'Đã thanh toán',
                    'cancelled': 'Đã hủy'
                }[order.ENUM] || order.ENUM;

                row.innerHTML = `
                    <td><strong>${order.TableID}</strong></td>
                    <td>${formatCurrency(order.Total)}</td>
                    <td><span class="${statusClass}">${statusText}</span></td>
                    <td style="font-size: 0.9rem; color: #666;">${formatDateTime(order.CreatedAt)}</td>
                `;

                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading recent orders:', error);
            document.getElementById('recentOrdersBody').innerHTML = 
                '<tr><td colspan="4" class="text-center text-danger">Lỗi tải dữ liệu</td></tr>';
        }
    }

    // ============================================================
    // LOAD TOP SELLING DISHES
    // ============================================================
    async function loadTopDishes() {
        try {
            // Get all orders
            const ordersResponse = await fetch('api/orders.php');
            const ordersData = await ordersResponse.json();

            // Get all dishes
            const dishesResponse = await fetch('api/dishes.php');
            const dishesData = await dishesResponse.json();

            if (!ordersData.success || !dishesData.success) {
                console.error('Failed to load data for top dishes');
                return;
            }

            const dishSales = {};

            // Calculate sales for each dish
            ordersData.orders.forEach(order => {
                if (order.ENUM === 'paid') {
                    // Fetch order details to get items
                    fetch('api/orders.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'get_order', tableId: order.TableID })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.order && data.order.items) {
                            data.order.items.forEach(item => {
                                if (!dishSales[item.id]) {
                                    dishSales[item.id] = {
                                        name: item.name,
                                        quantity: 0,
                                        revenue: 0
                                    };
                                }
                                dishSales[item.id].quantity += parseInt(item.quantity);
                                dishSales[item.id].revenue += parseFloat(item.price) * parseInt(item.quantity);
                            });
                        }
                    });
                }
            });

            // Wait a bit for all fetch to complete
            setTimeout(() => {
                const tbody = document.getElementById('topDishesBody');

                const sortedDishes = Object.entries(dishSales)
                    .sort((a, b) => b[1].quantity - a[1].quantity)
                    .slice(0, 10);

                if (sortedDishes.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">Chưa có dữ liệu</td></tr>';
                    return;
                }

                tbody.innerHTML = '';

                sortedDishes.forEach(([dishId, data]) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><strong>${data.name}</strong></td>
                        <td class="text-center">${data.quantity}</td>
                        <td class="text-right">${formatCurrency(data.revenue)}</td>
                    `;
                    tbody.appendChild(row);
                });
            }, 1500);

        } catch (error) {
            console.error('Error loading top dishes:', error);
            document.getElementById('topDishesBody').innerHTML = 
                '<tr><td colspan="3" class="text-center text-danger">Lỗi tải dữ liệu</td></tr>';
        }
    }

    // ============================================================
    // LOAD LOW STOCK INGREDIENTS
    // ============================================================
    async function loadLowStockIngredients() {
        try {
            const response = await fetch('api/ingredients.php');
            const data = await response.json();

            if (!data.success || !data.ingredients) {
                console.error('Failed to load ingredients');
                return;
            }

            // Filter low stock (quantity <= 10)
            const lowStock = data.ingredients.filter(i => parseFloat(i.quantity) <= 10);

            const card = document.getElementById('lowStockCard');
            const tbody = document.getElementById('lowStockBody');

            if (lowStock.length === 0) {
                card.style.display = 'none';
                return;
            }

            card.style.display = 'block';
            tbody.innerHTML = '';

            lowStock.forEach(ingredient => {
                const row = document.createElement('tr');
                const qty = parseFloat(ingredient.quantity);
                
                let statusClass = 'text-warning';
                let statusText = 'Sắp hết';
                
                if (qty <= 0) {
                    statusClass = 'text-danger';
                    statusText = 'Hết hàng';
                } else if (qty <= 5) {
                    statusClass = 'text-danger';
                    statusText = 'Rất thấp';
                }

                row.innerHTML = `
                    <td><strong>${ingredient.name}</strong></td>
                    <td class="${statusClass}">${qty}</td>
                    <td>${ingredient.unit}</td>
                    <td><span class="${statusClass}">${statusText}</span></td>
                `;

                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error loading low stock ingredients:', error);
        }
    }

    // ============================================================
    // CHECK-IN/OUT LOGIC (reuse from index.html)
    // ============================================================
    const staffId = sessionStorage.getItem('staffId');
    const checkInBtn = document.getElementById('checkInBtn');
    const checkOutBtn = document.getElementById('checkOutBtn');
    const shiftStatusDisplay = document.getElementById('shiftStatusDisplay');

    async function checkShiftStatus() {
        try {
            const response = await fetch(`api/shifts.php?staffId=${staffId}`);
            const data = await response.json();

            if (data.success) {
                if (data.status === 'checked-in') {
                    shiftStatusDisplay.textContent = 'Đang làm việc';
                    shiftStatusDisplay.style.color = '#28a745';
                    checkInBtn.style.display = 'none';
                    checkOutBtn.style.display = 'block';
                } else {
                    shiftStatusDisplay.textContent = 'Chưa check-in';
                    shiftStatusDisplay.style.color = '#dc3545';
                    checkInBtn.style.display = 'block';
                    checkOutBtn.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error checking shift status:', error);
        }
    }

    if (checkInBtn) {
        checkInBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('api/shifts.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ staffId: staffId })
                });
                const data = await response.json();
                
                if (data.success) {
                    alert('Check-in thành công!');
                    await checkShiftStatus();
                } else {
                    alert('Lỗi: ' + data.message);
                }
            } catch (error) {
                console.error('Error checking in:', error);
                alert('Lỗi kết nối');
            }
        });
    }

    if (checkOutBtn) {
        checkOutBtn.addEventListener('click', async () => {
            if (!confirm('Bạn có chắc chắn muốn check-out?')) return;

            try {
                const response = await fetch('api/shifts.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ staffId: staffId })
                });
                const data = await response.json();
                
                if (data.success) {
                    alert('Check-out thành công!');
                    await checkShiftStatus();
                } else {
                    alert('Lỗi: ' + data.message);
                }
            } catch (error) {
                console.error('Error checking out:', error);
                alert('Lỗi kết nối');
            }
        });
    }

    // Check shift status on load
    if (staffId) {
        await checkShiftStatus();
    }
});
