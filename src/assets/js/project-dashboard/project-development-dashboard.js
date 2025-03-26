import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";
const supabase = createClient(supabaseUrl, supabaseKey);

const accentColors = ["#44a5a0", "#f9ad3c", "#5e8b87", "#ffbc5e"]; // Color variations

let allProjects = [];
let holidays = []; // To store holiday dates
let currentFilter = null; // Track the current filter
let defaultProject = null; // Track the default project to show

// Team members to track
const teamMembers = ["Syarief Hidayat", "Herlina", "Nita", "Dini"];

document.addEventListener("DOMContentLoaded", function () {
  loadDashboardData();
  setupTeamMemberClickListeners();
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
    allProjects = projectsData || [];
    holidays = holidaysData || [];

    // Apply current filter or show all projects
    updateDashboard(currentFilter);

    // Show project details section immediately
    // If no specific project is selected, show details for the first project
    if (allProjects.length > 0) {
      // Find the first project with a name
      const firstProject = allProjects.find((project) => project.name_project);

      // If we have a default project set (from filtering), use that
      const projectToShow =
        defaultProject || (firstProject ? firstProject.name_project : null);

      if (projectToShow) {
        showProjectDetails(projectToShow);
      }
    }
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    alert("Unable to load dashboard data. Please try again later.");
  }
}

function updateDashboard(teamMember = null) {
  // Store the current filter
  currentFilter = teamMember;

  // Get all projects
  let filteredProjects = allProjects;

  // Apply team member filter if specified
  if (teamMember) {
    filteredProjects = allProjects.filter((project) => {
      const pic = project.pic;

      // Check if PIC is null or undefined
      if (!pic) return false;

      // Check for exact match
      if (pic === teamMember) return true;

      // Check if PIC contains multiple names (e.g., "Syarief Hidayat & Herlina")
      if (pic.includes("&")) {
        const pics = pic.split("&").map((name) => name.trim());
        return pics.includes(teamMember);
      }

      return false;
    });

    // Update filter indicator
    updateFilterIndicator(teamMember);

    // Set default project to first project in filtered list
    if (filteredProjects.length > 0) {
      defaultProject = filteredProjects[0].name_project;
    } else {
      defaultProject = null;
    }
  } else {
    // Reset filter indicator
    updateFilterIndicator(null);
    defaultProject = null;
  }

  // Update team member project counts - always use all projects for consistent counts
  updateTeamMemberCounts(allProjects);

  // Update total project count - always use all projects for the total count
  updateTotalProjectCount(allProjects);

  // Create project progress grid with filtered projects
  createProjectProgressGrid(filteredProjects);

  // If we have a default project, show its details
  if (defaultProject) {
    showProjectDetails(defaultProject);
  } else if (filteredProjects.length > 0) {
    // Otherwise show the first project in the filtered list
    showProjectDetails(filteredProjects[0].name_project);
  }
}

function updateTotalProjectCount(projects) {
  // Get unique project names
  const uniqueProjects = new Set();

  projects.forEach((project) => {
    if (project.name_project) {
      uniqueProjects.add(project.name_project);
    }
  });

  // Update the total project count in the UI
  const totalProjectElement = document.getElementById("totalProjectCount");
  if (totalProjectElement) {
    totalProjectElement.textContent = uniqueProjects.size;
  } else {
    console.error("Total project count element not found");
  }
}

function updateTeamMemberCounts(projects) {
  // Create object to store unique projects per team member
  const teamMemberProjects = {};

  // Initialize counts for each team member
  teamMembers.forEach((member) => {
    teamMemberProjects[member] = new Set();
  });

  // Count unique projects for each team member
  projects.forEach((project) => {
    const pic = project.pic;
    const projectName = project.name_project;

    if (pic && projectName) {
      // Check if PIC field contains multiple names (e.g., "Syarief Hidayat & Herlina")
      if (pic.includes("&")) {
        // Split the PIC string by "&" and trim whitespace
        const pics = pic.split("&").map((name) => name.trim());

        // Add the project to each PIC's list
        pics.forEach((individualPic) => {
          if (teamMembers.includes(individualPic)) {
            teamMemberProjects[individualPic].add(projectName);
          }
        });
      } else if (teamMembers.includes(pic)) {
        // Single PIC case
        teamMemberProjects[pic].add(projectName);
      }
    }
  });

  // Update the UI with project counts
  teamMembers.forEach((member) => {
    const elementId = member.toLowerCase().replace(" ", "") + "ProjectCount";
    const countElement = document.getElementById(elementId);
    if (countElement) {
      countElement.textContent = teamMemberProjects[member].size;
    } else {
      console.error(`Element not found: ${elementId}`);
    }
  });
}

