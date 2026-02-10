// Универсальная галерея для переиспользования на разных страницах
// Работает с любым контейнером, имеющим класс .gallery-container или .diy-gallery-container
(function() {
  // Инициализируем все галереи на странице
  function initGallery(container) {
    let currentSlide = 0;
    const slides = container.querySelectorAll('.gallery-slide, .diy-gallery-slide');
    const dots = container.querySelectorAll('.gallery-dot, .diy-gallery-dot');
    const prevBtn = container.querySelector('.gallery-btn[aria-label="Предыдущий"], #diy-prev, .gallery-btn:first-of-type');
    const nextBtn = container.querySelector('.gallery-btn[aria-label="Следующий"], #diy-next, .gallery-btn:last-of-type');

    if (slides.length === 0) return;

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
