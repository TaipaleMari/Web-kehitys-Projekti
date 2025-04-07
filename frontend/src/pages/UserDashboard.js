import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Jos käyttäjää ei ole kirjautuneena, ohjataan takaisin kirjautumissivulle
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Poistetaan käyttäjätiedot localStoragesta ja asetetaan kirjautumisen tila
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');  // Ohjataan käyttäjä kirjautumissivulle
  };

  return (
    <div>
      <h2>Oma Dashboard</h2>
      <p>Tervetuloa, käyttäjä!</p>
      <button onClick={handleLogout}>Kirjaudu ulos</button>
    </div>
  );
}

export default UserDashboard;

