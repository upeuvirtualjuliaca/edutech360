import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase, supabaseReady } from '@/services/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  async function init() {
    if (initialized.value || !supabaseReady) {
      initialized.value = true
      return
    }
    try {
      const { data } = await supabase.auth.getSession()
      user.value = data.session?.user ?? null
      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
      })
    } catch {
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw err
      user.value = data.user
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Error al iniciar sesión'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  return { user, loading, error, isAuthenticated, initialized, init, login, logout }
})
