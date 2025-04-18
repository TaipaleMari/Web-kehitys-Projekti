// db.js

// Ladataan sqlite3-moduuli ja otetaan käyttöön verbose-tila, joka näyttää yksityiskohtaisempia virheilmoituksia.
const sqlite3 = require('sqlite3').verbose();

// Luodaan (tai avataan) tietokantatiedosto nimeltä 'database.db'
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    // Jos yhteys tietokantaan epäonnistuu, näytetään virhe
    console.error('Tietokantaan yhdistäminen epäonnistui:', err);
  } else {
    console.log('Yhdistetty SQLite-tietokantaan.');

    // Luodaan käyttäjätaulu, jos sitä ei vielä ole olemassa
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

    // Luodaan tehtävätaulu, jos sitä ei vielä ole olemassa
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

module.exports = db; // Viedään db-olio muiden tiedostojen käytettäväksi




