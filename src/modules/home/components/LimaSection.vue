<script setup lang="ts">
import { inject } from 'vue'
const openRegistrationForm = inject<() => void>('openRegistrationForm', () => {})
</script>

<template>
  <section id="seccion-2" class="bg-white">
    <div class="max-w-7xl mx-auto px-6 py-16 sm:px-10 sm:py-20 lg:py-24">

      <!-- ── Encabezado de sección ───────────────────────────────────── -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
        <div>
          <span class="inline-flex items-center gap-2 text-xs font-bold text-cyan-600 uppercase tracking-widest mb-3">
            <span class="w-6 h-px bg-cyan-500 inline-block"></span>
            Sede Lima
          </span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            Campus Lima — <span class="text-blue-700">Ñaña</span>
          </h2>
          <p class="mt-2 text-slate-500 text-sm max-w-xl leading-relaxed">
            El campus central de la Universidad Peruana Unión, ubicado en el corazón del valle de Ñaña,
            a orillas del río Rímac, a solo 19.5 km de Lima.
          </p>
        </div>

        <!-- Badge fecha -->
        <div class="flex items-center gap-3 shrink-0">
          <div class="text-center px-5 py-3 rounded-2xl border-2 border-blue-100 bg-blue-50">
            <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Julio 2026</p>
            <p class="text-4xl font-black text-blue-700 leading-none">20</p>
            <p class="text-[10px] font-semibold text-blue-500 mt-0.5">Lunes</p>
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
              <span class="text-xs">Lima, Perú</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Contenido principal: mapa + info ───────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">

        <!-- Mapa embebido -->
        <div class="rounded-3xl overflow-hidden border border-slate-200 shadow-lg shadow-slate-200/60 aspect-video lg:aspect-auto lg:min-h-[380px]">
          <iframe
            title="Universidad Peruana Unión — Campus Lima"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.364695994376!2d-76.84001502394042!3d-11.989726041217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c7b2a9eaaaab%3A0x4b2c2c2c2c2c2c2c!2sUniversidad%20Peruana%20Uni%C3%B3n!5e0!3m2!1ses!2spe!4v1720000000000!5m2!1ses!2spe"
            width="100%"
            height="100%"
            style="border:0; display:block; min-height:380px;"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <!-- Información de la sede -->
        <div class="flex flex-col gap-6">

          <!-- Auditorio -->
          <div class="rounded-2xl bg-blue-50 border border-blue-100 p-5">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                <svg class="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5
                       M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <div>
                <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Auditorio</p>
                <p class="text-base font-bold text-slate-900 leading-tight">Alva &amp; Alva</p>
              </div>
            </div>
            <p class="text-xs text-slate-500 leading-relaxed">
              Moderno auditorio con capacidad para cientos de asistentes, equipado con tecnología de audio
              y proyección de última generación.
            </p>
          </div>

          <!-- Dirección -->
          <div class="rounded-2xl bg-slate-50 border border-slate-200 p-5">
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-4.5 h-4.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dirección</p>
                <p class="text-sm font-semibold text-slate-800 leading-snug">
                  Carretera Central km 19.5
                </p>
                <p class="text-xs text-slate-500 mt-0.5">
                  Ñaña, Lurigancho-Chosica, Lima
                </p>
              </div>
            </div>
          </div>

          <!-- Detalles adicionales -->
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-slate-200 p-4 text-center">
              <svg class="w-5 h-5 text-cyan-500 mx-auto mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Región</p>
              <p class="text-sm font-bold text-slate-800 mt-0.5">Costa</p>
            </div>

            <div class="rounded-xl border border-slate-200 p-4 text-center">
              <svg class="w-5 h-5 text-cyan-500 mx-auto mb-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modalidad</p>
              <p class="text-sm font-bold text-slate-800 mt-0.5">Presencial</p>
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
            href="https://maps.app.goo.gl/YGdHGQoGCGfWfbsB6"
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
