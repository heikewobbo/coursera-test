document.addEventListener("DOMContentLoaded", function () {
  fetch("/coursera-test/airports.dat")
    .then(response => response.text())
    .then(data => {
      const lines = data.trim().split("\n");
      const parsedData = lines.map(line => {
        const [icao, long, lat, name] = line.split("/");
        return {icao, long, lat, name};
      });
      populateTable(parsedData);
    })
    .catch(error => console.error("Errore nella richiesta:", error));
});

const tableContainer = document.querySelector(".table-container");
const loadingIndicator = document.getElementById("loading");

const rowsPerPage = 50; // Numero di righe da caricare per volta
let currentPage = 0; // Pagina attuale

function loadRows(page) {
  const start = page * rowsPerPage;
  const end = start + rowsPerPage;

  loadingIndicator.style.display = "block";

  // Simula un ritardo per il caricamento dei dati (sostituisci con la tua logica di caricamento)
  setTimeout(() => {
    for (let i = start; i < end && i < data.length; i++) {
      const row = createRow(data[i]);
      document.getElementById("data-table").querySelector("tbody").appendChild(row);
    }

    loadingIndicator.style.display = "none";
  }, 1000);
}

function createRow(item) {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${item.icao}</td><td>${item.long}</td><td>${item.lat}</td><td>${item.name}</td>`;
  return row;
}

// Carica le prime righe
loadRows(currentPage);

// Rileva lo scorrimento del contenitore
tableContainer.addEventListener("scroll", () => {
  if (tableContainer.scrollTop + tableContainer.clientHeight >= tableContainer.scrollHeight - 10) {
    currentPage++;
    loadRows(currentPage);
  }
});

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
