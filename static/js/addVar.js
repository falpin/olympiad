// script.js
document.addEventListener('DOMContentLoaded', () => {
    const addAnswerBtn = document.querySelector('.add-answer');
    const answerOptionsContainer = document.getElementById('answer-options');

    // Добавление нового варианта ответа
    addAnswerBtn.addEventListener('click', () => {
        const newAnswerOption = `
            <div class="answer-option">
            	<input type="text" placeholder="Введите вариант ответа">
            	<textarea placeholder="Введите описание варианта"></textarea>
            	<input type="checkbox" name="correct-answer">
            	<label class="h6">Правильный ответ?</label>
            </div>
        `;
        answerOptionsContainer.insertAdjacentHTML('beforeend', newAnswerOption);
    });

    const addQuestionBtn = document.querySelector('.add-question');
    const questionsContainer = document.getElementById('questions-container');

    // Добавление нового вопроса
    addQuestionBtn.addEventListener('click', () => {
        const newQuestionCard = `
            <div class="question-card">
            	<div class="form-group">
            		<label for="question-number" class="h6">Номер вопроса</label>
            		<input type="text" id="question-number" placeholder="Введите номер вопроса">
            	</div>

            	<div class="form-group">
            		<label for="question-text" class="h6">Текст вопроса</label>
            		<textarea id="question-text" placeholder="Введите текст вопроса"></textarea>
            	</div>

            	<div class="form-group">
            		<label class="h6">Варианты ответов</label>
            		<div id="answer-options">
            			<div class="answer-option">
            				<input type="text" placeholder="Введите вариант ответа">
            				<textarea placeholder="Введите описание варианта"></textarea>
            				<input type="checkbox" name="correct-answer">
            				<label class="h6">Правильный ответ?</label>
            			</div>
            		</div>
            		<button type="button" class="add-answer">Добавить вариант ответа</button>
            	</div>
            	<button type="button" class="add-question">Добавить вопрос</button>
            </div>
        `;
        questionsContainer.insertAdjacentHTML('beforeend', newQuestionCard);

        // Добавляем обработчик события для кнопки "Удалить вопрос"
        const removeQuestionBtn = questionsContainer.lastElementChild.querySelector('.remove-question');
        removeQuestionBtn.addEventListener('click', () => {
            removeQuestionBtn.closest('.question-card').remove();
        });
    });

    // Обработка формы при отправке
    const testForm = document.getElementById('test-form');
    testForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Получаем данные из формы
        const testName = document.getElementById('test-name').value;
        const testDescription = document.getElementById('test-description').value;
        const questionCount = document.getElementById('question-count').value;

        console.log({
            testName,
            testDescription,
            questionCount,
        });

        // Здесь можно добавить логику для отправки данных на сервер
        alert('Тест успешно сохранен!');
    });
});