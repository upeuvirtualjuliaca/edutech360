<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('seccion-1')
const menuOpen = ref(false)
const scrolled = ref(false)

const navItems = [
  { id: 'seccion-1', label: 'Inicio' },
  { id: 'seccion-2', label: 'Lima' },
  { id: 'seccion-3', label: 'Juliaca' },
  { id: 'seccion-4', label: 'Tarapoto' },
]

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  menuOpen.value = false
}

function onScroll() {
  scrolled.value = window.scrollY > 40
}

let observer: IntersectionObserver

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  )

  navItems.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
})
</script>

<template>
  <nav
    :class="[
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled
        ? 'shadow-lg shadow-black/20'
        : '',
    ]"
    style="backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
           background: rgba(8, 14, 38, 0.82); border-bottom: 1px solid rgba(255,255,255,0.07);"
  >
    <div class="max-w-7xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between gap-6">

      <!-- Logo -->
      <button
        type="button"
        class="shrink-0 cursor-pointer"
        @click="scrollTo('seccion-1')"
        aria-label="Ir al inicio"
      >
        <img
          src="@/assets/images/logo_upeu_white.svg"
          alt="Universidad Peruana Unión"
          class="h-6 w-auto object-contain"
        />
      </button>

      <!-- Links — desktop -->
      <div class="hidden sm:flex items-center gap-1">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          :class="[
            'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer',
            activeSection === item.id
              ? 'text-cyan-400 bg-cyan-400/10'
              : 'text-slate-400 hover:text-white hover:bg-white/6',
          ]"
          @click="scrollTo(item.id)"
        >
          {{ item.label }}
          <!-- indicador activo -->
          <span
            v-if="activeSection === item.id"
            class="block h-px bg-cyan-400 mt-0.5 rounded-full transition-all duration-300"
          ></span>
        </button>
      </div>

      <!-- Hamburger — mobile -->
      <button
        type="button"
        class="sm:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-colors duration-200 cursor-pointer"
        :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'"
        @click="menuOpen = !menuOpen"
      >
        <svg v-if="!menuOpen" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

    </div>

    <!-- Menú mobile desplegable -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="menuOpen"
        class="sm:hidden border-t px-4 py-3 flex flex-col gap-1"
        style="border-color: rgba(255,255,255,0.07); background: rgba(8,14,38,0.95);"
      >
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          :class="[
            'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer',
            activeSection === item.id
              ? 'text-cyan-400 bg-cyan-400/10'
              : 'text-slate-400 hover:text-white hover:bg-white/6',
          ]"
          @click="scrollTo(item.id)"
        >
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </nav>

  <!-- Espaciador para que el contenido no quede bajo el nav fijo -->
  <div class="h-14"></div>
</template>
