// ========== УТИЛИТЫ ==========
// Общие функции, используемые в разных модулях

function calculatePayment(a, r, t) {
    const mr = (r / 100) / 12;
    const tm = t * 12;
    if (mr === 0) return Math.round(a / tm);
    return Math.round(a * mr / (1 - Math.pow(1 + mr, -tm)));
}

function getTermLabel(y) {
    if (y === 1) return 'год';
    if (y >= 2 && y <= 4) return 'года';
    return 'лет';
}

function formatAmount(input) {
    let v = input.value.replace(/[^0-9]/g, '');
    if (v === '') { input.value = ''; return; }
    const n = parseInt(v);
    if (isNaN(n)) return;
    input.value = n.toLocaleString('ru-RU') + ' ₽';
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function flashCard(id) {
    const c = document.getElementById(id);
    if (!c) return;
    c.classList.add('updated');
    setTimeout(() => c.classList.remove('updated'), 1500);
}

function setStepState(sid, sv) {
    const s = document.getElementById(sid);
    if (s) s.className = 'step ' + (sv || '');
}