<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')

async function handleLogin() {
  try {
    await auth.login(email.value, password.value)
    router.push('/admin')
  } catch {
    // error ya está en auth.error
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4"
    style="background: linear-gradient(135deg, #090e2a 0%, #0d1b5e 50%, #0b1240 100%);">

    <!-- Glow blob -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-3xl opacity-20 pointer-events-none"
      style="background: radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%);"></div>

    <div class="relative w-full max-w-sm">

      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <img src="@/assets/images/logo_upeu_white.svg" alt="UPeU" class="h-9 w-auto" />
      </div>

      <!-- Card -->
      <div class="rounded-3xl overflow-hidden shadow-2xl shadow-black/40"
        style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); backdrop-filter: blur(20px);">

        <!-- Shimmer top -->
        <div class="h-[3px] shimmer-bar"></div>

        <div class="px-7 py-8 flex flex-col gap-5">

          <div>
            <h1 class="text-xl font-black text-white">Panel Administrativo</h1>
            <p class="text-xs text-slate-400 mt-1">EduTech360 — Gestión de docentes</p>
          </div>

          <!-- Error -->
          <div v-if="auth.error"
            class="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <svg class="w-4 h-4 text-red-400 shrink-0 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-xs text-red-400">{{ auth.error }}</p>
          </div>

          <!-- Form -->
          <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Correo</label>
              <input
                v-model="email"
                type="email"
                required
                placeholder="admin@upeu.edu.pe"
                class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none
                       transition-all duration-200
                       focus:ring-2 focus:ring-cyan-500/30"
                style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contraseña</label>
              <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none
                       transition-all duration-200
                       focus:ring-2 focus:ring-cyan-500/30"
                style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);"
              />
            </div>

            <button
              type="submit"
              :disabled="auth.loading"
              class="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                     bg-gradient-to-r from-blue-600 to-cyan-500
                     hover:from-blue-500 hover:to-cyan-400
                     text-white text-sm font-semibold
                     transition-all duration-200 active:scale-[0.98] cursor-pointer
                     disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              <svg v-if="auth.loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>{{ auth.loading ? 'Ingresando...' : 'Ingresar' }}</span>
            </button>
          </form>

        </div>
      </div>

      <p class="text-center text-xs text-slate-600 mt-6">
        Acceso exclusivo para administradores del evento
      </p>
    </div>
  </div>
</template>
