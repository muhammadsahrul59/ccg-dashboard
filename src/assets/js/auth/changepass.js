import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to toggle password visibility
function setupPasswordToggle(inputId, toggleId) {
  const passwordInput = document.getElementById(inputId);
  const toggleButton = document.getElementById(toggleId);

  if (passwordInput && toggleButton) {
    toggleButton.addEventListener("click", function () {
      // Toggle password visibility
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      // Toggle icon
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });
  }
}

// Function to check password strength
function checkPassword(password) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Update checklist items
  document
    .getElementById("length-check")
    .classList.toggle("valid", checks.length);
  document
    .getElementById("uppercase-check")
    .classList.toggle("valid", checks.uppercase);
  document
    .getElementById("special-check")
    .classList.toggle("valid", checks.special);

  // Update icons
  document.querySelectorAll(".password-checklist li").forEach((item) => {
    if (item.classList.contains("valid")) {
      item.querySelector("i").classList.remove("fa-times-circle");
      item.querySelector("i").classList.add("fa-check-circle");
    } else {
      item.querySelector("i").classList.remove("fa-check-circle");
      item.querySelector("i").classList.add("fa-times-circle");
    }
  });
}

// Function to show notification
function showNotification(type, message) {
  const notification = document.createElement("div");
  notification.className = `modern-toast ${type}`;
  notification.innerHTML = `
    <div class="toast-icon">${type === "error" ? "✖" : "✔"}</div>
    <div class="toast-content">
      <p class="toast-message">${message}</p>
    </div>
    <div class="progress-bar"></div>
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 3000);
}

// Setup event listeners when document loads
document.addEventListener("DOMContentLoaded", function () {
  // Setup password toggles for all password fields
  setupPasswordToggle("oldPassword", "toggle-old-password");
  setupPasswordToggle("newPassword", "toggle-new-password");
  setupPasswordToggle("confirmPassword", "toggle-confirm-password");

  // Setup password strength checker
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  passwordInputs.forEach((input) => {
    input.addEventListener("input", (e) => checkPassword(e.target.value));
  });
});

// Change Password

// Get form element
const changePasswordForm = document.getElementById("changePasswordForm");

// Add submit event listener to form
changePasswordForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Get input values
  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validate new password matches confirm password
  if (newPassword !== confirmPassword) {
    showNotification("error", "Passwords do not match.");
    return;
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    // Show success message
    showNotification("success", "Password successfully updated!");

    // Clear form
    changePasswordForm.reset();

    // Hide any error messages
    const passwordError = document.getElementById("passwordError");
    passwordError.style.display = "none";
  } catch (error) {
    console.error("Error updating password:", error);

    // Show appropriate error message based on error code
    if (error.message.includes("Password should be at least")) {
      showNotification(
        "error",
        "The new password is too weak. Please choose a stronger password."
      );
    } else {
      showNotification(
        "error",
        "An error occurred while updating the password. Please try again."
      );
    }
  }
});

// Password validation
document.getElementById("newPassword").addEventListener("input", function () {
  const password = this.value;

  // Validate password requirements
  const hasLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Update checklist items
  document.getElementById("length-check").classList.toggle("valid", hasLength);
  document
    .getElementById("uppercase-check")
    .classList.toggle("valid", hasUpperCase);
  document
    .getElementById("special-check")
    .classList.toggle("valid", hasSpecialChar);
});

// Confirm password validation
document
  .getElementById("confirmPassword")
  .addEventListener("input", function () {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = this.value;
    const passwordError = document.getElementById("passwordError");

    if (newPassword !== confirmPassword) {
      passwordError.style.display = "block";
    } else {
      passwordError.style.display = "none";
    }
  });
