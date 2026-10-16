'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('device_info', {
      device_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      player_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'players',
          key: 'player_id'
        },
        onDelete: 'CASCADE'
      },
      platform: {
        type: Sequelize.STRING(20)
      },
      browser: {
        type: Sequelize.STRING(50)
      },
      last_seen: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });

    // One device info per player (1-to-1)
    await queryInterface.addConstraint('device_info', {
      type: 'unique',
      name: 'uq_device_info_player',
      fields: ['player_id']
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('device_info');
  }
};