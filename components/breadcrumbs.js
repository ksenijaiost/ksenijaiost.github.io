/* Хлебные крошки: Главная → Раздел → Страница */
(function() {
  function initBreadcrumbs() {
    var main = document.getElementById('content');
    if (!main) return;

    var pathname = window.location.pathname;
    if (pathname.endsWith('/index.html')) pathname = pathname.replace(/\/index\.html$/, '/');
    if (!pathname.endsWith('/') && pathname !== '/') pathname = pathname + '/';

    var isHome = pathname === '/' || pathname === '';
    if (isHome) return;

    fetch('/data/breadcrumbs.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var sections = data.sections || {};
        var pages = data.pages || {};
        var pageLabel = pages[pathname];
        if (!pageLabel) return;

        var parts = pathname.split('/').filter(Boolean);
        var sectionKey = parts[0];
        var section = sections[sectionKey];
        if (!section) return;

        var nav = document.createElement('nav');
        nav.className = 'breadcrumbs';
        nav.setAttribute('aria-label', 'Хлебные крошки');

        var items = [];

        items.push({ label: 'Главная', href: '/' });

        if (sectionKey !== 'support') {
          items.push({ label: section.label, href: section.href });
        }

        items.push({ label: pageLabel, href: null });

        var html = '<div class="container breadcrumbs-inner">';
        items.forEach(function(item, i) {
          if (i > 0) html += '<span class="breadcrumbs-sep" aria-hidden="true">→</span>';
          if (item.href) {
            html += '<a href="' + item.href + '">' + escapeHtml(item.label) + '</a>';
          } else {
            html += '<span class="breadcrumbs-current" aria-current="page">' + escapeHtml(item.label) + '</span>';
          }
        });
        html += '</div>';

        nav.innerHTML = html;
        main.insertBefore(nav, main.firstChild);
      })
      .catch(function() {});
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBreadcrumbs);
  } else {
    initBreadcrumbs();
  }
})();
