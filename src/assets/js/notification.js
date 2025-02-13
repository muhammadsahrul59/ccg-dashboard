document.addEventListener("DOMContentLoaded", function () {
  const shouldShowNotification =
    sessionStorage.getItem("showLoginNotification") === "true";

  if (shouldShowNotification) {
    sessionStorage.removeItem("showLoginNotification");

    const notification = document.getElementById("loginNotification");
    if (notification) {
      // Tampilkan notifikasi
      setTimeout(() => {
        notification.classList.add("show");
      }, 100);

      // Sembunyikan notifikasi setelah 4 detik
      setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("hide");

        // Hapus notifikasi dari DOM setelah animasi selesai
        setTimeout(() => {
          notification.remove();
        }, 500); // Sesuaikan dengan durasi animasi CSS
      }, 4000);
    }
  }
});
