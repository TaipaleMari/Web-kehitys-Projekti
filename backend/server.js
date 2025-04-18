// Ladataan ympäristömuuttujat .env-tiedostosta
require('dotenv').config();

// Tarvittavat kirjastot
const express = require('express');
const cors = require('cors'); // Mahdollistaa eri alkuperien (originien) välisen viestinnän
const bcrypt = require('bcryptjs'); // Salasanojen salaamiseen
const db = require('./db'); // Tietokantayhteys

const app = express();

// Middlewaret
app.use(express.json()); // Sallii JSON-datan käytön pyynnöissä
app.use(cors()); // Sallii CORSin (eri domainien väliset pyynnöt)

// Testireitti backendin toimivuuden tarkistamiseen
app.get('/', (req, res) => {
  res.send('Backend toimii!');
});

// ✅ Rekisteröitymisreitti
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Tarkistetaan, että kaikki kentät on täytetty
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Täytä kaikki kentät' });
  }

  // Tarkistetaan löytyykö sama käyttäjänimi tai sähköposti jo tietokannasta
  db.get(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, email],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Tietokantavirhe' });
      }

      // Jos käyttäjä löytyy, palautetaan virhe
      if (user) {
        return res
          .status(400)
          .json({ message: 'Käyttäjänimi tai sähköposti on jo käytössä' });
      }

      // Salataan salasana ennen tallennusta
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res
            .status(500)
            .json({ message: 'Salauksen epäonnistuminen' });
        }

        // Tallennetaan uusi käyttäjä tietokantaan
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

// ✅ Kirjautumisreitti
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Tarkistetaan kenttien täyttö
  if (!email || !password) {
    return res.status(400).json({ message: 'Täytä molemmat kentät' });
  }

  // Haetaan käyttäjä tietokannasta sähköpostin perusteella
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Tietokantavirhe' });
    }

    // Jos käyttäjää ei löydy, ilmoitetaan virheestä
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Virheellinen sähköposti tai salasana' });
    }

    // Verrataan annettua salasanaa tallennettuun hashattuun salasanaan
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Virheellinen sähköposti tai salasana' });
    }

    // Kirjautuminen onnistui
    res.status(200).json({
      message: 'Kirjautuminen onnistui',
      username: user.username,
      id: user.id
    });
  });
});

// ✅ Uuden tehtävän lisääminen
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

// ✅ Käyttäjän tehtävien haku
app.get('/tasks/:userId', (req, res) => {
  const { userId } = req.params;

  db.all('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, tasks) => {
    if (err) {
      return res.status(500).json({ message: 'Tietokantavirhe' });
    }

    res.status(200).json({ tasks });
  });
});

// ✅ Tehtävän poistaminen
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

// ✅ Tehtävän muokkaaminen
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

// ✅ Palvelimen käynnistys
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
