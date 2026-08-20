const { v4: uuidv4 } = require('uuid');
const db = require('../db/init');

const Tasks = {
  getByColumn: (columnId, callback) => {
    db.all('SELECT * FROM tasks WHERE column_id = ? ORDER BY position', [columnId], (err, rows) => {
      if (err) return callback(err);
      const parsed = rows?.map(row => ({
        ...row,
        labels: row.labels ? JSON.parse(row.labels) : []
      })) || [];
      callback(null, parsed);
    });
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
      if (err) return callback(err);
      if (!row) return callback(null, row);
      callback(null, {
        ...row,
        labels: row.labels ? JSON.parse(row.labels) : []
      });
    });
  },

  create: (columnId, title, description, position, metadata, callback) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const priority = metadata?.priority || 'medium';
    const status = metadata?.status || 'not started';
    const assignee = metadata?.assignee || null;
    const due_date = metadata?.due_date || null;
    const labels = metadata?.labels ? JSON.stringify(metadata.labels) : null;
    const is_recurring = metadata?.is_recurring || 0;
    const recurrence_pattern = metadata?.recurrence_pattern || null;
    const recurrence_end_date = metadata?.recurrence_end_date || null;

    db.run(
      'INSERT INTO tasks (id, column_id, title, description, position, priority, status, assignee, due_date, labels, is_recurring, recurrence_pattern, recurrence_end_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, columnId, title, description, position, priority, status, assignee, due_date, labels, is_recurring, recurrence_pattern, recurrence_end_date, now, now],
      function(err) {
        if (err) console.error('INSERT ERROR:', err);
        callback(err, {
          id,
          column_id: columnId,
          title,
          description,
          position,
          priority,
          status,
          assignee,
          due_date,
          labels: labels ? JSON.parse(labels) : [],
          is_recurring,
          recurrence_pattern,
          recurrence_end_date
        });
      }
    );
  },

  update: (id, title, description, columnId, position, metadata, callback) => {
    const now = new Date().toISOString();
    const priority = metadata?.priority || 'medium';
    const status = metadata?.status || 'not started';
    const assignee = metadata?.assignee || null;
    const due_date = metadata?.due_date || null;
    const labels = metadata?.labels ? JSON.stringify(metadata.labels) : null;
    const is_recurring = metadata?.is_recurring || 0;
    const recurrence_pattern = metadata?.recurrence_pattern || null;
    const recurrence_end_date = metadata?.recurrence_end_date || null;

    db.run(
      'UPDATE tasks SET title = ?, description = ?, column_id = ?, position = ?, priority = ?, status = ?, assignee = ?, due_date = ?, labels = ?, is_recurring = ?, recurrence_pattern = ?, recurrence_end_date = ?, updated_at = ? WHERE id = ?',
      [title, description, columnId, position, priority, status, assignee, due_date, labels, is_recurring, recurrence_pattern, recurrence_end_date, now, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM tasks WHERE id = ?', [id], callback);
  },

  reorder: (columnId, position, callback) => {
    db.run(
      'UPDATE tasks SET position = ? WHERE column_id = ?',
      [position, columnId],
      callback
    );
  }
};

module.exports = Tasks;
