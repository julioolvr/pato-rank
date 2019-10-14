require("dotenv").config();

import express = require("express");
import bodyParser = require("body-parser");
import {
  getPlayers,
  getPlayersRankings,
  updateRankingWithMatch,
  PlayerWithGlicko
} from "./ranking";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.render("index"));

app.get("/ranks", async (req, res) => {
  const players: {
    [key: string]: PlayerWithGlicko;
  } = await getPlayersRankings();

  const playersByRank = Object.values(players).sort((a, b) =>
    a.glicko.getRating() > b.glicko.getRating() ? -1 : 1
  );

  res.render("ranks", { ranking: playersByRank });
});

app.get("/matches/new", async (req, res) => {
  const players = await getPlayers();
  res.render("matches/new", { players });
});

app.post("/matches", async (req, res) => {
  updateRankingWithMatch(req.body).then(() => res.redirect("/ranks"));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
