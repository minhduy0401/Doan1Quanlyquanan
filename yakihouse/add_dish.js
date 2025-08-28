document.addEventListener('DOMContentLoaded', () => {
    const addDishForm = document.getElementById('addDishForm');
    const dishNameInput = document.getElementById('dishName');
    const dishPriceInput = document.getElementById('dishPrice');
    const dishCategoryInput = document.getElementById('dishCategory');
    const dishImageInput = document.getElementById('dishImage');
    const addDishMessage = document.getElementById('addDishMessage');

    // Kiểm tra quyền
    const currentUserRole = sessionStorage.getItem('role');
    if (currentUserRole !== 'Quản lý') {
        if (addDishMessage) {
            addDishMessage.textContent = 'Bạn không có quyền thêm món ăn.';
            addDishMessage.style.color = 'red';
        }
        if (addDishForm) addDishForm.style.display = 'none';
        return;
    }

    
    if (!addDishForm) return;

    addDishForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dishName = dishNameInput.value.trim();
        const dishPrice = parseFloat(dishPriceInput.value);
        const dishCategory = dishCategoryInput.value;
        const dishImageFile = dishImageInput.files[0];

        if (!dishName || isNaN(dishPrice) || dishPrice <= 0 || !dishCategory || !dishImageFile) {
            addDishMessage.textContent = 'Vui lòng điền đầy đủ thông tin món ăn và giá hợp lệ.';
            addDishMessage.style.color = 'red';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async function () {
            const dishImageBase64 = reader.result; 
            
            try {
                const response = await fetch('api/dishes.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: dishName,
                        price: dishPrice,
                        category: dishCategory,
                        image: dishImageBase64 
                    })
                });
                const data = await response.json();

                if (data.success) {
                    addDishMessage.textContent = data.message;
                    addDishMessage.style.color = 'green';
                    addDishForm.reset();
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    addDishMessage.textContent = data.message;
                    addDishMessage.style.color = 'red';
                }
            } catch (error) {
                console.error("Lỗi khi thêm món ăn:", error);
                addDishMessage.textContent = 'Đã xảy ra lỗi khi thêm món ăn. Vui lòng thử lại.';
                addDishMessage.style.color = 'red';
            }
        };
        reader.onerror = function () {
            addDishMessage.textContent = 'Lỗi khi đọc file ảnh.';
            addDishMessage.style.color = 'red';
        };
        reader.readAsDataURL(dishImageFile);
    });

});
