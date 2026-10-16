'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('crossword_grids', {
      grid_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
      }
    });

    await queryInterface.addConstraint('crossword_grids', {
      type: 'check',
      name: 'ck_grid_size_range',
      fields: ['size'],
      where: {
        size: { [Sequelize.Op.between]: [8, 12] }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('crossword_grids');
  }
};