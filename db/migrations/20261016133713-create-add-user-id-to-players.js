'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('players', 'user_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onDelete: 'SET NULL'
    });

    // One seat per account per game
    await queryInterface.addConstraint('players', {
      type: 'unique',
      name: 'uq_players_session_user',
      fields: ['session_id', 'user_id']
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('players', 'uq_players_session_user');
    await queryInterface.removeColumn('players', 'user_id');
  }
};