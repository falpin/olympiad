document.addEventListener('DOMContentLoaded', () => {
    // Контейнеры элементов
    const questionsContainer = document.getElementById('questions-container-test');
    const testForm = document.getElementById('test-form');

    // Функция для получения cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Переключение видимости полей в зависимости от типа вопроса
    function toggleAnswerFields(questionCard) {
        const type = questionCard.querySelector('.question-type').value;
        const optionsContainer = questionCard.querySelector('.answer-options-container');
        const textAnswerContainer = questionCard.querySelector('.text-answer-container');

        if (type === 'text') {
            optionsContainer.style.display = 'none';
            textAnswerContainer.style.display = 'block';
        } else {
            optionsContainer.style.display = 'block';
            textAnswerContainer.style.display = 'none';
        }
    }

    // Делегирование: изменение типа вопроса
    questionsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('question-type')) {
            toggleAnswerFields(e.target.closest('.question-card'));
        }
    });

    // Добавление вариантов ответа
    questionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-answer')) {
            const container = e.target.previousElementSibling;
            const newAnswer = `
                <div class="answer-option">
                    <input type="text" placeholder="Введите вариант ответа">
                    <label>
                        <input type="checkbox" class="correct-answer">
                        Правильный ответ
                    </label>
                </div>`;
            container.insertAdjacentHTML('beforeend', newAnswer);
        }
    });

    // Удаление вопросов
    questionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-question')) {
            e.target.closest('.question-card').remove();
        }
    });

    // Добавление нового вопроса
    document.querySelector('.add-question-tests').addEventListener('click', () => {
        const newQuestion = `
        <div class="question-card">
            <button type="button" class="remove-question">✕</button>
            <div class="form-group">
                <label class="h6">Текст вопроса</label>
                <textarea class="question-text" placeholder="Введите текст вопроса"></textarea>
            </div>
            
            <div class="form-group">
                <label class="h6">Баллы за вопрос</label>
                <input type="number" class="question-points" min="1" value="1">
            </div>
            
            <div class="form-group">
                <label class="h6">Тип вопроса</label>
                <select class="question-type">
                    <option value="single">Одиночный выбор</option>
                    <option value="multiple">Множественный выбор</option>
                    <option value="text">Текстовый ответ</option>
                </select>
            </div>
            
            <!-- Контейнер для вариантов ответов -->
            <div class="answer-options-container">
                <div class="form-group">
                    <label class="h6">Варианты ответов</label>
                    <div class="answer-options">
                        <div class="answer-option">
                            <input type="text" placeholder="Введите вариант ответа">
                            <label>
                                <input type="checkbox" class="correct-answer">
                                Правильный ответ
                            </label>
                        </div>
                    </div>
                    <button type="button" class="add-answer">Добавить вариант</button>
                </div>
            </div>
            
            <!-- Контейнер для текстового ответа -->
            <div class="text-answer-container" style="display: none;">
                <div class="form-group">
                    <label class="h6">Правильный ответ (текст)</label>
                    <input type="text" class="correct-text-answer" placeholder="Введите правильный ответ">
                </div>
            </div>
        </div>`;
        
        questionsContainer.insertAdjacentHTML('beforeend', newQuestion);
        const newCard = questionsContainer.lastElementChild;
        toggleAnswerFields(newCard);
        
        // Сброс стилей ошибок при вводе
        newCard.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.style.border = '';
            });
        });
    });

    // Обработка отправки формы
    testForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Сбор данных теста
        const testName = document.getElementById('test-name');
        const testDescription = document.getElementById('test-description');
        const grade5 = document.querySelector('[data-grade="5"]');
        const grade4 = document.querySelector('[data-grade="4"]');
        const grade3 = document.querySelector('[data-grade="3"]');
        const grade2 = document.querySelector('[data-grade="2"]');
        
        // Валидация перед отправкой
        let isValid = true;
        const errorMessages = [];
        
        // Сброс всех стилей ошибок
        document.querySelectorAll('input, textarea').forEach(input => {
            input.style.border = '';
        });
        
        // Проверка основных полей теста
        if (!testName.value.trim()) {
            isValid = false;
            errorMessages.push('Название теста не может быть пустым');
            testName.style.border = '1px solid red';
        }
        
        if (!testDescription.value.trim()) {
            isValid = false;
            errorMessages.push('Описание теста не может быть пустым');
            testDescription.style.border = '1px solid red';
        }
        
        // Проверка системы оценивания
        const grades = [
            {element: grade5, value: parseInt(grade5.value), name: '5'},
            {element: grade4, value: parseInt(grade4.value), name: '4'},
            {element: grade3, value: parseInt(grade3.value), name: '3'},
            {element: grade2, value: parseInt(grade2.value), name: '2'}
        ];
        
        let prevGrade = 101;
        for (const grade of grades) {
            if (isNaN(grade.value)) {
                isValid = false;
                errorMessages.push(`Оценка ${grade.name}: должно быть числом`);
                grade.element.style.border = '1px solid red';
            } else if (grade.value < 0 || grade.value > 100) {
                isValid = false;
                errorMessages.push(`Оценка ${grade.name}: должно быть от 0 до 100`);
                grade.element.style.border = '1px solid red';
            } else if (grade.value >= prevGrade) {
                isValid = false;
                errorMessages.push(`Оценка ${grade.name} должна быть меньше предыдущей`);
                grade.element.style.border = '1px solid red';
            }
            prevGrade = grade.value;
        }
        
        // Проверка вопросов
        const questions = document.querySelectorAll('.question-card');
        if (questions.length === 0) {
            isValid = false;
            errorMessages.push('Добавьте хотя бы один вопрос');
        }
        
        questions.forEach((question, index) => {
            const questionText = question.querySelector('.question-text');
            const questionPoints = question.querySelector('.question-points');
            const questionType = question.querySelector('.question-type').value;
            
            // Проверка текста вопроса
            if (!questionText.value.trim()) {
                isValid = false;
                errorMessages.push(`Вопрос ${index + 1}: текст вопроса не может быть пустым`);
                questionText.style.border = '1px solid red';
            }
            
            // Проверка баллов за вопрос
            if (parseInt(questionPoints.value) < 1) {
                isValid = false;
                errorMessages.push(`Вопрос ${index + 1}: баллы должны быть не менее 1`);
                questionPoints.style.border = '1px solid red';
            }
            
            // Проверка текстовых ответов
            if (questionType === 'text') {
                const textAnswer = question.querySelector('.correct-text-answer');
                if (!textAnswer.value.trim()) {
                    isValid = false;
                    errorMessages.push(`Вопрос ${index + 1}: правильный ответ не может быть пустым`);
                    textAnswer.style.border = '1px solid red';
                }
            } 
            // Проверка вариантов с выбором
            else {
                const answerOptions = question.querySelectorAll('.answer-option');
                if (answerOptions.length === 0) {
                    isValid = false;
                    errorMessages.push(`Вопрос ${index + 1}: добавьте хотя бы один вариант ответа`);
                } else {
                    let hasCorrectAnswer = false;
                    
                    answerOptions.forEach((option, optionIndex) => {
                        const input = option.querySelector('input[type="text"]');
                        if (!input.value.trim()) {
                            isValid = false;
                            errorMessages.push(`Вопрос ${index + 1}, вариант ${optionIndex + 1}: текст ответа не может быть пустым`);
                            input.style.border = '1px solid red';
                        }
                        
                        if (option.querySelector('.correct-answer').checked) {
                            hasCorrectAnswer = true;
                        }
                    });
                    
                    if (!hasCorrectAnswer) {
                        isValid = false;
                        errorMessages.push(`Вопрос ${index + 1}: должен быть хотя бы один правильный ответ`);
                    }
                    
                    // Проверка для одиночного выбора
                    if (questionType === 'single') {
                        const checkedCount = question.querySelectorAll('.correct-answer:checked').length;
                        if (checkedCount > 1) {
                            isValid = false;
                            errorMessages.push(`Вопрос ${index + 1}: для одиночного выбора должен быть только один правильный ответ`);
                        }
                    }
                }
            }
        });
        
        if (!isValid) {
            alert(`Ошибки валидации:\n\n${[...new Set(errorMessages)].join('\n')}`);
            return;
        }
        
        // Формирование данных теста
        const testData = {
            title: testName.value,
            description: testDescription.value,
            grading_system: {
                "5": parseInt(grade5.value),
                "4": parseInt(grade4.value),
                "3": parseInt(grade3.value),
                "2": parseInt(grade2.value)
            },
            is_open: true
        };

        try {
            // Отправка теста
            const jwtToken = getCookie('jwt_token');
            const testResponse = await fetch('https://olympiad-api.falpin.ru/tests', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${jwtToken}` 
                },
                body: JSON.stringify(testData)
            });

            if (!testResponse.ok) {
                const error = await testResponse.json();
                throw new Error(error.message || 'Ошибка создания теста');
            }
            
            const { test_id } = await testResponse.json();

            // Отправка вопросов
            const questions = document.querySelectorAll('.question-card');
            for (const question of questions) {
                const type = question.querySelector('.question-type').value;
                const formData = new FormData();
                
                formData.append('content', question.querySelector('.question-text').value);
                formData.append('type', type);
                formData.append('points', question.querySelector('.question-points').value);
                
                let answers = [];
                
                if (type === 'text') {
                    // Для текстового ответа
                    const correctAnswer = question.querySelector('.correct-text-answer').value;
                    answers.push({
                        content: correctAnswer,
                        is_correct: true
                    });
                } else {
                    // Для вариантов с выбором
                    question.querySelectorAll('.answer-option').forEach(option => {
                        answers.push({
                            content: option.querySelector('input[type="text"]').value,
                            is_correct: option.querySelector('.correct-answer').checked
                        });
                    });
                }
                
                formData.append('answers', JSON.stringify(answers));
                
                // Отправка вопроса
                const questionResponse = await fetch(`https://olympiad-api.falpin.ru/tests/${test_id}/questions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    },
                    body: formData
                });
                
                if (!questionResponse.ok) {
                    const error = await questionResponse.json();
                    throw new Error(error.message || 'Ошибка создания вопроса');
                }
            }
            
            alert('Тест успешно создан!');
            // testForm.reset(); // Опционально: очистить форму после создания
        } catch (error) {
            console.error('Ошибка создания теста:', error);
            alert(`Ошибка: ${error.message}`);
        }
    });
    
    // Сброс стилей ошибок при изменении значений
    document.addEventListener('input', (e) => {
        if (e.target.matches('input, textarea, select')) {
            e.target.style.border = '';
        }
    });
});