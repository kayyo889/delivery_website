// filters.js - ОЧИЩЕННАЯ ВЕРСИЯ

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let dishes = []; // Будет заполнен через API
let selectedDishes = {
    soup: null,
    main: null,
    starter: null,
    drink: null,
    dessert: null
};

// ========== ФУНКЦИИ ДЛЯ СООБЩЕНИЙ ==========
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

// Функция выбора блюда
function selectDish(dish) {
    console.log('Выбрано блюдо:', dish.name);

    // Снимаем выделение со всех карточек
    document.querySelectorAll('.dish-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Выделяем выбранную карточку
    const selectedCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedCard.querySelector('.add-btn').textContent = '✓ Добавлено';
    }

    // Сохраняем выбор
    selectedDishes[dish.category] = dish;

    // Обновляем отображение заказа
    updateOrderDisplay();
    updateHiddenFields();
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

    const orderHTML = `
        <div class="order-section">
            <h2>Ваш заказ</h2>
            <div id="order-items">
                <div class="order-category" id="soup-category" style="display: none;">
                    <h3>🥣 Суп</h3>
                    <p class="empty-message">Блюдо не выбрано</p>
                    <div class="selected-item">
                        <span class="item-name"></span>
                        <span class="item-price"></span>
                    </div>
                </div>
                <div class="order-category" id="main-category" style="display: none;">
                    <h3>🍖 Основное блюдо</h3>
                    <p class="empty-message">Блюдо не выбрано</p>
                    <div class="selected-item">
                        <span class="item-name"></span>
                        <span class="item-price"></span>
                    </div>
                </div>
                <div class="order-category" id="starter-category" style="display: none;">
                    <h3>🥗 Салат или стартер</h3>
                    <p class="empty-message">Блюдо не выбрано</p>
                    <div class="selected-item">
                        <span class="item-name"></span>
                        <span class="item-price"></span>
                    </div>
                </div>
                <div class="order-category" id="drink-category" style="display: none;">
                    <h3>🥤 Напиток</h3>
                    <p class="empty-message">Напиток не выбран</p>
                    <div class="selected-item">
                        <span class="item-name"></span>
                        <span class="item-price"></span>
                    </div>
                </div>
                <div class="order-category" id="dessert-category" style="display: none;">
                    <h3>🍰 Десерт</h3>
                    <p class="empty-message">Десерт не выбран</p>
                    <div class="selected-item">
                        <span class="item-name"></span>
                        <span class="item-price"></span>
                    </div>
                </div>
                <div id="nothing-selected" style="text-align: center; padding: 20px; color: #888; font-style: italic;">
                    Ничего не выбрано
                </div>
            </div>
            <div id="order-total" style="display: none;">
                <div class="total-line"></div>
                <div class="total-price">
                    <span>Стоимость заказа:</span>
                    <span id="total-amount">0 руб.</span>
                </div>
            </div>
        </div>
    `;

    orderSummary.innerHTML = orderHTML;
    updateOrderDisplay();
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
        // Показываем сообщение о загрузке
        showLoadingMessage('🔄 Загрузка меню...');

        // Загружаем блюда через API
        dishes = await loadDishes();

        if (!dishes || dishes.length === 0) {
            throw new Error('Не удалось загрузить данные о блюдах');
        }

        console.log(`✅ Загружено ${dishes.length} блюд через API`);

        // Скрываем сообщение о загрузке
        hideLoadingMessage();

        // Инициализируем все компоненты
        createDishCards();
        initFilters();
        initOrderSection();

        // Добавляем обработчик отправки формы
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', function(e) {
                const requiredCategories = ['soup', 'main', 'drink'];
                const allRequiredSelected = requiredCategories.every(cat => selectedDishes[cat]);

                if (!allRequiredSelected) {
                    e.preventDefault();
                    alert('Пожалуйста, выберите обязательные блюда: суп, основное блюдо и напиток.');
                    return false;
                }

                return true;
            });
        }

        console.log('✅ Приложение полностью инициализировано');

    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
        hideLoadingMessage();
        showErrorMessage('Не удалось загрузить меню. Пожалуйста, проверьте подключение к интернету и обновите страницу.');
    }
});