import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import PlantModal from './PlantModal'
import { buildICS } from '../lib/ics'

export default function Dashboard({ session }) {
  const [plants, setPlants] = useState([])
  const [tasks, setTasks] = useState([])
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data: userPlants } = await supabase
        .from('user_plants_view')
        .select('*')
        .order('created_at', { ascending: true })

      setPlants(userPlants || [])

      const { data: t } = await supabase.rpc('get_upcoming_tasks', { days_ahead: 30 })
      setTasks(t || [])
      setLoading(false)
    }
    load()
  }, [])

  const nextByPlantId = useMemo(() => {
    const map = new Map()
    tasks?.forEach(t => {
      if (!map.has(t.user_plant_id)) map.set(t.user_plant_id, t)
    })
    return map
  }, [tasks])

  const waterNow = async (userPlantId) => {
    await supabase.rpc('log_event', { p_user_plant_id: userPlantId, p_type: 'water' })
    refresh()
  }
  const fertilizeNow = async (userPlantId) => {
    await supabase.rpc('log_event', { p_user_plant_id: userPlantId, p_type: 'fertilize' })
    refresh()
  }

  const refresh = async () => {
    const { data: t } = await supabase.rpc('get_upcoming_tasks', { days_ahead: 30 })
    setTasks(t || [])
  }

  const registerPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Nettleseren støtter ikke push')
      return
    }
    const reg = await navigator.serviceWorker.ready
    const vapid = import.meta.env.VITE_VAPID_PUBLIC_KEY
    const sub = await reg.pushManager.subscribe({
      applicationServerKey: urlBase64ToUint8Array(vapid),
      userVisibleOnly: true
    })
    const { error } = await fetch(`/functions/v1/webpush-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub, user_id: session.user.id })
    })
    if (error) console.error(error)
    alert('Push-varsler aktivert!')
  }

  const exportICS = async () => {
    const { data: upcoming } = await supabase.rpc('get_upcoming_tasks', { days_ahead: 60 })
    const ics = buildICS(upcoming || [])
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'garden-guardian.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button className="btn" onClick={registerPush}>Aktiver push-varsler</button>
        <button className="btn" onClick={exportICS}>Eksporter til ICS</button>
        <a className="btn" href="/functions/v1/ics-export" target="_blank" rel="noreferrer">Kalenderfeed (URL)</a>
      </div>

      {loading ? <p>Laster…</p> : null}

      <div className="grid md:grid-cols-2 gap-4">
        {plants?.map(p => (
          <div key={p.user_plant_id} className="card flex flex-col md:flex-row items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-medium">{p.nickname || p.plant_name}</h3>
                <span className="badge">{p.location || 'Ute'}</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3">{p.variety || ''}</p>
              <div className="text-sm mb-3">
                <strong>Vanning:</strong> hver {p.watering_interval_days} dag(er) •{' '}
                <strong>Gjødsling:</strong> hver {p.fertilizing_interval_days} dag(er)
              </div>
              <div className="text-sm mb-3">
                <em>Neste:</em> {nextByPlantId.get(p.user_plant_id)?.due_at?.slice(0, 10) || '—'} · {nextByPlantId.get(p.user_plant_id)?.type === 'fertilize' ? 'Gjødsling' : 'Vanning'}
              </div>
              <div className="flex gap-2">
                <button className="btn btn-primary" onClick={() => waterNow(p.user_plant_id)}>Vannet nå</button>
                <button className="btn" onClick={() => fertilizeNow(p.user_plant_id)}>Gjødslet nå</button>
                <button className="btn" onClick={() => setActive(p)}>Info & årshjul</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {active ? <PlantModal plant={active} onClose={() => setActive(null)} onChanged={refresh}/> : null}
    </div>
  )
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
