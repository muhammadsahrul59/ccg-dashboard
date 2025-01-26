import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Global variables for pagination
let currentPage = 1;
let itemsPerPage = 10;
let filteredProjects = [];

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
      displayProjects(filteredProjects);
    });

  document
    .getElementById("searchInput")
    .addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      filterAndDisplayProjects(searchTerm);
    });

  // Add form submission event listener for edit modal
  const editForm = document.getElementById("editProjectForm");
  if (editForm) {
    editForm.addEventListener("submit", updateProject);
  }

  loadProjects();
});

// Modified loadProjects function
async function loadProjects() {
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("project_owner", "Syarief Hidayat");

    if (error) throw error;

    filteredProjects = projects;
    displayProjects(filteredProjects);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to load projects: " + error.message);
  }
}

// Function to filter projects based on search term
function filterAndDisplayProjects(searchTerm) {
  const searchResults = filteredProjects.filter((project) => {
    return (
      project.project_name.toLowerCase().includes(searchTerm) ||
      project.project_type.toLowerCase().includes(searchTerm) ||
      project.complexity.toLowerCase().includes(searchTerm)
    );
  });

  currentPage = 1;
  displayProjects(searchResults);
}

// Modified displayProjects function
function displayProjects(projects) {
  const tableBody = document.getElementById("projectTableBody");
  const paginationElement = document.querySelector(".pagination");
  tableBody.innerHTML = "";

  // Calculate pagination
  const totalPages =
    itemsPerPage === "all" ? 1 : Math.ceil(projects.length / itemsPerPage);
  const startIndex =
    itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === "all" ? projects.length : startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  // Display current page projects
  currentProjects.forEach((project) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border-bottom-0">
          <h6 class="fw-semibold mb-0 text-center">${project.project_name}</h6>
      </td>
      <td class="border-bottom-0">
          <p class="mb-0 fw-normal text-center">${project.project_type}</p>
      </td>
      <td class="border-bottom-0">
          <p class="mb-0 fw-normal text-center">${new Date(
            project.start_date
          ).toLocaleDateString()}</p>
      </td>
      <td class="border-bottom-0">
          <p class="mb-0 fw-normal text-center">${new Date(
            project.end_date
          ).toLocaleDateString()}</p>
      </td>
      <td class="border-bottom-0">
          <p class="mb-0 fw-normal text-center">${project.complexity}</p>
      </td>
      <td class="border-bottom-0">
          <p class="mb-0 fw-normal text-center">${project.priority}</p>
      </td>
      <td class="border-bottom-0">
          <p class="mb-0 fw-normal text-center">${project.planning + "%"}</p>
      </td>
      <td class="border-bottom-0">
          <p class="mb-0 fw-normal text-center">${
            project.requirement_analysis + "%"
          }</p>
      </td>
      <td class="border-bottom-0">
          <p class="mb-0 fw-normal text-center">${project.development + "%"}</p>
      </td>
      <td class="border-bottom-0">
          <p class="mb-0 fw-normal text-center">${project.testing + "%"}</p>
      </td>
      <td class="border-bottom-0">
          <p class="mb-0 fw-normal text-center">${project.deployment + "%"}</p>
      </td>
      <td class="border-bottom-0">
          <p class="mb-0 fw-normal text-center">${new Date(
            project.complete_date
          ).toLocaleDateString()}</p>
      </td>
      <td class="border-bottom-0">
        <div class="d-flex align-items-center justify-content-center gap-2">
          <button class="btn btn-warning btn-sm d-flex align-items-center justify-content-center" onclick="openEditModal(${
            project.id
          })">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-sm d-flex align-items-center justify-content-center" onclick="deleteProject(${
            project.id
          })">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>`;
    tableBody.appendChild(row);
  });

  // Only show pagination controls if not showing all entries
  if (itemsPerPage !== "all") {
    // Update pagination controls
    updatePagination(totalPages);
  } else {
    // Hide pagination when showing all entries
    paginationElement.innerHTML = "";
  }

  // Update showing entries info
  updateEntriesInfo(
    projects.length,
    startIndex + 1,
    Math.min(endIndex, projects.length)
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
    newPage <= Math.ceil(filteredProjects.length / itemsPerPage)
  ) {
    currentPage = newPage;
    const searchTerm = document
      .getElementById("searchInput")
      .value.toLowerCase();
    if (searchTerm) {
      filterAndDisplayProjects(searchTerm);
    } else {
      displayProjects(filteredProjects);
    }
  }
}

// Functions for Modal Edit & Delete
function openEditModal(projectId) {
  // Find the project with the matching ID
  const project = filteredProjects.find((p) => p.id === projectId);

  if (project) {
    // Populate the edit modal with project details
    document.getElementById("edit_project_id").value = project.id;
    document.getElementById("edit_projectName").value = project.project_name;
    document.getElementById("edit_projectType").value = project.project_type;
    document.getElementById("edit_startDate").value = project.start_date;
    document.getElementById("edit_endDate").value = project.end_date;
    document.getElementById("edit_complexity").value = project.complexity;
    document.getElementById("edit_priority").value = project.priority;
    document.getElementById("edit_planning").value = project.planning;
    document.getElementById("edit_requirement_analysis").value =
      project.requirement_analysis;
    document.getElementById("edit_development").value = project.development;
    document.getElementById("edit_testing").value = project.testing;
    document.getElementById("edit_deployment").value = project.deployment;
    document.getElementById("edit_complete_date").value = project.complete_date;
    new bootstrap.Modal(document.getElementById("editModal")).show();
  }
}

// Function to update project
async function updateProject(event) {
  event.preventDefault();

  const projectId = document.getElementById("edit_project_id").value;
  const updatedProject = {
    project_name: document.getElementById("edit_projectName").value,
    project_type: document.getElementById("edit_projectType").value,
    start_date: document.getElementById("edit_startDate").value,
    end_date: document.getElementById("edit_endDate").value,
    complexity: document.getElementById("edit_complexity").value,
    priority: parseInt(document.getElementById("edit_priority").value),
    planning: parseInt(document.getElementById("edit_planning").value),
    requirement_analysis: parseInt(
      document.getElementById("edit_requirement_analysis").value
    ),
    development: parseInt(document.getElementById("edit_development").value),
    testing: parseInt(document.getElementById("edit_testing").value),
    deployment: parseInt(document.getElementById("edit_deployment").value),
    complete_date: document.getElementById("edit_complete_date").value,
  };

  try {
    const { data, error } = await supabase
      .from("projects")
      .update(updatedProject)
      .eq("id", projectId);

    if (error) throw error;

    // Close the modal
    const editModal = bootstrap.Modal.getInstance(
      document.getElementById("editModal")
    );
    editModal.hide();

    // Reload projects
    loadProjects();
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to update project: " + error.message);
  }
}

// Function to delete project
async function deleteProject(projectId) {
  if (confirm("Are you sure you want to delete this project?")) {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      // Reload projects
      loadProjects();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete project: " + error.message);
    }
  }
}

// Make functions available globally
window.changePage = changePage;
window.openEditModal = openEditModal;
window.updateProject = updateProject;
window.deleteProject = deleteProject;
