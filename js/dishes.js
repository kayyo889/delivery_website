// Обновленный массив dishes с 30 блюдами (по 6 в каждой категории)
const dishes = [
    // ========== СУПЫ (6 блюд) ==========
    {
        keyword: "fish_soup",
        name: "Уха по-фински",
        price: 320,
        category: "soup",
        kind: "fish", // рыбный
        count: "350 г",
        image: "images/soup_fish1.jpg"
    },
    {
        keyword: "salmon_chowder",
        name: "Сливочный суп с лососем",
        price: 350,
        category: "soup",
        kind: "fish", // рыбный
        count: "300 г",
        image: "images/soup_fish2.jpg"
    },
    {
        keyword: "beef_borscht",
        name: "Борщ с говядиной",
        price: 280,
        category: "soup",
        kind: "meat", // мясной
        count: "400 г",
        image: "images/soup_meat1.jpg"
    },
    {
        keyword: "chicken_noodle_soup",
        name: "Куриный суп с лапшой",
        price: 250,
        category: "soup",
        kind: "meat", // мясной
        count: "350 г",
        image: "images/soup1.jpg"
    },
    {
        keyword: "mushroom_cream_soup",
        name: "Грибной крем-суп",
        price: 280,
        category: "soup",
        kind: "veg", // вегетарианский
        count: "300 г",
        image: "images/soup2.jpg"
    },
    {
        keyword: "tomato_basil_soup",
        name: "Томатный суп с базиликом",
        price: 270,
        category: "soup",
        kind: "veg", // вегетарианский
        count: "320 г",
        image: "images/soup3.jpg"
    },

    // ========== ГЛАВНЫЕ БЛЮДА (6 блюд) ==========
    {
        keyword: "grilled_salmon",
        name: "Лосось на гриле",
        price: 450,
        category: "main",
        kind: "fish", // рыбное
        count: "350 г",
        image: "images/main_fish1.jpg"
    },
    {
        keyword: "fish_stew",
        name: "Тушеная рыба с овощами",
        price: 420,
        category: "main",
        kind: "fish", // рыбное
        count: "380 г",
        image: "images/main_fish2.jpg"
    },
    {
        keyword: "teriyaki_chicken_rice",
        name: "Курица терияки с рисом",
        price: 380,
        category: "main",
        kind: "meat", // мясное
        count: "400 г",
        image: "images/main1.jpg"
    },
    {
        keyword: "beef_stroganoff",
        name: "Бефстроганов",
        price: 420,
        category: "main",
        kind: "meat", // мясное
        count: "380 г",
        image: "images/main_meat2.jpg"
    },
    {
        keyword: "pasta_carbonara",
        name: "Паста Карбонара",
        price: 350,
        category: "main",
        kind: "veg", // вегетарианское
        count: "350 г",
        image: "images/main3.jpg"
    },
    {
        keyword: "vegetable_stew",
        name: "Овощное рагу",
        price: 320,
        category: "main",
        kind: "veg", // вегетарианское
        count: "400 г",
        image: "images/main_veg2.jpg"
    },

    // ========== НАПИТКИ (6 блюд) ==========
    {
        keyword: "cranberry_juice",
        name: "Морс клюквенный",
        price: 150,
        category: "drink",
        kind: "cold", // холодный
        count: "330 мл",
        image: "images/drink1.jpg"
    },
    {
        keyword: "mint_lemonade",
        name: "Лимонад мятный",
        price: 180,
        category: "drink",
        kind: "cold", // холодный
        count: "500 мл",
        image: "images/drink2.jpg"
    },
    {
        keyword: "orange_juice",
        name: "Апельсиновый сок",
        price: 160,
        category: "drink",
        kind: "cold", // холодный
        count: "330 мл",
        image: "images/drink_cold3.jpg"
    },
    {
        keyword: "coffee_latte",
        name: "Кофе латте",
        price: 200,
        category: "drink",
        kind: "hot", // горячий
        count: "300 мл",
        image: "images/drink3.jpg"
    },
    {
        keyword: "black_tea",
        name: "Черный чай",
        price: 120,
        category: "drink",
        kind: "hot", // горячий
        count: "400 мл",
        image: "images/drink_hot2.jpg"
    },
    {
        keyword: "cappuccino",
        name: "Капучино",
        price: 220,
        category: "drink",
        kind: "hot", // горячий
        count: "300 мл",
        image: "images/drink_hot3.jpg"
    },

    // ========== САЛАТЫ И СТАРТЕРЫ (6 блюд) ==========
    {
        keyword: "shrimp_salad",
        name: "Салат с креветками",
        price: 320,
        category: "starter",
        kind: "fish", // рыбный
        count: "250 г",
        image: "images/starter_fish1.jpg"
    },
    {
        keyword: "caesar_salad",
        name: "Салат Цезарь с курицей",
        price: 350,
        category: "starter",
        kind: "meat", // мясной
        count: "300 г",
        image: "images/starter_meat1.jpg"
    },
    {
        keyword: "greek_salad",
        name: "Греческий салат",
        price: 280,
        category: "starter",
        kind: "veg", // вегетарианский
        count: "350 г",
        image: "images/starter_veg1.jpg"
    },
    {
        keyword: "caprese_salad",
        name: "Салат Капрезе",
        price: 300,
        category: "starter",
        kind: "veg", // вегетарианский
        count: "280 г",
        image: "images/starter_veg2.jpg"
    },
    {
        keyword: "vegetable_spring_rolls",
        name: "Весенние роллы с овощами",
        price: 270,
        category: "starter",
        kind: "veg", // вегетарианский
        count: "4 шт",
        image: "images/starter_veg3.jpg"
    },
    {
        keyword: "bruschetta",
        name: "Брускетта с томатами",
        price: 250,
        category: "starter",
        kind: "veg", // вегетарианский
        count: "3 шт",
        image: "images/starter_veg4.jpg"
    },

    // ========== ДЕСЕРТЫ (6 блюд) ==========
    {
        keyword: "tiramisu",
        name: "Тирамису",
        price: 280,
        category: "dessert",
        kind: "small", // маленькая порция
        count: "150 г",
        image: "images/dessert_small1.jpg"
    },
    {
        keyword: "cheesecake",
        name: "Чизкейк Нью-Йорк",
        price: 320,
        category: "dessert",
        kind: "small", // маленькая порция
        count: "120 г",
        image: "images/dessert_small2.jpg"
    },
    {
        keyword: "chocolate_mousse",
        name: "Шоколадный мусс",
        price: 250,
        category: "dessert",
        kind: "small", // маленькая порция
        count: "130 г",
        image: "images/dessert_small3.jpg"
    },
    {
        keyword: "apple_pie",
        name: "Яблочный пирог",
        price: 350,
        category: "dessert",
        kind: "medium", // средняя порция
        count: "250 г",
        image: "images/dessert_medium1.jpg"
    },
    {
        keyword: "pancakes",
        name: "Блинчики с вареньем",
        price: 300,
        category: "dessert",
        kind: "medium", // средняя порция
        count: "220 г",
        image: "images/dessert_medium2.jpg"
    },
    {
        keyword: "ice_cream_sundae",
        name: "Пломбир с фруктами",
        price: 400,
        category: "dessert",
        kind: "large", // большая порция
        count: "350 г",
        image: "images/dessert_large1.jpg"
    }
];

// Сортировка по алфавиту при инициализации
dishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));