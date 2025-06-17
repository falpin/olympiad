const test_id = parseInt(window.location.href.split('/').pop());
let answers = {}; // Объект для хранения ответов пользователя
const jwtToken = getCookie('jwt_token');
const host = "https://olympiad-api.falpin.ru" 

async function getTest() {
    try {
        // Получаем данные теста
        const testResponse = await fetch(`${host}/olympiads/${test_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        if (!testResponse.ok) {
            const errorData = await testResponse.json();
            throw new Error(errorData.error || 'Неизвестная ошибка при получении теста');
        }

        const testData = await testResponse.json();

        // Запускаем тест
        const startResponse = await fetch(`${host}/olympiads/${test_id}/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        if (!startResponse.ok) {
            const errorData = await startResponse.json();
            throw new Error(errorData.error || 'Неизвестная ошибка при запуске теста');
        }

        const startResult = await startResponse.json();
        const result_id = startResult.result_id.id;
        
        showNotification(startResult.message);
        console.log("Result ID:", result_id);

        // Создаем тест с полученными данными
        createTest(testData, result_id);

        return { testData, result_id }; // Возвращаем данные, если нужно использовать дальше

    } catch (error) {
        console.error("Ошибка в функции getTest:", error);
        showNotification(error.message || 'Произошла ошибка');
        throw error; // Пробрасываем ошибку дальше, если нужно обработать в вызывающем коде
    }
}
function createTest(test, result_id) {
    const container = document.querySelector("main");
    
    // Очищаем контейнер перед добавлением новых элементов
    container.innerHTML = '';
    
    // Создаем заголовок теста
    const testHeader = document.createElement('div');
    testHeader.innerHTML = `
        <h2 class="h2 bold">${test.title}</h2>
        <h5 class="h5 bold gray">
            <span>Олимпиада</span>
            |
            <span>Всего ${test.questions.length} вопросов</span>
        </h5>
        <p>${test.description}<p>
    `;
    container.appendChild(testHeader);
    
    // Создаем секции для каждого вопроса
    test.questions.forEach((question, index) => {

        console.log(question)
        data_question = (question.answers)
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
                console.log(answer)
                const answerButton = document.createElement('button');
                answerButton.className = 'h6 normal test-btn';
                answerButton.textContent = answer.content;
                answerButton.dataset.answerId = answer.id;
                answerButton.dataset.questionId = question.id;
                
                // Обработчик клика для вариантов ответа
                answerButton.addEventListener('click', () => {
                    if (question.type === 'single') {
        // Проверяем, был ли уже выбран этот ответ
                        const wasActive = answerButton.classList.contains('active');

        // Снимаем выделение со всех кнопок
                        const allButtons = answersContainer.querySelectorAll('.test-btn');
                        allButtons.forEach(btn => btn.classList.remove('active'));

        // Если ответ не был выбран ранее - выбираем его
                        if (!wasActive) {
                            answerButton.classList.add('active');
                            answers[question.id] = {
                                question_id: question.id,
                                answer_ids: [answer.id]
                            };
                        } else {
            // Если ответ был выбран - удаляем его из сохраненных ответов
                            delete answers[question.id];
                        }
                    } else {
        // Для множественного выбора - переключаем состояние
                        answerButton.classList.toggle('active');

        // Собираем все выбранные ответы
                        const selectedAnswers = answersContainer.querySelectorAll('.test-btn.active');
                        if (selectedAnswers.length > 0) {
                            answers[question.id] = {
                                question_id: question.id,
                                answer_ids: Array.from(selectedAnswers).map(btn => parseInt(btn.dataset.answerId))
                            };
                        } else {
            // Если ни одного ответа не выбрано - удаляем вопрос из сохраненных ответов
                            delete answers[question.id];
                        }
                    }

    // Отправляем ответ на сервер (если он есть)
                    if (answers[question.id]) {
                        sendAnswer({ "result_id": result_id, "question_id": question.id, "answer": answers[question.id] });
                    } else {
        // Если ответ отменен, можно отправить запрос на удаление ответа (если ваш API поддерживает)
        // или просто ничего не делать, в зависимости от требований
                        console.log(`Ответ на вопрос ${question.id} отменен`);
                    }
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
                    sendAnswer({ "result_id": result_id, "question_id": question.id, "answer": answers[question.id] });
                }, 1000); // Отправляем через 1 секунду после окончания ввода
            });
            
            answersContainer.appendChild(input);
        }

        questionDiv.appendChild(answersContainer);
        questionSection.appendChild(questionDiv);
        container.appendChild(questionSection);
    });

const sendButton = document.createElement('button');
sendButton.className = 'content-btn h5 bold';
sendButton.innerHTML = `Завершить`;
sendButton.addEventListener('click', handleSubmit);
container.appendChild(sendButton);
}

// Функция для отправки ответа на сервер
function sendAnswer(answerData) {
    const host = "https://olympiad-api.falpin.ru";
    
    fetch(`${host}/olympiads/answers`, {
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
        console.error('Ошибка при сохранении ответа:', error.error);
    });
}

// Функция для обработки нажатия на кнопку "Проверить"
function handleSubmit() {
    const host = "https://olympiad-api.falpin.ru";
    
    fetch(`${host}/olympiads/${test_id}/finish`, {
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
        window.location.href = "/results";
    })
    .catch(error => {
        console.error('Ошибка:', error.message);
        showNotification(`${error.message}`);
    });
}
getTest();