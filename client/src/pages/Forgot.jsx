import React, { useState } from 'react'
import API from '../api'

export default function Forgot() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [link, setLink] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const res = await API.post('/auth/forgot', { email })
      setMsg(res.data.message || 'If the email exists, you will receive a link')
      if (res.data.resetLink) setLink(res.data.resetLink)
    } catch (err) {
      setMsg('Error')
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
      {link && <p>Reset Link (demo): <a href={link}>{link}</a></p>}
    </div>
  )
}
