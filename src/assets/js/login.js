import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5gN65t8IR-lLobeTCfyIAQXTDkW9vCmc",
  authDomain: "authloginccg.firebaseapp.com",
  projectId: "authloginccg",
  storageBucket: "authloginccg.firebasestorage.app",
  messagingSenderId: "649967513477",
  appId: "1:649967513477:web:c813a2c15a19959eab1eec",
};

// Supabase configuration
const SUPABASE_CONFIG = {
  url: "https://pembaveqjbfpxajoadte.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "en";
const provider = new GoogleAuthProvider();

// Initialize Supabase
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

// Define base URL for redirects
const BASE_URL = window.location.origin;
const INDEX_PATH = "/index.html";

// Function to create or update user in Supabase
async function syncUserWithSupabase(user) {
  try {
    // Check if user exists in Supabase
    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("firebase_uid", user.uid)
      .single();

    if (!existingUser) {
      // Create new user in Supabase
      const { data, error } = await supabase.from("users").insert([
        {
          firebase_uid: user.uid,
          email: user.email,
          display_name: user.displayName || null,
          photo_url: user.photoURL || null,
        },
      ]);

      if (error) throw error;
    }

    // Store the user's Firebase UID in localStorage for later use
    localStorage.setItem("userId", user.uid);
  } catch (error) {
    console.error("Error syncing user with Supabase:", error);
    throw error;
  }
}

// Login with Google
const loginGoogle = document.getElementById("login-google");
loginGoogle.addEventListener("click", function (event) {
  event.preventDefault();

  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      await syncUserWithSupabase(user);
      window.location.href = BASE_URL + INDEX_PATH;
    })
    .catch((error) => {
      console.error("Google Sign In Error:", error.code, error.message);
    });
});

// Email/Password Login
const submit = document.getElementById("submit");
submit.addEventListener("click", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "" || password === "") {
    alert("Please Input Email and Password !");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      if (!user.emailVerified) {
        signOut(auth);
        alert("Please verify your email before logging in !");
        return;
      }

      await syncUserWithSupabase(user);
      window.location.href = BASE_URL + INDEX_PATH;
    })
    .catch((error) => {
      alert("The password is incorrect. Try Again !");
    });
});

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

  // Enable the submit button if all rules are valid
  submitButton.disabled = !Object.values(rules).every(Boolean);
}

passwordInput.addEventListener("input", (e) =>
  validatePassword(e.target.value)
);

const togglePassword = document.getElementById("toggle-password");

togglePassword.addEventListener("click", () => {
  const isPasswordHidden = passwordInput.type === "password";
  passwordInput.type = isPasswordHidden ? "text" : "password";

  // Update icon
  togglePassword.className = isPasswordHidden
    ? "fa-solid fa-eye position-absolute end-0 top-75 translate-middle-y me-3"
    : "fa-solid fa-eye-slash position-absolute end-0 top-75 translate-middle-y me-3";
});
