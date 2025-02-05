import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";
const supabase = createClient(supabaseUrl, supabaseKey);

// Define base URL for redirects
const BASE_URL = window.location.origin;
const EMAIL_VER_PATH = "/src/auth/email-verification.html";

// Submit button handler
const submit = document.getElementById("submit");
submit.addEventListener("click", async function (event) {
  event.preventDefault();

  // Get inputs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Check if email or password is empty
  if (email === "" || password === "") {
    alert("Please Input Email and Password!");
    return;
  }

  try {
    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${BASE_URL}${EMAIL_VER_PATH}`,
      },
    });

    if (error) throw error;

    // Redirect to email verification page
    window.location.href = BASE_URL + EMAIL_VER_PATH;
  } catch (error) {
    // Handle specific error cases
    if (error.message.includes("already registered")) {
      alert("This email is already registered!");
    } else if (error.message.includes("password")) {
      alert(
        "Password should be at least 8 characters and contain uppercase & special characters!"
      );
    } else {
      alert(error.message);
    }
  }
});

// Password validation
const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submit");
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
    if (rules[rule]) {
      passwordChecklist[rule].classList.add("valid");
      passwordChecklist[rule].querySelector("i").className = "fa fa-check";
    } else {
      passwordChecklist[rule].classList.remove("valid");
      passwordChecklist[rule].querySelector("i").className = "fa fa-times";
    }
  });

  // Enable submit button if all rules are valid
  submitButton.disabled = !Object.values(rules).every(Boolean);
}

passwordInput.addEventListener("input", (e) =>
  validatePassword(e.target.value)
);

// Toggle password visibility
const togglePassword = document.getElementById("toggle-password");
togglePassword.addEventListener("click", () => {
  const isPasswordHidden = passwordInput.type === "password";
  passwordInput.type = isPasswordHidden ? "text" : "password";

  // Update icon
  togglePassword.className = isPasswordHidden
    ? "fa-solid fa-eye position-absolute end-0 top-35 translate-middle-y me-3"
    : "fa-solid fa-eye-slash position-absolute end-0 top-35 translate-middle-y me-3";
});
