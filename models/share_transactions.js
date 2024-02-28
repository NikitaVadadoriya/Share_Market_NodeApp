'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class share_transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  share_transactions.init({
    id:
    {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id:
    {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: "user_info", key: "id" }
    },
    symbol_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    transaction_type: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    quantity: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    share_price: {
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
    modelName: 'share_transactions',
  });
  return share_transactions;
};