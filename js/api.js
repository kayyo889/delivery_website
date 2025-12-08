// API URL для загрузки блюд
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

// Глобальная переменная для хранения блюд
let dishes = [];

// Функция для загрузки блюд через API
async function loadDishes() {
    try {
        console.log('Загрузка блюд из API...');

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        dishes = await response.json();
        console.log('Блюда успешно загружены:', dishes.length, 'шт.');

        // Сортируем блюда по алфавиту
        dishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

        // Отправляем событие, что блюда загружены
        document.dispatchEvent(new CustomEvent('dishesLoaded', { detail: dishes }));

        return dishes;
    } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);

        return dishes;
    }
}


