import { supabase, supabaseReady } from './supabase'
import type { Registration } from '@/types/registration'

export async function submitRegistration(data: Omit<Registration, 'id' | 'createdAt'>): Promise<void> {
  if (!supabaseReady) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('registrations').insert({
    dni: data.dni.trim(),
    apellidos_nombres: data.apellidosNombres,
    campus: data.campus,
    facultad: data.facultad,
    escuela_profesional: data.escuelaProfesional,
    ciudad: data.ciudad ?? null,
  })

  if (error) {
    if (error.code === '23505') throw new Error('already-registered')
    throw new Error(error.message)
  }
}

export async function checkRegistration(dni: string): Promise<boolean> {
  if (!supabaseReady) return false
  const { data, error } = await supabase
    .from('registrations')
    .select('id')
    .eq('dni', dni.trim())
    .single()

  if (error) return false
  return !!data
}

export async function getRegistrations(page = 1, pageSize = 50, search = '') {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('registrations')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (search.trim()) {
    query = query.or(
      `dni.ilike.%${search}%,apellidos_nombres.ilike.%${search}%`
    )
  }

  const { data, count, error } = await query
  if (error) throw new Error(error.message)

  return { data: data ?? [], total: count ?? 0 }
}
