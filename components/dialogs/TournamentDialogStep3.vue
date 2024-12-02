<template>
  <v-text-field
    v-model="chipset"
    @change="chipsetChanged"
    label="Chipset (comma-separated values)"
    hint="Enter chip values as numbers, e.g., 25, 50, 100"
    required
  ></v-text-field>
  <v-text-field
    v-model.number="tournament.settings.smallBlind"
    label="Anfänglicher Small Blind"
    type="number"
    required
  ></v-text-field>
  <v-text-field
    v-model.number="tournament.settings.startStack"
    label="Startstack"
    type="number"
    required
  ></v-text-field>
  <v-select
    v-model="tournament.settings.tournamentType"
    :items="['Freezeout', 'Rebuy-Turnier', 'Re-Entry Tournier']"
    label="Turnierart"
    required
  ></v-select>
  <v-switch
    v-model.boolean="tournament.settings.antes"
    label="Antes"
    required
  ></v-switch>
  <v-text-field
    v-model.number="tournament.settings.rebuyChips"
    label="Rebuy-Chips"
    type="number"
  ></v-text-field>
  <v-text-field
    v-model.number="tournament.settings.addonChips"
    label="Addon-Chips"
    type="number"
  ></v-text-field>
</template>
  
  <script lang="ts" setup>
  const { tournament }  = storeToRefs(useTournamentDialogStore())
  const chipset = ref('');

  function chipsetChanged() {
    tournament.value.chipset = chipset.value.split(',').map(Number)
  }

  </script>
  