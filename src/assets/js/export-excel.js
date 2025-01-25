document.getElementById("exportButton").addEventListener("click", () => {
  const table = document.querySelector("#projectTableBody"); // ID dari tabel body
  const rows = table.querySelectorAll("tr");

  // Buat array data
  const data = [];
  data.push([
    "Project",
    "Type Project",
    "Start Date",
    "End Date",
    "Complexity",
    "Priority",
  ]);

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const rowData = Array.from(cells).map((cell) => cell.innerText);
    data.push(rowData);
  });

  // Konversi ke worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Buat workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Projects");

  // Simpan file
  XLSX.writeFile(wb, "project_list.xlsx");
});
