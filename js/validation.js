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

    document.body.appendChild(notificationEl);

    const okBtn = notificationEl.querySelector('.notification-ok-btn');
    okBtn.addEventListener('click', () => {
        document.body.removeChild(notificationEl);
    });

    notificationEl.addEventListener('click', (e) => {
        if (e.target === notificationEl) {
            document.body.removeChild(notificationEl);
        }
    });
}

// Функция валидации формы
function validateOrderForm(event) {
    const comboCheck = checkCombo(selectedDishes);

    if (!comboCheck.isValid) {
        event.preventDefault();

        const missing = [];
        if (!selectedDishes.soup) missing.push('суп');
        if (!selectedDishes.main) missing.push('основное блюдо');
        if (!selectedDishes.drink) missing.push('напиток');

        if (missing.length === 0) {
            showNotification('invalid-combo');
        } else if (missing.length === 1) {
            showNotification(`missing-${missing[0].includes('суп') ? 'soup' :
                           missing[0].includes('основное') ? 'main' : 'drink'}`);
        } else if (missing.length === 2) {
            showNotification('invalid-combo', missing);
        } else {
            showNotification('no-lunch');
        }

        return false;
    }

    // Если комбо валидно, обновляем цену
    let total = comboCheck.comboPrice;
    if (selectedDishes.starter) total += selectedDishes.starter.price;
    if (selectedDishes.dessert) total += selectedDishes.dessert.price;

    const totalAmount = document.getElementById('total-amount');
    if (totalAmount) {
        totalAmount.textContent = `${total} руб.`;
    }

    return true;
}

// Добавьте стили для уведомлений в head
function addNotificationStyles() {
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
            }
            .notification-modal {
                background-color: white;
                border-radius: 15px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                animation: notification-appear 0.3s ease;
            }
            @keyframes notification-appear {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            .notification-header {
                background-color: #e74c3c;
                color: white;
                padding: 20px;
                text-align: center;
            }
            .notification-header h3 {
                margin: 0;
                font-size: 20px;
            }
            .notification-body {
                padding: 25px;
                text-align: center;
            }
            .notification-body p {
                color: #333;
                margin-bottom: 15px;
                line-height: 1.5;
            }
            .missing-items {
                text-align: left;
                margin: 15px 0;
                padding-left: 20px;
                color: #666;
            }
            .missing-items li {
                margin-bottom: 8px;
            }
            .notification-footer {
                padding: 20px;
                text-align: center;
                border-top: 1px solid #eee;
            }
            .notification-ok-btn {
                background-color: #e74c3c;
                color: white;
                border: none;
                padding: 12px 40px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .notification-ok-btn:hover {
                background-color: #c0392b;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    addNotificationStyles();

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', validateOrderForm);
    }
});