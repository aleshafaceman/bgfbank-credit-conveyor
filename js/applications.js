// ========== МОИ ЗАЯВКИ (КЛИЕНТ) ==========

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

function renderApplicationPackageBlock(app) {
    if (!app) return '';

    const pkgId = app.selectedPackageId || app.preApprovedPackageId || (app.id === '4421-И' ? 'PKG_RECOMMENDED' : null);
    const catalog = typeof getPackageCatalogInfo === 'function' ? getPackageCatalogInfo(pkgId) : null;
    if (!catalog && !app.selectedPackageLabel) return '';

    const isAccepted = app.packageStatus === 'accepted' || (app.selectedPackageId && app.rate != null && app.payment != null);
    const statusBadge = isAccepted
        ? '<span class="pkg-status-badge pkg-status-badge--accepted"><i class="fas fa-check-circle"></i></span>'
        : '<span class="pkg-status-badge pkg-status-badge--proposed"><i class="fas fa-info-circle"></i> Предварительное предложение · выберите в конвейере</span>';

    const title = catalog ? catalog.title : app.selectedPackageLabel;
    const description = catalog ? catalog.description : 'Пакет условий по результатам прескоринга. Подтвердите или измените вариант при оформлении заявки.';

    const rateStr = app.rate != null ? app.rate + '% годовых' : 'от 12,5% (после прескоринга)';
    const paymentStr = app.payment != null ? '~ ' + app.payment.toLocaleString('ru-RU') + ' ₽/мес' : '~ 54 000 ₽/мес (ориентир)';
    const insurance = app.packageInsurance || (catalog ? catalog.insurance : '—');
    const commission = app.packageCommission || (catalog ? catalog.commission : '—');

    const highlights = (catalog && catalog.highlights)
        ? '<ul class="detail-package-highlights">' + catalog.highlights.map(function(h) {
            return '<li><i class="fas fa-check"></i> ' + h + '</li>';
        }).join('') + '</ul>'
        : '';

    const validUntil = app.offerValidUntil
        ? '<p class="param-hint"><i class="fas fa-clock"></i> Срок действия предложения: до <b>' + app.offerValidUntil + '</b></p>'
        : '';

    return `<div class="detail-package-block">
        <div class="detail-package-inner">
            <div class="detail-package-head">
                <div class="param-label">Рекомендуемый пакет условий</div>
                ${statusBadge}
            </div>
            <h4 class="detail-package-title">${title}</h4>
            <p class="detail-package-desc">${description}</p>
            <div class="detail-package-metrics">
                <div class="detail-package-metric"><span>Ставка</span><b>${rateStr}</b></div>
                <div class="detail-package-metric"><span>Платёж</span><b>${paymentStr}</b></div>
                <div class="detail-package-metric"><span>Страхование</span><b>${insurance}</b></div>
                <div class="detail-package-metric"><span>Комиссия</span><b>${commission}</b></div>
            </div>
            ${highlights}
            ${validUntil}
        </div>
    </div>`;
}

