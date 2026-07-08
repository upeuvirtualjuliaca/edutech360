<script setup lang="ts">
import { inject } from 'vue'
const openRegistrationForm = inject<() => void>('openRegistrationForm', () => {})
</script>

<template>
  <footer
    class="relative overflow-hidden"
    style="background: linear-gradient(135deg, #080e26 0%, #0b1437 50%, #0f2167 100%);"
  >
    <!-- Dot grid overlay -->
    <div
      class="absolute inset-0 pointer-events-none opacity-[0.03]"
      style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 26px 26px;"
    ></div>

    <!-- Glow blob decorativo -->
    <div
      class="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full blur-3xl pointer-events-none opacity-20"
      style="background: radial-gradient(circle, rgba(6,182,212,0.30) 0%, transparent 70%);"
    ></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">

      <!-- ── Cuerpo del footer ──────────────────────────────────────── -->
      <div class="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        <!-- Columna 1 — Brand -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <img
            src="@/assets/images/logo_upeu_white.svg"
            alt="Universidad Peruana Unión"
            class="h-8 w-auto object-contain"
          />
          <p class="text-slate-400 text-sm leading-relaxed max-w-sm">
            Espacio de innovación pedagógica para docentes universitarios comprometidos
            con transformar la educación superior en el Perú.
          </p>
          <!-- CTA inscripción -->
          <button
            type="button"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl mt-1
                   bg-gradient-to-r from-blue-600 to-cyan-500
                   hover:from-blue-500 hover:to-cyan-400
                   text-white text-sm font-semibold cursor-pointer
                   transition-all duration-200 active:scale-[0.98]
                   shadow-lg shadow-cyan-900/30 w-fit"
            @click="openRegistrationForm"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                   M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
            Inscribirme al evento
          </button>

          <!-- Etiqueta del evento -->
          <div class="flex items-center gap-2 mt-1">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                         text-cyan-400 border border-cyan-400/30"
                  style="background: rgba(6,182,212,0.10);">
              XXI Jornada Académica
            </span>
            <span class="text-slate-600 text-[10px] font-semibold uppercase tracking-widest">
              EduTech360
            </span>
          </div>
        </div>

        <!-- Columna 2 — Sedes -->
        <div class="flex flex-col gap-3">
          <h4 class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sedes</h4>
          <a href="#seccion-2" class="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors duration-200 shrink-0"></span>
            Lima — 20 Jul
          </a>
          <a href="#seccion-3" class="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors duration-200 shrink-0"></span>
            Juliaca — 22 Jul
          </a>
          <a href="#seccion-4" class="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors duration-200 shrink-0"></span>
            Tarapoto — 24 Jul
          </a>
        </div>

        <!-- Columna 3 — Información -->
        <div class="flex flex-col gap-3">
          <h4 class="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Información</h4>
          <div class="flex items-center gap-2 text-sm text-slate-400">
            <svg class="w-3.5 h-3.5 text-cyan-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Julio 2026
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-400">
            <svg class="w-3.5 h-3.5 text-cyan-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            7:30 a.m. — todas las sedes
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-400">
            <svg class="w-3.5 h-3.5 text-cyan-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Inscripción gratuita
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-400">
            <svg class="w-3.5 h-3.5 text-cyan-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Docentes universitarios
          </div>
        </div>

      </div>

      <!-- ── Divider ────────────────────────────────────────────────── -->
      <div class="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <!-- ── Copyright ──────────────────────────────────────────────── -->
      <div class="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-slate-600 text-center sm:text-left">
          © 2026 Universidad Peruana Unión. Todos los derechos reservados.
        </p>
        <p class="text-xs text-slate-700 text-center">
          EduTech360 · <span class="text-slate-600">Pedagogía que Transforma</span>
        </p>
      </div>

    </div>
  </footer>
</template>
