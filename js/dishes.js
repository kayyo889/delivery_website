// В файле js/dishes.js или встроенном скрипте:
const dishes = [
    // Супы (3 блюда)
    {
        keyword: "chicken_noodle_soup",
        name: "Куриный суп с лапшой",
        price: 250,
        category: "soup",
        count: "350 г",
        image: "images/soup1.jpg"
    },
    {
        keyword: "mushroom_cream_soup",
        name: "Грибной крем-суп",
        price: 280,
        category: "soup",
        count: "300 г",
        image: "images/soup2.jpg"
    },
    {
        keyword: "tomato_basil_soup",
        name: "Томатный суп с базиликом",
        price: 270,
        category: "soup",
        count: "320 г",
        image: "images/soup3.jpg"
    },

    // Главные блюда (3 блюда)
    {
        keyword: "teriyaki_chicken_rice",
        name: "Курица терияки с рисом",
        price: 380,
        category: "main",
        count: "400 г",
        image: "images/main1.jpg"
    },
    {
        keyword: "grilled_salmon_vegetables",
        name: "Лосось на гриле с овощами",
        price: 450,
        category: "main",
        count: "350 г",
        image: "images/main2.jpg"
    },
    {
        keyword: "pasta_carbonara",
        name: "Паста Карбонара",
        price: 350,
        category: "main",
        count: "350 г",
        image: "images/main3.jpg"
    },

    // Напитки (3 блюда)
    {
        keyword: "coffee_latte",
        name: "Кофе латте",
        price: 200,
        category: "drink",
        count: "300 мл",
        image: "images/drink3.jpg"
    },
    {
        keyword: "mint_lemonade",
        name: "Лимонад мятный",
        price: 180,
        category: "drink",
        count: "500 мл",
        image: "images/drink2.jpg"
    },
    {
        keyword: "cranberry_juice",
        name: "Морс клюквенный",
        price: 150,
        category: "drink",
        count: "330 мл",
        image: "images/drink1.jpg"
    }
];

// Сортировка по алфавиту при инициализации
dishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));