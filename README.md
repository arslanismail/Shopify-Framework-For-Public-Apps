# Shopify FrameWork By Arslan For Public Apps

This is a light framework using nodejs express and mysql to get you started with making public apps for shopify with least configurations possible

# Requirements

- mysql server / xampp / wamp
- you must have node version 12.8.0 or above , we are using classes that needs node latest version

# installation Instructions

- make a database and give it's credetials to config.json inside config folder in the root of your project
- command " npm install " run this command in the root of your project it will fetch all dependencies
- "npx sequelize-cli db:migrate" run this command and check your database that it created the shop table

# .env

- before running the project you need to create .env file in the root of your project with following variables

- SHOPIFY_API_KEY="Paste the key from your Shopify Partner Account"
- SHOPIFY_API_SECRET="Paste the Api Secret From Shopify Partner Account"
- SERVER_ADDRESS="this is the address your domain you host this project of yours
  (remember to add the url of your app with yourdomain.com/shopify and yourdomain.com/shopify/callback to whitelist url and url option in your partner app settings)"
- SCOPE="read_products(permission you asking from store owner)"
- SHOPNAME="storename.myshopify.com"
