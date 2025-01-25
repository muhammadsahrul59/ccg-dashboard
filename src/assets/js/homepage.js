async function fetchProjects() {
  try {
    const response = await fetch("http://localhost:5000/projects");
    const data = await response.json();
    updateDashboard(data);
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
}

function updateDashboard(projects) {
  // Update stats
  document.getElementById("totalProjects").textContent = projects.length;
  const completed = projects.filter((p) => p.deployment === 100).length;
  const inProgress = projects.filter((p) => p.deployment < 100).length;
  document.getElementById("completedProjects").textContent = completed;
  document.getElementById("inProgressProjects").textContent = inProgress;

  const totalDuration = projects.reduce(
    (sum, p) => sum + parseInt(p.actual || 0),
    0
  );
  document.getElementById(
    "totalDuration"
  ).textContent = `${totalDuration} days`;

  // Update project timeline chart
  const timelineData = projects
    .map((p) => ({
      x: p.project_name,
      y: [new Date(p.start_date).getTime(), new Date(p.end_date).getTime()],
    }))
    .slice(0, 10); // Show only 10 latest projects

  const timelineOptions = {
    series: [
      {
        name: "Projects",
        data: timelineData,
      },
    ],
    chart: {
      type: "rangeBar",
      height: 300,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      type: "datetime",
    },
  };

  new ApexCharts(
    document.querySelector("#projectTimeline"),
    timelineOptions
  ).render();

  // Update project types chart
  const projectTypes = projects.reduce((acc, p) => {
    acc[p.project_type] = (acc[p.project_type] || 0) + 1;
    return acc;
  }, {});

  const typeOptions = {
    series: Object.values(projectTypes),
    chart: {
      type: "pie",
      height: 300,
    },
    labels: Object.keys(projectTypes),
    colors: ["#0d6efd", "#198754", "#ffc107", "#dc3545"],
  };

  new ApexCharts(document.querySelector("#projectTypes"), typeOptions).render();

  // Update projects table
  const tableBody = document.getElementById("projectsTableBody");
  tableBody.innerHTML = projects
    .slice(0, 10)
    .map(
      (p) => `
      <tr>
        <td>${p.project_name}</td>
        <td>${p.project_owner}</td>
        <td>${p.project_type}</td>
        <td>${new Date(p.start_date).toLocaleDateString()}</td>
        <td>${new Date(p.end_date).toLocaleDateString()}</td>
        <td><span class="badge rounded-pill priority-${p.priority}">${
        p.priority
      }</span></td>
        <td>
          <div class="progress">
            <div class="progress-bar bg-primary" role="progressbar" style="width: ${
              p.deployment
            }%" 
                 aria-valuenow="${
                   p.deployment
                 }" aria-valuemin="0" aria-valuemax="100">
              ${p.deployment}%
            </div>
          </div>
        </td>
      </tr>
    `
    )
    .join("");
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  fetchProjects();
  document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString();
});

// Filter projects
function filterProjects(filter) {
  fetchProjects().then((data) => {
    let filtered = data;
    if (filter === "completed") {
      filtered = data.filter((p) => p.deployment === 100);
    } else if (filter === "ongoing") {
      filtered = data.filter((p) => p.deployment < 100);
    }
    updateDashboard(filtered);
  });
}
