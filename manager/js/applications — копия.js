// ========== ЗАЯВКИ: СПИСОК И ДЕТАЛИ ==========

let managerApplications = [];
let selectedAppId = '4421-И';

function refreshData() {
    if (typeof getAllApplications === 'function') {
        managerApplications = getAllApplications();
    }
    if (typeof getAllClients === 'function') {
        clients = getAllClients();
    }
}

function renderApplicationList(filteredApps) {
    const apps = filteredApps || managerApplications;
    const container = document.getElementById('mAppCards');
    if (!container) return;
    
    const statusClasses = {
        new: 'badge-new', processing: 'badge-processing', valuation: 'badge-valuation',
        decision: 'badge-decision', approved: 'badge-approved', rejected: 'badge-rejected'
    };
    
    container.innerHTML = apps.map(app => `
        <div class="m-app-card ${app.id === selectedAppId ? 'active' : ''}" data-app-id="${app.id}" onclick="selectManagerApp('${app.id}')">
            <div class="m-card-row">
                <span class="m-card-id">№${app.id}</span>
                <span class="m-card-date">${app.date}</span>
            </div>
            <div class="m-card-client">${app.client}</div>
            <div class="m-card-bottom">
                <span class="m-card-amount">${app.amount.toLocaleString('ru-RU')} ₽</span>
                <span class="m-badge ${statusClasses[app.status] || 'badge-new'}">${app.statusLabel}</span>
            </div>
        </div>
    `).join('');
}

function filterApplications() {
    refreshData();
    const status = document.getElementById('filterStatus').value;
    const search = document.getElementById('filterSearch').value.toLowerCase();
    let filtered = managerApplications;
    if (status !== 'all') filtered = filtered.filter(a => a.status === status);
    if (search) filtered = filtered.filter(a =>
        a.id.toLowerCase().includes(search) ||
        a.client.toLowerCase().includes(search) ||
        a.collateralAddress.toLowerCase().includes(search)
    );
    renderApplicationList(filtered);
}

function selectManagerApp(appId) {
    refreshData();
    selectedAppId = appId;
    document.querySelectorAll('.m-app-card').forEach(c => {
        c.classList.remove('active');
        if (c.getAttribute('data-app-id') === appId) c.classList.add('active');
    });
    closeClientCard();
}

