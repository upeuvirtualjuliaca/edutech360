<script setup lang="ts">
import { ref, provide } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import EventHero from '../components/EventHero.vue'
import VenueTimeline from '../components/VenueTimeline.vue'
import RegistrationCard from '../components/RegistrationCard.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import LimaSection from '../components/LimaSection.vue'
import JuliacaSection from '../components/JuliacaSection.vue'
import TarapotoSection from '../components/TarapotoSection.vue'
import AppFooter from '../components/AppFooter.vue'

const showForm = ref(false)
provide('openRegistrationForm', () => { showForm.value = true })
</script>

<template>
  <DefaultLayout>

    <!-- ══ Sección 1 — Hero principal ══════════════════════════════════ -->
    <section id="seccion-1">

    <div class="relative min-h-screen overflow-hidden animate-gradient-bg"
      style="background: linear-gradient(135deg, #090e2a 0%, #0d1b5e 35%, #071833 65%, #0b1240 100%);">
      <!-- Glow blobs -->
      <div class="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none animate-blob"
        style="background: radial-gradient(circle, rgba(6,182,212,0.16) 0%, transparent 70%);"></div>
      <div
        class="absolute bottom-0 -left-20 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none animate-blob-delay"
        style="background: radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%);"></div>
      <div class="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-2xl pointer-events-none opacity-20"
        style="background: radial-gradient(circle, rgba(139,92,246,0.30) 0%, transparent 70%);"></div>

      <!-- Dot grid overlay -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.04]"
        style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 26px 26px;"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 py-10 sm:px-10 sm:py-12 lg:py-14">

        <!-- Brand -->
        <div class="mb-10 animate-fade-in-up">
          <img src="@/assets/images/logo_upeu_white.svg" alt="Universidad Peruana Unión"
            class="h-8 w-auto object-contain" />
        </div>

        <!--
          Layout principal: dos columnas en desktop
          • Izquierda (2fr ≈ 40 %): Hero + CTA
          • Derecha  (3fr ≈ 60 %): 3 tarjetas de sedes apiladas
        -->
        <div class="flex flex-col lg:grid lg:grid-cols-[2fr_3fr] lg:gap-10 xl:gap-14 mb-10">

          <!-- Columna izquierda — Hero -->
          <div class="flex flex-col justify-center">
            <EventHero @open-form="showForm = true" />
          </div>

          <!-- Columna derecha — Sedes -->
          <div class="mt-10 lg:mt-0">
            <VenueTimeline />
          </div>

        </div>

        <!-- Footer note -->
        <div class="flex items-start gap-2.5 pt-6 border-t border-white/[0.08] animate-fade-in-up-d4">
          <svg class="w-4 h-4 text-slate-500 shrink-0 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-xs text-slate-400 leading-relaxed">
            La inscripción es <span class="text-slate-300 font-medium">gratuita</span>
            y exclusiva para docentes universitarios de la institución.
          </p>
        </div>

      </div>
    </div>

    </section>
    <!-- ══ / Sección 1 ═════════════════════════════════════════════════ -->

    <!-- ══ Sección 2 — Sede Lima ══════════════════════════════════════ -->
    <LimaSection />

    <!-- ══ Sección 3 — Sede Juliaca ════════════════════════════════════ -->
    <JuliacaSection />

    <!-- ══ Sección 4 — Sede Tarapoto ═══════════════════════════════════ -->
    <TarapotoSection />

    <!-- ══ Footer ══════════════════════════════════════════════════════ -->
    <AppFooter />

    <!-- Modal — formulario de inscripción -->
    <BaseModal :open="showForm" @close="showForm = false">
      <RegistrationCard @close="showForm = false" />
    </BaseModal>

  </DefaultLayout>
</template>
