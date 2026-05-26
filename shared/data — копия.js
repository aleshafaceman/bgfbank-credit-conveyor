// ========== ОБЩАЯ БАЗА ДАННЫХ ==========
// Используется и клиентом, и менеджером
// Данные сохраняются в localStorage для синхронизации между вкладками

const STORAGE_KEY = 'bgfbank_applications';
const CLIENTS_KEY = 'bgfbank_clients';
const MESSAGES_KEY = 'bgfbank_messages';

let sharedApplications = [];
let sharedClients = {};
let sharedMessages = [];

function loadSharedData() {
    const savedApps = localStorage.getItem(STORAGE_KEY);
    const savedClients = localStorage.getItem(CLIENTS_KEY);
    const savedMessages = localStorage.getItem(MESSAGES_KEY);
    
    if (savedApps) {
        sharedApplications = JSON.parse(savedApps);
    } else {
        // Начальные данные для демонстрации
        sharedApplications = [
            {
                id: '4421-И', client: 'Александр Кузнецов', phone: '+7 (999) 123-45-67',
                product: 'Кредит под залог недвижимости', amount: 5000000, term: 15, rate: null, payment: null,
                collateralAddress: 'г. Москва, ул. Крылатская, д. 15, кв. 42', collateralValue: 8500000,
                status: 'valuation', statusLabel: 'На оценке', date: '15.06.2026',
                documents: [
                    { name: 'Справка 2-НДФЛ', status: 'uploaded', statusLabel: 'Загружен' },
                    { name: 'Паспорт (разворот)', status: 'uploaded', statusLabel: 'Загружен' },
                    { name: 'Выписка ЕГРН', status: 'missing', statusLabel: 'Не загружен' }
                ],
                history: [
                    { text: 'Заявка передана на оценку залога', date: '15.06.2026, 14:32', current: true },
                    { text: 'Данные профиля загружены из ЕСИА', date: '15.06.2026, 14:30', current: false },
                    { text: 'Параметры кредита указаны', date: '15.06.2026, 10:15', current: false },
                    { text: 'Заявка создана', date: '15.06.2026, 10:12', current: false }
                ]
            },
            {
                id: '3890-И', client: 'Александр Кузнецов', phone: '+7 (999) 123-45-67',
                product: 'Кредит под залог недвижимости', amount: 4200000, term: 15, rate: 12.8, payment: 48300,
                collateralAddress: 'г. Москва, ул. Крылатская, д. 15, кв. 42', collateralValue: 8500000,
                status: 'approved', statusLabel: 'Одобрено', date: '03.02.2026',
                documents: [
                    { name: 'Справка 2-НДФЛ', status: 'uploaded', statusLabel: 'Загружен' },
                    { name: 'Паспорт (разворот)', status: 'uploaded', statusLabel: 'Загружен' },
                    { name: 'Выписка ЕГРН', status: 'uploaded', statusLabel: 'Загружен' }
                ],
                history: [
                    { text: 'Кредит одобрен', date: '10.02.2026', current: true },
                    { text: 'Прескоринг пройден', date: '08.02.2026', current: false },
                    { text: 'Документы проверены', date: '05.02.2026', current: false },
                    { text: 'Заявка создана', date: '03.02.2026', current: false }
                ]
            },
            {
                id: '3701-И', client: 'Дмитрий Иванов', phone: '+7 (903) 111-22-33',
                product: 'Кредит под залог недвижимости', amount: 6000000, term: 10, rate: null, payment: null,
                collateralAddress: 'г. Москва, ул. Ленина, д. 30, кв. 12', collateralValue: 7800000,
                status: 'rejected', statusLabel: 'Отказ', date: '12.11.2025',
                documents: [
                    { name: 'Справка 2-НДФЛ', status: 'uploaded', statusLabel: 'Загружен' },
                    { name: 'Паспорт (разворот)', status: 'uploaded', statusLabel: 'Загружен' },
                    { name: 'Выписка ЕГРН', status: 'uploaded', statusLabel: 'Загружен' }
                ],
                history: [
                    { text: 'Заявка отклонена: недостаточный доход', date: '18.11.2025', current: true },
                    { text: 'Прескоринг пройден', date: '15.11.2025', current: false },
                    { text: 'Заявка создана', date: '12.11.2025', current: false }
                ]
            }
        ];
        saveSharedData();
    }
    
    if (savedClients) {
        sharedClients = JSON.parse(savedClients);
    }
    
    if (savedMessages) {
        sharedMessages = JSON.parse(savedMessages);
    } else {
        // Начальные сообщения для демонстрации чата
        sharedMessages = [
            {
                id: 'msg1',
                from: 'manager',
                to: 'Александр Кузнецов',
                text: 'Александр, добрый день! Меня зовут Елена, я ваш кредитный менеджер. Вижу, вы начали оформление заявки №4421-И. Нужна помощь?',
                time: '14:15',
                date: '15.06.2026',
                read: true
            },
            {
                id: 'msg2',
                from: 'client',
                to: 'Александр Кузнецов',
                text: 'Здравствуйте! Да, подскажите, какой пакет документов нужен для подтверждения дохода?',
                time: '14:18',
                date: '15.06.2026',
                read: true
            },
            {
                id: 'msg3',
                from: 'manager',
                to: 'Александр Кузнецов',
                text: 'Для подтверждения дохода подойдёт справка 2-НДФЛ за последние 6 месяцев или справка по форме банка. Если у вас подключён ЕСИА, данные подтянутся автоматически.',
                time: '14:19',
                date: '15.06.2026',
                read: true
            },
            {
                id: 'msg4',
                from: 'client',
                to: 'Александр Кузнецов',
                text: 'Понял, спасибо! Загружу 2-НДФЛ сегодня вечером.',
                time: '14:21',
                date: '15.06.2026',
                read: true
            },
            {
                id: 'msg5',
                from: 'manager',
                to: 'Александр Кузнецов',
                text: 'Отлично! Как загрузите — дайте знать, я сразу проверю и запущу прескоринг. Обычно решение приходит в течение 2 минут после загрузки всех документов.',
                time: '14:22',
                date: '15.06.2026',
                read: true
            },
            {
                id: 'msg6',
                from: 'manager',
                to: 'Мария Петрова',
                text: 'Мария, здравствуйте! Это Елена Смирнова, кредитный менеджер БЖФ Банка. Вижу вашу заявку №4450-И. Для продолжения потребуется загрузить справку 2-НДФЛ.',
                time: '10:05',
                date: '16.06.2026',
                read: false
            },
            {
                id: 'msg7',
                from: 'manager',
                to: 'Сергей Волков',
                text: 'Сергей, добрый день! Ваша заявка №4460-И принята в обработку. Все документы проверены, запускаю прескоринг.',
                time: '11:30',
                date: '16.06.2026',
                read: false
            }
        ];
        saveMessagesData();
    }
    
    buildClientsFromApplications();
}

