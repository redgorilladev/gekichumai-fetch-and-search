document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("song-search");
  const results = document.getElementById("results");
  const loading = document.getElementById("loading");
  const recent = document.getElementById("recent");
  const recentText = document.getElementById("recent-text");
  const fragment2 = document.createDocumentFragment();
  let songs = [];
  try {
    loading.style.display = "block";
    searchInput.disabled = true;
    const response = await fetch("/search");
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status}`);
    }
    songs = await response.json();
    loading.style.display = "none";
    searchInput.disabled = false;
    console.log(songs);
    console.log(filterRecentSongs(songs));
    showRecent(recentText, songs, fragment2, recent);
  } catch (error) {
    console.error("Error fetching songs:", error);
  }

  searchInput.addEventListener(
    "input",
    debounce(() => {
      results.innerHTML = "";
      recent.innerHTML = "";
      recentText.style.display = "none";
      const fragment = document.createDocumentFragment();

      console.log(searchInput.value);

      if (searchInput.value == "") {
        showRecent(recentText, songs, fragment2, recent);
      } else {
        const filteredSongs = filterSongs(songs, `${searchInput.value}`);
        renderSongs(filteredSongs, fragment, results);
      }
    }, 300)
  );
});

function filterSongs(array, query) {
  return array.filter(
    (element) =>
      element.title.toLowerCase().includes(query.toLowerCase()) ||
      element.artist.toLowerCase().includes(query.toLowerCase())
  );
}

function filterRecentSongs(array) {
  return array.slice(array.length - 3, array.length + 1);
}

function renderSongs(array, fragment, container) {
  array.forEach((element) => {
    const conatiner = document.createElement("div");
    conatiner.classList = "song-container";
    conatiner.innerHTML = `
      <img src="https://ongeki-net.com/ongeki-mobile/img/music/${element.image_url}" alt="" class="song-jacket" loading="lazy" />
      <div class="song-info">
        <div class="song-category">${element.category}</div>
        <div class="song-title">${element.title}</div>
        <div class="song-artist">
          ARTIST: ${element.artist}
        </div>
      </div>
      <div class="song-level">
        <div class="basic">${element.lev_bas}</div>
        <div class="advanced">${element.lev_adv}</div>
        <div class="expert">${element.lev_exc}</div>
        <div class="master">${element.lev_mas}</div>
      </div>
    `;
    fragment.appendChild(conatiner);
  });

  container.appendChild(fragment);
}

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

function showRecent(text, array, fragment, container) {
  text.style.display = "block";
  const recentSongs = filterRecentSongs(array);
  renderSongs(recentSongs, fragment, container);
}
