document.addEventListener('DOMContentLoaded', () => {

    const staffIdInput = document.getElementById('staffId');
    const staffNameInput = document.getElementById('staffName');
    const staffCodeInput = document.getElementById('staffCode');
    const staffPasswordInput = document.getElementById('staffPassword');
    const staffPhoneInput = document.getElementById('staffPhone');
    const staffPositionSelect = document.getElementById('staffPosition');
    const saveStaffBtn = document.getElementById('saveStaffBtn');
    const clearStaffFormBtn = document.getElementById('clearStaffFormBtn');
    const staffListUl = document.getElementById('staffList');

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

    // Hàm render danh sách nhân viên
    async function renderStaffList() {
        const staffData = await fetchStaffs(); 
        staffListUl.innerHTML = '';
        if (staffData.length === 0) {
            const li = document.createElement('li');
            li.classList.add('empty-staff-message');
            li.textContent = 'Chưa có nhân viên nào.';
            staffListUl.appendChild(li);
        } else {
            staffData.forEach(staff => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div>
                        <strong>${staff.Name}</strong> (Mã: ${staff.Code}) - ${staff.Position}<br>
                        📞 ${staff.Phone || 'Chưa có số'}
                    </div>
                    <div class="staff-actions">
                        <button class="edit-btn" data-id="${staff.StaffID}">Sửa</button>
                        <button class="delete-btn" data-id="${staff.StaffID}">Xóa</button>
                    </div>
                `;
                staffListUl.appendChild(li);
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

        if (!name || !code || !password || !phone || !position) {
            alert('Vui lòng điền đầy đủ thông tin nhân viên.');
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

    // Xử lý Sửa/Xóa
    staffListUl.addEventListener('click', async (e) => {
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
