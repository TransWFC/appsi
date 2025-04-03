import React, { useState, useEffect } from 'react';
import './styles/style.css';

function Bienvenida() {
  // State to manage coffee menu items
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [editItem, setEditItem] = useState(null);

  // Fetch the coffee menu when the component mounts
  useEffect(() => {
    fetchMenu();
  }, []);

  // Fetch the coffee menu from the server
  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  // Handle creating a new coffee item
  const handleCreate = async (e) => {
    e.preventDefault();
    if (newItem.name && newItem.price) {
      try {
        const response = await fetch('/api/menu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });

        if (response.ok) {
          setNewItem({ name: '', price: '' });
          fetchMenu();
        } else {
          console.error('Error creating coffee item');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Handle updating a coffee item
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (editItem && editItem.name && editItem.price) {
      try {
        const response = await fetch('/api/menu', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editItem),
        });

        if (response.ok) {
          setEditItem(null);
          fetchMenu();
        } else {
          console.error('Error updating coffee item');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Handle deleting a coffee item
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/menu?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMenu();
      } else {
        console.error('Error deleting coffee item');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle form changes for new and edited items
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editItem) {
      setEditItem({ ...editItem, [name]: value });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  return (
    <div className="bienvenida-page">
      <nav className="navbar">
        <span className="navbar-text">¡Te damos la bienvenida!</span>
      </nav>

      <div className="logo-container">
        <img src="/logoU.png" alt="Logo" className="logo-image" />
      </div>
      <br />
      <h1>¡Bienvenido!</h1>
      <br />
      <p>Has iniciado sesión con éxito.</p>

      <div className="menu-container">
        <h2>Coffee Menu</h2>
        <ul>
          {menu.map((item) => (
            <li key={item.id}>
              <span>{item.name} - ${item.price}</span>
              <button onClick={() => setEditItem(item)}>Edit</button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))}
        </ul>

        <h3>{editItem ? 'Edit Coffee Item' : 'Add New Coffee Item'}</h3>
        <form onSubmit={editItem ? handleUpdate : handleCreate}>
          <input
            type="text"
            name="name"
            value={editItem ? editItem.name : newItem.name}
            onChange={handleInputChange}
            placeholder="Coffee Name"
            required
          />
          <input
            type="number"
            name="price"
            value={editItem ? editItem.price : newItem.price}
            onChange={handleInputChange}
            placeholder="Price"
            required
          />
          <button type="submit">{editItem ? 'Update' : 'Add'}</button>
        </form>
      </div>
    </div>
  );
}

export default Bienvenida;
