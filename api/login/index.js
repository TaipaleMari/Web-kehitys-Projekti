const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

module.exports = async function (context, req) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    context.res = {
      status: 400,
      body: { message: 'Sähköposti ja salasana vaaditaan.' }
    };
    return;
  }

  const dbPath = path.join(__dirname, '..', '..', 'backend', 'database.db');
  const db = new sqlite3.Database(dbPath);

  const getUser = () =>
    new Promise((resolve, reject) => {
      db.get(
        'SELECT id, username, email, password FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

  try {
    const user = await getUser();
    db.close();

    if (!user) {
      context.res = {
        status: 401,
        body: { message: 'Virheellinen sähköposti tai salasana.' }
      };
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      context.res = {
        status: 401,
        body: { message: 'Virheellinen sähköposti tai salasana.' }
      };
      return;
    }

    context.res = {
      status: 200,
      body: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { message: 'Palvelinvirhe kirjautumisen aikana.' }
    };
  }
};
