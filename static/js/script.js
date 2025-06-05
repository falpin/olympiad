document.addEventListener("DOMContentLoaded", function () {
    const heartSection = document.querySelector('.heart-section');
    if (!heartSection) return;

    const emptyHeart = heartSection.querySelector('.empty-heart');
    const filledHeart = heartSection.querySelector('.filled-heart');
    const addText = heartSection.querySelector('.add-text');
    const savedText = heartSection.querySelector('.saved-text');

    heartSection.addEventListener('click', () => {
        if (emptyHeart.style.display === 'none') {
            // Переключаем на пустое сердце
            emptyHeart.style.display = 'block';
            filledHeart.style.display = 'none';
            addText.style.display = 'inline';
            savedText.style.display = 'none';
        } else {
            // Переключаем на заполненное сердце
            emptyHeart.style.display = 'none';
            filledHeart.style.display = 'block';
            addText.style.display = 'none';
            savedText.style.display = 'inline';
        }
    });
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



