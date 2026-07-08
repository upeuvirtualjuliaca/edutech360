<script setup lang="ts">
import RegistrationForm from './RegistrationForm.vue'
import InquirySection from './InquirySection.vue'

defineEmits<{ close: [] }>()
</script>

<template>
  <!--
    Sin animate-float aquí: dentro del modal el movimiento vertical
    choca con la animación de entrada del propio modal.
    El float queda reservado para cuando el card está en layout fijo.
  -->
  <div class="rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/30 border border-slate-100/80">

    <!-- Shimmer top bar -->
    <div class="h-[3px] shimmer-bar"></div>

    <!-- Registration form -->
    <div class="bg-white px-5 py-6 sm:px-7 sm:py-7">
      <RegistrationForm />
    </div>

    <!-- Divider -->
    <div class="bg-white px-5 sm:px-7">
      <div class="flex items-center gap-3 border-t border-slate-100 pt-5 pb-4">
        <div class="flex-1 h-px bg-slate-100"></div>
        <span class="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">o bien</span>
        <div class="flex-1 h-px bg-slate-100"></div>
      </div>
    </div>

    <!-- Inquiry section -->
    <div class="bg-white px-5 pb-6 sm:px-7 sm:pb-7">
      <InquirySection />
    </div>

    <!-- Card footer -->
    <div class="bg-slate-50 px-5 sm:px-7 py-3.5 border-t border-slate-100 flex items-center gap-2">
      <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
      </svg>
      <p class="text-[11px] text-slate-400">
        Tu información está protegida y es de uso exclusivo para este evento.
      </p>
    </div>

  </div>
</template>
