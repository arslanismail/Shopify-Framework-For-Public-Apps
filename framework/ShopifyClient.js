const crypto = require("crypto");
const cookie = require("cookie");
const nonce = require("nonce")();
const querystring = require("querystring");
const request = require("request-promise");
const dotenv = require("dotenv").config();
const ShopModel = require("../models/shop");
const db = require("../models/index");
class ShopifyClient {
  constructor() {
    this.key = process.env.SHOPIFY_API_KEY;
    this.secret = process.env.SHOPIFY_API_SECRET;
    this.forwardingAddress = process.env.SERVER_ADDRESS;
    this.scopes = process.env.SCOPE;
    this.tokken = "NoTokken";
  }

  getTokken = () => {
    return this.tokken;
  };

  install = (req, res) => {
    const shop = req.body.shop;
    if (shop) {
      const state = nonce();
      const redirectUri = this.forwardingAddress + "/shopify/callback";
      const installUrl =
        "https://" +
        shop +
        "/admin/oauth/authorize?client_id=" +
        this.key +
        "&scope=" +
        this.scopes +
        "&state=" +
        state +
        "&redirect_uri=" +
        redirectUri;

      // res.cookie("state", state);
      res.redirect(installUrl);
    } else {
      return res
        .status(400)
        .send(
          "Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request"
        );
    }
  };

  callback = (req, res) => {
    const { shop, hmac, code, state } = req.query;
    // const stateCookie = cookie.parse(req.headers.cookie).state;

    //   if (state !== stateCookie) {
    //     return res.status(403).send("Request origin cannot be verified");
    //   }

    if (shop && hmac && code) {
      // DONE: Validate request is from Shopify
      const map = Object.assign({}, req.query);
      delete map["signature"];
      delete map["hmac"];
      const message = querystring.stringify(map);
      const providedHmac = Buffer.from(hmac, "utf-8");
      const generatedHash = Buffer.from(
        crypto
          .createHmac("sha256", this.secret)
          .update(message)
          .digest("hex"),
        "utf-8"
      );
      let hashEquals = false;

      try {
        hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
      } catch (e) {
        hashEquals = false;
      }

      if (!hashEquals) {
        return res.status(400).send("HMAC validation failed");
      }

      // DONE: Exchange temporary code for a permanent access token
      const accessTokenRequestUrl =
        "https://" + shop + "/admin/oauth/access_token";
      const accessTokenPayload = {
        client_id: this.key,
        client_secret: this.secret,
        code
      };

      request
        .post(accessTokenRequestUrl, { json: accessTokenPayload })
        .then(accessTokenResponse => {
          const accessToken = accessTokenResponse.access_token;
          const Shop = ShopModel(db.sequelize, db.Sequelize);
          (async () => {
            const response = await Shop.findOrCreate({
              where: { Name: shop, access_tokken: accessToken }
            });
            res.redirect("/shopify/getshop");
          })();

          // DONE: Use access token to make API call to 'shop' endpoint
        })
        .catch(error => {
          res.status(error.statusCode).send(error.error.error_description);
        });
    } else {
      res.status(400).send("Required parameters missing");
    }
  };
}

module.exports = ShopifyClient;
