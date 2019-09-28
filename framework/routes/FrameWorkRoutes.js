let express = require("express");
let router = express.Router();
let Client = require("../ShopifyClient");
let ShopObject = require("../Apis/Shop");

const ShopifyClient = new Client();
const Shop = new ShopObject();

router.post("", (req, res) => {
  ShopifyClient.install(req, res);
});
router.get("/callback", (req, res) => {
  ShopifyClient.callback(req, res);
});

router.get("/getshop", (req, res) => {
  Shop.getShopInfo(req, res);
});

module.exports = router;
