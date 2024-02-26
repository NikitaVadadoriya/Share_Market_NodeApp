'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_wallet.belongsTo(models.user_info, { foreignKey: "user_id", as: "userInfo" });
    }
  }
  user_wallet.init({
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
    current_level: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    current_balance: {
      allowNull: true,
      type: DataTypes.DECIMAL
    },
    increment_amount: {
      allowNull: true,
      type: DataTypes.DECIMAL
    },
    next_level_amount: {
      allowNull: true,
      type: DataTypes.DECIMAL
    },
    boost_status: {
      allowNull: true,
      type: DataTypes.INTEGER
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
    modelName: 'user_wallet',
  });
  return user_wallet;
};