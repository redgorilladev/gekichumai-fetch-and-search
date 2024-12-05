let isFavouritesActive = false;

document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("song-search");
  const results = document.getElementById("chuni-results");
  const loading = document.getElementById("loading-container");
  const recent = document.getElementById("chuni-recent");
  const randomDiv = document.getElementById("random");
  const favourites = document.getElementById("chuni-favourites");
  const fragment2 = document.createDocumentFragment();
  const favNavBtn = document.getElementById("fav-nav-btn");
  const recentNavBtn = document.getElementById("recent-nav-btn");
  const searchNavBtn = document.getElementById("search-nav-btn");
  const removeFavsBtn = document.getElementById("remove-favourites");
  const randomBtn = document.getElementById("random-btn");
  const errorDiv = document.getElementById("error");
  const removeFavsContainer = document.getElementById(
    "remove-favourites-container"
  );
  let songs = [];
  console.log(JSON.parse(localStorage.getItem("chuniID")));
  try {
    loading.style.display = "flex";
    searchInput.disabled = true;
    const response = await fetch("/chunisearch");
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    songs = await response.json();
    loading.style.display = "none";
    searchInput.disabled = false;
    console.log(songs);
    console.log(filterRecentSongs(songs));

    // the landing view / default on refresh
    showRecent(songs, fragment2, recent);
  } catch (error) {
    console.error("Error fetching songs:", error);
    errorDiv.innerHTML = `${error} <br>Click <a href="/">Here</a> To Refresh`;
    loading.innerHTML = "";
    [favNavBtn, recentNavBtn, searchNavBtn, randomBtn].forEach(
      (button) => (button.disabled = true)
    );
  }

  function setActiveButton(button) {
    [favNavBtn, recentNavBtn, searchNavBtn, randomBtn].forEach((button) =>
      button.classList.remove("chuni-tab-active")
    );

    button.classList.add("chuni-tab-active");

    results.innerHTML = "";
    recent.innerHTML = "";
    favourites.innerHTML = "";
    randomDiv.innerHTML = "";
  }
  searchInput.addEventListener(
    "input",
    debounce(() => {
      setActiveButton(searchNavBtn);
      const fragment = document.createDocumentFragment();

      console.log(searchInput.value);

      if (searchInput.value == "") {
        showRecent(songs, fragment2, recent);
        removeFavsContainer.style.display = "none";
      } else {
        const filteredSongs = filterSongs(songs, `${searchInput.value}`);
        renderSongs(filteredSongs, fragment, results);
        removeFavsContainer.style.display = "none";
      }
    }, 300)
  );

  favNavBtn.addEventListener("click", () => {
    setActiveButton(favNavBtn);
    isFavouritesActive = true;
    showFavourites(songs, fragment2, favourites, removeFavsContainer);
  });

  recentNavBtn.addEventListener("click", () => {
    setActiveButton(recentNavBtn);
    isFavouritesActive = false;
    showRecent(songs, fragment2, recent);
    removeFavsContainer.style.display = "none";
  });

  searchNavBtn.addEventListener("click", () => {
    const fragment = document.createDocumentFragment();
    setActiveButton(searchNavBtn);
    isFavouritesActive = false;
    const filteredSongs = filterSongs(songs, `${searchInput.value}`);
    renderSongs(filteredSongs, fragment, results);
    removeFavsContainer.style.display = "none";
  });

  document.addEventListener("renderFavourites", () => {
    favourites.innerHTML = "";
    showFavourites(songs, fragment2, favourites, removeFavsContainer);
  });

  removeFavsBtn.addEventListener("click", () => {
    localStorage.setItem("chuniID", JSON.stringify([]));
    const event = new Event("renderFavourites");
    document.dispatchEvent(event);
  });

  randomBtn.addEventListener("click", () => {
    setActiveButton(randomBtn);
    generateRandomCourse(songs, fragment2, randomDiv);
    removeFavsContainer.style.display = "none";
  });
});

function filterSongs(array, query) {
  return array.filter(
    (element) =>
      element.title.toLowerCase().includes(query.toLowerCase()) ||
      element.artist.toLowerCase().includes(query.toLowerCase())
  );
}

