//my-profile.js
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";

const supabase = createClient(supabaseUrl, supabaseKey);

// DOM Elements
const profileForm = document.getElementById("profileForm");
const photoInput = document.getElementById("photoInput");
const profileImage = document.getElementById("profileImage");

// Load existing profile data
async function loadProfileData() {
  try {
    // First get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("No user logged in");

    // Set email from auth user
    const emailInput = document.getElementById("email");
    emailInput.value = user.email;

    // Query the profile with correct syntax
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, full_name, phone, department, avatar_url")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      // If profile doesn't exist, create one
      if (profileError.code === "PGRST116") {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([
            {
              user_id: user.id,
              full_name: "",
              phone: "",
              department: "",
              avatar_url: null,
            },
          ])
          .single();

        if (insertError) throw insertError;

        // Reload the page to show the new profile
        window.location.reload();
        return;
      }
      throw profileError;
    }

    // Populate form with profile data
    if (profile) {
      document.getElementById("name").value = profile.full_name || "";
      document.getElementById("phone").value = profile.phone || "";
      document.getElementById("department").value = profile.department || "";
      if (profile.avatar_url) {
        profileImage.src = profile.avatar_url;
      }
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    // Show error in UI
    const errorMessage = `Failed to load profile: ${error.message}`;
    if (window.showToast) {
      showToast(errorMessage, "error");
    } else {
      alert(errorMessage);
    }
  }
}

// Handle profile photo change
photoInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No user logged in");

    // Create user-specific folder path
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;

    // Show loading state
    const loadingToast = showToast("Uploading image...", "info");
    profileImage.style.opacity = "0.5";

    // Upload file to user's folder
    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) throw updateError;

    // Update UI
    profileImage.src = publicUrl;
    profileImage.style.opacity = "1";
    showToast("Profile photo updated successfully", "success");
  } catch (error) {
    console.error("Error uploading image:", error.message);
    showToast(`Error uploading image: ${error.message}`, "error");
    profileImage.style.opacity = "1";
  }
});

// Handle form submission
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!profileForm.checkValidity()) {
    profileForm.classList.add("was-validated");
    return;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No user logged in");

    const formData = {
      user_id: user.id,
      full_name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      department: document.getElementById("department").value,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("user_id", user.id);

    if (error) throw error;

    showToast("Profile updated successfully!", "success");
  } catch (error) {
    console.error("Error updating profile:", error.message);
    showToast("Error updating profile", "error");
  }
});

// Updated Toast notification function to match akmal-work-form.js
function showToast(message, type = "info") {
  // Remove existing notifications
  const existingToast = document.querySelector(".modern-toast");
  if (existingToast) {
    existingToast.remove();
  }

  // Create new notification
  const toast = document.createElement("div");
  toast.className = `modern-toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fas ${
        type === "success"
          ? "fa-check-circle"
          : type === "error"
          ? "fa-exclamation-circle"
          : "fa-exclamation-triangle"
      }"></i>
    </div>
    <div class="toast-content">
      <h4 class="toast-title">${type === "success" ? "Success!" : "Error!"}</h4>
      <p class="toast-message">${message}</p>
    </div>
    <div class="progress-bar"></div>
  `;

  // Append the toast to the toast container
  const toastContainer = document.getElementById("toast-container");
  if (toastContainer) {
    toastContainer.appendChild(toast);
  }

  // Show notification with animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Remove notification after delay
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
}

// Ensure the global showToast function is updated
if (!window.showToast) {
  window.showToast = showToast;
}

// Load profile data when page loads
document.addEventListener("DOMContentLoaded", loadProfileData);
