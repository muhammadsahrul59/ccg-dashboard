// Import Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  "https://pembaveqjbfpxajoadte.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q"
);

// Global variables for pagination
let currentPage = 1;
let itemsPerPage = 10;
let filteredData = [];

document.addEventListener("DOMContentLoaded", function () {
  // Add controls above the table
  const tableControls = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex align-items-center">
        <label class="me-2">Show entries:</label>
        <select id="entriesPerPage" class="form-select form-select-sm" style="width: auto;">
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="all">All</option>
        </select>
      </div>
      <div class="d-flex align-items-center gap-2">
        <input type="search" id="searchInput" class="form-control form-control-sm" placeholder="Search...">
      </div>
    </div>
    <div id="pagination" class="d-flex justify-content-center mb-3">
      <nav aria-label="Page navigation">
        <ul class="pagination mb-0">
        </ul>
      </nav>
    </div>`;

  // Insert controls before the table
  document
    .querySelector(".table-responsive")
    .insertAdjacentHTML("beforebegin", tableControls);

  // Add event listeners
  document
    .getElementById("entriesPerPage")
    .addEventListener("change", function (e) {
      itemsPerPage =
        e.target.value === "all" ? "all" : parseInt(e.target.value);
      currentPage = 1;
      displayWorkData(filteredData);
    });

  document
    .getElementById("searchInput")
    .addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      filterAndDisplayWorkData(searchTerm);
    });

  loadWorkData();
});

// Function to load and display work data
async function loadWorkData() {
  try {
    const { data, error } = await supabase
      .from("work_akmal")
      .select("*")
      .eq("work_owner", "Muhamad Akmal Amrullah")
      .order("date", { ascending: false });

    if (error) throw error;

    filteredData = data;
    displayWorkData(filteredData);
  } catch (error) {
    console.error("Error loading work data:", error);
    alert("Failed to load work data");
  }
}

// Function to filter work data based on search term
function filterAndDisplayWorkData(searchTerm) {
  const searchResults = filteredData.filter((entry) => {
    return entry.date.toLowerCase().includes(searchTerm);
  });

  currentPage = 1;
  displayWorkData(searchResults);
}

// Function to display work data with pagination
function displayWorkData(data) {
  const tableBody = document.getElementById("projectTableBody");
  const paginationElement = document.querySelector(".pagination");
  tableBody.innerHTML = "";

  // Calculate pagination
  const totalPages =
    itemsPerPage === "all" ? 1 : Math.ceil(data.length / itemsPerPage);
  const startIndex =
    itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === "all" ? data.length : startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  currentData.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal text-center">${row.date}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal text-center">${row.create_knowledge}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal text-center">${row.create_answer}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal text-center">${row.create_module}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal text-center">${row.total_creation}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal text-center">${row.update_answer}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal text-center">${row.update_quick_reply}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal text-center">${row.update_button}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal text-center">${row.total_update_knowledge}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal text-center">${row.input_synonym}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal text-center">${row.input_intent}</p>
      </td>
      <td class="border-bottom-0">
        <p class="mb-0 fw-normal text-center">${row.total_input}</p>
      </td>
      <td class="border-bottom-0">
        <div class="d-flex align-items-center justify-content-center gap-2">
          <button class="btn btn-warning btn-sm d-flex align-items-center justify-content-center" onclick="editWork('${row.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm d-flex align-items-center justify-content-center" onclick="deleteWork('${row.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>`;
    tableBody.appendChild(tr);
  });

  // Only show pagination controls if not showing all entries
  if (itemsPerPage !== "all") {
    updatePagination(totalPages);
  } else {
    paginationElement.innerHTML = "";
  }

  // Update showing entries info
  updateEntriesInfo(
    data.length,
    startIndex + 1,
    Math.min(endIndex, data.length)
  );
}

// Function to update "Showing X to Y of Z entries" info
function updateEntriesInfo(totalEntries, start, end) {
  const infoElement = document.createElement("div");
  infoElement.className = "mt-3";
  infoElement.innerHTML = `Showing ${start} to ${end} of ${totalEntries} entries`;

  const existingInfo = document.querySelector(".showing-entries-info");
  if (existingInfo) {
    existingInfo.remove();
  }

  document
    .querySelector(".table-responsive")
    .insertAdjacentElement("afterend", infoElement);
  infoElement.className = "showing-entries-info mt-3";
}

// Function to update pagination controls
function updatePagination(totalPages) {
  const paginationElement = document.querySelector(".pagination");
  paginationElement.innerHTML = "";

  // First button
  const firstLi = document.createElement("li");
  firstLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  firstLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(1)">First</a>`;
  paginationElement.appendChild(firstLi);

  // Previous button
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${
    currentPage - 1
  })">Previous</a>`;
  paginationElement.appendChild(prevLi);

  // Page numbers
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${currentPage === i ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
    paginationElement.appendChild(li);
  }

  // Next button
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${
    currentPage + 1
  })">Next</a>`;
  paginationElement.appendChild(nextLi);

  // Last button
  const lastLi = document.createElement("li");
  lastLi.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  lastLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${totalPages})">Last</a>`;
  paginationElement.appendChild(lastLi);
}

// Function to change page
function changePage(newPage) {
  if (
    newPage >= 1 &&
    newPage <= Math.ceil(filteredData.length / itemsPerPage)
  ) {
    currentPage = newPage;
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();
    if (searchTerm) {
      filterAndDisplayWorkData(searchTerm);
    } else {
      displayWorkData(filteredData);
    }
  }
}

