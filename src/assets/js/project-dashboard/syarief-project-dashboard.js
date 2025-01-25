document.addEventListener("DOMContentLoaded", function () {
  loadDashboardData();
});

async function loadDashboardData() {
  try {
    const response = await fetch("http://localhost:3211/projects");
    const allProjects = await response.json();

    const projects = allProjects.filter(
      (project) => project.project_owner === "Syarief Hidayat"
    );

    updateStatistics(projects);
    createStatusChart(projects);
    createComplexityChart(projects);
    createPriorityChart(projects);
    createEstimatedVsActualChart(projects);
    createDelayTrendChart(projects);
    createProgressGaugeChart(projects);
    createGanttChart(projects);
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

function updateStatistics(projects) {
  const totalProjects = projects.length;
  const completedProjects = projects.filter(
    (project) =>
      project.planning === 100 &&
      project.requirement_analysis === 100 &&
      project.development === 100 &&
      project.testing === 100 &&
      project.deployment === 100
  ).length;
  const inProgressProjects = totalProjects - completedProjects;

  document.getElementById("totalProjects").textContent = totalProjects;
  document.getElementById("completedProjects").textContent = completedProjects;
  document.getElementById("inProgressProjects").textContent =
    inProgressProjects;
}

function createStatusChart(projects) {
  const statusCount = {
    "Not Started": 0,
    "In Progress": 0,
    Completed: 0,
  };

  projects.forEach((project) => {
    if (project.planning === 100 && project.deployment === 100) {
      statusCount.Completed++;
    } else if (project.planning > 0) {
      statusCount["In Progress"]++;
    } else {
      statusCount["Not Started"]++;
    }
  });

  new ApexCharts(document.querySelector("#statusChart"), {
    series: Object.values(statusCount),
    chart: {
      type: "donut",
      height: 330,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "44%",
        },
      },
    },
    labels: Object.keys(statusCount),
    colors: ["#FF3131", "#f9ad3c", "#44a5a0"],
    legend: {
      position: "bottom",
    },
  }).render();
}

function createComplexityChart(projects) {
  const complexityCount = projects.reduce((acc, proj) => {
    acc[proj.complexity] = (acc[proj.complexity] || 0) + 1;
    return acc;
  }, {});

  new ApexCharts(document.querySelector("#complexityChart"), {
    series: [
      {
        name: "Projects",
        data: Object.values(complexityCount),
      },
    ],
    chart: {
      type: "bar",
      height: 280,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    grid: {
      show: false,
    },
    colors: ["#44a6a1"],
    xaxis: {
      categories: Object.keys(complexityCount),
    },
    tooltip: {
      enabled: true, // Aktifkan tooltip
      y: {
        formatter: (val) => `${val} Projects`, // Format angka
      },
    },
  }).render();
}

function createPriorityChart(projects) {
  const priorityCount = projects.reduce((acc, proj) => {
    acc[proj.priority] = (acc[proj.priority] || 0) + 1;
    return acc;
  }, {});

  new ApexCharts(document.querySelector("#priorityChart"), {
    series: [
      {
        name: "Projects",
        data: Object.values(priorityCount),
      },
    ],
    chart: {
      type: "bar",
      height: 280,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    grid: {
      show: false,
    },
    colors: ["#44a6a1"],
  }).render();
}

function createEstimatedVsActualChart(projects) {
  // Map the data from your MySQL columns
  const chartData = projects.map((project) => ({
    name: project.project_name,
    estimated: project.estimated || 0, // Use the estimated column from MySQL
    actual: project.actual || 0, // Use the actual column from MySQL
  }));

  new ApexCharts(document.querySelector("#estimatedVsActualChart"), {
    series: [
      {
        name: "Actual Progress",
        data: chartData.map((item) => item.actual),
      },
      {
        name: "Estimated Progress",
        data: chartData.map((item) => item.estimated),
      },
    ],
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: ["#44a5a0", "#f9ad3c"],
    stroke: {
      curve: "straight",
      width: 3,
    },
    xaxis: {
      categories: chartData.map((item) => item.name),
      min: 0,
      max: 10,
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 10,
    },
  }).render();
}

function createDelayTrendChart(projects) {
  // Map the data from your MySQL delay column
  const data = projects
    .map((project) => ({
      name: project.project_name,
      delay: project.delay || 0, // Use the delay column from MySQL
    }))
    .sort((a, b) => b.delay - a.delay);

  new ApexCharts(document.querySelector("#delayTrendChart"), {
    series: [
      {
        name: "Delay (days)",
        data: data.map((d) => d.delay),
      },
    ],
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: ["#44a5a0"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: data.map((d) => d.name),
      min: 0,
      max: 10,
    },
    yaxis: {
      min: 0,
      max: 10,
    },
  }).render();
}

function createProgressGaugeChart(projects) {
  // Calculate average progress across all phases for in-progress projects
  const inProgressProjects = projects.filter((project) => {
    const isComplete =
      project.planning === 100 &&
      project.requirement_analysis === 100 &&
      project.development === 100 &&
      project.testing === 100 &&
      project.deployment === 100;
    return !isComplete;
  });

  const averageProgress =
    inProgressProjects.reduce((acc, project) => {
      const progress =
        (project.planning +
          project.requirement_analysis +
          project.development +
          project.testing +
          project.deployment) /
        5;
      return acc + progress;
    }, 0) / (inProgressProjects.length || 1);

  new ApexCharts(document.querySelector("#progressGaugeChart"), {
    series: [Math.round(averageProgress)],
    chart: {
      type: "radialBar",
      height: 200,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#d1d1d150",
          strokeWidth: "97%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "30px",
            color: "#faae3c",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    grid: {
      padding: {
        top: -10,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "green",
        shadeIntensity: 0.4,
        gradientToColors: ["#44a5a0"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    colors: ["#44a5a0"],
  }).render();
}
