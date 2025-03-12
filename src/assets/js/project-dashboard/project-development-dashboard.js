import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";
const supabase = createClient(supabaseUrl, supabaseKey);

const accentColors = ["#44a5a0", "#f9ad3c", "#5e8b87", "#ffbc5e"]; // Color variations

let allProjects = [];
let picColumnChart = null;

document.addEventListener("DOMContentLoaded", function () {
  loadDashboardData();
});

async function loadDashboardData() {
  try {
    // Fetch projects from Supabase
    const { data, error } = await supabase.from("projects").select("*");

    if (error) throw error;

    allProjects = data;
    updateDashboard();
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    alert("Unable to load dashboard data. Please try again later.");
  }
}

function updateDashboard() {
  // Use all projects by default since we removed the filter
  const filteredProjects = allProjects;

  updateStatistics(filteredProjects);
  createPicColumnChart(filteredProjects);
  createProjectOverviewTable(filteredProjects);
}

function updateStatistics(projects) {
  // Count unique project names
  const uniqueProjectNames = [
    ...new Set(projects.map((project) => project.name_project)),
  ].filter((name) => name);

  // Update total projects counter
  document.getElementById("totalProjects").textContent =
    uniqueProjectNames.length;
}

function createPicColumnChart(projects) {
  // Group projects by PIC
  const picData = {};
  projects.forEach((project) => {
    const pic = project.pic || "Unassigned";
    if (!picData[pic]) {
      picData[pic] = {
        count: 0,
        projects: [],
      };
    }

    // Only count unique projects for each PIC
    const projectName = project.name_project;
    if (!picData[pic].projects.includes(projectName)) {
      picData[pic].count++;
      picData[pic].projects.push(projectName);
    }
  });

  // Prepare data for chart
  const categories = Object.keys(picData);
  const seriesData = categories.map((pic) => picData[pic].count);

  // Destroy previous chart if exists
  if (picColumnChart) {
    picColumnChart.destroy();
  }

  // Create column chart with improved UI
  const options = {
    series: [
      {
        name: "Projects",
        data: seriesData,
      },
    ],
    chart: {
      type: "bar",
      height: 250,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
        borderRadius: 4,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#ffffff"],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      labels: {
        show: false, // Hide x-axis labels
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false, // Hide y-axis labels
      },
      title: {
        text: "", // Remove y-axis title
      },
    },
    fill: {
      opacity: 1,
      // Using a single color for all columns instead of accentColors
    },
    grid: {
      borderColor: "rgba(255, 255, 255, 0.1)",
      padding: {
        bottom: 5,
      },
    },
    legend: {
      show: true,
      position: "top",
    },
  };

  picColumnChart = new ApexCharts(
    document.querySelector("#picColumnChart"),
    options
  );
  picColumnChart.render();
}

