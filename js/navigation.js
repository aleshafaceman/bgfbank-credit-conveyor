// ========== НАВИГАЦИЯ ==========
// Переключение разделов личного кабинета

function navigateTo(page) {
    state.currentPage = page;
    
    // Скрываем все разделы
    ['view-conveyor','view-applications','view-dashboard','view-mortgage','view-profile','view-settings']
        .forEach(id => document.getElementById(id).classList.add('hidden'));
    
    // Снимаем активность со всех пунктов меню
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    const idx = { dashboard: 0, applications: 1, mortgage: 2, profile: 3, settings: 4 };
    
    switch(page) {
        case 'dashboard':
            document.getElementById('view-dashboard').classList.remove('hidden');
            document.getElementById('pageTitle').innerText = 'Панель управления';
            document.getElementById('pageSubtitle').innerText = 'Сводка по вашим активностям';
            break;
        case 'applications':
            document.getElementById('view-applications').classList.remove('hidden');
            document.getElementById('pageTitle').innerText = 'Мои заявки';
            document.getElementById('pageSubtitle').innerText = 'Управление заявками';
            selectApplication(state.selectedApp);
            break;
        case 'mortgage':
            document.getElementById('view-mortgage').classList.remove('hidden');
            document.getElementById('pageTitle').innerText = 'Ипотека';
            document.getElementById('pageSubtitle').innerText = 'Ипотечное кредитование';
            break;
        case 'profile':
            document.getElementById('view-profile').classList.remove('hidden');
            document.getElementById('pageTitle').innerText = 'Профиль';
            document.getElementById('pageSubtitle').innerText = 'Моя недвижимость · Личные данные · Доходы · Сервисы';
            switchProfileTab('property');
            renderPropertyGrid();
            break;
        case 'settings':
            document.getElementById('view-settings').classList.remove('hidden');
            document.getElementById('pageTitle').innerText = 'Настройки';
            document.getElementById('pageSubtitle').innerText = 'Безопасность · Уведомления · Согласия';
            break;
    }
    
    if (idx[page] !== undefined) {
        document.querySelectorAll('.nav-link')[idx[page]].classList.add('active');
    }
}

function switchProfileTab(tab) {
    ['profile-tab-property','profile-tab-personal','profile-tab-income','profile-tab-services']
        .forEach(id => document.getElementById(id).classList.add('hidden'));
    
    document.getElementById('profile-tab-' + tab).classList.remove('hidden');
    
    document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
    const labels = { property: 'Моя недвижимость', personal: 'Личные данные', income: 'Доходы', services: 'Сервисы' };
    document.querySelectorAll('.profile-tab').forEach(t => {
        if (t.textContent.includes(labels[tab])) t.classList.add('active');
    });
}

function switchSettingsTab(tab) {
    document.getElementById('settings-tab-notifications').classList.add('hidden');
    document.getElementById('settings-tab-security').classList.add('hidden');
    document.getElementById('settings-tab-consents').classList.add('hidden');
    
    document.getElementById('settings-tab-' + tab).classList.remove('hidden');
    
    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
    const labels = { notifications: 'Уведомления', security: 'Безопасность', consents: 'Согласия' };
    document.querySelectorAll('.settings-tab').forEach(t => {
        if (t.textContent.includes(labels[tab])) t.classList.add('active');
    });
    
    if (tab === 'security') {
        setTimeout(init2FAToggle, 100);
    }
}