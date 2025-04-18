// Tuodaan SQLite3-tietokantakirjasto ja asetetaan se näyttämään virheilmoituksia
const sqlite3 = require('sqlite3').verbose();

// Tuodaan path-moduuli tiedostopolkujen käsittelyyn
const path = require('path');

// Azure Functionin pääfunktio
module.exports = async function (context, req) {
  // Otetaan pyynnön rungosta käyttäjänimi ja salasana
  const { username, password } = req.body || {};

  // Jos jompikumpi puuttuu, palautetaan virhe
  if (!username || !password) {
    context.res = {
      status: 400, // Bad Request
      body: { message: "Käyttäjätunnus ja salasana vaaditaan" }
    };
    return;
  }

  // Määritetään tietokantatiedoston polku
  const dbPath = path.join(__dirname, '../../backend/database.db');
  const db = new sqlite3.Database(dbPath); // Avataan yhteys tietokantaan

  // serialize takaa, että kyselyt ajetaan järjestyksessä
  db.serialize(() => {
    // Luodaan taulu, jos sitä ei ole olemassa
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`);

    // Tarkistetaan, onko käyttäjänimi jo olemassa
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) {
        // Jos tapahtuu virhe tietokantahaussa
        context.res = {
          status: 500, // Internal Server Error
          body: { message: "Virhe tietokannassa (haku)" }
        };
        return;
      }

      if (row) {
        // Jos käyttäjänimi on jo olemassa, palautetaan 409 Conflict
        context.res = {
          status: 409,
          body: { message: "Käyttäjänimi on jo käytössä" }
        };
      } else {
        // Lisätään uusi käyttäjä tietokantaan
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], function (err) {
          if (err) {
            context.res = {
              status: 500,
              body: { message: "Virhe käyttäjän tallennuksessa" }
            };
          } else {
            // Rekisteröinti onnistui
            context.res = {
              status: 200,
              body: { message: `Käyttäjä ${username} rekisteröity!` }
            };
          }
        });
      }
    });
  });

  // Suljetaan tietokantayhteys (huom: tämä voi sulkeutua ennen async-operaatioiden valmistumista!)
  db.close();
};

