<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import AlertMessage from '@/components/feedback/AlertMessage.vue'
import { lookupDocenteByDni } from '@/services/docentes'
import { submitRegistration, checkRegistration } from '@/services/registrations'
import type { DocenteLookupStatus, Docente } from '@/types/docente'
import type { RegistrationStatus } from '@/types/registration'

const dni = ref('')
const docente = ref<Docente | null>(null)
const dniStatus = ref<DocenteLookupStatus>('idle')
const submitStatus = ref<RegistrationStatus>('idle')

// Modo manual (cuando el DNI no está en el padrón)
const manualMode = ref(false)
const manualNombres = ref('')
const manualCampus = ref('')
const manualFacultad = ref('')
const manualEP = ref('')

// Lookup con debounce — soporta DNI (8 dígitos) y CE (9-12 dígitos)
let lookupTimer: ReturnType<typeof setTimeout> | null = null

watch(dni, (val) => {
  const clean = val.replace(/\D/g, '')

  if (clean.length < 8) {
    if (lookupTimer) clearTimeout(lookupTimer)
    dniStatus.value = 'idle'
    docente.value = null
    submitStatus.value = 'idle'
    manualMode.value = false
    return
  }

  dniStatus.value = 'loading'
  manualMode.value = false

  if (lookupTimer) clearTimeout(lookupTimer)
  lookupTimer = setTimeout(async () => {
    const result = await lookupDocenteByDni(clean)
    if (result) {
      docente.value = result
      dniStatus.value = 'found'
    } else {
      docente.value = null
      dniStatus.value = 'not-found'
    }
  }, 500)
})

onUnmounted(() => { if (lookupTimer) clearTimeout(lookupTimer) })

function enableManualMode() {
  manualNombres.value = ''
  manualCampus.value = ''
  manualFacultad.value = ''
  manualEP.value = ''
  submitStatus.value = 'idle'
  manualMode.value = true
}

function cancelManualMode() {
  manualMode.value = false
  submitStatus.value = 'idle'
}

const canSubmitManual = () =>
  manualMode.value &&
  manualNombres.value.trim().length > 0 &&
  submitStatus.value !== 'loading'

