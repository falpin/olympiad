window.loading = function(form, isLoading) {
    const loaderId = 'form-loader';
    
    if (isLoading) {
        // Создаем элемент для крутящегося индикатора
        const spinner = document.createElement('span');
        spinner.className = 'spinner';
        spinner.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3.5A6.5 6.5 0 0 0 3.5 10 .75.75 0 0 1 2 10a8 8 0 1 1 8 8 .75.75 0 0 1 0-1.5 6.5 6.5 0 1 0 0-13Z"/>
            </svg>
        `;
        
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.dataset.previousHtml = submitButton.innerHTML;
        
        // Очищаем кнопку и добавляем спиннер
        submitButton.innerHTML = '';
        submitButton.appendChild(spinner);
    } else {
        const loader = document.getElementById(loaderId);
        if (loader) loader.remove();
        
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            if (submitButton.dataset.previousHtml) {
                submitButton.innerHTML = submitButton.dataset.previousHtml;
            }
        }
    }
};