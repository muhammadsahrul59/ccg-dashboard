import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
