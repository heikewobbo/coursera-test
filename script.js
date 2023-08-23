document.addEventListener("DOMContentLoaded", function () {
  const tableContainer = document.querySelector(".table-container");
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");
  const dateTimeElement = document.querySelector(".date-time");
  const filterInput = document.getElementById("filter-input");
  const rowsPerPageSelect = document.getElementById("rows-per-page"); // Aggiunto

  let currentPage = 0;
  let data = [];
  let rowsPerPage = parseInt(rowsPerPageSelect.value); // Aggiunto

  function getCurrentDateTime() {
    const now = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return now.toLocaleString("it-IT", options);
  }

  dateTimeElement.textContent = getCurrentDateTime();

  function loadData(callback) {
    fetch("coursera-test/airports.dat")
      .then(response => response.text())
      .then(rawData => {
        const lines = rawData.trim().split("\n");
        data = lines.map(line => {
          const [icao, long, lat, name] = line.split("/");
          return { icao, long, lat, name };
        });
        callback(data);
      })
      .catch(error => console.error("Errore nel caricamento dei dati:", error));
  }

  function updateTable(dataToDisplay) {
    // Aggiornato per utilizzare la variabile rowsPerPage
    const start = currentPage * rowsPerPage;
    const end = start + rowsPerPage;

    const dataToRender = dataToDisplay.slice(start, end);
    const tbody = document.getElementById("data-table").querySelector("tbody");
    tbody.innerHTML = "";

    dataToRender.forEach(item => {
      const row = createRow(item);
      tbody.appendChild(row);
    });

    updatePaginationButtons();
  }

  function createRow(item) {
    const row = document.createElement("tr");
    const icaoCell = document.createElement("td");
    const icaoLink = document.createElement("a");
    icaoLink.href = `http://www.simbrief.com/system/dispatch.php?dest=${item.icao}`;
    icaoLink.target = "_blank"; // Apre il link in una nuova finestra/tab
    icaoLink.textContent = item.icao;
    icaoLink.classList.add("simbrief-link"); // Aggiungi la classe CSS
    icaoCell.appendChild(icaoLink);
    
    const otherCells = document.createElement("td");
    otherCells.textContent = item.long;
    
    const otherCells2 = document.createElement("td");
    otherCells2.textContent = item.lat;
    
    const otherCells3 = document.createElement("td");
    otherCells3.textContent = item.name;
    
    row.appendChild(icaoCell);
    row.appendChild(otherCells);
    row.appendChild(otherCells2);
    row.appendChild(otherCells3);
    
    return row;
  }
  

  function updatePaginationButtons() {
    prevPageButton.disabled = currentPage === 0;
    nextPageButton.disabled = currentPage === Math.ceil(data.length / rowsPerPage) - 1;
  }

  prevPageButton.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      filterInput.value = ""; // Resetta la barra di ricerca
      updateTable(data);
    }
  });

  nextPageButton.addEventListener("click", () => {
    if (currentPage < Math.ceil(data.length / rowsPerPage) - 1) {
      currentPage++;
      filterInput.value = ""; // Resetta la barra di ricerca
      updateTable(data);
    }
  });

  filterInput.addEventListener("input", () => {
    const filterText = filterInput.value.trim().toLowerCase();
  
    const filteredData = data.filter(item => 
      (item.icao && item.icao.toLowerCase().includes(filterText)) || 
      (item.name && item.name.toLowerCase().includes(filterText))
    );
  
    currentPage = 0;
    updateTable(filteredData);
  });
  

  loadData(data => {
    data = data;
    updateTable(data);
  });

  rowsPerPageSelect.addEventListener("change", () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value);
    currentPage = 0;
    updateTable(data);
  });

});