function filterRecentSongs(array) {
  console.log(
    "new songs:",
    array.filter((element) => element.new === "1")
  );
  return array.filter((element) => element.new === "1");
}

function renderSongs(array, fragment, container) {
  const favourites = JSON.parse(localStorage.getItem("chuniID") || "[]");
  const length = array.length;
  console.log("results:", length);
  console.log(container.id);
  const numberOfResults = document.createElement("h2");
  if (container.id === "chuni-results") {
    numberOfResults.innerHTML = `${length} Result(s)`;
  }
  if (container.id === "chuni-favourites") {
    numberOfResults.innerHTML = `${length} Favourite(s)`;
  }
  if (container.id === "random") {
    numberOfResults.innerHTML = `Random Course`;
  }
  if (container.id === "chuni-recent") {
    // const updateDate = array[array.length - 1].date;
    numberOfResults.innerHTML = `Latest Update`;
  }
  array.forEach((element) => {
    let searchTitle = encodeURIComponent(element.title);
    let popsanime = "";
    if (element.category === "POPS & ANIME") {
      popsanime = "chuni-pops";
    }
    let ultima = "hidden";
    if (element.lev_ult != "" || null) {
      ultima = "visible";
    }
    let newflag = "hidden";
    if (element.new === "1") {
      newflag = "visible";
    }
    const conatiner = document.createElement("div");
    conatiner.classList = "chuni-song-container";
    const isFavourite = favourites.includes(element.id);
    const favIconSrc = isFavourite ? "/star.svg" : "/star-outline.svg";
    if (parseInt(element.id) >= 8000) {
      conatiner.innerHTML = `
      <div class="newflag ${newflag}">NEW</div>
      <button class="chuni-fav-btn" data-chartid="${element.id}" onclick="addFavourite(this.dataset.chartid)">
      <img class="fav-icon" src="${favIconSrc}" alt="" />
    </button>
    <div class="song-category chuni-category worlds-end  ${popsanime}">WORLD'S END</div>
      <div class="song-data-container">
      <img src="https://new.chunithm-net.com/chuni-mobile/html/mobile/img/${element.image_url}" alt="" class="chuni-song-jacket" loading="lazy" />
        <div class="chuni-song-info">
          <div class="song-title">${element.title}</div>
          <div class="song-artist">
            ARTIST: ${element.artist}
          </div>
        </div>
      </div>
        <div class="chuni-song-level">
          <div class="we-star star${element.we_star}"></div>
          <div class="we-kanji">${element.we_kanji}</div>
        </div>

    `;
      fragment.appendChild(conatiner);
    } else {
      conatiner.innerHTML = `
      <div class="newflag ${newflag}">NEW</div>
      <button class="chuni-fav-btn" data-chartid="${element.id}" onclick="addFavourite(this.dataset.chartid)">
      <img class="fav-icon" src="${favIconSrc}" alt="" />
    </button>
    <div class="song-category chuni-category chuni-${element.category} ${popsanime}">${element.category}</div>
      <div class="song-data-container">
      <img src="https://new.chunithm-net.com/chuni-mobile/html/mobile/img/${element.image_url}" alt="" class="chuni-song-jacket" loading="lazy" />
        <div class="chuni-song-info">
          <div class="song-title">${element.title}</div>
          <div class="song-artist">
            ARTIST: ${element.artist}
          </div>
        </div>
      </div>
        <div class="chuni-song-level">
          <a class="basic chart-link" href='https://www.youtube.com/results?search_query="${searchTitle}"+basic+Chunithm' target="_blank">${element.lev_bas}</a>
          <a class="advanced chart-link" href='https://www.youtube.com/results?search_query="${searchTitle}"+advanced+Chunithm' target="_blank">${element.lev_adv}</a>
          <a class="expert chart-link" href='https://www.youtube.com/results?search_query="${searchTitle}"+expert+Chunithm' target="_blank">${element.lev_exp}</a>
          <a class="master chart-link" href='https://www.youtube.com/results?search_query="${searchTitle}"+master+Chunithm' target="_blank">${element.lev_mas}</a>
          <a class="ultima chart-link ${ultima}" href='https://www.youtube.com/results?search_query="${searchTitle}"+ultima+Chunithm' target="_blank">${element.lev_ult}</a>
        </div>
    `;
      fragment.appendChild(conatiner);
    }
  });

  container.appendChild(numberOfResults);
  container.appendChild(fragment);
}

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function showRecent(array, fragment, container) {
  const recentSongs = filterRecentSongs(array);
  renderSongs(recentSongs, fragment, container);
}

