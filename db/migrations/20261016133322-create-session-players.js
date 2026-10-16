'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('players', {
      player_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      session_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'game_sessions',
          key: 'session_id'
        },
        onDelete: 'CASCADE'
      },
      nickname: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      player_color: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      streak: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      device_platform: {
        type: Sequelize.STRING(20)
      },
      joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });

    await queryInterface.addConstraint('players', {
      type: 'unique',
      name: 'uq_players_session_nickname',
      fields: ['session_id', 'nickname']
    });

    await queryInterface.addConstraint('players', {
      type: 'unique',
      name: 'uq_players_session_color',
      fields: ['session_id', 'player_color']
    });

    await queryInterface.addConstraint('players', {
      type: 'check',
      name: 'ck_players_valid_color',
      fields: ['player_color'],
      where: {
        player_color: { [Sequelize.Op.in]: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'] }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('players');
  }
};