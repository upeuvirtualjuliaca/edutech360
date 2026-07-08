<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-overlay">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-900/65 backdrop-blur-sm"
          @click="emit('close')"
        ></div>

        <!-- Modal card -->
        <Transition name="modal-card" appear>
          <div
            v-if="open"
            class="relative z-10 w-full max-w-[460px] max-h-[92vh] overflow-y-auto
                   scrollbar-styled-light rounded-3xl shadow-2xl"
          >
            <!-- Close button — floating top-right -->
            <button
              type="button"
              class="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full
                     bg-white/90 hover:bg-white border border-slate-200
                     flex items-center justify-center text-slate-500 hover:text-slate-800
                     transition-all duration-200 shadow-sm hover:shadow-md
                     focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              @click="emit('close')"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <!-- Slot: RegistrationCard goes here -->
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop fade */
.modal-overlay-enter-active { transition: opacity 0.25s ease; }
.modal-overlay-leave-active { transition: opacity 0.20s ease; }
.modal-overlay-enter-from,
.modal-overlay-leave-to    { opacity: 0; }

/* Card spring-in / fade-out */
.modal-card-enter-active {
  transition: opacity 0.30s ease, transform 0.32s cubic-bezier(0.34, 1.46, 0.64, 1);
}
.modal-card-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.modal-card-enter-from {
  opacity: 0;
  transform: scale(0.90) translateY(20px);
}
.modal-card-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
