<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { getRegistrations, getAllRegistrations, deleteRegistration } from '@/services/registrations'

const PAGE_SIZE = 10

const rows    = ref<Record<string, string>[]>([])
const total   = ref(0)
const page    = ref(1)
const search  = ref('')
const loading = ref(false)
const error   = ref('')

const deleting   = ref<string | null>(null)
const exporting  = ref<'excel' | 'pdf' | null>(null)

async function load() {
  loading.value = true
  error.value   = ''
  try {
    const result  = await getRegistrations(page.value, PAGE_SIZE, search.value)
    rows.value    = result.data
    total.value   = result.total
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Error al cargar inscripciones'
  } finally {
    loading.value = false
  }
}

async function handleDelete(row: Record<string, string>) {
  if (!confirm(`¿Eliminar la inscripción de ${row.apellidos_nombres}?\nEsta acción no se puede deshacer.`)) return
  deleting.value = row.id
  try {
    await deleteRegistration(row.id)
    await load()
  } catch (e: unknown) {
    alert(e instanceof Error ? e.message : 'Error al eliminar')
  } finally {
    deleting.value = null
  }
}

// ── Exportar Excel ────────────────────────────────────────────────
async function exportExcel() {
  exporting.value = 'excel'
  try {
    const all = await getAllRegistrations()
    const sheetData = all.map((r, i) => ({
      'N°':                    i + 1,
      'DNI / CE':              r.dni,
      'Apellidos y Nombres':   r.apellidos_nombres,
      'Campus':                r.campus ?? '',
      'Facultad / EPG':        r.facultad ?? '',
      'EP':                    r.escuela_profesional ?? '',
      'Ciudad':                r.ciudad ?? '',
      'Fecha de inscripción':  formatDate(r.created_at),
    }))

    const wb  = XLSX.utils.book_new()
    const ws  = XLSX.utils.json_to_sheet(sheetData)

    // Anchos de columna
    ws['!cols'] = [
      { wch: 5 }, { wch: 12 }, { wch: 40 }, { wch: 14 },
      { wch: 28 }, { wch: 28 }, { wch: 14 }, { wch: 20 },
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Inscripciones')
    XLSX.writeFile(wb, `inscripciones_edutech360_${dateStamp()}.xlsx`)
  } catch (e: unknown) {
    alert(e instanceof Error ? e.message : 'Error al exportar Excel')
  } finally {
    exporting.value = null
  }
}

// ── Exportar PDF ─────────────────────────────────────────────────
async function exportPDF() {
  exporting.value = 'pdf'
  try {
    const all = await getAllRegistrations()

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

    // Cabecera
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('EduTech360 — Listado de Inscripciones', 14, 15)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120)
    doc.text(`Total: ${all.length} docentes registrados   ·   Generado: ${formatDate(new Date().toISOString())}`, 14, 22)
    doc.setTextColor(0)

    autoTable(doc, {
      startY: 27,
      head: [['N°', 'DNI / CE', 'Apellidos y Nombres', 'Campus', 'Facultad / EPG', 'EP', 'Ciudad', 'Fecha']],
      body: all.map((r, i) => [
        i + 1,
        r.dni,
        r.apellidos_nombres,
        r.campus ?? '',
        r.facultad ?? '',
        r.escuela_profesional ?? '',
        r.ciudad ?? '',
        formatDate(r.created_at),
      ]),
      styles:       { fontSize: 7.5, cellPadding: 2 },
      headStyles:   { fillColor: [15, 33, 103], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      columnStyles: {
        0: { cellWidth: 8,  halign: 'center' },
        1: { cellWidth: 20, font: 'courier' },
        2: { cellWidth: 55 },
        3: { cellWidth: 22 },
        4: { cellWidth: 38 },
        5: { cellWidth: 38 },
        6: { cellWidth: 20 },
        7: { cellWidth: 28 },
      },
    })

    doc.save(`inscripciones_edutech360_${dateStamp()}.pdf`)
  } catch (e: unknown) {
    alert(e instanceof Error ? e.message : 'Error al exportar PDF')
  } finally {
    exporting.value = null
  }
}

// ── Helpers ───────────────────────────────────────────────────────
function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-PE', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10)
}

const totalPages = () => Math.ceil(total.value / PAGE_SIZE)

