document.addEventListener("DOMContentLoaded", function () {
  fetch("/coursera-test/lista.dat")
    .then(response => response.text())
    .then(data => {
      const lines = data.trim().split("\n");
      const parsedData = lines.map(line => {
        const [nome, cognome, eta] = line.split("/");
        return { nome, cognome, eta };
      });
      populateTable(parsedData);
    })
    .catch(error => console.error("Errore nella richiesta:", error));
});

function populateTable(data) {
  const table = document.getElementById("data-table");
  const tbody = table.querySelector("tbody");

  tbody.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item.icao}</td><td>${item.long}</td><td>${item.lat}</td><td>${item.name}</td>`;
    tbody.appendChild(row);
  });
}

// Funzione per filtrare la tabella in base ai valori di input
function filterTable() {
  const inputElements = document.querySelectorAll(".filter-input");
  const filters = Array.from(inputElements).map(input => input.value.toLowerCase());

  const rows = document.querySelectorAll("#data-table tbody tr");

  rows.forEach((row, index) => {
    const cells = Array.from(row.querySelectorAll("td"));
    const matches = cells.every((cell, cellIndex) =>
      cell.textContent.toLowerCase().includes(filters[cellIndex])
    );

    row.style.display = matches ? "table-row" : "none";
  });
}

// Aggiungi event listener agli input per triggerare il filtraggio
const filterInputs = document.querySelectorAll(".filter-input");
filterInputs.forEach(input => {
  input.addEventListener("input", filterTable);
});
