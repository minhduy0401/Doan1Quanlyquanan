document.addEventListener('DOMContentLoaded', () => {

    const staffIdInput = document.getElementById('staffId');
    const staffNameInput = document.getElementById('staffName');
    const staffCodeInput = document.getElementById('staffCode');
    const staffPasswordInput = document.getElementById('staffPassword');
    const staffPhoneInput = document.getElementById('staffPhone');
    const staffPositionSelect = document.getElementById('staffPosition');
    const saveStaffBtn = document.getElementById('saveStaffBtn');
    const clearStaffFormBtn = document.getElementById('clearStaffFormBtn');
    const staffListTbody = document.getElementById('staffList');

    // Hàm lấy danh sách nhân viên từ API
    async function fetchStaffs() {
        try {
            const response = await fetch('api/staff.php');
            const data = await response.json();
            if (data.success) {
                return data.staffs;
            } else {
                console.error('Lỗi khi tải danh sách nhân viên:', data.message);
                return [];
            }
        } catch (error) {
            console.error('Lỗi kết nối API khi tải nhân viên:', error);
            return [];
        }
    }

    // Hàm cập nhật stat cards
    function updateStatsCards(staffData) {
        const totalStaff = staffData.length;
        const managerCount = staffData.filter(s => s.Position === 'Quản lý').length;
        // Note: activeStaff requires shift data, set to 0 for now
        const activeStaff = 0;

        document.getElementById('totalStaff').textContent = totalStaff;
        document.getElementById('activeStaff').textContent = activeStaff;
        document.getElementById('managerCount').textContent = managerCount;
    }

    // Hàm render danh sách nhân viên (table-based)
    async function renderStaffList() {
        const staffData = await fetchStaffs(); 
        
        // Update stats
        updateStatsCards(staffData);

        // Render table
        staffListTbody.innerHTML = '';
        if (staffData.length === 0) {
            const row = staffListTbody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 5;
            cell.className = 'text-center';
            cell.textContent = 'Chưa có nhân viên nào.';
        } else {
            staffData.forEach(staff => {
                const row = staffListTbody.insertRow();
                row.insertCell(0).textContent = staff.Code;
                row.insertCell(1).textContent = staff.Name;
                row.insertCell(2).textContent = staff.Position;
                row.insertCell(3).textContent = staff.Phone || 'N/A';
                
                const actionCell = row.insertCell(4);
                actionCell.innerHTML = `
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${staff.StaffID}">✏️ Sửa</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${staff.StaffID}">🗑️ Xóa</button>
                `;
            });
        }
    }

    // Hàm lưu/cập nhật nhân viên
    saveStaffBtn.addEventListener('click', async () => {
        const id = staffIdInput.value;
        const name = staffNameInput.value.trim();
        const code = staffCodeInput.value.trim();
        const password = staffPasswordInput.value.trim();
        const phone = staffPhoneInput.value.trim();
        const position = staffPositionSelect.value;

        if (!name || !code || !phone || !position) {
            alert('Vui lòng điền đầy đủ thông tin nhân viên.');
            return;
        }

        if (!id && !password) {
            alert('Vui lòng nhập mật khẩu cho nhân viên mới.');
            return;
        }

        const method = 'POST'; 
        const body = { id, name, code, password, phone, position };

        try {
            const response = await fetch('api/staff.php', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await response.json();

            if (data.success) {
                alert(data.message);
                clearStaffForm();
                renderStaffList(); 
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Lỗi khi lưu nhân viên:', error);
            alert('Đã xảy ra lỗi khi lưu nhân viên. Vui lòng thử lại.');
        }
    });

    // Xử lý Sửa/Xóa (table-based)
    staffListTbody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const staffIdToDelete = e.target.dataset.id;
            if (confirm('Bạn có chắc muốn xóa nhân viên này?')) {
                try {
                    const response = await fetch('api/staff.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: staffIdToDelete })
                    });
                    const data = await response.json();
                    if (data.success) {
                        alert(data.message);
                        renderStaffList();
                        clearStaffForm();
                    } else {
                        alert(data.message);
                    }
                } catch (error) {
                    console.error('Lỗi khi xóa nhân viên:', error);
                    alert('Đã xảy ra lỗi khi xóa nhân viên. Vui lòng thử lại.');
                }
            }
        } else if (e.target.classList.contains('edit-btn')) {
            const staffIdToEdit = e.target.dataset.id;
            const staffData = await fetchStaffs(); 
            const staffToEdit = staffData.find(staff => staff.StaffID === staffIdToEdit);
            if (staffToEdit) {
                staffIdInput.value = staffToEdit.StaffID;
                staffNameInput.value = staffToEdit.Name;
                staffCodeInput.value = staffToEdit.Code;
                
                staffPasswordInput.value = '';
                staffPhoneInput.value = staffToEdit.Phone || '';
                staffPositionSelect.value = staffToEdit.Position;
                
                // Scroll to form
                document.getElementById('staffForm').scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    clearStaffFormBtn.addEventListener('click', () => {
        clearStaffForm();
    });

    function clearStaffForm() {
        staffIdInput.value = '';
        staffNameInput.value = '';
        staffCodeInput.value = '';
        staffPasswordInput.value = '';
        staffPhoneInput.value = '';
        staffPositionSelect.value = '';
    }

    renderStaffList(); // Khởi tạo ban đầu
});
