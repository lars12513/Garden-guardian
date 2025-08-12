// supabase/functions/ics-export/index.ts
// Serves an ICS calendar feed for the authenticated user via magic link token
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import "https://deno.land/x/xhr@0.3.0/mod.ts"

function dtstamp(d: Date) {
  const pad = (n:number)=> String(n).padStart(2,'0')
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
}

serve(async (req) => {
  // Anonymous access allowed: user identified via JSON Web Token in header if present
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!)
  const auth = req.headers.get("Authorization") || ""
  const jwt = auth.startsWith("Bearer ") ? auth.slice(7) : null
  let user_id: string | null = null

  if (jwt) {
    // verify token by calling getUser
    const { data } = await supabase.auth.getUser(jwt)
    user_id = data.user?.id || null
  }

  // If no user, just say how to auth
  if (!user_id) {
    return new Response("Authorize this URL by opening it while logged inn in the app. The browser will attach the session token automatically.", { status: 200 })
  }

  // Gather upcoming 60 days tasks
  const { data: rows, error } = await supabase.rpc('get_upcoming_tasks', { days_ahead: 60 }, { headers: { Authorization: `Bearer ${jwt}` } })
  if (error) return new Response(error.message, { status: 500 })

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Garden Guardian//NO",
    "CALSCALE:GREGORIAN",
  ]

  for (const r of rows || []) {
    const dt = new Date(r.due_at)
    lines.push("BEGIN:VEVENT")
    lines.push(`UID:${crypto.randomUUID()}@garden-guardian`)
    lines.push(`DTSTAMP:${dtstamp(new Date())}`)
    lines.push(`DTSTART:${dtstamp(dt)}`)
    lines.push(`DURATION:PT1H`)
    lines.push(`SUMMARY:${r.plant_name}: ${r.type === 'fertilize' ? 'Gjødsling' : 'Vanning'}`)
    lines.push("END:VEVENT")
  }
  lines.push("END:VCALENDAR")

  return new Response(lines.join("\r\n"), {
    headers: { "Content-Type": "text/calendar; charset=utf-8" }
  })
})
