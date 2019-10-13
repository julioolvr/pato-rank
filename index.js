require("dotenv").config();

const express = require("express");

const { getPlayersRankings } = require("./ranking");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index"));

app.get("/ranks", async (req, res) => {
  const players = await getPlayersRankings();

  const playersByRank = Object.keys(players)
    .map(key => ({ id: key, glicko: players[key] }))
    .sort((a, b) => (a.glicko.getRating() > b.glicko.getRating() ? -1 : 1));

  res.render("ranks", { ranking: playersByRank });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// eslint-disable-next-line no-unused-vars
async function getMatches() {
  return [
    [["PATO 1"], ["PATO 3"], ["PATO 4"]],
    [["PATO 1"], ["PATO 4"], ["PATO 3"]],
    [["PATO 4"], ["PATO 1"], ["PATO 5"]],
    [["PATO 3"], ["PATO 1", "PATO 5"]]
  ];
}

// eslint-disable-next-line no-unused-vars
function applyMatchesToRankings(ranking, players, matches) {
  const races = matches.map(match =>
    ranking.makeRace(
      match.map(playersInPosition =>
        playersInPosition.map(playerId => players[playerId])
      )
    )
  );

  ranking.updateRatings(races.flatMap(race => race.getMatches()));
}
