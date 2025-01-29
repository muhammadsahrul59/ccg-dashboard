import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Define base URL for redirects
const BASE_URL = window.location.origin;
const SENT_EMAIL_PATH = "/src/auth/sent-email.html";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//reset password
const reset = document.getElementById("reset");
reset.addEventListener("click", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      window.location.href = BASE_URL + SENT_EMAIL_PATH;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});
