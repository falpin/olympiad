const test_id = parseInt(window.location.href.split('/').pop());
let answers = {}; // Объект для хранения ответов пользователя
const jwtToken = getCookie('jwt_token');

function getTest() {
    const host = "https://olympiad-api.falpin.ru" 
    fetch(`${host}/tests/${test_id}`, {
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
    .then(result => {
        console.log(result);
        createTest(result);
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}

function createTest(test) {
    const container = document.querySelector("main");
    
    // Очищаем контейнер перед добавлением новых элементов
    container.innerHTML = '';
    
    // Создаем заголовок теста
    const testHeader = document.createElement('div');
    testHeader.innerHTML = `
        <h2 class="h2 bold">${test.title}</h2>
        <h5 class="h5 bold gray">
            <span>Тест</span>
            |
            <span>Всего ${test.questions.length} вопросов</span>
        </h5>
        <p>${test.description}</p>
        <p>Автор: ${test.creator_first_name} ${test.creator_last_name}</p>
    `;
    container.appendChild(testHeader);
    
    // Создаем секции для каждого вопроса
    test.questions.forEach((question, index) => {
        const questionSection = document.createElement('section');
        questionSection.className = 'test-section';
        
        // Создаем контейнер для вопроса
        const questionDiv = document.createElement('div');
        questionDiv.className = 'test';
        
        // Добавляем заголовок вопроса
        questionDiv.innerHTML = `
            <div class="test-title">
                <h5 class="h5 bold mb-10">Вопрос ${index + 1}</h5>
                <h5 class="h5 normal">${question.content}</h5>
            </div>
            <div class="feedback-container">
                <span class="feedback-text"></span>
            </div>
        `;
        
        // Создаем контейнер для вариантов ответов
        const answersContainer = document.createElement('div');
        answersContainer.className = 'answer-opt';
        
        // Обрабатываем разные типы вопросов
        if (question.type === 'multiple' || question.type === 'single') {
            // Для вопросов с выбором ответа создаем кнопки
            question.answers.forEach(answer => {
                const answerButton = document.createElement('button');
                answerButton.className = 'h6 normal test-btn';
                answerButton.textContent = answer.content;
                answerButton.dataset.answerId = answer.id;
                answerButton.dataset.questionId = question.id;
                
                // Обработчик клика для вариантов ответа
                answerButton.addEventListener('click', () => {
                    if (question.type === 'single') {
                        // Для одиночного выбора - снимаем выделение с других кнопок
                        const allButtons = answersContainer.querySelectorAll('.test-btn');
                        allButtons.forEach(btn => btn.classList.remove('active'));
                        answerButton.classList.add('active');
                        
                        // Сохраняем ответ
                        answers[question.id] = {
                            question_id: question.id,
                            answer_ids: [answer.id]
                        };
                    } else {
                        // Для множественного выбора - переключаем состояние
                        answerButton.classList.toggle('active');
                        
                        // Собираем все выбранные ответы
                        const selectedAnswers = answersContainer.querySelectorAll('.test-btn.active');
                        answers[question.id] = {
                            question_id: question.id,
                            answer_ids: Array.from(selectedAnswers).map(btn => parseInt(btn.dataset.answerId))
                        };
                    }
                    
                    // Отправляем ответ на сервер
                    sendAnswer(answers[question.id]);
                });
                
                answersContainer.appendChild(answerButton);
            });
        } else if (question.type === 'text') {
            // Для текстовых вопросов создаем поле ввода
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'text-answer reg-inputs h5';
            input.placeholder = 'Введите ваш ответ...';
            input.dataset.questionId = question.id;
            
            // Таймер для отправки ответа после ввода
            let timeout;
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    answers[question.id] = {
                        question_id: question.id,
                        answer_text: input.value
                    };
                    sendAnswer(answers[question.id]);
                }, 1000); // Отправляем через 1 секунду после окончания ввода
            });
            
            answersContainer.appendChild(input);
        }

        questionDiv.appendChild(answersContainer);
        questionSection.appendChild(questionDiv);
        container.appendChild(questionSection);
    });
    
    // Кнопка для проверки (вы можете добавить свою логику в handleSubmit)
    const sendButton = document.createElement('button');
    sendButton.className = 'content-btn h5 bold';
    sendButton.innerHTML = `Проверить`;
    sendButton.addEventListener('click', handleSubmit);
    container.appendChild(sendButton);
}

// Функция для отправки ответа на сервер
function sendAnswer(answerData) {
    const host = "https://olympiad-api.falpin.ru";
    
    fetch(`${host}/tests/${test_id}/answer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(answerData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => {
                const errorMessage = errorText.error || 'Неизвестная ошибка';
                console.error("Ошибка при отправке:", errorMessage);
                throw new Error(errorMessage);
            });
        }
        return response.json();
    })
    .then(result => {
        console.log('Ответ сохранен:', result);
    })
    .catch(error => {
        console.error('Ошибка при сохранении ответа:', error);
    });
}

// Функция для обработки нажатия на кнопку "Проверить"
function handleSubmit() {
    const host = "https://olympiad-api.falpin.ru";
    
    fetch(`${host}/tests/results/${test_id}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                const errorMessage = errorData.error || 'Неизвестная ошибка';
                console.error("Ошибка при отправке:", errorMessage);
                throw new Error(errorMessage);
            });
        }
        return response.json();
    })
    .then(result => {
        showNotification(result);
        console.log(result);
    })
    .catch(error => {
        console.error('Ошибка:', error.message);
        showNotification(`${error.message}`);
    });
}
getTest();