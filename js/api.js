// api.js - ИСПРАВЛЕННАЯ ВЕРСИЯ

// Fallback данные для отладки (если API недоступен)
function getFallbackDishes() {
    console.log('Использую тестовые данные...');
    return [
        {
            id: 1,
            name: "Куриный суп",
            category: "Первое",
            price: 330,
            keyword: "chicken",
            image: "images/soup1.jpg",
            kind: "meat",
            count: "250 мл"
        },
        {
            id: 2,
            name: "Котлеты из курицы с картофельным пюре",
            category: "Второе",
            price: 225,
            keyword: "kotlety-s-pyure",
            image: "images/main1.jpg",
            kind: "meat",
            count: "300 г"
        },
        {
            id: 3,
            name: "Апельсиновый сок",
            category: "Напиток",
            price: 120,
            keyword: "apelsinoviy",
            image: "images/drink1.jpg",
            kind: "cold",
            count: "200 мл"
        },
        {
            id: 4,
            name: "Том ям с креветками",
            category: "Первое",
            price: 650,
            keyword: "tomyum",
            image: "images/soup2.jpg",
            kind: "fish",
            count: "300 мл"
        },
        {
            id: 5,
            name: "Паста с креветками",
            category: "Второе",
            price: 340,
            keyword: "shrimppasta",
            image: "images/main2.jpg",
            kind: "fish",
            count: "350 г"
        },
        {
            id: 6,
            name: "Морковный сок",
            category: "Напиток",
            price: 110,
            keyword: "morkovniy",
            image: "images/drink2.jpg",
            kind: "cold",
            count: "200 мл"
        }
    ];
}

async function loadDishes() {
    // URL вашего локального сервера
    const url = 'http://localhost:3000/api/dishes';

    try {
        console.log('Загрузка блюд из API...');
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Данные получены от сервера:', data);

        // ИСПРАВЛЕНИЕ: Проверяем, что data существует и извлекаем массив
        let dishesArray = [];

        // Если data - массив, используем как есть
        if (Array.isArray(data)) {
            dishesArray = data;
            console.log('Блюда успешно загружены из API:', dishesArray.length, 'шт.');
        }
        // Если data - объект с полем dishes (например, {dishes: [...]})
        else if (data && data.dishes && Array.isArray(data.dishes)) {
            dishesArray = data.dishes;
            console.log('Блюда успешно загружены из API (из объекта dishes):', dishesArray.length, 'шт.');
        }
        // Если data - объект с другим полем
        else if (data && typeof data === 'object') {
            // Пытаемся найти массив в объекте
            const possibleArrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
            if (possibleArrayKey) {
                dishesArray = data[possibleArrayKey];
                console.log(`Блюда загружены из поля "${possibleArrayKey}":`, dishesArray.length, 'шт.');
            } else {
                throw new Error('Не найден массив блюд в ответе сервера');
            }
        }
        else {
            throw new Error('Неправильный формат данных от сервера');
        }

        // Если массив пустой, используем fallback
        if (dishesArray.length === 0) {
            console.warn('Сервер вернул пустой массив блюд, использую fallback данные');
            return getFallbackDishes();
        }

        // Преобразуем категории из API в наши внутренние категории
        const transformedData = dishesArray.map(dish => {
            const transformedDish = { ...dish };

            // Преобразуем категории
            if (dish.category === 'main-course') {
                transformedDish.category = 'main';
            } else if (dish.category === 'salad') {
                transformedDish.category = 'starter';
            } else if (dish.category === 'soup') {
                transformedDish.category = 'soup';
            } else if (dish.category === 'drink') {
                transformedDish.category = 'drink';
            } else if (dish.category === 'dessert') {
                transformedDish.category = 'dessert';
            } else if (dish.category === 'Первое') {
                transformedDish.category = 'soup';
            } else if (dish.category === 'Второе') {
                transformedDish.category = 'main';
            } else if (dish.category === 'Салат') {
                transformedDish.category = 'starter';
            } else if (dish.category === 'Напиток') {
                transformedDish.category = 'drink';
            } else if (dish.category === 'Десерт') {
                transformedDish.category = 'dessert';
            }

            // Преобразуем kind для десертов
            if (transformedDish.category === 'dessert') {
                if (dish.kind === 'small') transformedDish.kind = 'small';
                if (dish.kind === 'medium') transformedDish.kind = 'medium';
                if (dish.kind === 'large') transformedDish.kind = 'large';
            }

            return transformedDish;
        });

        console.log('Преобразовано блюд:', transformedData.length);

        // Отфильтруем только нужные категории
        const allowedCategories = ['soup', 'main', 'drink', 'starter', 'dessert'];
        const filteredData = transformedData.filter(dish =>
            allowedCategories.includes(dish.category)
        );

        console.log('Отфильтровано блюд:', filteredData.length);

        // Сортируем по алфавиту
        filteredData.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

        // Выведем информацию по категориям для отладки
        console.group('Распределение по категориям:');
        const categoriesCount = {};
        filteredData.forEach(dish => {
            categoriesCount[dish.category] = (categoriesCount[dish.category] || 0) + 1;
        });
        Object.keys(categoriesCount).forEach(cat => {
            console.log(`${cat}: ${categoriesCount[cat]} блюд`);
        });
        console.groupEnd();

        return filteredData;

    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);

        // Fallback данные для отладки
        console.log('Использую fallback данные для отладки...');
        return getFallbackDishes();
    }
}

// Экспорт функции для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadDishes };
}