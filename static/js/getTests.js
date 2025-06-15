const jwtToken = getCookie('jwt_token');

function getTests() {
    const host = "https://olympiad-api.falpin.ru" 
    fetch(`${host}/tests`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                throw new Error(errorText);
            });
        }
        return response.json();
    })
    .then(result => {
        createTestCards(result);
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}

function startTest(testId) {
    const host = "https://olympiad-api.falpin.ru";
    return fetch(`${host}/tests/${testId}/start`, {
        method: 'POST',
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
    });
}

function createTestCards(tests) {
    const container = document.getElementById('tests-container');
    
    tests.forEach(test => {
        const card = document.createElement('div');
        card.className = 'lib-card';
        
        card.innerHTML = `
            <div>
                <h4 class="h4 bold">${test.title}</h4>
            </div>
            <div>
                <h4 class="h4 normal">${test.description}</h4>
            </div>
            <div class="arrow row">
                <a class="h5 test-link" href="#" data-test-id="${test.id}">Выполнить тест</a>
                <svg class="custom-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.75 12H16.75M16.75 12L14 14.75M16.75 12L14 9.25" stroke="#795548" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        `;
        
        container.appendChild(card);
    });

    // Добавляем обработчики событий для всех ссылок на тесты
    document.querySelectorAll('.test-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const testId = this.getAttribute('data-test-id');
            
            startTest(testId)
                .then(() => {
                    // После успешного начала теста перенаправляем на страницу теста
                    window.location.href = `/test/${testId}`;
                })
                .catch(error => {
                    console.error('Ошибка при начале теста:', error);
                    // Можно добавить уведомление пользователю об ошибке
                    alert('Не удалось начать тест. Пожалуйста, попробуйте позже.');
                });
        });
    });
}

getTests();