function getActiveApplicationHTML() {
    if (typeof loadSharedData === 'function') loadSharedData();
    const app = typeof getAllApplications === 'function' ? getAllApplications().find(a => a.id === '4421-И') : null;
    const amount = app && app.amount ? app.amount.toLocaleString('ru-RU') + ' ₽' : '5 000 000 ₽';
    const term = app && app.term ? app.term + ' ' + (app.term === 1 ? 'год' : app.term < 5 ? 'года' : 'лет') : '15 лет';
    const rate = app && app.rate ? app.rate + '%' : 'ожидается';
    const payment = app && app.payment ? '~ ' + app.payment.toLocaleString('ru-RU') + ' ₽' : '';
    const statusLabel = app ? app.statusLabel : 'В обработке';
    const pkgBlock = renderApplicationPackageBlock(app);

    return `<div class="detail-header">
        <div><div class="detail-number">№4421-И</div><div class="detail-product">Кредит под залог недвижимости</div></div>
        <div class="detail-date">Создана: 15 июня 2026 · ${statusLabel}</div>
    </div>
    <div class="mini-stepper">
        <div class="mini-step done"><div class="dot"></div>Параметры</div><div class="mini-step-sep"></div>
        <div class="mini-step done"><div class="dot"></div>Данные</div><div class="mini-step-sep"></div>
        <div class="mini-step current"><div class="dot"></div>Оценка</div><div class="mini-step-sep"></div>
        <div class="mini-step"><div class="dot"></div>Прескоринг</div><div class="mini-step-sep"></div>
        <div class="mini-step"><div class="dot"></div>Решение</div>
    </div>
    <div class="detail-params">
        <div class="detail-param"><div class="param-label">Сумма</div><div class="param-value">${amount}</div></div>
        <div class="detail-param"><div class="param-label">Срок</div><div class="param-value">${term}</div></div>
        <div class="detail-param"><div class="param-label">Ставка</div><div class="param-value">${rate}</div></div>
        ${payment ? '<div class="detail-param"><div class="param-label">Платёж / мес.</div><div class="param-value">' + payment + '</div></div>' : ''}
    </div>
    ${pkgBlock}
    ${renderClientDUSection({ collateralAddress: 'г. Москва, ул. Крылатская, д. 15, кв. 42' })}
    <div class="action-list">
        <h4><i class="fas fa-exclamation-circle"></i> Необходимые действия</h4>
        <div class="action-item"><i class="fas fa-file-upload"></i><span>Загрузите справку 2-НДФЛ</span><button type="button" class="action-btn">Загрузить</button></div>
    </div>
    <button type="button" class="btn btn-primary app-detail-cta" onclick="openConveyorFromApplications()">Продолжить оформление</button>`;
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

// ========== ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ (ДУ) ДЛЯ КЛИЕНТА ==========

var allDU = [
    { id:'du01', name:'Выписка из Домовой Книги / поквартирной карточки', cat:'object', trigger:'all', source:'external', params:[] },
    { id:'du02', name:'Документы БТИ по объекту недвижимости', cat:'object', trigger:'old_house', source:'external', params:['CadastralNumber'] },
    { id:'du03', name:'Справка из Росреестра о соответствии адресов', cat:'object', trigger:'address_mismatch', source:'external', params:['CadastralNumber'] },
    { id:'du04', name:'Выписка из ЕГРН с документами-основаниями', cat:'object', trigger:'all', source:'external', params:['CadastralNumber'] },
    { id:'du05', name:'Правоустанавливающие документы с отметками', cat:'object', trigger:'new_rights', source:'client', params:['CadastralNumber'] },
    { id:'du06', name:'Свидетельство о рождении детей (иждивенцев)', cat:'client', trigger:'has_children', source:'esia', params:['FIO'] },
    { id:'du07', name:'Документ, подтверждающий смену фамилии', cat:'client', trigger:'name_changed', source:'esia', params:['FIO'] },
    { id:'du08', name:'Свидетельство о смерти супруга(и) продавца', cat:'seller', trigger:'seller_widowed', source:'esia', params:['FIO'] },
    { id:'du09', name:'Предоставить ИНН', cat:'client', trigger:'all', source:'esia', params:['FIO'] },
    { id:'du10', name:'Предоставить СНИЛС', cat:'client', trigger:'all', source:'esia', params:['FIO'] },
    { id:'du11', name:'Анкета клиента и согласие на обработку ПДн', cat:'client', trigger:'all', source:'client', params:['FIO'] },
    { id:'du12', name:'Паспорт', cat:'client', trigger:'all', source:'esia', params:['FIO'] },
    { id:'du13', name:'Заявление о безбрачии', cat:'client', trigger:'not_married', source:'client', params:['FIO'] },
    { id:'du14', name:'Свидетельство о браке', cat:'client', trigger:'married', source:'esia', params:['FIO'] },
    { id:'du15', name:'Нотариальное согласие супруга(и) на залог', cat:'client', trigger:'married', source:'client', params:['FIO','CadastralNumber'] },
    { id:'du16', name:'Свидетельство о расторжении брака', cat:'client', trigger:'divorced', source:'esia', params:['FIO'] },
    { id:'du17', name:'Согласие органов опеки для несовершеннолетнего', cat:'seller', trigger:'minor_owner', source:'client', params:['CadastralNumber'] },
    { id:'du18', name:'Сертификат на материнский капитал', cat:'client', trigger:'has_children', source:'client', params:['FIO'] },
    { id:'du19', name:'Выписка из ЕГРН об отсутствии ареста/запрета', cat:'object', trigger:'all', source:'external', params:['CadastralNumber'] },
    { id:'du20', name:'Подтверждение действительности паспорта', cat:'client', trigger:'all', source:'esia', params:['FIO'] },
    { id:'du21', name:'Нотариальное согласие супруга на приобретение и залог', cat:'client', trigger:'married', source:'client', params:['FIO','CadastralNumber'] },
    { id:'du22', name:'ЕГРН с единственным обременением в пользу БЖФ', cat:'object', trigger:'mortgage', source:'external', params:['CadastralNumber'] }
];

var duStatuses = {
    pending: { icon:'fa-circle', label:'Ожидает', color:'#94a3b8', bg:'#f1f5f9' },
    auto_received: { icon:'fa-check-circle', label:'Получено (ЕСИА)', color:'#1e40af', bg:'#dbeafe' },
    ext_received: { icon:'fa-check-circle', label:'Получено банком', color:'#5b21b6', bg:'#ede9fe' },
    requested: { icon:'fa-clock', label:'Запрошено', color:'#f59e0b', bg:'#fef3c7' },
    uploaded: { icon:'fa-check-circle', label:'Загружено', color:'#10b981', bg:'#d1fae5' },
    problem: { icon:'fa-exclamation-circle', label:'Проблема', color:'#ef4444', bg:'#fee2e2' }
};

function getRequiredDU(app, clientEsiConnected) {
    var required = [];
    var alwaysRequired = ['du01','du04','du09','du10','du11','du12','du19','du20'];
    
    allDU.forEach(function(du) {
        var needed = false;
        
        if (alwaysRequired.indexOf(du.id) !== -1) needed = true;
        else if (du.trigger === 'married') needed = true;
        else if (du.trigger === 'has_children') needed = true;
        else if (du.trigger === 'mortgage') needed = true;
        
        if (needed) {
            var status = 'pending';
            if (du.source === 'esia' && clientEsiConnected) {
                status = 'auto_received';
            }
            
            required.push({
                id: du.id,
                name: du.name,
                cat: du.cat,
                source: du.source,
                status: status,
                params: du.params.map(function(p) {
                    if (p === 'FIO') return 'Александр Кузнецов';
                    if (p === 'CadastralNumber') return app.collateralAddress || '77:07:0001075:1234';
                    return '';
                })
            });
        }
    });
    
    return required;
}

function renderClientDUSection(app) {
    var duList = getRequiredDU(app, true);
    var counts = {
        total: duList.length,
        auto: duList.filter(function(d){return d.status==='auto_received';}).length,
        need: duList.filter(function(d){return d.status!=='auto_received';}).length
    };
    
    var h = '<div class="app-detail-section app-detail-du">';
    h += '<h3 class="app-detail-section-title"><i class="fas fa-clipboard-list"></i> Дополнительные документы</h3>';
    h += '<p class="section-desc">Документы, необходимые для завершения рассмотрения заявки</p>';

    h += '<div class="du-summary-row">';
    h += '<div class="du-summary-chip du-summary-chip--esia"><i class="fas fa-shield-alt"></i> Получено через Госуслуги: <b>' + counts.auto + '</b></div>';
    if (counts.need > 0) {
        h += '<div class="du-summary-chip du-summary-chip--pending"><i class="fas fa-upload"></i> Требуется загрузить: <b>' + counts.need + '</b></div>';
    }
    h += '</div>';

    var clientDUs = duList.filter(function(d) { return d.source === 'client' || d.status === 'uploaded'; });

    clientDUs.forEach(function(du) {
        var st = duStatuses[du.status];
        var isDone = du.status === 'uploaded' || du.status === 'auto_received';

        h += '<div class="client-du-item' + (isDone ? ' client-du-item--done' : ' client-du-item--pending') + '">';
        h += '<i class="fas ' + st.icon + ' client-du-icon"></i>';
        h += '<div class="client-du-body">';
        h += '<div class="client-du-name">' + du.name + '</div>';
        if (du.params.length > 0) {
            h += '<div class="client-du-meta">' + du.params.join(' · ') + '</div>';
        }
        h += '<span class="client-du-status" style="background:' + st.bg + ';color:' + st.color + ';">' + st.label + '</span>';
        h += '</div>';
        if (!isDone && du.source === 'client') {
            h += '<button type="button" class="client-du-upload" onclick="alert(\'Открывается форма загрузки: ' + du.name.replace(/'/g, "\\'") + '\')"><i class="fas fa-upload"></i> Загрузить</button>';
        }
        h += '</div>';
    });

    h += '</div>';
    return h;
}