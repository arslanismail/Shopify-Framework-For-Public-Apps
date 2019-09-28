"use strict";
module.exports = (sequelize, DataTypes) => {
  const Shop = sequelize.define(
    "Shop",
    {
      Name: DataTypes.STRING,
      access_tokken: DataTypes.STRING
    },
    {}
  );
  Shop.associate = function(models) {
    // associations can be defined here
  };
  return Shop;
};
