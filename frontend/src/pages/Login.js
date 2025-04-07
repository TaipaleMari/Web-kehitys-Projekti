import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Lisätään tämä import
// Link poistettu, koska käytämme navigate
export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [viesti, setViesti] = useState('');
  const navigate = useNavigate(); // Alustetaan navigate

  const kirjaudu = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/login', {
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
      setViesti(data.message);
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

      <p>{viesti}</p>
    </div>
  );
}



