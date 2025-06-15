    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    let allUsers = []; // Храним всех пользователей

    function get_users() {
        const jwtToken = getCookie('jwt_token');
        const host = "https://olympiad-api.falpin.ru";
        
        fetch(`${host}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
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
            allUsers = result;
            // Инициализируем все контейнеры
            initUserContainers();
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    }

    // Инициализация всех контейнеров
    function initUserContainers() {
        // Участники (подтвержденные студенты)
        displayUsersByCondition(
            '#student #approved-users-container',
            user => user.is_approved && !user.is_teacher,
            'Нет подтвержденных участников'
        );
        
        // На подтверждение (неподтвержденные студенты)
        displayUsersByCondition(
            '#part #pending-users-container',
            user => !user.is_approved && !user.is_teacher,
            'Нет пользователей для подтверждения',
            true // с кнопкой подтверждения
        );
        
        // Преподаватели (подтвержденные)
        displayUsersByCondition(
            '#teachers #teachers-container',
            user => user.is_teacher && user.is_approved,
            'Нет подтвержденных преподавателей'
        );
        
        // На назначение преподавателем (подтвержденные не-преподаватели)
        displayUsersByCondition(
            '#activate_teachers #activate-teachers-container',
            user => user.is_approved && !user.is_teacher,
            'Нет пользователей для назначения преподавателями',
            false,
            true // с кнопкой назначения
        );
    }

    // Универсальная функция для отображения пользователей по условию
    function displayUsersByCondition(containerSelector, conditionFn, emptyMessage, withApproveBtn = false, withTeacherBtn = false) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        container.innerHTML = '';
        
        const filteredUsers = allUsers.filter(conditionFn);
        
        if (filteredUsers.length === 0) {
            container.innerHTML = `<p>${emptyMessage}</p>`;
            return;
        }

        filteredUsers.forEach(user => {
            const card = document.createElement('div');
            card.className = 'row';
            card.dataset.userId = user.id;

            let buttonsHTML = '';
            if (withApproveBtn) {
                buttonsHTML += `<button type="button" class="generate-btn approve-btn" data-user-id="${user.id}">Подтвердить</button>`;
            }
            if (withTeacherBtn) {
                buttonsHTML += `<button type="button" class="generate-btn make-teacher-btn" data-user-id="${user.id}">Назначить преподавателем</button>`;
            }

            card.innerHTML = `
                <h4>${user.last_name} ${user.first_name} ${user.patronymic}</h4>
                <h4>${user.email}</h4>
                <h4>Школа: ${user.school}</h4>
                ${user.is_teacher ? '<h4>Статус: Преподаватель</h4>' : ''}
                ${buttonsHTML}
            `;

            container.appendChild(card);
        });

        // Навешиваем обработчики кнопок
        if (withApproveBtn) {
            document.querySelectorAll(`${containerSelector} .approve-btn`).forEach(btn => {
                btn.addEventListener('click', () => approveUser(btn.dataset.userId));
            });
        }
        
        if (withTeacherBtn) {
            document.querySelectorAll(`${containerSelector} .make-teacher-btn`).forEach(btn => {
                btn.addEventListener('click', () => makeTeacher(btn.dataset.userId));
            });
        }
    }

    // Функция подтверждения пользователя
    function approveUser(userId) {
        const jwtToken = getCookie('jwt_token');
        const host = "https://olympiad-api.falpin.ru";
        
        fetch(`${host}/users/${userId}/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка подтверждения пользователя');
            }
            return response.json();
        })
        .then(() => {
            // Обновляем данные
            get_users();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось подтвердить пользователя');
        });
    }

    // Функция назначения преподавателем
    function makeTeacher(userId) {
        const jwtToken = getCookie('jwt_token');
        const host = "https://olympiad-api.falpin.ru";
        
        fetch(`${host}/users/${userId}/make-teacher`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка назначения преподавателем');
            }
            return response.json();
        })
        .then(() => {
            // Обновляем данные
            get_users();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось назначить преподавателем');
        });
    }

    // Настройка поиска для всех контейнеров
    function setupSearch() {
        // Поиск для участников
        document.querySelector('#student #user-search')?.addEventListener('input', (e) => {
            searchUsers(
                e.target.value,
                '#student #approved-users-container',
                user => user.is_approved && !user.is_teacher,
                'Нет подтвержденных участников'
            );
        });
        
        // Поиск для подтверждения
        document.querySelector('#part #user-search')?.addEventListener('input', (e) => {
            searchUsers(
                e.target.value,
                '#part #pending-users-container',
                user => !user.is_approved && !user.is_teacher,
                'Нет пользователей для подтверждения'
            );
        });
        
        // Поиск для преподавателей
        document.querySelector('#teachers #user-search')?.addEventListener('input', (e) => {
            searchUsers(
                e.target.value,
                '#teachers #teachers-container',
                user => user.is_teacher && user.is_approved,
                'Нет подтвержденных преподавателей'
            );
        });
        
        // Поиск для назначения преподавателями
        document.querySelector('#activate_teachers #user-search')?.addEventListener('input', (e) => {
            searchUsers(
                e.target.value,
                '#activate_teachers #activate-teachers-container',
                user => user.is_approved && !user.is_teacher,
                'Нет пользователей для назначения преподавателями'
            );
        });
    }

    // Универсальная функция поиска
    function searchUsers(searchTerm, containerSelector, conditionFn, emptyMessage) {
        if (!searchTerm) {
            // Если поиск пустой, показываем всех
            displayUsersByCondition(containerSelector, conditionFn, emptyMessage);
            return;
        }
        
        const searchLower = searchTerm.toLowerCase();
        const filteredUsers = allUsers.filter(user => {
            if (!conditionFn(user)) return false;
            
            const fullName = `${user.last_name} ${user.first_name} ${user.patronymic}`.toLowerCase();
            return fullName.includes(searchLower) || 
                   user.email.toLowerCase().includes(searchLower) ||
                   user.school.toLowerCase().includes(searchLower);
        });
        
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        container.innerHTML = '';
        
        if (filteredUsers.length === 0) {
            container.innerHTML = `<p>${emptyMessage}</p>`;
            return;
        }

        filteredUsers.forEach(user => {
            const card = document.createElement('div');
            card.className = 'row';
            card.dataset.userId = user.id;

            card.innerHTML = `
                <h4>${user.last_name} ${user.first_name} ${user.patronymic}</h4>
                <h4>${user.email}</h4>
                <h4>Школа: ${user.school}</h4>
                ${user.is_teacher ? '<h4>Статус: Преподаватель</h4>' : ''}
            `;

            container.appendChild(card);
        });
    }

    // Инициализация при загрузке
    document.addEventListener('DOMContentLoaded', () => {
        // Добавляем контейнеры в DOM (если их нет в HTML)
        addContainersToDOM();
        get_users();
        setupSearch();
    });

    // Добавляем контейнеры для пользователей, если их нет в HTML
    function addContainersToDOM() {
        if (!document.querySelector('#student #approved-users-container')) {
            const studentDiv = document.querySelector('#student');
            if (studentDiv) {
                const container = document.createElement('div');
                container.id = 'approved-users-container';
                studentDiv.appendChild(container);
            }
        }
        
        if (!document.querySelector('#part #pending-users-container')) {
            const partDiv = document.querySelector('#part');
            if (partDiv) {
                const container = document.createElement('div');
                container.id = 'pending-users-container';
                partDiv.appendChild(container);
            }
        }
        
        if (!document.querySelector('#teachers #teachers-container')) {
            const teachersDiv = document.querySelector('#teachers');
            if (teachersDiv) {
                const container = document.createElement('div');
                container.id = 'teachers-container';
                teachersDiv.appendChild(container);
            }
        }
        
        if (!document.querySelector('#activate_teachers #activate-teachers-container')) {
            const activateDiv = document.querySelector('#activate_teachers');
            if (activateDiv) {
                const container = document.createElement('div');
                container.id = 'activate-teachers-container';
                activateDiv.appendChild(container);
            }
        }
    }
