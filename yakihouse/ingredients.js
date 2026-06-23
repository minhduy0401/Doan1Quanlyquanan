document.addEventListener('DOMContentLoaded', () => {
    const ingredientTableBody = document.querySelector('#ingredientTable tbody');
    const logTableBody = document.querySelector('#logTable tbody');
    const logForm = document.getElementById('logForm');
    const statusMessage = document.getElementById('statusMessage');
    const role = sessionStorage.getItem('role');
    
    // Stat cards elements
    const totalIngredientsEl = document.getElementById('totalIngredients');
    const outOfStockEl = document.getElementById('outOfStock');
    const lowStockEl = document.getElementById('lowStock');
    const totalLogsEl = document.getElementById('totalLogs');

    // Hàm cập nhật stat cards
    function updateStatsCards(ingredients, logs) {
        const total = ingredients.length;
        const outOfStock = ingredients.filter(ing => ing.quantity <= 0).length;
        const lowStock = ingredients.filter(ing => ing.quantity > 0 && ing.quantity < 10).length;
        const totalLogCount = logs.length;

        totalIngredientsEl.textContent = total;
        outOfStockEl.textContent = outOfStock;
        lowStockEl.textContent = lowStock;
        totalLogsEl.textContent = totalLogCount;
    }

    // Hàm hiển thị thông báo
    function showMessage(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = `alert alert-${type}`;
        statusMessage.style.display = 'block';
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }

    // Gọi API lấy danh sách nguyên liệu
    async function fetchAndRenderIngredients() {
        try {
            const response = await fetch('api/ingredients.php');
            const data = await response.json();
            if (data.success) {
                ingredientTableBody.innerHTML = '';
                if (data.ingredients.length === 0) {
                    ingredientTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Chưa có nguyên liệu nào.</td></tr>';
                } else {
                    data.ingredients.forEach(ing => {
                        const tr = document.createElement('tr');
                        const isOut = ing.quantity <= 0;
                        const isLow = ing.quantity > 0 && ing.quantity < 10;
                        
                        let status = '✅ Đủ';
                        let statusClass = 'text-success';
                        if (isOut) {
                            status = '❌ Hết hàng';
                            statusClass = 'text-danger';
                        } else if (isLow) {
                            status = '⚠️  Sắp hết';
                            statusClass = 'text-warning';
                        }

                        tr.innerHTML = `
                            <td>${ing.name}</td>
                            <td>${ing.unit || 'N/A'}</td>
                            <td class="${isOut ? 'text-danger' : ''}" style="font-weight: bold;">${ing.quantity}</td>
                            <td class="${statusClass}">${status}</td>
                            <td>${ing.note || ''}</td>
                        `;
                        ingredientTableBody.appendChild(tr);
                    });
                }
                return data.ingredients;
            } else {
                showMessage('Lỗi khi tải nguyên liệu: ' + data.message, 'danger');
                return [];
            }
        } catch (err) {
            console.error(err);
            showMessage('Lỗi khi tải nguyên liệu.', 'danger');
            return [];
        }
    }

    // Gọi API lấy lịch sử nhập/xuất kho
    async function fetchAndRenderLogs() {
        try {
            const res = await fetch('api/ingredients.php?action=get_logs');
            const data = await res.json();
            logTableBody.innerHTML = '';
            if (data.success) {
                if (data.logs.length === 0) {
                    logTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Chưa có lịch sử nào.</td></tr>';
                } else {
                    data.logs.forEach(log => {
                        const tr = document.createElement('tr');
                        const logType = log.type === 'import' ? '📥 Nhập' : '📤 Xuất';
                        const logClass = log.type === 'import' ? 'text-success' : 'text-warning';
                        
                        tr.innerHTML = `
                            <td>${log.id}</td>
                            <td>${log.ingredient_name} <small>(${log.unit})</small></td>
                            <td class="${logClass}">${logType}</td>
                            <td style="font-weight: bold;">${log.quantity}</td>
                            <td>${log.timestamp}</td>
                            <td>${log.note || ''}</td>
                            <td>
                                ${role === 'Quản lý' ? `<button class="btn btn-sm btn-danger" onclick="deleteLog(${log.id})">🗑️ Xóa</button>` : 'N/A'}
                            </td>
                        `;
                        logTableBody.appendChild(tr);
                    });
                }
                return data.logs;
            } else {
                showMessage('Lỗi load log: ' + data.message, 'danger');
                return [];
            }
        } catch (err) {
            console.error('Lỗi load log:', err);
            showMessage('Lỗi khi tải lịch sử.', 'danger');
            return [];
        }
    }

    // Load dữ liệu và cập nhật stats
    async function loadAllData() {
        const ingredients = await fetchAndRenderIngredients();
        const logs = await fetchAndRenderLogs();
        updateStatsCards(ingredients, logs);
    }

    // Xử lý submit form nhập/xuất kho
    if (logForm) {
        logForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (role !== 'Quản lý') {
                alert('❌ Bạn không có quyền nhập/xuất kho!');
                return;
            }
            const ingredientName = document.getElementById('ingredient-name').value.trim();
            const ingredientUnit = document.getElementById('ingredient-unit').value.trim();
            const quantity = parseFloat(document.getElementById('quantity').value);
            const action = document.getElementById('action').value;
            const note = document.getElementById('note').value.trim();

            if (!ingredientName || quantity <= 0) {
                showMessage('Vui lòng nhập đầy đủ thông tin hợp lệ!', 'warning');
                return;
            }

            const formData = new FormData();
            formData.append('action', action);
            formData.append('ingredient_name', ingredientName);
            formData.append('ingredient_unit', ingredientUnit);
            formData.append('quantity', quantity);
            formData.append('note', note);

            try {
                const response = await fetch('api/ingredients.php', { method: 'POST', body: formData });
                const result = await response.json();
                if (result.success) {
                    showMessage('✅ Cập nhật thành công!', 'success');
                    logForm.reset();
                    loadAllData();
                } else {
                    showMessage('❌ Lỗi: ' + result.message, 'danger');
                }
            } catch (err) {
                console.error(err);
                showMessage('❌ Lỗi khi gửi yêu cầu.', 'danger');
            }
        });
    }

    // Gọi ban đầu
    loadAllData();

    // Xóa lịch sử nhập/xuất kho (chỉ Quản lý)
    window.deleteLog = async function(id) {
        if (role !== 'Quản lý') {
            alert('❌ Bạn không có quyền xóa log!');
            return;
        }
        if (!confirm('⚠️ Bạn có chắc chắn muốn xóa log này?')) return;
        try {
            const res = await fetch('api/ingredients.php?action=delete_log&id=' + id, { method: 'POST' });
            const result = await res.json();
            if (result.success) {
                showMessage('✅ Đã xóa log thành công!', 'success');
                loadAllData();
            } else {
                showMessage('❌ Xóa thất bại: ' + result.message, 'danger');
            }
        } catch (err) {
            console.error(err);
            showMessage('❌ Lỗi khi xóa log.', 'danger');
        }
    }
});
