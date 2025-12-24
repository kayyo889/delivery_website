window.selectDish = selectDish;
let dishes = [];
let selectedDishes = {
    soup: null,
    main: null,
    starter: null,
    drink: null,
    dessert: null
};
// ========== РАБОТА С LOCALSTORAGE ==========

// Функция сохранения выбранных блюд в localStorage
function saveOrderToLocalStorage() {
    const orderToSave = {};

    Object.keys(selectedDishes).forEach(category => {
        if (selectedDishes[category]) {
            // Сохраняем только keyword и category для экономии места
            orderToSave[category] = {
                keyword: selectedDishes[category].keyword,
                category: selectedDishes[category].category
            };
        }
    });

    localStorage.setItem('lunchOrder', JSON.stringify(orderToSave));
    console.log('✅ Заказ сохранен в localStorage:', orderToSave);
}

// Функция загрузки заказа из localStorage
function loadOrderFromLocalStorage() {
    const savedOrder = localStorage.getItem('lunchOrder');

    if (!savedOrder) {
        console.log('В localStorage нет сохраненного заказа');
        return null;
    }

    try {
        const parsedOrder = JSON.parse(savedOrder);
        console.log('📥 Загружен заказ из localStorage:', parsedOrder);
        return parsedOrder;
    } catch (error) {
        console.error('❌ Ошибка при чтении заказа из localStorage:', error);
        return null;
    }
}

// Функция восстановления выбранных блюд из localStorage
async function restoreOrderFromLocalStorage() {
    const savedOrder = loadOrderFromLocalStorage();

    if (!savedOrder || !dishes || dishes.length === 0) {
        return false;
    }

    let restoredCount = 0;

    Object.keys(savedOrder).forEach(category => {
        const dishData = savedOrder[category];

        if (dishData && dishData.keyword) {
            // Ищем блюдо по keyword
            const dish = dishes.find(d => d.keyword === dishData.keyword);

            if (dish) {
                selectedDishes[category] = dish;
                restoredCount++;
                console.log(`✅ Восстановлено блюдо: ${dish.name} (${category})`);
            } else {
                console.warn(`⚠️ Блюдо с keyword="${dishData.keyword}" не найдено в загруженных данных`);
            }
        }
    });

    if (restoredCount > 0) {
        updateOrderDisplay();
        updateDishCards();
        updateOrderPanel(); // Эта функция будет добавлена позже
        console.log(`✅ Восстановлено ${restoredCount} блюд из localStorage`);
        return true;
    }

    return false;
}

// Функция удаления блюда из заказа
function removeDishFromOrder(category) {
    if (selectedDishes[category]) {
        console.log(`🗑️ Удалено блюдо: ${selectedDishes[category].name} (${category})`);
        selectedDishes[category] = null;

        // Сохраняем изменения в localStorage
        saveOrderToLocalStorage();

        // Обновляем отображение
        updateOrderDisplay();
        updateDishCards();
        updateOrderPanel();

        return true;
    }
    return false;
}

// Функция очистки заказа
function clearOrder() {
    Object.keys(selectedDishes).forEach(category => {
        selectedDishes[category] = null;
    });

    localStorage.removeItem('lunchOrder');
    updateOrderDisplay();
    updateDishCards();
    updateOrderPanel();
    console.log('🗑️ Заказ полностью очищен');
}
function showLoadingMessage(text) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-message';
    loadingDiv.innerHTML = `<div style="text-align:center; padding:20px; font-size:18px;">${text}</div>`;
    document.body.appendChild(loadingDiv);
}

