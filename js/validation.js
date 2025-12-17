// validation.js - ОБНОВЛЕННЫЕ КОМБО (ИСПРАВЛЕННАЯ ВЕРСИЯ)

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
        price: 645
    },
    fish: {
        name: "Рыбный ланч",
        soup: "norvezhskiy",          // Норвежский суп
        main: "shrimppasta",          // Паста с креветками
        drink: "morkovniy",           // Морковный сок
        description: "Для любителей морских деликатесов",
        price: 720
    },
    vegetarian: {
        name: "Вегетарианский ланч",
        soup: "gaspacho",             // Гаспачо
        main: "pizza",                // Пицца Маргарита
        drink: "greentea",            // Зеленый чай
        description: "Легкий и полезный обед без мяса",
        price: 745
    },
    premium: {
        name: "Премиум ланч",
        soup: "tomyum",               // Том ям с креветками
        main: "lazanya",              // Лазанья
        drink: "cappuccino",          // Капучино
        description: "Изысканный обед для особых случаев",
        price: 1205
    },
    budget: {
        name: "Бюджетный ланч",
        soup: "gribnoy",              // Грибной суп-пюре
        main: "zharenaya-kartoshka",  // Жареная картошка с грибами
        drink: "tea",                 // Черный чай
        description: "Экономный вариант без потери качества",
        price: 365
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
            getMessage: () => {
                if (window.lastCombo) {
                    return `Вы выбрали комбо "${window.lastCombo.name}". Общая стоимость: ${window.lastCombo.total || window.lastCombo.price} руб.`;
                }
                return 'Комбо успешно выбрано!';
            },
            color: '#4caf50'
        }
    };

    const notification = notifications[type] || notifications['invalid-combo'];
    const messageText = notification.getMessage ? notification.getMessage() : notification.message;
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
                    ${messageText}
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

    function displayComboInfo() {
    // Проверяем, загружены ли блюда
    if (!dishes || dishes.length === 0) {
        console.warn('Блюда еще не загружены, откладываю отображение комбо');
        setTimeout(displayComboInfo, 500);
        return;
    }

    const comboContainer = document.getElementById('comboContainer');
    if (!comboContainer) {
        console.error('Не найден элемент с id="comboContainer"');
        return;
    }

    const comboInfo = document.getElementById('comboInfo');
    if (!comboInfo) {
        console.error('Не найден элемент с id="comboInfo"');
        return;
    }

    comboContainer.innerHTML = '';

    comboInfo.style.display = 'block';

    Object.entries(combos).forEach(([comboKey, combo]) => {
        const comboCard = document.createElement('div');
        comboCard.className = 'combo-card';
        comboCard.dataset.combo = comboKey;

        comboCard.innerHTML = `
            <div class="combo-header">
                <h4>${combo.name}</h4>
                <span class="combo-price-badge">${combo.price} руб.</span>
            </div>
            <p class="combo-desc">${combo.description}</p>
            <div class="combo-dishes-list">
                <div class="combo-dish-item">
                    <span>🍲</span>
                    <span>${getDishNameByKeyword(combo.soup)}</span>
                </div>
                <div class="combo-dish-item">
                    <span>🍖</span>
                    <span>${getDishNameByKeyword(combo.main)}</span>
                </div>
                <div class="combo-dish-item">
                    <span>🥤</span>
                    <span>${getDishNameByKeyword(combo.drink)}</span>
                </div>
            </div>
            <button class="combo-select-btn">Выбрать этот набор</button>
        `;

        // Добавляем обработчик для кнопки выбора комбо
        const selectBtn = comboCard.querySelector('.combo-select-btn');
        selectBtn.addEventListener('click', () => {
            selectCombo(comboKey);
        });

        comboContainer.appendChild(comboCard);
    });
}

// Получение названия блюда по keyword
function getDishNameByKeyword(keyword) {
    const dish = dishes.find(d => d.keyword === keyword);
    return dish ? dish.name : 'Неизвестное блюдо';
}

function selectCombo(comboKey) {
    const combo = combos[comboKey];
    if (!combo) return;

    console.log(`Выбор комбо: ${combo.name}`);

    // Находим блюда по их keywords
    const soupDish = dishes.find(d => d.keyword === combo.soup);
    const mainDish = dishes.find(d => d.keyword === combo.main);
    const drinkDish = dishes.find(d => d.keyword === combo.drink);

    // Используем глобальную функцию selectDish из filters.js
    if (soupDish && window.selectDish) {
        window.selectDish(soupDish);
    }
    if (mainDish && window.selectDish) {
        window.selectDish(mainDish);
    }
    if (drinkDish && window.selectDish) {
        window.selectDish(drinkDish);
    }

    // Создаем объект comboCheck для передачи в updateOrderPrice
    const comboCheck = {
        isValid: true,
        comboName: combo.name,
        comboDescription: combo.description,
        comboPrice: combo.price,
        comboKey: comboKey
    };

    // Обновляем цену
    updateOrderPrice(combo.price, comboCheck);

    // Показываем уведомление
    setTimeout(() => {
        showNotification('success');
    }, 300);
}

// Проверяем и создаем глобальную ссылку на selectDish, если она не существует
if (typeof window.selectDish === 'undefined') {
    console.warn('window.selectDish не определена, создаю заглушку');
    window.selectDish = function(dish) {
        selectedDishes[dish.category] = dish;
        console.log(`Заглушка: Выбрано блюдо ${dish.name} в категории ${dish.category}`);
    };
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализирую валидацию...');
    initValidation();

    // Отображаем информацию о комбо после загрузки блюд
    // Первый запуск через 1 секунду, потом ждем загрузки dishes
    setTimeout(() => {
        if (dishes && dishes.length > 0) {
            displayComboInfo();
        } else {
            // Проверяем каждые 500мс, пока не загрузятся блюда
            const checkInterval = setInterval(() => {
                if (dishes && dishes.length > 0) {
                    displayComboInfo();
                    clearInterval(checkInterval);
                }
            }, 500);
        }
    }, 1000);
});

// Экспортируем функции для использования в других файлах
window.displayComboInfo = displayComboInfo;
window.selectCombo = selectCombo;