const _ = require("ramda");
const glicko = require("glicko2");

const db = require("./db");

/**
 * @typedef {object} Player
 * @property {string} id
 * @property {number} rating
 * @property {number} rd Rating deviation
 * @property {number} vol Volatility
 */

/**
 * Returns an object where keys are the player ids and values
 * are their respective player objects from Glicko's ranking
 *
 * @returns {Object.<string, object>} Ranked players
 */
async function getPlayersRankings() {
  return (await buildRanking()).players;
}

/**
 * Returns a list of up to 100 players, with their id/name, rating, rating deviation,
 * and volatility
 * @returns {Array<Player>}
 */
async function getPlayers() {
  return db.getPlayers();
}

async function updateRankingWithMatch(match) {
  const { ranking, players } = await buildRanking();

  const race = ranking.makeRace([
    [players[match.first]],
    match.second.filter(Boolean).map(playerId => players[playerId]),
    match.third.filter(Boolean).map(playerId => players[playerId]),
    match.fourth.filter(Boolean).map(playerId => players[playerId])
  ]);

  ranking.updateRatings(race);

  const updatedPlayers = [match.first]
    .concat(match.second.filter(Boolean))
    .concat(match.third.filter(Boolean))
    .concat(match.fourth.filter(Boolean));

  console.log({ players });

  db.updatePlayers(
    updatedPlayers.map(playerId => ({
      id: playerId,
      rating: players[playerId].getRating(),
      rd: players[playerId].getRd(),
      vol: players[playerId].getVol()
    }))
  );
}

module.exports = {
  getPlayers,
  getPlayersRankings,
  updateRankingWithMatch
};

async function buildRanking() {
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

  console.log("buildRanking", { ranking });

  return {
    ranking,
    players: playersRanking
  };
}
