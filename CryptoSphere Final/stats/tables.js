document.addEventListener("DOMContentLoaded", function () {
  var toggler = document.querySelector(".navbar-toggler");
  var navbarCollapse = document.querySelector("#navbarNav");

  toggler.addEventListener("click", function () {
    navbarCollapse.classList.toggle("show");
  });
});

const cryptoApi = "https://api.coinlore.net/api/tickers/";

let originalData = [];
let filteredData = [];

let currentPage = {
  growthFutureTable: 1,
  bestGrowingTable: 1,
  bestFallingTable: 1,
};
const itemsPerPage = 10;

function FetchCryptoData() {
  fetch(cryptoApi)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Request successful", data);

      const growthFutureTable = "growthFutureTable";
      const bestGrowingTable = "bestGrowingTable";
      const bestFallingTable = "bestFallingTable";

      const sortedGrowthFutureData = data.data
        .slice()
        .sort((a, b) => b.price_usd - a.price_usd);
      const growthFutureElement = document.getElementById(growthFutureTable);
      growthFutureElement.setAttribute(
        "data-total-items",
        sortedGrowthFutureData.length
      );
      growthFutureElement.setAttribute(
        "data-array",
        JSON.stringify(sortedGrowthFutureData)
      );
      PopulateTable(
        sortedGrowthFutureData,
        growthFutureTable,
        currentPage[growthFutureTable]
      );

      const sortedBestGrowingData = data.data
        .slice()
        .sort((a, b) => b.percent_change_7d - a.percent_change_7d);
      const bestGrowingElement = document.getElementById(bestGrowingTable);
      bestGrowingElement.setAttribute(
        "data-total-items",
        sortedBestGrowingData.length
      );
      bestGrowingElement.setAttribute(
        "data-array",
        JSON.stringify(sortedBestGrowingData)
      );
      PopulateTable(
        sortedBestGrowingData,
        bestGrowingTable,
        currentPage[bestGrowingTable]
      );

      const sortedBestFallingData = data.data
        .slice()
        .sort((a, b) => a.percent_change_7d - b.percent_change_7d);
      const bestFallingElement = document.getElementById(bestFallingTable);
      bestFallingElement.setAttribute(
        "data-total-items",
        sortedBestFallingData.length
      );
      bestFallingElement.setAttribute(
        "data-array",
        JSON.stringify(sortedBestFallingData)
      );
      PopulateTable(
        sortedBestFallingData,
        bestFallingTable,
        currentPage[bestFallingTable]
      );

      originalData = data.data;

      filteredData = [...originalData];

      PopulateTables(filteredData);
    })
    .catch((error) => {
      console.error("Error fetching crypto data:", error);
    });
}

