// Простой скрипт для загрузки шапки, подвала и темы
(function() {
  // Тема: применяем сразу, чтобы минимизировать мигание
  (function initTheme() {
    var saved = localStorage.getItem('acnh-theme');
    var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('acnh-theme', theme);
  }

  function toggleTheme() {
    var next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    updateThemeToggleUI();
  }

  function updateThemeToggleUI() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var icon = btn.querySelector('.theme-toggle-icon');
    var isDark = getTheme() === 'dark';
    if (icon) {
      icon.textContent = isDark ? '☀' : '☽';
    }
    btn.setAttribute('aria-label', isDark ? 'Переключить светлую тему' : 'Переключить тёмную тему');
    btn.setAttribute('title', isDark ? 'Светлая тема' : 'Тёмная тема');
  }

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
        // Инициализируем переключатель темы
        updateThemeToggleUI();
        var themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
          themeBtn.addEventListener('click', toggleTheme);
        }
      }
      // После шапки загружаем overlay поиска
      return fetch(componentsPath + 'search-overlay.html');
    })
    .then(response => response.text())
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);
      var script = document.createElement('script');
      script.src = componentsPath + 'search-in-page.js';
      script.onload = function() {
        if (typeof window.initSearchInPage === 'function') window.initSearchInPage();
      };
      document.body.appendChild(script);
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
  
  // Загружаем кнопку «Наверх» и настраиваем логику
  fetch('/components/back-to-top.html')
    .then(response => response.text())
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);
      const btn = document.getElementById('back-to-top-btn');
      if (!btn) return;

      const scrollThreshold = 400;
      const toc = document.querySelector('.qa-preface');

      function toggleVisibility() {
        if (window.scrollY > scrollThreshold) {
          btn.classList.add('back-to-top--visible');
          btn.setAttribute('aria-hidden', 'false');
          btn.removeAttribute('tabindex');
        } else {
          btn.classList.remove('back-to-top--visible');
          btn.setAttribute('aria-hidden', 'true');
          btn.setAttribute('tabindex', '-1');
        }
      }

      function scrollToTop() {
        if (toc) {
          toc.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }

      toggleVisibility();
      window.addEventListener('scroll', toggleVisibility, { passive: true });
      btn.addEventListener('click', scrollToTop);
    })
    .catch(err => console.error('Ошибка загрузки кнопки «Наверх»:', err));
})();
