<script setup lang="ts">
import { ref } from 'vue'
import AlertMessage from '@/components/feedback/AlertMessage.vue'

const dniConsulta = ref('')
const inquiryStatus = ref<'idle' | 'loading' | 'found' | 'not-found'>('idle')
</script>

<template>
  <div class="flex flex-col gap-3">

    <!-- Header -->
    <div class="flex items-center gap-2.5">
      <div
        class="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600
               flex items-center justify-center shrink-0"
      >
        <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <div>
        <h3 class="text-sm font-bold text-slate-800 leading-none mb-0.5">Consultar mi inscripción</h3>
        <p class="text-[11px] text-slate-400">Verifica si ya te encuentras registrado</p>
      </div>
    </div>

    <!-- Input + button row -->
    <div class="flex gap-2">
      <input
        v-model="dniConsulta"
        type="text"
        inputmode="numeric"
        maxlength="8"
        placeholder="Tu DNI (8 dígitos)"
        class="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white
               text-slate-700 text-sm transition-all duration-200 outline-none
               focus:border-slate-400 focus:ring-2 focus:ring-slate-300/20 hover:border-slate-300"
      />
      <button
        type="button"
        :disabled="dniConsulta.length !== 8 || inquiryStatus === 'loading'"
        :class="[
          'shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold',
          'border transition-all duration-200',
          dniConsulta.length === 8 && inquiryStatus !== 'loading'
            ? 'border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer'
            : 'border-slate-200 text-slate-400 cursor-not-allowed',
        ]"
      >
        <svg
          v-if="inquiryStatus !== 'loading'"
          class="w-3.5 h-3.5 shrink-0"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <svg
          v-else
          class="w-3.5 h-3.5 shrink-0 animate-spin"
          fill="none" viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Consultar
      </button>
    </div>

    <!-- Results -->
    <AlertMessage
      v-if="inquiryStatus === 'found'"
      type="success"
      title="¡Estás registrado!"
      message="Tu inscripción al evento ha sido confirmada. Te esperamos."
    />
    <AlertMessage
      v-else-if="inquiryStatus === 'not-found'"
      type="warning"
      title="Sin inscripción encontrada"
      message="No encontramos un registro con este DNI. Usa el formulario de arriba para inscribirte."
    />

  </div>
</template>