// Function to calculate totals
function calculateTotals(formData) {
  formData.total_creation =
    parseInt(formData.create_knowledge || 0) +
    parseInt(formData.create_answer || 0) +
    parseInt(formData.create_module || 0);

  formData.total_update_knowledge =
    parseInt(formData.update_answer || 0) +
    parseInt(formData.update_quick_reply || 0) +
    parseInt(formData.update_button || 0);

  formData.total_input =
    parseInt(formData.input_synonym || 0) +
    parseInt(formData.input_intent || 0);

  return formData;
}

// Functions for edit and delete remain the same
async function editWork(id) {
  try {
    const { data, error } = await supabase
      .from("work_akmal")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    // Populate the edit form
    document.getElementById("edit_work_id").value = data.id;
    document.getElementById("edit_Date").value = data.date;
    document.getElementById("edit_createKnowledge").value =
      data.create_knowledge;
    document.getElementById("edit_createAnswer").value = data.create_answer;
    document.getElementById("edit_createModule").value = data.create_module;
    document.getElementById("edit_updateAnswer").value = data.update_answer;
    document.getElementById("edit_updateQuickReplay").value =
      data.update_quick_reply;
    document.getElementById("edit_updateButton").value = data.update_button;
    document.getElementById("edit_inputSynonym").value = data.input_synonym;
    document.getElementById("edit_inputIntent").value = data.input_intent;

    // Calculate and display totals
    updateEditTotals();

    // Show the edit modal
    const editModal = new bootstrap.Modal(document.getElementById("editModal"));
    editModal.show();
  } catch (error) {
    console.error("Error loading work data for editing:", error);
    alert("Failed to load work data for editing");
  }
}

function updateEditTotals() {
  const formData = {
    create_knowledge: parseInt(
      document.getElementById("edit_createKnowledge").value || 0
    ),
    create_answer: parseInt(
      document.getElementById("edit_createAnswer").value || 0
    ),
    create_module: parseInt(
      document.getElementById("edit_createModule").value || 0
    ),
    update_answer: parseInt(
      document.getElementById("edit_updateAnswer").value || 0
    ),
    update_quick_reply: parseInt(
      document.getElementById("edit_updateQuickReplay").value || 0
    ),
    update_button: parseInt(
      document.getElementById("edit_updateButton").value || 0
    ),
    input_synonym: parseInt(
      document.getElementById("edit_inputSynonym").value || 0
    ),
    input_intent: parseInt(
      document.getElementById("edit_inputIntent").value || 0
    ),
  };

  const totals = calculateTotals(formData);

  document.getElementById("edit_totalCreation").value = totals.total_creation;
  document.getElementById("edit_totalUpdateKnowledge").value =
    totals.total_update_knowledge;
  document.getElementById("edit_totalInput").value = totals.total_input;
}

async function updateWork(event) {
  event.preventDefault();

  const id = document.getElementById("edit_work_id").value;
  let formData = {
    date: document.getElementById("edit_Date").value,
    create_knowledge: parseInt(
      document.getElementById("edit_createKnowledge").value || 0
    ),
    create_answer: parseInt(
      document.getElementById("edit_createAnswer").value || 0
    ),
    create_module: parseInt(
      document.getElementById("edit_createModule").value || 0
    ),
    update_answer: parseInt(
      document.getElementById("edit_updateAnswer").value || 0
    ),
    update_quick_reply: parseInt(
      document.getElementById("edit_updateQuickReplay").value || 0
    ),
    update_button: parseInt(
      document.getElementById("edit_updateButton").value || 0
    ),
    input_synonym: parseInt(
      document.getElementById("edit_inputSynonym").value || 0
    ),
    input_intent: parseInt(
      document.getElementById("edit_inputIntent").value || 0
    ),
  };

  // Calculate totals
  formData = calculateTotals(formData);

  try {
    const { error } = await supabase
      .from("work_akmal")
      .update(formData)
      .eq("id", id);

    if (error) throw error;

    alert("Work entry updated successfully!");
    const editModal = bootstrap.Modal.getInstance(
      document.getElementById("editModal")
    );
    editModal.hide();
    loadWorkData();
  } catch (error) {
    console.error("Error updating work entry:", error);
    alert("Failed to update work entry");
  }
}

async function deleteWork(id) {
  if (!confirm("Are you sure you want to delete this entry?")) return;

  try {
    const { error } = await supabase.from("work_akmal").delete().eq("id", id);

    if (error) throw error;

    alert("Work entry deleted successfully!");
    loadWorkData();
  } catch (error) {
    console.error("Error deleting work entry:", error);
    alert("Failed to delete work entry");
  }
}

// Add event listeners for edit form fields to update totals
document.addEventListener("DOMContentLoaded", function () {
  const editFields = [
    "edit_createKnowledge",
    "edit_createAnswer",
    "edit_createModule",
    "edit_updateAnswer",
    "edit_updateQuickReplay",
    "edit_updateButton",
    "edit_inputSynonym",
    "edit_inputIntent",
  ];

  editFields.forEach((fieldId) => {
    const element = document.getElementById(fieldId);
    if (element) {
      element.addEventListener("input", updateEditTotals);
    }
  });

  // Add form submission event listener for edit modal
  const editForm = document.getElementById("editProjectForm");
  if (editForm) {
    editForm.addEventListener("submit", updateWork);
  }
});

// Make functions available globally
window.changePage = changePage;
window.editWork = editWork;
window.updateWork = updateWork;
window.deleteWork = deleteWork;
window.filterAndDisplayWorkData = filterAndDisplayWorkData;
