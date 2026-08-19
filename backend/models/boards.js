const { v4: uuidv4 } = require('uuid');
const db = require('../db/init');

const Boards = {
  getByProject: (projectId, callback) => {
    db.all('SELECT * FROM boards WHERE project_id = ? ORDER BY created_at DESC', [projectId], callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM boards WHERE id = ?', [id], callback);
  },

  getWithColumns: (id, callback) => {
    db.get('SELECT * FROM boards WHERE id = ?', [id], (err, board) => {
      if (err || !board) return callback(err, null);

      db.all('SELECT * FROM columns WHERE board_id = ? ORDER BY position', [id], (err, columns) => {
        if (err) return callback(err, null);

        // Fetch tasks for each column
        let tasksLeft = columns.length;
        if (tasksLeft === 0) return callback(null, { ...board, columns: [] });

        columns.forEach((column, index) => {
          db.all('SELECT * FROM tasks WHERE column_id = ? ORDER BY position', [column.id], (err, tasks) => {
            const parsed = tasks?.map(task => ({
              ...task,
              labels: task.labels ? JSON.parse(task.labels) : []
            })) || [];
            columns[index].tasks = parsed;
            tasksLeft--;
            if (tasksLeft === 0) {
              callback(null, { ...board, columns });
            }
          });
        });
      });
    });
  },

  create: (projectId, name, callback) => {
    const id = uuidv4();
    db.run(
      'INSERT INTO boards (id, project_id, name) VALUES (?, ?, ?)',
      [id, projectId, name],
      function(err) {
        callback(err, { id, project_id: projectId, name });
      }
    );
  },

  update: (id, name, callback) => {
    db.run('UPDATE boards SET name = ? WHERE id = ?', [name, id], callback);
  },

  delete: (id, callback) => {
    db.run('DELETE FROM boards WHERE id = ?', [id], callback);
  }
};

module.exports = Boards;
