import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";
const supabase = createClient(supabaseUrl, supabaseKey);

const resendButton = document.getElementById("resendEmail");
let isCooldown = false;

resendButton.addEventListener("click", async () => {
  if (isCooldown) {
    alert("Please wait 1 minute before resending the email.");
    return;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
      });

      if (error) throw error;

      alert("Verification email has been resent!");
      isCooldown = true;
      resendButton.disabled = true;
      resendButton.innerText =
        "Your email has been sent. Please wait 60 seconds.";

      let timeLeft = 60;
      const timer = setInterval(() => {
        timeLeft--;
        resendButton.innerText = `Please wait ${timeLeft}s`;
        if (timeLeft <= 0) {
          clearInterval(timer);
          isCooldown = false;
          resendButton.disabled = false;
          resendButton.innerText = "Resend Email";
        }
      }, 1000);
    } else {
      alert("No user found. Please try signing up again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error sending verification email: " + error.message);
  }
});

window.addEventListener("load", async () => {
  const hash = window.location.hash;
  if (hash && hash.includes("type=signup")) {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;

      if (user) {
        window.location.href = "../auth/email-verified.html";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error verifying email: " + error.message);
    }
  }
});
