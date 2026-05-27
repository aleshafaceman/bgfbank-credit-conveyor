// ========== ЧАТ С МЕНЕДЖЕРОМ ==========
// Виджет чата в правом нижнем углу

function toggleChat() {
    const w = document.getElementById('chatWindow');
    const t = document.getElementById('chatToggle');
    w.classList.toggle('hidden');
    t.classList.remove('has-unread');
    if (!w.classList.contains('hidden')) {
        document.getElementById('chatInput').focus();
        document.getElementById('chatBody').scrollTop = document.getElementById('chatBody').scrollHeight;
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    
    const body = document.getElementById('chatBody');
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    body.innerHTML += `<div class="chat-message client">${text}<div class="msg-time">${time}</div></div>`;
    input.value = '';
    body.scrollTop = body.scrollHeight;
    
    // Имитация ответа менеджера
    setTimeout(() => {
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.innerHTML = '<span></span><span></span><span></span>';
        body.appendChild(typing);
        body.scrollTop = body.scrollHeight;
        
        setTimeout(() => {
            typing.remove();
            const replies = [
                'Спасибо за информацию! Я проверю и вернусь к вам.',
                'Принято! Если понадобится что-то ещё — напишите.',
                'Отлично, я зафиксировала. Хорошего дня!',
                'Поняла вас. Как только будет обновление — сразу сообщу.'
            ];
            body.innerHTML += `<div class="chat-message manager">${replies[Math.floor(Math.random() * replies.length)]}<div class="msg-time">${time}</div></div>`;
            body.scrollTop = body.scrollHeight;
        }, 1500);
    }, 800);
}

function sendQuickReply(text) {
    document.getElementById('chatInput').value = text;
    sendMessage();
}

// Инициализация статуса менеджера
document.addEventListener('DOMContentLoaded', function() {
    const statusEl = document.getElementById('chatOnlineStatus');
    if (statusEl) {
        statusEl.classList.add(Math.random() > 0.3 ? '' : 'offline');
    }
});