async function handleSubmit() {
  const isManual = manualMode.value
  const isFound = dniStatus.value === 'found'

  if (!isManual && (!docente.value || !isFound)) return
  if (isManual && !manualNombres.value.trim()) return

  submitStatus.value = 'loading'

  const cleanDni = dni.value.replace(/\D/g, '')

  try {
    const alreadyRegistered = await checkRegistration(cleanDni)
    if (alreadyRegistered) {
      submitStatus.value = 'already-registered'
      return
    }

    if (isManual) {
      await submitRegistration({
        dni: cleanDni,
        apellidosNombres: manualNombres.value.trim(),
        campus: manualCampus.value.trim(),
        facultad: manualFacultad.value.trim(),
        escuelaProfesional: manualEP.value.trim(),
      })
    } else {
      await submitRegistration({
        ...docente.value!,
        campus: docente.value!.campus ?? '',
        facultad: docente.value!.facultad ?? '',
        escuelaProfesional: docente.value!.escuelaProfesional ?? '',
      })
    }

    submitStatus.value = 'success'
    dni.value = ''
    docente.value = null
    dniStatus.value = 'idle'
    manualMode.value = false
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ''
    submitStatus.value = msg === 'already-registered' ? 'already-registered' : 'error'
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-1">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500
                 flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0">
        <svg class="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293
               l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <div>
        <h2 class="text-base font-bold text-slate-800 leading-none mb-0.5">Formulario de Inscripción</h2>
        <p class="text-[11px] text-slate-400">Ingresa tu DNI para autocompletar tus datos</p>
      </div>
    </div>

    <!-- Éxito inscripción -->
    <div v-if="submitStatus === 'success'"
      class="flex flex-col items-center gap-3 py-6 text-center">
      <div class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
        <svg class="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div>
        <p class="text-base font-bold text-slate-800">¡Inscripción exitosa!</p>
        <p class="text-xs text-slate-500 mt-1">Tu registro al evento ha sido confirmado. Te esperamos.</p>
      </div>
      <button type="button"
        class="mt-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
        @click="submitStatus = 'idle'">
        Inscribir otro docente
      </button>
    </div>

    <template v-else>
      <!-- DNI field -->
      <div>
        <label class="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
          DNI / CE
          <span class="ml-1.5 normal-case text-[10px] font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            Requerido
          </span>
        </label>
        <div class="relative">
          <input
            v-model="dni"
            type="text"
            inputmode="numeric"
            maxlength="12"
            placeholder="Ej: 45678901 o 001642136"
            :class="[
              'w-full pl-4 pr-11 py-3 rounded-xl border text-sm font-medium',
              'transition-all duration-200 outline-none',
              dniStatus === 'found'
                ? 'border-emerald-400 bg-emerald-50/50 text-slate-800 ring-2 ring-emerald-400/15'
                : dniStatus === 'not-found'
                  ? 'border-amber-300 bg-amber-50/30 text-slate-800 ring-2 ring-amber-300/15'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15',
            ]"
          />
          <!-- Status icon -->
          <div class="absolute right-3 top-1/2 -translate-y-1/2">
            <svg v-if="dniStatus === 'loading'" class="w-4.5 h-4.5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <div v-else-if="dniStatus === 'found'"
              class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div v-else-if="dniStatus === 'not-found'"
              class="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"/>
              </svg>
            </div>
          </div>
        </div>
        <p class="text-[11px] text-slate-400 mt-1">Ingresa tu DNI (8 dígitos) o CE (hasta 12 dígitos). Los datos se rellenarán automáticamente.</p>
      </div>

      <!-- DNI no encontrado: opción manual -->
      <div v-if="dniStatus === 'not-found' && !manualMode"
        class="rounded-xl border border-amber-200 bg-amber-50 p-4 flex flex-col gap-3">
        <div class="flex items-start gap-2.5">
          <svg class="w-4.5 h-4.5 text-amber-500 shrink-0 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"/>
          </svg>
          <div>
            <p class="text-xs font-semibold text-amber-800">DNI no encontrado en el padrón</p>
            <p class="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
              Si eres docente de reciente incorporación, puedes registrar tus datos manualmente.
            </p>
          </div>
        </div>
        <button
          type="button"
          @click="enableManualMode"
          class="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold
                 transition-colors duration-200 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          Ingresar mis datos manualmente
        </button>
      </div>

      <!-- Modo manual: campos editables -->
      <template v-if="manualMode">
        <div class="rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 flex items-start gap-2">
          <svg class="w-4 h-4 text-blue-500 shrink-0 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-[11px] text-blue-700 leading-relaxed">
            Completa tus datos. Solo <span class="font-semibold">Apellidos y Nombres</span> es obligatorio.
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <BaseInput
            label="Apellidos y Nombres *"
            v-model="manualNombres"
            placeholder="Ej: MAMANI QUISPE, Juan Carlos"
          />
          <BaseInput
            label="Campus Adscrito"
            v-model="manualCampus"
            placeholder="Ej: Juliaca"
          />
          <BaseInput
            label="Facultad Adscrita"
            v-model="manualFacultad"
            placeholder="Ej: Facultad de Ingeniería"
          />
          <BaseInput
            label="Escuela Profesional"
            v-model="manualEP"
            placeholder="Ej: Ingeniería de Sistemas"
          />
        </div>

        <button
          type="button"
          @click="cancelManualMode"
          class="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer transition-colors text-center"
        >
          ← Cancelar y volver
        </button>
      </template>

      <!-- Campos autocompletados (modo normal) -->
      <div v-if="!manualMode" class="flex flex-col gap-3">
        <BaseInput
          label="Apellidos y Nombres"
          :model-value="docente?.apellidosNombres ?? ''"
          placeholder="Se completará automáticamente"
          :readonly="true"
        />
        <BaseInput
          label="Campus Adscrito"
          :model-value="docente?.campus ?? ''"
          placeholder="Se completará automáticamente"
          :readonly="true"
        />
        <BaseInput
          label="Facultad Adscrita"
          :model-value="docente?.facultad ?? ''"
          placeholder="Se completará automáticamente"
          :readonly="true"
        />
        <BaseInput
          label="Escuela Profesional"
          :model-value="docente?.escuelaProfesional ?? ''"
          placeholder="Se completará automáticamente"
          :readonly="true"
        />
      </div>

      <!-- Alert: ya inscrito -->
      <AlertMessage
        v-if="submitStatus === 'already-registered'"
        type="warning"
        title="Ya estás inscrito"
        message="Este DNI ya tiene una inscripción registrada para el evento."
      />

      <!-- Alert: error -->
      <AlertMessage
        v-if="submitStatus === 'error'"
        type="error"
        title="Error al inscribirse"
        message="Ocurrió un problema al procesar tu inscripción. Intenta nuevamente."
      />

      <!-- Submit -->
      <button
        type="button"
        :disabled="
          submitStatus === 'loading' ||
          (!manualMode && dniStatus !== 'found') ||
          (manualMode && !manualNombres.trim())
        "
        :class="[
          'w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl',
          'text-sm font-semibold text-white transition-all duration-300',
          (dniStatus === 'found' || canSubmitManual()) && submitStatus !== 'loading'
            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 btn-primary-glow cursor-pointer active:scale-[0.98]'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed',
        ]"
        @click="handleSubmit"
      >
        <svg v-if="submitStatus === 'loading'" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <svg v-else class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
               M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
        {{ submitStatus === 'loading' ? 'Registrando...' : 'Registrarme al evento' }}
      </button>
    </template>

  </div>
</template>
