// First API - Coins
const coinsUrl =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false";
// Second API - Coins info
const coinsInfoUrl = "https://api.coingecko.com/api/v3/coins/";
let displayCoins = [];
let coinsModalArray = [];
// Get the coins from the url
const fetchCoins = async () => {
  return new Promise((resolve, reject) => {
    $.get({
      url: coinsUrl,
      success: (data) => {
        resolve(data);
      },
      error: (error) => {
        notFound();
        reject(error);
      },
    });
  });
};
// Get 100 coins from the url
const renderCoins = async () => {
  const data = await fetchCoins();
  for (let i = 0; i < 100; i++) {
    displayCoins.push(data[i]);
    renderSingleCoin(displayCoins[i], i);
  }
  return displayCoins;
};

//Function that renders a coin  and append it to the coins container:
const renderSingleCoin = (singleCoin, index) => {
  let infoId = `coin-${index}-info`;
  let toggleId = `coin-${index}-toggle`;
  let data = "";
  data += `<div class="card bg-black text-warning m-2 h-100 border-warning" style="width:300px" id="${index}">
  <div class="card-body">
    <div class="d-flex justify-content-between flex-wrap">
      <h4 class="card-title">${singleCoin.name}</h4>
      <div class=" form-check form-switch form-switch-lg">
        <input class="form-check-input my-toggle check-${singleCoin.name}" id="${toggleId}" type="checkbox" name="${singleCoin.name}">
      </div>
    </div>
    <div class="card-text mb-5">${singleCoin.symbol}</div>
      <button id="${singleCoin.id}" class="btn btn-primary mt-auto more-info ">More Info</button>
    <div class="mt-2" id="more-info-${infoId}"</div>
  </div>
</div>`;
  $("#container").append(data);
};
// Function that gets a specific foin data from the API and save in cache for 2 minutes
const fetchCoinsData = async (coinId) => {
  const cacheKey = `coin_${coinId}`;
  const cache = await caches.open("coinsCache");
  const cachedResponse = await cache.match(cacheKey);
  //If there there there is a coin info in the cache, change the response into json  if (cachedResponse) {
  if (cachedResponse) {
    const cachedData = await cachedResponse.json();
    return Promise.resolve(cachedData);
  }
  // Else get the coin info from API and save to cache
  return new Promise((resolve, reject) => {
    $.get({
      url: coinsInfoUrl + coinId,
      success: (data) => {
        const response = new Response(JSON.stringify(data), {
          headers: { "Cache-Control": "max-age=120" },
        });
        cache.put(cacheKey, response);
        resolve(data);
        setTimeout(() => {
          // Delete from cache after 2 minutes
          cache.delete(cacheKey);
        }, 120000);
      },
      error: (error) => {
        reject("Error while fetching details about the coin", error);
      },
    });
  });
};
// Function that gets id and index of clicked coin
const getCoinDetailsFromClick = (event) => {
  let coinIndex = $(event.target).closest(".card")[0].id;
  let coinId = displayCoins[coinIndex].id.toLowerCase();
  if (!$(`#more-info-coin-${coinIndex}-info`).hasClass("show")) {
    coinData(coinId, coinIndex);
  } else {
    $(`#more-info-coin-${coinIndex}-info`).removeClass("show");
  }
};

// Function that gets a specific coin info from the API and append to collapse
const coinData = async (coinId, coinIndex) => {
  let coinData = await fetchCoinsData(coinId);
  let targetId = `coin-${coinIndex}-info`;
  $(`#more-info-${targetId}`)
    .html(
      `
  <img class="collapseInfo" src="${coinData.image.small}">
  <p>${coinData.market_data.current_price.usd}$</p>
  <p>${coinData.market_data.current_price.eur}€</p>
  <p>${coinData.market_data.current_price.ils}₪</p>
`
    )
    .collapse("toggle");
};

