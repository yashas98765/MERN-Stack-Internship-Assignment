import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import API from '../api'

export default function Verify(){
  const [searchParams] = useSearchParams()
  const nav = useNavigate()
  const token = searchParams.get('token')
  const [msg,setMsg] = useState('')

  useEffect(()=>{
    if (!token) return setMsg('No token provided')
    (async ()=>{
      try{
        const res = await API.post('/auth/verify',{ token })
        setMsg(res.data.message)
        setTimeout(()=>nav('/login'),1500)
      }catch(err){
        setMsg(err.response?.data?.message || 'Verification failed')
      }
    })()
  },[token])

  return (
    <div className="container" style={{maxWidth:600, marginTop:40}}>
      <div className="card">
        <h3>Email verification</h3>
        <p>{msg}</p>
      </div>
    </div>
  )
}
