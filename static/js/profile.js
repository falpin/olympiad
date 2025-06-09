function tests_results() {
    const jwtToken = getCookie('jwt_token');
    const userData = localStorage.getItem('user'); 
    const user = JSON.parse(userData);

    if (!jwtToken) {
        console.error('JWT токен не найден в куках');
        return;
    }

    fetch(`https://olympiad-api.falpin.ru/users/${user.id}/tests`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                console.log("Error text:", errorText);
                throw new Error(errorText);
            });
        }
        return response.json();
    })
    .then(results => {
        // Находим контейнер для вывода результатов
        const container = document.querySelector('.good_olympiads');
        
        // Очищаем предыдущие результаты
        container.innerHTML = '';
        
        // Сортируем результаты по дате окончания (новые сверху)
        results.sort((a, b) => new Date(b.end_time) - new Date(a.end_time));
        
        // Создаем элементы для каждой олимпиады
        results.forEach(test => {
            const testElement = document.createElement('div');
            testElement.className = 'test-result';
            
            // Форматируем дату
            const endDate = new Date(test.end_time);
            const formattedDate = endDate.toLocaleString('ru-RU');
            
            // Добавляем информацию об олимпиаде
            testElement.innerHTML = `
                <h4 class="h4 normal">${test.test_title}</h4>
                <p class="p2 normal">Дата прохождения: ${formattedDate}</p>
                <p class="p2 normal">Результат: ${test.score} из ${test.total_score}</p>
                ${test.grade ? `<p class="p2 normal">Оценка: ${test.grade}</p>` : ''}
                <hr>
            `;
            
            container.appendChild(testElement);
        });
    })
    .catch(error => {
        console.error('Ошибка:', error);
        // Можно добавить уведомление пользователю об ошибке
        const container = document.querySelector('.column');
        container.innerHTML = '<p class="p2 normal">Произошла ошибка при загрузке результатов</p>';
    });
}

tests_results()