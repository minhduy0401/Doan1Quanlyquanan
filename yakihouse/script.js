let latestInvoiceData = null; //-- lưu dữ liệu hóa đơn

// ============================================================
// CẤU HÌNH NGÂN HÀNG (chỉnh sửa thông tin ngân hàng ở đây)
// ============================================================
const BANK_CONFIG = {
    bankBin: '970436',        // Mã ngân hàng VietQR (970436 = Vietcombank)
    accountNumber: '1931183550',  // Số tài khoản
    accountName: 'NGUYEN MINH DUY', // Tên tài khoản (không dấu)
    // Danh sách mã BIN phổ biến:
    // 970436 Vietcombank | 970422 MB Bank | 970415 Vietinbank
    // 970418 BIDV       | 970432 VPBank  | 970416 ACB
};

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

document.addEventListener('DOMContentLoaded', async () => {

    let dishes = [];
    let tables = [];
    let tableOrders = {};

    let currentTableId = null;
    let currentOrder = { items: [], subtotal: 0, discount: 0, total: 0, orderId: null, discountPercent: 0 };


    const tableList = document.getElementById('tableList');
    const selectedTableInfo = document.getElementById('selectedTableInfo');
    const currentTableNameSpan = document.getElementById('currentTableName');
    const menuItemsContainer = document.getElementById('menuItems');
    const orderList = document.getElementById('orderList');
    const totalAmountSpan = document.getElementById('billSubtotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    const billSubtotalSpan = document.getElementById('billSubtotal');
    const discountInput = document.getElementById('discountInput');
    const discountAmountSpan = document.getElementById('discountAmountSpan');
    const billTotalFinalSpan = document.getElementById('billTotalFinal');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    const printTempBillBtn = document.getElementById('printTempBillBtn');

    // Kiểm tra và gán các phần tử modal 
    const deleteDishModal = document.getElementById('deleteDishModal');
    const dishDeleteList = document.getElementById('dishDeleteList');
    const closeDeleteModal = document.getElementById('closeDeleteModal');

    const openEditPriceBtn = document.getElementById('openEditPriceBtn');
    const editPriceModal = document.getElementById('editPriceModal');
    const closeEditPriceBtn = document.getElementById('closeEditPriceBtn');
    const saveNewPriceBtn = document.getElementById('saveNewPriceBtn');
    const editDishSelect = document.getElementById('editDishSelect');
    const newPriceInput = document.getElementById('newPriceInput');

    console.log("DOM Elements:", {
        tableList, selectedTableInfo, currentTableNameSpan, menuItemsContainer, orderList,
        totalAmountSpan, checkoutBtn, cancelOrderBtn, billSubtotalSpan, discountInput,
        discountAmountSpan, billTotalFinalSpan, confirmPaymentBtn,
        deleteDishModal, dishDeleteList, closeDeleteModal,
        openEditPriceBtn, editPriceModal, closeEditPriceBtn, saveNewPriceBtn, editDishSelect, newPriceInput
    });


    const currentStaffId = sessionStorage.getItem('staffId');

    // Kiểm tra sự tồn tại của StaffID
    if (!currentStaffId) {
        console.error('Không tìm thấy StaffID trong sessionStorage. Vui lòng đăng nhập lại.');
        alert('Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
        window.location.href = 'login.html';
        return;
    }

    // --- Hàm tải danh sách món ăn từ API ---
    async function getDishesFromAPI() {
        try {
            const response = await fetch('api/dishes.php');
            const data = await response.json();
            if (data.success) {
                return data.dishes;
            } else {
                console.error('Lỗi khi tải danh sách món ăn:', data.message);
                return [];
            }
        } catch (error) {
            console.error('Lỗi kết nối API khi tải món ăn:', error);
            return [];
        }
    }

    // --- Hàm tải dữ liệu ban đầu từ API (bàn, order đang mở) ---
    async function loadInitialData() {
        console.log("Loading initial data...");
        try {

            dishes = await getDishesFromAPI();


            const tablesResponse = await fetch('api/tables.php');
            const tablesData = await tablesResponse.json();
            if (tablesData.success) {
                tables = tablesData.tables;
            } else {
                console.error('Lỗi tải bàn:', tablesData.message);
                tables = [];
            }


            const openOrdersResponse = await fetch('api/orders.php?status=open');
            const openOrdersData = await openOrdersResponse.json();
            if (openOrdersData.success && openOrdersData.orders) {
                for (const order of openOrdersData.orders) {
                    const orderDetailResponse = await fetch('api/orders.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'get_order', tableId: order.TableID })
                    });
                    const orderDetailData = await orderDetailResponse.json();
                    if (orderDetailData.success && orderDetailData.order) {
                        tableOrders[order.TableID] = {
                            orderId: orderDetailData.order.OrderID,
                            items: orderDetailData.order.items.map(item => ({
                                id: item.id,
                                name: item.name,
                                price: parseFloat(item.price),
                                quantity: parseInt(item.quantity)
                            })),
                            subtotal: parseFloat(orderDetailData.order.Subtotal),
                            // Tính discount dựa trên Total và Subtotal hoặc DiscountPercent
                            discount: parseFloat(orderDetailData.order.Subtotal) * (parseFloat(orderDetailData.order.DiscountPercent || 0) / 100),
                            total: parseFloat(orderDetailData.order.Total),
                            discountPercent: parseFloat(orderDetailData.order.DiscountPercent || 0)
                        };
                        const table = tables.find(t => t.TableID === order.TableID);
                        if (table) {
                            table.ENUM = orderDetailData.order.ENUM === 'open' ? 'occupied' : orderDetailData.order.ENUM;
                            if (orderDetailData.order.ENUM === 'ready') {
                                table.ENUM = 'ready-to-bill';
                            }
                        }
                    }
                }
            }
            console.log("Initial data loaded:", { dishes, tables, tableOrders });
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu ban đầu:', error);
            alert('Không thể tải dữ liệu từ máy chủ. Vui lòng kiểm tra kết nối và PHP error logs.');
        }
    }


    // --- Render Bàn ---
    function renderTables() {
        if (!tableList) { console.warn("tableList element not found."); return; }
        tableList.innerHTML = '';
        tables.forEach(table => {
            const tableDiv = document.createElement('div');
            tableDiv.classList.add('table-item');
            tableDiv.dataset.id = table.TableID;
            tableDiv.textContent = table.Name;

            if (table.ENUM === 'occupied') {
                tableDiv.classList.add('occupied');
            } else if (table.ENUM === 'ready-to-bill') {
                tableDiv.classList.add('ready-to-bill');
            } else {
                tableDiv.classList.add('empty');
            }

            if (table.TableID === currentTableId) {
                tableDiv.classList.add('selected');
            }

            tableList.appendChild(tableDiv);
        });
    }

    // --- Render Thực đơn ---
    function renderMenuItems() {
        if (!menuItemsContainer) { console.warn("menuItemsContainer element not found."); return; }
        menuItemsContainer.innerHTML = '';
        dishes.forEach(dish => {
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');
            menuItemDiv.dataset.id = dish.DishID;
            menuItemDiv.innerHTML = `
                <img src="${dish.ImagePath}" alt="${dish.Name}" class="dish-image" onerror="this.src='image/logo.png'">
                <div class="menu-item-content">
                    <h4>${dish.Name}</h4>
                    <div class="flex-between" style="align-items: center; margin-top: auto; width: 100%;">
                        <span class="menu-item-price" style="margin-bottom: 0;">${formatCurrency(parseFloat(dish.Price))}</span>
                        <button class="add-to-order-btn" data-id="${dish.DishID}">➕ Thêm</button>
                    </div>
                </div>
            `;
            menuItemsContainer.appendChild(menuItemDiv);
        });
    }

    // --- Render Order của bàn hiện tại ---
    function renderOrder() {
        if (!orderList || !totalAmountSpan) { console.warn("orderList or totalAmountSpan element not found."); return; }
        orderList.innerHTML = '';
        const hasBuffet = currentOrder.items.some(item => item.id === 'buffet');
        if (currentOrder.items.length === 0) {
            const li = document.createElement('li');
            li.classList.add('empty-order-message');
            li.textContent = 'Chọn bàn và thêm món để bắt đầu order.';
            orderList.appendChild(li);
        } else {
            currentOrder.items.forEach(item => {
                const li = document.createElement('li');
                const isFreeItem = hasBuffet && item.id !== 'buffet';
                const priceLabel = isFreeItem
                    ? `<span class="buffet-free-badge">BUFFET</span>`
                    : `<span class="item-price">${formatCurrency(item.price * item.quantity)}</span>`;
                li.innerHTML = `
                    <div class="order-item">
                        <span class="item-name">${item.name} x ${item.quantity}</span>
                        ${priceLabel}
                        <button class="remove-from-order-btn remove-item-btn" data-id="${item.id}">×</button>
                    </div>
                `;
                orderList.appendChild(li);
            });
        }
        totalAmountSpan.textContent = formatCurrency(currentOrder.subtotal);
        updateBillDetails();
        updateButtonsState();
    }

    // --- Cập nhật chi tiết Bill ---
    function updateBillDetails() {
        if (!discountInput || !billSubtotalSpan || !discountAmountSpan || !billTotalFinalSpan) {
            console.warn("Bill detail elements not found.");
            return;
        }
        const discountPercentage = parseFloat(discountInput.value) || 0;
        const subtotal = currentOrder.subtotal;
        const discountAmount = subtotal * (discountPercentage / 100);
        const finalTotal = subtotal - discountAmount;

        currentOrder.discount = discountAmount;
        currentOrder.total = finalTotal;
        currentOrder.discountPercent = discountPercentage;

        billSubtotalSpan.textContent = formatCurrency(subtotal);
        discountAmountSpan.textContent = `${formatCurrency(discountAmount)}`;
        billTotalFinalSpan.textContent = formatCurrency(finalTotal);

        if (currentTableId) {
            tableOrders[currentTableId] = { ...currentOrder };
        }

        // ALWAYS update button states after updating bill
        updateButtonsState();
    }

    // --- Tính lại giá theo trạng thái Buffet ---
    // Khi có vé buffet: tất cả món khác = 0đ. Khi xóa vé buffet: khôi phục giá gốc.
    function recalcItemPrices() {
        const hasBuffet = currentOrder.items.some(item => item.id === 'buffet');
        currentOrder.items.forEach(item => {
            if (item.id === 'buffet') {
                item.price = item.originalPrice; // vé buffet luôn tính giá đầy đủ
            } else if (hasBuffet) {
                item.price = 0; // miễn phí khi có buffet
            } else {
                item.price = item.originalPrice; // giá à la carte
            }
        });
        currentOrder.subtotal = currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        currentOrder.discount = currentOrder.subtotal * (currentOrder.discountPercent / 100);
        currentOrder.total = currentOrder.subtotal - currentOrder.discount;
    }

    // --- Cập nhật trạng thái các nút ---
    function updateButtonsState() {
        if (!checkoutBtn || !cancelOrderBtn || !confirmPaymentBtn || !printTempBillBtn) {
            console.warn("⚠️ Action buttons not found.");
            return;
        }

        const hasTableSelected = currentTableId !== null;
        const hasOrderItems = currentOrder.items.length > 0;
        const currentTable = tables.find(t => t.TableID === currentTableId);

        // Debug log
        console.log("🔍 UpdateButtonsState:", {
            currentTableId,
            hasTableSelected,
            hasOrderItems,
            tableENUM: currentTable?.ENUM,
            itemsCount: currentOrder.items.length
        });

        if (!hasTableSelected) {
            checkoutBtn.disabled = true;
            cancelOrderBtn.disabled = true;
            confirmPaymentBtn.disabled = true;
            printTempBillBtn.disabled = true;
            console.log("❌ No table - all buttons disabled");
            return;
        }

        if (!hasOrderItems) {
            checkoutBtn.disabled = true;
            cancelOrderBtn.disabled = true;
            confirmPaymentBtn.disabled = true;
            printTempBillBtn.disabled = true;
            console.log("❌ No items - all buttons disabled");
            return;
        }

        const isReadyToBill = currentTable && currentTable.ENUM === 'ready-to-bill';

        if (isReadyToBill) {
            checkoutBtn.disabled = true;
            cancelOrderBtn.disabled = true;
            confirmPaymentBtn.disabled = false;
            printTempBillBtn.disabled = false;
            console.log("✅ Ready-to-bill: Confirm enabled");
        } else {
            checkoutBtn.disabled = false;
            cancelOrderBtn.disabled = false;
            confirmPaymentBtn.disabled = true;
            printTempBillBtn.disabled = false;
            console.log("✅ Has items: Checkout & Cancel enabled");
        }
    }


    // --- Xử lý chọn bàn ---
    if (tableList) {
        tableList.addEventListener('click', async (e) => {
            const tableItem = e.target.closest('.table-item');
            if (tableItem) {
                const newTableId = tableItem.dataset.id;
                console.log("Selected new table:", newTableId);

                if (newTableId === currentTableId) {
                    console.log("Same table selected, ignoring.");
                    return;
                }

                // Lưu order của bàn cũ trước khi chuyển (nếu có order)
                if (currentTableId && tableOrders[currentTableId] && tableOrders[currentTableId].items.length > 0) {
                    const orderToSave = tableOrders[currentTableId];
                    console.log("Saving old table order:", orderToSave);
                    try {
                        const response = await fetch('api/orders.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                action: 'create_or_update',
                                orderId: orderToSave.orderId,
                                tableId: currentTableId,
                                staffId: currentStaffId,
                                items: orderToSave.items,
                                subtotal: orderToSave.subtotal,
                                discountPercent: orderToSave.discountPercent,
                                total: orderToSave.total
                            })
                        });
                        const data = await response.json();
                        if (!data.success) {
                            console.error('Lỗi khi lưu order bàn cũ:', data.message);
                            alert('Lỗi khi lưu order bàn cũ: ' + data.message);
                        } else {
                            console.log('Order bàn cũ đã lưu thành công.');
                        }
                    } catch (error) {
                        console.error('Lỗi kết nối API khi lưu order bàn cũ:', error);
                        alert('Lỗi kết nối: Không thể lưu order bàn cũ.');
                    }
                }

                currentTableId = newTableId;
                if (selectedTableInfo) selectedTableInfo.textContent = `Bàn đang chọn: ${tableItem.textContent}`;
                if (currentTableNameSpan) currentTableNameSpan.textContent = tableItem.textContent;

                // Tải order của bàn mới chọn từ DB
                console.log("Loading order for new table:", newTableId);
                try {
                    const response = await fetch('api/orders.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'get_order', tableId: newTableId })
                    });
                    const data = await response.json();

                    if (data.success && data.order) {
                        currentOrder = {
                            orderId: data.order.OrderID,
                            items: data.order.items.map(item => ({
                                id: item.id,
                                name: item.name,
                                price: parseFloat(item.price),
                                quantity: parseInt(item.quantity)
                            })),
                            subtotal: parseFloat(data.order.Subtotal),
                            discount: parseFloat(data.order.Subtotal) * (parseFloat(data.order.DiscountPercent) / 100),
                            total: parseFloat(data.order.Total),
                            discountPercent: parseFloat(data.order.DiscountPercent || 0)
                        };
                        if (discountInput) discountInput.value = currentOrder.discountPercent;
                        console.log("Order loaded for new table:", currentOrder);
                    } else {
                        // Nếu không có order, tạo order rỗng
                        console.log("No existing order for new table, creating empty one.");
                        currentOrder = { items: [], subtotal: 0, discount: 0, total: 0, orderId: null, discountPercent: 0 };
                        if (discountInput) discountInput.value = 0;
                    }
                    tableOrders[currentTableId] = { ...currentOrder };
                } catch (error) {
                    console.error('Lỗi khi tải order bàn mới:', error);
                    alert('Lỗi kết nối: Không thể tải order cho bàn mới.');
                    currentOrder = { items: [], subtotal: 0, discount: 0, total: 0, orderId: null, discountPercent: 0 };
                    if (discountInput) discountInput.value = 0;
                }

                await loadInitialData();
                renderTables();
                renderOrder();
                updateBillDetails();
            }
        });
    }


    // --- Xử lý thêm món vào Order ---
    if (menuItemsContainer) {
        menuItemsContainer.addEventListener('click', async (e) => {
            const addToOrderBtn = e.target.closest('.add-to-order-btn');
            if (addToOrderBtn) {
                if (!currentTableId) {
                    alert('⚠️ Vui lòng chọn một bàn trước khi thêm món!');
                    return;
                }

                const dishId = addToOrderBtn.dataset.id;
                const dish = dishes.find(d => d.DishID === dishId);

                if (dish) {
                    // Disable button temporarily
                    addToOrderBtn.disabled = true;
                    const originalText = addToOrderBtn.innerHTML;
                    addToOrderBtn.innerHTML = '⏳ Đang thêm...';

                    const originalPrice = parseFloat(dish.Price);
                    const existingItem = currentOrder.items.find(item => item.id === dish.DishID);
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        currentOrder.items.push({
                            id: dish.DishID,
                            name: dish.Name,
                            price: originalPrice,
                            originalPrice: originalPrice,
                            quantity: 1
                        });
                    }

                    // Recalculate prices (handles buffet logic for all items)
                    recalcItemPrices();

                    const currentTable = tables.find(t => t.TableID === currentTableId);
                    if (currentTable && currentTable.ENUM === 'trống') {
                        currentTable.ENUM = 'occupied';
                    }

                    tableOrders[currentTableId] = { ...currentOrder };
                    renderTables();
                    renderOrder();
                    updateBillDetails();

                    console.log("Attempting to save order to server:", currentOrder);
                    try {
                        const response = await fetch('api/orders.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                action: 'create_or_update',
                                orderId: currentOrder.orderId,
                                tableId: currentTableId,
                                staffId: currentStaffId,
                                items: currentOrder.items,
                                subtotal: currentOrder.subtotal,
                                discountPercent: currentOrder.discountPercent,
                                total: currentOrder.total
                            })
                        });
                        const data = await response.json();
                        if (data.success) {
                            if (!currentOrder.orderId && data.orderId) {
                                currentOrder.orderId = data.orderId;
                                tableOrders[currentTableId].orderId = data.orderId;
                            }
                            console.log('✅ Order đã được cập nhật trên server. OrderID:', currentOrder.orderId);

                            // Success feedback
                            addToOrderBtn.innerHTML = '✓ Đã thêm!';
                            addToOrderBtn.style.backgroundColor = '#28a745';
                            setTimeout(() => {
                                addToOrderBtn.innerHTML = originalText;
                                addToOrderBtn.style.backgroundColor = '';
                                addToOrderBtn.disabled = false;
                            }, 1000);
                        } else {
                            console.error('Lỗi khi cập nhật order lên server:', data.message);
                            alert('❌ Lỗi: ' + data.message);
                            addToOrderBtn.innerHTML = originalText;
                            addToOrderBtn.disabled = false;
                        }
                    } catch (error) {
                        console.error('Lỗi kết nối API khi cập nhật order:', error);
                        alert('❌ Lỗi kết nối: Không thể lưu order.');
                        addToOrderBtn.innerHTML = originalText;
                        addToOrderBtn.disabled = false;
                    }
                }
            }
        });
    }


    // --- Xóa món khỏi Order ---
    if (orderList) {
        orderList.addEventListener('click', async (e) => {
            const removeFromOrderBtn = e.target.closest('.remove-from-order-btn');
            if (removeFromOrderBtn && currentTableId) {
                const dishId = removeFromOrderBtn.dataset.id;
                const itemIndex = currentOrder.items.findIndex(item => item.id === dishId);

                if (itemIndex > -1) {
                    if (currentOrder.items[itemIndex].quantity > 1) {
                        currentOrder.items[itemIndex].quantity--;
                    } else {
                        currentOrder.items.splice(itemIndex, 1);
                    }
                    // Recalculate prices (restores prices if buffet was removed)
                    recalcItemPrices();

                    if (currentOrder.items.length === 0) {
                        const currentTable = tables.find(t => t.TableID === currentTableId);
                        if (currentTable) {
                            currentTable.ENUM = 'trống';
                        }
                    }

                    tableOrders[currentTableId] = { ...currentOrder };
                    renderTables();
                    renderOrder();
                    updateBillDetails();
                    console.log("Attempting to save order to server after removal:", currentOrder);
                    try {
                        const response = await fetch('api/orders.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                action: 'create_or_update',
                                orderId: currentOrder.orderId,
                                tableId: currentTableId,
                                staffId: currentStaffId,
                                items: currentOrder.items,
                                subtotal: currentOrder.subtotal,
                                discountPercent: currentOrder.discountPercent,
                                total: currentOrder.total
                            })
                        });
                        const data = await response.json();
                        if (!data.success) {
                            console.error('Lỗi khi cập nhật order lên server:', data.message);
                            alert('Lỗi: ' + data.message);
                        } else {
                            console.log('Order đã được cập nhật trên server sau khi xóa món.');
                        }
                    } catch (error) {
                        console.error('Lỗi kết nối API khi cập nhật order:', error);
                        alert('Lỗi kết nối: Không thể lưu order.');
                    }
                }
            }
        });
    }


    // --- Xử lý nút Hủy Order ---
    if (cancelOrderBtn) {
        cancelOrderBtn.addEventListener('click', async () => {
            if (!currentTableId) {
                alert('Vui lòng chọn một bàn để hủy order.');
                return;
            }

            const currentTable = tables.find(t => t.TableID === currentTableId);
            if (currentTable && currentTable.ENUM === 'ready-to-bill') {
                alert('Bàn đang chờ thanh toán, không thể hủy order.');
                return;
            }

            if (confirm(`Bạn có chắc chắn muốn hủy order cho bàn ${currentTable ? currentTable.Name : ''}?`)) {
                try {
                    const response = await fetch('api/orders.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'cancel_order', tableId: currentTableId })
                    });
                    const data = await response.json();

                    if (data.success) {
                        delete tableOrders[currentTableId];
                        if (currentTable) currentTable.ENUM = 'trống';

                        currentOrder = { items: [], subtotal: 0, discount: 0, total: 0, orderId: null, discountPercent: 0 };
                        currentTableId = null;

                        renderTables();
                        renderOrder();
                        updateBillDetails();
                        if (selectedTableInfo) selectedTableInfo.textContent = 'Chưa chọn bàn nào.';
                        if (currentTableNameSpan) currentTableNameSpan.textContent = 'Chưa chọn';
                        updateButtonsState();
                        alert('Order đã được hủy thành công.');
                    } else {
                        alert('Lỗi khi hủy order: ' + data.message);
                    }
                } catch (error) {
                    console.error('Lỗi kết nối API khi hủy order:', error);
                    alert('Lỗi kết nối: Không thể hủy order.');
                }
            }
        });
    }


    // --- Xử lý nút Thanh toán ---
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            if (!currentTableId) {
                alert('Vui lòng chọn một bàn để thanh toán.');
                return;
            }

            const currentTable = tables.find(t => t.TableID === currentTableId);
            if (!currentTable) {
                alert('Không tìm thấy thông tin bàn.');
                return;
            }

            if (currentOrder.items.length === 0) {
                alert('Vui lòng thêm món vào order trước khi thanh toán.');
                return;
            }

            try {
                const response = await fetch('api/tables.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tableId: currentTableId, status: 'ready-to-bill' })
                });
                const data = await response.json();

                if (data.success) {
                    currentTable.ENUM = 'ready-to-bill';
                    renderTables();
                    updateButtonsState();
                    alert(`Bàn ${currentTable.Name} đã sẵn sàng thanh toán! Tổng cộng: ${formatCurrency(currentOrder.total)} VND. Vui lòng xác nhận thanh toán.`);
                } else {
                    alert('Lỗi khi chuẩn bị thanh toán: ' + data.message);
                }
            } catch (error) {
                console.error('Lỗi kết nối API khi chuẩn bị thanh toán:', error);
                alert('Lỗi kết nối: Không thể chuẩn bị thanh toán.');
            }
        });
    }


    // --- Xử lý nút In Tạm Tính ---
    if (printTempBillBtn) {
        printTempBillBtn.addEventListener('click', () => {
            if (!currentTableId) {
                alert('⚠️ Vui lòng chọn một bàn để in hóa đơn tạm tính.');
                return;
            }
            const currentTable = tables.find(t => t.TableID === currentTableId);
            if (!currentTable || currentOrder.items.length === 0) {
                alert('⚠️ Bàn này chưa có món nào để in hóa đơn.');
                return;
            }
            // Hiển thị modal hóa đơn tạm tính (tự động mở hộp thoại in)
            const paymentMethod = document.getElementById('paymentMethodSelect')?.value || 'cash';
            showInvoiceModal(currentOrder, currentTable.Name, paymentMethod);
        });
    }

    // --- Xử lý nút Xác nhận Thanh toán ---
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', async () => {
            if (!currentTableId) {
                alert('⚠️ Vui lòng chọn một bàn để xác nhận thanh toán.');
                return;
            }

            const currentTable = tables.find(t => t.TableID === currentTableId);

            if (currentTable && currentTable.ENUM === 'ready-to-bill' && currentOrder.items.length > 0) {
                // Kiểm tra lại orderId và staffId trước khi gửi đi
                if (!currentOrder.orderId) {
                    alert('❌ Lỗi: Không tìm thấy OrderID cho đơn hàng hiện tại. Vui lòng thử lại.');
                    console.error('OrderID is null during checkout:', currentOrder);
                    return;
                }
                if (!currentStaffId) {
                    alert('❌ Lỗi: Không tìm thấy StaffID. Vui lòng đăng nhập lại.');
                    console.error('StaffID is null during checkout.');
                    return;
                }

                // Double confirm
                const confirmMsg = `💰 XÁC NHẬN THANH TOÁN\n\nBàn: ${currentTable.Name}\nTổng tiền: ${formatCurrency(currentOrder.total)}\n\nBạn có chắc chắn muốn thanh toán?`;
                if (!confirm(confirmMsg)) {
                    return;
                }

                // Disable button during payment
                confirmPaymentBtn.disabled = true;
                const originalText = confirmPaymentBtn.textContent;
                confirmPaymentBtn.textContent = '⏳ Đang xử lý...';

                try {
                    const finalAmount = currentOrder.total;
                    const paymentMethod = document.getElementById('paymentMethodSelect')?.value || 'cash';

                    console.log("Attempting checkout with:", {
                        tableId: currentTableId,
                        orderId: currentOrder.orderId,
                        total: finalAmount,
                        staffId: currentStaffId,
                        paymentMethod: paymentMethod
                    });

                    const response = await fetch('api/orders.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'checkout',
                            tableId: currentTableId,
                            orderId: currentOrder.orderId,
                            total: finalAmount,
                            staffId: currentStaffId,
                            paymentMethod: paymentMethod
                        })
                    });
                    const data = await response.json();

                    if (data.success) {
                        // Show invoice modal
                        showInvoiceModal(currentOrder, currentTable.Name, paymentMethod);

                        delete tableOrders[currentTableId];
                        currentTable.ENUM = 'trống';

                        currentOrder = { items: [], subtotal: 0, discount: 0, total: 0, orderId: null, discountPercent: 0 };
                        currentTableId = null;

                        renderTables();
                        renderOrder();
                        updateBillDetails();
                        if (selectedTableInfo) selectedTableInfo.textContent = 'Chưa chọn bàn nào.';
                        if (currentTableNameSpan) currentTableNameSpan.textContent = 'Chưa chọn';
                        updateButtonsState();

                        alert(`✅ Thanh toán thành công cho bàn ${currentTable.Name}. Tổng cộng: ${formatCurrency(finalAmount)}`);

                        // Re-enable button
                        confirmPaymentBtn.textContent = originalText;
                        confirmPaymentBtn.disabled = false;
                    } else {
                        alert('❌ Lỗi khi xác nhận thanh toán: ' + data.message);
                        // Re-enable button
                        confirmPaymentBtn.textContent = originalText;
                        confirmPaymentBtn.disabled = false;
                    }
                } catch (error) {
                    console.error('Lỗi kết nối API khi xác nhận thanh toán:', error);
                    alert('❌ Lỗi kết nối: Không thể xác nhận thanh toán.');
                    // Re-enable button
                    confirmPaymentBtn.textContent = originalText;
                    confirmPaymentBtn.disabled = false;
                }
            } else {
                alert('⚠️ Bàn này chưa sẵn sàng để thanh toán hoặc không có order hợp lệ.');
            }
        });
    }


    // --- Xử lý thay đổi giảm giá ---
    if (discountInput) {
        discountInput.addEventListener('input', updateBillDetails);
    }


    await loadInitialData();
    renderTables();
    renderMenuItems();
    updateButtonsState();

    // --- Xử lý nút "Xóa món ăn" ---
    const deleteDishButton = document.querySelector('.delete-dish-button');
    if (deleteDishButton) {
        deleteDishButton.addEventListener('click', async () => {
            const currentUserRole = sessionStorage.getItem('role');
            if (currentUserRole !== 'Quản lý') {
                alert('Bạn không có quyền xóa món ăn!');
                return;
            }

            const dishesForDelete = await getDishesFromAPI();
            if (dishDeleteList) {
                dishDeleteList.innerHTML = '';

                if (dishesForDelete.length === 0) {
                    const li = document.createElement('li');
                    li.textContent = 'Không có món ăn nào để xóa.';
                    dishDeleteList.appendChild(li);
                } else {
                    dishesForDelete.forEach(dish => {
                        const li = document.createElement('li');
                        li.textContent = dish.Name;
                        li.dataset.id = dish.DishID;
                        dishDeleteList.appendChild(li);
                    });
                }
            }
            if (deleteDishModal) deleteDishModal.style.display = 'flex';
        });
    }


    // --- popup xóa món ---
    if (dishDeleteList) {
        dishDeleteList.addEventListener('click', async (e) => {
            const currentUserRole = sessionStorage.getItem('role');
            if (currentUserRole !== 'Quản lý') {
                alert('Bạn không có quyền xóa món ăn!');
                return;
            }

            const dishId = e.target.dataset.id;
            if (!dishId) return;

            const dishToDelete = dishes.find(d => d.DishID === dishId);

            if (dishToDelete && confirm(`Bạn có chắc chắn muốn xóa "${dishToDelete.Name}"?`)) {
                try {
                    const response = await fetch('api/dishes.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: dishId })
                    });
                    const data = await response.json();
                    if (data.success) {
                        alert(data.message);
                        if (deleteDishModal) deleteDishModal.style.display = 'none';
                        await loadInitialData();
                        renderMenuItems();
                    } else {
                        alert('Lỗi khi xóa món ăn: ' + data.message);
                    }
                } catch (error) {
                    console.error('Lỗi kết nối API khi xóa món ăn:', error);
                    alert('Lỗi kết nối: Không thể xóa món ăn.');
                }
            }
        });
    }


    // --- Đóng popup xóa món ---
    if (closeDeleteModal) {
        closeDeleteModal.addEventListener('click', () => {
            if (deleteDishModal) deleteDishModal.style.display = 'none';
        });
    }


    // 
    if (openEditPriceBtn) {
        openEditPriceBtn.addEventListener('click', async () => {
            const currentUserRole = sessionStorage.getItem('role');
            if (currentUserRole !== 'Quản lý') {
                alert('Bạn không có quyền chỉnh sửa giá món ăn!');
                return;
            }
            const dishesForEdit = await getDishesFromAPI();
            if (editDishSelect) {
                editDishSelect.innerHTML = '';
                if (dishesForEdit.length === 0) {
                    const option = document.createElement('option');
                    option.textContent = 'Không có món ăn nào để chỉnh sửa.';
                    option.value = '';
                    editDishSelect.appendChild(option);
                    if (saveNewPriceBtn) saveNewPriceBtn.disabled = true;
                } else {
                    dishesForEdit.forEach(d => {
                        const option = document.createElement('option');
                        option.value = d.DishID;
                        option.textContent = `${d.Name} - ${formatCurrency(parseFloat(d.Price))}`;
                        editDishSelect.appendChild(option);
                    });
                    if (saveNewPriceBtn) saveNewPriceBtn.disabled = false;
                }
            }
            if (editPriceModal) editPriceModal.style.display = 'block';
        });
    }


    if (closeEditPriceBtn) {
        closeEditPriceBtn.addEventListener('click', () => {
            if (editPriceModal) editPriceModal.style.display = 'none';
        });
    }


    if (saveNewPriceBtn) {
        saveNewPriceBtn.addEventListener('click', async () => {
            const currentUserRole = sessionStorage.getItem('role');
            if (currentUserRole !== 'Quản lý') {
                alert('Bạn không có quyền chỉnh sửa giá món ăn!');
                return;
            }

            if (!editDishSelect || !newPriceInput) {
                alert('Lỗi: Không tìm thấy các phần tử chỉnh sửa giá.');
                return;
            }
            const selectedId = editDishSelect.value;
            const newPrice = parseFloat(newPriceInput.value);

            if (!selectedId || isNaN(newPrice) || newPrice <= 0) {
                alert('Vui lòng nhập giá hợp lệ.');
                return;
            }

            try {
                const response = await fetch('api/dishes.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: selectedId, price: newPrice })
                });
                const data = await response.json();

                if (data.success) {
                    alert(data.message);
                    if (editPriceModal) editPriceModal.style.display = 'none';
                    await loadInitialData();
                    renderMenuItems();
                } else {
                    alert('Lỗi khi cập nhật giá: ' + data.message);
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật giá:', error);
                alert('Đã xảy ra lỗi khi cập nhật giá. Vui lòng thử lại.');
            }
        });
    }


    let lastPaidOrder = null;
    let lastPaidTableName = '';

    // --- Hàm xử lý in hóa đơn ---
    function showInvoiceModal(order, tableName, paymentMethod = 'cash') {
        lastPaidOrder = JSON.parse(JSON.stringify(order));
        lastPaidOrder.paymentMethod = paymentMethod;
        lastPaidTableName = tableName;

        const invoiceDetails = document.getElementById('invoiceDetails');
        const invoiceModal = document.getElementById('invoiceModal');
        if (!invoiceDetails || !invoiceModal) { console.warn("Invoice modal elements not found."); return; }

        const now = new Date();
        const dateStr = now.toLocaleDateString('vi-VN');
        const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        // Trích xuất số bàn từ tableName (ví dụ "Bàn 11" -> "11")
        const tableNum = tableName.replace(/[^0-9]/g, '') || tableName;

        // Tạo mã hóa đơn giả định chuyên nghiệp từ OrderID hoặc thời gian
        const receiptCode = order.orderId ? order.orderId.replace('ord', '').toUpperCase() : Math.floor(Math.random() * 900000 + 100000);

        const cashierName = sessionStorage.getItem('staffName') || 'Nhân viên';
        const paymentMethodText = paymentMethod === 'transfer' ? 'Chuyển khoản' : 'Tiền mặt';

        invoiceDetails.innerHTML = `
            <div class="invoice-wrapper">
                <div class="invoice-header">
                    <img src="image/logo.png" alt="Quán Buffet BBQ Logo" class="invoice-logo" onerror="this.style.display='none'">
                    <div class="invoice-brand">Quán Buffet BBQ</div>
                    <div class="invoice-divider"></div>
                    <div class="invoice-table-num">${tableNum}</div>
                    <div class="invoice-meta-row" style="justify-content: center; font-size: 12px; margin-bottom: 5px;">
                        <span>Guest: --</span>
                    </div>
                </div>
                
                <div class="invoice-meta">
                    <div class="invoice-meta-row">
                        <span>Receipt: ${receiptCode}</span>
                    </div>
                    <div class="invoice-meta-row">
                        <span>Date: ${dateStr}</span>
                        <span>Close: ${timeStr}</span>
                    </div>
                    <div class="invoice-meta-row">
                        <span>Cashier: ${cashierName}</span>
                    </div>
                    <div class="invoice-meta-row">
                        <span>Waiter: ${cashierName}</span>
                    </div>
                    <div class="invoice-meta-row">
                        <span>Thanh toán: ${paymentMethodText}</span>
                    </div>
                </div>
                
                <div class="invoice-divider"></div>
                
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Dish</th>
                            <th class="qty">Qty</th>
                            <th class="total">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td class="qty">${item.quantity}</td>
                                <td class="total">${formatCurrencyNoSymbol(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="invoice-divider"></div>
                
                <div class="invoice-summary">
                    <div class="invoice-summary-row">
                        <span>Total:</span>
                        <span>${formatCurrencyNoSymbol(order.subtotal)}</span>
                    </div>
                    <div class="invoice-summary-row">
                        <span>Discount (${order.discountPercent}%):</span>
                        <span>${formatCurrencyNoSymbol(order.discount)}</span>
                    </div>
                    <div class="invoice-summary-row grand-total">
                        <span>Grand Total:</span>
                        <span>${formatCurrencyNoSymbol(order.total)}</span>
                    </div>
                </div>
                
                <div class="invoice-divider"></div>
                
                ${paymentMethod === 'transfer' ? `
                <div class="invoice-qr">
                    <p style="text-align:center; font-weight:bold; margin-bottom:6px;">Quét QR để thanh toán</p>
                    <img
                        src="https://img.vietqr.io/image/${BANK_CONFIG.bankBin}-${BANK_CONFIG.accountNumber}-qr_only.png?amount=${Math.round(order.total)}&addInfo=Thanh%20toan%20${encodeURIComponent(tableName)}&accountName=${encodeURIComponent(BANK_CONFIG.accountName)}"
                        alt="QR Thanh toan"
                        class="invoice-qr-img"
                        onerror="this.style.display='none';this.previousElementSibling.textContent='(Không tải được QR, vui lòng kiểm tra kết nối internet)'"
                    >
                    <p style="text-align:center; font-size:11px; margin-top:6px;">Ngân hàng: ${BANK_CONFIG.bankBin} | TK: ${BANK_CONFIG.accountNumber}</p>
                    <p style="text-align:center; font-size:11px;">${BANK_CONFIG.accountName}</p>
                    <p style="text-align:center; font-size:11px; font-weight:bold;">Số tiền: ${formatCurrencyNoSymbol(order.total)} VND</p>
                </div>
                <div class="invoice-divider"></div>
                ` : ''}
                
                <div class="invoice-footer">
                    <p>Cam on quy khach va hen gap lai !</p>
                    <p>Nha hang chi xuat hoa don</p>
                    <p>tai thoi diem thanh toan.</p>
                    <p>Red invoice requests only accepted</p>
                    <p>at time of checkout.</p>
                    <p>Invoices shall only be issued within a day.</p>
                    <p>Thank you and see you again!</p>
                </div>
            </div>
        `;
        invoiceModal.classList.add('active');
        invoiceModal.style.display = 'flex';

        // Tự động kích hoạt in hóa đơn sau khi hiển thị modal
        setTimeout(() => {
            window.print();
        }, 300);
    }

    // đóng hóa đơn
    window.closeInvoiceModal = function () {
        const invoiceModal = document.getElementById('invoiceModal');
        if (invoiceModal) {
            invoiceModal.classList.remove('active');
            invoiceModal.style.display = 'none';
        }
    };

    function removeAccents(str) {
        if (!str) return '';
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

    function formatCurrencyNoSymbol(amount) {
        return new Intl.NumberFormat('vi-VN').format(amount);
    }

    window.exportInvoicePDF = function () {
        if (!lastPaidOrder) {
            alert('Không tìm thấy thông tin hóa đơn vừa thanh toán!');
            return;
        }

        const { jsPDF } = window.jspdf;
        const items = lastPaidOrder.items;
        const itemCount = items.length;
        const pageHeight = 120 + (itemCount * 6) + 35;

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, Math.max(160, pageHeight)]
        });

        // Set typography styling
        doc.setFont('Helvetica', 'normal');

        // Header QUAN BUFFET BBQ
        doc.setFontSize(14);
        doc.setFont('Helvetica', 'bold');
        doc.text('QUAN BUFFET BBQ', 40, 14, { align: 'center' });
        doc.setFont('Helvetica', 'normal');

        doc.setFontSize(8);
        doc.text('------------------------------------------', 40, 18, { align: 'center' });

        // Large table number
        const tableNum = lastPaidTableName.replace(/[^0-9]/g, '') || lastPaidTableName;
        doc.setFontSize(24);
        doc.setFont('Helvetica', 'bold');
        doc.text(tableNum, 40, 27, { align: 'center' });
        doc.setFont('Helvetica', 'normal');

        doc.setFontSize(8);
        doc.text('Guest: --', 40, 32, { align: 'center' });
        doc.text('------------------------------------------', 40, 36, { align: 'center' });

        // Metadata (remove accents to avoid jsPDF font issues)
        const now = new Date();
        const dateStr = now.toLocaleDateString('vi-VN');
        const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

        const receiptCode = lastPaidOrder.orderId ? lastPaidOrder.orderId.replace('ord', '').toUpperCase() : Math.floor(Math.random() * 900000 + 100000);
        const cleanStaffName = removeAccents(sessionStorage.getItem('staffName') || 'Nhan vien');

        const cleanPaymentMethod = lastPaidOrder.paymentMethod === 'transfer' ? 'Chuyen khoan' : 'Tien mat';

        doc.text(`Receipt: ${receiptCode}`, 10, 41);
        doc.text(`Date: ${dateStr}    Close: ${timeStr}`, 10, 46);
        doc.text(`Cashier: ${cleanStaffName}`, 10, 51);
        doc.text(`Waiter: ${cleanStaffName}`, 10, 56);
        doc.text(`Thanh toan: ${cleanPaymentMethod}`, 10, 61);

        doc.text('------------------------------------------', 40, 66, { align: 'center' });

        // Table Headers
        doc.text('Dish', 10, 71);
        doc.text('Qty', 45, 71, { align: 'right' });
        doc.text('Total', 70, 71, { align: 'right' });

        doc.text('------------------------------------------', 40, 75, { align: 'center' });

        // Table Body
        let y = 80;
        items.forEach(item => {
            const cleanName = removeAccents(item.name);
            const totalItemAmount = formatCurrencyNoSymbol(item.price * item.quantity);
            doc.text(cleanName, 10, y);
            doc.text(String(item.quantity), 45, y, { align: 'right' });
            doc.text(totalItemAmount, 70, y, { align: 'right' });
            y += 6;
        });

        doc.text('------------------------------------------', 40, y, { align: 'center' });
        y += 5;

        // Totals
        const cleanSubtotal = formatCurrencyNoSymbol(lastPaidOrder.subtotal);
        const cleanDiscount = formatCurrencyNoSymbol(lastPaidOrder.discount);
        const cleanTotal = formatCurrencyNoSymbol(lastPaidOrder.total);

        doc.text('Total:', 10, y);
        doc.text(cleanSubtotal, 70, y, { align: 'right' });
        y += 5;

        doc.text(`Discount (${lastPaidOrder.discountPercent}%):`, 10, y);
        doc.text(cleanDiscount, 70, y, { align: 'right' });
        y += 6;

        doc.setFont('Helvetica', 'bold');
        doc.text('Grand Total:', 10, y);
        doc.text(cleanTotal, 70, y, { align: 'right' });
        doc.setFont('Helvetica', 'normal');

        y += 6;
        doc.text('------------------------------------------', 40, y, { align: 'center' });

        // Footer (English/Vietnamese with no accents to avoid PDF encoding issues)
        y += 5;
        doc.setFontSize(7);
        doc.text('Cam on quy khach va hen gap lai !', 40, y, { align: 'center' });
        y += 4;
        doc.text('Nha hang chi xuat hoa don tai thoi diem thanh toan.', 40, y, { align: 'center' });
        y += 4;
        doc.text('Red invoice requests only accepted at time of checkout.', 40, y, { align: 'center' });
        y += 4;
        doc.text('Invoices shall only be issued within a day.', 40, y, { align: 'center' });
        y += 4;
        doc.text('Thank you and see you again!', 40, y, { align: 'center' });

        // Save PDF
        const filename = `Quán Buffet BBQ_HD_${lastPaidTableName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        doc.save(filename);
    };
});

// --- Hamburger Menu Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const hamburgerBtn = document.getElementById('hamburgerBtn');

    if (hamburgerBtn && hamburgerMenu) {
        hamburgerBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
            hamburgerMenu.classList.toggle('open');
        });

        // Đóng menu khi click ra bên ngoài
        document.addEventListener('click', (event) => {
            if (hamburgerMenu.classList.contains('open') && !hamburgerMenu.contains(event.target)) {
                hamburgerMenu.classList.remove('open');
            }
        });
    }
});
// ---Check-in/Check-out ---
const staffNameDisplay = document.getElementById('staffNameDisplay');
const shiftStatusDisplay = document.getElementById('shiftStatusDisplay');
const checkInBtn = document.getElementById('checkInBtn');
const checkOutBtn = document.getElementById('checkOutBtn');

const staffId = sessionStorage.getItem('staffId');
const staffName = sessionStorage.getItem('staffName');

if (staffId && staffName) {
    staffNameDisplay.textContent = staffName;
}

// Hàm kiểm tra trạng thái ca làm hiện tại
async function checkShiftStatus() {
    try {
        const response = await fetch(`api/shifts.php?staffId=${staffId}`);
        const result = await response.json();
        if (result.success) {
            if (result.shiftStatus === 'checked-in') {
                shiftStatusDisplay.textContent = 'Đã Check-in';
                shiftStatusDisplay.style.color = 'green';
                checkInBtn.style.display = 'none';
                checkOutBtn.style.display = 'inline-block';
            } else {
                shiftStatusDisplay.textContent = 'Chưa Check-in';
                shiftStatusDisplay.style.color = 'red';
                checkInBtn.style.display = 'inline-block';
                checkOutBtn.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái ca làm:', error);
        shiftStatusDisplay.textContent = 'Lỗi kết nối';
    }
}

// Xử lý Check-in
if (checkInBtn) {
    checkInBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('api/shifts.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ staffId: staffId })
            });
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                checkShiftStatus();
            }
        } catch (error) {
            console.error('Lỗi khi check-in:', error);
            alert('Đã xảy ra lỗi khi check-in. Vui lòng thử lại.');
        }
    });
}

// Xử lý Check-out
if (checkOutBtn) {
    checkOutBtn.addEventListener('click', async () => {
        if (confirm('Bạn có muốn Check-out ca làm này không?')) {
            try {
                const response = await fetch('api/shifts.php', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ staffId: staffId })
                });
                const result = await response.json();
                alert(result.message);
                if (result.success) {
                    checkShiftStatus();
                }
            } catch (error) {
                console.error('Lỗi khi check-out:', error);
                alert('Đã xảy ra lỗi khi check-out. Vui lòng thử lại.');
            }
        }
    });
}

// Hiển thị trạng thái ban đầu
checkShiftStatus();

// ============================================================
// ENHANCED FEATURES - TABLE FILTER & MENU SEARCH
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Table Filter Buttons
    const filterAllTables = document.getElementById('filterAllTables');
    const filterEmptyTables = document.getElementById('filterEmptyTables');
    const filterOccupiedTables = document.getElementById('filterOccupiedTables');

    if (filterAllTables) {
        filterAllTables.addEventListener('click', () => {
            document.querySelectorAll('.table-item').forEach(table => {
                table.style.display = 'flex';
            });
            setActiveFilterBtn(filterAllTables);
        });
    }

    if (filterEmptyTables) {
        filterEmptyTables.addEventListener('click', () => {
            document.querySelectorAll('.table-item').forEach(table => {
                if (table.classList.contains('empty')) {
                    table.style.display = 'flex';
                } else {
                    table.style.display = 'none';
                }
            });
            setActiveFilterBtn(filterEmptyTables);
        });
    }

    if (filterOccupiedTables) {
        filterOccupiedTables.addEventListener('click', () => {
            document.querySelectorAll('.table-item').forEach(table => {
                if (table.classList.contains('occupied') || table.classList.contains('ready-to-bill')) {
                    table.style.display = 'flex';
                } else {
                    table.style.display = 'none';
                }
            });
            setActiveFilterBtn(filterOccupiedTables);
        });
    }

    function setActiveFilterBtn(activeBtn) {
        [filterAllTables, filterEmptyTables, filterOccupiedTables].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        if (activeBtn) activeBtn.classList.add('active');
    }

    // Menu Search & Category Filter
    const searchMenu = document.getElementById('searchMenu');
    const categoryFilterMenu = document.getElementById('categoryFilterMenu');

    function filterMenuItems() {
        const searchTerm = searchMenu ? searchMenu.value.toLowerCase() : '';
        const category = categoryFilterMenu ? categoryFilterMenu.value : '';

        document.querySelectorAll('.menu-item').forEach(item => {
            const dishName = item.querySelector('h4')?.textContent.toLowerCase() || '';
            const dishCategory = item.querySelector('.text-muted')?.textContent || '';

            const matchSearch = dishName.includes(searchTerm);
            const matchCategory = !category || dishCategory === category;

            if (matchSearch && matchCategory) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    if (searchMenu) {
        searchMenu.addEventListener('input', filterMenuItems);
    }

    if (categoryFilterMenu) {
        categoryFilterMenu.addEventListener('change', filterMenuItems);
    }
});
