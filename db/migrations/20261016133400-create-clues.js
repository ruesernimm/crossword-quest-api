'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('clues', {
      clue_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      set_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'set_id'
        },
        onDelete: 'CASCADE'
      },
      direction: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      start_row: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      start_col: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      clue_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      answer_text: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      answer_length: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });

    await queryInterface.addConstraint('clues', {
      type: 'check',
      name: 'ck_clue_direction',
      fields: ['direction'],
      where: {
        direction: { [Sequelize.Op.in]: ['ACROSS', 'DOWN'] }
      }
    });

    await queryInterface.addConstraint('clues', {
      type: 'check',
      name: 'ck_row_range',
      fields: ['start_row'],
      where: {
        start_row: { [Sequelize.Op.between]: [0, 20] }
      }
    });

    await queryInterface.addConstraint('clues', {
      type: 'check',
      name: 'ck_col_range',
      fields: ['start_col'],
      where: {
        start_col: { [Sequelize.Op.between]: [0, 20] }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('clues');
  }
};