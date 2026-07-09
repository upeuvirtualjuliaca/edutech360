<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { eventConfig } from '@/config/event'
import VenueCard from './VenueCard.vue'

const HOLD_MS = 4000  // tiempo en cada tarjeta
const SLIDE_MS = 750   // duración del deslizamiento

const venues = eventConfig.venues
const current = ref(0)
const animate = ref(true) // false → salto instantáneo (snap-back)

// ── Timer ──────────────────────────────────────────────────
let timer: ReturnType<typeof setInterval>

function startTimer() {
  timer = setInterval(advance, HOLD_MS)
}

function stopTimer() {
  clearInterval(timer)
}

function resetTimer() {
  stopTimer()
  startTimer()
}

// ── Navegación ─────────────────────────────────────────────

/** Avance automático: desliza al siguiente o hace snap-back al primero */
function advance() {
  if (current.value < venues.length - 1) {
    animate.value = true
    current.value++
  } else {
    // Último → regresa rápido sin animación
    animate.value = false
    current.value = 0
    // Re-habilita la animación en el siguiente frame de pintura
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        animate.value = true
      })
    )
  }
}

/** Navegación manual por los dots */
function goTo(index: number) {
  if (index === current.value) return
  animate.value = true
  current.value = index
  resetTimer()
}

onMounted(startTimer)
onUnmounted(stopTimer)
</script>

<template>
  <div class="flex flex-col gap-3 animate-fade-in-up-d3">

    <!-- ── Cabecera de sección ─────────────────────────── -->
    <div class="flex items-center gap-3 mb-1">
      <div class="flex items-center gap-1.5 shrink-0">
        <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0
               l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.14em]">
          Sedes del evento
        </span>
      </div>
      <div class="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
      <span class="text-[10px] text-slate-500 tabular-nums shrink-0">
        {{ current + 1 }}&nbsp;/&nbsp;{{ venues.length }}
      </span>
    </div>

    <!-- ── Track del carrusel ─────────────────────────── -->
    <div class="overflow-hidden rounded-2xl">
      <div class="flex" :style="{
        transform: `translateX(-${current * 100}%)`,
        transition: animate
          ? `transform ${SLIDE_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
          : 'none',
      }">
        <div v-for="(venue, idx) in venues" :key="venue.city" class="w-full shrink-0">
          <VenueCard :venue="venue" :index="idx" />
        </div>
      </div>
    </div>

    <!-- ── Barra de progreso ───────────────────────────── -->
    <!--
      :key="current" fuerza el recreado del elemento en cada slide,
      reiniciando la animación CSS desde 0 automáticamente.
    -->
    <div class="h-[3px] bg-white/10 rounded-full overflow-hidden">
      <div :key="current" class="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
        :style="{ animation: `carouselProgress ${HOLD_MS}ms linear forwards` }"></div>
    </div>

    <!-- ── Dots de navegación ─────────────────────────── -->
    <div class="flex items-center justify-center gap-2">
      <button v-for="(_, idx) in venues" :key="idx" type="button" :aria-label="`Ir a sede ${idx + 1}`" :class="[
        'h-1.5 rounded-full transition-all duration-400 cursor-pointer focus:outline-none',
        idx === current
          ? 'w-7 bg-cyan-400 shadow-sm shadow-cyan-400/50'
          : 'w-1.5 bg-white/30 hover:bg-white/55 hover:w-3',
      ]" @click="goTo(idx)" />
    </div>

  </div>
</template>
