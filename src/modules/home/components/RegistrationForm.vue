<script setup lang="ts">
import { ref, watch } from 'vue'
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

// Lookup automático al completar 8 dígitos
watch(dni, async (val) => {
  const clean = val.replace(/\D/g, '')
  if (clean.length !== 8) {
    dniStatus.value = 'idle'
    docente.value = null
    submitStatus.value = 'idle'
    return
  }
  dniStatus.value = 'loading'
  const result = await lookupDocenteByDni(clean)
  if (result) {
    docente.value = result
    dniStatus.value = 'found'
  } else {
    docente.value = null
    dniStatus.value = 'not-found'
  }
})

async function handleSubmit() {
  if (!docente.value || dniStatus.value !== 'found') return
  submitStatus.value = 'loading'
  try {
    const alreadyRegistered = await checkRegistration(docente.value.dni)
    if (alreadyRegistered) {
      submitStatus.value = 'already-registered'
      return
    }
    await submitRegistration({
      ...docente.value,
      campus:              docente.value.campus              ?? '',
      facultad:            docente.value.facultad            ?? '',
      escuelaProfesional:  docente.value.escuelaProfesional  ?? '',
    })
    submitStatus.value = 'success'
    dni.value = ''
    docente.value = null
    dniStatus.value = 'idle'
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
            maxlength="8"
            placeholder="Ej: 45678901"
            :class="[
              'w-full pl-4 pr-11 py-3 rounded-xl border text-sm font-medium',
              'transition-all duration-200 outline-none',
              dniStatus === 'found'
                ? 'border-emerald-400 bg-emerald-50/50 text-slate-800 ring-2 ring-emerald-400/15'
                : dniStatus === 'not-found'
                  ? 'border-red-300 bg-red-50/30 text-slate-800 ring-2 ring-red-300/15'
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
              class="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
          </div>
        </div>
        <p class="text-[11px] text-slate-400 mt-1">Al completar 8 dígitos, tus datos se rellenarán automáticamente.</p>
      </div>

      <!-- Alert: not found -->
      <AlertMessage
        v-if="dniStatus === 'not-found'"
        type="info"
        title="DNI no encontrado"
        message="No existe un docente con este DNI en el padrón. Verifica el número e inténtalo de nuevo."
      />

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

      <!-- Campos autocompletados -->
      <div class="flex flex-col gap-3">
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

      <!-- Submit -->
      <button
        type="button"
        :disabled="dniStatus !== 'found' || submitStatus === 'loading'"
        :class="[
          'w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl',
          'text-sm font-semibold text-white transition-all duration-300',
          dniStatus === 'found' && submitStatus !== 'loading'
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
