<template>
    <v-col class="tournament-box" cols="3">
      <v-img
        src="/icons/bunkerclock.png"
        alt="Club Logo"
        height="200px" />
      <div class="d-flex flex-column pt-3">
        <h2 class="text-center text-orange special-label">Spieler</h2>
        <h3 class="text-center special-label stack-number">
          {{ remainingPlayers }} / {{ totalPlayers }}
        </h3>
      </div>
      <div class="d-flex flex-column pt-3 pb-2">
        <h2 class="text-center text-orange special-label">∅ Stack</h2>
        <h3 class="text-center special-label stack-number">{{ averageStack }}</h3>
      </div>
    </v-col>
  </template>
  
  <script>
  export default {
    name: 'PlayerInfo',
    props: {
      remainingPlayers: {
        type: Number,
        required: true,
      },
      totalPlayers: {
        type: Number,
        required: true,
      },
      averageStack: {
        type: String,
        required: true,
      }
    }
  }
  </script>
  
  <style scoped>
  .text-orange {
    color: orange;
  }
  .special-label {
    font-weight: bold;
    font-size: 1.2em;
  }
  .stack-number {
    font-size: 2em;
    font-weight: bold;
  }
  </style>
  