// ========== ПОСТРОЕНИЕ КЛИЕНТОВ ИЗ ЗАЯВОК ==========
function buildClientsFromApplications() {
    const newClients = {};
    
    sharedApplications.forEach(app => {
        if (!newClients[app.client]) {
            newClients[app.client] = {
                name: app.client,
                phone: app.phone,
                email: app.client.split(' ')[0].toLowerCase().replace('ё','e') + '@mail.ru',
                address: app.collateralAddress,
                passport: '4510 123456',
                passportDate: '20.03.2020',
                passportBy: 'УФМС России по г. Москве',
                birthDate: '15.06.1985',
                source: 'esia',
                workplace: 'ООО «ТехноСофт»',
                position: 'Руководитель отдела',
                income: 180000,
                experience: '3-5',
                employmentType: 'permanent',
                applications: [],
                properties: [
                    {
                        address: app.collateralAddress,
                        type: 'Квартира',
                        area: 65,
                        valuation: app.collateralValue
                    }
                ],
                interactions: []
            };
        }
        newClients[app.client].applications.push(app);
    });
    
    // Дополнительные свойства для существующих клиентов
    if (newClients['Александр Кузнецов'] && newClients['Александр Кузнецов'].properties.length < 2) {
        newClients['Александр Кузнецов'].properties.push({
            address: 'г. Москва, ул. Пресненская наб., д. 8, апарт. 120',
            type: 'Апартаменты',
            area: 48,
            valuation: 7200000
        });
    }
    
    sharedClients = { ...sharedClients, ...newClients };
    saveClientsData();
}

// ========== СОХРАНЕНИЕ ДАННЫХ ==========
function saveSharedData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedApplications));
}

function saveClientsData() {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(sharedClients));
}

function saveMessagesData() {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(sharedMessages));
}

