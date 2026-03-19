/* Поиск по странице: подсветка, навигация, счётчик */
(function() {
  var HIGHLIGHT_CLASS = 'search-highlight';
  var CURRENT_CLASS = 'search-highlight-current';

  function $(id) { return document.getElementById(id); }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function clearHighlights() {
    var marks = document.querySelectorAll('.' + HIGHLIGHT_CLASS);
    marks.forEach(function(mark) {
      var parent = mark.parentNode;
      var text = document.createTextNode(mark.textContent);
      parent.replaceChild(text, mark);
      parent.normalize();
    });
  }

  function highlightMatches(query) {
    clearHighlights();
    if (!query || !query.trim()) return [];

    var container = document.getElementById('content');
    if (!container) return [];

    var regex = new RegExp('(' + escapeRegex(query.trim()) + ')', 'gi');
    var marks = [];
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);

    var textNodes = [];
    var node;
    while (node = walker.nextNode()) {
      if (node.parentNode && (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE')) continue;
      if (node.textContent.trim()) textNodes.push(node);
    }

    textNodes.forEach(function(textNode) {
      var text = textNode.textContent;
      var match;
      var lastIndex = 0;
      var fragment = document.createDocumentFragment();

      regex.lastIndex = 0;
      while ((match = regex.exec(text)) !== null) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        var mark = document.createElement('mark');
        mark.className = HIGHLIGHT_CLASS;
        mark.textContent = match[0];
        fragment.appendChild(mark);
        marks.push(mark);
        lastIndex = regex.lastIndex;
      }
      if (lastIndex > 0) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    });

    return marks;
  }

  function updateCounter(current, total) {
    var el = $('search-counter');
    if (el) el.textContent = total === 0 ? '0 из 0' : (current + 1) + ' из ' + total;
  }

  function setCurrentHighlight(marks, index) {
    marks.forEach(function(m, i) {
      m.classList.toggle(CURRENT_CLASS, i === index);
    });
    if (marks[index]) {
      marks[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function initSearch() {
    var overlay = $('search-overlay');
    var input = $('search-input');
    var prevBtn = $('search-prev');
    var nextBtn = $('search-next');
    var closeBtn = $('search-close');
    var backdrop = $('search-overlay-backdrop');
    var toggleBtn = $('search-toggle');

    if (!overlay || !input || !toggleBtn) return;

    var marks = [];
    var currentIndex = 0;

    function runSearch() {
      var query = input.value;
      marks = highlightMatches(query);
      currentIndex = marks.length > 0 ? 0 : -1;
      updateCounter(currentIndex, marks.length);
      prevBtn.disabled = nextBtn.disabled = marks.length <= 1;
      setCurrentHighlight(marks, currentIndex);
    }

    function openOverlay() {
      overlay.classList.add('search-overlay--open');
      overlay.setAttribute('aria-hidden', 'false');
      input.value = '';
      runSearch();
      input.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeOverlay() {
      overlay.classList.remove('search-overlay--open');
      overlay.setAttribute('aria-hidden', 'true');
      clearHighlights();
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openOverlay);
    closeBtn.addEventListener('click', closeOverlay);
    backdrop.addEventListener('click', closeOverlay);

    input.addEventListener('input', function() {
      runSearch();
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeOverlay();
        e.preventDefault();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          if (prevBtn && !prevBtn.disabled) prevBtn.click();
        } else {
          if (nextBtn && !nextBtn.disabled) nextBtn.click();
        }
      }
    });

    prevBtn.addEventListener('click', function() {
      if (marks.length === 0) return;
      currentIndex = currentIndex <= 0 ? marks.length - 1 : currentIndex - 1;
      updateCounter(currentIndex, marks.length);
      setCurrentHighlight(marks, currentIndex);
    });

    nextBtn.addEventListener('click', function() {
      if (marks.length === 0) return;
      currentIndex = currentIndex >= marks.length - 1 ? 0 : currentIndex + 1;
      updateCounter(currentIndex, marks.length);
      setCurrentHighlight(marks, currentIndex);
    });
  }

  window.initSearchInPage = initSearch;
})();
