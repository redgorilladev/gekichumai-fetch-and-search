const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static(__dirname + "/public"));
const port = 3000;

app.get("/", (req, res) => {
  res.render("index", { searchScript: "/javascripts/search.js" });
});

app.get("/chunithm", (req, res) => {
  res.render("chuni", { searchScript: "/javascripts/chuniSearch.js" });
});

app.get("/maimai", (req, res) => {
  res.render("mai", { searchScript: "/javascripts/maiSearch.js" });
});

app.get("/search", async (req, res) => {
  const songs = [];
  const url = "https://ongeki.sega.jp/assets/json/music/music.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    json.forEach((song) => {
      songs.push({
        id: song.id,
        date: song.date,
        category: song.category,
        title: song.title,
        artist: song.artist,
        lev_bas: song.lev_bas,
        lev_adv: song.lev_adv,
        lev_exc: song.lev_exc,
        lev_mas: song.lev_mas,
        lev_lnt: song.lev_lnt,
        image_url: song.image_url,
        bonus: song.bonus,
      });
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to fetch songs." });
  }
  res.json(songs);
});

app.get("/chunisearch", async (req, res) => {
  const songs = [];
  const url = "https://chunithm.sega.jp/storage/json/music.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    json.forEach((song) => {
      songs.push({
        id: song.id,
        category: song.catname,
        new: song.newflag,
        title: song.title,
        artist: song.artist,
        lev_bas: song.lev_bas,
        lev_adv: song.lev_adv,
        lev_exp: song.lev_exp,
        lev_mas: song.lev_mas,
        lev_ult: song.lev_ult,
        we_kanji: song.we_kanji,
        we_star: song.we_star,
        image_url: song.image,
      });
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to fetch songs." });
  }
  res.json(songs);
});

app.get("/maisearch", async (req, res) => {
  const songs = [];
  const url = "https://maimai.sega.jp/data/maimai_songs.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    json.forEach((song) => {
      songs.push({
        id: song.sort,
        category: song.catcode,
        release: song.release,
        title: song.title,
        artist: song.artist,
        lev_bas: song.lev_bas || "",
        lev_adv: song.lev_adv || "",
        lev_exp: song.lev_exp || "",
        lev_mas: song.lev_mas || "",
        lev_remas: song.lev_remas || "",
        dx_lev_bas: song.dx_lev_bas || "",
        dx_lev_adv: song.dx_lev_adv || "",
        dx_lev_exp: song.dx_lev_exp || "",
        dx_lev_mas: song.dx_lev_mas || "",
        dx_lev_remas: song.dx_lev_remas || "",
        image_url: song.image_url,
      });
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to fetch songs." });
  }
  res.json(songs);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
