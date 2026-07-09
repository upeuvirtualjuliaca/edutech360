<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

defineProps<{ activeItem: string }>()
defineEmits<{ navigate: [item: string] }>()

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'admin-login' })
}

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    id: 'docentes',
    label: 'Docentes',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    id: 'inscripciones',
    label: 'Inscripciones',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
]

const initials = (email: string) =>
  email.split('@')[0]?.slice(0, 2).toUpperCase() ?? 'AD'
</script>

<template>
  <aside
    class="flex flex-col h-full w-64 shrink-0"
    style="background: linear-gradient(180deg, #0b1437 0%, #0f2167 100%); border-right: 1px solid rgba(255,255,255,0.07);"
  >
    <!-- Logo -->
    <div class="px-5 pt-6 pb-5 border-b" style="border-color: rgba(255,255,255,0.07);">
      <img src="@/assets/images/logo_upeu_white.svg" alt="UPeU" class="h-7 w-auto object-contain" />
      <div class="mt-2.5 flex items-center gap-2">
        <span
          class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-cyan-400"
          style="background: rgba(6,182,212,0.12); border: 1px solid rgba(6,182,212,0.25);"
        >
          Admin
        </span>
        <span class="text-[10px] text-slate-500 font-medium">EduTech360</span>
      </div>
    </div>

    <!-- Navegación -->
    <nav class="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
      <p class="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">Menú</p>

      <button
        v-for="item in navItems"
        :key="item.id"
        type="button"
        :class="[
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
          activeItem === item.id
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
        ]"
        :style="activeItem === item.id
          ? 'background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.25);'
          : 'border: 1px solid transparent;'"
        @click="$emit('navigate', item.id)"
      >
        <svg
          class="w-4 h-4 shrink-0"
          :class="activeItem === item.id ? 'text-cyan-400' : 'text-slate-500'"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"
        >
          <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
        </svg>
        <span>{{ item.label }}</span>

        <!-- Indicador activo -->
        <span
          v-if="activeItem === item.id"
          class="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"
        ></span>
      </button>
    </nav>

    <!-- Divisor -->
    <div class="mx-4 h-px" style="background: rgba(255,255,255,0.07);"></div>

    <!-- Usuario + logout -->
    <div class="px-3 py-4 flex flex-col gap-2">
      <!-- Info usuario -->
      <div
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl"
        style="background: rgba(255,255,255,0.04);"
      >
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
          style="background: linear-gradient(135deg, #2563eb, #06b6d4);"
        >
          {{ initials(auth.user?.email ?? '') }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-semibold text-white truncate">
            {{ auth.user?.email?.split('@')[0] }}
          </p>
          <p class="text-[10px] text-slate-500 truncate">
            {{ auth.user?.email?.split('@')[1] }}
          </p>
        </div>
      </div>

      <!-- Botón salir -->
      <button
        type="button"
        class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold
               text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20
               transition-all duration-150 cursor-pointer"
        style="border: 1px solid rgba(255,255,255,0.06);"
        @click="handleLogout"
      >
        <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Cerrar sesión
      </button>
    </div>
  </aside>
</template>
