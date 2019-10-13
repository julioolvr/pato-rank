const express = require("express");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index"));
app.get("/ranks", async (req, res) => {
  const ranking = await getRanking();
  res.render("ranks", { ranking });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

async function getRanking() {
  return [
    { name: "PATO 1", score: 1650 },
    { name: "PATO 2", score: 1570 },
    { name: "PATO 3", score: 1450 }
  ];
}
