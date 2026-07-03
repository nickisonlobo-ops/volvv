<template>
  <div class="chat-bolha chat-bolha-audio" :class="de">
    <div class="chat-audio-container">
      <!-- Play/Pause button -->
      <button type="button" class="chat-audio-play" @click="togglePlay">
        <svg v-if="!playing" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>
      </button>

      <!-- Waveform + duration -->
      <div class="chat-audio-content">
        <div class="chat-audio-wave">
          <!-- Progress dot -->
          <div class="chat-audio-progress-dot" :style="{ left: (progress * 100) + '%' }" />
          <div class="chat-audio-bars">
            <div
              v-for="i in 40"
              :key="i"
              class="chat-audio-bar"
              :class="{ played: (i / 40) <= progress }"
              :style="{ height: barHeight(i) + 'px' }"
            />
          </div>
        </div>
        <div class="chat-audio-bottom">
          <span class="chat-audio-dur">{{ displayTime }}</span>
          <span class="chat-audio-hora">{{ hora }}</span>
          <svg v-if="de === 'in'" class="chat-audio-mic" width="14" height="14" viewBox="0 0 24 24" fill="var(--chat-accent)"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V22h2v-3.1A7 7 0 0 0 19 12h-2Z"/></svg>
        </div>
      </div>

      <!-- Avatar -->
      <div class="chat-audio-avatar">
        <img v-if="avatarUrl" :src="avatarUrl" />
        <span v-else class="chat-audio-avatar-placeholder">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z"/></svg>
        </span>
      </div>
    </div>
    <audio ref="audioEl" :src="url" preload="metadata" @timeupdate="onTimeUpdate" @ended="onEnded" @loadedmetadata="onLoaded" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  de: 'in' | 'out'
  url: string
  duracao: string
  hora: string
  avatarUrl?: string
}>()

const audioEl = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const progress = ref(0)
const currentTime = ref(0)
const totalDuration = ref(0)

const displayTime = computed(() => {
  if (playing.value || currentTime.value > 0) {
    const s = Math.floor(currentTime.value)
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }
  return props.duracao
})

function barHeight(i: number): number {
  // Simulated waveform pattern
  const seed = Math.abs(Math.sin(i * 2.1) * 0.6 + Math.cos(i * 0.9) * 0.4)
  return Math.max(3, seed * 24 + 3)
}

function togglePlay() {
  if (!audioEl.value) return
  if (playing.value) {
    audioEl.value.pause()
    playing.value = false
  } else {
    audioEl.value.play()
    playing.value = true
  }
}

function onTimeUpdate() {
  if (!audioEl.value || !audioEl.value.duration) return
  currentTime.value = audioEl.value.currentTime
  progress.value = audioEl.value.currentTime / audioEl.value.duration
}

function onLoaded() {
  if (audioEl.value) totalDuration.value = audioEl.value.duration
}

function onEnded() {
  playing.value = false
  progress.value = 0
  currentTime.value = 0
}
</script>
