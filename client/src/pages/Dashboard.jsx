import React, { useEffect, useState } from 'react'
import API from '../api'

function TaskItem({ t, onDelete, onToggle, onEdit }) {
  return (
    <div className={`task ${t.status}`}>
      <h4>{t.title}</h4>
      <p>{t.description}</p>
      <div className="actions">
        <button onClick={() => onToggle(t._id)}>{t.status === 'pending' ? 'Complete' : 'Uncomplete'}</button>
        <button onClick={() => onEdit(t)}>Edit</button>
        <button onClick={() => onDelete(t._id)}>Delete</button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks')
      setTasks(res.data)
    } catch (err) {
      setError('Could not fetch tasks')
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) {
        await API.put(`/tasks/${editing._id}`, { title, description })
        setEditing(null)
      } else {
        await API.post('/tasks', { title, description })
      }
      setTitle('')
      setDescription('')
      fetchTasks()
    } catch (err) {
      setError('Save failed')
    }
  }

  const onDelete = async (id) => {
    await API.delete(`/tasks/${id}`)
    fetchTasks()
  }

  const onToggle = async (id) => {
    await API.patch(`/tasks/${id}/toggle`)
    fetchTasks()
  }

  const onEdit = (t) => {
    setEditing(t)
    setTitle(t.title)
    setDescription(t.description)
  }

  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <div className="dashboard">
      <div className="top">
        <h2>My Tasks</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <form onSubmit={submit} className="task-form">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="tasks">
        {tasks.length === 0 && <p>No tasks yet</p>}
        {tasks.map((t) => (
          <TaskItem key={t._id} t={t} onDelete={onDelete} onToggle={onToggle} onEdit={onEdit} />
        ))}
      </div>
    </div>
  )
}
