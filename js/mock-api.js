const mockOrders = [
    {
        id: 1,
        date: '2024-01-15T12:30:00Z',
        dishes: {
            soup: 'Куриный суп',
            main: 'Котлеты с пюре',
            drink: 'Апельсиновый сок'
        },
        total: 645,
        delivery_time: '13:00-14:00',
        delivery_address: 'ул. Примерная, д. 10'
    },
    {
        id: 2,
        date: '2024-01-14T13:15:00Z',
        dishes: {
            soup: 'Том ям',
            main: 'Лазанья',
            drink: 'Капучино'
        },
        total: 1205,
        delivery_time: 'asap',
        delivery_address: 'ул. Демонстрационная, д. 5'
    }
];


const originalFetch = window.fetch;
window.fetch = async function(url, options) {
    console.log('Запрос к:', url);

    // Мок для заказов
    if (url.includes('/api/orders')) {
        if (options?.method === 'GET') {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockOrders)
            });
        }

        if (options?.method === 'POST') {
            console.log('Мок: заказ сохранен', JSON.parse(options.body));
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true, orderId: Date.now() })
            });
        }
    }


    return originalFetch(url, options);
};