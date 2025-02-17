import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";
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

  loadProjects();
});

async function loadProjects() {
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) throw error;

    filteredProjects = projects;
    displayProjects(filteredProjects);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to load projects: " + error.message);
  }
}

function filterAndDisplayProjects(searchTerm) {
  const searchResults = filteredProjects.filter((project) => {
    return (
      project.name_project.toLowerCase().includes(searchTerm) ||
      project.name_activity.toLowerCase().includes(searchTerm) ||
      project.act_this_week.toLowerCase().includes(searchTerm) ||
      project.act_next_week.toLowerCase().includes(searchTerm) ||
      project.pic.toLowerCase().includes(searchTerm)
    );
  });

  currentPage = 1;
  displayProjects(searchResults);
}

function displayProjects(projects) {
  const tableBody = document.getElementById("projectTableBody");
  const paginationElement = document.querySelector(".pagination");
  tableBody.innerHTML = "";

  const totalPages =
    itemsPerPage === "all" ? 1 : Math.ceil(projects.length / itemsPerPage);
  const startIndex =
    itemsPerPage === "all" ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === "all" ? projects.length : startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  currentProjects.forEach((project) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="border-bottom-0"><h6 class="fw-semibold mb-0 text-center">${
        project.name_project
      }</h6></td>
      <td class="border-bottom-0"><p class="mb-0 fw-normal text-center">${
        project.name_activity
      }</p></td>
      <td class="border-bottom-0"><p class="mb-0 fw-normal text-center">${
        project.start_date
          ? new Date(project.start_date).toLocaleDateString()
          : "-"
      }</p></td>
      <td class="border-bottom-0"><p class="mb-0 fw-normal text-center">${
        project.due_date ? new Date(project.due_date).toLocaleDateString() : "-"
      }</p></td>
      <td class="border-bottom-0"><p class="mb-0 fw-normal text-center">${
        project.act_this_week || "-"
      }</p></td>
      <td class="border-bottom-0"><p class="mb-0 fw-normal text-center">${
        project.act_next_week || "-"
      }</p></td>
      <td class="border-bottom-0"><p class="mb-0 fw-normal text-center">${
        project.progress
      }%</p></td>
      <td class="border-bottom-0"><p class="mb-0 fw-normal text-center">${
        project.total_progress
      }%</p></td>
      <td class="border-bottom-0"><p class="mb-0 fw-normal text-center">${
        project.done_date
          ? new Date(project.done_date).toLocaleDateString()
          : "-"
      }</p></td>
      <td class="border-bottom-0"><p class="mb-0 fw-normal text-center">${
        project.pic
      }</p></td>
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

  if (itemsPerPage !== "all") {
    updatePagination(totalPages);
  } else {
    paginationElement.innerHTML = "";
  }

  updateEntriesInfo(
    projects.length,
    startIndex + 1,
    Math.min(endIndex, projects.length)
  );
}

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

function updatePagination(totalPages) {
  const paginationElement = document.querySelector(".pagination");
  paginationElement.innerHTML = "";

  const firstLi = document.createElement("li");
  firstLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  firstLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(1)">First</a>`;
  paginationElement.appendChild(firstLi);

  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${
    currentPage - 1
  })">Previous</a>`;
  paginationElement.appendChild(prevLi);

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

  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${
    currentPage + 1
  })">Next</a>`;
  paginationElement.appendChild(nextLi);

  const lastLi = document.createElement("li");
  lastLi.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  lastLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${totalPages})">Last</a>`;
  paginationElement.appendChild(lastLi);
}

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

function openEditModal(projectId) {
  const project = filteredProjects.find((p) => p.id === projectId);

  if (project) {
    document.getElementById("edit_project_id").value = project.id;
    document.getElementById("edit_name_project").value = project.name_project;
    document.getElementById("edit_name_activity").value = project.name_activity;
    document.getElementById("edit_start_date").value = project.start_date;
    document.getElementById("edit_due_date").value = project.due_date;
    document.getElementById("edit_act_this_week").value = project.act_this_week;
    document.getElementById("edit_act_next_week").value = project.act_next_week;
    document.getElementById("edit_progress").value = project.progress;
    document.getElementById("edit_total_progress").value =
      project.total_progress;
    document.getElementById("edit_done_date").value = project.done_date;
    document.getElementById("edit_pic").value = project.pic;

    new bootstrap.Modal(document.getElementById("editModal")).show();
  }
}

async function updateProject(event) {
  event.preventDefault();

  const projectId = document.getElementById("edit_project_id").value;
  const updatedProject = {
    name_project: document.getElementById("edit_name_project").value,
    name_activity: document.getElementById("edit_name_activity").value,
    start_date: document.getElementById("edit_start_date").value,
    due_date: document.getElementById("edit_due_date").value,
    act_this_week: document.getElementById("edit_act_this_week").value,
    act_next_week: document.getElementById("edit_act_next_week").value,
    progress: parseInt(document.getElementById("edit_progress").value),
    total_progress: parseInt(
      document.getElementById("edit_total_progress").value
    ),
    done_date: document.getElementById("edit_done_date").value,
    pic: document.getElementById("edit_pic").value,
  };

  try {
    const { data, error } = await supabase
      .from("projects")
      .update(updatedProject)
      .eq("id", projectId);

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    const editModal = bootstrap.Modal.getInstance(
      document.getElementById("editModal")
    );
    editModal.hide();

    loadProjects();
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to update project: " + error.message);
  }
}

async function deleteProject(projectId) {
  if (confirm("Are you sure you want to delete this project?")) {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

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
