const sqlite3 = require('sqlite3').verbose();
const path = require('path');

module.exports = async function (context, req) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    context.res = {
      status: 400,
      body: { message: "Käyttäjätunnus ja salasana vaaditaan" }
    };
    return;
  }

  const dbPath = path.join(__dirname, '../../backend/database.db');
  const db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`);

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) {
        context.res = {
          status: 500,
          body: { message: "Virhe tietokannassa (haku)" }
        };
        return;
      }

      if (row) {
        context.res = {
          status: 409,
          body: { message: "Käyttäjänimi on jo käytössä" }
        };
      } else {
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function (err) {
          if (err) {
            context.res = {
              status: 500,
              body: { message: "Virhe käyttäjän tallennuksessa" }
            };
          } else {
            context.res = {
              status: 200,
              body: { message: `Käyttäjä ${username} rekisteröity!` }
            };
          }
        });
      }
    });
  });

  db.close();
};
