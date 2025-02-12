document.addEventListener("DOMContentLoaded", function () {
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".slider-nav.prev");
  const nextBtn = document.querySelector(".slider-nav.next");

  let currentPosition = 0;
  const slideWidth = slides[0].offsetWidth + 20; // Include gap
  const maxPosition = -(slides.length - 3) * slideWidth; // Show 3 slides at once

  function updateSliderPosition() {
    sliderWrapper.style.transform = `translateX(${currentPosition}px)`;

    // Update button states
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>'; // Font Awesome icon
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>'; // Font Awesome icon
    // Disable/enable buttons based on position
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

  // Initial button state
  updateSliderPosition();

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Update maxPosition on window resize
  window.addEventListener(
    "resize",
    debounce(() => {
      const newSlideWidth = slides[0].offsetWidth + 20;
      const visibleSlides =
        window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 3;
      maxPosition = -(slides.length - visibleSlides) * newSlideWidth;
      updateSliderPosition();
    }, 100)
  );
});
