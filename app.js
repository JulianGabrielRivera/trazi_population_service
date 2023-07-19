const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const populationRouter = require("./routes/population");

app.use("/api", populationRouter);

module.exports = app;
