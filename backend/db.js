// db.js
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Tietokantaan yhdistäminen epäonnistui:', err);
    } else {
        console.log('Yhdistetty SQLite-tietokantaan.');

        // Luo taulu tarvittaessa
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                email TEXT UNIQUE,
                password TEXT
            )`,
            (err) => {
                if (err) {
                    console.error('Taulun luonti epäonnistui:', err);
                } else {
                    console.log('Taulu "users" tarkistettu/luotu.');
                }
            }
        );
    }
});

module.exports = db;

