const db = require('./backend/db/init');

db.all('PRAGMA table_info(tasks)', (err, rows) => {
  if (err) {
    console.error('Error checking schema:', err);
    return;
  }
  console.log('Tasks table columns:');
  rows.forEach(row => {
    console.log(`  ${row.name}: ${row.type}`);
  });
});

db.all('SELECT id, title, is_recurring, recurrence_pattern FROM tasks LIMIT 5', (err, rows) => {
  if (err) {
    console.error('Error querying tasks:', err);
    return;
  }
  console.log('\nTasks in database:');
  console.log(rows);
  process.exit(0);
});
