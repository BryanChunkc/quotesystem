const express = require("express");
const bodyParser = require("body-parser");
require("express-async-errors");
const { mongoose } = require("./src/database");
const app = express();
const Quotes = require("./models/quotes");
const User = require("./models/user");
const session = require("express-session");
const MongoStore = require("connect-mongo");

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "log into quote system",
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/login",
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 1000 },
  })
);

app.get("/quotes", async (req, res) => {
  let results = await Quotes.find();
  res.render("index.ejs", { quotes: results });
});

app.post("/quotes", async (req, res) => {
  const result = new Quotes(req.body);
  await result.save();
  res.redirect("/quotes");
});

app.post("/signup", async (req, res) => {
  let reged = await User.findOne({ username: req.body.username });
  if (reged) {
    res.status(400).send("User registered before");
  } else {
    const result = new User(req.body);
    await result.save();
    res.redirect("/");
  }
});

app.listen(3000, () => {
  console.log("listening on 3000");
});

app.get("/", async (req, res) => {
  let results;
  results = await Quotes.find();
  res.render("login.ejs", { quotes: results });
});

app.get("/quoteinfo/:id", async (req, res) => {
  let results;
  results = await Quotes.find();
  res.render("quoteinfo.ejs", {
    id: req.params.id,
    quotes: results,
  });
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs", {});
});

app.post("/logined", async (req, res) => {
  let reged = await User.findOne({
    username: req.body.username,
    pw: req.body.pw,
  });
  results = await Quotes.find();
  if (reged) {
    req.session.user = req.body.username;
    res.render("index.ejs", {
      quotes: results,
    });
  } else {
    res.status(400).send("User not yet register or password is wrong");
  }
});
