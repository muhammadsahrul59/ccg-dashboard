import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyC5gN65t8IR-lLobeTCfyIAQXTDkW9vCmc",
  authDomain: "authloginccg.firebaseapp.com",
  projectId: "authloginccg",
  storageBucket: "authloginccg.firebasestorage.app",
  messagingSenderId: "649967513477",
  appId: "1:649967513477:web:c813a2c15a19959eab1eec",
};

// Define base URL for redirects
const BASE_URL = window.location.origin;
const LOGIN_PATH = "/src/auth/authentication-login.html";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Flag to track logout process
let isLoggingOut = false;

// Timeout duration (5 minute in milliseconds)
const TIMEOUT_DURATION = 300000;
let timeoutId;

// Function to reset the inactivity timeout
const resetTimeout = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    handleAutoLogout();
  }, TIMEOUT_DURATION);
};

// Auto logout function
const handleAutoLogout = async () => {
  try {
    isLoggingOut = true;
    await signOut(auth);
    alert("Sesi Anda Telah Habis, Silahkan Login Kembali !");
    window.location.href = BASE_URL + LOGIN_PATH;
  } catch (error) {
    console.error("Error during auto sign-out:", error);
    alert("Error during auto sign-out.");
  } finally {
    isLoggingOut = false;
  }
};

// Handle authentication state changes
onAuthStateChanged(auth, (user) => {
  if (!user && !isLoggingOut) {
    window.location.href = BASE_URL + LOGIN_PATH;
  } else if (user) {
    console.log("User logged in:", user.email);
    resetTimeout(); // Start the timeout when user is logged in
  }
});

// Handle logout manually via button
document.getElementById("logout").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    isLoggingOut = true;
    await signOut(auth);
    alert("Logout Success");
    window.location.href = BASE_URL + LOGIN_PATH;
  } catch (error) {
    console.error("Error during sign-out:", error);
    alert("Error during sign-out.");
  } finally {
    isLoggingOut = false;
  }
});

// Add event listeners for user activity
["click", "mousemove", "keypress", "scroll", "touchstart"].forEach((event) => {
  window.addEventListener(event, resetTimeout);
});

// Start the initial timeout
resetTimeout();
