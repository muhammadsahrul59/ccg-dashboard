document.addEventListener("DOMContentLoaded", function () {
  const shouldShowNotification =
    sessionStorage.getItem("showLoginNotification") === "true";

  if (shouldShowNotification) {
    sessionStorage.removeItem("showLoginNotification");

    const notification = document.getElementById("loginNotification");
    if (notification) {
      // Add progress bar
      const progressBar = document.createElement("div");
      progressBar.className = "progress-bar";
      notification.appendChild(progressBar);

      // Show notification with slight delay
      setTimeout(() => {
        notification.classList.add("show");
      }, 100);

      // Handle navigation - immediately hide notification if user clicks a link
      document.addEventListener("click", (e) => {
        if (e.target.tagName === "A" || e.target.closest("a")) {
          notification.classList.remove("show");
          notification.classList.add("hide");
          setTimeout(() => {
            notification.remove();
          }, 300);
        }
      });

      // Listen for progress bar animation end
      progressBar.addEventListener("animationend", () => {
        notification.classList.remove("show");
        notification.classList.add("hide");
        setTimeout(() => {
          notification.remove();
        }, 500);
      });
    }
  }
});
