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
const PORT = 3000; // или 8080, или 5000

// ====================
// 3. НАСТРАИВАЕМ СЕРВЕР
// ====================
// Разрешаем запросы с любого сайта (для теста)
app.use(cors());

// Умеем читать JSON из запросов
app.use(bodyParser.json());

// Для удобства - логируем все запросы
app.use((req, res, next) => {
    console.log('[${new Date().toISOString()}] ${req.method} ${req.url}');
    next();
});

// ====================
// 4. "БАЗА ДАННЫХ" - файл orders.json
// ====================
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const DISHES_FILE = path.join(__dirname, 'db.json');

// Функция загрузки заказов
async function loadOrders() {
    try {
        const data = await fs.readFile(ORDERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Если файла нет - создаём пустой массив
        return [];
    }
}

// Функция сохранения заказов
async function saveOrders(orders) {
    await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

app.get('/api/dishes', async (req, res) => {
    try {
        console.log('Запрос на получение блюд...');

        // Читаем файл db.json
        const data = await fs.readFile(DISHES_FILE, 'utf8');
        const dishes = JSON.parse(data);

        console.log(`Загружено ${dishes.length} блюд из db.json`);

        // Возвращаем блюда в том же формате, что и старый API
        res.json(dishes);

    } catch (error) {
        console.error('Ошибка при чтении db.json:', error);
        res.status(500).json({
            success: false,
            message: 'Не удалось загрузить меню'
        });
    }
});
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

// 5.2 СОЗДАТЬ НОВЫЙ ЗАКАЗ (POST /api/order)
app.post('/api/order', async (req, res) => {
    try {
        console.log('Создаём новый заказ:', req.body);

        const orders = await loadOrders();

        // Создаём новый заказ
        const newOrder = {
            id: Date.now().toString(), // Простой ID из времени
            ...req.body, // Все данные из формы
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

// 5.3 ПОЛУЧИТЬ ОДИН ЗАКАЗ (GET /api/orders/:id)
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

// 5.4 ОБНОВИТЬ ЗАКАЗ (PUT /api/orders/:id)
app.put('/api/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log('Обновляем заказ ID:', orderId);
        console.log('Новые данные:', req.body);

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
            ...orders[orderIndex], // Старые данные
            ...req.body,           // Новые данные
            updatedAt: new Date().toISOString() // Метка обновления
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

// 5.5 УДАЛИТЬ ЗАКАЗ (DELETE /api/orders/:id)
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