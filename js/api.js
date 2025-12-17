// api.js
async function loadDishes() {
    const url = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

    try {
        console.log('Загрузка блюд из API...');
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dishes = await response.json();
        console.log('Блюда успешно загружены:', dishes.length, 'шт.');

        // Сортируем по алфавиту
        dishes.sort((a, b) => a.name.localeCompare(b.name));

        return dishes;

    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return [];
    }
}