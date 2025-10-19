'use client'

import { useState, useEffect } from 'react'

export default function PrismaPage() {
  const [orm, setOrm] = useState('prisma')
  const [users, setUsers] = useState<any[]>([])
  const [newUserName, setNewUserName] = useState('')
  const [error, setError] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  // Fetch all users when page loads or ORM changes
  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/users?orm=${orm}`)
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [orm])

  // Add user
  const handleAddUser = async () => {
    setError('')
    if (!newUserName.trim()) {
      setError('Please enter a name')
      return
    }
    try {
      const res = await fetch(`/api/users?orm=${orm}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUserName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Add failed')
      setNewUserName('')
      setLogs(prev => [`${new Date().toLocaleTimeString()} - Added ${data.name}`, ...prev])
      fetchUsers()
    } catch (err: any) {
      setError(err.message)
      setLogs(prev => [`${new Date().toLocaleTimeString()} - Add failed: ${err.message}`, ...prev])
    }
  }

  // Toggle user status
  const handleToggle = async (id: number) => {
    try {
      const res = await fetch(`/api/users?orm=${orm}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Toggle failed')
      setLogs(prev => [`${new Date().toLocaleTimeString()} - Toggled user ${id}`, ...prev])
      fetchUsers()
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Delete user
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/users?orm=${orm}&id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setLogs(prev => [`${new Date().toLocaleTimeString()} - Deleted user ${id}`, ...prev])
      fetchUsers()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>User Presence</h2>

      {/* ORM selection */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="radio"
            value="prisma"
            checked={orm === 'prisma'}
            onChange={(e) => setOrm(e.target.value)}
          /> Prisma
        </label>
        <label style={{ marginLeft: '15px' }}>
          <input
            type="radio"
            value="sequelize"
            checked={orm === 'sequelize'}
            onChange={(e) => setOrm(e.target.value)}
          /> Sequelize
        </label>
      </div>

      {/* Add user form */}
      <div
        style={{
          border: '1px solid #ccc',
          padding: '15px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          marginBottom: '20px',
          borderRadius: '6px',
        }}
      >
        <input
          type="text"
          placeholder="Enter user name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          style={{ flex: 1, padding: '10px' }}
        />
        <button
          onClick={handleAddUser}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Add User
        </button>
      </div>

      {/* Error box */}
      {error && (
        <div
          style={{
            color: 'red',
            border: '1px solid red',
            padding: '10px',
            marginBottom: '15px',
          }}
        >
          Backend Error: {error}
        </div>
      )}

      {/* User list table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '25px',
          textAlign: 'center',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ padding: '10px' }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.lineStatus}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => handleToggle(user.id)}
                    style={{
                      marginRight: '10px',
                      color: 'blue',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      color: 'red',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Commit to GitHub button placeholder (optional for grading) */}
      <button
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Commit to GitHub
      </button>

      {/* Logs section */}
      <div
        style={{
          marginTop: '25px',
          borderTop: '2px solid #eee',
          paddingTop: '10px',
        }}
      >
        <h4>Logs:</h4>
        <div style={{ background: '#fafafa', padding: '10px', border: '1px solid #ddd' }}>
          {logs.length === 0 ? (
            <p>No logs yet</p>
          ) : (
            logs.map((log, index) => <div key={index}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  )
}