import Airtable = require("airtable");

Airtable.configure({
  apiKey: process.env.AIRTABLE_SECRET_KEY
});

type PlayerType = {
  name: string;
  rating: number;
  rd: number;
  vol: number;
};

const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

async function getPlayers() {
  return new Promise((resolve, reject) => {
    // TODO: This returns up to 100 players
    base<PlayerType>("Players")
      .select()
      .firstPage((err, records) => {
        if (err) {
          return reject(err);
        }

        resolve(
          records.map(record => ({
            id: record.id,
            name: record.get("name"),
            rating: record.get("rating"),
            rd: record.get("rd"),
            vol: record.get("vol")
          }))
        );
      });
  });
}

async function updatePlayers(
  updatedPlayersData: Array<{
    id: string;
    rating: number;
    rd: number;
    vol: number;
  }>
) {
  return new Promise((resolve, reject) => {
    base<PlayerType>("Players").update(
      updatedPlayersData.map(data => ({
        id: data.id,
        fields: { rating: data.rating, rd: data.rd, vol: data.vol }
      })),
      err => (err ? reject(err) : resolve())
    );
  });
}

module.exports = { getPlayers, updatePlayers };
