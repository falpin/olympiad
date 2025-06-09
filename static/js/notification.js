function showNotification(message) {
    const notification = document.getElementById('custom-notification');
    notification.textContent = message;
    notification.className = 'notification show';

    // Скрыть через 3 секунды
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}