// ========== ПОЛНЫЙ СКОРИНГ (МЕНЕДЖЕР) ==========

var sSteps = [
    { name: 'Кредитная история (НБКИ)', source: 'НБКИ', time: '1.2 сек', detail_ok: 'Рейтинг: 720. Просрочек нет. 2 кредита.',
        issues: [{ type:'warning', title:'КИ не найдена', desc:'В НБКИ нет данных.', detail:'Рекомендация: продолжить с пометкой.', actions:['Продолжить','Отклонить'], prob:8 },
                 { type:'error', title:'Просрочки > 90 дней', desc:'Обнаружены просрочки > 90 дней.', detail:'Стоп-фактор.', actions:['Отклонить','Запросить объяснение'], prob:8 }] },
    { name: 'Кредитная история (ОКБ)', source: 'ОКБ', time: '0.8 сек', detail_ok: 'Данные совпадают.', issues:[] },
    { name: 'Верификация дохода (ФНС)', source: 'ФНС', time: '2.1 сек', detail_ok: 'Доход: 180 000 ₽/мес.',
        issues: [{ type:'error', title:'Доход не подтверждён', desc:'ФНС не подтвердила доход.', detail:'Заявленный: 180 000 ₽\nПодтверждённый: отсутствует', actions:['Запросить 2-НДФЛ','Отклонить'], prob:12 },
                 { type:'warning', title:'Доход ниже заявленного', desc:'Расхождение 33%.', detail:'Заявленный: 180 000 ₽\nФакт: 120 000 ₽', actions:['Продолжить','Запросить 2-НДФЛ','Отклонить'], prob:18 }] },
    { name: 'Проверка работодателя', source: 'ЕГРЮЛ', time: '1.5 сек', detail_ok: 'ООО «ТехноСофт» действует.',
        issues: [{ type:'warning', title:'Не найден в ЕГРЮЛ', desc:'Организация не найдена.', actions:['Продолжить','Запросить трудовую'], prob:8 },
                 { type:'error', title:'Банкротство', desc:'Организация в стадии банкротства.', actions:['Отклонить','Запросить пояснения'], prob:5 }] },
    { name: 'Оценка недвижимости', source: 'Ocenka.mobi', time: '2.8 сек', detail_ok: 'Стоимость: 8 500 000 ₽.',
        issues: [{ type:'error', title:'Сервис недоступен', desc:'Таймаут Ocenka.mobi.', detail:'Предыдущая оценка: 8 500 000 ₽', actions:['Использовать предыдущую','Повторить'], prob:8 },
                 { type:'error', title:'Объект не найден', desc:'Не определён по адресу.', actions:['Уточнить адрес','Ввести вручную'], prob:8 }] },
    { name: 'Андеррайтинг', source: 'Loginom', time: '3.2 сек', detail_ok: 'PTI: 38%. DTI: 42%.',
        issues: [{ type:'error', title:'PTI > 50%', desc:'Превышен порог PTI.', detail:'PTI: 52%. Максимум: 50%.', actions:['Изменить параметры','Отклонить'], prob:12 },
                 { type:'warning', title:'DTI повышен', desc:'DTI: 58%.', actions:['Продолжить','Запросить доп. информацию'], prob:12 }] },
    { name: 'Расчёт условий', source: 'Внутренний', time: '1.0 сек', detail_ok: 'Ставка: 12.5%. Лимит: 5 400 000 ₽.',
        issues: [{ type:'warning', title:'Ставка повышена', desc:'+0.5% из-за рисков.', detail:'Базовая: 12.0%\nИтоговая: 12.5%', actions:['Принять','Пересмотреть'], prob:15 }] },
    { name: 'Финальное решение', source: 'Внутренний', time: '0.8 сек', detail_ok: 'Решение сформировано.', issues:[] }
];

var sCurrent = 0;
var sTimer = null;
var sIssueLog = [];
var sPendingIssue = null;
var sPaused = false;

function openManagerScoring() {
    document.getElementById('scoringOverlay').classList.remove('hidden');
    sCurrent = 0;
    sIssueLog = [];
    sPaused = false;
    renderSSteps();
    updateSProgress();
    updateSDetail(0);
    document.getElementById('sResultArea').innerHTML = '';
    document.getElementById('sIssueCounters').style.display = 'none';
    document.getElementById('sResultSubtitle').textContent = 'Идёт проверка...';
    
    var delays = [1200, 800, 2100, 1500, 2800, 3200, 1000, 800];
    runSStep(0, delays);
}

