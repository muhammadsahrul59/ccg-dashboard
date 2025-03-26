document.addEventListener("DOMContentLoaded", () => {
  // Create and append the Font Awesome CSS (if not already loaded)
  const fontAwesomeCSS = document.createElement("link");
  fontAwesomeCSS.rel = "stylesheet";
  fontAwesomeCSS.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  document.head.appendChild(fontAwesomeCSS);

  // Create container for the button
  const backToTopContainer = document.createElement("div");
  backToTopContainer.classList.add("back-to-top-container");

  // Create the button with Font Awesome rocket icon
  const backToTopButton = document.createElement("button");
  backToTopButton.classList.add("back-to-top-button");
  backToTopButton.innerHTML = '<i class="fas fa-rocket"></i>';
  backToTopButton.setAttribute("aria-label", "Back to top");

  // Add styles
  const style = document.createElement("style");
  style.textContent = `
      .back-to-top-container {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 9999;
        transition: all 0.3s ease;
      }
      
      .back-to-top-button {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00a39d, #7fd1ce);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
        font-size: 24px;
      }
      
      .back-to-top-button:hover {
        transform: scale(1.1) translateY(-5px);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
      }
      
      .back-to-top-button.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .back-to-top-button:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.5);
      }
      
      @media (max-width: 768px) {
        .back-to-top-container {
          bottom: 20px;
          right: 20px;
        }
        
        .back-to-top-button {
          width: 48px;
          height: 48px;
          font-size: 20px;
        }
      }
    `;
  document.head.appendChild(style);

  // Add button to container and to body
  backToTopContainer.appendChild(backToTopButton);
  document.body.appendChild(backToTopContainer);

  // Show/hide button based on scroll position
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleVisibility);

  // Initial check in case page loads with scroll
  toggleVisibility();

  // Smooth scroll to top
  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Add animation when button appears
  backToTopButton.addEventListener("transitionend", () => {
    if (backToTopButton.classList.contains("visible")) {
      backToTopButton.classList.add("animate");
      setTimeout(() => {
        backToTopButton.classList.remove("animate");
      }, 1000);
    }
  });
});
