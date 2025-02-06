import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";

const supabase = createClient(supabaseUrl, supabaseKey);

// Define base URL for redirects
const BASE_URL = window.location.origin;
const LOGIN_PATH = "/src/auth/authentication-login.html";

// Timeout duration (5 minutes in milliseconds)
const TIMEOUT_DURATION = 300000;

let logoutTimeout;
let tabInactiveTimeout;

// Function to reset the inactivity timeout
const resetInactivityTimeout = () => {
  clearTimeout(logoutTimeout);
  logoutTimeout = setTimeout(handleAutoLogout, TIMEOUT_DURATION);
  localStorage.setItem("logout_time", Date.now() + TIMEOUT_DURATION);
};

// Auto logout function
const handleAutoLogout = async () => {
  try {
    await supabase.auth.signOut();
    alert("Sesi Anda Telah Habis, Silahkan Login Kembali !");
    window.location.href = BASE_URL + LOGIN_PATH;
  } catch (error) {
    console.error("Error during auto sign-out:", error);
    alert("Error during auto sign-out.");
  }
};

// Function to handle tab close/minimize
const handleTabInactivity = async () => {
  clearTimeout(tabInactiveTimeout);
  tabInactiveTimeout = setTimeout(async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("logout_time"); // Clear local storage on tab close
      // No alert on tab close, just redirect.  Alerting can interrupt the close process.
      window.location.href = BASE_URL + LOGIN_PATH;
    } catch (error) {
      console.error("Error during sign-out on tab close:", error);
      // Handle error, perhaps log it.  Don't try to alert the user.
      window.location.href = BASE_URL + LOGIN_PATH; // Redirect even if error occurs.
    }
  }, TIMEOUT_DURATION);
};

// Check if user should be logged out on page load (from local storage)
const checkLogoutTime = async () => {
  const logoutTime = localStorage.getItem("logout_time");
  if (logoutTime && Date.now() > logoutTime) {
    localStorage.removeItem("logout_time"); // Clear if expired
    await handleAutoLogout();
  }
};

// Handle authentication state changes
const checkAuthState = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    localStorage.removeItem("logout_time"); // Clear any existing timeout if user is not logged in.
    window.location.href = BASE_URL + LOGIN_PATH;
  } else {
    console.log("User logged in:", user.email);
    resetInactivityTimeout(); // Start the timeout when user is logged in
  }
};

// Run authentication and logout check on page load
checkLogoutTime();
checkAuthState();

// Handle logout manually via button
document.getElementById("logout").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await supabase.auth.signOut();
    localStorage.removeItem("logout_time"); // Clear local storage on manual logout
    alert("Logout Success");
    window.location.href = BASE_URL + LOGIN_PATH;
  } catch (error) {
    console.error("Error during sign-out:", error);
    alert("Error during sign-out.");
  }
});

// Add event listeners for user activity (reset timeout)
["click", "mousemove", "keypress", "scroll", "touchstart"].forEach((event) => {
  window.addEventListener(event, resetInactivityTimeout);
});

// Visibility change listener for tab close/minimize
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    handleTabInactivity();
  } else {
    clearTimeout(tabInactiveTimeout); // Clear timeout if tab becomes visible again
    resetInactivityTimeout(); // Restart the standard inactivity timer.
  }
});

// Start the initial timeout (after initial checkAuthState)
// The timeout is now started inside checkAuthState.
