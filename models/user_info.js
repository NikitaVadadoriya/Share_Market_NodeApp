'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_info.init({
    id:
    {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstName:
    {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastName:
    {
      allowNull: false,
      type: DataTypes.STRING
    },
    userEmail:
    {
      allowNull: false,
      type: DataTypes.STRING
    },
    userPhone:
    {
      allowNull: false,
      type: DataTypes.STRING
    },
    dial_code:
    {
      allowNull: false,
      type: DataTypes.STRING
    },
    userProfile:
    {
      allowNull: true,
      type: DataTypes.STRING
    },
    password:
    {
      allowNull: false,
      type: DataTypes.STRING
    },
    otp: {
      allowNull: true,
      type: DataTypes.STRING
    },
    isDeleted:
    {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt:
    {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt:
    {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'user_info',
  });
  return user_info;
};