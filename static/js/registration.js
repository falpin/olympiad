const form = document.getElementById("registrationForm");

async function handleRegistrationSubmit(e) {
    e.preventDefault();
    const formData = new FormData(form);
    window.loading(form, true);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('https://olympiad-api.falpin.ru/register', {
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
        } else {
            showNotification(result.message);
            window.loading(form, false);
        }
    } catch (error) {
        window.loading(form, false);
    }
}

form.addEventListener('submit', handleRegistrationSubmit);