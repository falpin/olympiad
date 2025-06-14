document.querySelectorAll('.menu-icon').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href'); // Получаем ID целевого блока
        const allBlocks = document.querySelectorAll('.second-block > div');

        // Скрываем все блоки
        allBlocks.forEach(block => {
            block.style.display = 'none';
        });

        // Отображаем нужный блок
        const targetBlock = document.querySelector(targetId);
        if (targetBlock) {
            targetBlock.style.display = 'block';
        }
    });
});