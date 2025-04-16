import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function UserDashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ id: null, title: '', description: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsername(parsedUser.username || 'Käyttäjä');
        setUserId(parsedUser.id);
        fetchTasks(parsedUser.id);
      } catch {
        setUsername('Käyttäjä');
      }
    }
  }, [navigate]);

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const endpoint = newTask.id
      ? `/api/tasks/update/${newTask.id}`
      : `/api/tasks`;

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
          setTasks(tasks.map((t) => (t.id === newTask.id ? { ...t, ...newTask } : t)));
        } else {
          const addedTask = {
            id: data.taskId,
            title: newTask.title,
            description: newTask.description
          };
          setTasks([...tasks, addedTask]);
        }
        setNewTask({ id: null, title: '', description: '' });
      } else {
        alert(data.message || 'Virhe tehtävän tallennuksessa.');
      }
    } catch (error) {
      alert('Yhteysvirhe palvelimeen.');
    }
  };

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
      <button className="logout-btn" onClick={handleLogout}>Kirjaudu ulos</button>
    </div>
  );
}

export default UserDashboard;
