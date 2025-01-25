document.addEventListener("DOMContentLoaded", function () {
  loadProjects();
});

// Function to load all projects (only for owner Syarief Hidayat)
async function loadProjects() {
  try {
    const response = await fetch("http://localhost:5000/projects");
    const projects = await response.json();

    // Filter projects by owner
    const filteredProjects = projects.filter(
      (project) => project.projectowner === "Herlina Dwi Lestari"
    );

    displayProjects(filteredProjects);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to load projects");
  }
}

// Function to display projects in table
function displayProjects(projects) {
  const tableBody = document.getElementById("projectTableBody");
  tableBody.innerHTML = "";

  projects.forEach((project) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                <td class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">${project.projectname}</h6>
                </td>
                <td class="border-bottom-0">
                    <p class="mb-0 fw-normal">${project.projecttype}</p>
                </td>
                <td class="border-bottom-0">
                    <p class="mb-0 fw-normal">${new Date(
                      project.startdate
                    ).toLocaleDateString()}</p>
                </td>
                <td class="border-bottom-0">
                    <p class="mb-0 fw-normal">${new Date(
                      project.enddate
                    ).toLocaleDateString()}</p>
                </td>
                <td class="border-bottom-0">
                    <p class="mb-0 fw-normal">${project.complexity}</p>
                </td>
                <td class="border-bottom-0">
                    <p class="mb-0 fw-normal">${project.priority}</p>
                </td>
                <td class="border-bottom-0">
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-warning btn-sm" onclick="openEditModal(${
                          project.id
                        })">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProject(${
                          project.id
                        })">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
    tableBody.appendChild(row);
  });
}

// Function to delete project
async function deleteProject(id) {
  if (!confirm("Are you sure you want to delete this project?")) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/projects/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    alert(result.msg);
    loadProjects();
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to delete project");
  }
}

// Function to open edit modal with project data
async function openEditModal(id) {
  try {
    const response = await fetch(`http://localhost:5000/projects/${id}`);
    const project = await response.json();

    document.getElementById("edit_project_id").value = project.id;
    document.getElementById("edit_projectName").value = project.projectname;
    document.getElementById("edit_projectType").value = project.projecttype;
    document.getElementById("edit_startDate").value =
      project.startdate.split("T")[0];
    document.getElementById("edit_endDate").value =
      project.enddate.split("T")[0];
    document.getElementById("edit_complexity").value = project.complexity;
    document.getElementById("edit_priority").value = project.priority;

    // Show the modal
    const editModal = new bootstrap.Modal(document.getElementById("editModal"));
    editModal.show();
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to load project data");
  }
}

// Function to update project
async function updateProject(event) {
  event.preventDefault();
  const id = document.getElementById("edit_project_id").value;

  const formData = {
    projectname: document.getElementById("edit_projectName").value,
    projecttype: document.getElementById("edit_projectType").value,
    startdate: document.getElementById("edit_startDate").value,
    enddate: document.getElementById("edit_endDate").value,
    complexity: document.getElementById("edit_complexity").value,
    priority: parseInt(document.getElementById("edit_priority").value),
  };

  try {
    const response = await fetch(`http://localhost:5000/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    alert(result.msg);

    // Hide modal
    const editModal = bootstrap.Modal.getInstance(
      document.getElementById("editModal")
    );
    editModal.hide();

    // Reload table
    loadProjects();
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to update project");
  }
}

// Make functions available globally
window.deleteProject = deleteProject;
window.openEditModal = openEditModal;
window.updateProject = updateProject;
