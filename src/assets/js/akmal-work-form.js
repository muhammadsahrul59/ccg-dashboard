import { createClient } from "https://esm.sh/@supabase/supabase-js";
const SUPABASE_CONFIG = {
  url: "https://pembaveqjbfpxajoadte.supabase.co",
  anon_key:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q",
};

// Initialize Supabase client
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anon_key);

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const workForm = document.getElementById("workForm");

  // Function to calculate and update totals
  function updateTotals() {
    // Calculate total creation
    const knowledge = parseInt(document.getElementById("knowledge").value) || 0;
    const answer = parseInt(document.getElementById("answer").value) || 0;
    const module = parseInt(document.getElementById("module").value) || 0;
    const totalCreation = knowledge + answer + module;
    document.getElementById("totalcreation").value = totalCreation;

    // Calculate total update knowledge
    const updateAnswer =
      parseInt(document.getElementById("updateAnswer").value) || 0;
    const quickReply =
      parseInt(document.getElementById("quickReply").value) || 0;
    const button = parseInt(document.getElementById("button").value) || 0;
    const totalUpdateKnowledge = updateAnswer + quickReply + button;
    document.getElementById("totalupdateknowledge").value =
      totalUpdateKnowledge;

    // Calculate total input
    const synonym = parseInt(document.getElementById("synonym").value) || 0;
    const intent = parseInt(document.getElementById("intent").value) || 0;
    const totalInput = synonym + intent;
    document.getElementById("totalinput").value = totalInput;
  }

  // Add event listeners to all input fields that affect totals
  const inputFields = [
    "knowledge",
    "answer",
    "module",
    "updateAnswer",
    "quickReply",
    "button",
    "synonym",
    "intent",
  ];

  inputFields.forEach((fieldId) => {
    document.getElementById(fieldId).addEventListener("input", updateTotals);
  });

  workForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      // Get form values
      const formData = {
        work_owner: document.getElementById("workOwner").value,
        date: document.getElementById("workDate").value,
        create_knowledge:
          parseInt(document.getElementById("knowledge").value) || 0,
        create_answer: parseInt(document.getElementById("answer").value) || 0,
        create_module: parseInt(document.getElementById("module").value) || 0,
        update_answer:
          parseInt(document.getElementById("updateAnswer").value) || 0,
        update_quick_reply:
          parseInt(document.getElementById("quickReply").value) || 0,
        update_button: parseInt(document.getElementById("button").value) || 0,
        input_synonym: parseInt(document.getElementById("synonym").value) || 0,
        input_intent: parseInt(document.getElementById("intent").value) || 0,
        total_creation:
          parseInt(document.getElementById("totalcreation").value) || 0,
        total_update_knowledge:
          parseInt(document.getElementById("totalupdateknowledge").value) || 0,
        total_input: parseInt(document.getElementById("totalinput").value) || 0,
      };

      // Insert data into Supabase
      const { data, error } = await supabase
        .from("work_akmal")
        .insert([formData]);

      if (error) {
        throw error;
      }

      // Show success message
      alert("Data berhasil disimpan!");

      // Reset form
      workForm.reset();

      // Reset totals
      updateTotals();

      // Set default value for work owner
      document.getElementById("workOwner").value = "Muhamad Akmal Amrullah";

      // Set default date to today
      const today = new Date().toISOString().split("T")[0];
      document.getElementById("workDate").value = today;
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
    }
  });

  // Set default value for work owner when page loads
  document.getElementById("workOwner").value = "Muhamad Akmal Amrullah";

  // Set default date to today
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("workDate").value = today;

  // Initialize totals on page load
  updateTotals();
});
