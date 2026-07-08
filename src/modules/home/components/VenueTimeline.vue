<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { eventConfig } from '@/config/event'
import VenueCard from './VenueCard.vue'

const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % eventConfig.venues.length
  }, 3000)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="flex flex-col gap-3 animate-fade-in-up-d3">

    <!-- Etiqueta de sección -->
    <div class="flex items-center gap-3 mb-1">
      <div class="flex items-center gap-1.5 shrink-0">
        <svg class="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.14em]">
          Sedes del evento
        </span>
      </div>
      <div class="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
    </div>

    <!-- Grid de 3 cards con zoom secuencial -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
      <div
        v-for="(venue, index) in eventConfig.venues"
        :key="venue.city"
        :class="[
          'transition-all duration-700 ease-in-out',
          activeIndex === index
            ? 'scale-[1.07] z-10'
            : 'scale-[0.95] opacity-75',
        ]"
        style="transform-origin: center center;"
      >
        <VenueCard
          :venue="venue"
          :index="index"
          :is-active="activeIndex === index"
        />
      </div>
    </div>

    <!-- Indicadores de progreso -->
    <div class="flex items-center justify-center gap-2 mt-1">
      <button
        v-for="(venue, index) in eventConfig.venues"
        :key="venue.city"
        type="button"
        :aria-label="`Sede ${venue.city}`"
        :class="[
          'h-1 rounded-full transition-all duration-500 cursor-pointer',
          activeIndex === index
            ? 'w-6 bg-cyan-400'
            : 'w-2 bg-white/25 hover:bg-white/40',
        ]"
        @click="activeIndex = index"
      />
    </div>

  </div>
</template>
