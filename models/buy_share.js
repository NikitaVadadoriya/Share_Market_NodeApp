'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class buy_share extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      buy_share.belongsTo(models.user_info, { foreignKey: "user_id", as: "userInfo" })
      // buy_share.belongsTo(models.user_wallet, { foreignKey: "wallet_id", as: "walletInfo" })
    }
  }
  buy_share.init({
    id:
    {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    // wallet_id: {
    //   allowNull: false,
    //   type: DataTypes.INTEGER
    // },
    symbol_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    share_full_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    share_quantity: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    share_price: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    status: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'buy_share',
  });
  return buy_share;
};