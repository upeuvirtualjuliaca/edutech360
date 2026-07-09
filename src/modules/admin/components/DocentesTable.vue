<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getDocentes, deleteDocente } from '@/services/docentes'

const props = defineProps<{ refresh: number }>()

const rows = ref<Record<string, string>[]>([])
const total = ref(0)
const page = ref(1)
const search = ref('')
const loading = ref(false)
const deleting = ref<string | null>(null)

const PAGE_SIZE = 10

async function load() {
  loading.value = true
  try {
    const result = await getDocentes(page.value, PAGE_SIZE, search.value)
    rows.value = result.data
    total.value = result.total
  } finally {
    loading.value = false
  }
}

async function handleDelete(id: string) {
  if (!confirm('¿Eliminar este docente del padrón?')) return
  deleting.value = id
  try {
    await deleteDocente(id)
    await load()
  } finally {
    deleting.value = null
  }
}

let searchTimer: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { page.value = 1; load() }, 350)
})

watch(() => props.refresh, load)
watch(page, load)
onMounted(load)

const totalPages = () => Math.ceil(total.value / PAGE_SIZE)
</script>

<template>
  <div class="flex flex-col gap-4">

    <!-- Buscador + contador -->
    <div class="flex items-center gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Buscar por DNI o nombre..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white
                 text-sm text-slate-700 outline-none transition-all
                 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/15"
        />
      </div>
      <span class="shrink-0 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-lg">
        {{ total.toLocaleString() }} docentes
      </span>
    </div>

    <!-- Tabla -->
    <div class="rounded-xl border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">DNI/CE</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Apellidos y Nombres</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Campus</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Facultad</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[160px]">Escuela</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="loading" class="text-center">
              <td colspan="6" class="py-10">
                <svg class="w-5 h-5 animate-spin text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </td>
            </tr>
            <tr v-else-if="!rows.length" class="text-center">
              <td colspan="6" class="py-10 text-sm text-slate-400">
                {{ search ? 'Sin resultados para la búsqueda.' : 'No hay docentes importados aún.' }}
              </td>
            </tr>
            <tr v-for="row in rows" :key="row.id" class="hover:bg-slate-50 group">
              <td class="px-4 py-3 font-mono font-semibold text-slate-700 text-sm">{{ row.dni }}</td>
              <td class="px-4 py-3 text-slate-800 font-medium">{{ row.apellidos_nombres }}</td>
              <td class="px-4 py-3 text-slate-500 text-xs">{{ row.campus }}</td>
              <td class="px-4 py-3 text-slate-500 text-xs">{{ row.facultad }}</td>
              <td class="px-4 py-3 text-slate-500 text-xs">{{ row.escuela_profesional }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  :disabled="deleting === row.id"
                  class="opacity-0 group-hover:opacity-100 transition-opacity
                         p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                  @click="handleDelete(row.id as string)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages() > 1" class="flex items-center justify-between">
      <button
        type="button"
        :disabled="page === 1"
        class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
               border border-slate-200 text-slate-600 hover:bg-slate-50
               disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        @click="page--"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        Anterior
      </button>
      <span class="text-xs text-slate-500">Página {{ page }} de {{ totalPages() }}</span>
      <button
        type="button"
        :disabled="page >= totalPages()"
        class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
               border border-slate-200 text-slate-600 hover:bg-slate-50
               disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        @click="page++"
      >
        Siguiente
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

  </div>
</template>
