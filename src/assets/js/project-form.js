import { createClient } from "https://esm.sh/@supabase/supabase-js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const SUPABASE_CONFIG = {
  url: "https://pembaveqjbfpxajoadte.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q",
};

const PERCENTAGE_FIELDS = [
  { inputId: "planning", displayId: "planningValue" },
  { inputId: "requirementAnalysis", displayId: "requirementValue" },
  { inputId: "development", displayId: "developmentValue" },
  { inputId: "testing", displayId: "testingValue" },
  { inputId: "deployment", displayId: "deploymentValue" },
];

// Initialize Supabase client
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
const auth = getAuth();

// Update percentage display
function updatePercentage(input, valueId) {
  const value = Math.min(100, Math.max(0, parseInt(input.value) || 0));
  input.value = value;
  const displayElement = document.getElementById(valueId);
  if (displayElement) {
    displayElement.textContent = `${value}%`;
  }
}

// Validate date ranges
function validateDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end >= start;
}

// Validate priority (1-4)
function validatePriority(priority) {
  const value = parseInt(priority);
  return value >= 1 && value <= 4;
}

// Validate percentages (0-100)
function validatePercentages(percentages) {
  return percentages.every((value) => {
    const percentage = parseInt(value);
    return percentage >= 0 && percentage <= 100;
  });
}

// Validate that all required fields are filled
function validateRequiredFields(formData) {
  const requiredFields = [
    "project_owner",
    "project_name",
    "project_type",
    "start_date",
    "end_date",
    "complexity",
    "priority",
  ];

  return requiredFields.every((field) => {
    return formData[field] !== undefined && formData[field] !== "";
  });
}

// Handle form submission with Firebase Auth
async function handleFormSubmission(formData) {
  try {
    // Validate all required fields
    if (!validateRequiredFields(formData)) {
      throw new Error("Please fill in all required fields");
    }

    // Add timestamps to the project data
    const projectData = {
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("projects")
      .insert([projectData]);

    if (error) throw error;

    alert("Project saved successfully!");
    window.location.href = "home-my-tasks.html";
  } catch (error) {
    console.error("Error saving project:", error);
    alert(`Failed to save project: ${error.message}`);
  }
}

// Initialize form with Firebase Auth check
function initializeForm() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Redirect to login if no user is authenticated
      window.location.href = "login.html";
      return;
    }

    const projectForm = document.getElementById("projectForm");
    if (!projectForm) {
      console.error("Project form not found");
      return;
    }

    // Set project owner field to "Syarief Hidayat"
    const projectOwnerField = document.getElementById("projectOwner");
    if (projectOwnerField) {
      projectOwnerField.value = "Syarief Hidayat";
      projectOwnerField.disabled = true; // Prevent editing of project owner
    }

    // Initialize percentage fields
    PERCENTAGE_FIELDS.forEach(({ inputId, displayId }) => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener("input", () =>
          updatePercentage(input, displayId)
        );
        // Initialize display values
        updatePercentage(input, displayId);
      }
    });

    // Remove date restrictions for start date and end date
    const startDateInput = document.getElementById("startDate");
    if (startDateInput) {
      startDateInput.addEventListener("change", (e) => {
        const endDateInput = document.getElementById("endDate");
        if (endDateInput) {
          endDateInput.min = e.target.value; // Only ensure end date is after start date
        }
      });
    }

    // Form submission handler
    projectForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate priority
      const priority = document.getElementById("priority").value;
      if (!validatePriority(priority)) {
        alert("Priority must be between 1 and 4");
        return;
      }

      // Validate dates
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;
      if (!validateDates(startDate, endDate)) {
        alert("End date cannot be earlier than start date");
        return;
      }

      // Validate percentages
      const percentages = PERCENTAGE_FIELDS.map(
        ({ inputId }) => document.getElementById(inputId).value
      );
      if (!validatePercentages(percentages)) {
        alert("All percentages must be between 0 and 100");
        return;
      }

      // Prepare form data
      const formData = {
        project_owner: "Syarief Hidayat",
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
  });
}

// Initialize form when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeForm);

// Export necessary functions for use in other modules
export { updatePercentage, initializeForm };
