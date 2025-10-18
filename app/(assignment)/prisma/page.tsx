'use client'

import React, { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  lineStatus: string
}

export default function PrismaPage() {
  const [ormType, setOrmType] = useState<'prisma' | 'sequelize'>('prisma')
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  const appendLog = (msg: string) => {
    setLogs(prev => [...prev, new Date().toLocaleTimeString() + ' - ' + msg])
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/users?orm=${ormType}`)
      if (!res.ok) {
        const err = await res.text()
        setError('Backend Error: ' + err)
        appendLog('Error: ' + err)
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        setUsers(data)
        setError('')
        appendLog('Loaded users successfully')
      } else {
        setUsers([])
        appendLog('No valid user data returned')
      }
    } catch (err: any) {
      setError('Error fetching users: ' + err.message)
      appendLog('Fetch error: ' + err.message)
    }
  }

  const addUser = async () => {
    if (!newUser.trim()) {
      appendLog('Please enter a name')
      return
    }
    try {
      const res = await fetch(`/api/users?orm=${ormType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUser })
      })
      if (res.ok) {
        setNewUser('')
        appendLog('User added: ' + newUser)
        fetchUsers()
      } else {
        const err = await res.text()
        appendLog('Add failed: ' + err)
      }
    } catch (err: any) {
      appendLog('Add user error: ' + err.message)
    }
  }

  const toggleStatus = async (id: number) => {
    try {
      const res = await fetch(`/api/users/${id}/toggle?orm=${ormType}`, { method: 'PATCH' })
      if (res.ok) {
        appendLog('Toggled user status')
        fetchUsers()
      } else {
        appendLog('Toggle failed')
      }
    } catch (err: any) {
      appendLog('Toggle error: ' + err.message)
    }
  }

  const deleteUser = async (id: number) => {
    try {
      const res = await fetch(`/api/users/${id}?orm=${ormType}`, { method: 'DELETE' })
      if (res.ok) {
        appendLog('User deleted: ' + id)
        fetchUsers()
      } else {
        appendLog('Delete failed')
      }
    } catch (err: any) {
      appendLog('Delete error: ' + err.message)
    }
  }

  const commitToGitHub = async () => {
    try {
      const res = await fetch(`/api/orm/commit?orm=${ormType}`, { method: 'POST' })
      const data = await res.json()
      if (data.success) appendLog('Commit success: ' + ormType)
      else appendLog('Commit failed: ' + data.message)
    } catch (err: any) {
      appendLog('Commit error: ' + err.message)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [ormType])

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>Prisma / Sequelize Automation</h1>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label>
          <input type="radio" checked={ormType === 'prisma'} onChange={() => setOrmType('prisma')} /> Prisma
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input type="radio" checked={ormType === 'sequelize'} onChange={() => setOrmType('sequelize')} /> Sequelize
        </label>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter user name"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          style={{
            padding: '8px',
            width: '250px',
            border: '2px solid #999',
            borderRadius: '5px',
            marginRight: '10px'
          }}
        />
        <button
          onClick={addUser}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Add User
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', border: '1px solid red', padding: '8px', marginBottom: '15px', borderRadius: '5px' }}>
          {error}
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{u.name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{u.lineStatus}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <button onClick={() => toggleStatus(u.id)} style={{ color: '#007bff', marginRight: '10px' }}>
                    Toggle
                  </button>
                  <button onClick={() => deleteUser(u.id)} style={{ color: 'red' }}>
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

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={commitToGitHub}
          style={{
            padding: '8px 20px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Commit to GitHub
        </button>
      </div>

      <div
        style={{
          backgroundColor: '#fafafa',
          border: '1px solid #ccc',
          padding: '10px',
          marginTop: '20px',
          height: '200px',
          overflowY: 'auto',
          borderRadius: '5px'
        }}
      >
        <strong>Logs:</strong>
        <div style={{ whiteSpace: 'pre-line' }}>{logs.join('\n')}</div>
      </div>
    </div>
  )
}