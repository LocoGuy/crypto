$(document).ready(function () {
  $("#coinsTable").DataTable({
    //   //disable sorting on last column
    //   "columnDefs": [
    //     { "orderable": false, "targets": 5 }
    //   ],
    columnDefs: [
      { width: "30px", targets: 0 },
      { width: "75px", targets: 1 },
      { width: "75px", targets: 2 },
      { width: "70px", targets: 3 },
      { width: "70px", targets: 4 },
      { width: "70px", targets: 5 },
    ],
    order: [[5, "desc"]], // Sortiert die 6. Spalte absteigend
    pageLength: -1, // Setzt die initiale Seitenlänge auf "Alle"

    language: {
      //customize pagination prev and next buttons: use arrows instead of words
      paginate: {
        previous: '<span class="fa fa-chevron-left"></span>',
        next: '<span class="fa fa-chevron-right"></span>',
      },
      //customize number of elements to be displayed
      lengthMenu:
        'Display <select class="form-control input-sm">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="30">30</option>' +
        '<option value="40">40</option>' +
        '<option value="50">50</option>' +
        '<option value="-1">All</option>' +
        "</select> results",
    },
  });
});

let coins = [
'bitcoin',
'ethereum',
'chainlink',
'ripple',
'polygon-ecosystem-token',
'stellar',
'cosmos',
'hedera-hashgraph',
'avalanche-2',
'curve-dao-token',
'andy-the-wisguy',
'destra-network'
];

let historyInfo = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(apiUrl) {
  let response = await fetch(apiUrl);
  if (response.ok) {
    let json = await response.json();
    return json;
  } else {
    alert("HTTP-Error: " + response.status);
  }
  return "";
}

let checkBoxUseCHF;

let useCHF = localStorage.getItem("useCHF") === "true";

checkBoxUseCHF = document.getElementById("checkBoxUseCHF");

checkBoxUseCHF.addEventListener("change", async (event) => {
  useCHF = event.currentTarget.checked;
  localStorage.setItem("useCHF",useCHF);
  await RunMainScript();
  });

async function RunMainScript() {
  checkBoxUseCHF.checked = useCHF;
  await GetDataSimple();
  drawDataTable();
}

function formatPercent(value) {
  var className = "";
  if (value < 0) {
    className = "negative";
  } else if (value > 0.1) {
    className = "positive";
  }
  return `<span class="${className}">${value}</span>`;
}

function AddRow(coinsTable, coinName, coinData) {
  // Insert a row at the end of table
  var newRow = coinsTable.insertRow();
  var imageCell = newRow.insertCell(-1);

  var img = document.createElement("img");
  img.src = coinData.image;
  img.classList.add("image-coin");
  imageCell.appendChild(img);

  var coinNameCell = newRow.insertCell();
  coinNameCell.innerHTML = coinName.toUpperCase();

  var currentPrice = newRow.insertCell();
  currentPrice.innerHTML = coinData.current;

  var oneHour = newRow.insertCell();
  oneHour.innerHTML = formatPercent(coinData.oneHour.toFixed(2));

  var oneDay = newRow.insertCell();
  oneDay.innerHTML = formatPercent(coinData.oneDay.toFixed(2));

  var sevenDays = newRow.insertCell();
  sevenDays.innerHTML = formatPercent(coinData.sevenDays.toFixed(2));
}

function drawTable() {
  var coinsTable = document
    .getElementById("coinsTable")
    .getElementsByTagName("tbody")[0];
  Object.keys(historyInfo).forEach((coinName) => {
    AddRow(coinsTable, coinName, historyInfo[coinName]);
  });
}

function drawDataTable() {
  var table = $("#coinsTable").DataTable();
  table.clear();
  
  var currency = "$";
  if (useCHF) currency = "Fr.";

  Object.keys(historyInfo).forEach((coinName) => {
    var coinData = historyInfo[coinName];
    var oneHour = coinData.oneHour.toFixed(2);
    var oneDay = coinData.oneDay.toFixed(2);
    var sevenDays = coinData.sevenDays ? coinData.sevenDays.toFixed(2) : 0;
    
    var rowNode = table.row
      .add([
        '<img src="' + coinData.image + '" class="image-coin">', // Bild
        coinName.toUpperCase(), // Coin-Name
        currency + " " + coinData.current, // Aktueller Preis
        formatPercent(oneHour), // 1h Änderung
        formatPercent(oneDay), // 1d Änderung
        formatPercent(sevenDays), // 7d Änderung
      ])
      .draw()
      .node();
  });
}

async function GetDataSimple() {
  var apiCoins = coins.join("%2C");

  var vsCurrency = "usd";
  if (useCHF) vsCurrency = "chf";

  var apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&ids=${apiCoins}&price_change_percentage=1h%2C24h%2C7d`;
  var jsonData = await fetchJson(apiUrl);

  historyInfo = [];

  jsonData.forEach((coin) => {
    historyInfo[coin.symbol] = {
      image: coin.image,
      current: coin.current_price,
      oneHour: coin.price_change_percentage_1h_in_currency,
      oneDay: coin.price_change_percentage_24h_in_currency,
      sevenDays: coin.price_change_percentage_7d_in_currency,
    };
  });
}
