document.addEventListener("DOMContentLoaded", function () {
  const backToTopButton = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    // Показываем кнопку, если прокрутили вниз больше 300px
    if (window.scrollY > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  backToTopButton.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});

document.querySelectorAll('.test-btn').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    // Очистка предыдущих активных состояний
    document.querySelectorAll('.test-btn').forEach(b => {
      b.classList.remove('correct', 'incorrect'); // Удаляем все классы
    });

    const feedbackContainer = document.querySelector('.feedback-container');
    const feedbackText = feedbackContainer.querySelector('.feedback-text');

    // Пример логики: правильный ответ — второй (index = 1)
    if (index === 1) {
      // Зеленый цвет — правильный
      btn.classList.add('correct');
      feedbackText.textContent = 'Верный ответ! Потому что Баба Яга — это персонаж русских сказок, а остальные связаны с домашним хозяйством.';
      feedbackText.classList.add('correct');
      feedbackText.style.opacity = 1;
    } else {
      // Красный цвет — неправильный
      btn.classList.add('incorrect');
      feedbackText.textContent = 'Неверно! Правильный ответ — "Баба Яга".';
      feedbackText.classList.add('incorrect');
      feedbackText.style.opacity = 1;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const timerButton = document.querySelector('.timer');
    let totalSeconds = 60 * 60; // 60 минут

    function updateTimer() {
        if (totalSeconds <= 0) {
            clearInterval(interval);
            timerButton.textContent = "Время вышло";
            timerButton.style.backgroundColor = 'var(--red)';

            // Переход на другую страницу через 2 секунды
            setTimeout(() => {
                window.location.href = "/finish.html"; // замени на нужную тебе страницу
            }, 2000);

            return;
        }

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        timerButton.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Меняем цвет в зависимости от оставшегося времени
        if (totalSeconds <= 600) { // <= 10 минут
            timerButton.style.backgroundColor = 'var(--red)';
        } else if (totalSeconds <= 1800) { // <= 30 минут
            timerButton.style.backgroundColor = 'var(--orange)';
        } else { // > 30 минут
            timerButton.style.backgroundColor = 'var(--green)';
        }

        totalSeconds--;
    }

    // Обновляем раз в секунду
    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // первый запуск
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.heart-section').forEach(heartSection => {
        const emptyHeart = heartSection.querySelector('.empty-heart');
        const filledHeart = heartSection.querySelector('.filled-heart');
        const addText = heartSection.querySelector('.add-text');
        const savedText = heartSection.querySelector('.saved-text');

        // Устанавливаем начальное состояние
        if (emptyHeart.style.display === 'none') {
            addText.style.display = 'none';
            savedText.style.display = 'inline';
        } else {
            addText.style.display = 'inline';
            savedText.style.display = 'none';
        }

        heartSection.addEventListener('click', () => {
            if (emptyHeart.style.display === 'none') {
                // Переключаем на пустое сердце
                emptyHeart.style.display = 'block';
                filledHeart.style.display = 'none';
                addText.style.display = 'inline';
                savedText.style.display = 'none';
            } else {
                // Переключаем на заполненное
                emptyHeart.style.display = 'none';
                filledHeart.style.display = 'block';
                addText.style.display = 'none';
                savedText.style.display = 'inline';
            }
        });
    });
});

// добавление нумерации для шаблона Олимпиада (Как участвовать)
function updateCounters() {
  const counters = document.querySelectorAll(".counter-text");
  counters.forEach((text, index) => {
    text.textContent = index + 1;
  });
}


document.addEventListener("DOMContentLoaded", function () {
  updateCounters(); // Вызываем при загрузке страницы
});

// пример кода для календаря
const monthYear = document.getElementById("month-year");
const calendarDays = document.getElementById("calendar-days");
const eventDetails = document.getElementById("event-details");

let currentDate = new Date(); // Текущая дата по умолчанию

// Моковые данные событий
function getEvents(year, month) {
  return [
    { date: `${year}-${String(month + 1).padStart(2, "0")}-10`, title: "Олимпиада ЧЭнК" },
    { date: `${year}-${String(month + 1).padStart(2, "0")}-15`, title: "Соревнования" },
    { date: `${year}-${String(month + 1).padStart(2, "0")}-5`, title: "Встреча" },
    { date: `${year}-${String(month + 1).padStart(2, "0")}-20`, title: "Тестирование" },
    { date: `${year}-${String(month + 1).padStart(2, "0")}-10`, title: "Митап разработчиков" },
  ];
}

// Отрисовка календаря
function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Обновляем заголовок
  monthYear.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

  const firstDay = new Date(year, month, 1).getDay() || 7; // воскресенье = 0 → делаем 7
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Очищаем календарь
  calendarDays.innerHTML = "";
  eventDetails.innerHTML = "";

  // Получаем события
  const events = getEvents(year, month);

  // Пустые дни до начала месяца
  for (let i = 1; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarDays.appendChild(empty);
  }

  // Добавляем дни
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("day", "current-month");

    dayEl.textContent = day;

    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEvents = events.filter(e => e.date === dayStr);

    if (dayEvents.length > 0) {
      dayEl.classList.add("has-event");
    }

    // Обработчик клика на день
    dayEl.addEventListener("click", () => {
      selectDay(dayEl, dayEvents);
    });

    calendarDays.appendChild(dayEl);
  }
}

// Выбор дня и вывод событий
function selectDay(clickedDay, events) {
  // Удаляем выделение у всех
  document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));

  // Выделяем текущий
  clickedDay.classList.add("selected");

  // Очищаем предыдущие события
  eventDetails.innerHTML = "";

  if (events.length === 0) {
    const noEvent = document.createElement("li");
    noEvent.textContent = "Нет событий";
    eventDetails.appendChild(noEvent);
  } else {
    events.forEach(event => {
      const li = document.createElement("li");
      li.textContent = event.title;
      eventDetails.appendChild(li);
    });
  }
}


// const buttons = document.querySelectorAll('.test-btn');

// buttons.forEach(button => {
//   button.addEventListener('click', () => {
//     // Удаляем класс active у всех кнопок
//     buttons.forEach(btn => btn.classList.remove('active'));
//     // Добавляем только на ту, которую нажали
//     button.classList.add('active');
//   });
// });

const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
const closeBtn = document.querySelector('.close-btn');

burger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    burger.classList.add('hide'); // Скрываем бургер
});

closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('hide'); // Показываем бургер
});


// Переключение месяцев
document.getElementById("prev-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

document.getElementById("next-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// Инициализация
renderCalendar(currentDate);



