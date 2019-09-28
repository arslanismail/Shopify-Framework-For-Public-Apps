const express = require("express");
const app = express();
const parser = require("body-parser");
const shopify = require("./framework/routes/FrameWorkRoutes");
const ShopifyAccessTokken = require("./framework/ShopifyClient");

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
const Sequelize = require("sequelize");
app.set("view engine", "ejs");
app.use("/shopify", shopify);

app.get("/install", function(req, res) {
  res.render("pages/install");
});
app.get("/", (req, res) => {
  res.send("success");

  // res.send("homePage");
});

app.listen(4000, () => {
  console.log("Example app listening on port 4000!");
});
