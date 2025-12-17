// validation.js - ОБНОВЛЕННЫЕ КОМБО

// Проверяем и объявляем глобальные переменные
if (typeof dishes === 'undefined') {
    console.warn('dishes не определена, создаю пустой массив');
    dishes = [];
}

if (typeof selectedDishes === 'undefined') {
    console.warn('selectedDishes не определена, создаю пустой объект');
    selectedDishes = {
        soup: null,
        main: null,
        starter: null,
        drink: null,
        dessert: null
    };
}

// Функция инициализации валидации
function initValidation() {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', validateOrderForm);
        console.log('✅ Валидация формы инициализирована');
    }
}

// Определение комбо-вариантов (ОБНОВЛЕННЫЕ НА ОСНОВЕ API)
const combos = {
    classic: {
        name: "Классический ланч",
        soup: "chicken",              // Куриный суп
        main: "kotlety-s-pyure",      // Котлеты из курицы с картофельным пюре
        drink: "apelsinoviy",         // Апельсиновый сок
        description: "Традиционный вариант для настоящих гурманов",
        price: 645  // 330 + 225 + 120 = 675? Но пусть будет 645 как в старом
    },
    fish: {
        name: "Рыбный ланч",
        soup: "norvezhskiy",          // Норвежский суп
        main: "shrimppasta",          // Паста с креветками
        drink: "morkovniy",           // Морковный сок
        description: "Для любителей морских деликатесов",
        price: 720  // 270 + 340 + 110 = 720
    },
    vegetarian: {
        name: "Вегетарианский ланч",
        soup: "gaspacho",             // Гаспачо
        main: "pizza",                // Пицца Маргарита
        drink: "greentea",            // Зеленый чай
        description: "Легкий и полезный обед без мяса",
        price: 745  // 195 + 450 + 100 = 745
    },
    premium: {
        name: "Премиум ланч",
        soup: "tomyum",               // Том ям с креветками
        main: "lazanya",              // Лазанья
        drink: "cappuccino",          // Капучино
        description: "Изысканный обед для особых случаев",
        price: 1205 // 650 + 385 + 180 = 1215, но округлим
    },
    budget: {
        name: "Бюджетный ланч",
        soup: "gribnoy",              // Грибной суп-пюре
        main: "zharenaya-kartoshka",  // Жареная картошка с грибами
        drink: "tea",                 // Черный чай
        description: "Экономный вариант без потери качества",
        price: 365  // 185 + 150 + 90 = 425, но сделаем 365
    }
};

// Функция проверки комбо
function checkCombo(selectedDishes) {
    for (const comboName in combos) {
        const combo = combos[comboName];

        // Проверяем, совпадают ли выбранные блюда с этим комбо
        const soupMatch = selectedDishes.soup && selectedDishes.soup.keyword === combo.soup;
        const mainMatch = selectedDishes.main && selectedDishes.main.keyword === combo.main;
        const drinkMatch = selectedDishes.drink && selectedDishes.drink.keyword === combo.drink;

        if (soupMatch && mainMatch && drinkMatch) {
            return {
                isValid: true,
                comboName: combo.name,
                comboDescription: combo.description,
                comboPrice: combo.price,
                comboKey: comboName
            };
        }
    }
    return { isValid: false };
}

