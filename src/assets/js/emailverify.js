import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  sendEmailVerification,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Your Firebase configuration
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

// Get the resend button
const resendButton = document.getElementById("resendEmail");

// Add click event listener to resend button
resendButton.addEventListener("click", async () => {
  // Disable the button temporarily
  resendButton.disabled = true;

  try {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      alert("Verification email has been resent. Please check your inbox!");
    } else {
      alert("No user is currently signed in. Please sign in again.");
      window.location.href = BASE_URL + LOGIN_PATH;
    }
  } catch (error) {
    console.error("Error resending verification email:", error);
    if (error.code === "auth/too-many-requests") {
      alert("Too many attempts. Please wait 60s before trying again.");
    } else {
      alert("Error sending verification email. Please try again later.");
    }
  }

  // Re-enable the button after 60 seconds (to prevent spam)
  setTimeout(() => {
    resendButton.disabled = false;
  }, 60000);
});

// Check if user is signed in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // No user is signed in, redirect to login
    window.location.href = BASE_URL + LOGIN_PATH;
  }
});
