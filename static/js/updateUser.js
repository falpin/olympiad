function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function updateUserData() {
    const jwtToken = getCookie('jwt_token');

    if (!jwtToken) {
        console.error('JWT токен не найден в куках');
        return;
    }

    fetch('https://olympiad-api.falpin.ru/profile', {
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
            throw new Error(errorText); });
        }
        return response.json();
    })
    .then(result => {
        updateProfileLink();
        localStorage.setItem('user', JSON.stringify(result));

        const userData = localStorage.getItem('user');    
        const user = JSON.parse(userData);
        fillElements('first_name', user.first_name || '');
        fillElements('last_name', user.last_name || '');
        fillElements('patronymic', user.patronymic || '');
        fillElements('username', `${user.first_name} ${user.patronymic} ${user.last_name}` || '');
        fillElements('email', user.email || '');
        fillElements('phone', user.phone || '');
        fillElements('school', user.school || '');
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}

function updateProfileLink() {
    const profileLink = document.querySelector('a[href="/login"]');
    if (profileLink) {
        profileLink.href = "/profile-st";
    }
}

function fillElements(className, value) {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(el => el.textContent = value);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    updateUserData();
    if (localStorage.getItem('user')) {
        updateProfileLink();
    }
});

window.updateUserData = updateUserData;
window.getCookie = getCookie;