function renderApplicationDetail(appId) {
    refreshData();
    const app = managerApplications.find(a => a.id === appId);
    if (!app) return;
    
    const container = document.getElementById('mAppDetail');
    const statusClasses = {
        new: 'badge-new', processing: 'badge-processing', valuation: 'badge-valuation',
        decision: 'badge-decision', approved: 'badge-approved', rejected: 'badge-rejected'
    };
    
    const unreadCount = getUnreadCount(app.client);
    const unreadBadge = unreadCount > 0
        ? `<span style="background:#ef4444;color:white;font-size:10px;padding:2px 6px;border-radius:8px;margin-left:6px;">${unreadCount}</span>`
        : '';
    
    container.innerHTML = `
        <div class="m-detail-header">
            <div>
                <div class="m-detail-id">№${app.id}</div>
                <div class="m-detail-product">${app.product}</div>
            </div>
            <span class="m-badge ${statusClasses[app.status] || 'badge-new'}">${app.statusLabel}</span>
        </div>
        <div class="m-detail-client" style="cursor:pointer;color:#003b6f;" onclick="openClientCard('${app.client.replace(/'/g, "\\'")}')">
            ${app.client} <i class="fas fa-external-link-alt" style="font-size:10px;opacity:0.5;"></i>
        </div>
        <div class="m-detail-phone"><i class="fas fa-phone" style="margin-right:4px;"></i> ${app.phone}</div>
        
        <div class="m-detail-params" style="margin-top:20px;">
            <div class="m-detail-param"><div class="m-param-label">Сумма кредита</div><div class="m-param-value">${app.amount.toLocaleString('ru-RU')} ₽</div></div>
            <div class="m-detail-param"><div class="m-param-label">Срок</div><div class="m-param-value">${app.term} лет</div></div>
            <div class="m-detail-param"><div class="m-param-label">Ставка</div><div class="m-param-value ${app.rate ? '' : 'pending'}">${app.rate ? app.rate + '%' : 'ожидается'}</div></div>
            <div class="m-detail-param"><div class="m-param-label">Платёж / мес.</div><div class="m-param-value ${app.payment ? '' : 'pending'}">${app.payment ? '~ ' + app.payment.toLocaleString('ru-RU') + ' ₽' : 'ожидается'}</div></div>
        </div>
        
        <div class="m-section">
            <h4><i class="fas fa-home"></i> Объект залога</h4>
            <div class="m-detail-param"><div class="m-param-label">Адрес</div><div class="m-param-value" style="font-size:13px;">${app.collateralAddress}</div></div>
            <div class="m-detail-param" style="margin-top:8px;"><div class="m-param-label">Оценка Ocenka.mobi</div><div class="m-param-value">${app.collateralValue.toLocaleString('ru-RU')} ₽</div></div>
        </div>
        
        <div class="m-section">
            <h4><i class="fas fa-file-alt"></i> Документы клиента</h4>
            <div class="m-doc-list">
                ${app.documents.map(d => `
                    <div class="m-doc-item">
                        <i class="fas ${d.status === 'uploaded' ? 'fa-check-circle' : 'fa-times-circle'}" style="color:${d.status === 'uploaded' ? '#10b981' : '#ef4444'};"></i>
                        <span class="doc-name">${d.name}</span>
                        <span class="doc-status ${d.status === 'uploaded' ? 'doc-uploaded' : 'doc-missing'}">${d.statusLabel}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="m-section">
            <h4><i class="fas fa-history"></i> История заявки</h4>
            <div class="m-history">
                ${app.history.map(h => `
                    <div class="m-history-item ${h.current ? 'current' : ''}">
                        <div style="font-weight:${h.current ? '600' : '400'};color:${h.current ? '#1e293b' : '#64748b'};">${h.text}</div>
                        <div class="m-history-date">${h.date}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${renderDUSection(app)}
        
        <div class="m-actions">
            ${getActionButtons(app)}
            <button class="m-btn m-btn-outline" onclick="switchManagerTab('clients'); setTimeout(function(){ openClientProfile('${app.client.replace(/'/g, "\\'")}'); }, 200);">
                <i class="fas fa-user"></i> Профиль клиента
            </button>
            <button class="m-btn m-btn-outline" onclick="switchManagerTab('chat'); openChatWithClient('${app.client.replace(/'/g, "\\'")}')">
                <i class="fas fa-comment-dots"></i> Чат ${unreadBadge}
            </button>
        </div>
    `;
}

function getActionButtons(app) {
    switch(app.status) {
        case 'new':
            return `<button class="m-btn m-btn-primary" onclick="managerAction('${app.id}','requestDocs')"><i class="fas fa-file-upload"></i> Запросить документы</button>
                    <button class="m-btn m-btn-outline" onclick="managerAction('${app.id}','startReview')"><i class="fas fa-play"></i> Начать рассмотрение</button>`;
        case 'processing':
            return `<button class="m-btn m-btn-warning" onclick="managerAction('${app.id}','startScoring')"><i class="fas fa-robot"></i> Запустить прескоринг</button>
                    <button class="m-btn m-btn-outline" onclick="managerAction('${app.id}','requestDocs')"><i class="fas fa-file-upload"></i> Запросить документы</button>`;
        case 'valuation':
            return `<button class="m-btn m-btn-warning" onclick="managerAction('${app.id}','requestValuation')"><i class="fas fa-home"></i> Запросить оценку</button>
                    <button class="m-btn m-btn-outline" onclick="managerAction('${app.id}','requestDocs')"><i class="fas fa-file-upload"></i> Запросить документы</button>`;
        case 'decision':
            return `<button class="m-btn m-btn-success" onclick="managerAction('${app.id}','approve')"><i class="fas fa-check"></i> Одобрить</button>
                    <button class="m-btn m-btn-danger" onclick="managerAction('${app.id}','reject')"><i class="fas fa-times"></i> Отклонить</button>`;
        case 'approved':
            return `<button class="m-btn m-btn-outline" onclick="alert('Договор отправлен клиенту')"><i class="fas fa-signature"></i> Отправить договор</button>`;
        case 'rejected':
            return `<button class="m-btn m-btn-outline" onclick="alert('Клиент уведомлён')"><i class="fas fa-redo"></i> Предложить изменить параметры</button>`;
        default: return '';
    }
}

// ========== ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ (ДУ) ==========

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

var duCategories = { client:'Заёмщик', object:'Объект недвижимости', seller:'Продавец' };

var duSources = {
    esia: { icon:'fa-shield-alt', label:'Госуслуги', color:'#1e40af', bg:'#dbeafe' },
    external: { icon:'fa-building', label:'Внешний запрос', color:'#5b21b6', bg:'#ede9fe' },
    client: { icon:'fa-user', label:'Загрузка клиента', color:'#92400e', bg:'#fef3c7' }
};

var duStatuses = {
    pending: { icon:'fa-circle', label:'Ожидает', color:'#94a3b8', bg:'#f1f5f9' },
    auto_received: { icon:'fa-check-circle', label:'Получено (ЕСИА)', color:'#1e40af', bg:'#dbeafe' },
    ext_received: { icon:'fa-check-circle', label:'Получено (сервис)', color:'#5b21b6', bg:'#ede9fe' },
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

function renderDUSection(app) {
    var duList = getRequiredDU(app, true);
    var counts = {
        total: duList.length,
        auto: duList.filter(function(d){return d.status==='auto_received';}).length,
        need: duList.filter(function(d){return d.status!=='auto_received';}).length
    };
    
    var h = '<div class="m-section" style="margin-top:20px;">';
    h += '<h4><i class="fas fa-clipboard-list"></i> Дополнительные условия (' + duList.length + ')</h4>';
    
    h += '<div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;">';
    h += '<div style="padding:8px 14px;background:#dbeafe;border-radius:10px;font-size:12px;"><i class="fas fa-shield-alt" style="color:#1e40af;"></i> Через Госуслуги: <b>' + counts.auto + ' получено</b></div>';
    h += '<div style="padding:8px 14px;background:#fef3c7;border-radius:10px;font-size:12px;"><i class="fas fa-clock" style="color:#f59e0b;"></i> Требуется: <b>' + counts.need + ' док.</b></div>';
    h += '</div>';
    
    Object.keys(duCategories).forEach(function(cat) {
        var items = duList.filter(function(d) { return d.cat === cat; });
        if (items.length === 0) return;
        
        h += '<div style="margin-bottom:14px;">';
        h += '<div style="font-weight:700;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">' + duCategories[cat] + ' (' + items.length + ')</div>';
        
        items.forEach(function(du) {
            var src = duSources[du.source];
            var st = duStatuses[du.status];
            
            h += '<div class="m-doc-item" style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:12px;">';
            h += '<i class="fas ' + st.icon + '" style="color:' + st.color + ';margin-top:2px;font-size:14px;"></i>';
            h += '<div style="flex:1;">';
            h += '<div style="font-weight:600;color:#1e293b;">' + du.name + '</div>';
            if (du.params.length > 0) {
                h += '<div style="font-size:10px;color:#94a3b8;margin-top:2px;">' + du.params.join(' · ') + '</div>';
            }
            h += '<div style="display:flex;gap:6px;margin-top:4px;">';
            h += '<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:' + src.bg + ';color:' + src.color + ';"><i class="fas ' + src.icon + '"></i> ' + src.label + '</span>';
            h += '<span style="font-size:9px;padding:2px 6px;border-radius:4px;background:' + st.bg + ';color:' + st.color + ';">' + st.label + '</span>';
            h += '</div></div>';
            
            if (du.status === 'pending') {
                if (du.source === 'external') {
                    h += '<button class="m-btn m-btn-outline" style="padding:4px 10px;font-size:10px;" onclick="alert(\'Запрос в ' + du.name + ' отправлен\')"><i class="fas fa-building"></i> Запросить</button>';
                } else if (du.source === 'client') {
                    h += '<button class="m-btn m-btn-outline" style="padding:4px 10px;font-size:10px;" onclick="alert(\'Клиенту отправлен запрос: ' + du.name + '\')"><i class="fas fa-user"></i> Запросить</button>';
                }
            }
            h += '</div>';
        });
        h += '</div>';
    });
    
    h += '<div style="display:flex;gap:8px;margin-top:12px;">';
    h += '<button class="m-btn m-btn-primary" style="flex:1;padding:10px;font-size:12px;" onclick="alert(\'Запросы отправлены.\\n\\nВнешние запросы: Росреестр, БТИ\\nКлиенту: запрос на загрузку документов\')"><i class="fas fa-paper-plane"></i> Запросить все недостающие ДУ</button>';
    h += '<button class="m-btn m-btn-outline" style="flex:1;padding:10px;font-size:12px;" onclick="alert(\'Открывается выбор отдельных ДУ...\')"><i class="fas fa-list-check"></i> Выбрать отдельно</button>';
    h += '</div>';
    
    h += '</div>';
    return h;
}