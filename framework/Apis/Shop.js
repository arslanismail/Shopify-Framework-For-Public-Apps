const ShopModel = require("../../models/shop");
const db = require("../../models/index");
const request = require("request-promise");
const dotenv = require("dotenv").config();
class Shop {
  constructor() {
    this.Shop = ShopModel(db.sequelize, db.Sequelize);
    this.token = "Empty";
    this.shopName = process.env.SHOPNAME;
  }

  getShopInfo = (req, res) => {
    (async () => {
      try {
        const shopObj = await this.Shop.findOne({
          where: { Name: this.shopName }
        });
        this.token = shopObj.dataValues.access_tokken;
        const shopRequestUrl =
          "https://" + this.shopName + "/admin/api/2019-07/shop.json";
        const shopRequestHeaders = {
          "X-Shopify-Access-Token": this.token
        };
        let shopResponse = await request.get(shopRequestUrl, {
          headers: shopRequestHeaders
        });
        res.send(shopResponse);
      } catch (err) {
        console.log(err); // TypeError: failed to fetch
      }
    })();
  };
}

module.exports = Shop;
