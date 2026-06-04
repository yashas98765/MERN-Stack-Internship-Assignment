import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [verifyLink, setVerifyLink] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) return setError('All fields required')
    try {
      const res = await API.post('/auth/register', { name, email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      if (res.data.verifyLink) setVerifyLink(res.data.verifyLink)
      nav('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="auth card">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div className="form-field">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        </div>
        <div className="form-field">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div className="form-field">
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn" type="submit" aria-label="Register"><i className="fa fa-user-plus icon" aria-hidden="true"></i>Register</button>
          <Link className="btn secondary" to="/login" style={{textDecoration:'none',display:'inline-flex',alignItems:'center'}} aria-label="Login">Login</Link>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
      {verifyLink && <p>Verification link (demo): <a href={verifyLink}>{verifyLink}</a></p>}
    </div>
  )
}
