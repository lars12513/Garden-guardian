import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')

  const sendLink = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('Sjekk e-post for magisk innloggingslenke 👍')
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-xl font-medium mb-4">Logg inn</h2>
      <form onSubmit={sendLink} className="space-y-3">
        <input className="input" type="email" placeholder="din@epost.no" value={email} onChange={e=>setEmail(e.target.value)} required />
        <button className="btn btn-primary w-full" type="submit">Send magisk lenke</button>
      </form>
    </div>
  )
}
