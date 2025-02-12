// Dark mode functionality
document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", theme);

  const themeToggle = document.getElementById("themeToggle");
  const themeCheckbox = document.getElementById("theme");
  const sunIcon = document.querySelector(".toggle-handle .fa-sun");
  const moonIcon = document.querySelector(".toggle-handle .fa-moon");

  // Set initial state
  if (theme === "dark") {
    themeToggle.classList.add("dark");
    themeCheckbox.checked = true;
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  }

  themeCheckbox.addEventListener("change", () => {
    const isDark = themeCheckbox.checked;
    const newTheme = isDark ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggle.classList.toggle("dark", isDark);

    sunIcon.style.display = isDark ? "none" : "block";
    moonIcon.style.display = isDark ? "block" : "none";
  });

  // System preference detection
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  prefersDark.addEventListener("change", (e) => {
    const isDark = e.matches;
    themeCheckbox.checked = isDark;
    themeToggle.classList.toggle("dark", isDark);
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
    localStorage.setItem("theme", isDark ? "dark" : "light");

    sunIcon.style.display = isDark ? "none" : "block";
    moonIcon.style.display = isDark ? "block" : "none";
  });
});
