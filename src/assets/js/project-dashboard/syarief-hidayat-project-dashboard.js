import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";
const supabase = createClient(supabaseUrl, supabaseKey);

const accentColors = ["#44a5a0", "#f9ad3c", "#5e8b87", "#ffbc5e"]; // Color variations

let allProjects = [];
let holidays = []; // To store holiday dates
let currentFilter = null; // Track the current filter

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
  } else {
    // Reset filter indicator
    updateFilterIndicator(null);
  }

  // Update team member project counts - always use all projects for consistent counts
  updateTeamMemberCounts(allProjects);

  // Update total project count - always use all projects for the total count
  updateTotalProjectCount(allProjects);

  // Create project progress grid with filtered projects
  createProjectProgressGrid(filteredProjects);
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

  // Hide project details since we're changing the view
  document.getElementById("projectDetailsRow").style.display = "none";
}

function resetFilter() {
  // Update the dashboard with all projects
  updateDashboard(null);
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

  // Create a container for the grid layout
  const gridContainer = document.createElement("div");
  gridContainer.className = "project-grid mt-4";
  gridContainer.style.display = "grid";
  gridContainer.style.gridTemplateColumns =
    "repeat(auto-fill, minmax(calc(16.666% - 20px), 1fr))";
  gridContainer.style.gap = "20px";
  gridContainer.style.padding = "10px";

  // Add projects as bar charts
  projectArray.forEach((project) => {
    // Create container for this project's bar
    const projectBarContainer = document.createElement("div");
    projectBarContainer.className = "project-bar-wrapper";
    projectBarContainer.style.position = "relative";
    projectBarContainer.style.height = "80px";
    projectBarContainer.style.cursor = "pointer";
    projectBarContainer.style.borderRadius = "8px";
    projectBarContainer.style.overflow = "hidden";
    projectBarContainer.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    projectBarContainer.setAttribute("data-project", project.name);

    // Add click event to show project details
    projectBarContainer.addEventListener("click", function () {
      const projectName = this.getAttribute("data-project");
      showProjectDetails(projectName);
    });

    // Create bar background
    const barBackground = document.createElement("div");
    barBackground.className = "bar-background";
    barBackground.style.position = "absolute";
    barBackground.style.top = "0";
    barBackground.style.left = "0";
    barBackground.style.width = "100%";
    barBackground.style.height = "100%";
    barBackground.style.backgroundColor = "#eff3f9"; // Light blue-gray background

    // Determine progress color
    const progressColor =
      project.totalProgress < 30
        ? "#ff7b54" // Coral/orange for low progress
        : project.totalProgress < 60
        ? "#ffb72b" // Yellow/orange for medium progress
        : "#4caf50"; // Green for high progress

    // Create progress bar (fill)
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    progressBar.style.position = "absolute";
    progressBar.style.bottom = "0";
    progressBar.style.left = "0";
    progressBar.style.width = "100%";
    progressBar.style.height = `${project.totalProgress}%`;
    progressBar.style.backgroundColor = progressColor;
    progressBar.style.transition = "height 0.5s ease";

    // Add project name
    const projectNameElement = document.createElement("div");
    projectNameElement.className = "project-name";
    projectNameElement.style.position = "absolute";
    projectNameElement.style.top = "10px";
    projectNameElement.style.left = "10px";
    projectNameElement.style.right = "10px";
    projectNameElement.style.fontSize = "0.85rem";
    projectNameElement.style.fontWeight = "bold";
    projectNameElement.style.overflow = "hidden";
    projectNameElement.style.textOverflow = "ellipsis";
    projectNameElement.style.whiteSpace = "nowrap";
    projectNameElement.style.zIndex = "1";
    projectNameElement.textContent = project.name;

    // Add percentage text
    const percentageText = document.createElement("div");
    percentageText.className = "percentage-text";
    percentageText.style.position = "absolute";
    percentageText.style.bottom = "10px";
    percentageText.style.right = "10px";
    percentageText.style.fontWeight = "bold";
    percentageText.style.fontSize = "1.2rem";
    percentageText.style.color = project.totalProgress > 70 ? "white" : "black";
    percentageText.style.zIndex = "1";
    percentageText.textContent = `${project.totalProgress}%`;

    // Add PIC info
    const picElement = document.createElement("div");
    picElement.className = "project-pic";
    picElement.style.position = "absolute";
    picElement.style.bottom = "10px";
    picElement.style.left = "10px";
    picElement.style.fontSize = "0.75rem";
    picElement.style.maxWidth = "60%";
    picElement.style.overflow = "hidden";
    picElement.style.textOverflow = "ellipsis";
    picElement.style.whiteSpace = "nowrap";
    picElement.style.zIndex = "1";
    picElement.textContent = project.pic;

    // Assemble the bar
    projectBarContainer.appendChild(barBackground);
    projectBarContainer.appendChild(progressBar);
    projectBarContainer.appendChild(projectNameElement);
    projectBarContainer.appendChild(percentageText);
    projectBarContainer.appendChild(picElement);

    // Add hover effect
    projectBarContainer.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
    });

    projectBarContainer.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    });

    // Add to grid container
    gridContainer.appendChild(projectBarContainer);
  });

  // Add grid container to main container
  container.appendChild(gridContainer);

  // Make grid responsive
  function updateGridColumns() {
    const containerWidth = container.offsetWidth;
    const columnCount = Math.min(6, Math.floor(containerWidth / 180)); // Ensure max 6 columns
    gridContainer.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
  }

  // Initialize grid layout
  updateGridColumns();

  // Update grid on window resize
  window.addEventListener("resize", updateGridColumns);

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
