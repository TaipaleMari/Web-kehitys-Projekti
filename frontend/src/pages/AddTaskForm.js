import React, { useState } from 'react';

function AddTaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
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
      setMessage('Tehtävä lisätty!');
      setTitle('');
      setDescription('');
      onTaskAdded(); // päivitetään tehtävälista tarvittaessa
    } else {
      setMessage(data.message || 'Virhe tehtävän lisäyksessä.');
    }
  };

  return (
    <div>
      <h3>Lisää uusi tehtävä</h3>
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
        <button type="submit">Lisää tehtävä</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default AddTaskForm;
