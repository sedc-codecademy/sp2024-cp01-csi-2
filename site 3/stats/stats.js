document.addEventListener('DOMContentLoaded', function () {
  // Dummy data
  const cryptoData = [
    { name: "Bitcoin", price: 35000, percent_change_7d: 2.3 },
    { name: "Ethereum", price: 2500, percent_change_7d: -1.2 },
    { name: "Cardano", price: 1.5, percent_change_7d: 5.6 },
    { name: "Ripple", price: 0.8, percent_change_7d: 3.2 },
    { name: "Litecoin", price: 150, percent_change_7d: -2.1 },
    // Add more data as needed
  ];

  function populateTable(tableId, data) {
    const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    data.forEach(item => {
      const row = tableBody.insertRow();
      row.insertCell(0).innerHTML = item.name;
      row.insertCell(1).innerHTML = item.price;
      row.insertCell(2).innerHTML = item.percent_change_7d;
    });

    goToFirstPage(tableId);
  }

  function filterData(searchTerm) {
    return cryptoData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Initialize tables
  populateTable('growthFutureTable', cryptoData);
  populateTable('bestGrowingTable', cryptoData.sort((a, b) => b.percent_change_7d - a.percent_change_7d));
  populateTable('bestFallingTable', cryptoData.sort((a, b) => a.percent_change_7d - b.percent_change_7d));

  // Add search functionality
  document.getElementById('cryptoSearch').addEventListener('input', function () {
    const searchTerm = this.value;
    const filteredData = filterData(searchTerm);

    populateTable('growthFutureTable', filteredData);
    populateTable('bestGrowingTable', filteredData.sort((a, b) => b.percent_change_7d - a.percent_change_7d));
    populateTable('bestFallingTable', filteredData.sort((a, b) => a.percent_change_7d - b.percent_change_7d));
  });
});
