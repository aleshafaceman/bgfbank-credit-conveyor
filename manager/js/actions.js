// ========== ДЕЙСТВИЯ МЕНЕДЖЕРА ==========

function managerAction(appId, action) {
    refreshData();
    const app = managerApplications.find(a => a.id === appId);
    if (!app) return;
    
    const now = new Date();
    const timestamp = `Сегодня, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    switch(action) {
        case 'requestDocs':
            updateApplicationStatus(appId, app.status, app.statusLabel, 'Менеджер запросил документы');
            sendChatMessage('manager', app.client, 'Пожалуйста, загрузите недостающие документы по заявке №' + appId + '.', app.client);
            alert(`Клиенту ${app.client} отправлен запрос документов.`);
            break;
            
        case 'startReview':
            updateApplicationStatus(appId, 'processing', 'В обработке', 'Заявка принята в обработку');
            sendChatMessage('manager', app.client, 'Ваша заявка №' + appId + ' принята в обработку.', app.client);
            break;
            
        case 'startScoring':
            updateApplicationStatus(appId, 'valuation', 'На оценке', 'Запущен прескоринг в Loginom');
            sendChatMessage('manager', app.client, 'Запущен прескоринг по заявке №' + appId + '. Результат через 2 минуты.', app.client);
            refreshData();
            renderApplicationDetail(appId);
            renderApplicationList();
            updateStats();
            
            setTimeout(() => {
                const updatedApp = getManagerApplications().find(a => a.id === appId);
                if (updatedApp) {
                    const rate = 12.5;
                    const payment = Math.round(updatedApp.amount * (rate / 100) / 12 / (1 - Math.pow(1 + (rate / 100) / 12, -updatedApp.term * 12)));
                    updateApplication(appId, { rate, payment });
                    updateApplicationStatus(appId, 'decision', 'Решение', 'Прескоринг завершён. Ставка: ' + rate + '%');
                    sendChatMessage('manager', app.client, 'Прескоринг завершён! Ставка: ' + rate + '%, платёж: ~' + payment.toLocaleString('ru-RU') + ' ₽.', app.client);
                }
                refreshData();
                renderApplicationDetail(appId);
                renderApplicationList();
                updateStats();
            }, 2000);
            break;
            
        case 'requestValuation':
            const ov = app.collateralValue;
            const nv = Math.round(app.collateralValue * (0.93 + Math.random() * 0.14));
            updateApplication(appId, { collateralValue: nv });
            updateApplicationStatus(appId, app.status, app.statusLabel, `Оценка Ocenka.mobi: ${nv.toLocaleString('ru-RU')} ₽`);
            sendChatMessage('manager', app.client, 'Обновлена оценка недвижимости: ' + nv.toLocaleString('ru-RU') + ' ₽.', app.client);
            alert(`Оценка обновлена:\n${app.collateralAddress}\n${ov.toLocaleString('ru-RU')} → ${nv.toLocaleString('ru-RU')} ₽`);
            break;
            
        case 'approve':
            updateApplicationStatus(appId, 'approved', 'Одобрено', 'Кредит одобрен менеджером');
            if (!app.rate) {
                const defRate = 12.5;
                const defPayment = Math.round(app.amount * (defRate / 100) / 12 / (1 - Math.pow(1 + (defRate / 100) / 12, -app.term * 12)));
                updateApplication(appId, { rate: defRate, payment: defPayment });
            }
            sendChatMessage('manager', app.client, 'Поздравляю! Ваша заявка №' + appId + ' одобрена! Договор отправлен на подписание.', app.client);
            alert(`Заявка №${app.id} одобрена!\n\nКлиент: ${app.client}`);
            break;
            
        case 'reject':
            const reason = prompt('Укажите причину отказа:', 'Недостаточный уровень подтверждённого дохода');
            if (reason) {
                updateApplicationStatus(appId, 'rejected', 'Отказ', 'Заявка отклонена: ' + reason);
                sendChatMessage('manager', app.client, 'По заявке №' + appId + ' принято отрицательное решение. Причина: ' + reason, app.client);
                alert(`Заявка №${app.id} отклонена.\n\nПричина: ${reason}`);
            }
            break;
    }
    
    saveSharedData();
    refreshData();
    renderApplicationDetail(appId);
    renderApplicationList();
    updateStats();
}