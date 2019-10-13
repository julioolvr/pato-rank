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
            id: record.get("name"),
            name: record.get("name"),
            rating: record.get("rating"),
            rd: record.get("rd"),
            vol: record.get("vol")
          }))
        );
      });
  });
}

module.exports = { getPlayers };
