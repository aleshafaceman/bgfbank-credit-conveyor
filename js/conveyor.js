// ========== КОНВЕЙЕР ==========
// Выбор сценария, анкета, прескоринг, результат

function populateCollateralSelect() {
    const s = document.getElementById('collateralSelect');
    if (!s) return;
    s.innerHTML = '<option value="">Выберите объект...</option>' +
        propertyPortfolio.map(p => `<option value="${p.id}">${p.typeLabel}: ${p.address} ${p.valuation ? '(~' + p.valuation.toLocaleString('ru-RU') + ' ₽)' : ''}</option>`).join('') +
        '<option value="new">➕ Добавить новый...</option>';
}

function onCollateralSelect(v) {
    const pr = document.getElementById('ocenkaPreview');
    const pt = document.getElementById('ocenkaPreviewText');
    const be = document.getElementById('btnEsia');
    const bm = document.getElementById('btnManual');
    
    if (v === 'new') {
        openAddPropertyModal();
        document.getElementById('collateralSelect').value = '';
        return;
    }
    
    if (!v) {
        pr.classList.remove('visible');
        be.disabled = true;
        bm.disabled = true;
        return;
    }
    
    const p = propertyPortfolio.find(x => x.id === v);
    if (!p) return;
    
    state.selectedCollateralId = v;
    state.collateralValue = p.valuation || 8500000;
    pr.classList.add('visible');
    pt.textContent = p.valuation
        ? 'Ocenka.mobi: ' + p.valuation.toLocaleString('ru-RU') + ' ₽ (от ' + p.valuationDate + ')'
        : 'Ocenka.mobi: ожидает оценки';
    be.disabled = false;
    bm.disabled = false;
}

function openConveyorForApp(appId) {
    state.conveyorAppId = appId;
    state.selectedApp = appId;
    document.getElementById('view-applications').classList.add('hidden');
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-conveyor').classList.remove('hidden');
    document.getElementById('pageTitle').innerText = 'Оформление заявки';
    document.getElementById('pageSubtitle').innerText = 'Заявка №' + appId;
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const appsNav = document.querySelectorAll('.nav-link')[1];
    if (appsNav) appsNav.classList.add('active');
    state.currentPage = 'applications';
    populateCollateralSelect();
    resetConveyor();
}

function ensureConveyorApplication() {
    if (typeof loadSharedData === 'function') loadSharedData();
    const apps = typeof getAllApplications === 'function' ? getAllApplications() : [];
    let appId = state.selectedApp || state.conveyorAppId;
    let app = apps.find(a => a.id === appId);

    if (!app || app.status === 'approved' || app.status === 'rejected') {
        const active = typeof getActiveClientApplications === 'function' ? getActiveClientApplications() : [];
        if (active[0]) return active[0].id;
        const created = createNewClientApplication({ openConveyor: false, refresh: true });
        return created ? created.id : appId;
    }
    return app.id;
}

function openConveyorFromApplications() {
    const appId = ensureConveyorApplication();
    openConveyorForApp(appId);
}

function resetConveyor() {
    state.offerAccepted = false;
    state.selectedPackageId = 'PKG_RECOMMENDED';
    state.packageModifiers = { ltvBoost: false, coBorrower: false, fixedRate: false };
    const sel = document.getElementById('packageSelectionBlock');
    const done = document.getElementById('offerAcceptedBlock');
    if (sel) sel.classList.remove('hidden');
    if (done) done.classList.add('hidden');
    ['view-result','view-loading','view-manual-form'].forEach(id => document.getElementById(id).classList.add('hidden'));
    document.getElementById('view-choice').classList.remove('hidden');
    document.getElementById('ocenkaPreview').classList.remove('visible');
    document.getElementById('btnEsia').disabled = true;
    document.getElementById('btnManual').disabled = true;
    document.getElementById('collateralSelect').value = '';
    setStepState('st-1', 'done');
    setStepState('st-2', 'active');
    setStepState('st-3', '');
    setStepState('st-4', '');
    setStepState('st-5', '');
}

