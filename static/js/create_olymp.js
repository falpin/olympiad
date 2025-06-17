document.addEventListener('DOMContentLoaded', () => {
    // Контейнеры элементов
    const questionsContainer = document.getElementById('questions-container');
    const testForm = document.getElementById('olymp-form');

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

    // Обработка отправки формы
    testForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Сбор данных теста
        const olympiadName = document.getElementById('olymp-name');
        const olympiadDescription = document.getElementById('olymp-description');
        const olympiadDuration = document.getElementById('olymp-duration');
        const olympiadStart_time = document.getElementById('olymp-start_time');
        const olympiadEnd_time = document.getElementById('olymp-end_time');
        const olympiadgrade5 = document.querySelector('[data-olymp-grade="5"]');
        const olympiadgrade4 = document.querySelector('[data-olymp-grade="4"]');
        const olympiadgrade3 = document.querySelector('[data-olymp-grade="3"]');
        const olympiadgrade2 = document.querySelector('[data-olymp-grade="2"]');
        
        // Валидация перед отправкой
        let isValid = true;
        const errorMessages = [];
        
        // Сброс всех стилей ошибок
        document.querySelectorAll('input, textarea').forEach(input => {
            input.style.border = '';
        });
        
        // Проверка основных полей теста
        if (!olympiadName.value.trim()) {
            isValid = false;
            errorMessages.push('Название олимпиады не может быть пустым');
            olympiadName.style.border = '1px solid red';
        }
        
        if (!olympiadName.value.trim()) {
            isValid = false;
            errorMessages.push('Описание олимпиады не может быть пустым');
            olympiadName.style.border = '1px solid red';
        }
        
        // Проверка системы оценивания
        const grades = [
            {element: olympiadgrade5, value: parseInt(olympiadgrade5.value), name: '5'},
            {element: olympiadgrade4, value: parseInt(olympiadgrade4.value), name: '4'},
            {element: olympiadgrade3, value: parseInt(olympiadgrade3.value), name: '3'},
            {element: olympiadgrade2, value: parseInt(olympiadgrade2.value), name: '2'}
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
            title: olympiadName.value,
            description: olympiadDescription.value,
            duration: olympiadDuration.value,
            start_time: olympiadStart_time.value,
            end_time: olympiadEnd_time.value,
            grading_system: {
                "5": parseInt(olympiadgrade5.value),
                "4": parseInt(olympiadgrade4.value),
                "3": parseInt(olympiadgrade3.value),
                "2": parseInt(olympiadgrade2.value)
            },
            is_open: true
        };

        try {
            // Отправка теста
            const jwtToken = getCookie('jwt_token');
            const testResponse = await fetch('https://olympiad-api.falpin.ru/olympiads', {
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
            
            const { olympiad_id } = await testResponse.json();

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
                const questionResponse = await fetch(`https://olympiad-api.falpin.ru/olympiads/${olympiad_id}/questions`, {
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
            
            alert('Олимпиада успешно создана!');
            testForm.reset(); // Опционально: очистить форму после создания
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