// ========== API ДЛЯ РАБОТЫ С ЗАЯВКАМИ ==========
function addApplication(app) {
    const newApp = {
        ...app,
        id: app.id || generateAppId(),
        date: app.date || new Date().toLocaleDateString('ru-RU'),
        status: app.status || 'new',
        statusLabel: app.statusLabel || 'Новая',
        documents: app.documents || [
            { name: 'Справка 2-НДФЛ', status: 'missing', statusLabel: 'Не загружен' },
            { name: 'Паспорт (разворот)', status: 'missing', statusLabel: 'Не загружен' },
            { name: 'Выписка ЕГРН', status: 'missing', statusLabel: 'Не загружен' }
        ],
        history: app.history || [
            {
                text: 'Заявка создана клиентом',
                date: new Date().toLocaleDateString('ru-RU') + ', ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                current: true
            }
        ],
        rate: app.rate || null,
        payment: app.payment || null
    };
    
    sharedApplications.unshift(newApp);
    buildClientsFromApplications();
    saveSharedData();
    
    return newApp;
}

function updateApplicationStatus(appId, newStatus, statusLabel, historyText) {
    const app = sharedApplications.find(a => a.id === appId);
    if (!app) return null;
    
    app.status = newStatus;
    app.statusLabel = statusLabel;
    
    // Сбрасываем current у всех записей истории
    app.history.forEach(h => h.current = false);
    
    // Добавляем новую запись
    app.history.unshift({
        text: historyText,
        date: new Date().toLocaleDateString('ru-RU') + ', ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        current: true
    });
    
    saveSharedData();
    return app;
}

function updateApplication(appId, updates) {
    const app = sharedApplications.find(a => a.id === appId);
    if (!app) return null;
    Object.assign(app, updates);
    saveSharedData();
    return app;
}

function getApplicationsForClient(clientName) {
    return sharedApplications.filter(a => a.client === clientName);
}

function getAllApplications() {
    return [...sharedApplications];
}

function getClientData(clientName) {
    buildClientsFromApplications();
    return sharedClients[clientName] || null;
}

function getAllClients() {
    buildClientsFromApplications();
    return { ...sharedClients };
}

function generateAppId() {
    const num = Math.floor(Math.random() * 9000) + 1000;
    return num + '-И';
}

// ========== API ДЛЯ РАБОТЫ С СООБЩЕНИЯМИ ==========
function sendChatMessage(from, to, text, clientName) {
    const now = new Date();
    const msg = {
        id: 'msg' + Date.now(),
        from: from,
        to: to || clientName,
        text: text,
        time: now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'),
        date: now.toLocaleDateString('ru-RU'),
        read: false
    };
    
    sharedMessages.push(msg);
    saveMessagesData();
    return msg;
}

function getChatHistory(clientName) {
    if (!clientName) return [];
    return sharedMessages.filter(m => m.to === clientName);
}

function getUnreadCount(clientName) {
    if (!clientName) return 0;
    return sharedMessages.filter(m => m.to === clientName && !m.read && m.from === 'client').length;
}

function markMessagesAsRead(clientName) {
    let updated = false;
    sharedMessages.forEach(m => {
        if (m.to === clientName && !m.read) {
            m.read = true;
            updated = true;
        }
    });
    if (updated) saveMessagesData();
}

function getManagerChatList() {
    // Получаем список уникальных клиентов, с которыми есть переписка
    const uniqueClients = [...new Set(sharedMessages.map(m => m.to))];
    
    return uniqueClients.map(clientName => {
        const messages = sharedMessages.filter(m => m.to === clientName);
        const lastMessage = messages[messages.length - 1];
        const unreadCount = messages.filter(m => !m.read && m.from === 'client').length;
        
        // Ищем активную заявку клиента
        const activeApp = sharedApplications.find(
            a => a.client === clientName && a.status !== 'approved' && a.status !== 'rejected'
        );
        
        return {
            clientName: clientName,
            lastMessage: lastMessage ? lastMessage.text.substring(0, 50) + (lastMessage.text.length > 50 ? '...' : '') : '',
            lastTime: lastMessage ? lastMessage.time : '',
            unread: unreadCount,
            status: activeApp ? activeApp.statusLabel : 'Нет активных заявок',
            appId: activeApp ? activeApp.id : null
        };
    }).sort((a, b) => b.lastTime.localeCompare(a.lastTime));
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ==========
loadSharedData();