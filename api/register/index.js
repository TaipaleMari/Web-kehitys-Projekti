const sqlite3 = require('sqlite3').verbose();
const path = require('path');

module.exports = async function (context, req) {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      context.res = {
        status: 400,
        body: { message: "Käyttäjänimi ja salasana vaaditaan" }
      };
      return;
    }

    const dbPath = path.join(__dirname, '../../backend/database.db');
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        context.res = {
          status: 500,
          body: { message: "Virhe avattaessa tietokantaa" }
        };
        return;
      }
    });

    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )`);

      db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) {
          context.res = {
            status: 500,
            body: { message: "Virhe tarkistaessa käyttäjän olemassaoloa" }
          };
          db.close();
          return;
        }

        if (row) {
          context.res = {
            status: 409,
            body: { message: "Käyttäjänimi on jo käytössä" }
          };
          db.close();
        } else {
          db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], function (err) {
            if (err) {
              context.res = {
                status: 500,
                body: { message: "Virhe luodessa käyttäjää" }
              };
            } else {
              context.res = {
                status: 201,
                body: { message: `Käyttäjä ${username} rekisteröity!` }
              };
            }
            db.close();
          });
        }
      });
    });
  } catch (error) {
    context.res = {
      status: 500,
      body: { message: "Odottamaton virhe palvelimella" }
    };
  }
};

