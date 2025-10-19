'use client';
import { useEffect, useState } from 'react';

export default function PrismaPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState('');
  const [error, setError] = useState('');
  const [orm, setOrm] = useState('prisma');

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/users?orm=${orm}`);
      const data = await res.json();
      setUsers(data);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [orm]);

  // Add new user
  const addUser = async () => {
    if (!newUser) return;
    try {
      const res = await fetch(`/api/users?orm=${orm}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUser }),
      });
      if (res.ok) {
        setNewUser('');
        fetchUsers();
      } else {
        const errText = await res.text();
        setError(`Add failed: ${errText}`);
      }
    } catch (err) {
      setError('Error adding user');
    }
  };

  // Toggle user online/offline status
  const toggleStatus = async (id: number) => {
    try {
      const res = await fetch(`/api/users?orm=${orm}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const errText = await res.text();
        setError(`Toggle failed: ${errText}`);
      }
    } catch (err) {
      setError('Error toggling user');
    }
  };

  // Delete user with confirmation
  const deleteUser = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/users?orm=${orm}&id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const errText = await res.text();
        setError(`Delete failed: ${errText}`);
      }
    } catch (err) {
      setError('Error deleting user');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>User Presence</h3>

      {/* ORM selector */}
      <div>
        <label>
          <input
            type="radio"
            value="prisma"
            checked={orm === 'prisma'}
            onChange={() => setOrm('prisma')}
          />
          Prisma
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="radio"
            value="sequelize"
            checked={orm === 'sequelize'}
            onChange={() => setOrm('sequelize')}
          />
          Sequelize
        </label>
      </div>

      {/* Add user input */}
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter user name"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={addUser}
          style={{
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add User
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div
          style={{
            color: 'red',
            border: '1px solid red',
            padding: '8px',
            marginTop: '10px',
          }}
        >
          Backend Error: {error}
        </div>
      )}

      {/* User Table */}
      <table
        style={{
          marginTop: '20px',
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {user.lineStatus}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => toggleStatus(user.id)}
                    style={{
                      backgroundColor:
                        user.lineStatus === 'online' ? 'green' : '#888',
                      color: 'white',
                      padding: '5px 10px',
                      border: 'none',
                      borderRadius: '4px',
                      marginRight: '10px',
                      cursor: 'pointer',
                      transition: '0.3s',
                    }}
                  >
                    {user.lineStatus === 'online' ? 'Toggle ' : 'Toggle'}
                  </button>

                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '10px' }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Commit button
      <button
        onClick={() => alert('Auto commit to GitHub feature here')}
        style={{
          marginTop: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Commit to GitHub
      </button> */}
    </div>
  );
}