import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AddPlantForm({ open, onClose, session, onCreated }) {
  const [plants, setPlants] = useState([])
  const [form, setForm] = useState({
    plant_id: '',
    nickname: '',
    variety: '',
    location: '',
    watering_interval_days: 3,
    fertilizing_interval_days: 30,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    const load = async () => {
      const { data } = await supabase.from('plants').select('*').order('name')
      setPlants(data || [])
    }
    load()
  }, [open])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.plant_id) return alert('Velg planteslag')
    setSaving(true)
    const { error } = await supabase.from('user_plants').insert({
      user_id: session.user.id,
      plant_id: Number(form.plant_id),
      nickname: form.nickname || null,
      variety: form.variety || null,
      location: form.location || null,
      watering_interval_days: Number(form.watering_interval_days) || 3,
      fertilizing_interval_days: Number(form.fertilizing_interval_days) || 30,
    })
    setSaving(false)
    if (error) return alert(error.message)
    onCreated?.()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Legg til plante</h3>
          <button className="btn" onClick={onClose}>Lukk</button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Planteslag</label>
            <select
              className="input"
              value={form.plant_id}
              onChange={(e)=>setForm(f=>({ ...f, plant_id: e.target.value }))}
              required
            >
              <option value="">Velg…</option>
              {plants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Kallenavn (valgfritt)</label>
              <input className="input" value={form.nickname} onChange={e=>setForm(f=>({ ...f, nickname: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Sort (valgfritt)</label>
              <input className="input" value={form.variety} onChange={e=>setForm(f=>({ ...f, variety: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Plassering (f.eks. Inne, Balkong, Bed 1)</label>
            <input className="input" value={form.location} onChange={e=>setForm(f=>({ ...f, location: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Vanning (dager)</label>
              <input type="number" min="1" className="input" value={form.watering_interval_days}
                     onChange={e=>setForm(f=>({ ...f, watering_interval_days: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Gjødsling (dager)</label>
              <input type="number" min="1" className="input" value={form.fertilizing_interval_days}
                     onChange={e=>setForm(f=>({ ...f, fertilizing_interval_days: e.target.value }))} />
            </div>
          </div>

          <button disabled={saving} className="btn btn-primary w-full" type="submit">
            {saving ? 'Lagrer…' : 'Legg til'}
          </button>
        </form>
      </div>
    </div>
  )
}