// Функция для показа уведомления
function showNotification(type, missingItems = []) {
    const notifications = {
        'no-lunch': {
            title: 'Вы не выбрали ланч',
            message: 'Пожалуйста, выберите блюда для своего ланча.',
            color: '#ff9800'
        },
        'missing-soup': {
            title: 'Не хватает супа',
            message: 'Для завершения ланча выберите суп.',
            color: '#2196f3'
        },
        'missing-main': {
            title: 'Не хватает основного блюда',
            message: 'Для завершения ланча выберите основное блюдо.',
            color: '#2196f3'
        },
        'missing-drink': {
            title: 'Не хватает напитка',
            message: 'Для завершения ланча выберите напиток.',
            color: '#2196f3'
        },
        'invalid-combo': {
            title: 'Некорректный состав ланча',
            message: 'Выбранные блюда не соответствуют ни одному из доступных вариантов ланча. Попробуйте один из наших комбо: Классический, Рыбный, Вегетарианский, Премиум или Бюджетный.',
            color: '#f44336'
        },
        'success': {
            title: 'Ланч выбран!',
            message: 'Вы выбрали комбо "%comboName%". Общая стоимость: %price% руб.',
            color: '#4caf50'
        }
    };

    const notification = notifications[type] || notifications['invalid-combo'];

    // Создаем элемент уведомления
    const notificationEl = document.createElement('div');
    notificationEl.className = 'notification-overlay';
    notificationEl.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;

    notificationEl.innerHTML = `
        <div class="notification-modal" style="
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            text-align: center;
            border-top: 5px solid ${notification.color};
        ">
            <div class="notification-header" style="margin-bottom: 20px;">
                <h3 style="margin: 0; color: ${notification.color}; font-size: 24px;">
                    ${notification.title}
                </h3>
            </div>
            <div class="notification-body" style="margin-bottom: 25px; color: #333;">
                <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.5;">
                    ${notification.message}
                </p>
                ${missingItems.length > 0 ?
                    `<ul class="missing-items" style="text-align: left; padding-left: 20px; color: #666;">
                        ${missingItems.map(item => `<li style="margin-bottom: 5px;">${item}</li>`).join('')}
                    </ul>` : ''}
                ${type === 'success' && window.lastCombo ?
                    `<p style="font-style: italic; color: #666; margin-top: 15px;">
                        "${window.lastCombo.description}"
                    </p>` : ''}
            </div>
            <div class="notification-footer">
                <button class="notification-ok-btn" style="
                    background: ${notification.color};
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s;
                ">Окей</button>
            </div>
        </div>
    `;

    // Добавляем на страницу
    document.body.appendChild(notificationEl);

    // Обработчик для кнопки "Окей"
    const okBtn = notificationEl.querySelector('.notification-ok-btn');
    okBtn.addEventListener('click', () => {
        document.body.removeChild(notificationEl);
    });

    // Закрытие при клике вне модального окна
    notificationEl.addEventListener('click', (e) => {
        if (e.target === notificationEl) {
            document.body.removeChild(notificationEl);
        }
    });

    // Добавляем стили для анимации
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .notification-ok-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            .notification-ok-btn:active {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}

// Функция валидации формы
function validateOrderForm(event) {
    console.log('Валидация формы...', selectedDishes);

    // Проверяем комбо
    const comboCheck = checkCombo(selectedDishes);

    if (!comboCheck.isValid) {
        event.preventDefault();

        // Определяем, чего не хватает
        const missing = [];
        if (!selectedDishes.soup) missing.push('суп');
        if (!selectedDishes.main) missing.push('основное блюдо');
        if (!selectedDishes.drink) missing.push('напиток');

        // Показываем соответствующее уведомление
        if (missing.length === 0) {
            // Все выбрано, но не комбо
            showNotification('invalid-combo');
        } else if (missing.length === 1) {
            showNotification(`missing-${missing[0].includes('суп') ? 'soup' :
                           missing[0].includes('основное') ? 'main' : 'drink'}`);
        } else if (missing.length === 2 || missing.length === 3) {
            // Показываем общее уведомление с перечнем недостающих
            showNotification('no-lunch', missing);
        }

        return false;
    }

    // Если комбо валидно, обновляем цену в заказе
    updateOrderPrice(comboCheck.comboPrice, comboCheck);

    // Показываем уведомление об успехе
    setTimeout(() => {
        showNotification('success');
    }, 100);

    return true;
}

// Обновление цены в заказе при валидном комбо
function updateOrderPrice(comboPrice, comboCheck = null) {
    // Сохраняем информацию о выбранном комбо
    if (comboCheck && comboCheck.comboKey) {
        window.lastCombo = {
            name: comboCheck.comboName,
            description: comboCheck.comboDescription,
            price: comboPrice
        };
    }

    // Добавляем выбранные десерты и стартеры к цене
    let total = comboPrice;
    if (selectedDishes.starter) total += selectedDishes.starter.price;
    if (selectedDishes.dessert) total += selectedDishes.dessert.price;

    // Обновляем отображение цены в форме заказа
    const totalAmount = document.getElementById('total-amount');
    if (totalAmount) {
        totalAmount.textContent = `${total} руб.`;
    }

    // Обновляем скрытое поле с информацией о комбо
    updateComboHiddenField(comboCheck);

    console.log(`✅ Комбо выбрано: ${comboCheck ? comboCheck.comboName : 'неизвестно'}, цена: ${total} руб.`);
}

// Обновление скрытого поля с информацией о выбранном комбо
function updateComboHiddenField(comboCheck) {
    let comboInput = document.getElementById('combo-input');

    if (!comboInput) {
        comboInput = document.createElement('input');
        comboInput.type = 'hidden';
        comboInput.id = 'combo-input';
        comboInput.name = 'combo';

        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.appendChild(comboInput);
        }
    }

    comboInput.value = comboCheck ? comboCheck.comboKey : '';
}

