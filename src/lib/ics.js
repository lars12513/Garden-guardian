import { createEvents } from 'ics'

export function buildICS(tasks, title='Garden Guardian') {
  const events = tasks.map(t => {
    const dt = new Date(t.due_at)
    return {
      title: `${t.plant_name}: ${t.type === 'water' ? 'Vanning' : 'Gjødsling'}`,
      start: [dt.getFullYear(), dt.getMonth()+1, dt.getDate(), 9, 0],
      duration: { hours: 1 },
      description: t.note || '',
    }
  })
  const { error, value } = createEvents(events)
  if (error) throw error
  return value
}
