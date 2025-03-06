import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";
const supabase = createClient(supabaseUrl, supabaseKey);

// Custom colors for charts
const primaryColor = "#44a5a0"; // Warna utama (mint)
const secondaryColor = "#f9ad3c"; // Warna sekunder (orange)
const accentColors = ["#44a5a0", "#f9ad3c", "#5e8b87", "#ffbc5e"]; // Variasi warna untuk pie chart

let allProjects = [];
let selectedProject = "all";
let previousPerformance = 0; // Store previous performance for comparison
let gaugeChart = null;
let pieChart = null;

document.addEventListener("DOMContentLoaded", function () {
  loadDashboardData();

  // Add event listener to project filter
  document
    .getElementById("projectFilter")
    .addEventListener("change", function () {
      selectedProject = this.value;
      updateDashboard();
    });
});

async function loadDashboardData() {
  try {
    // Fetch projects directly from Supabase
    const { data, error } = await supabase.from("projects").select("*");

    if (error) throw error;

    allProjects = data;

    // Set previous performance (simulation - in real implementation, this would come from historical data)
    // For demo purposes, we'll set it to 5% less than current average
    const currentAvg = calculateAveragePerformance(allProjects);
    previousPerformance = Math.max(0, currentAvg - 5);

    populateProjectFilter();
    updateDashboard();
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    // Add user-friendly error handling
    alert("Unable to load dashboard data. Please try again later.");
  }
}

function populateProjectFilter() {
  const filterElement = document.getElementById("projectFilter");

  // Clear existing options except the "All Projects" option
  while (filterElement.options.length > 1) {
    filterElement.remove(1);
  }

  // Get unique project names from name_project field
  const uniqueProjects = [
    ...new Set(allProjects.map((project) => project.name_project)),
  ].filter((name) => name); // Filter out any undefined or empty names

  // Add options to select element
  uniqueProjects.forEach((projectName) => {
    const option = document.createElement("option");
    option.value = projectName;
    option.textContent = projectName;
    filterElement.appendChild(option);
  });
}

function updateDashboard() {
  // Filter projects based on selection
  const filteredProjects =
    selectedProject === "all"
      ? allProjects
      : allProjects.filter(
          (project) => project.name_project === selectedProject
        );

  updateStatistics(filteredProjects);
  updateProjectTitle(filteredProjects);
  createGaugeChart(filteredProjects);
  createPieChart(filteredProjects);
  createAlertTable(filteredProjects);
}

function updateProjectTitle(projects) {
  const titleElement = document.getElementById("projectTitle");

  if (selectedProject === "all") {
    titleElement.textContent = "All Project Development - Overall Progress";
  } else {
    // Find the PIC for the selected project from the first matching project
    const projectWithPic = projects.find((project) => project.pic);
    const pic = projectWithPic ? projectWithPic.pic : "Not Assigned";

    titleElement.textContent = `${selectedProject} - PIC: ${pic}`;
  }
}

function calculateAveragePerformance(projects) {
  // Don't filter out projects with 0 performance - include all rows in the calculation
  // This ensures we're dividing by the total number of rows as specified

  return projects.length > 0
    ? Math.round(
        projects.reduce(
          (sum, project) => sum + (project.performance_project || 0),
          0
        ) / projects.length
      )
    : 0;
}

function calculateAverageProgress(projects) {
  return projects.length > 0
    ? Math.round(
        projects.reduce(
          (sum, project) => sum + (project.total_progress || 0),
          0
        ) / projects.length
      )
    : 0;
}

function updateStatistics(projects) {
  // Count unique project names from name_project field
  const uniqueProjectNames = [
    ...new Set(projects.map((project) => project.name_project)),
  ].filter((name) => name); // Filter out any undefined or empty names

  const totalProjects = uniqueProjectNames.length;

  // Count total activities
  const totalActivities = projects.length;

  // Calculate performance (average of performance_project for non-zero values)
  const averagePerformance = calculateAveragePerformance(projects);

  // Update DOM elements
  document.getElementById("totalProjects").textContent = totalProjects;
  document.getElementById("totalActivities").textContent = totalActivities;

  // Update performance with trend arrow
  const performanceElement = document.getElementById("performanceProject");
  performanceElement.innerHTML = `${averagePerformance}% 
          ${
            averagePerformance > previousPerformance
              ? '<i class="fas fa-arrow-up text-success"></i>'
              : averagePerformance < previousPerformance
              ? '<i class="fas fa-arrow-down text-danger"></i>'
              : ""
          }`;
}

