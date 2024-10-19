const express = require("express");
const mysql = require("mysql2");
const expressLayouts = require("express-ejs-layouts");
const app = express();
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static(__dirname + "/public"));
const port = 3000;

app.get("/", (req, res) => {
  res.render("index");
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
