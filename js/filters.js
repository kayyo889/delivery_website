// Функция для создания фильтров
function initFilters() {
    // Обработчики для всех кнопок фильтров
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

// Функция фильтрации блюд
function filterDishes(category, kind) {
    // Находим контейнер для данной категории
    const containerId = category === 'starter' ? 'starter-dishes' : 
                       category === 'dessert' ? 'dessert-dishes' :
                       category + '-section';
    
    const container = category === 'starter' || category === 'dessert' 
        ? document.getElementById(containerId)
        : document.querySelector(`#${containerId} .dishes-grid`);
    
    if (!container) return;
    
    // Показываем/скрываем карточки в зависимости от фильтра
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

// Обновленная функция создания карточек блюд
function createDishCards() {
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
            container = document.getElementById(`${category}-dishes`);
        } else {
            container = document.querySelector(`#${category}-section .dishes-grid`);
        }
        
        if (!container) return;
        
        container.innerHTML = '';
        
        categories[category].forEach(dish => {
            const card = document.createElement('div');
            card.className = 'dish-card';
            card.setAttribute('data-dish', dish.keyword);
            card.setAttribute('data-kind', dish.kind);
            
            card.innerHTML = `
                <img src="${dish.image}" alt="${dish.name}" onerror="this.src='images/placeholder.jpg'">
                <p class="dish-price">${dish.price} руб.</p>
                <p class="dish-name">${dish.name}</p>
                <p class="dish-count">${dish.count}</p>
                <button class="add-btn" type="button">Добавить</button>
            `;
            
            // Обработчик клика для добавления в заказ
            card.querySelector('.add-btn').addEventListener('click', function(e) {
                e.stopPropagation();
                selectDish(dish);
            });
            
            container.appendChild(card);
        });
    });
}

// Обновленная функция инициализации раздела заказа
function initOrderSection() {
    const orderHTML = `
        <div class="order-section">
            <h2>Ваш заказ</h2>
            <div id="order-items">
                <div class="order-category" id="soup-category" style="display: none;">
                    <h3>Суп</h3>
                    <p class="empty-message">Блюдо не выбрано</p>
                    <div class="selected-item">
                        <span class="item-name"></span>
                        <span class="item-price"></span>
                    </div>
                </div>
                <div class="order-category" id="main-category" style="display: none;">
                    <h3>Основное блюдо</h3>
                    <p class="empty-message">Блюдо не выбрано</p>
                    <div class="selected-item">
                        <span class="item-name"></span>
                        <span class="item-price"></span>
                    </div>
                </div>
                <div class="order-category" id="starter-category" style="display: none;">
                    <h3>Салат или стартер</h3>
                    <p class="empty-message">Блюдо не выбрано</p>
                    <div class="selected-item">
                        <span class="item-name"></span>
                        <span class="item-price"></span>
                    </div>
                </div>
                <div class="order-category" id="drink-category" style="display: none;">
                    <h3>Напиток</h3>
                    <p class="empty-message">Напиток не выбран</p>
                    <div class="selected-item">
                        <span class="item-name"></span>
                        <span class="item-price"></span>
                    </div>
                </div>
                <div class="order-category" id="dessert-category" style="display: none;">
                    <h3>Десерт</h3>
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
    
    const orderSummary = document.getElementById('order-summary');
    orderSummary.innerHTML = orderHTML;
    
    updateOrderDisplay();
}

// Обновленный объект для хранения выбранных блюд
let selectedDishes = {
    soup: null,
    main: null,
    starter: null,
    drink: null,
    dessert: null
};

// Обновленная функция обновления скрытых полей формы
function updateHiddenFields() {
    const categories = ['soup', 'main', 'starter', 'drink', 'dessert'];
    
    categories.forEach(category => {
        const inputId = `${category}-input`;
        let input = document.getElementById(inputId);
        
        // Если поля нет - создаем его
        if (!input) {
            input = document.createElement('input');
            input.type = 'hidden';
            input.id = inputId;
            input.name = category;
            document.getElementById('order-form').appendChild(input);
        }
        
        const dish = selectedDishes[category];
        input.value = dish ? dish.keyword : '';
    });
}

// Обновленная функция выбора блюда
function selectDish(dish) {
    // Снимаем выделение со всех карточек в этой категории
    document.querySelectorAll(`.dish-card[data-kind="${dish.kind}"]`).forEach(card => {
        if (card.dataset.dish !== dish.keyword) {
            card.classList.remove('selected');
        }
    });
    
    // Выделяем выбранную карточку
    const selectedCard = document.querySelector(`[data-dish="${dish.keyword}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Сохраняем выбор
    selectedDishes[dish.category] = dish;
    
    // Обновляем отображение
    updateOrderDisplay();
    updateHiddenFields();
}

// Обновленная функция обновления отображения заказа
function updateOrderDisplay() {
    const categories = ['soup', 'main', 'starter', 'drink', 'dessert'];
    let hasSelectedItems = false;
    let totalAmount = 0;
    
    categories.forEach(category => {
        const categoryElem = document.getElementById(`${category}-category`);
        const dish = selectedDishes[category];
        
        if (dish) {
            hasSelectedItems = true;
            categoryElem.style.display = 'block';
            
            // Обновляем информацию о блюде
            const itemName = categoryElem.querySelector('.item-name');
            const itemPrice = categoryElem.querySelector('.item-price');
            const emptyMessage = categoryElem.querySelector('.empty-message');
            
            if (itemName) itemName.textContent = dish.name;
            if (itemPrice) itemPrice.textContent = `${dish.price} руб.`;
            if (emptyMessage) emptyMessage.style.display = 'none';
            categoryElem.querySelector('.selected-item').style.display = 'flex';
            
            totalAmount += dish.price;
        } else if (hasSelectedItems) {
            categoryElem.style.display = 'block';
            categoryElem.querySelector('.empty-message').style.display = 'block';
            categoryElem.querySelector('.selected-item').style.display = 'none';
        } else {
            categoryElem.style.display = 'none';
        }
    });
    
    // Показываем/скрываем "Ничего не выбрано"
    document.getElementById('nothing-selected').style.display = 
        hasSelectedItems ? 'none' : 'block';
    
    // Обновляем общую стоимость
    const orderTotal = document.getElementById('order-total');
    const totalAmountElem = document.getElementById('total-amount');
    
    if (hasSelectedItems) {
        orderTotal.style.display = 'block';
        totalAmountElem.textContent = `${totalAmount} руб.`;
    } else {
        orderTotal.style.display = 'none';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Создаем карточки блюд
    createDishCards();
    
    // Инициализируем фильтры
    initFilters();
    
    // Инициализируем раздел заказа
    initOrderSection();
    
    // Обработчик отправки формы
    document.getElementById('order-form').addEventListener('submit', function(e) {
        const requiredCategories = ['soup', 'main', 'drink'];
        const allRequiredSelected = requiredCategories.every(cat => selectedDishes[cat]);
        
        if (!allRequiredSelected) {
            e.preventDefault();
            alert('Пожалуйста, выберите обязательные блюда: суп, основное блюдо и напиток.');
            return false;
        }
        
        return true;
    });
});