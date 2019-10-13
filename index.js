require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const {
  getPlayers,
  getPlayersRankings,
  updateRankingWithMatch
} = require("./ranking");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.render("index"));

app.get("/ranks", async (req, res) => {
  const players = await getPlayersRankings();

  const playersByRank = Object.keys(players)
    .map(key => ({ id: key, glicko: players[key] }))
    .sort((a, b) => (a.glicko.getRating() > b.glicko.getRating() ? -1 : 1));

  res.render("ranks", { ranking: playersByRank });
});

app.get("/matches/new", async (req, res) => {
  const players = await getPlayers();
  res.render("matches/new", { players });
});

app.post("/matches", async (req, res) => {
  updateRankingWithMatch(req.body);
  res.redirect("/ranks");
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