function createGaugeChart(projects) {
  const averageProgress = calculateAverageProgress(projects);

  if (gaugeChart) {
    gaugeChart.destroy();
  }

  const options = {
    series: [averageProgress],
    chart: {
      height: 300,
      type: "radialBar",
      offsetY: -10,
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: "70%",
          background: "#fff",
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: "#f4f4f4",
          strokeWidth: "67%",
          margin: 0,
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: "#888",
            fontSize: "17px",
          },
          value: {
            formatter: function (val) {
              return parseInt(val) + "%";
            },
            color: "#111",
            fontSize: "36px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: [primaryColor, secondaryColor], // Gradient from primary to secondary color
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
    colors: [primaryColor], // Primary color for the chart
    annotations: {
      points: [
        {
          x: 50,
          y: 50,
          marker: {
            size: 6,
            fillColor: "#fff",
            strokeColor: primaryColor,
            radius: 2,
          },
          label: {
            borderColor: primaryColor,
            offsetY: 0,
            style: {
              color: "#fff",
              background: primaryColor,
            },
            text: `Target: 75%`,
          },
        },
      ],
    },
  };

  gaugeChart = new ApexCharts(document.querySelector("#gaugeChart"), options);
  gaugeChart.render();
}

function createPieChart(projects) {
  const statusCounts = {};
  projects.forEach((project) => {
    let status = (project.status || "Unknown").trim();
    status = status
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const statuses = Object.keys(statusCounts);
  const counts = Object.values(statusCounts);

  if (pieChart) {
    pieChart.destroy();
  }

  const options = {
    series: counts,
    chart: {
      type: "pie",
      width: "100%", // Lebar chart mengikuti container
      height: 250, // Tinggi chart disesuaikan
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    labels: statuses,
    colors: accentColors,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%", // Lebar chart mengikuti container pada layar kecil
            height: 250, // Tinggi chart disesuaikan
          },
        },
      },
    ],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return (
          opts.w.config.labels[opts.seriesIndex] + ": " + val.toFixed(1) + "%"
        );
      },
      style: {
        fontSize: "12px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 2,
        opacity: 0.8,
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (value) {
          return `${value} Project Activity`;
        },
      },
    },
    legend: {
      show: false, // Menyembunyikan legenda
    },
  };

  pieChart = new ApexCharts(document.querySelector("#pieChart"), options);
  pieChart.render();
}

function createAlertTable(projects) {
  const alertTable = document.getElementById("alertTable");
  alertTable.innerHTML = "";

  // Filter projects that don't have a done_date yet (ongoing projects)
  // and have a due_date (to calculate days remaining)
  const ongoingProjects = projects
    .filter((project) => {
      // Include projects with due_date and either:
      // 1. No done_date (still ongoing) or
      // 2. Have a done_date (completed but still want to show)
      return project.due_date;
    })
    .map((project) => {
      const dueDate = new Date(project.due_date);
      const today = new Date();
      const daysRemaining = Math.ceil(
        (dueDate - today) / (1000 * 60 * 60 * 24)
      );

      // Check if project is done (has done_date)
      const isDone = project.done_date ? true : false;

      return {
        ...project,
        daysRemaining,
        isDone,
      };
    })
    .sort((a, b) => {
      // Sort done projects to the bottom
      if (a.isDone && !b.isDone) return 1;
      if (!a.isDone && b.isDone) return -1;
      // Then sort by days remaining (ascending)
      return a.daysRemaining - b.daysRemaining;
    })
    .slice(0, 10); // Top 10 closest to due date

  // Create table rows
  ongoingProjects.forEach((project) => {
    // Determine status color and text
    let statusClass, statusText;

    if (project.isDone) {
      statusClass = "bg-primary text-white";
      statusText = "DONE";
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

    // Format due date
    const dueDate = new Date(project.due_date).toLocaleDateString();

    // Create table row
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${project.name_project || "undefined"}</td>
            <td>${project.name_activity || "N/A"}</td>
            <td>${dueDate}</td>
            <td>${project.isDone ? "0" : project.daysRemaining}</td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
          `;

    alertTable.appendChild(row);
  });

  // Display message if no data
  if (ongoingProjects.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="5" class="text-center">No deadline data available</td>`;
    alertTable.appendChild(row);
  }
}
