<template>
    <v-row class="fill-height" no-gutters>
      <!-- Current Blinds Section -->
      <v-col cols="12" class="d-flex flex-column justify-center align-center pa-0" style="border-bottom: 1px solid;">
        <h3 class="text-orange">Current Blinds</h3> 
        <div class="blind-number" v-if="currentLevel && !currentLevel.isBreak">
          {{ currentLevel.smallBlind }} / {{ currentLevel.bigBlind }}
        </div>
        <div class="blind-number" v-else>
          {{ 'Pause' }}
        </div>
      </v-col>
      
      <!-- Next Blinds Section -->
      <v-col cols="12" class="d-flex flex-column justify-center align-center">
        <h3 class="text-orange">Next Blinds</h3>
        <div class="blind-number" v-if="nextLevel && !nextLevel.isBreak">
          {{ nextLevel.smallBlind }} / {{ nextLevel.bigBlind }}
        </div>
        <div class="blind-number" v-else>
          {{ 'Pause' }}
        </div>
      </v-col>
    </v-row>
  </template>
  
  <script lang="ts" setup>
  const props = defineProps({
        currentLevel: {
            type: Object as PropType<TournamentLevel>,
            required: true,
        },
        nextLevel: {
            type: Object as PropType<TournamentLevel>,
            required: true,
        },
    })
  </script>
  
  <style scoped>
  .text-orange {
    color: orange;
  }
  .blind-number {
    font-size: 1.5em;
    font-weight: bold;
  }
  </style>
  