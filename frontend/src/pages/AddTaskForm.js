// Tuodaan React ja käytetään useState-hookia lomakkeen tilan hallintaan
import React, { useState } from 'react';

// Komponentti vastaanottaa propsit: onTaskAdded (callback) ja editingTask (muokattava tehtävä, jos sellainen on)
function AddTaskForm({ onTaskAdded, editingTask }) {
  // Alustetaan lomakekenttien tilat, jos muokataan, käytetään olemassa olevia tietoja
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [message, setMessage] = useState(''); // Käytetään palautteen näyttämiseen

  // Lomakkeen lähetyskäsittelijä
  const handleSubmit = async (e) => {
    e.preventDefault(); // Estetään sivun uudelleenlataus

    // Haetaan käyttäjätiedot localStoragesta
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return; // Ei käyttäjää -> lopetetaan

    // Määritetään endpoint ja HTTP-metodi sen mukaan, onko kyseessä muokkaus vai uusi tehtävä
    const endpoint = editingTask
      ? `/api/tasks/update/${editingTask.id}` // Muokkausreitti
      : `/api/tasks`;                         // Uusi tehtävä

    const method = editingTask ? 'PUT' : 'POST';

    // Lähetetään pyyntö palvelimelle
    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        title,
        description
      })
    });

    const data = await res.json();

    if (res.ok) {
      // Onnistunut lisäys tai muokkaus
      setMessage(editingTask ? 'Tehtävä päivitetty!' : 'Tehtävä lisätty!');
      setTitle('');         // Tyhjennetään kentät
      setDescription('');
      onTaskAdded();        // Ilmoitetaan vanhemmalle komponentille, että tehtävä lisättiin/muokattiin
    } else {
      // Näytetään virheviesti
      setMessage(data.message || 'Virhe tallennuksessa.');
    }
  };

  return (
    <div>
      <h3>{editingTask ? 'Muokkaa tehtävää' : 'Lisää uusi tehtävä'}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Otsikko"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        /><br />
        <textarea
          placeholder="Kuvaus"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br />
        <button type="submit">{editingTask ? 'Tallenna' : 'Lisää tehtävä'}</button>
      </form>
      <p>{message}</p> {/* Näytetään viesti käyttäjälle */}
    </div>
  );
}

export default AddTaskForm;
