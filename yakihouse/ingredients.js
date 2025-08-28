document.addEventListener('DOMContentLoaded', () => {
    const ingredientTableBody = document.querySelector('#ingredientTable tbody');
    const logTableBody = document.querySelector('#logTable tbody');
    const logForm = document.getElementById('logForm');
    const statusMessage = document.getElementById('statusMessage');
    const role = sessionStorage.getItem('role');
    //Gọi API lấy danh sách nguyên liệu
    async function fetchAndRenderIngredients() {
        try {
            const response = await fetch('api/ingredients.php');
            const data = await response.json();
            if (data.success) {
                ingredientTableBody.innerHTML = '';
                data.ingredients.forEach(ing => {
                    const tr = document.createElement('tr');
                    const isOut = ing.quantity <= 0;
                    tr.innerHTML = `
                        <td>${ing.name}</td>
                        <td>${ing.unit || ''}</td>
                        <td class="${isOut ? 'out-of-stock' : ''}">${ing.quantity}</td>
                        <td>${ing.note || ''}</td>
                    `;
                    ingredientTableBody.appendChild(tr);
                });
            }
        } catch (err) {
            console.error(err);
            statusMessage.textContent = 'Lỗi khi tải nguyên liệu.';
        }
    }

    // Gọi API lấy lịch sử nhập/xuất kho
    async function fetchAndRenderLogs() {
        try {
            const res = await fetch('api/ingredients.php?action=get_logs');
            const data = await res.json();
            logTableBody.innerHTML = '';
            if (data.success) {
                data.logs.forEach(log => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${log.id}</td>
                        <td>${log.ingredient_name} (${log.unit})</td>
                        <td>${log.type === 'import' ? 'Nhập' : 'Xuất'}</td>
                        <td>${log.quantity}</td>
                        <td>${log.timestamp}</td>
                        <td>${log.note || ''}</td>
                        <td>
                          <button class="delete-btn" onclick="deleteLog(${log.id})">Xoá</button>
                        </td>
                    `;
                    logTableBody.appendChild(tr);
                });
            }
        } catch (err) {
            console.error('Lỗi load log:', err);
        }
    }

    // Xử lý submit form nhập/xuất kho
    if (logForm) {
        logForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (role !== 'Quản lý') {
                alert('Bạn không có quyền nhập/xuất kho!');
                return;
            }
            const ingredientName = document.getElementById('ingredient-name').value.trim();
            const ingredientUnit = document.getElementById('ingredient-unit').value.trim();
            const quantity = parseFloat(document.getElementById('quantity').value);
            const action = document.getElementById('action').value;
            const note = document.getElementById('note').value.trim();

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
                    alert('Cập nhật thành công!');
                    logForm.reset();
                    fetchAndRenderIngredients();
                    fetchAndRenderLogs();
                } else {
                    statusMessage.textContent = 'Lỗi: ' + result.message;
                }
            } catch (err) {
                console.error(err);
                statusMessage.textContent = 'Lỗi khi gửi yêu cầu.';
            }
        });
    }

    // Gọi ban đầu
    fetchAndRenderIngredients();
    fetchAndRenderLogs();

    // xoá lịch sử nhập/xuất kho
    window.deleteLog = async function(id) {
        if (!confirm('Bạn có chắc chắn muốn xoá log này?')) return;
        try {
            const res = await fetch('api/ingredients.php?action=delete_log&id=' + id, { method: 'POST' });
            const result = await res.json();
            if (result.success) {
                fetchAndRenderLogs();
            } else {
                alert('Xoá thất bại!');
            }
        } catch (err) {
            console.error(err);
        }
    }
});
