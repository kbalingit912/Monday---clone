const { v4: uuidv4 } = require('uuid');
const db = require('../db/init');

const Projects = {
  getAll: (userId, callback) => {
    db.all('SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC', [userId], callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM projects WHERE id = ?', [id], callback);
  },

  create: (userId, name, description, callback) => {
    const id = uuidv4();
    db.run(
      'INSERT INTO projects (id, user_id, name, description) VALUES (?, ?, ?, ?)',
      [id, userId, name, description],
      function(err) {
        callback(err, { id, user_id: userId, name, description });
      }
    );
  },

  update: (id, name, description, callback) => {
    db.run(
      'UPDATE projects SET name = ?, description = ? WHERE id = ?',
      [name, description, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM projects WHERE id = ?', [id], callback);
  }
};

module.exports = Projects;
