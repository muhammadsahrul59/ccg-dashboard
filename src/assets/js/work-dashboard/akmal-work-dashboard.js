import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://pembaveqjbfpxajoadte.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWJhdmVxamJmcHhham9hZHRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MDI2NDYsImV4cCI6MjA1MzM3ODY0Nn0.GZ7gYesj-2ZAfSGgZkT7yY0aSJwMQvHsLmXSezm0j0Q";
const supabase = createClient(supabaseUrl, supabaseKey);

let globalData = []; // Store the original data globally

document.addEventListener("DOMContentLoaded", function () {
  loadDashboardData();

  // Add event listener for filter button
  document.getElementById("applyFilter").addEventListener("click", filterData);
});

async function loadDashboardData() {
  try {
    const { data: knowledgeData, error } = await supabase
      .from("work_akmal")
      .select("*");

    if (error) throw error;

    globalData = knowledgeData; // Store the original data
    updateDashboard(knowledgeData); // Initial dashboard update
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }
}

function filterData() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!startDate || !endDate) {
    alert("Please select both start and end dates");
    return;
  }

  // Convert input dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59); // Include the entire end date

  // Filter the data
  const filteredData = globalData.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= start && itemDate <= end;
  });

  if (filteredData.length === 0) {
    alert("No data found for the selected date range");
    return;
  }

  // Update the dashboard with filtered data
  updateDashboard(filteredData);
}

// Function to update all dashboard elements
function updateDashboard(data) {
  updateStatistics(data);
  createCreationMetricsChart(data);
  createUpdateMetricsChart(data);
  createInputMetricsChart(data);
  createActivityOverviewChart(data);
}

// Update your existing functions to handle the filtered data
function updateStatistics(data) {
  const totalCreation = data.reduce(
    (sum, row) => sum + (row.total_creation || 0),
    0
  );
  const totalUpdateKnowledge = data.reduce(
    (sum, row) => sum + (row.total_update_knowledge || 0),
    0
  );
  const totalInput = data.reduce((sum, row) => sum + (row.total_input || 0), 0);

  document.getElementById("totalCreation").textContent = totalCreation;
  document.getElementById("totalUpdateKnowledge").textContent =
    totalUpdateKnowledge;
  document.getElementById("totalInput").textContent = totalInput;
}

function createCreationMetricsChart(data) {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const dates = sortedData.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  });

  // Clear previous chart if exists
  document.querySelector("#creationChart").innerHTML = "";

  new ApexCharts(document.querySelector("#creationChart"), {
    series: [
      {
        name: "Knowledge Creation",
        data: sortedData.map((d) => d.create_knowledge || 0),
      },
      {
        name: "Answer Creation",
        data: sortedData.map((d) => d.create_answer || 0),
      },
      {
        name: "Module Creation",
        data: sortedData.map((d) => d.create_module || 0),
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: dates,
      labels: {
        rotate: -45,
        rotateAlways: true,
      },
    },
    yaxis: {
      title: {
        text: "Count",
      },
    },
    colors: ["#44a5a0", "#faae3c", "#FF3131"],
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return value.toFixed(0);
        },
      },
    },
  }).render();
}

// Similar updates for other chart functions...
function createUpdateMetricsChart(data) {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const dates = sortedData.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  });

  // Clear previous chart if exists
  document.querySelector("#updateChart").innerHTML = "";

  new ApexCharts(document.querySelector("#updateChart"), {
    series: [
      {
        name: "Answer Updates",
        data: sortedData.map((d) => d.update_answer || 0),
      },
      {
        name: "Quick Reply Updates",
        data: sortedData.map((d) => d.update_quick_reply || 0),
      },
      {
        name: "Button Updates",
        data: sortedData.map((d) => d.update_button || 0),
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    colors: ["#44a5a0", "#faae3c", "#FF3131"],
    xaxis: {
      categories: dates,
      labels: {
        rotate: -45,
        rotateAlways: true,
      },
    },
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return value.toFixed(0);
        },
      },
    },
  }).render();
}

function createInputMetricsChart(data) {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const dates = sortedData.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  });

  // Clear previous chart if exists
  document.querySelector("#inputChart").innerHTML = "";

  new ApexCharts(document.querySelector("#inputChart"), {
    series: [
      {
        name: "Synonym Inputs",
        data: sortedData.map((d) => d.input_synonym || 0),
      },
      {
        name: "Intent Inputs",
        data: sortedData.map((d) => d.input_intent || 0),
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    colors: ["#44a5a0", "#faae3c"],
    xaxis: {
      categories: dates,
      labels: {
        rotate: -45,
        rotateAlways: true,
      },
    },
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return value.toFixed(0);
        },
      },
    },
  }).render();
}

function createActivityOverviewChart(data) {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const dates = sortedData.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  });

  // Clear previous chart if exists
  document.querySelector("#activityChart").innerHTML = "";

  new ApexCharts(document.querySelector("#activityChart"), {
    series: [
      {
        name: "Total Creation",
        data: sortedData.map((d) => d.total_creation || 0),
      },
      {
        name: "Total Update Knowledge",
        data: sortedData.map((d) => d.total_update_knowledge || 0),
      },
      {
        name: "Total Input",
        data: sortedData.map((d) => d.total_input || 0),
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
    colors: ["#44a5a0", "#faae3c", "#FF3131"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: dates,
      labels: {
        rotate: -45,
        rotateAlways: true,
      },
    },
    legend: {
      position: "bottom",
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return value.toFixed(0);
        },
      },
    },
  }).render();
}
