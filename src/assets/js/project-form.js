//project-form.js
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_CONFIG = {
  url: "https://pembaveqjbfpxajoadte.supabase.co",
  anon_key:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q",
};

const PERCENTAGE_FIELDS = [
  { inputId: "planning", displayId: "planningValue" },
  { inputId: "requirementAnalysis", displayId: "requirementValue" },
  { inputId: "development", displayId: "developmentValue" },
  { inputId: "testing", displayId: "testingValue" },
  { inputId: "deployment", displayId: "deploymentValue" },
];

// Initialize Supabase client
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anon_key);

// Update percentage display
function updatePercentage(input, valueId) {
  const value = Math.min(100, Math.max(0, parseInt(input.value) || 0));
  input.value = value;
  const displayElement = document.getElementById(valueId);
  if (displayElement) {
    displayElement.textContent = `${value}%`;
  }
}

// Form validation functions
function validateDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end >= start;
}

function validatePriority(priority) {
  const value = parseInt(priority);
  return value >= 1 && value <= 4;
}

function validatePercentages(percentages) {
  return percentages.every((value) => {
    const percentage = parseInt(value);
    return percentage >= 0 && percentage <= 100;
  });
}

// Handle form submission
async function handleFormSubmission(formData) {
  try {
    const { data, error } = await supabase.from("projects").insert([formData]);

    if (error) throw error;

    showNotification({
      type: "success",
      title: "Project Saved!",
      message: "Your project has been saved successfully",
    });
    setTimeout(() => {
      window.location.href = "home-my-tasks.html";
    }, 1500);
  } catch (error) {
    console.error("Error saving project:", error);
    showNotification({
      type: "error",
      title: "Authentication Error",
      message: "Only authenticated accounts can input data",
    });
  }
}

// Initialize form handlers when DOM is loaded
function initializeForm() {
  const projectForm = document.getElementById("projectForm");
  if (!projectForm) {
    console.error("Project form not found");
    return;
  }

  // Add input listeners for percentage fields
  PERCENTAGE_FIELDS.forEach(({ inputId, displayId }) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener("input", () => updatePercentage(input, displayId));
      // Initialize display values
      updatePercentage(input, displayId);
    }
  });

  // Form submission handler
  projectForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate priority
    const priority = document.getElementById("priority").value;
    if (!validatePriority(priority)) {
      showNotification({
        type: "warning",
        title: "Invalid Priority",
        message: "Priority must be between 1 and 4",
      });
      return;
    }

    // Validate dates
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    if (!validateDates(startDate, endDate)) {
      showNotification({
        type: "warning",
        title: "Invalid Dates",
        message: "End date cannot be earlier than start date",
      });
      return;
    }

    // Validate percentages
    const percentages = PERCENTAGE_FIELDS.map(
      ({ inputId }) => document.getElementById(inputId).value
    );
    if (!validatePercentages(percentages)) {
      showNotification({
        type: "warning",
        title: "Invalid Percentages",
        message: "All percentages must be between 0 and 100",
      });
      return;
    }

    // Prepare form data
    const formData = {
      project_owner: document.getElementById("projectOwner").value,
      project_name: document.getElementById("projectName").value,
      project_type: document.getElementById("projectType").value,
      start_date: startDate,
      end_date: endDate,
      complexity: document.getElementById("complexity").value,
      priority: parseInt(priority),
      planning: parseInt(document.getElementById("planning").value),
      requirement_analysis: parseInt(
        document.getElementById("requirementAnalysis").value
      ),
      development: parseInt(document.getElementById("development").value),
      testing: parseInt(document.getElementById("testing").value),
      deployment: parseInt(document.getElementById("deployment").value),
    };

    await handleFormSubmission(formData);
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeForm);

// Export necessary functions if needed in other modules
export { updatePercentage, initializeForm };

function showNotification({ type = "success", title, message }) {
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
      <h4 class="toast-title">${title}</h4>
      <p class="toast-message">${message}</p>
    </div>
    <div class="progress-bar"></div>
  `;

  document.getElementById("toast-container").appendChild(toast);

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
