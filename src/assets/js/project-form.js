function updatePercentage(input, valueId) {
  // Ensure the input is between 0 and 100
  let value = Math.min(100, Math.max(0, input.value));
  input.value = value;
  document.getElementById(valueId).textContent = value + "%";
}

document.addEventListener("DOMContentLoaded", function () {
  const projectForm = document.getElementById("projectForm");

  const validateForm = () => {
    const priority = document.getElementById("priority");
    const priorityValue = parseInt(priority.value);
    if (priorityValue < 1 || priorityValue > 4) {
      alert("Priority must be between 1 and 4");
      return false;
    }

    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    if (endDate < startDate) {
      alert("End date cannot be earlier than start date");
      return false;
    }

    // Validate all percentage inputs
    const percentageInputs = [
      "planning",
      "requirementAnalysis",
      "development",
      "testing",
      "deployment",
    ];
    for (let inputId of percentageInputs) {
      const value = parseInt(document.getElementById(inputId).value);
      if (value < 0 || value > 100) {
        alert(`${inputId} percentage must be between 0 and 100`);
        return false;
      }
    }
    return true;
  };

  projectForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Get form values
    const formData = {
      project_owner: document.getElementById("projectOwner").value,
      project_name: document.getElementById("projectName").value,
      project_type: document.getElementById("projectType").value,
      start_date: document.getElementById("startDate").value,
      end_date: document.getElementById("endDate").value,
      complexity: document.getElementById("complexity").value,
      priority: parseInt(document.getElementById("priority").value),
      planning: parseInt(document.getElementById("planning").value),
      requirement_analysis: parseInt(
        document.getElementById("requirementAnalysis").value
      ),
      development: parseInt(document.getElementById("development").value),
      testing: parseInt(document.getElementById("testing").value),
      deployment: parseInt(document.getElementById("deployment").value),
    };

    try {
      const response = await fetch("/.netlify/functions/saveProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      alert(data.msg);
      window.location.href = "home-my-tasks.html";
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save project: " + error.message);
    }
  });
});