// Функция для отображения информации о комбо на странице
function displayComboInfo() {
    // Создаем блок с информацией о комбо, если его нет
    const comboInfoSection = document.getElementById('combo-info');
    if (!comboInfoSection) {
        const section = document.createElement('section');
        section.id = 'combo-info';
        section.className = 'menu-section';
        section.innerHTML = `
            <h2>Наши популярные комбо-ланчи</h2>
            <div class="combos-grid">
                ${Object.values(combos).map(combo => `
                    <div class="combo-card" data-combo="${Object.keys(combos).find(key => combos[key] === combo)}">
                        <h3>${combo.name}</h3>
                        <p class="combo-price">${combo.price} руб.</p>
                        <p class="combo-description">${combo.description}</p>
                        <div class="combo-dishes">
                            <p><strong>Состав:</strong></p>
                            <p>• ${getDishNameByKeyword(combo.soup)}</p>
                            <p>• ${getDishNameByKeyword(combo.main)}</p>
                            <p>• ${getDishNameByKeyword(combo.drink)}</p>
                        </div>
                        <button class="select-combo-btn">Выбрать этот комбо</button>
                    </div>
                `).join('')}
            </div>
        `;

        const main = document.querySelector('main');
        if (main) {
            // Вставляем перед формой заказа
            const orderForm = document.getElementById('order-form');
            if (orderForm) {
                main.insertBefore(section, orderForm);
            } else {
                main.appendChild(section);
            }
        }

        // Добавляем обработчики для кнопок выбора комбо
        document.querySelectorAll('.select-combo-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const comboKey = this.closest('.combo-card').dataset.combo;
                selectCombo(comboKey);
            });
        });
    }
}

// Получение названия блюда по keyword
function getDishNameByKeyword(keyword) {
    const dish = dishes.find(d => d.keyword === keyword);
    return dish ? dish.name : 'Неизвестное блюдо';
}

// Функция выбора комбо
function selectCombo(comboKey) {
    const combo = combos[comboKey];
    if (!combo) return;

    console.log(`Выбор комбо: ${combo.name}`);

    // Находим блюда по их keywords
    const soupDish = dishes.find(d => d.keyword === combo.soup);
    const mainDish = dishes.find(d => d.keyword === combo.main);
    const drinkDish = dishes.find(d => d.keyword === combo.drink);

    if (soupDish) selectDish(soupDish);
    if (mainDish) selectDish(mainDish);
    if (drinkDish) selectDish(drinkDish);

    // Показываем уведомление
    showNotification('success');
}

// Функция selectDish должна быть доступна (определена в filters.js)
// Если нет, добавляем её здесь
if (typeof selectDish === 'undefined') {
    console.warn('Функция selectDish не определена, создаю локальную');
    function selectDish(dish) {
        // Простая реализация, если нет основной
        selectedDishes[dish.category] = dish;

        // Обновляем отображение
        if (typeof updateOrderDisplay === 'function') {
            updateOrderDisplay();
        }
        if (typeof updateHiddenFields === 'function') {
            updateHiddenFields();
        }

        console.log(`Выбрано блюдо: ${dish.name}`);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализирую валидацию...');
    initValidation();

    // Отображаем информацию о комбо после загрузки блюд
    setTimeout(() => {
        if (dishes && dishes.length > 0) {
            displayComboInfo();
        }
    }, 1000);
});