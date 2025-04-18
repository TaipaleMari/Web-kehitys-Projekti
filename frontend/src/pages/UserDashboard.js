// Tuodaan Reactin hookit ja navigointityökalu
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function UserDashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();

  // Tilamuuttujat käyttäjälle ja tehtäville
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ id: null, title: '', description: '' });

  // Tarkistetaan onko käyttäjä kirjautunut, ja haetaan tehtävät
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      // Jos ei käyttäjää, ohjataan kirjautumissivulle
      navigate('/login');
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser.username || 'Käyttäjä');
        setUserId(parsedUser.id);
        fetchTasks(parsedUser.id); // Haetaan käyttäjän tehtävät
      } catch {
        setUsername('Käyttäjä');
      }
    }
  }, [navigate]);

  // Hakee tehtävät palvelimelta
  const fetchTasks = async (userId) => {
    try {
      const response = await fetch(`/api/tasks/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setTasks(data.tasks || []);
      } else {
        alert(data.message || 'Virhe tehtävien lataamisessa.');
      }
    } catch (error) {
      alert('Yhteysvirhe palvelimeen.');
    }
  };

  // Kirjaa käyttäjän ulos
  const handleLogout = () => {
    localStorage.removeItem('user'); // Poistetaan käyttäjätiedot
    setIsAuthenticated(false); // Päivitetään kirjautumistila
    navigate('/login'); // Ohjataan kirjautumissivulle
  };

  // Lomakekenttien muutoskäsittelijä
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // Tallennetaan uusi tai muokattu tehtävä
  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return; // Tyhjää otsikkoa ei sallita

    // Määritetään oikea reitti ja metodi
    const endpoint = newTask.id
      ? `/api/tasks/update/${newTask.id}` // Muokkaus
      : `/api/tasks`;                    // Uusi

    const method = newTask.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: newTask.title,
          description: newTask.description
        })
      });

      const data = await response.json();
      if (response.ok) {
        if (newTask.id) {
          // Päivitetään olemassa oleva tehtävä listassa
          setTasks(tasks.map((t) => (t.id === newTask.id ? { ...t, ...newTask } : t)));
        } else {
          // Lisätään uusi tehtävä listaan
          const addedTask = {
            id: data.taskId,
            title: newTask.title,
            description: newTask.description
          };
          setTasks([...tasks, addedTask]);
        }
        // Tyhjennetään lomake
        setNewTask({ id: null, title: '', description: '' });
      } else {
        alert(data.message || 'Virhe tehtävän tallennuksessa.');
      }
    } catch (error) {
      alert('Yhteysvirhe palvelimeen.');
    }
  };

  // Poistaa tehtävän annetun ID:n perusteella
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/delete/${taskId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        alert(data.message || 'Virhe tehtävän poistamisessa.');
      }
    } catch (error) {
      alert('Yhteysvirhe palvelimeen.');
    }
  };

  // Asettaa lomakkeelle muokattavan tehtävän
  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setNewTask({ id: taskToEdit.id, title: taskToEdit.title, description: taskToEdit.description });
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Tervetuloa, {username}!</h2>
      <p>Alla ovat tämän päivän tehtäväsi:</p>

      {/* Tehtävälista */}
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <strong>{task.title}</strong><br />
            <small>{task.description}</small><br />
            <button onClick={() => handleEditTask(task.id)}>Muokkaa</button>
            <button onClick={() => handleDeleteTask(task.id)}>Poista</button>
          </li>
        ))}
      </ul>

      {/* Lomake uuden tehtävän lisäämiseksi tai olemassa olevan muokkaamiseksi */}
      <form onSubmit={handleSaveTask} className="task-form">
        <input
          type="text"
          name="title"
          placeholder="Tehtävän otsikko"
          value={newTask.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Kuvaus (valinnainen)"
          value={newTask.description}
          onChange={handleChange}
        />
        <button type="submit" className="add-task-btn">
          {newTask.id ? 'Tallenna muutokset' : '+ Lisää uusi tehtävä'}
        </button>
      </form>

      <br />
      {/* Uloskirjautumispainike */}
      <button className="logout-btn" onClick={handleLogout}>Kirjaudu ulos</button>
    </div>
  );
}

export default UserDashboard;

