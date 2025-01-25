import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

// Your web app's Firebase configuration
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
