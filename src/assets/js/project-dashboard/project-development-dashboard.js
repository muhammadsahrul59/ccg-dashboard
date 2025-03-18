import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";
const supabase = createClient(supabaseUrl, supabaseKey);

const accentColors = ["#44a5a0", "#f9ad3c", "#5e8b87", "#ffbc5e"]; // Color variations

let allProjects = [];
let picColumnChart = null;
let holidays = []; // To store holiday dates

document.addEventListener("DOMContentLoaded", function () {
  loadDashboardData();
});

async function loadDashboardData() {
  try {
    // Fetch projects from Supabase
    const { data: projectsData, error: projectsError } = await supabase
      .from("projects")
      .select("*");

    if (projectsError) throw projectsError;

    // Fetch holidays from Supabase
    const { data: holidaysData, error: holidaysError } = await supabase
      .from("hari_libur")
      .select("*");

    if (holidaysError) throw holidaysError;

    // Store the data
    allProjects = projectsData;
    holidays = holidaysData || [];

    updateDashboard();
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    alert("Unable to load dashboard data. Please try again later.");
  }
}

function updateDashboard() {
  // Use all projects by default since we removed the filter
  const filteredProjects = allProjects;

  // We removed updateStatistics since we removed the Total Projects card
  createPicColumnChart(filteredProjects);
  createProjectOverviewTable(filteredProjects);
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

  // Create column chart with UI similar to your example
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
      fontFamily: "inherit",
      background: "transparent",
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: "zoom",
        offsetX: 0,
        offsetY: 0,
        color: "#000",
      },
    },
    colors: undefined, // Using undefined will apply the default ApexCharts color palette
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        dataLabels: {
          position: "center",
        },
        distributed: true, // This makes each bar have a different color
      },
    },
    dataLabels: {
      enabled: true,
      position: "center",
      style: {
        colors: ["#fff"],
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
        style: {
          colors: "#000",
        },
      },
      axisBorder: {
        show: true,
        color: "rgba(0, 0, 0, 0.3)",
      },
      axisTicks: {
        show: true,
        color: "rgba(0, 0, 0, 0.3)",
      },
    },
    yaxis: {
      title: {
        text: "Number of Projects",
        style: {
          color: "#000",
        },
      },
      labels: {
        style: {
          colors: "#000",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " projects";
        },
      },
    },
    grid: {
      borderColor: "rgba(0, 0, 0, 0.1)",
    },
    legend: {
      show: false,
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

// Function to check if a date is a holiday
function isHoliday(date) {
  return holidays.some((holiday) => {
    const holidayDate = new Date(holiday.tanggal);
    return (
      date.getDate() === holidayDate.getDate() &&
      date.getMonth() === holidayDate.getMonth() &&
      date.getFullYear() === holidayDate.getFullYear()
    );
  });
}

// Function to calculate working days between two dates
function calculateWorkingDays(startDate, endDate) {
  if (!startDate || !endDate) return null;

  // Clone dates to avoid modifying the originals
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  // If start is after end, return 0
  if (start > end) return 0;

  let days = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday(current)) {
      days++;
    }
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function createProjectDetailsTable(projects) {
  const tableBody = document.getElementById("projectDetailsTable");
  tableBody.innerHTML = "";

  // Process project details
  const processedProjects = projects
    .map((project) => {
      const startDate = project.start_date
        ? new Date(project.start_date)
        : null;
      const dueDate = project.due_date ? new Date(project.due_date) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate working days between start and due date
      const workingDays = calculateWorkingDays(startDate, dueDate);

      // Determine status based on dates and database value
      let status;

      // If the database already has a "Done" status, keep it
      if (project.status === "Done") {
        status = "Done";
      }
      // If today is before start date, status is "Not Started"
      else if (startDate && today < startDate) {
        status = "Not Started";
      }
      // If today is after due date, status is "Late"
      else if (dueDate && today > dueDate) {
        status = "Late";
      }
      // Default status is "On Track" or use the database value if available
      else {
        status = project.status || "On Track";
      }

      return {
        ...project,
        startDate,
        dueDate,
        workingDays,
        status,
        formattedStartDate: startDate
          ? startDate.toLocaleDateString()
          : "Not set",
        formattedDueDate: dueDate ? dueDate.toLocaleDateString() : "Not set",
      };
    })
    .sort((a, b) => {
      // Sort by status priority
      const statusPriority = {
        Late: 1, // Highest priority
        "Not Started": 2,
        "On Track": 3,
        Done: 4, // Lowest priority
      };

      const aPriority = statusPriority[a.status] || 5;
      const bPriority = statusPriority[b.status] || 5;

      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // If both have same status category, sort by due date
      if (a.dueDate === null && b.dueDate === null) return 0;
      if (a.dueDate === null) return 1;
      if (b.dueDate === null) return -1;
      return a.dueDate - b.dueDate;
    });

  // Create table rows
  processedProjects.forEach((project) => {
    // Determine status color based on status text
    let statusClass;

    switch (project.status) {
      case "Done":
        statusClass = "bg-success text-white"; // Green for done
        break;
      case "Not Started":
        statusClass = "bg-muted text-white"; // Gray for not started
        break;
      case "Late":
        statusClass = "bg-danger text-white"; // Red for late
        break;
      case "On Track":
      default:
        statusClass = "bg-primary text-white"; // Blue for on track
        break;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${project.pic || "Unassigned"}</td>
      <td>${project.name_project || "Unnamed Project"}</td>
      <td>${project.name_activity || "N/A"}</td>
      <td>${project.formattedStartDate}</td>
      <td>${project.formattedDueDate}</td>
      <td>${project.workingDays !== null ? project.workingDays : "N/A"}</td>
      <td><span class="badge ${statusClass}">${project.status}</span></td>
    `;

    tableBody.appendChild(row);
  });

  // Display message if no data
  if (processedProjects.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="7" class="text-center">No detailed data available for this project</td>`;
    tableBody.appendChild(row);
  }
}

// Add function to refresh data periodically
function setupAutoRefresh() {
  // Refresh data every 5 minutes
  setInterval(loadDashboardData, 5 * 60 * 1000);
}

// Call setupAutoRefresh after page loads
window.addEventListener("load", setupAutoRefresh);

// Export the function to be accessible from the HTML
window.showProjectDetails = showProjectDetails;
