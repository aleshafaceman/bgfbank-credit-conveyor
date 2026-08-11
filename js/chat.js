// ========== ЧАТ С МЕНЕДЖЕРОМ ==========
// Виджет чата в правом нижнем углу — общая база shared/data.js

function getClientChatName() {
    if (typeof getClientDisplayName === 'function') return getClientDisplayName();
    if (typeof getUserCredentials === 'function') {
        var u = getUserCredentials();
        if (u && u.name) return u.name;
    }
    return 'Александр Кузнецов';
}

function renderClientChat() {
    var body = document.getElementById('chatBody');
    if (!body) return;
    if (typeof loadSharedData === 'function') loadSharedData();

    var name = getClientChatName();
    var history = typeof getChatHistory === 'function' ? getChatHistory(name) : [];

    if (!history.length) {
        body.innerHTML = '<div class="chat-system">Напишите менеджеру — переписка синхронизируется с панелью банка</div>';
    } else {
        body.innerHTML = history.map(function(m) {
            var cls = m.from === 'client' ? 'client' : 'manager';
            return '<div class="chat-message ' + cls + '">' + m.text +
                '<div class="msg-time">' + (m.time || '') + '</div></div>';
        }).join('');
    }
    body.scrollTop = body.scrollHeight;

    var unread = history.filter(function(m) { return m.from === 'manager' && !m.read; }).length;
    var toggle = document.getElementById('chatToggle');
    if (toggle) {
        if (unread > 0 && document.getElementById('chatWindow').classList.contains('hidden')) {
            toggle.classList.add('has-unread');
        } else {
            toggle.classList.remove('has-unread');
        }
    }

    var statusEl = document.getElementById('chatOnlineStatus');
    if (statusEl) statusEl.classList.remove('offline');
}

function toggleChat() {
    var w = document.getElementById('chatWindow');
    var t = document.getElementById('chatToggle');
    w.classList.toggle('hidden');
    if (!w.classList.contains('hidden')) {
        var name = getClientChatName();
        if (typeof markMessagesAsRead === 'function') markMessagesAsRead(name);
        renderClientChat();
        if (t) t.classList.remove('has-unread');
        var input = document.getElementById('chatInput');
        if (input) input.focus();
    }
}

function sendMessage() {
    var input = document.getElementById('chatInput');
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;

    var name = getClientChatName();
    if (typeof sendChatMessage === 'function') {
        sendChatMessage('client', name, text, name);
    }
    input.value = '';
    renderClientChat();
}

function sendQuickReply(text) {
    document.getElementById('chatInput').value = text;
    sendMessage();
}

document.addEventListener('DOMContentLoaded', function() {
    renderClientChat();
});
