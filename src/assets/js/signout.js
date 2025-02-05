// signout.js
const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzgwMjY0NiwiZXhwIjoyMDUzMzc4NjQ2fQ.BY1tp2jgz9pdX2TG33g9QF97EBGK9OYe9KkNCK37keI";

// Import Supabase client (pastikan ini sudah diinisialisasi di login.js)
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Define base URL for redirects
const BASE_URL = window.location.origin;
const LOGIN_PATH = "/src/auth/authentication-login.html";

// Flag to track logout process
let isLoggingOut = false;

// Timeout duration (5 minutes in milliseconds)
const TIMEOUT_DURATION = 300000;
let timeoutId;
let tabCloseTimeoutId;

// Store last active timestamp in localStorage
const updateLastActiveTime = () => {
  localStorage.setItem("lastActiveTime", Date.now().toString());
};

// Function to reset the inactivity timeout
const resetTimeout = () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    handleAutoLogout();
  }, TIMEOUT_DURATION);
  updateLastActiveTime();
};

// Auto logout function
const handleAutoLogout = async () => {
  try {
    isLoggingOut = true;
    await supabaseClient.auth.signOut();
    alert("Sesi Anda Telah Habis, Silahkan Login Kembali !");
    window.location.href = BASE_URL + LOGIN_PATH;
  } catch (error) {
    console.error("Error during auto sign-out:", error);
    alert("Error during auto sign-out.");
  } finally {
    isLoggingOut = false;
  }
};

// Check if user should be logged out based on tab close time
const checkTabCloseLogout = () => {
  const lastActiveTime = parseInt(
    localStorage.getItem("lastActiveTime") || "0"
  );
  const currentTime = Date.now();
  const timeDifference = currentTime - lastActiveTime;

  if (timeDifference >= TIMEOUT_DURATION) {
    handleAutoLogout();
  }
};

// Handle tab/window close
window.addEventListener("beforeunload", () => {
  updateLastActiveTime();
});

// When page loads, check if we need to logout based on last active time
window.addEventListener("load", () => {
  checkTabCloseLogout();
});

// Handle authentication state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT" && !isLoggingOut) {
    window.location.href = BASE_URL + LOGIN_PATH;
  } else if (event === "SIGNED_IN") {
    console.log("User logged in:", session.user.email);
    resetTimeout(); // Start the timeout when user is logged in
    updateLastActiveTime(); // Update last active time
  }
});

// Handle logout manually via button
document.getElementById("logout").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    isLoggingOut = true;
    await supabaseClient.auth.signOut();
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
