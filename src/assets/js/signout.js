import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";

const supabase = createClient(supabaseUrl, supabaseKey);

// Define base URL for redirects
const BASE_URL = window.location.origin;
const LOGIN_PATH = "/src/auth/authentication-login.html";

// Flag to track logout process
let isLoggingOut = false;

// Timeout duration (5 minutes in milliseconds)
const TIMEOUT_DURATION = 300000;
let timeoutId;

// Function to reset the inactivity timeout
const resetTimeout = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    handleAutoLogout();
  }, TIMEOUT_DURATION);
  localStorage.setItem("logout_time", Date.now() + TIMEOUT_DURATION);
};

// Auto logout function
const handleAutoLogout = async () => {
  try {
    isLoggingOut = true;
    await supabase.auth.signOut();
    alert("Sesi Anda Telah Habis, Silahkan Login Kembali !");
    window.location.href = BASE_URL + LOGIN_PATH;
  } catch (error) {
    console.error("Error during auto sign-out:", error);
    alert("Error during auto sign-out.");
  } finally {
    isLoggingOut = false;
  }
};

// Check if user should be logged out on page load
const checkLogoutTime = async () => {
  const logoutTime = localStorage.getItem("logout_time");
  if (logoutTime && Date.now() > logoutTime) {
    await handleAutoLogout();
  }
};

// Handle authentication state changes
const checkAuthState = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLoggingOut) {
    window.location.href = BASE_URL + LOGIN_PATH;
  } else if (user) {
    console.log("User logged in:", user.email);
    resetTimeout(); // Start the timeout when user is logged in
  }
};

// Run authentication and logout check on page load
checkLogoutTime();
checkAuthState();

// Handle logout manually via button
document.getElementById("logout").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    isLoggingOut = true;
    await supabase.auth.signOut();
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
