// ====================
// 1. ПОДКЛЮЧАЕМ БИБЛИОТЕКИ
// ====================
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

// ====================
// 2. СОЗДАЁМ СЕРВЕР
// ====================
const app = express();
const PORT = 3000;

// ====================
// 3. НАСТРАИВАЕМ СЕРВЕР
// ====================
app.use(cors());
app.use(bodyParser.json());

// Логирование запросов - ИСПРАВЛЕНА СИНТАКСИЧЕСКАЯ ОШИБКА
app.use((req, res, next) => {
    console.log('[${new Date().toISOString()}] ${req.method} ${req.url}');
    next();
});

// ====================
// 4. ПУТИ К ФАЙЛАМ
// ====================
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const DISHES_FILE = path.join(__dirname, 'db.json');

// Функция загрузки заказов
async function loadOrders() {
    try {
        const data = await fs.readFile(ORDERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log('Файл orders.json не найден, создаем пустой массив');
        return [];
    }
}

// Функция сохранения заказов
async function saveOrders(orders) {
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

// Функция загрузки блюд
async function loadDishes() {
    try {
        const data = await fs.readFile(DISHES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Ошибка загрузки блюд:', error);
        return { dishes: [] };
    }
}

// ====================
// 5. API МАРШРУТЫ
// ====================

// 5.1 ПОЛУЧИТЬ ВСЕ БЛЮДА
app.get('/api/dishes', async (req, res) => {
    try {
        console.log('Запрос на получение блюд...');
        const data = await loadDishes();

        // Проверяем структуру данных
        if (Array.isArray(data)) {
            // Если db.json содержит массив
            console.log('Загружено ${data.length} блюд (массив)');
            res.json(data);
        } else if (data.dishes && Array.isArray(data.dishes)) {
            // Если db.json содержит объект с полем dishes
            console.log('Загружено ${data.dishes.length} блюд (объект.dishes)');
            res.json(data.dishes);
        } else {
            console.log('Неправильная структура db.json, возвращаем пустой массив');
            res.json([]);
        }
    } catch (error) {
        console.error('Ошибка при чтении db.json:', error);
        res.status(500).json({
            success: false,
            message: 'Не удалось загрузить меню'
        });
    }
});

// 5.2 СОЗДАТЬ НОВЫЙ ЗАКАЗ (POST /api/order) - ИСПРАВЛЕН ПУТЬ
app.post('/api/order', async (req, res) => {
    try {
        console.log('Создаём новый заказ:', JSON.stringify(req.body, null, 2));

        const orders = await loadOrders();

        // Проверяем обязательные поля
        if (!req.body.customer_name || !req.body.customer_phone || !req.body.delivery_address) {
            return res.status(400).json({
                success: false,
                message: 'Заполните обязательные поля: имя, телефон, адрес'
            });
        }

        // Создаём новый заказ
        const newOrder = {
            id: Date.now().toString(),
            customer_name: req.body.customer_name,
            customer_phone: req.body.customer_phone,
            delivery_address: req.body.delivery_address,
            delivery_time: req.body.delivery_time || '13:00-14:00',
            comments: req.body.comments || '',
            combo: req.body.combo || 'classic',
            total: req.body.total || 0,
            dishes: req.body.dishes || {},
            createdAt: new Date().toISOString(),
            status: 'new'
        };

        // Добавляем в массив
        orders.push(newOrder);

        // Сохраняем
        await saveOrders(orders);

        console.log('Заказ создан, ID:', newOrder.id);

        res.json({
            success: true,
            message: 'Заказ успешно создан!',
            orderId: newOrder.id,
            order: newOrder
        });

    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при создании заказа'
        });
    }
});

// 5.3 ПОЛУЧИТЬ ВСЕ ЗАКАЗЫ
app.get('/api/orders', async (req, res) => {
    try {
        console.log('Получаем список заказов...');
        const orders = await loadOrders();

        // Сортируем по дате (новые сначала)
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            data: orders,
            count: orders.length
        });

    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера при получении заказов'
        });
    }
});

// 5.4 ПОЛУЧИТЬ ОДИН ЗАКАЗ
app.get('/api/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log('Получаем заказ ID:', orderId);

        const orders = await loadOrders();
        const order = orders.find(o => o.id === orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Заказ не найден'
            });
        }

        res.json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Ошибка при получении заказа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера'
        });
    }
});

// 5.5 ОБНОВИТЬ ЗАКАЗ
app.put('/api/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log('Обновляем заказ ID:', orderId);

        const orders = await loadOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);

        if (orderIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Заказ не найден'
            });
        }

        // Обновляем заказ
        orders[orderIndex] = {
            ...orders[orderIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };

        await saveOrders(orders);

        res.json({
            success: true,
            message: 'Заказ успешно обновлён',
            data: orders[orderIndex]
        });

    } catch (error) {
        console.error('Ошибка при обновлении заказа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обновлении заказа'
        });
    }
});

// 5.6 УДАЛИТЬ ЗАКАЗ
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log('Удаляем заказ ID:', orderId);

        const orders = await loadOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);

        if (orderIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Заказ не найден'
            });
        }

        // Удаляем заказ
        const deletedOrder = orders.splice(orderIndex, 1);

        await saveOrders(orders);

        res.json({
            success: true,
            message: 'Заказ успешно удалён',
            deletedOrder: deletedOrder[0]
        });

    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при удалении заказа'
        });
    }
});

// ====================
// 6. ЗАПУСК СЕРВЕРА
// ====================
app.listen(PORT, () => {
    console.log('=================================');
    console.log('🚀 Сервер запущен!');
    console.log('📍 Адрес: http://localhost:${PORT}');
    console.log('📊 API доступно по пути: /api/...');
    console.log('=================================');
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Непредвиденная ошибка:', err);
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
    });
});