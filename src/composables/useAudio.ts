import { ref } from 'vue'

// Estado singleton — compartido entre todos los componentes
const playing = ref(false)
const _play = ref<(() => void) | null>(null)
const _stop = ref<(() => void) | null>(null)

function play() {
  _play.value?.()
}

function stop() {
  _stop.value?.()
}

function register(playFn: () => void, stopFn: () => void) {
  _play.value = playFn
  _stop.value = stopFn
}

export function useAudio() {
  return { playing, play, stop, register }
}
