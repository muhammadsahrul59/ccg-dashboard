// login.js
const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";

// Initialize Supabase client - Fixed the initialization
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

const BASE_URL = window.location.origin;
const INDEX_PATH = "/index.html";

// Add loading state management
let isLoading = false;

// Helper function to show errors
const showError = (message) => {
  // You might want to replace this with a more user-friendly error display
  alert(message);
};

// Helper function to manage button state
const setButtonLoading = (button, loading) => {
  button.disabled = loading;
  button.innerHTML = loading ? "Loading..." : button.dataset.originalText;
};

// Login with Google
const loginGoogle = document.getElementById("login-google");
loginGoogle.dataset.originalText = loginGoogle.innerHTML;

loginGoogle.addEventListener("click", async function (event) {
  event.preventDefault();

  if (isLoading) return;
  isLoading = true;
  setButtonLoading(loginGoogle, true);

  try {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${BASE_URL}${INDEX_PATH}`,
      },
    });

    if (error) throw error;

    // Set notification flag before OAuth redirect
    handleLoginSuccess();
  } catch (error) {
    showError("Failed to sign in with Google. Please try again.");
    console.error("Google Sign In Error:", error.message);
  } finally {
    isLoading = false;
    setButtonLoading(loginGoogle, false);
  }
});

// Submit button for email/password login
const submit = document.getElementById("submit");
submit.dataset.originalText = submit.innerHTML;

function handleLoginSuccess() {
  sessionStorage.setItem("showLoginNotification", "true");
}

submit.addEventListener("click", async function (event) {
  event.preventDefault();

  if (isLoading) return;

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Input validation
  if (!email || !password) {
    showError("Please enter both email and password!");
    return;
  }

  if (!isValidEmail(email)) {
    showError("Please enter a valid email address!");
    return;
  }

  isLoading = true;
  setButtonLoading(submit, true);

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Set notification flag before redirect
    handleLoginSuccess();

    // Redirect to dashboard
    window.location.href = BASE_URL + INDEX_PATH;
  } catch (error) {
    showError("Invalid email or password. Please try again.");
    console.error("Login Error:", error.message);
  } finally {
    isLoading = false;
    setButtonLoading(submit, false);
  }
});

// Email validation helper
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Password validation
const passwordInput = document.getElementById("password");
const passwordChecklist = {
  length: document.getElementById("length-check"),
  uppercase: document.getElementById("uppercase-check"),
  special: document.getElementById("special-check"),
};

function validatePassword(password) {
  const rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  Object.keys(rules).forEach((rule) => {
    const element = passwordChecklist[rule];
    if (!element) return;

    if (rules[rule]) {
      element.classList.add("valid");
      const icon = element.querySelector("i");
      if (icon) icon.className = "fa fa-check-circle";
    } else {
      element.classList.remove("valid");
      const icon = element.querySelector("i");
      if (icon) icon.className = "fa fa-times-circle";
    }
  });

  submit.disabled = !Object.values(rules).every(Boolean);
}

passwordInput.addEventListener("input", (e) =>
  validatePassword(e.target.value)
);

// Password visibility toggle
const togglePassword = document.getElementById("toggle-password");

togglePassword.addEventListener("click", () => {
  const isPasswordHidden = passwordInput.type === "password";
  passwordInput.type = isPasswordHidden ? "text" : "password";
  togglePassword.className = isPasswordHidden
    ? "fa-solid fa-eye position-absolute end-0 top-75 translate-middle-y me-3"
    : "fa-solid fa-eye-slash position-absolute end-0 top-75 translate-middle-y me-3";
});
