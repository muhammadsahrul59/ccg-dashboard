// loadSidebar.js
async function loadSidebar() {
  try {
    const response = await fetch("/sidebar-template-index.html");
    const sidebarContent = await response.text();

    // Insert the sidebar content into the designated container
    const sidebarContainer = document.getElementById("sidebar-container");
    if (sidebarContainer) {
      sidebarContainer.innerHTML = sidebarContent;
    }

    // Reinitialize any necessary sidebar scripts
    if (typeof initSidebar === "function") {
      initSidebar();
    }
  } catch (error) {
    console.error("Error loading sidebar:", error);
  }
}

// Load the sidebar when the document is ready
document.addEventListener("DOMContentLoaded", loadSidebar);