let searchTimer: ReturnType<typeof setTimeout>
watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { page.value = 1; load() }, 350)
})
watch(page, load)
onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-4">

    <!-- Toolbar: buscador + exportar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">

      <!-- Buscador -->
      <div class="relative flex-1 w-full sm:w-auto">
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

      <!-- Contador -->
      <span class="shrink-0 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-lg">
        {{ total.toLocaleString() }} registros
      </span>

      <!-- Exportar Excel -->
      <button
        type="button"
        :disabled="!!exporting || total === 0"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border
               border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100
               transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        @click="exportExcel"
      >
        <svg v-if="exporting === 'excel'" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
        </svg>
        {{ exporting === 'excel' ? 'Exportando...' : 'Excel' }}
      </button>

      <!-- Exportar PDF -->
      <button
        type="button"
        :disabled="!!exporting || total === 0"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border
               border-red-200 text-red-600 bg-red-50 hover:bg-red-100
               transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        @click="exportPDF"
      >
        <svg v-if="exporting === 'pdf'" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
        {{ exporting === 'pdf' ? 'Generando...' : 'PDF' }}
      </button>
    </div>

    <!-- Error -->
    <div v-if="error" class="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
      {{ error }}
    </div>

    <!-- Tabla -->
    <div class="rounded-xl border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center w-10">#</th>
              <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">DNI / CE</th>
              <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left min-w-[200px]">Apellidos y Nombres</th>
              <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Campus</th>
              <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left min-w-[140px]">Facultad / EPG</th>
              <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left min-w-[130px]">EP</th>
              <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Ciudad</th>
              <th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left min-w-[130px]">Fecha</th>
              <th class="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">

            <!-- Loading -->
            <template v-if="loading">
              <tr v-for="n in PAGE_SIZE" :key="n" class="animate-pulse">
                <td class="px-4 py-3"><div class="h-3 bg-slate-200 rounded w-5 mx-auto"></div></td>
                <td class="px-4 py-3"><div class="h-3 bg-slate-200 rounded w-20"></div></td>
                <td class="px-4 py-3"><div class="h-3 bg-slate-200 rounded w-44"></div></td>
                <td class="px-4 py-3"><div class="h-3 bg-slate-200 rounded w-16"></div></td>
                <td class="px-4 py-3"><div class="h-3 bg-slate-200 rounded w-28"></div></td>
                <td class="px-4 py-3"><div class="h-3 bg-slate-200 rounded w-24"></div></td>
                <td class="px-4 py-3"><div class="h-3 bg-slate-200 rounded w-16"></div></td>
                <td class="px-4 py-3"><div class="h-3 bg-slate-200 rounded w-24"></div></td>
                <td></td>
              </tr>
            </template>

            <!-- Sin datos -->
            <tr v-else-if="!rows.length">
              <td colspan="9" class="py-16 text-center">
                <div class="flex flex-col items-center gap-2">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </div>
                  <p class="text-sm font-semibold text-slate-500">
                    {{ search ? 'Sin resultados para la búsqueda.' : 'No hay inscripciones registradas aún.' }}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Filas -->
            <tr
              v-for="(row, idx) in rows"
              :key="row.id"
              class="hover:bg-slate-50 group transition-colors"
            >
              <td class="px-4 py-3 text-xs text-slate-400 text-center">
                {{ (page - 1) * PAGE_SIZE + idx + 1 }}
              </td>
              <td class="px-4 py-3 font-mono font-semibold text-slate-700 text-sm">
                {{ row.dni }}
              </td>
              <td class="px-4 py-3 text-slate-800 font-medium">
                {{ row.apellidos_nombres }}
              </td>
              <td class="px-4 py-3 text-xs text-slate-500">{{ row.campus || '—' }}</td>
              <td class="px-4 py-3 text-xs text-slate-500">{{ row.facultad || '—' }}</td>
              <td class="px-4 py-3 text-xs text-slate-500">{{ row.escuela_profesional || '—' }}</td>
              <td class="px-4 py-3 text-xs text-slate-500">{{ row.ciudad || '—' }}</td>
              <td class="px-4 py-3 text-xs text-slate-400">{{ formatDate(row.created_at) }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  :disabled="deleting === row.id"
                  class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg
                         text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer
                         disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Eliminar inscripción"
                  @click="handleDelete(row)"
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

      <!-- Páginas -->
      <div class="flex items-center gap-1">
        <button
          v-for="p in totalPages()"
          :key="p"
          type="button"
          :class="[
            'w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer',
            p === page
              ? 'text-white'
              : 'text-slate-500 hover:bg-slate-100',
          ]"
          :style="p === page ? 'background: linear-gradient(135deg,#2563eb,#06b6d4);' : ''"
          @click="page = p"
        >
          {{ p }}
        </button>
      </div>

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