function filterProjectsByTeamMember(teamMember) {
  // Update the dashboard with the filtered projects
  updateDashboard(teamMember);

  // Project details will be shown automatically in updateDashboard()
}

function resetFilter() {
  // Update the dashboard with all projects
  updateDashboard(null);

  // Project details will be shown automatically in updateDashboard()
}

function updateFilterIndicator(teamMember) {
  // Get the container where we'll put our filter indicator
  const container = document.querySelector(
    ".row-compact:nth-child(2) .col-12 .card-body"
  );

  if (!container) {
    console.error("Filter indicator container not found");
    return;
  }

  // Get the title element
  let title = container.querySelector("h4");

  // Create the title if it doesn't exist
  if (!title) {
    title = document.createElement("h4");
    title.className = "card-title fw-semibold text-center";
    container.appendChild(title);
  }

  // Update the title to show the current filter
  if (teamMember) {
    title.textContent = `Progress Project - ${teamMember}`;
  } else {
    title.textContent = "Progress Project";
  }

  // Add a clear filter button if filtering
  if (teamMember) {
    // Check if we already have a clear button
    let clearButton = container.querySelector(".clear-filter-btn");

    if (!clearButton) {
      clearButton = document.createElement("button");
      clearButton.className = "btn btn-sm btn-muted clear-filter-btn";
      clearButton.innerHTML = '<i class="fas fa-times"></i> Clear Filter';
      clearButton.style.marginLeft = "10px";
      clearButton.style.position = "absolute";
      clearButton.style.right = "20px";
      clearButton.style.top = "20px";

      clearButton.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent event bubbling
        resetFilter();
      });

      // Add the button next to the title
      container.appendChild(clearButton);
    }
  } else {
    // Remove the clear button if it exists
    const clearButton = container.querySelector(".clear-filter-btn");
    if (clearButton) {
      clearButton.remove();
    }
  }
}

