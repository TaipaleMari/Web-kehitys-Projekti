require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();

// Middlewaret
app.use(express.json());
app.use(cors());

// Testireitti
app.get('/', (req, res) => {
  res.send('Backend toimii!');
});

// Rekisteröitymisreitti
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Täytä kaikki kentät' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, email],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Tietokantavirhe' });
      }

      if (user) {
        return res
          .status(400)
          .json({ message: 'Käyttäjänimi tai sähköposti on jo käytössä' });
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res
            .status(500)
            .json({ message: 'Salauksen epäonnistuminen' });
        }

        db.run(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username, email, hashedPassword],
          function (err) {
            if (err) {
              return res
                .status(500)
                .json({ message: 'Rekisteröinti epäonnistui' });
            }
            res.status(201).json({ message: 'Käyttäjä rekisteröity!' });
          }
        );
      });
    }
  );
});

// Kirjautumisreitti
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Täytä molemmat kentät' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Tietokantavirhe' });
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Virheellinen sähköposti tai salasana' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Virheellinen sähköposti tai salasana' });
    }

    res.status(200).json({
      message: 'Kirjautuminen onnistui',
      username: user.username,
      id: user.id
    });
  });
});

// ✅ Uuden tehtävän lisäämisreitti
app.post('/tasks', (req, res) => {
  const { userId, title, description } = req.body;

  if (!userId || !title) {
    return res.status(400).json({ message: 'Käyttäjä tai otsikko puuttuu' });
  }

  const sql = 'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)';
  db.run(sql, [userId, title, description || null], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Tehtävän lisääminen epäonnistui' });
    }
    res.status(201).json({ message: 'Tehtävä lisätty', taskId: this.lastID });
  });
});

// ✅ Haetaan käyttäjän tehtävät
app.get('/tasks/:userId', (req, res) => {
  const { userId } = req.params;

  db.all('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, tasks) => {
    if (err) {
      return res.status(500).json({ message: 'Tietokantavirhe' });
    }

    res.status(200).json({ tasks });
  });
});

// ✅ Poista tehtävä
app.delete('/tasks/:taskId', (req, res) => {
  const { taskId } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [taskId], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Tehtävän poistaminen epäonnistui' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Tehtävää ei löytynyt' });
    }

    res.status(200).json({ message: 'Tehtävä poistettu' });
  });
});

// ✅ Muokkaa tehtävän tietoja
app.put('/tasks/:taskId', (req, res) => {
  const { taskId } = req.params;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Tehtävän otsikko on pakollinen' });
  }

  db.run(
    'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
    [title, description, taskId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Tehtävän muokkaaminen epäonnistui' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Tehtävää ei löytynyt' });
      }

      res.status(200).json({ message: 'Tehtävä päivitetty' });
    }
  );
});

// Palvelimen käynnistys
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


