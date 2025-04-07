import React, { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message); // Virheviesti palvelimelta
      }
    } catch (error) {
      setMessage('Virhe yhteydessä palvelimeen');
    }
  };

  return (
    <div>
      <h2>Rekisteröidy</h2>
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
      <p>{message}</p>
    </div>
  );
}

