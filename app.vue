<template>
  <NuxtPwaManifest />
  <v-app id="inspire">
    <v-main>
      <nuxt-page />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const tournamentsStore = useTournamentsStore()

const drawer = ref(null)
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
</script>