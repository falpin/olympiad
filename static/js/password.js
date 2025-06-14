document.querySelector('.generate-btn').addEventListener('click', function () {
   const fullnameInput = document.querySelector('.fullname');
   const phoneInput = document.querySelector('.phone');
   const loginResult = document.querySelector('.login-result');
   const passwordResult = document.querySelector('.password-result');
   const credentialsBox = document.querySelector('.credentials');

   const fullname = fullnameInput.value.trim();
   const phone = phoneInput.value.trim();

   if (!fullname) {
     alert('Введите ФИО');
     return;
   }

   // Генерация логина (берём первую букву имени и фамилию)
   const nameParts = fullname.split(' ');
   let username = '';
   if (nameParts.length >= 2) {
     const surname = nameParts[0].toLowerCase();
     const initial = nameParts[1].charAt(0).toLowerCase();
     username = surname + initial + Math.floor(Math.random() * 100);
   } else {
     username = fullname.toLowerCase() + Math.floor(Math.random() * 100);
   }

   // Генерация пароля
   const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
   let password = '';
   for (let i = 0; i < 10; i++) {
     password += chars.charAt(Math.floor(Math.random() * chars.length));
   }

   // Выводим результат
   loginResult.textContent = username;
   passwordResult.textContent = password;
   credentialsBox.style.display = 'block';
 });