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

// Rekisteröintireitti
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Täytä kaikki kentät' });
    }

    // Tarkistetaan, onko käyttäjänimi tai sähköposti jo käytössä
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Tietokantavirhe' });
        }

        if (user) {
            return res.status(400).json({ message: 'Käyttäjänimi tai sähköposti on jo käytössä' });
        }

        // Salataan salasana
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Salauksen epäonnistuminen' });
            }

            // Tallennetaan käyttäjä tietokantaan
            db.run(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Rekisteröinti epäonnistui' });
                    }
                    res.status(201).json({ message: 'Käyttäjä rekisteröity!' });
                }
            );
        });
    });
});

// Palvelimen käynnistys
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

