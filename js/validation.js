if (typeof dishes === 'undefined') {
    var dishes = [];
}

if (typeof selectedDishes === 'undefined') {
    var selectedDishes = {
        soup: null,
        main: null,
        starter: null,
        drink: null,
        dessert: null
    };
}
function initValidation() {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', validateOrderForm);
        console.log('✅ Валидация формы инициализирована');
    }
}
// Определение комбо-вариантов
const combos = {
    classic: {
        name: "Классический",
        soup: "chicken_noodle_soup",        // Куриный суп с лапшой
        main: "teriyaki_chicken_rice",      // Курица терияки с рисом
        drink: "cranberry_juice",           // Морс клюквенный
        price: 780
    },
    fish: {
        name: "Рыбный",
        soup: "fish_soup",                  // Уха по-фински
        main: "grilled_salmon",             // Лосось на гриле
        drink: "orange_juice",              // Апельсиновый сок
        price: 930
    },
    vegetarian: {
        name: "Вегетарианский",
        soup: "mushroom_cream_soup",        // Грибной крем-суп
        main: "vegetable_stew",             // Овощное рагу
        drink: "mint_lemonade",             // Лимонад мятный
        price: 730
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
            return { isValid: true, comboName: combo.name, comboPrice: combo.price };
        }
    }
    return { isValid: false };
}

// Функция для показа уведомления
function showNotification(type, missingItems = []) {
    const notifications = {
        'no-lunch': {
            title: 'Вы не выбрали ланч',
            message: 'Пожалуйста, выберите блюда для своего ланча.'
        },
        'missing-soup': {
            title: 'Не хватает супа',
            message: 'Для завершения ланча выберите суп.'
        },
        'missing-main': {
            title: 'Не хватает основного блюда',
            message: 'Для завершения ланча выберите основное блюдо.'
        },
        'missing-drink': {
            title: 'Не хватает напитка',
            message: 'Для завершения ланча выберите напиток.'
        },
        'invalid-combo': {
            title: 'Некорректный состав ланча',
            message: 'Выбранные блюда не соответствуют ни одному из доступных вариантов.'
        }
    };

    const notification = notifications[type] || notifications['invalid-combo'];

    // Создаем элемент уведомления
    const notificationEl = document.createElement('div');
    notificationEl.className = 'notification-overlay';
    notificationEl.innerHTML = `
        <div class="notification-modal">
            <div class="notification-header">
                <h3>${notification.title}</h3>
            </div>
            <div class="notification-body">
                <p>${notification.message}</p>
                ${missingItems.length > 0 ?
                    `<ul class="missing-items">
                        ${missingItems.map(item => `<li>${item}</li>`).join('')}
                    </ul>` : ''}
            </div>
            <div class="notification-footer">
                <button class="notification-ok-btn">Окей</button>
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
}

// Функция валидации формы
function validateOrderForm(event) {
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
        } else if (missing.length === 2) {
            // Показываем общее уведомление с перечнем недостающих
            showNotification('invalid-combo', missing);
        } else {
            showNotification('no-lunch');
        }

        return false;
    }

    // Если комбо валидно, обновляем цену в заказе
    updateOrderPrice(comboCheck.comboPrice);
    return true;
}

// Обновление цены в заказе при валидном комбо
function updateOrderPrice(comboPrice) {
    // Добавляем выбранные десерты к цене
    let total = comboPrice;
    if (selectedDishes.starter) total += selectedDishes.starter.price;
    if (selectedDishes.dessert) total += selectedDishes.dessert.price;

    // Обновляем отображение цены
    const totalAmount = document.getElementById('total-amount');
    if (totalAmount) {
        totalAmount.textContent = `${total} руб.`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализирую валидацию...');
    initValidation();
});