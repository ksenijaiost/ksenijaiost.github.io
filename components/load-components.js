// Простой скрипт для загрузки шапки и подвала
(function() {
  // Используем абсолютные пути от корня
  const componentsPath = '/components/';
  
  // Загружаем шапку
  fetch(componentsPath + 'header.html')
    .then(response => response.text())
    .then(html => {
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) {
        headerPlaceholder.outerHTML = html;
        // Устанавливаем aria-current для активной ссылки
        const currentPath = window.location.pathname;
        const homeLink = document.getElementById('header-home-link');
        if (homeLink && (currentPath === '/' || currentPath.endsWith('/index.html'))) {
          homeLink.setAttribute('aria-current', 'page');
        }
      }
    })
    .catch(err => console.error('Ошибка загрузки шапки:', err));
  
  // Загружаем подвал
  fetch('/components/footer.html')
    .then(response => response.text())
    .then(html => {
      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (footerPlaceholder) {
        footerPlaceholder.outerHTML = html;
      }
    })
    .catch(err => console.error('Ошибка загрузки подвала:', err));
})();
