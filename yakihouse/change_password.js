document.addEventListener('DOMContentLoaded', () => {
    const changePasswordForm = document.getElementById('changePasswordForm');
    const messageEl = document.getElementById('message');
    
    // Lấy staffId từ sessionStorage để xác định người dùng
    const staffId = sessionStorage.getItem('staffId');

    if (!staffId) {
        messageEl.textContent = 'Bạn cần đăng nhập để đổi mật khẩu.';
        messageEl.style.color = 'red';
        return;
    }

    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            messageEl.textContent = 'Mật khẩu mới và xác nhận mật khẩu không khớp.';
            messageEl.style.color = 'red';
            return;
        }

        if (newPassword.length < 6) {
            messageEl.textContent = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
            messageEl.style.color = 'red';
            return;
        }
        
        try {
            const response = await fetch('api/staff.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'change_password',
                    staffId: staffId,
                    currentPassword: currentPassword,
                    newPassword: newPassword
                })
            });
            const result = await response.json();

            if (result.success) {
                messageEl.textContent = result.message;
                messageEl.style.color = 'green';
                changePasswordForm.reset();
            } else {
                messageEl.textContent = result.message;
                messageEl.style.color = 'red';
            }
        } catch (error) {
            console.error('Lỗi khi đổi mật khẩu:', error);
            messageEl.textContent = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
            messageEl.style.color = 'red';
        }
    });
});