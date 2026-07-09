<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '../components/AppSidebar.vue'
import ExcelUploader from '../components/ExcelUploader.vue'
import DocentesTable from '../components/DocentesTable.vue'
import UsersTable from '../components/UsersTable.vue'
import InscripcionesTable from '../components/InscripcionesTable.vue'
import { clearAllDocentes } from '@/services/docentes'

const auth = useAuthStore()

const activeItem = ref('dashboard')
const activeTab = ref<'upload' | 'list'>('upload')
const refreshKey = ref(0)
const clearing = ref(false)
const sidebarOpen = ref(false)

function onImported() {
  refreshKey.value++
  activeTab.value = 'list'
}

function onNavigate(item: string) {
  activeItem.value = item
  sidebarOpen.value = false
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

const pageTitles: Record<string, { title: string; description: string }> = {
  dashboard:      { title: 'Dashboard', description: 'Resumen general del evento' },
  docentes:       { title: 'Gestión de Docentes', description: 'Importa y administra el padrón de docentes' },
  inscripciones:  { title: 'Inscripciones', description: 'Listado de docentes registrados al evento' },
  usuarios:       { title: 'Gestión de Usuarios', description: 'Administra los usuarios con acceso al panel' },
  configuracion:  { title: 'Configuración', description: 'Ajustes del panel administrativo' },
}
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-100">

    <!-- Overlay mobile -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/50 lg:hidden"
        @click="sidebarOpen = false"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-30 lg:relative lg:flex lg:translate-x-0 transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <AppSidebar :active-item="activeItem" @navigate="onNavigate" />
    </div>

    <!-- Área de trabajo -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">

      <!-- Topbar -->
      <header class="bg-white border-b border-slate-200 shrink-0 z-10">
        <div class="flex items-center gap-4 px-6 h-14">

          <!-- Hamburger (mobile) -->
          <button
            type="button"
            class="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            @click="sidebarOpen = true"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-sm min-w-0">
            <span class="text-slate-400 font-medium hidden sm:inline">Panel</span>
            <svg class="w-3.5 h-3.5 text-slate-300 hidden sm:block shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
            <span class="font-semibold text-slate-800 truncate">
              {{ pageTitles[activeItem]?.title }}
            </span>
          </div>

          <!-- Spacer -->
          <div class="flex-1"></div>

          <!-- Avatar usuario -->
          <div class="flex items-center gap-2.5">
            <div class="text-right hidden sm:block">
              <p class="text-xs font-semibold text-slate-700 leading-none">
                {{ auth.user?.email?.split('@')[0] }}
              </p>
              <p class="text-[10px] text-slate-400 mt-0.5">Administrador</p>
            </div>
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
              style="background: linear-gradient(135deg, #2563eb, #06b6d4);"
            >
              {{ auth.user?.email?.split('@')[0]?.slice(0, 2).toUpperCase() }}
            </div>
          </div>
        </div>
      </header>

      <!-- Contenido principal -->
      <main class="flex-1 overflow-y-auto px-6 py-6">

        <!-- Page header -->
        <div class="mb-6">
          <h1 class="text-xl font-black text-slate-900">
            {{ pageTitles[activeItem]?.title }}
          </h1>
          <p class="text-sm text-slate-500 mt-0.5">
            {{ pageTitles[activeItem]?.description }}
          </p>
        </div>

        <!-- ── Dashboard ─────────────────────────────── -->
        <div v-if="activeItem === 'dashboard'" class="flex flex-col gap-6">
          <!-- Stat cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              v-for="card in [
                { label: 'Sedes activas',    value: '3',  sub: 'Lima · Juliaca · Tarapoto', color: 'blue'  },
                { label: 'Docentes en padrón', value: '—',  sub: 'Importa el Excel para ver', color: 'cyan'  },
                { label: 'Inscripciones',    value: '—',  sub: 'Registros confirmados',     color: 'emerald'},
              ]"
              :key="card.label"
              class="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-2"
            >
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ card.label }}</p>
              <p class="text-3xl font-black text-slate-900">{{ card.value }}</p>
              <p class="text-xs text-slate-400">{{ card.sub }}</p>
            </div>
          </div>

          <!-- Accesos rápidos -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5">
            <p class="text-sm font-bold text-slate-800 mb-4">Accesos rápidos</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                class="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200
                       hover:border-blue-300 hover:bg-blue-50 transition-all duration-150 cursor-pointer text-left"
                @click="onNavigate('docentes'); activeTab = 'upload'"
              >
                <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <svg class="w-4.5 h-4.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800">Importar Excel</p>
                  <p class="text-xs text-slate-400">Cargar padrón de docentes</p>
                </div>
              </button>

              <button
                type="button"
                class="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200
                       hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-150 cursor-pointer text-left"
                @click="onNavigate('inscripciones')"
              >
                <div class="w-9 h-9 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0">
                  <svg class="w-4.5 h-4.5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-slate-800">Ver inscripciones</p>
                  <p class="text-xs text-slate-400">Docentes registrados al evento</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- ── Docentes ──────────────────────────────── -->
        <div v-else-if="activeItem === 'docentes'" class="flex flex-col gap-4">
          <!-- Sub-tabs -->
          <div class="flex gap-1 p-1 bg-white border border-slate-200 rounded-xl w-fit">
            <button
              v-for="tab in [
                { id: 'upload', label: 'Importar Excel' },
                { id: 'list',   label: 'Padrón' },
              ]"
              :key="tab.id"
              type="button"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer',
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              ]"
              @click="activeTab = tab.id as 'upload' | 'list'"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <ExcelUploader v-if="activeTab === 'upload'" @imported="onImported" />

            <template v-else>
              <div class="flex items-center justify-between mb-4">
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
            </template>
          </div>
        </div>

        <!-- ── Inscripciones ──────────────────────────── -->
        <div v-else-if="activeItem === 'inscripciones'"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <InscripcionesTable />
        </div>

        <!-- ── Usuarios ──────────────────────────────── -->
        <div v-else-if="activeItem === 'usuarios'"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <UsersTable />
        </div>

        <!-- ── Configuración (placeholder) ──────────── -->
        <div v-else-if="activeItem === 'configuracion'"
          class="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center gap-3 text-center">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <p class="text-sm font-semibold text-slate-600">Próximamente</p>
          <p class="text-xs text-slate-400 max-w-xs">Las opciones de configuración estarán disponibles próximamente.</p>
        </div>

      </main>
    </div>
  </div>
</template>
