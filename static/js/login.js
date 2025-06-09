const form = document.getElementById("loginForm");

async function handleLoginSubmit(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('https://olympiad-api.falpin.ru/login ', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            showNotification(result.error || result.message || "Произошла ошибка");
            window.loading(form, false);
        }

        else{
            document.cookie = `jwt_token=${result.token}; path=/; SameSite=Strict`;
            updateUserData();
            window.location.href = '/profile-st';
            window.loading(form, false);
        }
    } catch (error) {
        window.loading(form, false);
    }
}

form.addEventListener('submit', handleLoginSubmit);