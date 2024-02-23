'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_Wallet.belongsTo(models.user_infom, { foreignKey: "user_id", as: "userInfo" });
    }
  }
  user_Wallet.init({
    id:
    {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: "user_info", key: "id" }
    },
    current_balance: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    current_level: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    status: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    next_level_amount: {
      allowNull: false,
      type: DataTypes.DECIMAL
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
    modelName: 'user_Wallet',
  });
  return user_Wallet;
};