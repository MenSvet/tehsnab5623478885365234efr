document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    const orderList = document.getElementById('orderList');
    const productionOrderList = document.getElementById('productionOrderList');
    const filterInput = document.getElementById('filterInput');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.getElementById('closeModal');
    const orderIdField = document.getElementById('orderId');

    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveOrder();
        });

        // Load the order data if editing
        const orderToEdit = JSON.parse(localStorage.getItem('orderToEdit'));
        if (orderToEdit) {
            document.getElementById('orderId').value = orderToEdit.id;
            document.getElementById('customerName').value = orderToEdit.customerName;
            document.getElementById('supplierName').value = orderToEdit.supplierName;
            document.getElementById('orderDate').value = orderToEdit.orderDate;
            document.getElementById('dueDate').value = orderToEdit.dueDate;
            document.getElementById('productDetails').value = orderToEdit.productDetails;
            document.getElementById('paymentDate').value = orderToEdit.paymentDate;
            document.getElementById('comment').value = orderToEdit.comment;
            document.getElementById('productionStatus').value = orderToEdit.productionStatus;
            document.getElementById('paymentStatus').value = orderToEdit.paymentStatus;

            localStorage.removeItem('orderToEdit');
        }
    }

    if (filterInput) {
        filterInput.addEventListener('input', function() {
            filterOrders(filterInput.value);
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            imageModal.classList.add('hidden');
        });
    }

    function saveOrder() {
        const orderId = orderIdField.value ? parseInt(orderIdField.value) : Date.now();
        const customerName = document.getElementById('customerName').value;
        const supplierName = document.getElementById('supplierName').value;
        const orderDate = document.getElementById('orderDate').value;
        const dueDate = document.getElementById('dueDate').value;
        const productDetails = document.getElementById('productDetails').value;
        const productImage = document.getElementById('productImage').files[0];
        const paymentDate = document.getElementById('paymentDate').value;
        const comment = document.getElementById('comment').value;
        const productionStatus = document.getElementById('productionStatus').value;
        const paymentStatus = document.getElementById('paymentStatus').value;

        if (productImage) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const newOrder = {
                    id: orderId,
                    customerName,
                    supplierName,
                    orderDate,
                    dueDate,
                    productDetails,
                    productImage: event.target.result,
                    paymentDate,
                    comment,
                    productionStatus,
                    paymentStatus
                };

                const existingOrderIndex = orders.findIndex(order => order.id === orderId);
                if (existingOrderIndex > -1) {
                    orders[existingOrderIndex] = newOrder;
                } else {
                    orders.push(newOrder);
                }
                orders.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                localStorage.setItem('orders', JSON.stringify(orders));
                window.location.href = 'index.html';
            };
            reader.readAsDataURL(productImage);
        } else {
            const newOrder = {
                id: orderId,
                customerName,
                supplierName,
                orderDate,
                dueDate,
                productDetails,
                productImage: null,
                paymentDate,
                comment,
                productionStatus,
                paymentStatus
            };

            const existingOrderIndex = orders.findIndex(order => order.id === orderId);
            if (existingOrderIndex > -1) {
                orders[existingOrderIndex] = newOrder;
            } else {
                orders.push(newOrder);
            }
            orders.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            localStorage.setItem('orders', JSON.stringify(orders));
            window.location.href = 'index.html';
        }
    }

    function displayOrders() {
        orderList.innerHTML = '';
        for (const order of orders) {
            const orderRow = document.createElement('tr');
            orderRow.dataset.id = order.id;
            orderRow.innerHTML = `
                <td class="py-2 px-4 border-b">${order.customerName}</td>
                <td class="py-2 px-4 border-b">${order.supplierName}</td>
                <td class="py-2 px-4 border-b">${order.orderDate}</td>
                <td class="py-2 px-4 border-b">${order.dueDate}</td>
                <td class="py-2 px-4 border-б">
                    ${order.productDetails}
                    ${order.productImage ? `<img src="${order.productImage}" alt="product image" class="w-16 h-16 cursor-pointer" onclick="showImageModal('${order.productImage}')">` : ''}
                </td>
                <td class="py-2 px-4 border-б">${order.paymentDate}</td>
                <td class="py-2 px-4 border-б">${order.comment}</td>
                <td class="py-2 px-4 border-б">${order.productionStatus}</td>
                <td class="py-2 px-4 border-б">${order.paymentStatus}</td>
                <td class="py-2 px-4 border-б">
                    <button class="edit-order bg-yellow-500 text-white p-1 rounded" onclick="editOrder(${order.id})">Редактировать</button>
                    <button class="delete-order bg-red-500 text-white p-1 rounded" onclick="deleteOrder(${order.id})">Удалить</button>
                </td>
            `;
            orderList.appendChild(orderRow);
        }
    }

    function displayProductionOrders() {
        productionOrderList.innerHTML = '';
        const productionOrders = orders.filter(order => order.productionStatus === 'Передан на производство' || order.productionStatus === 'Готов');
        for (const order of productionOrders) {
            const orderRow = document.createElement('tr');
            orderRow.dataset.id = order.id;
            orderRow.innerHTML = `
                <td class="py-2 px-4 border-б">${order.customerName}</td>
                <td class="py-2 px-4 border-б">${order.supplierName}</td>
                <td class="py-2 px-4 border-б">${order.orderDate}</td>
                <td class="py-2 px-4 border-б">${order.dueDate}</td>
                <td class="py-2 px-4 border-б">
                    ${order.productDetails}
                    ${order.productImage ? `<img src="${order.productImage}" alt="product image" class="w-16 h-16 cursor-pointer" onclick="showImageModal('${order.productImage}')">` : ''}
                </td>
                <td class="py-2 px-4 border-б">${order.paymentDate}</td>
                <td class="py-2 px-4 border-б">${order.comment}</td>
                <td class="py-2 px-4 border-б">${order.productionStatus}</td>
                <td class="py-2 px-4 border-б">${order.paymentStatus}</td>
                <td class="py-2 px-4 border-б">
                    <button class="status-change bg-green-500 text-white p-1 rounded" onclick="changeProductionStatus(${order.id}, 'Готов')">Готов</button>
                    <button class="status-change bg-blue-500 text-white p-1 rounded" onclick="changeProductionStatus(${order.id}, 'Отгружен')">Отгружен</button>
                </td>
            `;
            productionOrderList.appendChild(orderRow);
        }
    }

    window.changeProductionStatus = function(orderId, newStatus) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.productionStatus = newStatus;
            localStorage.setItem('orders', JSON.stringify(orders));
            displayProductionOrders();
        }
    };

    window.editOrder = function(orderId) {
        const order = orders.find(o => o.id === orderId);
        localStorage.setItem('orderToEdit', JSON.stringify(order));
        window.location.href = 'new-order.html';
    };

    window.deleteOrder = function(orderId) {
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
        displayProductionOrders();
    };

    function filterOrders(query) {
        const rows = orderList.getElementsByTagName('tr');
        for (let row of rows) {
            const cells = row.getElementsByTagName('td');
            let match = false;
            for (let cell of cells) {
                if (cell.textContent.toLowerCase().includes(query.toLowerCase())) {
                    match = true;
                    break;
                }
            }
            row.style.display = match ? '' : 'none';
        }
    }

    window.showImageModal = function(src) {
        modalImage.src = src;
        imageModal.classList.remove('hidden');
    };

    if (orderList) {
        displayOrders();
    }

    if (productionOrderList) {
        displayProductionOrders();
    }
});