function createProjectOverviewTable(projects) {
  const tableBody = document.getElementById("projectOverviewTable");
  tableBody.innerHTML = "";

  // Group projects by name_project and pic
  const groupedProjects = {};

  projects.forEach((project) => {
    const projectName = project.name_project || "Unnamed Project";
    const pic = project.pic || "Unassigned";
    const key = `${pic}-${projectName}`;

    if (!groupedProjects[key]) {
      groupedProjects[key] = {
        pic: pic,
        name: projectName,
        activities: [],
        totalProgress: 0,
      };
    }

    groupedProjects[key].activities.push(project);
  });

  // Calculate average progress for each project
  Object.values(groupedProjects).forEach((group) => {
    const totalActivities = group.activities.length;
    if (totalActivities > 0) {
      const progressSum = group.activities.reduce((sum, activity) => {
        return sum + (activity.total_progress || 0);
      }, 0);

      group.totalProgress = Math.round(progressSum / totalActivities);
    }
  });

  // Create table rows
  Object.values(groupedProjects).forEach((project) => {
    const row = document.createElement("tr");
    row.className = "clickable-row";
    row.setAttribute("data-project", project.name);

    // Create progress bar with appropriate color
    const progressColor =
      project.totalProgress < 30
        ? "bg-danger"
        : project.totalProgress < 60
        ? "bg-warning"
        : "bg-success";

    row.innerHTML = `
      <td>${project.pic}</td>
      <td>${project.name}</td>
      <td>
        <div class="progress">
          <div class="progress-bar ${progressColor}" role="progressbar" 
               style="width: ${project.totalProgress}%;" 
               aria-valuenow="${project.totalProgress}" aria-valuemin="0" aria-valuemax="100">
            ${project.totalProgress}%
          </div>
        </div>
      </td>
    `;

    // Add click event to show project details
    row.addEventListener("click", function () {
      const projectName = this.getAttribute("data-project");
      showProjectDetails(projectName);
    });

    tableBody.appendChild(row);
  });

  // Display message if no data
  if (Object.keys(groupedProjects).length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="3" class="text-center">No project data available</td>`;
    tableBody.appendChild(row);
  }
}

function showProjectDetails(projectName) {
  // Filter projects for the selected project
  const projectDetails = allProjects.filter(
    (project) => project.name_project === projectName
  );

  if (projectDetails.length > 0) {
    // Update selected project name
    document.getElementById("selectedProjectName").textContent = projectName;

    // Show project details row
    document.getElementById("projectDetailsRow").style.display = "flex";

    // Update project details table
    createProjectDetailsTable(projectDetails);

    // Scroll to the details section
    document
      .getElementById("projectDetailsRow")
      .scrollIntoView({ behavior: "smooth" });
  }
}

function createProjectDetailsTable(projects) {
  const tableBody = document.getElementById("projectDetailsTable");
  tableBody.innerHTML = "";

  // Process project details - removed the slice(0, 10) to show all rows
  const processedProjects = projects
    .map((project) => {
      const dueDate = project.due_date ? new Date(project.due_date) : null;
      const today = new Date();
      const daysRemaining = dueDate
        ? Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
        : null;
      const isDone = project.done_date ? true : false;

      return {
        ...project,
        dueDate,
        daysRemaining,
        isDone,
        formattedDueDate: dueDate ? dueDate.toLocaleDateString() : "Not set",
      };
    })
    .sort((a, b) => {
      // Sort by done status, then by days remaining
      if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
      if (a.daysRemaining === null && b.daysRemaining === null) return 0;
      if (a.daysRemaining === null) return 1;
      if (b.daysRemaining === null) return -1;
      return a.daysRemaining - b.daysRemaining;
    });
  // Removed the slice(0, 10) limit

  // Create table rows
  processedProjects.forEach((project) => {
    // Determine status color and text
    let statusClass, statusText;

    if (project.isDone) {
      statusClass = "bg-primary text-white";
      statusText = "DONE";
    } else if (project.daysRemaining !== null) {
      if (project.daysRemaining < 0) {
        statusClass = "bg-danger text-white";
        statusText = "Overdue";
      } else if (project.daysRemaining < 3) {
        statusClass = "bg-danger text-white";
        statusText = "Critical";
      } else if (project.daysRemaining < 7) {
        statusClass = "bg-warning";
        statusText = "Warning";
      } else {
        statusClass = "bg-success text-white";
        statusText = "On Track";
      }
    } else {
      statusClass = "bg-secondary text-white";
      statusText = "No Due Date";
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${project.pic || "Unassigned"}</td>
      <td>${project.name_project || "Unnamed Project"}</td>
      <td>${project.name_activity || "N/A"}</td>
      <td>${project.formattedDueDate}</td>
      <td>${
        project.isDone
          ? "0"
          : project.daysRemaining !== null
          ? project.daysRemaining
          : "N/A"
      }</td>
      <td><span class="badge ${statusClass}">${statusText}</span></td>
    `;

    tableBody.appendChild(row);
  });

  // Display message if no data
  if (processedProjects.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="6" class="text-center">No detailed data available for this project</td>`;
    tableBody.appendChild(row);
  }
}

// Export the function to be accessible from the HTML
window.showProjectDetails = showProjectDetails;
