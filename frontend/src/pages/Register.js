// Tuodaan React ja käytetään useState-hookia lomaketilan hallintaan
import React, { useState } from 'react';

export default function Register() {
  // Alustetaan lomakkeen kenttien tila
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Tila mahdolliselle viestille (onnistuminen/virhe)
  const [message, setMessage] = useState('');

  // Käsitellään kenttien muutokset ja päivitetään tila
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lomakkeen lähetys
  const handleSubmit = async (e) => {
    e.preventDefault(); // Estetään sivun uudelleenlataus

    try {
      // Lähetetään tiedot backendille (Azure Functions reitti esim. /api/register)
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Kerrotaan, että lähetetään JSON-dataa
        },
        body: JSON.stringify(formData), // Muutetaan lomaketiedot JSON-muotoon
      });

      // Vastauksen purku JSON-muotoon
      const data = await res.json();

      // Jos vastaus on ok (status 200-299), näytetään onnistumisviesti
      if (res.ok) {
        setMessage(data.message);
      } else {
        // Muussa tapauksessa näytetään virheviesti
        setMessage(data.message);
      }
    } catch (error) {
      // Jos fetch epäonnistuu (esim. ei yhteyttä palvelimeen)
      setMessage('Virhe yhteydessä palvelimeen');
    }
  };

  return (
    <div>
      <h2>Rekisteröidy</h2>
      {/* Lomake rekisteröitymistä varten */}
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Käyttäjänimi"
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Sähköposti"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Salasana"
          onChange={handleChange}
        />
        <button type="submit">Luo tili</button>
      </form>
      {/* Viesti käyttäjälle, esim. virhe tai onnistuminen */}
      <p>{message}</p>
    </div>
  );
}

