'use strict';
module.exports = function(sequelize, DataTypes) {
  var paste = sequelize.define('paste', {
    hash: DataTypes.STRING,
    expire: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return paste;
};