// ========== БЫСТРЫЙ ВЫБОР СУММЫ ==========
document.addEventListener('DOMContentLoaded', function() {
    const quickOpts = document.getElementById('amountQuickOptions');
    if (quickOpts) {
        quickOpts.addEventListener('click', function(e) {
            if (e.target.classList.contains('quick-option')) {
                this.querySelectorAll('.quick-option').forEach(o => o.classList.remove('selected'));
                e.target.classList.add('selected');
                document.getElementById('loanAmount').value = parseInt(e.target.dataset.value).toLocaleString('ru-RU') + ' ₽';
            }
        });
    }
});

// ========== РУЧНАЯ АНКЕТА ==========
function showManualForm() {
    document.getElementById('view-choice').classList.add('hidden');
    document.getElementById('view-manual-form').classList.remove('hidden');
    document.getElementById('btnSubmitManual').disabled = true;
}

function goBackToChoice() {
    document.getElementById('view-manual-form').classList.add('hidden');
    document.getElementById('view-choice').classList.remove('hidden');
}

function syncConsent(cbId, itemId) {
    const cb = document.getElementById(cbId);
    if (!cb) return;
    const item = document.getElementById(itemId);
    if (item) item.classList.toggle('checked', cb.checked);
    checkConsents();
}

/** @deprecated kept for any leftover callers; prefer checkbox onchange → syncConsent */
function toggleConsent(cbId, itemId) {
    syncConsent(cbId, itemId);
}

function checkConsents() {
    const pd = document.getElementById('consentPersonalData');
    const bki = document.getElementById('consentBKI');
    const btn = document.getElementById('btnSubmitManual');
    if (!pd || !bki || !btn) return;
    btn.disabled = !(pd.checked && bki.checked);
}

function submitManualForm() {
    document.getElementById('view-manual-form').classList.add('hidden');
    startFlow('manual');
}

// ========== ПОТОК ПРЕСКОРИНГА ==========
function startFlow(type) {
    state.flowType = type;
    state.baseRate = type === 'manual' ? 13.0 : 12.5;
    state.currentRate = state.baseRate;
    
    document.getElementById('view-choice').classList.add('hidden');
    document.getElementById('view-loading').classList.remove('hidden');
    setStepState('st-2', 'done');
    setStepState('st-3', 'active');
    
    setTimeout(() => { document.getElementById('log-1').className = 'log-item done'; }, 1200);
    setTimeout(() => {
        document.getElementById('log-2').className = 'log-item active';
        setStepState('st-3', 'done');
        setStepState('st-4', 'active');
    }, 2800);
    setTimeout(() => {
        document.getElementById('log-2').className = 'log-item done';
        document.getElementById('log-3').className = 'log-item active';
    }, 4300);
    setTimeout(() => {
        document.getElementById('log-3').className = 'log-item done';
        document.getElementById('log-4').className = 'log-item active';
        setStepState('st-4', 'done');
        setStepState('st-5', 'active');
    }, 5500);
    setTimeout(() => {
        document.getElementById('log-4').className = 'log-item done';
        document.getElementById('view-loading').classList.add('hidden');
        document.getElementById('view-result').classList.remove('hidden');
        setStepState('st-5', 'done');
        if (typeof initPackageSelection === 'function') initPackageSelection();
        else updateResultCards();
        if (type === 'manual') document.getElementById('greetingName').innerText = 'Александр';
    }, 6800);
}

function updateResultCards() {
    document.getElementById('res-limit').textContent = state.currentLimit.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('res-rate').textContent = state.currentRate.toFixed(1) + '%';
    document.getElementById('res-term').textContent = state.currentTerm + ' ' + getTermLabel(state.currentTerm);
    document.getElementById('res-payment').textContent = '~ ' + state.currentPayment.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('ltv-label').textContent = 'до ' + Math.round(state.currentLTV * 100) + '% от оценки Ocenka.mobi';
}