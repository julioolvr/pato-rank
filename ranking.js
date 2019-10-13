const _ = require("ramda");
const glicko = require("glicko2");

async function getPlayersRankings() {
  const rankingSettings = {
    tau: 0.5,
    rating: 1500,
    rd: 200,
    vol: 0.06
  };

  const ranking = new glicko.Glicko2(rankingSettings);
  const playersData = await getPlayers();

  const playersRanking = _.mergeAll(
    playersData.map(player => ({
      [player.id]: ranking.makePlayer(player.rating, player.rd, player.vol)
    }))
  );

  return playersRanking;
}

module.exports = {
  getPlayersRankings
};

async function getPlayers() {
  return FAKE_RANKING;
}

const FAKE_RANKING = [
  { id: "PATO 1", rating: 1650, rd: 200, vol: 0.06 },
  { id: "PATO 2", rating: 1570, rd: 200, vol: 0.06 },
  { id: "PATO 3", rating: 1450, rd: 200, vol: 0.06 },
  { id: "PATO 4", rating: 1427, rd: 200, vol: 0.06 },
  { id: "PATO 5", rating: 1312, rd: 200, vol: 0.06 }
];
