import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseReady = !!(supabaseUrl && supabaseAnonKey)

if (!supabaseReady) {
  console.warn('[Supabase] Variables de entorno no configuradas (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Las funciones de base de datos están deshabilitadas.')
}

export const supabase = supabaseReady
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createClient('https://placeholder.supabase.co', 'placeholder')
