import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import Dashboard from './Dashboard'
import Login from './Login'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub?.subscription?.unsubscribe()
  }, [])

  return (
    <div className="container py-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Garden Guardian</h1>
        {session ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">{session.user.email}</span>
            <button className="btn" onClick={() => supabase.auth.signOut()}>Logg ut</button>
          </div>
        ) : null}
      </header>
      {session ? <Dashboard session={session}/> : <Login/>}
      <footer className="mt-10 text-sm text-neutral-500">
        Bygd for Trondheim – alle månedspunkter kan redigeres.
      </footer>
    </div>
  )
}
