// ========== КАРТОЧКА КЛИЕНТА ==========
let clients = {};

function buildClients() {
    clients = getAllClients();
}

function openClientCard(clientName) {
    clients = getAllClients();
    const client = clients[clientName];
    if (!client) return;
    
    document.getElementById('mAppDetail').classList.add('hidden');
    document.getElementById('mClientDetail').classList.remove('hidden');
    
    const allDocs = [...new Set(client.applications.flatMap(a => a.documents.map(d => d.name)))];
    const docsSummary = allDocs.map(docName => ({
        name: docName,
        uploaded: client.applications.some(a => a.documents.find(d => d.name === docName && d.status === 'uploaded'))
    }));
    
    const interactions = client.applications
        .flatMap(a => a.history.map(h => ({ ...h, appId: a.id })))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 10);
    
    document.getElementById('mClientDetail').innerHTML = `
        <div class="m-back-link" onclick="closeClientCard()"><i class="fas fa-arrow-left"></i> Вернуться к заявке</div>
        <div class="m-client-header">
            <div class="m-client-avatar">${client.name.split(' ').map(w => w[0]).join('')}</div>
            <div>
                <div class="m-client-name">${client.name}</div>
                <div class="m-client-id">${client.applications.length} заявок</div>
            </div>
        </div>
        
        <div class="m-client-section">
            <h4><i class="fas fa-id-card"></i> Личные данные</h4>
            <div class="m-info-grid">
                <div class="m-info-item"><div class="m-info-label">Телефон</div><div class="m-info-value">${client.phone}</div></div>
                <div class="m-info-item"><div class="m-info-label">Email</div><div class="m-info-value">${client.email}</div></div>
                <div class="m-info-item"><div class="m-info-label">Дата рождения</div><div class="m-info-value">${client.birthDate}</div></div>
                <div class="m-info-item"><div class="m-info-label">Паспорт</div><div class="m-info-value">${client.passport}</div></div>
                <div class="m-info-item"><div class="m-info-label">Адрес</div><div class="m-info-value" style="font-size:12px;">${client.address}</div></div>
                <div class="m-info-item"><div class="m-info-label">Источник</div><div class="m-info-value">${client.source === 'esia' ? 'Госуслуги (ЕСИА)' : 'Ручной ввод'}</div></div>
            </div>
        </div>
        
        <div class="m-client-section">
            <h4><i class="fas fa-briefcase"></i> Финансовый профиль</h4>
            <div class="m-info-grid">
                <div class="m-info-item"><div class="m-info-label">Место работы</div><div class="m-info-value">${client.workplace}</div></div>
                <div class="m-info-item"><div class="m-info-label">Должность</div><div class="m-info-value">${client.position}</div></div>
                <div class="m-info-item"><div class="m-info-label">Доход</div><div class="m-info-value">${client.income.toLocaleString('ru-RU')} ₽</div></div>
                <div class="m-info-item"><div class="m-info-label">Стаж</div><div class="m-info-value">${client.experience === '3-5' ? '3-5 лет' : client.experience}</div></div>
            </div>
        </div>
        
        <div class="m-client-section">
            <h4><i class="fas fa-file-signature"></i> Заявки (${client.applications.length})</h4>
            ${client.applications.map(a => `
                <div class="m-client-app-card" onclick="closeClientCard();selectManagerApp('${a.id}')">
                    <div class="m-app-info">
                        <div class="m-app-number">№${a.id}</div>
                        <div class="m-app-meta">${a.date} · ${a.amount.toLocaleString('ru-RU')} ₽</div>
                    </div>
                    <span class="m-badge badge-${a.status}">${a.statusLabel}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="m-client-section">
            <h4><i class="fas fa-home"></i> Недвижимость (${client.properties.length})</h4>
            ${client.properties.map(p => `
                <div class="m-info-item" style="margin-bottom:6px;">
                    <div class="m-info-label">${p.type} · ${p.area} м²</div>
                    <div class="m-info-value" style="font-size:12px;">${p.address}</div>
                    ${p.valuation ? `<div style="font-size:12px;color:#10b981;margin-top:2px;">💰 ${p.valuation.toLocaleString('ru-RU')} ₽</div>` : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="m-client-section">
            <h4><i class="fas fa-file-alt"></i> Документы</h4>
            ${docsSummary.map(d => `
                <div class="m-doc-item">
                    <i class="fas ${d.uploaded ? 'fa-check-circle' : 'fa-times-circle'}" style="color:${d.uploaded ? '#10b981' : '#ef4444'};"></i>
                    <span class="doc-name">${d.name}</span>
                    <span class="doc-status ${d.uploaded ? 'doc-uploaded' : 'doc-missing'}">${d.uploaded ? 'Загружен' : 'Отсутствует'}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="m-client-section">
            <h4><i class="fas fa-history"></i> История взаимодействий</h4>
            <div class="m-history">
                ${interactions.map(h => `
                    <div class="m-history-item">
                        <div>${h.text} <span style="color:#94a3b8;font-size:10px;">(№${h.appId})</span></div>
                        <div class="m-history-date">${h.date}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="m-actions">
            <button class="m-btn m-btn-outline" onclick="switchManagerTab('chat'); openChatWithClient('${client.name.replace(/'/g, "\\'")}')">
                <i class="fas fa-comment-dots"></i> Открыть чат с клиентом
            </button>
        </div>
    `;
}

function closeClientCard() {
    refreshData();
    document.getElementById('mClientDetail').classList.add('hidden');
    document.getElementById('mAppDetail').classList.remove('hidden');
    renderApplicationDetail(selectedAppId);
}