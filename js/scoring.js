// ========== ПОЛНЫЙ СКОРИНГ ==========

var scoringSteps = [
    { name: 'Кредитная история (НБКИ)', source: 'НБКИ', time: '1.2 сек', detail: 'Кредитный рейтинг: 720. Просрочек нет. 2 действующих кредита.' },
    { name: 'Кредитная история (ОКБ)', source: 'ОКБ', time: '0.8 сек', detail: 'Данные совпадают. Расхождений не обнаружено.' },
    { name: 'Верификация дохода (ФНС)', source: 'ФНС / ЕСИА', time: '2.1 сек', detail: 'Доход подтверждён: 180 000 ₽/мес. Данные ЕСИА совпадают с ФНС.' },
    { name: 'Проверка работодателя', source: 'ЕГРЮЛ / ФНС', time: '1.5 сек', detail: 'ООО «ТехноСофт» действует с 2010 г. Банкротств не зафиксировано.' },
    { name: 'Оценка недвижимости', source: 'Ocenka.mobi', time: '2.8 сек', detail: 'Рыночная стоимость: 8 500 000 ₽. Ликвидность: высокая. Рекомендуемый LTV: 60%.' },
    { name: 'Андеррайтинг', source: 'Loginom', time: '3.2 сек', detail: 'PTI: 38% (норма). DTI: 42% (норма). Стоп-факторы отсутствуют.' },
    { name: 'Расчёт итоговых условий', source: 'Внутренний', time: '1.0 сек', detail: 'Ставка: 12.5%. Лимит: 5 400 000 ₽. Платёж: ~54 000 ₽/мес.' },
    { name: 'Формирование решения', source: 'Внутренний', time: '0.8 сек', detail: 'Решение: ОДОБРЕНО. Оффер сформирован.' }
];

var scoringCurrentStep = 0;
var scoringTimer = null;

function openFullScoring() {
    document.getElementById('view-result').classList.add('hidden');
    document.getElementById('scoringOverlay').classList.remove('hidden');
    
    scoringCurrentStep = 0;
    renderScoringSteps();
    updateScoringProgress();
    updateScoringDetail(0);
    document.getElementById('scoringResult').innerHTML = '';
    
    var delays = [1200, 800, 2100, 1500, 2800, 3200, 1000, 800];
    
    function runStep(idx) {
        if (idx >= scoringSteps.length) {
            scoringCurrentStep = scoringSteps.length;
            renderScoringSteps();
            updateScoringProgress();
            setTimeout(showScoringResult, 600);
            return;
        }
        scoringCurrentStep = idx;
        renderScoringSteps();
        updateScoringProgress();
        updateScoringDetail(idx);
        scoringTimer = setTimeout(function() { runStep(idx + 1); }, delays[idx]);
    }
    
    runStep(0);
}

function renderScoringSteps() {
    var h = '';
    for (var i = 0; i < scoringSteps.length; i++) {
        var cls = 'waiting';
        var dotCls = 'waiting';
        var timeText = scoringSteps[i].time;
        
        if (i < scoringCurrentStep) {
            cls = 'done';
            dotCls = 'done';
            timeText = '✓ ' + scoringSteps[i].time;
        } else if (i === scoringCurrentStep) {
            cls = 'active';
            dotCls = 'active';
            timeText = '...';
        }
        
        h += '<div class="scoring-step ' + cls + '">';
        h += '<div class="s-dot ' + dotCls + '"></div>';
        h += '<div class="s-name">' + scoringSteps[i].name + '</div>';
        h += '<div class="s-source">' + scoringSteps[i].source + '</div>';
        h += '<div class="s-time">' + timeText + '</div>';
        h += '</div>';
    }
    document.getElementById('scoringStepList').innerHTML = h;
}

function updateScoringProgress() {
    var pct = Math.round((scoringCurrentStep / scoringSteps.length) * 100);
    document.getElementById('scoringProgressFill').style.width = pct + '%';
    document.getElementById('scoringProgressLabel').textContent = scoringCurrentStep + ' из ' + scoringSteps.length + ' шагов';
}

