const { mongoose } = require("../src/database");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    pw: String,
  })
);

module.exports = User;
