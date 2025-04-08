// db.js

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Tietokantaan yhdistäminen epäonnistui:', err);
  } else {
    console.log('Yhdistetty SQLite-tietokantaan.');

    // Käyttäjätaulu
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT
      )`,
      (err) => {
        if (err) {
          console.error('Taulun "users" luonti epäonnistui:', err);
        } else {
          console.log('Taulu "users" tarkistettu/luotu.');
        }
      }
    );

    // ✅ Tehtävätaulu
    db.run(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`,
      (err) => {
        if (err) {
          console.error('Taulun "tasks" luonti epäonnistui:', err);
        } else {
          console.log('Taulu "tasks" tarkistettu/luotu.');
        }
      }
    );
  }
});

// Tässä voit lisätä mahdollisesti muita tietokannan operaatioita (esim. sulkeminen).
// db.close();

module.exports = db;



