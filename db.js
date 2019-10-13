const Airtable = require("airtable");

Airtable.configure({
  apiKey: process.env.AIRTABLE_SECRET_KEY
});
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

async function getPlayers() {
  return new Promise((resolve, reject) => {
    // TODO: This returns up to 100 players
    base("Players")
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

async function updatePlayers(updatedPlayersData) {
  return new Promise((resolve, reject) => {
    base("Players").update(
      updatedPlayersData.map(data => ({
        id: data.id,
        fields: { rating: data.rating, rd: data.rd, vol: data.vol }
      })),
      err => (err ? reject(err) : resolve())
    );
  });
}

module.exports = { getPlayers, updatePlayers };
