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
  "monero",
  "solo-coin",
  "klima-dao",
  "cosmos",
  "hedera-hashgraph",
  "mobilecoin",
  "coreum",
  "verasity",
  "xdce-crowd-sale",
  "digibyte",
  "injective-protocol",
  "gmx",
];

let historyInfo = [];

async function RunMainScript() {
  await GetDataSimple();
  displayCards();
}

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

function createCard(coinName, coinData) {
    function formatPercent(value) {
        var className = '';
        if (value < 0) {
            className = 'negative';
        } else if (value > 0.1) {
            className = 'positive';
        }
        return `<span class="${className}">${value}%</span>`;
    }

  return `
        <div class="col-md-4 mb-4">
            <div class="card">
                <div class="card-header">${coinName.toUpperCase()} $${coinData.current}</div>
                <div class="card-body">
                    <p>1h:  ${formatPercent(coinData.oneHour.toFixed(2))}</p>
                    <p>1d:  ${formatPercent(coinData.oneDay.toFixed(2))}</p>
                    <p>7d:  ${formatPercent(coinData.sevenDays.toFixed(2))}</p>
                </div>
            </div>
        </div>
    `;
}

function displayCards() {
  //console.log("displaCards", historyInfo);
  const cardsContainer = document.getElementById("cards-container");
  let cardsHTML = "";

  Object.keys(historyInfo).forEach((coinName) => {
    cardsHTML += createCard(coinName, historyInfo[coinName]);
  });

  cardsContainer.innerHTML = cardsHTML;
}

async function GetDataSimple() {
  var apiCoins = coins.join("%2C");

  var apiUrl =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
    apiCoins +
    "&price_change_percentage=1h%2C24h%2C7d";

  var jsonData = await fetchJson(apiUrl);

  historyInfo = [];

  jsonData.forEach((coin) => {
    //console.log(coin);
    //historyInfo[coin.id] = {
    historyInfo[coin.symbol] = {
      current: coin.current_price,
      oneHour: coin.price_change_percentage_1h_in_currency,
      oneDay: coin.price_change_percentage_24h_in_currency,
      sevenDays: coin.price_change_percentage_7d_in_currency,
    };
  });

  /* json fields
  "id"
  "price_change_percentage_1h_in_currency"
  "price_change_percentage_24h_in_currency"
  "price_change_percentage_7d_in_currency"
    */
  //console.log(jsonData);
  console.log(historyInfo);
}