function runSStep(idx, delays) {
    if (sPaused) return;
    if (idx >= sSteps.length) {
        sCurrent = sSteps.length;
        renderSSteps();
        updateSProgress();
        showSResult('approved');
        return;
    }
    sCurrent = idx;
    renderSSteps();
    updateSProgress();
    updateSDetail(idx);
    
    var step = sSteps[idx];
    var hasIssue = false;
    
    if (step.issues && step.issues.length > 0) {
        var totalProb = 0;
        step.issues.forEach(function(iss) { totalProb += iss.prob; });
        var roll = Math.random() * 100;
        if (roll < totalProb) {
            var cum = 0;
            for (var i = 0; i < step.issues.length; i++) {
                cum += step.issues[i].prob;
                if (roll < cum) {
                    hasIssue = true;
                    showSIssueModal(step.issues[i], idx, delays);
                    break;
                }
            }
        }
    }
    
    if (!hasIssue) {
        sTimer = setTimeout(function() { runSStep(idx + 1, delays); }, delays[idx]);
    }
}

function renderSSteps() {
    var h = '';
    for (var i = 0; i < sSteps.length; i++) {
        var cls = 'waiting', dotCls = 'waiting', timeText = sSteps[i].time, icon = '';
        if (i < sCurrent) {
            var hasIssue = sIssueLog.find(function(x) { return x.step === i; });
            if (hasIssue) { cls = hasIssue.type === 'error' ? 'error' : 'warn'; dotCls = hasIssue.type === 'error' ? 'error' : 'warn'; icon = hasIssue.type === 'error' ? ' ❌' : ' ⚠️'; }
            else { cls = 'done'; dotCls = 'done'; }
            timeText = '✓ ' + sSteps[i].time;
        } else if (i === sCurrent && !sPaused) { cls = 'active'; dotCls = 'active'; timeText = '...'; }
        
        h += '<div class="s-step ' + cls + '"><div class="s-dot ' + dotCls + '"></div><div class="s-name">' + sSteps[i].name + icon + '</div><div class="s-source">' + sSteps[i].source + '</div><div class="s-time">' + timeText + '</div></div>';
    }
    document.getElementById('sStepList').innerHTML = h;
}

function updateSProgress() {
    var pct = Math.round((sCurrent / sSteps.length) * 100);
    document.getElementById('sProgressFill').style.width = pct + '%';
    document.getElementById('sProgressLabel').textContent = sCurrent + ' из ' + sSteps.length + ' шагов';
}

function updateSDetail(idx) {
    if (idx < sSteps.length) {
        var s = sSteps[idx];
        document.getElementById('sDetailTitle').textContent = s.name + ' (' + s.source + ')';
        document.getElementById('sDetailContent').innerHTML = '<span class="curr">⟳ Выполняется проверка...</span>';
    }
}

function updateSIssueCounters() {
    var warns = sIssueLog.filter(function(x) { return x.type === 'warning'; }).length;
    var errs = sIssueLog.filter(function(x) { return x.type === 'error'; }).length;
    document.getElementById('sWarnCount').textContent = '⚠️ Предупреждений: ' + warns;
    document.getElementById('sErrCount').textContent = '❌ Ошибок: ' + errs;
    document.getElementById('sIssueCounters').style.display = (warns + errs > 0) ? 'flex' : 'none';
}

function showSIssueModal(issue, stepIdx, delays) {
    sPendingIssue = { issue: issue, stepIdx: stepIdx, delays: delays };
    var h = '';
    h += '<h3>' + (issue.type === 'error' ? '❌ Ошибка' : '⚠️ Предупреждение') + ' на шаге ' + (stepIdx + 1) + '</h3>';
    h += '<div class="issue-desc"><b>' + issue.title + '</b></div>';
    h += '<div class="issue-desc">' + issue.desc + '</div>';
    if (issue.detail) {
        h += '<div class="issue-detail">';
        issue.detail.split('\n').forEach(function(line) { h += '<div class="row"><span>' + line + '</span></div>'; });
        h += '</div>';
    }
    h += '<div class="s-btn-row" style="justify-content:flex-end;">';
    issue.actions.forEach(function(action, i) {
        h += '<button class="s-btn ' + (i === 0 ? 's-btn-primary' : 's-btn-outline') + '" onclick="resolveSIssue(' + i + ')">' + action + '</button>';
    });
    h += '</div>';
    
    document.getElementById('sIssueModalContent').innerHTML = h;
    document.getElementById('sIssueModal').classList.remove('hidden');
}

