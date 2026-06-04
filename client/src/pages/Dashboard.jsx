import React, { useEffect, useState } from 'react'
import API from '../api'

function TaskItem({ t, onDelete, onToggle, onEdit }) {
  return (
    <div className={`task ${t.status}`}>
      <div className="row">
        <div>
          <h4>{t.title}</h4>
          <div className="meta">{new Date(t.createdAt).toLocaleString()}</div>
        </div>
        <div>
          <span className={t.status === 'completed' ? 'completed-indicator' : 'meta'} aria-label={`Status: ${t.status}`}>{t.status}</span>
        </div>
      </div>
      {t.description && <p style={{marginTop:8}}>{t.description}</p>}
      <div className="actions">
        <button className="btn-icon" onClick={() => onToggle(t._id)} aria-label={t.status === 'pending' ? 'Mark as complete' : 'Mark as pending'}><i className={`fa ${t.status === 'pending' ? 'fa-check' : 'fa-undo'} icon`} aria-hidden="true"></i>{t.status === 'pending' ? 'Complete' : 'Uncomplete'}</button>
        <button className="btn-icon" onClick={() => onEdit(t)} aria-label="Edit task"><i className="fa fa-edit icon" aria-hidden="true"></i>Edit</button>
        <button className="btn-icon" onClick={() => onDelete(t._id)} aria-label="Delete task"><i className="fa fa-trash icon" aria-hidden="true"></i>Delete</button>
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
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks', { params: { q, page, limit } })
      setTasks(res.data)
      // naive total estimation (could be returned by API)
      setTotal(res.data.length)
    } catch (err) {
      setError('Could not fetch tasks')
    }
  }

  useEffect(() => { fetchTasks() }, [q, page])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!title) return setError('Title is required')
    try {
      if (editing) {
        await API.put(`/tasks/${editing._id}`, { title, description })
        setEditing(null)
        setMessage('Task updated')
      } else {
        await API.post('/tasks', { title, description })
        setMessage('Task created')
      }
      setTitle('')
      setDescription('')
      fetchTasks()
      setTimeout(()=>setMessage(''),2500)
    } catch (err) {
      setError('Save failed')
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    await API.delete(`/tasks/${id}`)
    setMessage('Task deleted')
    fetchTasks()
    setTimeout(()=>setMessage(''),2500)
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
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const pages = Math.max(1, Math.ceil(total / limit))

  return (
    <div>
      <div className="dashboard-head">
        <h2>My Tasks</h2>
        <div className="controls">
          <input className="search" placeholder="Search tasks..." aria-label="Search tasks" value={q} onChange={(e)=>{setQ(e.target.value); setPage(1)}} />
          <select className="select" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button className="btn secondary" onClick={logout} aria-label="Logout"><i className="fa fa-sign-out-alt icon" aria-hidden="true"></i>Logout</button>
        </div>
      </div>

      <div className="card">
        <form onSubmit={submit} className="task-form" aria-label="Add or edit task form">
          <input aria-label="Task title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input aria-label="Task description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className="btn" type="submit" aria-label={editing ? 'Update task' : 'Add task'}>
            <i className="fa fa-plus icon" aria-hidden="true"></i>{editing ? 'Update' : 'Add'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {message && <p style={{color:'var(--success)'}}>{message}</p>}
        <div className="tasks" role="list" aria-label="Task list">
          {tasks.length === 0 && <p>No tasks yet</p>}
          {tasks.filter(t=> statusFilter? t.status===statusFilter : true).map((t) => (
            <TaskItem key={t._id} t={t} onDelete={onDelete} onToggle={onToggle} onEdit={onEdit} />
          ))}
        </div>
        <div className="pagination" role="navigation" aria-label="Pagination">
          <button className="page-btn" aria-label="Previous page" onClick={()=>setPage(p=>Math.max(1,p-1))}><i className="fa fa-chevron-left"></i></button>
          {[...Array(pages)].map((_,i)=>(
            <button key={i} className={`page-btn ${i+1===page? 'active': ''}`} aria-label={`Page ${i+1}`} onClick={()=>setPage(i+1)}>{i+1}</button>
          ))}
          <button className="page-btn" aria-label="Next page" onClick={()=>setPage(p=>Math.min(pages,p+1))}><i className="fa fa-chevron-right"></i></button>
        </div>
      </div>
    </div>
  )
}
