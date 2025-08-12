import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

if (!url || !/^https?:\/\/\S+$/.test(url)) {
  throw new Error(`Missing or invalid VITE_SUPABASE_URL. Fikk: ${String(url)}`)
}
if (!key || key.length < 20) {
  throw new Error(`Missing or invalid VITE_SUPABASE_ANON_KEY. Fikk lengde: ${key?.length ?? 0}`)
}

export const supabase = createClient(url, key)
