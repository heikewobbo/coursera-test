document.addEventListener("DOMContentLoaded", function () {
  const tableContainer = document.querySelector(".table-container");
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");
  const dateTimeElement = document.querySelector(".date-time");
  const filterInput = document.getElementById("filter-input");

  const rowsPerPage = 25;
  let currentPage = 1;
  let data = [];

  function getCurrentDateTime() {
    const now = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return now.toLocaleString("it-IT", options);
  }

  dateTimeElement.textContent = getCurrentDateTime();

  function loadData(callback) {
    fetch("/coursera-test/airports.dat")
      .then(response => response.text())
      .then(data => {
        const lines = data.trim().split("\n");
        data = lines.map(line => {
          const [icao, long, lat, name] = line.split("/");
          return { icao, name };
        });
        callback(data);
      })
      .catch(error => console.error("Errore nel caricamento dei dati:", error));
  }

  function updateTable(filterText = "") {
    const start = currentPage * rowsPerPage;
    const end = start + rowsPerPage;

    let dataToDisplay = data.slice(start, end);

    if (filterText !== "") {
      dataToDisplay = dataToDisplay.filter(item => 
        item.icao.toLowerCase().includes(filterText) || item.name.toLowerCase().includes(filterText)
      );
    }

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

    // Creazione del link con l'ICAO
    const icaoLink = document.createElement("a");
    icaoLink.href = `http://www.simbrief.com/system/dispatch.php?dest=${item.icao}`;
    icaoLink.target = "_blank";
    icaoLink.textContent = item.icao;

    // Creazione delle celle della riga
    const icaoCell = document.createElement("td");
    icaoCell.appendChild(icaoLink);

    const nameCell = document.createElement("td");
    nameCell.textContent = item.name;

    // Aggiunta delle celle alla riga
    row.appendChild(icaoCell);
    row.appendChild(nameCell);

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

  filterInput.addEventListener("input", () => {
    const filterText = filterInput.value.trim().toLowerCase();
    updateTable(filterText);
  });

  loadData(data => {
    data = data;
    updateTable();
  });
});
