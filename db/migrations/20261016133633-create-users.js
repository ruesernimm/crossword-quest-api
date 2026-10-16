'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      school_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      role: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'STUDENT'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};