function updateScoringDetail(idx) {
    if (idx < scoringSteps.length) {
        var s = scoringSteps[idx];
        document.getElementById('scoringDetailTitle').textContent = s.name + ' (' + s.source + ')';
        var lines = s.detail.split('. ');
        var h = '';
        for (var i = 0; i < lines.length; i++) {
            if (i < lines.length - 1) {
                h += '<span class="ok">✓ ' + lines[i] + '.</span><br>';
            } else {
                h += '<span class="curr">⟳ ' + lines[i] + '...</span>';
            }
        }
        document.getElementById('scoringDetailContent').innerHTML = h;
    }
}

function showScoringResult() {
    var outcomes = ['approved', 'approved', 'rejected', 'needs-info'];
    var outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    
    var h = '';
    
    if (outcome === 'approved') {
        h += '<div class="scoring-result approved">';
        h += '<div class="r-icon">✅</div>';
        h += '<div class="r-title" style="color:#065f46;">Кредит одобрен</div>';
        h += '<div class="r-desc">Все проверки пройдены успешно. Кредитный рейтинг 720 (хороший).</div>';
        h += '<div class="r-params">';
        h += '<div class="r-param"><div class="r-label">Лимит</div><div class="r-value" style="color:#003b6f;">5 400 000 ₽</div></div>';
        h += '<div class="r-param"><div class="r-label">Ставка</div><div class="r-value" style="color:#10b981;">12.5%</div></div>';
        h += '<div class="r-param"><div class="r-label">Срок</div><div class="r-value">15 лет</div></div>';
        h += '<div class="r-param"><div class="r-label">Платёж / мес.</div><div class="r-value">~ 54 000 ₽</div></div>';
        h += '</div>';
        h += '<button class="btn btn-primary" style="max-width:250px;margin:0 auto;" onclick="closeFullScoring()">Перейти к подписанию договора</button>';
        h += '</div>';
    } else if (outcome === 'rejected') {
        h += '<div class="scoring-result rejected">';
        h += '<div class="r-icon">❌</div>';
        h += '<div class="r-title" style="color:#991b1b;">В кредите отказано</div>';
        h += '<div class="r-desc">PTI превышает 50%. Текущее значение: 52%.</div>';
        h += '<div class="r-params">';
        h += '<div class="r-param"><div class="r-label">Запрошено</div><div class="r-value">5 000 000 ₽</div></div>';
        h += '<div class="r-param"><div class="r-label">Доступно</div><div class="r-value" style="color:#f59e0b;">4 200 000 ₽</div></div>';
        h += '</div>';
        h += '<div style="font-size:12px;color:#64748b;margin-bottom:12px;">Рекомендации: уменьшить сумму, увеличить срок, добавить созаёмщика.</div>';
        h += '<button class="btn btn-primary" style="max-width:250px;margin:0 auto;" onclick="closeFullScoring()">Изменить параметры</button>';
        h += '</div>';
    } else {
        h += '<div class="scoring-result needs-info">';
        h += '<div class="r-icon">⚠️</div>';
        h += '<div class="r-title" style="color:#92400e;">Требуется уточнение</div>';
        h += '<div class="r-desc">Не подтверждён доп. доход. Требуется актуальная выписка ЕГРН.</div>';
        h += '<button class="btn btn-primary" style="max-width:250px;margin:0 auto;" onclick="closeFullScoring()">Загрузить документы</button>';
        h += '</div>';
    }
    
    document.getElementById('scoringResult').innerHTML = h;
}

function closeFullScoring() {
    clearTimeout(scoringTimer);
    document.getElementById('scoringOverlay').classList.add('hidden');
    navigateTo('dashboard');
}

// Привязка кнопки полного скоринга (делегирование)
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btnFullScoring') {
        openFullScoring();
    }
});