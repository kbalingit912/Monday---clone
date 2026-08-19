const { v4: uuidv4 } = require('uuid');
const db = require('../db/init');

const Tags = {
  getByProject: (projectId, callback) => {
    db.all('SELECT * FROM tags WHERE project_id = ? ORDER BY usage_count DESC', [projectId], callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM tags WHERE id = ?', [id], callback);
  },

  create: (projectId, name, color, callback) => {
    const id = uuidv4();
    db.run(
      'INSERT OR IGNORE INTO tags (id, project_id, name, color) VALUES (?, ?, ?, ?)',
      [id, projectId, name, color],
      function(err) {
        if (err) return callback(err);
        // Return the tag (may be existing if INSERT was ignored)
        db.get('SELECT * FROM tags WHERE project_id = ? AND name = ?', [projectId, name], callback);
      }
    );
  },

  incrementUsage: (tagId, callback) => {
    db.run(
      'UPDATE tags SET usage_count = usage_count + 1 WHERE id = ?',
      [tagId],
      callback
    );
  },

  getOrCreateByName: (projectId, name, color, callback) => {
    db.get(
      'SELECT * FROM tags WHERE project_id = ? AND name = ?',
      [projectId, name],
      (err, tag) => {
        if (err) return callback(err);
        if (tag) return callback(null, tag);
        // Create new tag
        Tags.create(projectId, name, color, callback);
      }
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM tags WHERE id = ?', [id], callback);
  }
};

module.exports = Tags;
