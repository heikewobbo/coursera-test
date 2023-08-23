document.addEventListener("DOMContentLoaded", function () {
  const tableContainer = document.querySelector(".table-container");
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");

  const rowsPerPage = 30; // Numero di righe da visualizzare per pagina
  let currentPage = 0; // Pagina attuale

  function loadData(callback) {
    fetch("/coursera-test/airports.dat") // Sostituisci con il percorso corretto
      .then(response => response.text())
      .then(data => {
        const lines = data.trim().split("\n");
        const parsedData = lines.map(line => {
          const [icao, long, lat, name] = line.split("/");
          return { icao, long, lat, name };
        });
        callback(parsedData);
      })
      .catch(error => console.error("Errore nel caricamento dei dati:", error));
  }

  function updateTable(data) {
    const start = currentPage * rowsPerPage;
    const end = start + rowsPerPage;

    const dataToDisplay = data.slice(start, end);
    const tbody = document.getElementById("data-table").querySelector("tbody");
    tbody.innerHTML = "";

    dataToDisplay.forEach(item => {
      const row = createRow(item);
      tbody.appendChild(row);
    });

    updatePaginationButtons();
  }

  function createRow(item) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item.icao}</td><td>${item.long}</td><td>${item.lat}</td><td>${item.name}</td>`;
    return row;
  }

  function updatePaginationButtons() {
    prevPageButton.disabled = currentPage === 0;
    nextPageButton.disabled = currentPage === Math.ceil(data.length / rowsPerPage) - 1;
  }

  prevPageButton.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      updateTable();
    }
  });

  nextPageButton.addEventListener("click", () => {
    if (currentPage < Math.ceil(data.length / rowsPerPage) - 1) {
      currentPage++;
      updateTable();
    }
  });

  // Carica i dati e avvia l'aggiornamento della tabella
  loadData(updateTable);
});