function showFavourites(array, fragment, container, removeBtn) {
  let favourites = JSON.parse(localStorage.getItem("chuniID") || "[]");
  let favouriteSongs = array.filter((element) =>
    favourites.includes(element.id)
  );
  renderSongs(favouriteSongs, fragment, container);
  console.log(
    (removeBtn.style.display = favouriteSongs.length > 0 ? "flex" : "none")
  );
  console.log(removeBtn);
  removeBtn.style.display = favouriteSongs.length > 0 ? "flex" : "none";
  removeBtn.offsetWidth;
}

function addFavourite(chartid) {
  let favourites = [];
  let currentFavourites = JSON.parse(localStorage.getItem("chuniID") || "[]");
  const itemIndex = currentFavourites.indexOf(chartid);
  const messageElement =
    document.getElementById("favouriteMessage") || createMessageElement();

  console.log("current favourites:", currentFavourites);
  console.log("item index:", itemIndex);

  if (itemIndex > -1) {
    currentFavourites.splice(itemIndex, 1);
    localStorage.setItem("chuniID", JSON.stringify(currentFavourites));
    if (isFavouritesActive) {
      const event = new Event("renderFavourites");
      document.dispatchEvent(event);
    }
    showMessage("Removed from favorites", messageElement);
  } else {
    favourites = [...currentFavourites, chartid];
    currentFavourites = favourites;
    showMessage("Added to favorites", messageElement);
  }

  localStorage.setItem("chuniID", JSON.stringify(currentFavourites));
  console.log(
    document.querySelector(`.chuni-fav-btn[data-chartid="${chartid}"]`)
  );
  const favButton = document.querySelector(
    `.chuni-fav-btn[data-chartid="${chartid}"]`
  );

  if (favButton) {
    const favIcon = favButton.querySelector(".fav-icon");
    if (favIcon) {
      const isFavourite = currentFavourites.includes(chartid);
      favIcon.src = isFavourite ? "/star.svg" : "/star-outline.svg";
    } else {
      console.error("Favourite icon not found for chartid:", chartid);
    }
  } else {
    console.error("Favourite button not found for chartid:", chartid);
  }
}

// Function to create the message element if it doesn't exist
function createMessageElement() {
  const messageElement = document.createElement("div");
  messageElement.id = "favouriteMessage";
  messageElement.style.position = "fixed";
  messageElement.style.bottom = "20px";
  messageElement.style.left = "50%";
  messageElement.style.transform = "translateX(-50%)";
  messageElement.style.padding = "10px";
  messageElement.style.backgroundColor = "#333";
  messageElement.style.color = "#fff";
  messageElement.style.borderRadius = "5px";
  messageElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
  messageElement.style.zIndex = "1000";
  messageElement.style.opacity = "0";
  messageElement.style.transition = "opacity 0.3s";
  document.body.appendChild(messageElement);
  return messageElement;
}

function showMessage(text, messageElement) {
  messageElement.textContent = text;
  messageElement.style.opacity = "1";

  setTimeout(() => {
    messageElement.style.opacity = "0";
  }, 1000);
}

function generateRandomCourse(array, fragment, container) {
  let course = [];

  // remove world's end charts from random course
  const filteredArray = array.filter((element) => element.id < 8000);

  for (let i = 0; i < 3; i++) {
    let random = Math.floor(Math.random() * filteredArray.length);
    course = [...course, filteredArray[random]];
  }
  console.log(course);
  renderSongs(course, fragment, container);
}
