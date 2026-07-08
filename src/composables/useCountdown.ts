import { ref, computed, onMounted, onUnmounted, type ComputedRef } from 'vue'

export interface CountdownResult {
  days: ComputedRef<string>
  hours: ComputedRef<string>
  minutes: ComputedRef<string>
  seconds: ComputedRef<string>
  expired: ComputedRef<boolean>
}

/**
 * Retorna un contador regresivo reactivo hacia `targetDate`.
 * Se actualiza cada segundo. Se limpia automáticamente al desmontar.
 *
 * @param targetDate  Cadena ISO 8601 con timezone, ej: '2025-07-20T07:30:00-05:00'
 */
export function useCountdown(targetDate: string): CountdownResult {
  const now = ref(Date.now())
  const target = new Date(targetDate).getTime()

  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    timer = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  const remaining = computed(() => Math.max(0, target - now.value))
  const expired   = computed(() => remaining.value === 0)

  const pad = (n: number) => String(n).padStart(2, '0')

  const days    = computed(() => pad(Math.floor(remaining.value / 86_400_000)))
  const hours   = computed(() => pad(Math.floor((remaining.value % 86_400_000) / 3_600_000)))
  const minutes = computed(() => pad(Math.floor((remaining.value % 3_600_000)  / 60_000)))
  const seconds = computed(() => pad(Math.floor((remaining.value % 60_000)     / 1_000)))

  return { days, hours, minutes, seconds, expired }
}
