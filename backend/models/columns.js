const { v4: uuidv4 } = require('uuid');
const db = require('../db/init');

const Columns = {
  getByBoard: (boardId, callback) => {
    db.all('SELECT * FROM columns WHERE board_id = ? ORDER BY position', [boardId], callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM columns WHERE id = ?', [id], callback);
  },

  create: (boardId, name, position, callback) => {
    const id = uuidv4();
    db.run(
      'INSERT INTO columns (id, board_id, name, position) VALUES (?, ?, ?, ?)',
      [id, boardId, name, position],
      function(err) {
        callback(err, { id, board_id: boardId, name, position });
      }
    );
  },

  update: (id, name, position, callback) => {
    db.run(
      'UPDATE columns SET name = ?, position = ? WHERE id = ?',
      [name, position, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM columns WHERE id = ?', [id], callback);
  }
};

module.exports = Columns;
