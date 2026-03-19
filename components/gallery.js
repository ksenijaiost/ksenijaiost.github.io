// Универсальная галерея для переиспользования на разных страницах
// Работает с любым контейнером, имеющим класс .gallery-container или .diy-gallery-container
// Кнопки-точки (gallery-dots) генерируются автоматически по числу слайдов — в HTML достаточно пустого <div class="gallery-dots"></div>
(function() {
  const dotClass = 'gallery-dot';
  const dotClassDiy = 'diy-gallery-dot';
  const dotsContainerClass = 'gallery-dots';
  const dotsContainerClassDiy = 'diy-gallery-dots';

  function initGallery(container) {
    let currentSlide = 0;
    const slides = container.querySelectorAll('.gallery-slide, .diy-gallery-slide');
    const isDiy = container.classList.contains('diy-gallery-container');
    const dotClassName = isDiy ? dotClassDiy : dotClass;
    const dotsContainerSelector = isDiy ? '.' + dotsContainerClassDiy : '.' + dotsContainerClass;
    const dotsContainer = container.querySelector(dotsContainerSelector);

    if (slides.length === 0) return;

    // Генерируем кнопки-точки по числу слайдов, если контейнер пуст или точек не хватает
    if (dotsContainer) {
      const existingDots = dotsContainer.querySelectorAll('.' + dotClassName);
      if (existingDots.length !== slides.length) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < slides.length; i++) {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = dotClassName + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
          dotsContainer.appendChild(dot);
        }
      }
    }

    const dots = container.querySelectorAll('.' + dotClassName);
    const prevBtn = container.querySelector('.gallery-btn[aria-label="Предыдущий"], #diy-prev, .gallery-btn:first-of-type');
    const nextBtn = container.querySelector('.gallery-btn[aria-label="Следующий"], #diy-next, .gallery-btn:last-of-type');

    function showSlide(index) {
      // Скрываем все слайды
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      // Показываем нужный слайд
      if (slides[index]) {
        slides[index].classList.add('active');
      }
      if (dots[index]) {
        dots[index].classList.add('active');
      }

      // Обновляем состояние кнопок
      if (prevBtn) {
        prevBtn.disabled = index === 0;
      }
      if (nextBtn) {
        nextBtn.disabled = index === slides.length - 1;
      }
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    }

    function goToSlide(index) {
      currentSlide = index;
      showSlide(currentSlide);
    }

    // Обработчики событий
    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }

    // Обработчики для точек
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });

    // Показываем первый слайд
    showSlide(0);
  }

  // Инициализируем все галереи на странице
  const galleries = document.querySelectorAll('.gallery-container, .diy-gallery-container');
  galleries.forEach(initGallery);
})();