function createProjectProgressGrid(projects) {
  // Get the container where we'll put our grid
  const container = document.querySelector(
    ".row-compact:nth-child(2) .col-12 .card-body"
  );

  if (!container) {
    console.error("Project progress container not found");
    return;
  }

  // First, keep the title and clear button if they exist
  const title = container.querySelector("h4");
  const clearButton = container.querySelector(".clear-filter-btn");

  // Clear the container
  container.innerHTML = "";

  // Add back the title and clear button
  if (title) container.appendChild(title);
  if (clearButton) container.appendChild(clearButton);

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

  // Convert to array for easier handling
  const projectArray = Object.values(groupedProjects);

  // Create a row div for the first 6 projects
  const row1 = document.createElement("div");
  row1.className = "row mt-4";

  // Create a row div for the remaining projects
  const row2 = document.createElement("div");
  row2.className = "row mt-3";

  // Add projects to rows
  projectArray.forEach((project, index) => {
    // Create card for project
    const col = document.createElement("div");
    col.className = "col-md-2 mb-3";

    const card = document.createElement("div");
    card.className = "card h-100 clickable-row";
    card.style.cursor = "pointer";
    card.style.transition = "transform 0.3s";
    card.style.border = "1px solid #00a39d";
    card.setAttribute("data-project", project.name);

    // Hover effect
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "none";
    });

    // Add click event to show project details
    card.addEventListener("click", function () {
      const projectName = this.getAttribute("data-project");
      showProjectDetails(projectName);
    });

    // Determine progress color
    const progressColor =
      project.totalProgress < 30
        ? "#dc3545" // Red for low progress
        : project.totalProgress < 60
        ? "#ffc107" // Yellow for medium progress
        : "#28a745"; // Green for high progress

    // Create a circular progress chart
    const size = 80;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const dashoffset =
      circumference - (project.totalProgress / 100) * circumference;

    card.innerHTML = `
      <div class="card-body text-center p-2">
        <!-- Circular Progress Chart -->
        <div class="my-2">
          <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <!-- Background circle -->
            <circle cx="${size / 2}" cy="${
      size / 2
    }" r="${radius}" fill="none" stroke="#f0f0f0" stroke-width="${strokeWidth}"></circle>
            <!-- Progress circle -->
            <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" 
                   stroke="${progressColor}" stroke-width="${strokeWidth}" 
                   stroke-dasharray="${circumference}" stroke-dashoffset="${dashoffset}"
                   transform="rotate(-90 ${size / 2} ${size / 2})"></circle>
            <!-- Percentage text -->
            <text x="${size / 2}" y="${
      size / 2
    }" font-size="16" font-weight="bold" fill="${progressColor}" 
                  text-anchor="middle" dominant-baseline="middle">${
                    project.totalProgress
                  }%</text>
          </svg>
        </div>
        <!-- Project Name (smaller) -->
        <h6 class="card-title mb-0 mt-1" style="font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
          project.name
        }</h6>
      </div>
    `;

    col.appendChild(card);

    // Add to first row if index < 6, otherwise add to second row
    if (index < 6) {
      row1.appendChild(col);
    } else {
      row2.appendChild(col);
    }
  });

  // Add rows to container
  container.appendChild(row1);
  container.appendChild(row2);

  // Display message if no data
  if (projectArray.length === 0) {
    const noDataMsg = document.createElement("div");
    noDataMsg.className = "text-center p-4";
    noDataMsg.textContent = "No project data available";
    container.appendChild(noDataMsg);
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

    // Highlight the selected project card
    highlightSelectedProject(projectName);
  }
}

// New function to highlight the selected project card
function highlightSelectedProject(projectName) {
  // Remove highlight from all cards
  document.querySelectorAll(".clickable-row").forEach((card) => {
    card.style.border = "1px solid #00a39d";
    card.style.backgroundColor = "";
  });

  // Add highlight to selected card
  const selectedCard = document.querySelector(
    `.clickable-row[data-project="${projectName}"]`
  );
  if (selectedCard) {
    selectedCard.style.border = "2px solid #00a39d";
    selectedCard.style.backgroundColor = "rgba(0, 163, 157, 0.1)";
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
    row.innerHTML = `<td colspan="6" class="text-center">No detailed data available for this project</td>`;
    tableBody.appendChild(row);
  }
}

// Add click event listeners to team member cards
function setupTeamMemberClickListeners() {
  // Team member cards
  teamMembers.forEach((member) => {
    const elementId = member.toLowerCase().replace(" ", "") + "ProjectCount";
    const cardElement = document.getElementById(elementId)?.closest(".card");

    if (cardElement) {
      cardElement.style.cursor = "pointer";

      // Add hover effect
      cardElement.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-5px)";
        this.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
      });

      cardElement.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "none";
      });

      // Add click event
      cardElement.addEventListener("click", function () {
        filterProjectsByTeamMember(member);
      });
    } else {
      console.error(`Card element not found for member: ${member}`);
    }
  });

  // Add click event to total projects card to reset filter
  const totalProjectsCard = document
    .getElementById("totalProjectCount")
    ?.closest(".card");
  if (totalProjectsCard) {
    totalProjectsCard.style.cursor = "pointer";

    // Add hover effect
    totalProjectsCard.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    });

    totalProjectsCard.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "none";
    });

    // Add click event
    totalProjectsCard.addEventListener("click", function () {
      resetFilter();
    });
  } else {
    console.error("Total projects card not found");
  }
}

// Add function to refresh data periodically
function setupAutoRefresh() {
  // Refresh data every 5 minutes
  setInterval(loadDashboardData, 5 * 60 * 1000);
}

// Call setupAutoRefresh after page loads
window.addEventListener("load", setupAutoRefresh);

// Export functions to be accessible from the HTML
window.showProjectDetails = showProjectDetails;
window.filterProjectsByTeamMember = filterProjectsByTeamMember;
window.resetFilter = resetFilter;
