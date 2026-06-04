import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Forgot from './pages/Forgot'
import Reset from './pages/Reset'
import Verify from './pages/Verify'

const Protected = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user?.name) setUserName(user.name)
    } catch (e) {}
  }, [])

  return (
    <div>
      <nav className="nav">
        <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',gap:16,alignItems:'center'}}>
            <div className="brand">MERN Task</div>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            {userName ? <div style={{color:'#cbd5e1'}}>Hi, {userName}</div> : <Link to="/login">Login</Link>}
          </div>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        </Routes>
      </div>
    </div>
  )
}
