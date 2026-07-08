<script setup lang="ts">
interface Props {
  label: string
  modelValue: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  error?: string
  type?: string
  maxlength?: number
  hint?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: '',
  readonly: false,
  disabled: false,
  error: '',
  type: 'text',
  hint: '',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label class="text-sm font-semibold text-slate-700 tracking-wide">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :readonly="readonly || disabled"
        :maxlength="maxlength"
        :class="[
          'w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none',
          readonly || disabled
            ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed select-none'
            : error
              ? 'bg-white border-red-300 text-slate-800 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
              : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 hover:border-slate-300',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span
        v-if="readonly || disabled"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </span>
    </div>
    <p v-if="hint && !error" class="text-xs text-slate-400">{{ hint }}</p>
    <p v-if="error" class="text-xs text-red-500 flex items-center gap-1">
      <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
  </div>
</template>
