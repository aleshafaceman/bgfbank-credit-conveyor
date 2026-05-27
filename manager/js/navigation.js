// ========== НАВИГАЦИЯ МЕНЕДЖЕРА ==========

function switchManagerTab(tab) {
    refreshData();
    
    document.querySelectorAll('.m-tab').forEach(function(t) { t.classList.remove('active'); });
    var labels = { applications: 'Все заявки', clients: 'Клиенты', chat: 'Чат с клиентами', reports: 'Отчёты' };
    document.querySelectorAll('.m-tab').forEach(function(t) {
        if (t.textContent.includes(labels[tab])) t.classList.add('active');
    });
    
    document.getElementById('m-tab-applications').classList.add('hidden');
    document.getElementById('m-tab-clients').classList.add('hidden');
    document.getElementById('m-tab-chat').classList.add('hidden');
    document.getElementById('m-tab-reports').classList.add('hidden');
    document.getElementById('m-tab-' + tab).classList.remove('hidden');
    
    if (tab === 'applications') { renderApplicationList(); selectManagerApp(selectedAppId); }
    if (tab === 'clients') renderClientsTab();
    if (tab === 'chat') renderChatTab();
    if (tab === 'reports') renderReportsTab();
}