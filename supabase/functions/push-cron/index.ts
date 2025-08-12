// supabase/functions/push-cron/index.ts
// Daily job: find due tasks and send web push
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import "https://deno.land/x/xhr@0.3.0/mod.ts"
import webpush from "https://esm.sh/web-push@3.6.6"

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!

webpush.setVapidDetails("mailto:example@example.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

serve(async (_req) => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)

  // Fetch upcoming tasks for next 1 day per user (server-side simple query)
  const { data: userPlants, error: e1 } = await supabase
    .from("user_plants")
    .select("id, user_id, plant_id, watering_interval_days, fertilizing_interval_days, last_watered_at, last_fertilized_at, created_at, plants(name)")
  if (e1) return new Response(e1.message, { status: 500 })

  const now = new Date()
  const in24h = new Date(now.getTime() + 24*60*60*1000)

  // group subs by user
  const { data: subs } = await supabase.from("push_subscriptions").select("*")

  const subsByUser = new Map<string, any[]>()
  subs?.forEach(s => {
    if (!subsByUser.has(s.user_id)) subsByUser.set(s.user_id, [])
    subsByUser.get(s.user_id)!.push(s)
  })

  for (const up of userPlants || []) {
    const nextWater = new Date((up.last_watered_at || up.created_at))
    nextWater.setDate(nextWater.getDate() + up.watering_interval_days)
    const nextFert = new Date((up.last_fertilized_at || up.created_at))
    nextFert.setDate(nextFert.getDate() + up.fertilizing_interval_days)

    const due = []
    if (nextWater <= in24h) due.push({ type: "Vanning", at: nextWater })
    if (nextFert <= in24h) due.push({ type: "Gjødsling", at: nextFert })

    if (due.length === 0) continue
    const subs = subsByUser.get(up.user_id) || []
    for (const s of subs) {
      try {
        await webpush.sendNotification({
          endpoint: s.endpoint,
          keys: { p256dh: s.p256dh, auth: s.auth }
        }, JSON.stringify({
          title: "Garden Guardian",
          body: `${up.plants.name}: ${due.map(d=>d.type).join(" & ")} forfaller snart`
        }))
      } catch (_e) {
        // ignore errors, could clean up invalid subscriptions
      }
    }
  }

  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } })
})