function resolveSIssue(actionIdx) {
    document.getElementById('sIssueModal').classList.add('hidden');
    if (!sPendingIssue) return;
    
    var issue = sPendingIssue.issue;
    var stepIdx = sPendingIssue.stepIdx;
    var delays = sPendingIssue.delays;
    
    sIssueLog.push({ step: stepIdx, stepName: sSteps[stepIdx].name, type: issue.type, title: issue.title, resolved: actionIdx === 0 ? 'Продолжено' : issue.actions[actionIdx] });
    updateSIssueCounters();
    
    if (issue.type === 'error' && actionIdx > 0) {
        showSResult('rejected');
        sPendingIssue = null;
        return;
    }
    
    sPendingIssue = null;
    sTimer = setTimeout(function() { runSStep(stepIdx + 1, delays); }, delays[stepIdx]);
}

function showSResult(outcome) {
    sPaused = true;
    sCurrent = sSteps.length;
    document.getElementById('sProgressFill').style.width = '100%';
    document.getElementById('sProgressLabel').textContent = sSteps.length + ' из ' + sSteps.length + ' шагов';
    document.getElementById('sDetailTitle').textContent = '✅ Проверки завершены';
    document.getElementById('sDetailContent').innerHTML = '<span class="ok">✓ Система завершила обработку.</span>';
    renderSSteps();
    updateSIssueCounters();
    
    var h = '';
    
    if (sIssueLog.length > 0) {
        h += '<div style="margin-bottom:14px;"><div style="font-weight:700;font-size:12px;color:#003b6f;margin-bottom:6px;">📋 Обнаруженные проблемы:</div>';
        sIssueLog.forEach(function(log) {
            h += '<div class="s-alert ' + (log.type === 'error' ? 'error' : 'warn') + '"><h4>' + (log.type === 'error' ? '❌' : '⚠️') + ' ' + log.stepName + '</h4><div>' + log.title + '</div><div style="font-size:10px;margin-top:3px;">Решение: ' + log.resolved + '</div></div>';
        });
        h += '</div>';
    }
    
    if (outcome === 'approved') {
        document.getElementById('sResultSubtitle').textContent = 'Заявка одобрена';
        h += '<div class="s-result approved"><div class="r-icon">✅</div><div class="r-title" style="color:#065f46;">Кредит одобрен</div><div class="r-desc">Все проверки пройдены.</div><div class="r-params"><div class="r-param"><div class="r-label">Лимит</div><div class="r-value" style="color:#003b6f;">5 400 000 ₽</div></div><div class="r-param"><div class="r-label">Ставка</div><div class="r-value" style="color:#10b981;">12.5%</div></div><div class="r-param"><div class="r-label">Срок</div><div class="r-value">15 лет</div></div><div class="r-param"><div class="r-label">Платёж</div><div class="r-value">~ 54 000 ₽</div></div></div><div class="s-btn-row"><button class="s-btn s-btn-success" onclick="alert(\'Заявка одобрена\')"><i class="fas fa-check"></i> Одобрить</button><button class="s-btn s-btn-outline" onclick="alert(\'Чат открыт\')"><i class="fas fa-comment-dots"></i> Чат</button></div></div>';
    } else {
        document.getElementById('sResultSubtitle').textContent = 'Заявка отклонена';
        h += '<div class="s-result rejected"><div class="r-icon">❌</div><div class="r-title" style="color:#991b1b;">В кредите отказано</div><div class="r-desc">Обнаружены стоп-факторы.</div><div class="s-btn-row"><button class="s-btn s-btn-danger" onclick="alert(\'Заявка отклонена\')"><i class="fas fa-times"></i> Отклонить</button><button class="s-btn s-btn-outline" onclick="alert(\'Чат открыт\')"><i class="fas fa-comment-dots"></i> Чат</button></div></div>';
    }
    
    document.getElementById('sResultArea').innerHTML = h;
}

function closeManagerScoring() {
    clearTimeout(sTimer);
    sPaused = true;
    document.getElementById('scoringOverlay').classList.add('hidden');
    refreshData();
    renderApplicationList();
    if (selectedAppId) renderApplicationDetail(selectedAppId);
}