function hideLoadingMessage() {
    const loadingDiv = document.getElementById('loading-message');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background: #ffebee;
        color: #c62828;
        padding: 20px;
        margin: 20px;
        border-radius: 5px;
        border-left: 4px solid #c62828;
        text-align: center;
    `;
    errorDiv.innerHTML = `<p>❌ ${message}</p>`;

    const main = document.querySelector('main');
    if (main) {
        main.prepend(errorDiv);
    }
}

// ========== ОСНОВНЫЕ ФУНКЦИИ ==========

// Функция для создания карточек блюд
function createDishCards() {
    console.log('Создание карточек блюд...', dishes.length);

    // Проверяем, есть ли блюда
    if (!dishes || dishes.length === 0) {
        console.error('Нет данных о блюдах!');
        showErrorMessage('Нет данных о блюдах для отображения.');
        return;
    }

    // Сортируем блюда по алфавиту
    dishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    // Группируем по категориям
    const categories = {
        soup: dishes.filter(dish => dish.category === 'soup'),
        main: dishes.filter(dish => dish.category === 'main'),
        drink: dishes.filter(dish => dish.category === 'drink'),
        starter: dishes.filter(dish => dish.category === 'starter'),
        dessert: dishes.filter(dish => dish.category === 'dessert')
    };
    // Создаем карточки для каждой категории
    Object.keys(categories).forEach(category => {
        let container;

        if (category === 'starter' || category === 'dessert') {
            // Для новых категорий (стартеры, десерты)
            container = document.getElementById(`${category}-dishes`);
        } else {
            // Для основных категорий (супы, основные, напитки)
            container = document.querySelector(`#${category}-section .dishes-grid`);
        }

        console.log(`Категория: ${category}, Контейнер:`, container);

        if (!container) {
            console.warn(`Не найден контейнер для категории: ${category}`);
            return;
        }

        // Очищаем контейнер
        container.innerHTML = '';

        // Если нет блюд в этой категории
        if (categories[category].length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#666;">Нет блюд в этой категории</p>`;
            return;
        }

        // Создаем карточки
        categories[category].forEach(dish => {
            const card = document.createElement('div');
            card.className = 'dish-card';
            card.setAttribute('data-dish', dish.keyword);
            card.setAttribute('data-kind', dish.kind);
            card.setAttribute('data-category', dish.category);
            card.setAttribute('data-id', dish.id || dish.keyword);
            card.innerHTML = `
                <img src="${dish.image}" alt="${dish.name}" onerror="this.src='img/placeholder.jpg'">
                <p class="dish-price">${dish.price} руб.</p>
                <p class="dish-name">${dish.name}</p>
                <p class="dish-count">${dish.count}</p>
                <button class="add-btn" type="button">Добавить</button>
            `;

            // Обработчик для кнопки "Добавить"
            card.querySelector('.add-btn').addEventListener('click', function(e) {
                e.stopPropagation();
                selectDish(dish);
            });

            container.appendChild(card);
        });
    });

    console.log('Карточки блюд созданы');
}
function updateDishCards() {
    const dishCards = document.querySelectorAll('.dish-card');

    dishCards.forEach(card => {
        const dishKeyword = card.getAttribute('data-dish');
        const category = card.getAttribute('data-category');

        // Проверяем, выбрано ли это блюдо
        if (selectedDishes[category] &&
            selectedDishes[category].keyword === dishKeyword) {
            card.classList.add('selected');
            const btn = card.querySelector('.add-btn');
            if (btn) {
                btn.textContent = '✓ Добавлено';
            }
        } else {
            card.classList.remove('selected');
            const btn = card.querySelector('.add-btn');
            if (btn) {
                btn.textContent = 'Добавить';
            }
        }
    });
}
function updateOrderPanel() {
    const orderPanel = document.getElementById('order-panel');
    const orderTotal = document.getElementById('order-panel-total');
    const checkoutLink = document.getElementById('checkout-link');

    if (!orderPanel || !orderTotal || !checkoutLink) {
        return;
    }

    // Считаем общую стоимость
    let total = 0;
    let hasSelectedItems = false;

    Object.values(selectedDishes).forEach(dish => {
        if (dish) {
            total += dish.price;
            hasSelectedItems = true;
        }
    });

    // Показываем/скрываем панель
    if (hasSelectedItems) {
        orderPanel.style.display = 'block';
        orderTotal.textContent = `${total} руб.`;

        // Проверяем, соответствует ли заказ комбо
        const comboCheck = checkCombo(selectedDishes);

        if (comboCheck.isValid) {
            // Активируем ссылку
            checkoutLink.href = 'order.html';
            checkoutLink.style.opacity = '1';
            checkoutLink.style.cursor = 'pointer';
            checkoutLink.style.pointerEvents = 'auto';
            checkoutLink.style.background = 'tomato';
            checkoutLink.style.color = 'white';
        } else {
            // Делаем ссылку неактивной
            checkoutLink.href = '#';
            checkoutLink.style.opacity = '0.6';
            checkoutLink.style.cursor = 'not-allowed';
            checkoutLink.style.pointerEvents = 'none';
            checkoutLink.style.background = '#ccc';
            checkoutLink.style.color = '#666';
        }
    } else {
        orderPanel.style.display = 'none';
    }
}
// Функция выбора блюда
function selectDish(dish) {
    console.log('Выбрано блюдо:', dish.name);

    // Сохраняем выбор
    selectedDishes[dish.category] = dish;

    // Сохраняем в localStorage
    saveOrderToLocalStorage();

    // Обновляем отображение
    updateOrderDisplay();
    updateHiddenFields();
    updateDishCards();
    updateOrderPanel(); // Обновляем панель перехода

    // Обновляем комбо
    if (window.displayComboInfo) {
        setTimeout(() => window.displayComboInfo(), 100);
    }
    if (window.highlightSelectedCombo) {
        setTimeout(() => window.highlightSelectedCombo(), 100);
    }
}

// Функция инициализации фильтров
function initFilters() {
    console.log('Инициализация фильтров...');

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            const kind = this.dataset.kind;

            // Управление активным состоянием кнопок
            const allCategoryBtns = document.querySelectorAll(`.filter-btn[data-category="${category}"]`);
            allCategoryBtns.forEach(b => b.classList.remove('active'));

            if (this.classList.contains('active')) {
                // Если кликнули на активную кнопку - снимаем фильтр
                this.classList.remove('active');
                filterDishes(category, 'all');
            } else {
                // Если кликнули на неактивную - применяем фильтр
                this.classList.add('active');
                filterDishes(category, kind);
            }
        });
    });
}

