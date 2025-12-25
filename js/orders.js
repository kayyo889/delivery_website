// js/orders.js
// Основной скрипт для страницы истории заказов

let allOrders = []; // Массив для хранения всех заказов
let currentOrderId = null; // ID заказа, выбранного для действий

// DOM элементы
const ordersTable = document.getElementById('orders-table');
const ordersTbody = document.getElementById('orders-tbody');
const emptyOrdersMsg = document.getElementById('empty-orders');
const loadingIndicator = document.getElementById('orders-loading');

// Элементы модального окна "Детали"
const detailsModal = document.getElementById('details-modal');
const modalOrderNumber = document.getElementById('modal-order-number');
const modalOrderDate = document.getElementById('modal-order-date');
const modalOrderDishes = document.getElementById('modal-order-dishes');
const modalOrderTotal = document.getElementById('modal-order-total');
const modalDeliveryType = document.getElementById('modal-delivery-type');
const modalDeliveryTime = document.getElementById('modal-delivery-time');
const modalDeliveryAddress = document.getElementById('modal-delivery-address');
const modalComment = document.getElementById('modal-comment');

// Элементы модального окна "Редактирование"
const editModal = document.getElementById('edit-modal');
const editOrderId = document.getElementById('edit-order-id');
const editModalOrderNumber = document.getElementById('edit-modal-order-number');
const editFullName = document.getElementById('edit-full-name');
const editEmail = document.getElementById('edit-email');
const editPhone = document.getElementById('edit-phone');
const editDeliveryAddress = document.getElementById('edit-delivery-address');
const editDeliveryType = document.getElementById('edit-delivery-type');
const editDeliveryTime = document.getElementById('edit-delivery-time');
const editComment = document.getElementById('edit-comment');
const editOrderForm = document.getElementById('edit-order-form');
const saveEditBtn = document.getElementById('save-edit-btn');

// Элементы модального окна "Удаление"
const deleteModal = document.getElementById('delete-modal');
const deleteModalOrderNumber = document.getElementById('delete-modal-order-number');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

// ==================== УТИЛИТЫ ДЛЯ РАБОТЫ С МОДАЛЬНЫМИ ОКНАМИ ====================

// Функция для показа модального окна
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
    }
}

// Функция для закрытия модального окна
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Восстанавливаем прокрутку
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
    // Удаляем старое уведомление, если есть
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s, fadeOut 0.3s 2.7s;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
    `;

    document.body.appendChild(notification);

    // Автоматически удаляем через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}



// Функция для загрузки списка заказов с сервера
async function loadOrders() {
    try {
        const response = await fetch('http://localhost:3000/api/orders');

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const orders = await response.json();

        // Сортируем заказы по дате (сначала новые)
        orders.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

        return orders;

    } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
        showNotification('Не удалось загрузить историю заказов', 'error');
        return [];
    }
}

// Функция для отправки обновленных данных заказа
async function updateOrder(orderId, orderData) {
    try {


        const response = await fetch('http://localhost:3000/api/orders/${orderId}', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Ошибка при обновлении заказа:', error);
        throw error;
    }
}

// Функция для удаления заказа
async function deleteOrder(orderId) {
    try {
        // ВАЖНО: Замените URL на реальный эндпоинт вашего API для удаления заказа
        // Для удаления используется метод DELETE[citation:7]
        const response = await fetch('http://localhost:3000/api/orders/${orderId}', {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        return true;

    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        throw error;
    }
}

// ==================== ФУНКЦИИ ДЛЯ ОТОБРАЖЕНИЯ ДАННЫХ ====================

// Функция для форматирования даты
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Функция для форматирования времени доставки
function formatDeliveryTime(deliveryTime) {
    if (deliveryTime === 'asap' || !deliveryTime) {
        return 'Как можно скорее (с 7:00 до 23:00)';
    }
    return deliveryTime;
}

// Функция для отображения списка заказов в таблице
function renderOrdersTable(orders) {
    // Скрываем индикатор загрузки
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }

    // Проверяем, есть ли заказы
    if (!orders || orders.length === 0) {
        emptyOrdersMsg.style.display = 'block';
        return;
    }

    // Показываем таблицу
    ordersTable.style.display = 'table';
    emptyOrdersMsg.style.display = 'none';

    // Очищаем тело таблицы
    ordersTbody.innerHTML = '';

    // Добавляем каждый заказ в таблицу
    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.dataset.orderId = order.id || order._id;

        // Форматируем список блюд
        const dishesText = order.dishes
            ? Object.values(order.dishes).join(', ')
            : 'Состав не указан';

        row.innerHTML = `
            <td class="order-number">${index + 1}</td>
            <td class="order-date">${formatDate(order.createdAt || order.date)}</td>
            <td class="order-dishes">${dishesText}</td>
            <td class="order-price">${order.total || 0} руб.</td>
            <td class="order-delivery-time">${formatDeliveryTime(order.delivery_time)}</td>
            <td>
                <div class="order-actions">
                    <button class="action-btn btn-details" data-action="details" data-order-id="${order.id || order._id}" title="Подробнее">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="action-btn btn-edit" data-action="edit" data-order-id="${order.id || order._id}" title="Редактировать">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="action-btn btn-delete" data-action="delete" data-order-id="${order.id || order._id}" title="Удалить">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;

        ordersTbody.appendChild(row);
    });
}

