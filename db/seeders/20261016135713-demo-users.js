'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('users', [
      { school_id: '2099-0001', full_name: 'Demo Instructor', email: 'instructor@demo.test', role: 'INSTRUCTOR' },
      { school_id: '2099-0002', full_name: 'Ana Demo',        email: 'ana@demo.test',        role: 'STUDENT' },
      { school_id: '2099-0003', full_name: 'Ben Demo',        email: 'ben@demo.test',        role: 'STUDENT' },
      { school_id: '2099-0004', full_name: 'Carla Demo',      email: 'carla@demo.test',      role: 'STUDENT' },
      { school_id: '2099-0005', full_name: 'Dino Demo',       email: 'dino@demo.test',       role: 'STUDENT' },
      // awkward case: an account that never joined any game
      { school_id: '2099-0006', full_name: 'Ella Demo',       email: 'ella@demo.test',       role: 'STUDENT' }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.sequelize.query("DELETE FROM users WHERE school_id LIKE '2099-%'");
  }
};