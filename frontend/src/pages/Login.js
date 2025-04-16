import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Lisätään tämä import

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [viesti, setViesti] = useState('');
  const navigate = useNavigate(); // Alustetaan navigate

  const kirjaudu = async (e) => {
    e.preventDefault();

    // Muutetaan URL niin, että se osoittaa Azure Functions APIin
    const res = await fetch('/api/login', { // Käytämme relatiivista polkua /api/login
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setViesti(`Tervetuloa, ${data.username}!`);
      localStorage.setItem('user', JSON.stringify(data)); // Tallenna käyttäjän tiedot localStorageen
      setIsAuthenticated(true); // Aseta autentikointitila
      navigate('/dashboard'); // Ohjaa dashboardille
    } else {
      setViesti(data.message); // Näytä virheilmoitus, jos kirjautuminen ei onnistu
    }
  };

  return (
    <div>
      <h2>Kirjaudu sisään</h2>
      <form onSubmit={kirjaudu}>
        <input
          type="email"
          placeholder="Sähköposti"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Kirjaudu</button>
      </form>

      <p>{viesti}</p> {/* Näytetään virheilmoitus tai tervetuloviesti */}
    </div>
  );
}



