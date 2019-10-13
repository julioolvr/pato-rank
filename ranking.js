const _ = require("ramda");
const glicko = require("glicko2");

const db = require("./db");

/**
 * @typedef {object} Player
 * @property {string} id
 * @property {string} name
 * @property {number} rating
 * @property {number} rd Rating deviation
 * @property {number} vol Volatility
 */

/**
 * @typedef {object} PlayerWithGlicko
 * @property {Player} data
 * @property {object} glicko Glicko player object
 */

/**
 * Returns an object where keys are the player ids and values
 * are their respective player objects
 *
 * @returns {Object.<string, Player>} Ranked players
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
    [players[match.first].glicko],
    match.second.filter(Boolean).map(playerId => players[playerId].glicko),
    match.third.filter(Boolean).map(playerId => players[playerId].glicko),
    match.fourth.filter(Boolean).map(playerId => players[playerId].glicko)
  ]);

  ranking.updateRatings(race);

  const updatedPlayers = [match.first]
    .concat(match.second.filter(Boolean))
    .concat(match.third.filter(Boolean))
    .concat(match.fourth.filter(Boolean));

  return db.updatePlayers(
    updatedPlayers.map(playerId => ({
      id: playerId,
      rating: players[playerId].glicko.getRating(),
      rd: players[playerId].glicko.getRd(),
      vol: players[playerId].glicko.getVol()
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
      [player.id]: {
        data: player,
        glicko: ranking.makePlayer(player.rating, player.rd, player.vol)
      }
    }))
  );

  return {
    ranking,
    players: playersRanking
  };
}