// Функция для открытия модального окна с деталями заказа
function openOrderDetails(orderId) {
    const order = allOrders.find(o => (o.id || o._id) === orderId);
    if (!order) return;

    // Заполняем данные в модальном окне
    modalOrderNumber.textContent = allOrders.findIndex(o => (o.id || o._id) === orderId) + 1;
    modalOrderDate.textContent = formatDate(order.createdAt || order.date);
    modalOrderTotal.textContent = `${order.total || 0} руб.`;
    modalDeliveryType.textContent = order.delivery_type || 'Стандартная';
    modalDeliveryTime.textContent = formatDeliveryTime(order.delivery_time);
    modalDeliveryAddress.textContent = order.delivery_address || 'Не указан';
    modalComment.textContent = order.comment || 'Нет комментария';

    // Формируем список блюд
    modalOrderDishes.innerHTML = '';
    if (order.dishes) {
        Object.values(order.dishes).forEach(dishName => {
            const li = document.createElement('li');
            li.textContent = dishName;
            modalOrderDishes.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'Состав не указан';
        modalOrderDishes.appendChild(li);
    }

    // Показываем модальное окно
    openModal('details-modal');
}

// Функция для открытия модального окна редактирования заказа
function openOrderEdit(orderId) {
    const order = allOrders.find(o => (o.id || o._id) === orderId);
    if (!order) return;

    // Сохраняем ID текущего заказа
    currentOrderId = orderId;

    // Заполняем форму данными заказа
    editOrderId.value = orderId;
    editModalOrderNumber.textContent = allOrders.findIndex(o => (o.id || o._id) === orderId) + 1;
    editFullName.value = order.full_name || order.customer_name || '';
    editEmail.value = order.email || '';
    editPhone.value = order.phone || order.customer_phone || '';
    editDeliveryAddress.value = order.delivery_address || '';
    editDeliveryType.value = order.delivery_type || 'standard';
    editDeliveryTime.value = order.delivery_time || '13:00-14:00';
    editComment.value = order.comment || '';

    // Показываем модальное окно
    openModal('edit-modal');
}

// Функция для открытия модального окна подтверждения удаления
function openOrderDelete(orderId) {
    const orderIndex = allOrders.findIndex(o => (o.id || o._id) === orderId);
    if (orderIndex === -1) return;

    // Сохраняем ID текущего заказа
    currentOrderId = orderId;

    // Заполняем номер заказа
    deleteModalOrderNumber.textContent = orderIndex + 1;

    // Показываем модальное окно
    openModal('delete-modal');
}

// ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

// Обработчик для кнопок действий в таблице
function handleTableAction(event) {
    const target = event.target;

    // Находим ближайшую кнопку действия
    const actionBtn = target.closest('[data-action]');
    if (!actionBtn) return;

    const action = actionBtn.dataset.action;
    const orderId = actionBtn.dataset.orderId;

    switch (action) {
        case 'details':
            openOrderDetails(orderId);
            break;
        case 'edit':
            openOrderEdit(orderId);
            break;
        case 'delete':
            openOrderDelete(orderId);
            break;
    }
}

// Обработчик для кнопок закрытия модальных окон
function handleModalClose(event) {
    const target = event.target;

    // Закрытие по клику на крестик
    if (target.classList.contains('modal-close') || target.hasAttribute('data-modal')) {
        const modalId = target.dataset.modal || target.closest('[data-modal]')?.dataset.modal;
        if (modalId) {
            closeModal(modalId);
        }
    }

    // Закрытие по клику на фоновую область
    if (target.classList.contains('modal-overlay')) {
        const modalId = target.id;
        closeModal(modalId);
    }

    // Закрытие по клику на кнопки "Ок", "Отмена" (кроме "Сохранить" и "Да, удалить")
    if (target.classList.contains('btn') &&
        !target.id.includes('save-edit') &&
        !target.id.includes('confirm-delete') &&
        target.textContent !== 'Сохранить' &&
        target.textContent !== 'Да, удалить') {
        const modal = target.closest('.modal-overlay');
        if (modal) {
            closeModal(modal.id);
        }
    }
}

// Обработчик для отправки формы редактирования
async function handleEditFormSubmit(event) {
    event.preventDefault();

    // Блокируем кнопку сохранения
    saveEditBtn.disabled = true;
    saveEditBtn.textContent = 'Сохранение...';

    try {
        // Формируем данные для отправки
        const orderData = {
            full_name: editFullName.value,
            email: editEmail.value,
            phone: editPhone.value,
            delivery_address: editDeliveryAddress.value,
            delivery_type: editDeliveryType.value,
            delivery_time: editDeliveryTime.value,
            comment: editComment.value
        };

        // Отправляем данные на сервер
        await updateOrder(currentOrderId, orderData);

        // Показываем уведомление об успехе
        showNotification('Заказ успешно изменён');

        // Закрываем модальное окно
        closeModal('edit-modal');

        // Обновляем список заказов
        await refreshOrders();

    } catch (error) {
        console.error('Ошибка при сохранении изменений:', error);
        showNotification('Не удалось сохранить изменения: ' + error.message, 'error');

        // Разблокируем кнопку
        saveEditBtn.disabled = false;
        saveEditBtn.textContent = 'Сохранить';
    }
}

// Обработчик для подтверждения удаления заказа
async function handleDeleteConfirm() {
    // Блокируем кнопку удаления
    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.textContent = 'Удаление...';

    try {
        // Отправляем запрос на удаление
        await deleteOrder(currentOrderId);

        // Показываем уведомление об успехе
        showNotification('Заказ успешно удалён');

        // Закрываем модальное окно
        closeModal('delete-modal');

        // Обновляем список заказов
        await refreshOrders();

    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        showNotification('Не удалось удалить заказ: ' + error.message, 'error');

        // Разблокируем кнопку
        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.textContent = 'Да, удалить';
    }
}

// Функция для обновления списка заказов
async function refreshOrders() {
    allOrders = await loadOrders();
    renderOrdersTable(allOrders);
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

// Основная функция инициализации
async function initOrdersPage() {
    console.log('Инициализация страницы истории заказов...');

    // 1. Загружаем заказы
    allOrders = await loadOrders();

    // 2. Отображаем заказы в таблице
    renderOrdersTable(allOrders);

    // 3. Настраиваем обработчики событий

    // Для кнопок действий в таблице
    if (ordersTbody) {
        ordersTbody.addEventListener('click', handleTableAction);
    }

    // Для закрытия модальных окон
    document.addEventListener('click', handleModalClose);

    // Для формы редактирования
    if (editOrderForm) {
        editOrderForm.addEventListener('submit', handleEditFormSubmit);
    }

    // Для кнопки подтверждения удаления
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', handleDeleteConfirm);
    }

    // Закрытие модального окна по нажатию Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal-overlay[style*="display: flex"]');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
        }
    });

    console.log('Страница истории заказов инициализирована');
}

// Запускаем инициализацию при загрузке DOM
document.addEventListener('DOMContentLoaded', initOrdersPage);