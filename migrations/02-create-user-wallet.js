'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_wallets', {
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
      current_level: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      current_balance: {
        allowNull: true,
        type: Sequelize.DECIMAL
      },
      increment_amount: {
        allowNull: true,
        type: Sequelize.DECIMAL
      },
      next_level_amount: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      boost_status: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      isDeleted: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('user_wallets');
  }
};