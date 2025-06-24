const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/api/todos', (req, res) => {
  db.all('SELECT * FROM todos ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'Text is required' });
    return;
  }
  
  db.run('INSERT INTO todos (text) VALUES (?)', [text], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, text, completed: false });
  });
});

app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  
  let query = 'UPDATE todos SET ';
  let params = [];
  
  if (text !== undefined) {
    query += 'text = ?';
    params.push(text);
  }
  
  if (completed !== undefined) {
    if (params.length > 0) query += ', ';
    query += 'completed = ?';
    params.push(completed);
  }
  
  query += ' WHERE id = ?';
  params.push(id);
  
  db.run(query, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    res.json({ message: 'Todo updated successfully' });
  });
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }
    res.json({ message: 'Todo deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});