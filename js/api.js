// api.js - обновленная версия с преобразованием категорий
async function loadDishes() {
    const url = 'http://localhost:3000/dishes';

    try {
        console.log('Загрузка блюд из API...');
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Блюда успешно загружены из API:', data.length, 'шт.');

        // Преобразуем категории из API в наши внутренние категории
        const transformedData = data.map(dish => {
            // Создаем копию блюда
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
            }

            // Преобразуем kind для десертов (если нужно)
            if (transformedDish.category === 'dessert') {
                if (dish.kind === 'small') transformedDish.kind = 'small';
                if (dish.kind === 'medium') transformedDish.kind = 'medium';
                if (dish.kind === 'large') transformedDish.kind = 'large';
            }

            return transformedDish;
        });

        console.log('Преобразовано блюд:', transformedData.length);

        // Отфильтруем только нужные нам категории
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