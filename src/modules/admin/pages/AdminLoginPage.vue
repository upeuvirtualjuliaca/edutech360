<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const localError = ref('')

function translateError(msg: string): string {
  if (msg.toLowerCase().includes('invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (msg.toLowerCase().includes('email not confirmed')) return 'El correo no ha sido confirmado.'
  if (msg.toLowerCase().includes('too many requests')) return 'Demasiados intentos. Espera unos minutos.'
  return 'Error al iniciar sesión. Inténtalo de nuevo.'
}

async function handleLogin() {
  localError.value = ''
  try {
    await auth.login(email.value, password.value)
    await router.push({ name: 'admin' })
  } catch (e: unknown) {
    localError.value = translateError(e instanceof Error ? e.message : '')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
    style="background: linear-gradient(135deg, #090e2a 0%, #0d1b5e 50%, #0b1240 100%);">
    <!-- Glow blobs -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-3xl opacity-25 pointer-events-none"
      style="background: radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%);"></div>
    <div class="absolute bottom-0 right-0 w-[400px] h-[400px] blur-3xl opacity-15 pointer-events-none"
      style="background: radial-gradient(circle, rgba(37,99,235,0.4) 0%, transparent 70%);"></div>

    <!-- Dot grid -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.03]"
      style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 26px 26px;"></div>

    <div class="relative w-full max-w-sm">

      <!-- Logo + título -->
      <div class="flex flex-col items-center gap-3 mb-8">
        <img src="@/assets/images/logo_upeu_white.svg" alt="UPeU" class="h-10 w-auto" />
        <div class="text-center">
          <p class="text-[11px] font-bold text-cyan-400/80 uppercase tracking-widest">Panel Administrativo</p>
          <p class="text-[10px] text-slate-500 mt-0.5">EduTech360 · XXI Jornada Académica</p>
        </div>
      </div>

      <!-- Card -->
      <div class="rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
        style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); backdrop-filter: blur(24px);">
        <!-- Shimmer top bar -->
        <div class="h-[3px] shimmer-bar"></div>

        <div class="px-7 py-8 flex flex-col gap-5">

          <div>
            <h1 class="text-lg font-black text-white leading-tight">Iniciar sesión</h1>
            <p class="text-xs text-slate-400 mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <!-- Error -->
          <Transition enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in" leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1">
            <div v-if="localError"
              class="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25">
              <svg class="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-xs text-red-400 font-medium">{{ localError }}</p>
            </div>
          </Transition>

          <!-- Formulario -->
          <form class="flex flex-col gap-4" @submit.prevent="handleLogin">

            <!-- Email -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Correo institucional
              </label>
              <input v-model="email" type="email" required autocomplete="email" placeholder="usuario@upeu.edu.pe" class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600
                       outline-none transition-all duration-200
                       focus:ring-2 focus:ring-cyan-500/40"
                style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);" />
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Contraseña
              </label>
              <input v-model="password" type="password" required autocomplete="current-password" placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600
                       outline-none transition-all duration-200
                       focus:ring-2 focus:ring-cyan-500/40"
                style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);" />
            </div>

            <!-- Botón -->
            <button type="submit" :disabled="auth.loading" class="flex items-center justify-center gap-2 w-full py-3 rounded-xl mt-1
                     bg-gradient-to-r from-blue-600 to-cyan-500
                     hover:from-blue-500 hover:to-cyan-400
                     text-white text-sm font-semibold cursor-pointer
                     transition-all duration-200 active:scale-[0.98]
                     disabled:opacity-60 disabled:cursor-not-allowed">
              <svg v-if="auth.loading" class="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <svg v-else class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {{ auth.loading ? 'Ingresando...' : 'Ingresar al panel' }}
            </button>

          </form>
        </div>
      </div>

      <p class="text-center text-[11px] text-slate-600 mt-5">
        Acceso exclusivo para administradores del evento
      </p>
    </div>
  </div>
</template>
