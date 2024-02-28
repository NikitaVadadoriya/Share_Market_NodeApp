'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('buy_shares', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      // wallet_id: {
      //   type: Sequelize.INTEGER
      // },
      symbol_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      share_full_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      share_quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      share_price: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      status: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('buy_shares');
  }
};