function PopulateTable(array, tableId, page = 1) {
  const table = document.getElementById(tableId);
  table.innerHTML = "";

  // Create table headers
  const headers = ["Name", "Price In USD $", "Last 7 Days"];
  const trHeader = document.createElement("tr");
  headers.forEach((headerText, index) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    th.setAttribute("scope", "col");
    th.classList.add("table-headings");

    // Add event listeners to headers for sorting
    th.addEventListener("click", () => {
      SortTable(tableId, index);
    });

    trHeader.appendChild(th);
  });

  table.appendChild(trHeader);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;
  const paginatedItems = array.slice(startIndex, endIndex);
  const tbody = document.createElement("tbody");

  paginatedItems.forEach((element) => {
    const tr = document.createElement("tr");
    const rowData = [
      element.name,
      `$ ${parseFloat(element.price_usd).toFixed(2)}`,
      `${parseFloat(element.percent_change_7d).toFixed(2)} %`,
    ];

    rowData.forEach((cellData, index) => {
      const td = document.createElement("td");
      td.textContent = cellData;
      if (index === 0) {
        const th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.textContent = cellData;
        tr.appendChild(th);
        th.classList.add("tHeaderCrypto");
      } else {
        td.textContent = cellData;
        tr.appendChild(td);
      }
      //>>>> Apply css Negative --- Positive
      if (parseFloat(element.percent_change_7d) < 0) {
        td.classList.add("negative");
        td.textContent += " ▼";
      } else {
        td.classList.add("positive");
        td.textContent += " ▲";
      }
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  UpdateNavigationButtons(tableId, array.length);
}

function UpdateNavigationButtons(tableId, totalItems) {
  const prevButton = document.getElementById(`${tableId}-prev`);
  const nextButton = document.getElementById(`${tableId}-next`);
  const firstPageButton = document.getElementById(`${tableId}-first`);

  prevButton.disabled = currentPage[tableId] === 1;
  nextButton.disabled = currentPage[tableId] * itemsPerPage >= totalItems;
  firstPageButton.disabled = currentPage[tableId] === 1;
}

function GoToPage(tableId, direction) {
  const table = document.getElementById(tableId);
  const totalItems = table.getAttribute("data-total-items");
  const array = JSON.parse(table.getAttribute("data-array"));

  currentPage[tableId] += direction;
  if (currentPage[tableId] < 1) {
    currentPage[tableId] = 1;
  } else if ((currentPage[tableId] - 1) * itemsPerPage >= totalItems) {
    currentPage[tableId] = Math.ceil(totalItems / itemsPerPage);
  }

  PopulateTable(array, tableId, currentPage[tableId]);
}

function GoToFirstPage(tableId) {
  currentPage[tableId] = 1;
  const table = document.getElementById(tableId);
  const array = JSON.parse(table.getAttribute("data-array"));
  PopulateTable(array, tableId, currentPage[tableId]);
}

FetchCryptoData();

const sortDirection = {};

function SortTable(tableId, columnIndex) {
  const table = document.getElementById(tableId);

  const rows = Array.from(table.rows).slice(1);

  if (sortDirection[columnIndex] === "asc") {
    sortDirection[columnIndex] = "desc";
  } else {
    sortDirection[columnIndex] = "asc";
  }

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim();
    const cellB = rowB.cells[columnIndex].textContent.trim();

    if (columnIndex === 1 || columnIndex === 2) {
      const valueA = parseFloat(cellA.replace(/[^\d.-]/g, ""));
      const valueB = parseFloat(cellB.replace(/[^\d.-]/g, ""));

      if (isNaN(valueA) || isNaN(valueB)) {
        return 0;
      }

      return sortDirection[columnIndex] === "asc"
        ? valueA - valueB
        : valueB - valueA;
    } else {
      return sortDirection[columnIndex] === "asc"
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }
  });

  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";
  rows.forEach((row) => tbody.appendChild(row));

  //>>>>>>  Clear existing indicators
  const headers = table.querySelectorAll("th");
  headers.forEach((th) => th.classList.remove("asc", "desc"));

  //>>>>>>   Add indicator to sorted column header
  const currentHeader = headers[columnIndex];
  currentHeader.classList.add(sortDirection[columnIndex]);
}

function PopulateTables(data) {
  PopulateTable(SortAndLimit(data, "price_usd", "desc"), "growthFutureTable");
  PopulateTable(
    SortAndLimit(data, "percent_change_7d", "desc"),
    "bestGrowingTable"
  );
  PopulateTable(
    SortAndLimit(data, "percent_change_7d", "asc"),
    "bestFallingTable"
  );
}

function SortAndLimit(data, sortBy, sortOrder) {
  const sortedData = data.slice().sort((a, b) => {
    if (sortBy === "price_usd") {
      return sortOrder === "asc"
        ? a[sortBy] - b[sortBy]
        : b[sortBy] - a[sortBy];
    } else if (sortBy === "percent_change_7d") {
      return sortOrder === "asc"
        ? a[sortBy] - b[sortBy]
        : b[sortBy] - a[sortBy];
    }
  });

  return sortedData;
}

const searchInput = document.getElementById("cryptoSearch");
searchInput.addEventListener("input", function () {
  const searchText = this.value.trim().toLowerCase();

  filteredData = originalData.filter((item) => {
    return item.name.toLowerCase().includes(searchText);
  });

  PopulateTables(filteredData);

  StopRefreshInterval();
  StartRefreshInterval();
});

let refreshIntervalId;
function StartRefreshInterval() {
  refreshIntervalId = setInterval(() => {
    if (filteredData.length === 0) {
      FetchCryptoData();
    } else {
      PopulateTables(filteredData);
    }
  }, 30000);
}
StartRefreshInterval();

function StopRefreshInterval() {
  clearInterval(refreshIntervalId);
}
