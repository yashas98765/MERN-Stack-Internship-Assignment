import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('All fields required')
    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      nav('/dashboard')
    } catch (err) {
        const data = err.response?.data
        setError(data?.message || 'Login failed')
    }
  }

  return (
    <div className="auth card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div className="form-field">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div className="form-field">
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn" type="submit" aria-label="Login"><i className="fa fa-right-to-bracket icon" aria-hidden="true"></i>Login</button>
            <Link className="btn secondary" to="/register" style={{textDecoration:'none',display:'inline-flex',alignItems:'center'}} aria-label="Register">Register</Link>
          </div>
      </form>
      {error && <p className="error">{error}</p>}
      <p><Link to="/forgot">Forgot password?</Link></p>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  )
}
