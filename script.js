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
  "ripple",
  "ethereum",
  "bitcoin",
  "energy-web-token",
  "polkadot",
  "chainlink",
  "matic-network",
  "stellar",
  "algorand",
  "solo-coin",
  "cosmos",
  "hedera-hashgraph",
  "mobilecoin",
  "coreum",
  "verasity",
  "xdce-crowd-sale",
  "digibyte",
  "injective-protocol",
  "gmx",
  "avalanche-2",
  "gamer-arena",
  "solidus-aitech",
  "gt-protocol",
  "wam",
  "pepe"
];

let historyInfo = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(apiUrl) {
  //console.log(apiUrl);
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

let useCHF = localStorage.getItem("useCHF");

checkBoxUseCHF = document.getElementById("checkBoxUseCHF");
  checkBoxUseCHF.addEventListener("change", (event) => {
    useCHF = event.currentTarget.checked;
    localStorage.setItem("useCHF",useCHF);
    RunMainScript();
    });



async function RunMainScript() {
  checkBoxUseCHF.checked = useCHF;
  //useCHF = localStorage.getItem("useCHF");
  console.log("RunMainScript - called");
  
  await GetDataSimple();
  //drawTable();
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

  /*
    current: coin.current_price,
        oneHour: coin.price_change_percentage_1h_in_currency,
        oneDay: coin.price_change_percentage_24h_in_currency,
        sevenDays: coin.price_change_percentage_7d_in_currency,
        */
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
  // Beispiel für das Hinzufügen einer Zeile mit der DataTables API
  var table = $("#coinsTable").DataTable(); // Stelle sicher, dass dies nach der Initialisierung von DataTables aufgerufen wird
  table.clear();
  
  var currency = "$";
  if (useCHF) currency = "Fr.";

  Object.keys(historyInfo).forEach((coinName) => {
    var coinData = historyInfo[coinName];
    // Angenommen, coinData ist das Objekt mit den Daten, die du hinzufügen möchtest
    var rowNode = table.row
      .add([
        '<img src="' + coinData.image + '" class="image-coin">', // Bild
        coinName.toUpperCase(), // Coin-Name
        currency + " " + coinData.current, // Aktueller Preis
        formatPercent(coinData.oneHour.toFixed(2)), // 1h Änderung
        formatPercent(coinData.oneDay.toFixed(2)), // 1d Änderung
        formatPercent(coinData.sevenDays.toFixed(2)), // 7d Änderung
      ])
      .draw()
      .node();
  });
}

async function GetDataSimple() {
  var apiCoins = coins.join("%2C");

  var vsCurrency = "usd";
  if (useCHF) vsCurrency = "chf";

  //console.log(useCHF);

  var apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&ids=${apiCoins}&price_change_percentage=1h%2C24h%2C7d`;

  //console.log("apiUrl", apiUrl);

  var jsonData = await fetchJson(apiUrl);

  historyInfo = [];

  jsonData.forEach((coin) => {
    //console.log(coin);
    //historyInfo[coin.id] = {
    historyInfo[coin.symbol] = {
      image: coin.image,
      current: coin.current_price,
      oneHour: coin.price_change_percentage_1h_in_currency,
      oneDay: coin.price_change_percentage_24h_in_currency,
      sevenDays: coin.price_change_percentage_7d_in_currency,
    };
  });

  //const historyArray = Object.entries(historyInfo);
  //historyArray.sort((a, b) => b[1].oneHour - a[1].oneHour);
  //historyInfo = Object.fromEntries(historyArray);

  //console.log(historyInfo);
}
