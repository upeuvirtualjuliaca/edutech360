import { supabase, supabaseReady } from './supabase'
import type { Docente } from '@/types/docente'

export async function lookupDocenteByDni(dni: string): Promise<Docente | null> {
  if (!supabaseReady) return null
  const { data, error } = await supabase
    .from('docentes')
    .select('dni, apellidos_nombres, campus, facultad, escuela_profesional')
    .eq('dni', dni.trim())
    .single()

  if (error || !data) return null

  return {
    dni: data.dni,
    apellidosNombres: data.apellidos_nombres,
    campus: data.campus ?? '',
    facultad: data.facultad ?? '',
    escuelaProfesional: data.escuela_profesional ?? '',
  }
}

export async function importDocentes(docentes: Docente[]): Promise<{ count: number; errors: number }> {
  if (!supabaseReady) throw new Error('Supabase no configurado')
  const rows = docentes.map((d) => ({
    dni: d.dni.trim(),
    apellidos_nombres: d.apellidosNombres.trim(),
    campus: d.campus?.trim() ?? null,
    facultad: d.facultad?.trim() ?? null,
    escuela_profesional: d.escuelaProfesional?.trim() ?? null,
  }))

  const { data, error } = await supabase
    .from('docentes')
    .upsert(rows, { onConflict: 'dni' })
    .select()

  if (error) throw new Error(error.message)

  return { count: data?.length ?? 0, errors: 0 }
}

export async function getDocentes(page = 1, pageSize = 50, search = '') {
  if (!supabaseReady) return { data: [], total: 0 }
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('docentes')
    .select('*', { count: 'exact' })
    .order('apellidos_nombres', { ascending: true })
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

export async function deleteDocente(id: string): Promise<void> {
  const { error } = await supabase.from('docentes').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function clearAllDocentes(): Promise<void> {
  const { error } = await supabase.from('docentes').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) throw new Error(error.message)
}
