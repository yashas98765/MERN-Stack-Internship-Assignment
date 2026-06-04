import React, { useState } from 'react'
import API from '../api'

export default function Forgot() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [link, setLink] = useState('')
  const [serverErrors, setServerErrors] = useState([])

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      setServerErrors([])
      const res = await API.post('/auth/forgot', { email })
      setMsg(res.data.message || 'If the email exists, you will receive a link')
      if (res.data.resetLink) setLink(res.data.resetLink)
    } catch (err) {
      const data = err.response?.data
      if (data?.errors && Array.isArray(data.errors)) setServerErrors(data.errors.map(e=>e.msg||JSON.stringify(e)))
      else setMsg(data?.message || 'Error')
    }
  }

  return (
    <div className="auth card">
      <h2>Forgot Password</h2>
      <form onSubmit={submit}>
        <div className="form-field">
          <input placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <button className="btn" type="submit">Send Reset Link</button>
      </form>
      {msg && <p style={{marginTop:8}}>{msg}</p>}
      {serverErrors.length>0 && (
        <div className="error">
          {serverErrors.map((m,i)=>(<div key={i}>{m}</div>))}
        </div>
      )}
      {link && <p>Reset Link (demo): <a href={link}>{link}</a></p>}
    </div>
  )
}