//Function that handles press on search button:
const handleSearchBar = async (myCoins) => {
  let searchValue = "";
  searchValue += $("#search-result").val().toLowerCase();
  let count = 1;
  if (!searchValue) return;
  $("#container").html("");
  coinsModalArray = [];
  myCoins.map((item, index) => {
    let itemNameInLowercase = item.name.toLowerCase();
    if (itemNameInLowercase.startsWith(searchValue)) {
      count++;
      renderSingleCoin(item, index);
    }
  });
  if (count === 1) {
    notFound();
  }
};
//Function that display page404 if search value doesn't exist, or can't fetch the API
const notFound = () => {
  $("#container").html(`<div class="w-100" >
      <div class="d-flex align-items-center justify-content-center bg-black">
    <div class="text-center">
        <h1 class=" fw-bold text-danger ">404</h1>
        <p class="fs-3 text-white""> <span class="text-danger">Opps!</span> Page not found.</p>
        <p class="lead text-white">
            The page you’re looking for doesn’t exist.
          </p>
    </div></div>
</div>`);
};
//Function that handles press on toggle button:
const handleToggleChange = (toggleEl) => {
  let checkBoxId = toggleEl.id;
  let checkBoxIndex = checkBoxId.split("-")[1];
  let coinName = displayCoins[checkBoxIndex].name;
  if ($(toggleEl).is(":checked")) {
    if (coinsModalArray.length === 5) {
      $(toggleEl).prop("checked", false);
      openModal(toggleEl);
      return;
    }
    coinsModalArray.push(coinName);
  } else {
    let pos = coinsModalArray.indexOf(coinName);
    coinsModalArray.splice(pos, 1);
  }
};
//Function that receives the toggle element of the sixth coin that was pressed and opens that modal:
const openModal = (coin) => {
  renderModal();
  $(".modal").modal("show");
  $(".my-btn-modal").on("change", function () {
    switchCoins(this, coin);
  });
};
//Function that switch the sixth coin with one of the coins in the modal list,closes the modal and change the toggle buttons accordingly:
const switchCoins = (toggleModalEl, sixthCoinEl) => {
  $(toggleModalEl).prop("checked", false);
  closeModal();
  let index = toggleModalEl.id.slice(4);
  let nameOfCoin = coinsModalArray[index];
  let coinIndex = getCoinByName(nameOfCoin);
  let toggleBtnElIndex = $(".card").find(`#coin-${coinIndex}-toggle`)[0];
  let sixthCoinName = sixthCoinEl.name;
  coinsModalArray.splice(index, 1, sixthCoinName);
  $(sixthCoinEl).prop("checked", true);
  $(toggleBtnElIndex).prop("checked", false);
};
//Function that receives coin name and returns it's index from the displayCoins array
const getCoinByName = (name) => {
  for (let i = 0; i < displayCoins.length; i++) {
    const element = displayCoins[i];
    if (element.name === name) {
      return i;
    }
  }
};
//Function that renders the selected coins into the modal body:
const renderModal = () => {
  $(".modal-body").html("");
  let modalData = "";
  coinsModalArray.map((item, index) => {
    modalData += ` <p class=" d-flex justify-content-start">
    <span class="form-check d-inline form-switch">
    <input class="form-check-input my-btn-modal" id="coin${index}" checked type="checkbox" role="switch" data-toggle="switchbutton"  data-height="75" id="flexSwitchCheckDefault" />
    </span>
    <span class="d-inline" >${item}</span>
   </p>
  <hr>`;
  });
  $(".modal-body").html(modalData);
};
//Function that closes the modal
const closeModal = () => {
  $(".modal").modal("hide");
};

// About me card function
const aboutMe = () => {
  $("#container")
    .append(` <div class="card bg-black text-warning border-warning" style="width: 50rem">
        <h4 class="card-title text-center">Hila Dolev</h4>
        <img class="card-img-top" src="../images/me.jpg" alt="Card image" >
      <div class="card-body text-center">
      <h4 class="card-title font-weight-bold">HAPPINESS IS..</h4>
      <p>When your code runs without error.</p>
      <a href="https://github.com/Hiladolev" class="btn btn-primary">My Github</a>
    </div>
  </div>`);
};
