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
          (err) => {
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

    res.status(200).json({ message: 'Kirjautuminen onnistui', username: user.username });
  });
});

// Palvelimen käynnistys
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


