import React, { useEffect, useState } from 'react';
import './styles/style.css';

function Bienvenida() {
  // State to manage coffee menu items
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', size: '', milk_type: '', description: '' });
  const [editItem, setEditItem] = useState(null);

  // Fetch the coffee menu when the component mounts
  useEffect(() => {
    fetchMenu();
  }, []);

  // Fetch the coffee menu from the server
  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/crud.php');
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  // Handle creating a new coffee item
  const handleCreate = async (e) => {
    e.preventDefault();
    if (newItem.name && newItem.price && newItem.size && newItem.milk_type && newItem.description) {
      try {
        const response = await fetch('/api/crud.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });

        if (response.ok) {
          setNewItem({ name: '', price: '', size: '', milk_type: '', description: '' });
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
    if (editItem && editItem.name && editItem.price && editItem.size && editItem.milk_type && editItem.description) {
      try {
        const response = await fetch('/api/crud.php', {
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
      const response = await fetch(`/api/crud.php?id=${id}`, {
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
      <br />
      <p>Has iniciado sesión con éxito.</p>
      <div
        className="menu-container"
        style={{
          backgroundColor: '#f0f8ff',
          borderRadius: '20px',
          padding: '20px',
          maxWidth: '600px',
          margin: '0 auto',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ color: '#004080', marginBottom: '10px' }}>Coffee Menu</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {menu.map((item) => (
            <li
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '8px',
                border: '1px solid #b3d1ff',
                borderRadius: '20px',
                backgroundColor: '#e6f0ff',
              }}
            >
              <span style={{ color: '#003366' }}>
                {item.name} - ${item.price} | {item.size} | {item.milk_type} | {item.description}
              </span>
              <div>
                <button
                  onClick={() => setEditItem(item)}
                  style={{
                    marginRight: '8px',
                    backgroundColor: '#3399ff',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <h3 style={{ color: '#004080', marginTop: '20px' }}>
          {editItem ? 'Edit Coffee Item' : 'Agregar nuevo cafe'}
        </h3>
        <form onSubmit={editItem ? handleUpdate : handleCreate}>
          <input
            type="text"
            name="name"
            value={editItem ? editItem.name : newItem.name}
            onChange={handleInputChange}
            placeholder="Coffee Name"
            required
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '100%',
              borderRadius: '10px',
              border: '1px solid #a3c2f2',
            }}
          />
          <input
            type="number"
            name="price"
            value={editItem ? editItem.price : newItem.price}
            onChange={handleInputChange}
            placeholder="Price"
            required
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '100%',
              borderRadius: '10px',
              border: '1px solid #a3c2f2',
            }}
          />
          <input
            type="text"
            name="size"
            value={editItem ? editItem.size : newItem.size}
            onChange={handleInputChange}
            placeholder="Size"
            required
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '100%',
              borderRadius: '10px',
              border: '1px solid #a3c2f2',
            }}
          />
          <input
            type="text"
            name="milk_type"
            value={editItem ? editItem.milk_type : newItem.milk_type}
            onChange={handleInputChange}
            placeholder="Milk Type"
            required
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '100%',
              borderRadius: '10px',
              border: '1px solid #a3c2f2',
            }}
          />
          <input
            type="text"
            name="description"
            value={editItem ? editItem.description : newItem.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
            style={{
              padding: '10px',
              marginBottom: '10px',
              width: '100%',
              borderRadius: '10px',
              border: '1px solid #a3c2f2',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#0059b3',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            {editItem ? 'Update' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Bienvenida;
