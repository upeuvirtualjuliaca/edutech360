<script setup lang="ts">
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import type { Docente } from '@/types/docente'
import { importDocentes } from '@/services/docentes'

const emit = defineEmits<{ imported: [] }>()

const isDragging = ref(false)
const preview = ref<Docente[]>([])
const fileName = ref('')
const importing = ref(false)
const importResult = ref<{ count: number } | null>(null)
const importError = ref<string | null>(null)

// Mapeo flexible de columnas del Excel → campos internos
const COL_MAP: Record<string, keyof Docente> = {
  'dni': 'dni',
  'ce': 'dni',
  'doc': 'dni',
  'documento': 'dni',
  'apellidos y nombres': 'apellidosNombres',
  'apellidos_nombres': 'apellidosNombres',
  'nombre': 'apellidosNombres',
  'nombres': 'apellidosNombres',
  'campus': 'campus',
  'sede': 'campus',
  'facultad': 'facultad',
  'escuela': 'escuelaProfesional',
  'escuela profesional': 'escuelaProfesional',
  'escuela_profesional': 'escuelaProfesional',
  'carrera': 'escuelaProfesional',
}

function normalizeKey(key: string): string {
  return key.toLowerCase().trim().replace(/\s+/g, ' ')
}

function parseSheet(workbook: XLSX.WorkBook): Docente[] {
  const sheet = workbook.Sheets[workbook.SheetNames[0]!]!
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })

  return rows
    .map((row) => {
      const docente: Partial<Docente> = {}
      for (const [rawKey, value] of Object.entries(row)) {
        const normalized = normalizeKey(rawKey)
        const field = COL_MAP[normalized]
        if (field) docente[field] = String(value).trim()
      }
      return docente as Docente
    })
    .filter((d) => d.dni && d.apellidosNombres)
}

function handleFile(file: File) {
  importResult.value = null
  importError.value = null
  fileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target!.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: 'array' })
    preview.value = parseSheet(workbook)
  }
  reader.readAsArrayBuffer(file)
}

function onFileInput(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) handleFile(file)
}

function clearPreview() {
  preview.value = []
  fileName.value = ''
  importResult.value = null
  importError.value = null
}

async function confirmImport() {
  importing.value = true
  importError.value = null
  try {
    const result = await importDocentes(preview.value)
    importResult.value = { count: result.count }
    preview.value = []
    fileName.value = ''
    emit('imported')
  } catch (e: unknown) {
    importError.value = e instanceof Error ? e.message : 'Error al importar'
  } finally {
    importing.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-5">

    <!-- Zona de carga -->
    <div v-if="!preview.length">
      <label
        :class="[
          'flex flex-col items-center justify-center gap-3 w-full rounded-2xl border-2 border-dashed cursor-pointer',
          'transition-all duration-200 py-12 px-6 text-center',
          isDragging
            ? 'border-cyan-400 bg-cyan-50'
            : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50',
        ]"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop"
      >
        <div class="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414
                 a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-700">Arrastra tu archivo Excel aquí</p>
          <p class="text-xs text-slate-400 mt-1">o haz clic para seleccionar — .xlsx, .xls</p>
        </div>
        <input type="file" accept=".xlsx,.xls" class="hidden" @change="onFileInput" />
      </label>

      <!-- Instrucciones de columnas -->
      <div class="mt-4 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
        <p class="text-xs font-semibold text-blue-700 mb-1.5">Columnas esperadas en el Excel:</p>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="col in ['DNI / CE', 'Apellidos y Nombres', 'Campus', 'Facultad', 'Escuela Profesional']"
            :key="col"
            class="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-[11px] font-medium text-blue-600">
            {{ col }}
          </span>
        </div>
        <p class="text-[11px] text-blue-400 mt-2">Los encabezados no son sensibles a mayúsculas ni tildes.</p>
      </div>
    </div>

    <!-- Vista previa -->
    <div v-else class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-bold text-slate-800">Vista previa — {{ fileName }}</p>
          <p class="text-xs text-slate-500 mt-0.5">
            <span class="font-semibold text-blue-600">{{ preview.length }}</span> docentes listos para importar
          </p>
        </div>
        <button type="button"
          class="text-xs text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          @click="clearPreview">
          Cancelar
        </button>
      </div>

      <!-- Tabla preview (máx 8 filas) -->
      <div class="rounded-xl border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="text-left px-3 py-2.5 font-semibold text-slate-500 uppercase tracking-wider">#</th>
                <th class="text-left px-3 py-2.5 font-semibold text-slate-500 uppercase tracking-wider">DNI/CE</th>
                <th class="text-left px-3 py-2.5 font-semibold text-slate-500 uppercase tracking-wider min-w-[180px]">Apellidos y Nombres</th>
                <th class="text-left px-3 py-2.5 font-semibold text-slate-500 uppercase tracking-wider">Campus</th>
                <th class="text-left px-3 py-2.5 font-semibold text-slate-500 uppercase tracking-wider">Facultad</th>
                <th class="text-left px-3 py-2.5 font-semibold text-slate-500 uppercase tracking-wider min-w-[140px]">Escuela</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(d, i) in preview.slice(0, 8)" :key="i" class="hover:bg-slate-50">
                <td class="px-3 py-2 text-slate-400">{{ i + 1 }}</td>
                <td class="px-3 py-2 font-mono font-semibold text-slate-700">{{ d.dni }}</td>
                <td class="px-3 py-2 text-slate-700">{{ d.apellidosNombres }}</td>
                <td class="px-3 py-2 text-slate-500">{{ d.campus }}</td>
                <td class="px-3 py-2 text-slate-500">{{ d.facultad }}</td>
                <td class="px-3 py-2 text-slate-500">{{ d.escuelaProfesional }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="preview.length > 8"
          class="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-400 text-center">
          ... y {{ preview.length - 8 }} registros más
        </div>
      </div>

      <!-- Botón importar -->
      <button
        type="button"
        :disabled="importing"
        class="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl
               bg-gradient-to-r from-blue-600 to-cyan-500
               hover:from-blue-700 hover:to-cyan-600
               text-white text-sm font-semibold cursor-pointer
               transition-all duration-200 active:scale-[0.98]
               disabled:opacity-60 disabled:cursor-not-allowed"
        @click="confirmImport"
      >
        <svg v-if="importing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
        {{ importing ? 'Importando...' : `Importar ${preview.length} docentes` }}
      </button>
    </div>

    <!-- Resultado importación -->
    <div v-if="importResult"
      class="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
      <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div>
        <p class="text-sm font-bold text-emerald-800">¡Importación exitosa!</p>
        <p class="text-xs text-emerald-600">{{ importResult.count }} docentes guardados correctamente.</p>
      </div>
    </div>

    <div v-if="importError"
      class="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
      <svg class="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p class="text-xs text-red-600">{{ importError }}</p>
    </div>

  </div>
</template>
