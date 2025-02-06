import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";

const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const form = document.getElementById("passwordForm");
  const submitBtn = document.getElementById("submit-btn");
  const confirmPasswordError = document.getElementById(
    "confirm-password-error"
  );

  // Password requirement checks
  const lengthCheck = document.getElementById("length-check");
  const uppercaseCheck = document.getElementById("uppercase-check");
  const specialCheck = document.getElementById("special-check");

  const requirements = [lengthCheck, uppercaseCheck, specialCheck];
  let rules = {
    length: false,
    uppercase: false,
    special: false,
  };

  function validatePassword(password) {
    // Check length
    rules.length = password.length >= 8;
    if (rules.length) {
      lengthCheck.classList.add("valid");
      lengthCheck.querySelector("i").className = "fa fa-check-circle";
    } else {
      lengthCheck.classList.remove("valid");
      lengthCheck.querySelector("i").className = "fa fa-times-circle";
    }

    // Check uppercase
    rules.uppercase = /[A-Z]/.test(password);
    if (rules.uppercase) {
      uppercaseCheck.classList.add("valid");
      uppercaseCheck.querySelector("i").className = "fa fa-check-circle";
    } else {
      uppercaseCheck.classList.remove("valid");
      uppercaseCheck.querySelector("i").className = "fa fa-times-circle";
    }

    // Check special character
    rules.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (rules.special) {
      specialCheck.classList.add("valid");
      specialCheck.querySelector("i").className = "fa fa-check-circle";
    } else {
      specialCheck.classList.remove("valid");
      specialCheck.querySelector("i").className = "fa fa-times-circle";
    }

    // Return true if all requirements are met
    return Object.values(rules).every(Boolean);
  }

  function validateConfirmPassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
      confirmPasswordError.classList.remove("d-none");
      submitBtn.disabled = true;
    } else {
      confirmPasswordError.classList.add("d-none");
      checkFormValidity();
    }
  }

  function checkFormValidity() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const isValid = validatePassword(password) && password === confirmPassword;
    submitBtn.disabled = !isValid;
  }

  // Toggle password visibility functions
  function setupPasswordToggle(inputId, eyeId) {
    const input = document.getElementById(inputId);
    const eyeIcon = document.getElementById(eyeId);

    eyeIcon.addEventListener("click", () => {
      const isPasswordHidden = input.type === "password";
      input.type = isPasswordHidden ? "text" : "password";
      eyeIcon.className = isPasswordHidden
        ? "fa-solid fa-eye position-absolute end-0 top-55 translate-middle-y me-3"
        : "fa-solid fa-eye-slash position-absolute end-0 top-55 translate-middle-y me-3";
    });
  }

  // Set up password toggles
  setupPasswordToggle("password", "toggle-password");
  setupPasswordToggle("confirm-password", "toggle-confirm-password");

  // Add input event listeners
  passwordInput.addEventListener("input", () => {
    validatePassword(passwordInput.value);
    validateConfirmPassword();
  });

  confirmPasswordInput.addEventListener("input", validateConfirmPassword);

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password doesn't meet all requirements!");
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      alert("Password updated successfully!");
      window.location.href = "/src/auth/authentication-login.html";
    } catch (error) {
      console.error("Error updating password:", error.message);
      alert(
        "Your new password matches the previous one. Please choose a different password."
      );
    }
  });
});
