<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ExcelUploader from '../components/ExcelUploader.vue'
import DocentesTable from '../components/DocentesTable.vue'
import { clearAllDocentes } from '@/services/docentes'

const router = useRouter()
const auth = useAuthStore()

const activeTab = ref<'upload' | 'list'>('upload')
const refreshKey = ref(0)
const clearing = ref(false)

function onImported() {
  refreshKey.value++
  activeTab.value = 'list'
}

async function handleLogout() {
  await auth.logout()
  router.push('/admin/login')
}

async function handleClearAll() {
  if (!confirm('¿Eliminar TODOS los docentes del padrón? Esta acción no se puede deshacer.')) return
  clearing.value = true
  try {
    await clearAllDocentes()
    refreshKey.value++
  } finally {
    clearing.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">

    <!-- Topbar -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <img src="@/assets/images/logo_upeu_white.svg" alt="UPeU"
            class="h-7 w-auto object-contain brightness-0" />
          <div class="w-px h-5 bg-slate-200"></div>
          <span class="text-sm font-bold text-slate-700">Panel Administrativo</span>
          <span class="hidden sm:inline text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            EduTech360
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span class="hidden sm:inline text-xs text-slate-500">{{ auth.user?.email }}</span>
          <button
            type="button"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            @click="handleLogout"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Salir
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido -->
    <main class="max-w-6xl mx-auto px-6 py-8">

      <!-- Page title -->
      <div class="mb-6">
        <h1 class="text-2xl font-black text-slate-900">Gestión de Docentes</h1>
        <p class="text-sm text-slate-500 mt-1">
          Importa el padrón de docentes desde Excel para habilitar la búsqueda por DNI en el formulario.
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-6">
        <button
          v-for="tab in [
            { id: 'upload', label: 'Importar Excel', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
            { id: 'list',   label: 'Padrón de docentes', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
          ]"
          :key="tab.id"
          type="button"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer',
            activeTab === tab.id
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700',
          ]"
          @click="activeTab = tab.id as 'upload' | 'list'"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" :d="tab.icon"/>
          </svg>
          {{ tab.label }}
        </button>
      </div>

      <!-- Panel upload -->
      <div v-if="activeTab === 'upload'"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <ExcelUploader @imported="onImported" />
      </div>

      <!-- Panel lista -->
      <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-slate-800">Padrón importado</h2>
          <button
            type="button"
            :disabled="clearing"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   text-red-500 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer
                   disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleClearAll"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            {{ clearing ? 'Eliminando...' : 'Limpiar todo' }}
          </button>
        </div>
        <DocentesTable :refresh="refreshKey" />
      </div>

    </main>
  </div>
</template>