// Функция фильтрации
function filterDishes(category, kind) {
    console.log(`Фильтр: категория=${category}, тип=${kind}`);

    let container;
    if (category === 'starter' || category === 'dessert') {
        container = document.getElementById(`${category}-dishes`);
    } else {
        container = document.querySelector(`#${category}-section .dishes-grid`);
    }

    if (!container) return;

    container.querySelectorAll('.dish-card').forEach(card => {
        const dishKeyword = card.dataset.dish;
        const dish = dishes.find(d => d.keyword === dishKeyword);

        if (kind === 'all' || !dish) {
            card.style.display = 'flex';
        } else if (dish && dish.kind === kind) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Инициализация раздела заказа
function initOrderSection() {
    console.log('Инициализация раздела заказа...');

    const orderSummary = document.getElementById('order-summary');
    if (!orderSummary) {
        console.error('Не найден элемент #order-summary');
        return;
    }

    // Создаем панель заказа
    const orderHTML = `
        <div id="order-panel" class="order-panel" style="display: none;">
            <div class="container">
                <div class="order-panel-content">
                    <div class="order-summary">
                        <span class="order-label">Стоимость заказа:</span>
                        <span id="order-panel-total" class="order-total">0 руб.</span>
                    </div>
                    <a id="checkout-link" href="#" class="checkout-btn">
                        Перейти к оформлению
                    </a>
                </div>
            </div>
        </div>
    `;

    orderSummary.innerHTML = orderHTML;
    updateOrderPanel(); // Инициализируем панель
}

// Обновление отображения заказа
function updateOrderDisplay() {
    const categories = ['soup', 'main', 'starter', 'drink', 'dessert'];
    let hasSelectedItems = false;
    let totalAmount = 0;

    categories.forEach(category => {
        const categoryElem = document.getElementById(`${category}-category`);
        if (!categoryElem) return;

        const dish = selectedDishes[category];

        if (dish) {
            hasSelectedItems = true;
            categoryElem.style.display = 'block';

            const itemName = categoryElem.querySelector('.item-name');
            const itemPrice = categoryElem.querySelector('.item-price');
            const emptyMessage = categoryElem.querySelector('.empty-message');

            if (itemName) itemName.textContent = dish.name;
            if (itemPrice) itemPrice.textContent = `${dish.price} руб.`;
            if (emptyMessage) emptyMessage.style.display = 'none';

            const selectedItem = categoryElem.querySelector('.selected-item');
            if (selectedItem) selectedItem.style.display = 'flex';

            totalAmount += dish.price;
        } else if (hasSelectedItems) {
            categoryElem.style.display = 'block';
            const emptyMessage = categoryElem.querySelector('.empty-message');
            if (emptyMessage) emptyMessage.style.display = 'block';

            const selectedItem = categoryElem.querySelector('.selected-item');
            if (selectedItem) selectedItem.style.display = 'none';
        } else {
            categoryElem.style.display = 'none';
        }
    });

    // Показываем/скрываем "Ничего не выбрано"
    const nothingSelected = document.getElementById('nothing-selected');
    if (nothingSelected) {
        nothingSelected.style.display = hasSelectedItems ? 'none' : 'block';
    }

    // Обновляем общую стоимость
    const orderTotal = document.getElementById('order-total');
    const totalAmountElem = document.getElementById('total-amount');

    if (hasSelectedItems && orderTotal && totalAmountElem) {
        orderTotal.style.display = 'block';
        totalAmountElem.textContent = `${totalAmount} руб.`;
    } else if (orderTotal) {
        orderTotal.style.display = 'none';
    }
}

// Обновление скрытых полей формы
function updateHiddenFields() {
    const categories = ['soup', 'main', 'starter', 'drink', 'dessert'];

    categories.forEach(category => {
        const inputId = `${category}-input`;
        let input = document.getElementById(inputId);

        if (!input) {
            input = document.createElement('input');
            input.type = 'hidden';
            input.id = inputId;
            input.name = category;

            const orderForm = document.getElementById('order-form');
            if (orderForm) {
                orderForm.appendChild(input);
            }
        }

        const dish = selectedDishes[category];
        input.value = dish ? dish.keyword : '';
    });
}
// ========== ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM загружен, начинаю инициализацию...');

    try {
        showLoadingMessage('🔄 Загрузка меню...');
        dishes = await loadDishes();

        if (!dishes || dishes.length === 0) {
            throw new Error('Не удалось загрузить данные о блюдах');
        }

        console.log(`✅ Загружено ${dishes.length} блюд через API`);
        hideLoadingMessage();

        // Инициализируем все компоненты
        createDishCards();
        initFilters();
        initOrderSection();

        // Восстанавливаем заказ из localStorage
        await restoreOrderFromLocalStorage();

        console.log('✅ Приложение полностью инициализировано');

    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
        hideLoadingMessage();
        showErrorMessage('Не удалось загрузить меню. Пожалуйста, проверьте подключение к интернету и обновите страницу.');
    }
});
