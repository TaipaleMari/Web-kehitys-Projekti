import React, { useState } from 'react';

function AddTaskForm({ onTaskAdded, editingTask }) {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const endpoint = editingTask
      ? `/api/tasks/update/${editingTask.id}`
      : `/api/tasks`;

    const method = editingTask ? 'PUT' : 'POST';

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
      setMessage(editingTask ? 'Tehtävä päivitetty!' : 'Tehtävä lisätty!');
      setTitle('');
      setDescription('');
      onTaskAdded(); // päivitä tehtävälista
    } else {
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
      <p>{message}</p>
    </div>
  );
}

export default AddTaskForm;
