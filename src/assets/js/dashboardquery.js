const mysql = require("mysql");

// Buat koneksi ke database MySQL
const connection = mysql.createConnection({
  host: "localhost", // Ganti dengan host database Anda
  user: "root", // Ganti dengan username database Anda
  password: "", // Ganti dengan password database Anda
  database: "projects", // Ganti dengan nama database Anda
});

// Fungsi untuk memperbarui kolom status berdasarkan kolom complete_date
function updateStatus() {
  const query = `
    UPDATE projects
    SET status = CASE
      WHEN complete_date IS NOT NULL THEN 'complete'
      ELSE 'progress'
    END;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error updating status:", err);
      return;
    }
    console.log(
      "Status updated successfully!",
      results.affectedRows,
      "rows affected."
    );
    connection.end();
  });
}

// Jalankan pembaruan status
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database.");
  updateStatus();
});
