// ============================================================
// DISHES MANAGEMENT SCRIPT - Quán Buffet BBQ v2.0
// ============================================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

document.addEventListener('DOMContentLoaded', async () => {
    let dishes = [];
    let filteredDishes = [];
    let currentEditDish = null;

    // DOM Elements
    const dishesGrid = document.getElementById('dishesGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const addDishBtn = document.getElementById('addDishBtn');
    const dishModal = document.getElementById('dishModal');
    const priceModal = document.getElementById('priceModal');
    const emptyState = document.getElementById('emptyState');

    // Load dishes on start
    await loadDishes();

    // ============================================================
    // LOAD DISHES FROM API
    // ============================================================
    async function loadDishes() {
        try {
            const response = await fetch('api/dishes.php');
            const data = await response.json();

            if (data.success && data.dishes) {
                dishes = data.dishes;
                filteredDishes = [...dishes];
                applySorting();
                renderDishes();
                updateStatistics();
            } else {
                console.error('Failed to load dishes:', data.message);
                showEmptyState();
            }
        } catch (error) {
            console.error('Error loading dishes:', error);
            alert('Lỗi kết nối: Không thể tải danh sách món ăn');
            showEmptyState();
        }
    }

    // ============================================================
    // RENDER DISHES TO GRID
    // ============================================================
    function renderDishes() {
        if (filteredDishes.length === 0) {
            showEmptyState();
            return;
        }

        emptyState.style.display = 'none';
        dishesGrid.style.display = 'grid';
        dishesGrid.innerHTML = '';

        filteredDishes.forEach(dish => {
            const dishCard = document.createElement('div');
            dishCard.classList.add('menu-item');
            dishCard.innerHTML = `
                <img src="${dish.ImagePath}" alt="${dish.Name}" onerror="this.src='image/logo.png'">
                <div class="menu-item-content">
                    <h4>${dish.Name}</h4>
                    <p class="menu-item-price">${formatCurrency(parseFloat(dish.Price))}</p>
                    <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 0.5rem;">${dish.Category}</p>
                    <div class="table-actions" style="margin-top: auto;">
                        <button class="btn btn-small btn-info edit-dish-btn" data-id="${dish.DishID}">✏️ Sửa</button>
                        <button class="btn btn-small btn-warning edit-price-btn" data-id="${dish.DishID}">💰 Giá</button>
                        <button class="btn btn-small btn-danger delete-dish-btn" data-id="${dish.DishID}">🗑️</button>
                    </div>
                </div>
            `;

            dishesGrid.appendChild(dishCard);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.edit-dish-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditDishModal(btn.dataset.id));
        });

        document.querySelectorAll('.edit-price-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditPriceModal(btn.dataset.id));
        });

        document.querySelectorAll('.delete-dish-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteDish(btn.dataset.id));
        });
    }

    // ============================================================
    // SHOW EMPTY STATE
    // ============================================================
    function showEmptyState() {
        dishesGrid.style.display = 'none';
        emptyState.style.display = 'block';
    }

    // ============================================================
    // UPDATE STATISTICS
    // ============================================================
    function updateStatistics() {
        const totalDishes = dishes.length;
        const activeDishes = totalDishes; // All dishes are active by default
        const avgPrice = dishes.length > 0 
            ? dishes.reduce((sum, d) => sum + parseFloat(d.Price), 0) / dishes.length 
            : 0;

        document.getElementById('totalDishes').textContent = totalDishes;
        document.getElementById('activeDishes').textContent = activeDishes;
        document.getElementById('avgPrice').textContent = formatCurrency(avgPrice);
    }

    // ============================================================
    // FILTER AND SEARCH
    // ============================================================
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;

        filteredDishes = dishes.filter(dish => {
            const matchSearch = dish.Name.toLowerCase().includes(searchTerm);
            const matchCategory = !category || dish.Category === category;
            return matchSearch && matchCategory;
        });

        applySorting();
        renderDishes();
    }

    // ============================================================
    // SORTING
    // ============================================================
    function applySorting() {
        const sortValue = sortBy.value;

        switch (sortValue) {
            case 'name':
                filteredDishes.sort((a, b) => a.Name.localeCompare(b.Name));
                break;
            case 'price-asc':
                filteredDishes.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
                break;
            case 'price-desc':
                filteredDishes.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
                break;
            case 'category':
                filteredDishes.sort((a, b) => a.Category.localeCompare(b.Category));
                break;
        }
    }

    // Event listeners for filters
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    sortBy.addEventListener('change', () => {
        applySorting();
        renderDishes();
    });

    resetFilterBtn.addEventListener('click', () => {
        searchInput.value = '';
        categoryFilter.value = '';
        sortBy.value = 'name';
        filteredDishes = [...dishes];
        applySorting();
        renderDishes();
    });

    // ============================================================
    // OPEN ADD DISH MODAL
    // ============================================================
    addDishBtn.addEventListener('click', () => {
        currentEditDish = null;
        document.getElementById('modalTitle').textContent = '➕ Thêm Món Mới';
        document.getElementById('dishForm').reset();
        document.getElementById('dishId').value = '';
        document.getElementById('imagePreview').style.display = 'none';
        dishModal.classList.add('active');
    });

    // ============================================================
    // OPEN EDIT DISH MODAL
    // ============================================================
    function openEditDishModal(dishId) {
        const dish = dishes.find(d => d.DishID === dishId);
        if (!dish) return;

        currentEditDish = dish;
        document.getElementById('modalTitle').textContent = '✏️ Chỉnh Sửa Món Ăn';
        document.getElementById('dishId').value = dish.DishID;
        document.getElementById('dishName').value = dish.Name;
        document.getElementById('dishPrice').value = dish.Price;
        document.getElementById('dishCategory').value = dish.Category;
        document.getElementById('dishDescription').value = dish.Description || '';
        
        // Show current image preview
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.style.display = 'block';
        imagePreview.querySelector('img').src = dish.ImagePath;

        dishModal.classList.add('active');
    }

    // ============================================================
    // OPEN EDIT PRICE MODAL
    // ============================================================
    function openEditPriceModal(dishId) {
        const dish = dishes.find(d => d.DishID === dishId);
        if (!dish) return;

        currentEditDish = dish;
        document.getElementById('editPriceDishName').textContent = dish.Name;
        document.getElementById('editPriceOldPrice').textContent = formatCurrency(parseFloat(dish.Price));
        document.getElementById('newPriceInput').value = dish.Price;

        priceModal.classList.add('active');
    }

    // ============================================================
    // SAVE DISH (ADD OR UPDATE)
    // ============================================================
    document.getElementById('saveDishBtn').addEventListener('click', async () => {
        const dishId = document.getElementById('dishId').value;
        const dishName = document.getElementById('dishName').value.trim();
        const dishPrice = document.getElementById('dishPrice').value;
        const dishCategory = document.getElementById('dishCategory').value;
        const dishDescription = document.getElementById('dishDescription').value.trim();
        const dishImageFile = document.getElementById('dishImage').files[0];

        // Validation
        if (!dishName) {
            alert('Vui lòng nhập tên món ăn!');
            return;
        }

        if (!dishPrice || parseFloat(dishPrice) < 0) {
            alert('Vui lòng nhập giá hợp lệ!');
            return;
        }

        if (!dishCategory) {
            alert('Vui lòng chọn danh mục!');
            return;
        }

        if (!dishId && !dishImageFile) {
            alert('Vui lòng chọn hình ảnh cho món ăn!');
            return;
        }

        try {
            let imageBase64 = '';
            
            if (dishImageFile) {
                // Convert image to base64
                imageBase64 = await fileToBase64(dishImageFile);
            }

            const requestData = {
                name: dishName,
                price: parseFloat(dishPrice),
                category: dishCategory,
                description: dishDescription
            };

            if (imageBase64) {
                requestData.image = imageBase64;
            }

            // If editing, include dishId
            if (dishId) {
                requestData.dishId = dishId;
            }

            const response = await fetch('api/dishes.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            if (data.success) {
                alert(dishId ? 'Cập nhật món ăn thành công!' : 'Thêm món ăn thành công!');
                dishModal.classList.remove('active');
                await loadDishes();
            } else {
                alert('Lỗi: ' + data.message);
            }
        } catch (error) {
            console.error('Error saving dish:', error);
            alert('Lỗi kết nối: Không thể lưu món ăn');
        }
    });

    // ============================================================
    // SAVE PRICE
    // ============================================================
    document.getElementById('savePriceBtn').addEventListener('click', async () => {
        if (!currentEditDish) return;

        const newPrice = document.getElementById('newPriceInput').value;

        if (!newPrice || parseFloat(newPrice) < 0) {
            alert('Vui lòng nhập giá hợp lệ!');
            return;
        }

        try {
            const response = await fetch('api/dishes.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dishId: currentEditDish.DishID,
                    price: parseFloat(newPrice)
                })
            });

            const data = await response.json();

            if (data.success) {
                alert('Cập nhật giá thành công!');
                priceModal.classList.remove('active');
                await loadDishes();
            } else {
                alert('Lỗi: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating price:', error);
            alert('Lỗi kết nối: Không thể cập nhật giá');
        }
    });

    // ============================================================
    // DELETE DISH
    // ============================================================
    async function deleteDish(dishId) {
        const dish = dishes.find(d => d.DishID === dishId);
        if (!dish) return;

        if (!confirm(`Bạn có chắc chắn muốn xóa món "${dish.Name}"?\n\nHành động này không thể hoàn tác!`)) {
            return;
        }

        try {
            const response = await fetch('api/dishes.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dishId: dishId })
            });

            const data = await response.json();

            if (data.success) {
                alert('Xóa món ăn thành công!');
                await loadDishes();
            } else {
                alert('Lỗi: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting dish:', error);
            alert('Lỗi kết nối: Không thể xóa món ăn');
        }
    }

    // ============================================================
    // HELPER: CONVERT FILE TO BASE64
    // ============================================================
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // ============================================================
    // IMAGE PREVIEW ON FILE SELECT
    // ============================================================
    document.getElementById('dishImage').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imagePreview = document.getElementById('imagePreview');
                imagePreview.style.display = 'block';
                imagePreview.querySelector('img').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // ============================================================
    // MODAL CLOSE HANDLERS
    // ============================================================
    document.getElementById('closeDishModalBtn').addEventListener('click', () => {
        dishModal.classList.remove('active');
    });

    document.getElementById('cancelDishBtn').addEventListener('click', () => {
        dishModal.classList.remove('active');
    });

    document.getElementById('closePriceModalBtn').addEventListener('click', () => {
        priceModal.classList.remove('active');
    });

    document.getElementById('cancelPriceBtn').addEventListener('click', () => {
        priceModal.classList.remove('active');
    });

    // Close modal when clicking overlay
    dishModal.addEventListener('click', (e) => {
        if (e.target === dishModal) {
            dishModal.classList.remove('active');
        }
    });

    priceModal.addEventListener('click', (e) => {
        if (e.target === priceModal) {
            priceModal.classList.remove('active');
        }
    });
});
