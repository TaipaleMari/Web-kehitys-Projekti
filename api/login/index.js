const sqlite3 = require('sqlite3').verbose();
const path = require('path');

module.exports = async function (context, req) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    context.res = {
      status: 400,
      body: { message: "Sähköposti ja salasana vaaditaan" }
    };
    return;
  }

  const dbPath = path.join(__dirname, '../../backend/database.db');
  const db = new sqlite3.Database(dbPath);

  db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [email, password], (err, row) => {
    if (err) {
      context.res = {
        status: 500,
        body: { message: "Virhe kirjautuessa" }
      };
    } else if (row) {
      context.res = {
        status: 200,
        body: { username: row.username }
      };
    } else {
      context.res = {
        status: 401,
        body: { message: "Virheellinen kirjautuminen" }
      };
    }
    db.close();
  });
};

