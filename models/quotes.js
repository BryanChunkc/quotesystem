const { mongoose } = require("../src/database");

const quotes = mongoose.model(
  "Quotes",
  new mongoose.Schema({
    quote: String,
    name: String,
    user: String,
  })
);

module.exports = quotes;
