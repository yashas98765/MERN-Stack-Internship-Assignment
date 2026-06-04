import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import API from '../api'

export default function Reset() {
  const [searchParams] = useSearchParams()
  const nav = useNavigate()
  const tokenFromQuery = searchParams.get('token')
  const [token, setToken] = useState(tokenFromQuery || '')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [serverErrors, setServerErrors] = useState([])

  useEffect(()=>{ if (tokenFromQuery) setToken(tokenFromQuery) }, [tokenFromQuery])

  const submit = async (e) => {
    e.preventDefault()
    try{
      setServerErrors([])
      await API.post('/auth/reset', { token, password })
      setMsg('Password reset successful')
      setTimeout(()=>nav('/login'),1500)
    } catch (err) {
      const data = err.response?.data
      if (data?.errors && Array.isArray(data.errors)) setServerErrors(data.errors.map(e=>e.msg||JSON.stringify(e)))
      else setMsg(data?.message || 'Reset failed')
    }
  }

  return (
    <div className="auth card">
      <h2>Reset Password</h2>
      <form onSubmit={submit}>
        <div className="form-field">
          <input placeholder="Reset token" value={token} onChange={e=>setToken(e.target.value)} />
        </div>
        <div className="form-field">
          <input placeholder="New password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn" type="submit">Reset Password</button>
      </form>
      {msg && <p style={{marginTop:8}}>{msg}</p>}
      {serverErrors.length>0 && (
        <div className="error">
          {serverErrors.map((m,i)=>(<div key={i}>{m}</div>))}
        </div>
      )}
    </div>
  )
}
