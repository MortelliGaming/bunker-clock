<template>
  <NuxtPwaManifest />
  <v-app id="inspire">
    <v-main>
      <nuxt-page />
    </v-main>
  </v-app>
  <!-- blinds-up-spinner
    v-if="timerStore.isRoundUp"
    :blindsText="currentLevel.isBreak ? 'Pause' : (currentLevel.smallBlind + ' / ' + currentLevel.bigBlind)" /> -->
</template>

<script lang="ts" setup>

const tournamentsStore = useTournamentsStore()
const timerStore = useTimerStore()

onMounted(() => {
  tournamentsStore.loadTournamentsFromLocalStorage();
  setTimeout(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, 200);
})


// Lifecycle cleanup
onUnmounted(() => {
  timerStore.stopTimer();
});
</script>