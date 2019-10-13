const express = require("express");
const _ = require("ramda");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index"));

const glicko = require("glicko2");
const rankingSettings = {
  tau: 0.5,
  rating: 1500,
  rd: 200,
  vol: 0.06
};
const ranking = new glicko.Glicko2(rankingSettings);

app.get("/ranks", async (req, res) => {
  const players = await getPlayers();
  const matches = await getMatches();

  applyMatchesToRankings(ranking, players, matches);

  const playersByRank = Object.keys(players)
    .map(key => ({ id: key, glicko: players[key] }))
    .sort((a, b) => (a.glicko.getRating() > b.glicko.getRating() ? -1 : 1));

  console.log({ playersByRank });

  res.render("ranks", { ranking: playersByRank, matches });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const FAKE_RANKING = [
  { id: "PATO 1", rating: 1650, rd: 200, vol: 0.06 },
  { id: "PATO 2", rating: 1570, rd: 200, vol: 0.06 },
  { id: "PATO 3", rating: 1450, rd: 200, vol: 0.06 },
  { id: "PATO 4", rating: 1427, rd: 200, vol: 0.06 },
  { id: "PATO 5", rating: 1312, rd: 200, vol: 0.06 }
];

async function getPlayers() {
  return _.mergeAll(
    FAKE_RANKING.map(player => ({
      [player.id]: ranking.makePlayer(player.rating, player.rd, player.vol)
    }))
  );
}

async function getMatches() {
  return [
    [["PATO 1"], ["PATO 2"], ["PATO 3"], ["PATO 4"]],
    [["PATO 1"], ["PATO 2", "PATO 4"], ["PATO 3"]],
    [["PATO 2"], ["PATO 4"], ["PATO 1"], ["PATO 5"]],
    [["PATO 3"], ["PATO 1", "PATO 5"]]
  ];
}

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
