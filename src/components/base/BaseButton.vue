<script setup lang="ts">
interface Props {
  label?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
  fullWidth: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      fullWidth ? 'w-full' : '',
      size === 'sm' ? 'px-4 py-2 text-sm' : size === 'lg' ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm',
      variant === 'primary'
        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 focus:ring-blue-500 shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]'
        : variant === 'secondary'
          ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-400 border border-blue-100'
          : variant === 'outline'
            ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-400'
            : 'text-slate-600 hover:bg-slate-100 focus:ring-slate-300',
      (disabled || loading) ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
    ]"
    @click="$emit('click', $event)"
  >
    <svg
      v-if="loading"
      class="w-4 h-4 animate-spin shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    <slot>{{ label }}</slot>
  </button>
</template>
