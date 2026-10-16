'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const db = queryInterface.sequelize;

    // 1. parents first, then ask the database for their IDs
    await queryInterface.bulkInsert('hosts', [
      { username: 'demo_host', password_hash: 'demo-only-not-a-real-hash' }
    ]);
    const [[host]] = await db.query("SELECT host_id FROM hosts WHERE username = 'demo_host'");

    await queryInterface.bulkInsert('question_sets', [{ name: 'Demo: Campus Basics' }]);
    const [[set]] = await db.query("SELECT set_id FROM question_sets WHERE name = 'Demo: Campus Basics'");

    await queryInterface.bulkInsert('crossword_grids', [{ size: 10 }]);
    const [[grid]] = await db.query('SELECT grid_id FROM crossword_grids ORDER BY grid_id DESC LIMIT 1');

    await queryInterface.bulkInsert('clues', [
      { set_id: set.set_id, direction: 'ACROSS', start_row: 0, start_col: 0,
        clue_text: 'Place where books are borrowed', answer_text: 'LIBRARY', answer_length: 7 },
      { set_id: set.set_id, direction: 'DOWN', start_row: 0, start_col: 0,
        clue_text: 'Where classes and events are held', answer_text: 'CAMPUS', answer_length: 6 },
      { set_id: set.set_id, direction: 'ACROSS', start_row: 4, start_col: 2,
        clue_text: 'Test at the end of the term', answer_text: 'EXAM', answer_length: 4 }
    ]);

    // 2. a game that has ENDED
    await queryInterface.bulkInsert('game_sessions', [{
      host_id: host.host_id,
      set_id: set.set_id,
      grid_id: grid.grid_id,
      join_code: '418263',
      shareable_link: 'https://crosswordquest.test/join/418263',
      status: 'FINISHED',
      started_at: new Date('2026-10-09T01:00:00Z'),
      ended_at: new Date('2026-10-09T01:12:00Z')
    }]);
    const [[game]] = await db.query("SELECT session_id FROM game_sessions WHERE join_code = '418263'");

    // 3. players (linked to the demo accounts)
    const [users] = await db.query("SELECT user_id, school_id FROM users WHERE school_id LIKE '2099-%'");
    const uid = (schoolId) => users.find((u) => u.school_id === schoolId).user_id;

    await queryInterface.bulkInsert('players', [
      { session_id: game.session_id, user_id: uid('2099-0002'), nickname: 'AnaDemo',   player_color: 'RED',    token: 'demo-token-ana',   score: 70, streak: 1, device_platform: 'mobile' },
      { session_id: game.session_id, user_id: uid('2099-0003'), nickname: 'BenDemo',   player_color: 'BLUE',   token: 'demo-token-ben',   score: 60, streak: 1, device_platform: 'desktop' },
      { session_id: game.session_id, user_id: uid('2099-0004'), nickname: 'CarlaDemo', player_color: 'GREEN',  token: 'demo-token-carla', score: 40, streak: 1, device_platform: 'mobile' },
      // awkward case: left early, did not complete
      { session_id: game.session_id, user_id: uid('2099-0005'), nickname: 'DinoDemo',  player_color: 'YELLOW', token: 'demo-token-dino',  score: 0,  streak: 0, device_platform: 'mobile' }
    ]);

    const [players] = await db.query(
      `SELECT player_id, nickname FROM players WHERE session_id = ${game.session_id}`
    );
    const pid = (nick) => players.find((p) => p.nickname === nick).player_id;

    const [clues] = await db.query(
      `SELECT clue_id, answer_text FROM clues WHERE set_id = ${set.set_id}`
    );
    const cid = (word) => clues.find((c) => c.answer_text === word).clue_id;

    // 4. solved words (only the three who completed)
    await queryInterface.bulkInsert('solved_words', [
      { session_id: game.session_id, clue_id: cid('LIBRARY'), player_id: pid('AnaDemo'),   points_awarded: 70, solved_at: new Date('2026-10-09T01:04:00Z') },
      { session_id: game.session_id, clue_id: cid('CAMPUS'),  player_id: pid('BenDemo'),   points_awarded: 60, solved_at: new Date('2026-10-09T01:07:00Z') },
      { session_id: game.session_id, clue_id: cid('EXAM'),    player_id: pid('CarlaDemo'), points_awarded: 40, solved_at: new Date('2026-10-09T01:10:00Z') }
    ]);

    // 5. device info, one per player
    await queryInterface.bulkInsert('device_info', [
      { player_id: pid('AnaDemo'),   platform: 'mobile',  browser: 'Chrome' },
      { player_id: pid('BenDemo'),   platform: 'desktop', browser: 'Firefox' },
      { player_id: pid('CarlaDemo'), platform: 'mobile',  browser: 'Safari' },
      { player_id: pid('DinoDemo'),  platform: 'mobile',  browser: 'Chrome' }
    ]);
  },

  async down (queryInterface) {
    const db = queryInterface.sequelize;
    // deleting the game cascades to players, solved_words and device_info
    await db.query("DELETE FROM game_sessions WHERE join_code = '418263'");
    await db.query('DELETE FROM crossword_grids WHERE grid_id NOT IN (SELECT grid_id FROM game_sessions)');
    await db.query("DELETE FROM question_sets WHERE name = 'Demo: Campus Basics'");
    await db.query("DELETE FROM hosts WHERE username = 'demo_host'");
  }
};