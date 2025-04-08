import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function UserDashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser.username || 'Käyttäjä');
        setUserId(parsedUser.id);
        fetchTasks(parsedUser.id); // Hae käyttäjän tehtävät tietokannasta
      } catch {
        setUsername('Käyttäjä');
      }
    }
  }, [navigate]);

  // Haetaan käyttäjän tehtävät tietokannasta
  const fetchTasks = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setTasks(data.tasks); // Oletetaan, että palvelin palauttaa tehtävät
      } else {
        alert(data.message || 'Virhe tehtävien lataamisessa.');
      }
    } catch (error) {
      alert('Yhteysvirhe palvelimeen.');
    }
  };

  // Kirjaudutaan ulos
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Lomakkeen kenttien muutokset
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // Uuden tehtävän lisääminen
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title: newTask.title,
          description: newTask.description
        })
      });

      const data = await response.json();
      if (response.ok) {
        const addedTask = {
          id: data.taskId,
          title: newTask.title,
          description: newTask.description
        };
        setTasks([...tasks, addedTask]); // Lisää uusi tehtävä listaan
        setNewTask({ title: '', description: '' }); // Tyhjennä lomake
      } else {
        alert(data.message || 'Virhe tehtävän tallentamisessa.');
      }
    } catch (error) {
      alert('Yhteysvirhe palvelimeen.');
    }
  };

  // Tehtävän poistaminen
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId)); // Poistetaan tehtävä listasta
      } else {
        alert(data.message || 'Virhe tehtävän poistamisessa.');
      }
    } catch (error) {
      alert('Yhteysvirhe palvelimeen.');
    }
  };

  // Tehtävän muokkaaminen
  const handleEditTask = async (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setNewTask({ title: taskToEdit.title, description: taskToEdit.description });
      // Voit myös luoda muokkauslomakkeen erikseen, jos haluat muokata tehtäviä erikseen.
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Tervetuloa, {username}!</h2>
      <p>Alla ovat tämän päivän tehtäväsi:</p>

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

      <form onSubmit={handleAddTask} className="task-form">
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
        <button type="submit" className="add-task-btn">+ Lisää uusi tehtävä</button>
      </form>

      <br />
      <button className="logout-btn" onClick={handleLogout}>Kirjaudu ulos</button>
    </div>
  );
}

export default UserDashboard;




