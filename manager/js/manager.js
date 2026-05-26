// ========== ТОЧКА ВХОДА МЕНЕДЖЕРА ==========

function refreshData() {
    if (typeof getAllApplications === 'function') {
        managerApplications = getAllApplications();
    }
    if (typeof getAllClients === 'function') {
        clients = getAllClients();
    }
}

function bindEvents() {
    var tabs = document.querySelectorAll('.m-tab');
    if (tabs.length > 0) {
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                var tabName = '';
                if (this.textContent.includes('Все заявки')) tabName = 'applications';
                else if (this.textContent.includes('Клиенты')) tabName = 'clients';
                else if (this.textContent.includes('Чат')) tabName = 'chat';
                else if (this.textContent.includes('Отчёты')) tabName = 'reports';
                if (tabName && typeof switchManagerTab === 'function') switchManagerTab(tabName);
            });
        });
    }
    
    var filterStatus = document.getElementById('filterStatus');
    var filterSearch = document.getElementById('filterSearch');
    if (filterStatus && typeof filterApplications === 'function') {
        filterStatus.addEventListener('change', filterApplications);
    }
    if (filterSearch && typeof filterApplications === 'function') {
        filterSearch.addEventListener('input', filterApplications);
    }
}