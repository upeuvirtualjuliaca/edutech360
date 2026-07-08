<script setup lang="ts">
interface Props {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  title?: string
}

defineProps<Props>()

const config = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    icon: 'text-emerald-500',
    titleColor: 'text-emerald-900',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    icon: 'text-red-500',
    titleColor: 'text-red-900',
    iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    icon: 'text-blue-500',
    titleColor: 'text-blue-900',
    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    icon: 'text-amber-500',
    titleColor: 'text-amber-900',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
}
</script>

<template>
  <div
    :class="['flex items-start gap-3 p-4 rounded-xl border', config[type].bg]"
    role="alert"
  >
    <svg
      :class="['w-5 h-5 shrink-0 mt-0.5', config[type].icon]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" :d="config[type].iconPath" />
    </svg>
    <div class="flex flex-col gap-0.5">
      <p v-if="title" :class="['text-sm font-semibold', config[type].titleColor]">{{ title }}</p>
      <p :class="['text-sm', config[type].text]">{{ message }}</p>
    </div>
  </div>
</template>
