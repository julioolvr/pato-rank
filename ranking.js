const _ = require("ramda");
const glicko = require("glicko2");

const db = require("./db");

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
  return db.getPlayers();
}
