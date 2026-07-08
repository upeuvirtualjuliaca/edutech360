<script setup lang="ts">
import { inject } from 'vue'
const openRegistrationForm = inject<() => void>('openRegistrationForm', () => {})
</script>

<template>
  <section id="seccion-4" class="bg-white">
    <div class="max-w-7xl mx-auto px-6 py-16 sm:px-10 sm:py-20 lg:py-24">

      <!-- ── Encabezado de sección ───────────────────────────────────── -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
        <div>
          <span class="inline-flex items-center gap-2 text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3">
            <span class="w-6 h-px bg-cyan-500 inline-block"></span>
            Sede Tarapoto
          </span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            Campus Tarapoto — <span class="text-emerald-600">Selva</span>
          </h2>
          <p class="mt-2 text-slate-500 text-sm max-w-xl leading-relaxed">
            El campus de la Universidad Peruana Unión en la Amazonía peruana, rodeado de
            naturaleza exuberante en la Ciudad de las Palmeras, San Martín.
          </p>
        </div>

        <!-- Badge fecha -->
        <div class="flex items-center gap-3 shrink-0">
          <div class="text-center px-5 py-3 rounded-2xl border-2 border-emerald-100 bg-emerald-50">
            <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Julio 2026</p>
            <p class="text-4xl font-black text-emerald-700 leading-none">24</p>
            <p class="text-[10px] font-semibold text-emerald-600 mt-0.5">Viernes</p>
          </div>
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-1.5 text-slate-600">
              <svg class="w-4 h-4 text-cyan-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm font-semibold">7:30 a.m.</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-500">
              <svg class="w-4 h-4 text-cyan-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span class="text-xs">Tarapoto, San Martín</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Contenido principal: mapa + info ───────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">

        <!-- Mapa embebido -->
        <div class="rounded-3xl overflow-hidden border border-slate-200 shadow-lg shadow-slate-200/60 aspect-video lg:aspect-auto lg:min-h-[380px]">
          <iframe
            title="Universidad Peruana Unión — Campus Tarapoto"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.1234567890!2d-76.3701234!3d-6.4890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91b00aaaaaaaaa%3A0xcccccccccccccccc!2sUniversidad%20Peruana%20Uni%C3%B3n%20Tarapoto!5e0!3m2!1ses!2spe!4v1720000000002!5m2!1ses!2spe"
            width="100%"
            height="100%"
            style="border:0; display:block; min-height:380px;"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <!-- Información de la sede -->
        <div class="flex flex-col gap-5">

          <!-- Auditorio -->
          <div class="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5
                       M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Auditorio</p>
                <p class="text-base font-bold text-slate-900 leading-tight">De la Fe</p>
              </div>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">
              Auditorio emblemático del campus amazónico de la UPeU, espacio de encuentro
              académico y espiritual para la comunidad universitaria de la región selva.
            </p>
          </div>

          <!-- Dirección -->
          <div class="rounded-2xl bg-slate-50 border border-slate-200 p-5">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dirección</p>
                <p class="text-sm font-semibold text-slate-800 leading-snug">
                  Carretera Tarapoto — Morales km 1.5
                </p>
                <p class="text-xs text-slate-500 mt-0.5">
                  Morales, San Martín
                </p>
              </div>
            </div>
          </div>

          <!-- Chips -->
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-slate-200 p-4 text-center">
              <svg class="w-5 h-5 text-emerald-500 mx-auto mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Región</p>
              <p class="text-sm font-bold text-slate-800 mt-0.5">Selva</p>
            </div>

            <div class="rounded-xl border border-slate-200 p-4 text-center">
              <!-- leaf / nature icon -->
              <svg class="w-5 h-5 text-emerald-500 mx-auto mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clima</p>
              <p class="text-sm font-bold text-slate-800 mt-0.5">Tropical</p>
            </div>
          </div>

          <!-- CTA inscripción -->
          <button
            type="button"
            class="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl
                   bg-gradient-to-r from-blue-600 to-cyan-500
                   hover:from-blue-700 hover:to-cyan-600
                   text-white text-sm font-semibold cursor-pointer
                   transition-all duration-200 shadow-md shadow-blue-200 active:scale-[0.98]"
            @click="openRegistrationForm"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                   M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
            Inscribirme al evento
          </button>

          <!-- CTA mapa -->
          <a
            href="https://maps.app.goo.gl/tarapoto-upeu"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-2 w-full py-2.5 px-5 rounded-xl
                   border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300
                   text-sm font-medium transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Cómo llegar al campus
          </a>

        </div>
      </div>

    </div>
  </section>
</template>
