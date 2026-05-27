// ========== ОТЧЁТЫ ==========

function renderReportsTab() {
    refreshData();
    const total = managerApplications.length;
    const approved = managerApplications.filter(a => a.status === 'approved').length;
    const rejected = managerApplications.filter(a => a.status === 'rejected').length;
    const inProgress = total - approved - rejected;
    const avgAmount = Math.round(managerApplications.reduce((s, a) => s + a.amount, 0) / total);
    
    document.getElementById('m-tab-reports').innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-bottom:30px;">
            <div class="m-app-detail" style="text-align:center;"><div style="font-size:48px;font-weight:800;color:#003b6f;">${total}</div><div style="font-size:14px;color:#7e9bb6;">Всего заявок</div></div>
            <div class="m-app-detail" style="text-align:center;"><div style="font-size:48px;font-weight:800;color:#10b981;">${approved}</div><div style="font-size:14px;color:#7e9bb6;">Одобрено</div></div>
            <div class="m-app-detail" style="text-align:center;"><div style="font-size:48px;font-weight:800;color:#ef4444;">${rejected}</div><div style="font-size:14px;color:#7e9bb6;">Отклонено</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;">
            <div class="m-app-detail" style="text-align:center;"><div style="font-size:36px;font-weight:800;color:#f59e0b;">${inProgress}</div><div style="font-size:14px;color:#7e9bb6;">В обработке</div></div>
            <div class="m-app-detail" style="text-align:center;"><div style="font-size:28px;font-weight:800;color:#003b6f;">${avgAmount.toLocaleString('ru-RU')} ₽</div><div style="font-size:14px;color:#7e9bb6;">Средняя сумма</div></div>
            <div class="m-app-detail" style="text-align:center;"><div style="font-size:28px;font-weight:800;color:#003b6f;">2.5 дня</div><div style="font-size:14px;color:#7e9bb6;">Среднее время</div></div>
        </div>
    `;
}