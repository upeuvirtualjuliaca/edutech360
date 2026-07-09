<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAudio } from '@/composables/useAudio'

const { playing, register } = useAudio()
const audio = ref<HTMLAudioElement | null>(null)

onMounted(() => {
  const el = audio.value!
  el.volume = 0.5

  el.addEventListener('ended', () => {
    playing.value = false
  })

  register(
    // play
    () => {
      el.currentTime = 0
      el.play().then(() => { playing.value = true }).catch(() => {})
    },
    // stop
    () => {
      el.pause()
      el.currentTime = 0
      playing.value = false
    }
  )
})

onUnmounted(() => {
  audio.value?.pause()
})
</script>

<template>
  <audio
    ref="audio"
    src="/audio/alexzavesa-calm-elegant-logo-519008.mp3"
    preload="auto"
  />
</template>
