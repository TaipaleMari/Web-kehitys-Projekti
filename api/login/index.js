// Tuodaan sqlite3-tietokantakirjasto ja asetetaan verbose-tila virheilmoituksille
const sqlite3 = require('sqlite3').verbose();

// Node.js:n path-moduuli tiedostopolkujen hallintaan
const path = require('path');

// Azure Functionin pääfunktio (asynkroninen, koska käytetään mahdollisesti asynkronisia toimintoja)
module.exports = async function (context, req) {
  // Haetaan pyynnön rungosta sähköposti ja salasana
  const { email, password } = req.body || {};

  // Tarkistetaan että molemmat kentät on annettu
  if (!email || !password) {
    context.res = {
      status: 400, // Bad Request
      body: { message: "Sähköposti ja salasana vaaditaan" }
    };
    return;
  }

  // Määritetään tietokannan polku suhteessa tiedoston sijaintiin
  const dbPath = path.join(__dirname, '../../backend/database.db');
  const db = new sqlite3.Database(dbPath); // Avataan yhteys tietokantaan

  // Haetaan käyttäjä tietokannasta käyttäjänimellä ja salasanalla
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [email, password], (err, row) => {
    if (err) {
      // Virhe tietokantakyselyssä
      context.res = {
        status: 500, // Internal Server Error
        body: { message: "Palvelinvirhe tietokannassa" }
      };
    } else if (row) {
      // Käyttäjä löytyi -> palautetaan OK ja käyttäjätiedot
      context.res = {
        status: 200,
        body: { username: row.username }
      };
    } else {
      // Käyttäjää ei löytynyt -> virheellinen tunnistus
      context.res = {
        status: 401, // Unauthorized
        body: { message: "Virheellinen kirjautuminen" }
      };
    }

    // Suljetaan tietokantayhteys
    db.close();
  });
};

