<script setup lang="ts">
import type { Venue } from '@/config/event'
import { useCountdown } from '@/composables/useCountdown'

const props = defineProps<{
  venue: Venue
  index: number
  isActive?: boolean
}>()

const { days, hours, minutes, seconds, expired } = useCountdown(props.venue.targetDate)

function scrollToSection() {
  const el = document.getElementById(`seccion-${props.index + 2}`)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div
    :class="[
      'glass-card rounded-2xl p-4 cursor-pointer group flex flex-col gap-3 transition-all duration-700',
      isActive ? 'border-cyan-400/50 shadow-lg shadow-cyan-500/20' : '',
      index === 0 ? 'animate-fade-in-up-d1' :
      index === 1 ? 'animate-fade-in-up-d2' :
                    'animate-fade-in-up-d3',
    ]"
    @click="scrollToSection"
  >
    <!-- ── Header: región · ciudad · badge fecha ─────── -->
    <div class="flex items-start justify-between gap-2">
      <div class="flex flex-col gap-0.5 min-w-0">
        <span class="text-[9px] font-bold text-cyan-400/80 uppercase tracking-widest">
          {{ venue.region }}
        </span>
        <h3 class="text-sm font-bold text-white leading-tight">{{ venue.city }}</h3>
      </div>

      <div
        class="flex flex-col items-center px-2 py-1 rounded-lg border border-white/10
               bg-white/8 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/10
               transition-all duration-300 shrink-0"
      >
        <span class="text-[8px] font-black text-cyan-400 uppercase tracking-wide leading-none mb-0.5">
          Jul
        </span>
        <span class="text-base font-black text-white leading-none">{{ venue.day }}</span>
      </div>
    </div>

    <!-- ── Divider ───────────────────────────────────── -->
    <div class="h-px bg-gradient-to-r from-white/15 via-white/8 to-transparent"></div>

    <!-- ── Auditorio y hora ──────────────────────────── -->
    <div class="flex flex-col gap-1.5">
      <div class="flex items-start gap-1.5 text-slate-300">
        <div class="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center shrink-0 mt-px">
          <svg class="w-2.5 h-2.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5
                 M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <span class="text-[10px] leading-snug">{{ venue.venue }}</span>
      </div>

      <div class="flex items-center gap-1.5 text-slate-300">
        <div class="w-4 h-4 rounded bg-cyan-500/20 flex items-center justify-center shrink-0">
          <svg class="w-2.5 h-2.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <span class="text-[10px] font-semibold text-slate-200">{{ venue.time }}</span>
      </div>
    </div>

    <!-- ── Countdown ─────────────────────────────────── -->
    <div class="rounded-xl bg-black/30 border border-white/8 px-3 py-2 mt-auto">

      <!-- Evento pasado -->
      <div v-if="expired" class="flex items-center justify-center gap-1.5 py-0.5">
        <svg class="w-3 h-3 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="text-[10px] font-semibold text-emerald-400">Evento realizado</span>
      </div>

      <!-- Countdown activo -->
      <template v-else>
        <p class="text-[8px] font-semibold text-slate-500 uppercase tracking-widest text-center mb-1.5">
          Faltan
        </p>

        <!-- Días -->
        <div class="flex items-baseline justify-center gap-1 mb-1.5">
          <span class="text-2xl font-black text-white tabular-nums leading-none">{{ days }}</span>
          <span class="text-[9px] font-bold text-cyan-400/80 uppercase">días</span>
        </div>

        <!-- Línea separadora -->
        <div class="h-px bg-white/10 mb-1.5"></div>

        <!-- hh : mm : ss -->
        <div class="flex items-center justify-center gap-1">
          <div class="flex flex-col items-center">
            <span class="text-xs font-black text-white/90 tabular-nums leading-none">{{ hours }}</span>
            <span class="text-[7px] font-semibold text-slate-500 uppercase mt-0.5">hrs</span>
          </div>
          <span class="text-white/25 text-xs pb-3">:</span>
          <div class="flex flex-col items-center">
            <span class="text-xs font-black text-white/90 tabular-nums leading-none">{{ minutes }}</span>
            <span class="text-[7px] font-semibold text-slate-500 uppercase mt-0.5">min</span>
          </div>
          <span class="text-white/25 text-xs pb-3">:</span>
          <div class="flex flex-col items-center">
            <span class="text-xs font-black text-white/90 tabular-nums leading-none">{{ seconds }}</span>
            <span class="text-[7px] font-semibold text-slate-500 uppercase mt-0.5">seg</span>
          </div>
        </div>
      </template>
    </div>

    <!-- ── Indicador de sede ─────────────────────────── -->
    <div class="flex items-center justify-between pt-1 border-t border-white/[0.07]">
      <div class="flex gap-1">
        <div
          v-for="i in 3" :key="i"
          :class="[
            'h-1 rounded-full transition-all duration-300',
            i === index + 1 ? 'w-4 bg-cyan-400' : 'w-1.5 bg-white/20',
          ]"
        ></div>
      </div>
      <span class="flex items-center gap-1 text-[9px] text-cyan-400/60 group-hover:text-cyan-400 transition-colors duration-300">
        Ver sede
        <svg class="w-2.5 h-2.5 translate-y-0 group-hover:translate-y-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </span>
    </div>
  </div>
</template>
