import { supabase, supabaseReady } from './supabase'

export interface AdminUser {
  id: string
  email: string
  created_at: string
}

export async function getAdmins(): Promise<AdminUser[]> {
  if (!supabaseReady) return []
  const { data, error } = await supabase
    .from('admins')
    .select('id, email, created_at')
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as AdminUser[]
}

export async function createAdmin(email: string, password: string): Promise<void> {
  if (!supabaseReady) throw new Error('Supabase no configurado')

  // signUp preserva la sesión actual cuando la confirmación de email está activa (comportamiento predeterminado)
  const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
  if (signUpError) throw new Error(signUpError.message)
  if (!data.user) throw new Error('No se pudo crear el usuario. El email podría ya estar registrado.')

  const { error: insertError } = await supabase
    .from('admins')
    .insert({ id: data.user.id, email })

  if (insertError) throw new Error(insertError.message)
}

export async function removeAdmin(userId: string): Promise<void> {
  if (!supabaseReady) throw new Error('Supabase no configurado')
  const { error } = await supabase.from('admins').delete().eq('id', userId)
  if (error) throw new Error(error.message)
}
