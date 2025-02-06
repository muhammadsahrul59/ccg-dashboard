import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";

const supabase = createClient(supabaseUrl, supabaseKey);

// Define base URL for redirects
const BASE_URL = window.location.origin;
const SENT_EMAIL_PATH = "/src/auth/sent-email.html";

//reset password
const reset = document.getElementById("reset");
reset.addEventListener("click", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: BASE_URL + "/src/auth/update-password.html",
    });

    if (error) throw error;

    // Redirect to sent email page on success
    window.location.href = BASE_URL + SENT_EMAIL_PATH;
  } catch (error) {
    console.error("Error:", error.message);
    // Handle error appropriately
  }
});
