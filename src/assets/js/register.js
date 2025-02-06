import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";
const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = window.location.origin;
const EMAIL_VER_PATH = "/src/auth/email-verification.html";

// Add function to check if email exists
async function checkEmailExists(email) {
  try {
    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers({
      filters: {
        email: email,
      },
    });

    return users && users.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
}

const submit = document.getElementById("submit");
submit.addEventListener("click", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validasi input
  if (email === "" || password === "" || confirmPassword === "") {
    alert("Please fill in all fields!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    // Check if email exists before attempting to sign up
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      alert(
        "This email is already registered! Please use a different email or login."
      );
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${BASE_URL}${EMAIL_VER_PATH}`,
      },
    });

    if (error) throw error;

    window.location.href = BASE_URL + EMAIL_VER_PATH;
  } catch (error) {
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

const passwordInput = document.getElementById("password");
const submitButton = document.getElementById("submit");
const passwordChecklist = {
  length: document.getElementById("length-check"),
  uppercase: document.getElementById("uppercase-check"),
  special: document.getElementById("special-check"),
};

let rules = {
  length: false,
  uppercase: false,
  special: false,
};

function validatePassword(password) {
  rules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  Object.keys(rules).forEach((rule) => {
    if (rules[rule]) {
      passwordChecklist[rule].classList.add("valid");
      passwordChecklist[rule].querySelector("i").className =
        "fa fa-check-circle";
    } else {
      passwordChecklist[rule].classList.remove("valid");
      passwordChecklist[rule].querySelector("i").className =
        "fa fa-times-circle";
    }
  });

  checkSubmitButton();
}

const togglePassword = document.getElementById("toggle-password");
togglePassword.addEventListener("click", () => {
  const isPasswordHidden = passwordInput.type === "password";
  passwordInput.type = isPasswordHidden ? "text" : "password";

  togglePassword.className = isPasswordHidden
    ? "fa-solid fa-eye position-absolute end-0 top-75 translate-middle-y me-3"
    : "fa-solid fa-eye-slash position-absolute end-0 top-75 translate-middle-y me-3";
});

const confirmPasswordInput = document.getElementById("confirm-password");
const confirmPasswordError = document.getElementById("confirm-password-error");

function validateConfirmPassword() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (password !== confirmPassword) {
    confirmPasswordError.classList.remove("d-none");
    submitButton.disabled = true;
  } else {
    confirmPasswordError.classList.add("d-none");
    checkSubmitButton();
  }
}

function checkSubmitButton() {
  const confirmPassword = confirmPasswordInput.value;
  const password = passwordInput.value;

  submitButton.disabled = !(
    Object.values(rules).every(Boolean) &&
    password === confirmPassword &&
    password !== "" &&
    confirmPassword !== ""
  );
}

passwordInput.addEventListener("input", (e) => {
  validatePassword(e.target.value);
});

confirmPasswordInput.addEventListener("input", validateConfirmPassword);

const toggleConfirmPassword = document.getElementById(
  "toggle-confirm-password"
);
toggleConfirmPassword.addEventListener("click", () => {
  const isPasswordHidden = confirmPasswordInput.type === "password";
  confirmPasswordInput.type = isPasswordHidden ? "text" : "password";

  toggleConfirmPassword.className = isPasswordHidden
    ? "fa-solid fa-eye position-absolute end-0 top-55 translate-middle-y me-3"
    : "fa-solid fa-eye-slash position-absolute end-0 top-55 translate-middle-y me-3";
});
