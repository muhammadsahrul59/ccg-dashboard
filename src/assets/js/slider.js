document.addEventListener("DOMContentLoaded", function () {
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".slider-nav.prev");
  const nextBtn = document.querySelector(".slider-nav.next");

  let currentPosition = 0;
  let slideWidth = slides[0].offsetWidth + 20; // Use let
  let maxPosition = calculateMaxPosition(); // Initialize with function

  function calculateMaxPosition() {
    const visibleSlides =
      window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
    return -(slides.length - visibleSlides) * slideWidth;
  }

  function updateSliderPosition() {
    sliderWrapper.style.transform = `translateX(${currentPosition}px)`;
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    prevBtn.disabled = currentPosition === 0;
    nextBtn.disabled = currentPosition === maxPosition;
  }

  prevBtn.addEventListener("click", () => {
    currentPosition = Math.min(currentPosition + slideWidth, 0);
    updateSliderPosition();
  });

  nextBtn.addEventListener("click", () => {
    currentPosition = Math.max(currentPosition - slideWidth, maxPosition);
    updateSliderPosition();
  });

  updateSliderPosition();

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  window.addEventListener(
    "resize",
    debounce(() => {
      slideWidth = slides[0].offsetWidth + 20; // Update slideWidth
      maxPosition = calculateMaxPosition(); // Recalculate maxPosition
      updateSliderPosition();
    }, 100)
  );
});
