<template>
  <v-text-field
    v-model.number="tournament.settings.expectedPlayers"
    label="Erwartete Spieleranzahl"
    type="number"
    required
  ></v-text-field>
  <v-text-field
    v-model.number="tournament.settings.duration"
    label="Gewünschte Dauer (Std)"
    type="number"
    required
  ></v-text-field>
  <v-switch
    v-model.boolean="tournament.settings.managePlayers"
    label="Spieler verwalten"
    required
  ></v-switch>
  <v-switch
    v-model.boolean="tournament.settings.trackKnockouts"
    label="Knockouts verfolgen"
    required
  ></v-switch>
  <v-switch
    v-model.boolean="tournament.settings.managePayouts"
    label="Preisausschüttung verwalten"
    required
  ></v-switch>
  <v-text-field
    v-model.number="tournament.settings.buyIn"
    label="Buy-in"
    type="number"
    required
  ></v-text-field>
</template>
  
  <script lang="ts" setup>
  const { tournament }  = storeToRefs(useTournamentDialogStore())
  </script>
  