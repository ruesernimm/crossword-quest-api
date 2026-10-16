'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('game_sessions', {
      session_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      host_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'hosts',
          key: 'host_id'
        },
        onDelete: 'RESTRICT'
      },
      set_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'set_id'
        },
        onDelete: 'RESTRICT'
      },
      grid_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: 'crossword_grids',
          key: 'grid_id'
        },
        onDelete: 'CASCADE'
      },
      join_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
        unique: true
      },
      shareable_link: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'WAITING'
      },
      started_at: {
        type: Sequelize.DATE
      },
      ended_at: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });

    await queryInterface.addConstraint('game_sessions', {
      type: 'check',
      name: 'ck_session_status',
      fields: ['status'],
      where: {
        status: { [Sequelize.Op.in]: ['WAITING', 'PLAYING', 'FINISHED'] }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('game_sessions');
  }
};