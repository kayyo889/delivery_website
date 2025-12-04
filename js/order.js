// Объект для хранения выбранных блюд
let selectedDishes = {
    soup: null,
    main: null,
    drink: null
};

// DOM элементы
let orderForm;

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    orderForm = document.getElementById('order-form');
    
    // Сортировка блюд по алфавиту внутри категорий
    sortDishesByCategory();
    
    // Динамическое создание карточек блюд
    createDishCards();
    
    // Инициализация раздела заказа
    initOrderSection();
    
    // Обработчик отправки формы
    if (orderForm) {
        orderForm.addEventListener('submit', handleFormSubmit);
    }
});

// Сортировка блюд по алфавиту
function sortDishesByCategory() {
    // Сортируем весь массив по имени
    dishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
}

// Создание карточек блюд
function createDishCards() {
    // Группируем блюда по категориям
    const categories = {
        soup: dishes.filter(dish => dish.category === 'soup'),
        main: dishes.filter(dish => dish.category === 'main'),
        drink: dishes.filter(dish => dish.category === 'drink')
    };
    
    // Создаем карточки для каждой категории
    Object.keys(categories).forEach(category => {
        const section = document.querySelector(`#${category}-section .dishes-grid`);
        if (!section) return;
        
        // Очищаем секцию
        section.innerHTML = '';
        
        // Создаем карточки для каждого блюда
        categories[category].forEach(dish => {
            const dishCard = createDishCardElement(dish);
            section.appendChild(dishCard);
        });
    });
}

// Создание HTML элемента карточки блюда
function createDishCardElement(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);
    
    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <p class="dish-price">${dish.price} руб.</p>
        <p class="dish-name">${dish.name}</p>
        <p class="dish-count">${dish.count}</p>
        <button class="add-btn" type="button">Добавить</button>
    `;
    
    // Добавляем обработчик клика на кнопку
    const addButton = card.querySelector('.add-btn');
    addButton.addEventListener('click', function() {
        selectDish(dish);
    });
    
    return card;
}

// Выбор блюда
function selectDish(dish) {
    // Снимаем выделение со всех карточек
    document.querySelectorAll('.dish-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Выделяем выбранную карточку
    const selectedCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Сохраняем выбранное блюдо
    selectedDishes[dish.category] = dish;
    
    // Обновляем раздел заказа
    updateOrderSection();
    
    // Обновляем скрытые поля формы
    updateHiddenFields();
}

// Инициализация раздела заказа
function initOrderSection() {
    // Создаем структуру если её нет
    const orderSection = document.getElementById('order-summary');
    if (!orderSection) {
        const orderHTML = `
            <div class="order-section">
                <h2>Ваш заказ</h2>
                <div id="order-items">
                    <div class="order-category">
                        <h3>Суп</h3>
                        <p class="empty-message" id="soup-message">Блюдо не выбрано</p>
                        <div class="selected-item" id="soup-item" style="display: none;">
                            <span class="item-name"></span>
                            <span class="item-price"></span>
                        </div>
                    </div>
                    <div class="order-category">
                        <h3>Основное блюдо</h3>
                        <p class="empty-message" id="main-message">Блюдо не выбрано</p>
                        <div class="selected-item" id="main-item" style="display: none;">
                            <span class="item-name"></span>
                            <span class="item-price"></span>
                        </div>
                    </div>
                    <div class="order-category">
                        <h3>Напиток</h3>
                        <p class="empty-message" id="drink-message">Напиток не выбран</p>
                        <div class="selected-item" id="drink-item" style="display: none;">
                            <span class="item-name"></span>
                            <span class="item-price"></span>
                        </div>
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
        
        // Вставляем перед формой
        const form = document.getElementById('order-form');
        if (form) {
            form.insertAdjacentHTML('beforebegin', orderHTML);
        }
    }
    
    // Первоначальное обновление
    updateOrderSection();
}

// Обновление раздела заказа
function updateOrderSection() {
    const categories = ['soup', 'main', 'drink'];
    let hasSelectedItems = false;
    let totalAmount = 0;
    
    categories.forEach(category => {
        const dish = selectedDishes[category];
        const messageElem = document.getElementById(`${category}-message`);
        const itemElem = document.getElementById(`${category}-item`);
        
        if (dish) {
            // Показываем выбранное блюдо
            if (messageElem) messageElem.style.display = 'none';
            if (itemElem) {
                itemElem.style.display = 'flex';
                itemElem.querySelector('.item-name').textContent = dish.name;
                itemElem.querySelector('.item-price').textContent = `${dish.price} руб.`;
            }
            hasSelectedItems = true;
            totalAmount += dish.price;
        } else {
            // Показываем сообщение "не выбрано"
            if (messageElem) messageElem.style.display = 'block';
            if (itemElem) itemElem.style.display = 'none';
        }
    });
    
    // Обновляем общую стоимость
    const orderTotal = document.getElementById('order-total');
    const totalAmountElem = document.getElementById('total-amount');
    
    if (hasSelectedItems) {
        if (orderTotal) orderTotal.style.display = 'block';
        if (totalAmountElem) totalAmountElem.textContent = `${totalAmount} руб.`;
    } else {
        if (orderTotal) orderTotal.style.display = 'none';
    }
}

// Обновление скрытых полей формы
function updateHiddenFields() {
    const categories = ['soup', 'main', 'drink'];
    
    categories.forEach(category => {
        const input = document.getElementById(`${category}-input`);
        if (input) {
            const dish = selectedDishes[category];
            input.value = dish ? dish.keyword : '';
        }
    });
}

// Обработчик отправки формы
function handleFormSubmit(event) {
    // Проверяем, выбраны ли все блюда
    const allSelected = selectedDishes.soup && selectedDishes.main && selectedDishes.drink;
    
    if (!allSelected) {
        event.preventDefault();
        alert('Пожалуйста, выберите блюда из всех категорий перед оформлением заказа.');
        return false;
    }
    
    // Можно добавить дополнительные проверки здесь
    return true;
}