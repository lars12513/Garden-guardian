import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function PlantModal({ plant, onClose, onChanged }) {
  const [info, setInfo] = useState(null)
  const [months, setMonths] = useState([])
  const [intervals, setIntervals] = useState({
    watering_interval_days: plant.watering_interval_days,
    fertilizing_interval_days: plant.fertilizing_interval_days
  })

  useEffect(() => {
    const load = async () => {
      const { data: i } = await supabase.from('plant_care_info').select('*').eq('plant_id', plant.plant_id).single()
      setInfo(i)
      const { data: m } = await supabase.from('plant_yearplan').select('*').eq('user_plant_id', plant.user_plant_id).order('month')
      setMonths(m || [])
    }
    load()
  }, [plant])

  const saveIntervals = async () => {
    await supabase
      .from('user_plants')
      .update(intervals)
      .eq('id', plant.user_plant_id)

    await supabase.rpc('recalculate_tasks_for_user_plant', { p_user_plant_id: plant.user_plant_id })
    onChanged?.()
    alert('Lagret!')
  }

  const toggleMonth = async (month, task, value) => {
    const existing = months.find(m => m.month === month && m.task === task)
    if (existing) {
      await supabase.from('plant_yearplan').update({ enabled: value }).eq('id', existing.id)
    }
    onChanged?.()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{plant.nickname || plant.plant_name}</h3>
          <button className="btn" onClick={onClose}>Lukk</button>
        </div>

        {info ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Stell</h4>
              <p className="text-sm whitespace-pre-wrap">{info.care_notes}</p>
              <h4 className="font-medium mt-4 mb-2">Skadegjørere & sykdom</h4>
              <p className="text-sm whitespace-pre-wrap">{info.pests_diseases}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Intervaller</h4>
              <label className="block text-sm mb-2">Vanning (dager)</label>
              <input className="input mb-3" type="number" min="1" value={intervals.watering_interval_days} onChange={e=>setIntervals(v=>({...v, watering_interval_days: Number(e.target.value)}))}/>
              <label className="block text-sm mb-2">Gjødsling (dager)</label>
              <input className="input mb-3" type="number" min="1" value={intervals.fertilizing_interval_days} onChange={e=>setIntervals(v=>({...v, fertilizing_interval_days: Number(e.target.value)}))}/>
              <button className="btn btn-primary" onClick={saveIntervals}>Lagre</button>

              <h4 className="font-medium mt-6 mb-2">Årshjul (Trondheim – rediger selv)</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {months.map(m => (
                  <label key={m.id} className="flex items-center gap-2">
                    <input type="checkbox" checked={m.enabled} onChange={e=>toggleMonth(m.month, m.task, e.target.checked)} />
                    <span>{monthName(m.month)} – {m.task}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : <p>Laster…</p>}
      </div>
    </div>
  )
}

function monthName(m) {
  return ['Jan','Feb','Mar','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Des'][m-1]
}
