
import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Unable to load users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setMessage('Backend connection failed. Please start your server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setMessage('Please enter both name and email.');
      return;
    }

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage(editingId ? 'User updated successfully!' : 'User added successfully!');
      setName('');
      setEmail('');
      setEditingId(null);
      await fetchUsers();
    } catch (error) {
      setMessage(error.message || 'Something went wrong.');
    }
  };

  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setEditingId(user.id);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage('User deleted successfully!');
      await fetchUsers();
    } catch (error) {
      setMessage(error.message || 'Unable to delete user.');
    }
  };

  const cancelEdit = () => {
    setName('');
    setEmail('');
    setEditingId(null);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">U</div>
          <span>User<span className="brand-light">Space</span></span>
        </div>

        <p className="nav-heading">MENU</p>
        <div className="nav-item active">
          <span>▦</span> Dashboard
        </div>
        <div className="nav-item">
          <span>♙</span> User Management
        </div>

        <div className="sidebar-bottom">
          <div className="profile-avatar">Y</div>
          <div>
            <strong>Administrator</strong>
            <small>Project Admin</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back! Here's your user overview.</p>
          </div>
          <div className="topbar-right">
            <span className="status-dot"></span>
            Backend connected
          </div>
        </header>

        <section className="welcome-banner">
          <div>
            <span className="eyebrow">USER MANAGEMENT SYSTEM</span>
            <h1>Manage your users<br />with ease.</h1>
            <p>Add, update and manage all your users from one place.</p>
          </div>
          <div className="banner-art">✦</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon blue">♙</span>
            <p>Total Users</p>
            <h2>{users.length}</h2>
            <small>Registered users</small>
          </div>

          <div className="stat-card">
            <span className="stat-icon green">✓</span>
            <p>System Status</p>
            <h2 className="online-text">Active</h2>
            <small>Application running</small>
          </div>

          <div className="stat-card">
            <span className="stat-icon purple">⌘</span>
            <p>API Status</p>
            <h2 className="online-text">Connected</h2>
            <small>Express backend</small>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel users-panel">
            <div className="panel-heading">
              <div>
                <h3>All Users</h3>
                <p>Manage your registered users</p>
              </div>
              <button className="refresh-btn" onClick={fetchUsers}>↻ Refresh</button>
            </div>

            {message && (
              <div className="message">{message}</div>
            )}

            {loading ? (
              <p className="empty-state">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="empty-state">No users found. Add your first user!</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>USER</th>
                      <th>EMAIL</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <strong>{user.name}</strong>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <div className="actions">
                            <button className="edit-btn" onClick={() => handleEdit(user)}>
                              Edit
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="panel form-panel">
            <div className="panel-heading">
              <div>
                <h3>{editingId ? 'Edit User' : 'Add New User'}</h3>
                <p>{editingId ? 'Update user details' : 'Enter user details below'}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button className="primary-btn" type="submit">
                {editingId ? 'Update User' : '+ Add User'}
              </button>

              {editingId && (
                <button className="cancel-btn" type="button" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </form>
          </div>
        </section>

        <footer>
          © 2026 UserSpace. Built with React and Express.
        </footer>
      </main>
    </div>
  );
}

export default App;
