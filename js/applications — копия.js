// ========== МОИ ЗАЯВКИ ==========
// Список заявок клиента и детализация

function selectApplication(appId) {
    state.selectedApp = appId;
    document.querySelectorAll('.application-card').forEach(c => c.classList.remove('active-card'));
    const card = document.querySelector(`[data-app="${appId}"]`);
    if (card) card.classList.add('active-card');
    renderApplicationDetail(appId);
}

function renderApplicationDetail(appId) {
    const c = document.getElementById('applicationDetail');
    switch(appId) {
        case '4421-И': c.innerHTML = getActiveApplicationHTML(); break;
        case '3890-И': c.innerHTML = getApprovedApplicationHTML(); break;
        case '3701-И': c.innerHTML = getRejectedApplicationHTML(); break;
        case '3600-И': c.innerHTML = getDraftApplicationHTML(); break;
        default: c.innerHTML = '<div class="detail-empty"><i class="fas fa-file-alt"></i><p>Выберите заявку</p></div>';
    }
}

function getActiveApplicationHTML() {
    return `<div class="detail-header"><div><div class="detail-number">№4421-И</div><div class="detail-product">Кредит под залог недвижимости</div></div><div class="detail-date">Создана: 15 июня 2026</div></div>
    <div class="mini-stepper"><div class="mini-step done"><div class="dot"></div>Параметры</div><div class="mini-step-sep"></div><div class="mini-step done"><div class="dot"></div>Данные</div><div class="mini-step-sep"></div><div class="mini-step current"><div class="dot"></div>Оценка</div><div class="mini-step-sep"></div><div class="mini-step"><div class="dot"></div>Прескоринг</div><div class="mini-step-sep"></div><div class="mini-step"><div class="dot"></div>Решение</div></div>
    <div class="detail-params"><div class="detail-param"><div class="param-label">Сумма</div><div class="param-value">5 000 000 ₽</div></div><div class="detail-param"><div class="param-label">Срок</div><div class="param-value">15 лет</div></div></div>
    <div class="action-list"><h4>Необходимые действия</h4><div class="action-item"><i class="fas fa-file-upload"></i><span>Загрузите справку 2-НДФЛ</span><button class="action-btn">Загрузить</button></div></div>
    <button class="btn btn-primary" onclick="openConveyorFromApplications()">Продолжить оформление</button>`;
}

function getApprovedApplicationHTML() {
    return `<div class="detail-header"><div><div class="detail-number">№3890-И</div><div class="detail-product">Кредит под залог недвижимости</div></div><div class="detail-date">Одобрена: 10 февраля 2026</div></div>
    <div class="approved-badge"><i class="fas fa-check-circle"></i> Кредит одобрен</div>
    <div class="detail-params"><div class="detail-param"><div class="param-label">Одобренный лимит</div><div class="param-value">4 200 000 ₽</div></div><div class="detail-param"><div class="param-label">Ставка</div><div class="param-value" style="color:#10b981;">12.8%</div></div><div class="detail-param"><div class="param-label">Срок</div><div class="param-value">15 лет</div></div><div class="detail-param"><div class="param-label">Платёж / мес.</div><div class="param-value">~ 48 300 ₽</div></div></div>
    <div class="payment-schedule"><h4><i class="fas fa-table"></i> График платежей</h4><table class="schedule-table"><thead><tr><th>Месяц</th><th>Платёж</th><th>Осн. долг</th><th>Проценты</th><th>Остаток</th></tr></thead><tbody><tr><td>Март 2026</td><td>48 300 ₽</td><td>12 100 ₽</td><td>36 200 ₽</td><td>4 187 900 ₽</td></tr><tr><td>Апрель 2026</td><td>48 300 ₽</td><td>12 300 ₽</td><td>36 000 ₽</td><td>4 175 600 ₽</td></tr><tr><td>Май 2026</td><td>48 300 ₽</td><td>12 500 ₽</td><td>35 800 ₽</td><td>4 163 100 ₽</td></tr></tbody></table></div>
    <div style="display:flex;gap:12px;margin-top:24px;"><button class="btn btn-primary" style="flex:1;" onclick="alert('Переход к подписанию договора...')"><i class="fas fa-signature" style="margin-right:8px;"></i> Подписать договор</button><button class="btn-sm" style="width:auto;padding:18px 24px;border:1px solid #cbd5e1;background:white;" onclick="alert('Открывается полный график платежей...')"><i class="fas fa-download"></i></button></div>`;
}

function getRejectedApplicationHTML() {
    return `<div class="detail-header"><div><div class="detail-number">№3701-И</div><div class="detail-product">Кредит под залог недвижимости</div></div></div>
    <div class="rejection-reason"><h4><i class="fas fa-times-circle"></i> Причина отказа</h4><p>Недостаточный уровень подтверждённого дохода.</p></div>
    <button class="btn btn-primary" onclick="navigateTo('applications');selectApplication('4421-И');">Подать новую заявку</button>`;
}

function getDraftApplicationHTML() {
    return `<div class="detail-header"><div><div class="detail-number">№3600-И</div><div class="detail-product">Кредит под залог недвижимости</div></div></div>
    <div class="detail-params"><div class="detail-param"><div class="param-label">Сумма</div><div class="param-value">3 000 000 ₽</div></div><div class="detail-param"><div class="param-label">Статус</div><div class="param-value" style="color:#f59e0b;">Черновик</div></div></div>
    <button class="btn btn-primary" onclick="openConveyorFromApplications()">Продолжить заполнение</button>`;
}