<script setup lang="ts">
import { eventConfig } from '@/config/event'

defineEmits<{ 'open-form': [] }>()
</script>

<template>
  <div class="flex flex-col gap-5">

    <!-- Live badge -->
    <div class="animate-fade-in-up">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/35 bg-cyan-400/8">
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
        <span class="text-cyan-300 text-[11px] font-semibold uppercase tracking-[0.15em]">
          {{ eventConfig.edition }}
        </span>
      </div>
    </div>

    <!-- Event name -->
    <div class="animate-fade-in-up-d1">
      <h1 class="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-[0.95] tracking-tight">
        {{ eventConfig.name }}
      </h1>
    </div>

    <!-- Tagline -->
    <div class="animate-fade-in-up-d2">
      <p class="text-xl sm:text-2xl font-bold gradient-text italic leading-snug">
        "Pedagog<span class="font-black not-italic text-cyan-300 ml-0.5">IA</span> que Transforma"
      </p>
    </div>

    <!-- Description -->
    <div class="animate-fade-in-up-d2">
      <p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
        {{ eventConfig.description }}
      </p>
    </div>

    <!-- Stats pills -->
    <div class="flex flex-wrap items-center gap-2.5 animate-fade-in-up-d3">
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/20">
        <svg class="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span class="text-xs font-semibold text-blue-200">3 ciudades</span>
      </div>

      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/20">
        <svg class="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span class="text-xs font-semibold text-cyan-200">Julio 2025</span>
      </div>

      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-500/20">
        <svg class="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="text-xs font-semibold text-purple-200">7:30 a.m.</span>
      </div>

      <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20">
        <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04
               A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622
               0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
        <span class="text-xs font-semibold text-emerald-200">Ingreso gratuito</span>
      </div>
    </div>

    <!-- CTA button -->
    <div class="animate-fade-in-up-d4 pt-1">
      <button
        type="button"
        class="group inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl
               bg-gradient-to-r from-blue-600 to-cyan-500
               hover:from-blue-500 hover:to-cyan-400
               text-white font-semibold text-sm
               shadow-lg shadow-blue-700/40 hover:shadow-blue-600/50
               transition-all duration-300 active:scale-[0.97]
               btn-primary-glow"
        @click="$emit('open-form')"
      >
        <!-- Icon: clipboard check -->
        <svg class="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
               M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
        Inscríbeme al evento
        <!-- Arrow -->
        <svg
          class="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
        </svg>
      </button>
    </div>

  </div>
</template>
