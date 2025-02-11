function initTheme() {
  // Check for saved theme preference or default to light
  const theme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Update toggle button icons
  updateToggleButton(newTheme);
}

function updateToggleButton(theme) {
  const sunIcon = document.querySelector(".theme-toggle .fa-sun");
  const moonIcon = document.querySelector(".theme-toggle .fa-moon");

  if (theme === "dark") {
    sunIcon.style.display = "inline-block";
    moonIcon.style.display = "none";
  } else {
    sunIcon.style.display = "none";
    moonIcon.style.display = "inline-block";
  }
}

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const currentTheme = initTheme();
  updateToggleButton(currentTheme);
});

// Get the toggle checkbox
const themeToggle = document.getElementById("theme");

// Function to set theme
function setTheme(isDark) {
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );
  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggle.checked = isDark;
}

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme === "dark");

// Listen for toggle changes
themeToggle.addEventListener("change", (e) => {
  setTheme(e.target.checked);
});

// Also check system preference
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
prefersDark.addEventListener("change", (e) => {
  setTheme(e.matches);
});
