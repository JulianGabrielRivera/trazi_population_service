const express = require("express");
const router = express.Router();
const { createKeys } = require("../javascripts/createKeys");
const fs = require("fs");
const csvParser = require("csv-parser");

const cityPopulationMap = new Map();

fs.createReadStream("city_populations.csv")
  .pipe(csvParser())
  .on("data", (object) => {
    const state = object.state;
    const city = object.city;
    const population = +object.population;

    const key = createKeys(state, city);
    cityPopulationMap.set(key, population);
  })
  .on("end", () => {
    console.log("City population data loaded successfully.");
  });

router.get("/population/state/:state/city/:city", (req, res) => {
  const state = req.params.state;
  const city = req.params.city;
  const key = createKeys(state, city);
  const population = cityPopulationMap.get(key);
  if (!population) {
    return res
      .status(400)
      .json({ error: "City and State not found in the dataset." });
  }

  return res.status(200).json({ population });
});
router.put("/population/state/:state/city/:city", (req, res) => {
  const state = req.params.state;
  const city = req.params.city;
  const key = createKeys(state, city);
  const population = +req.body.population;

  if (isNaN(population)) {
    return res
      .status(400)
      .json({ error: "Invalid population format. Please provide a number." });
  }
  if (!cityPopulationMap.has(key)) {
    cityPopulationMap.set(key, population);

    return res.status(201).end();
  }

  return res.status(200).end();
});

module.exports = router;
