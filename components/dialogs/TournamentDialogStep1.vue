<template>
    <v-text-field
      v-model="tournament.name"
      label="Tournament Name"
      required
    ></v-text-field>
    <v-text-field
      v-model="tournament.date"
      label="Tournament Date"
      type="date"
      required
    ></v-text-field>
    <v-text-field
      v-model="tournament.startTime"
      label="Start Time"
      type="time"
      required
    ></v-text-field>
    <v-select
      v-model="tournament.template"
      :items="templates"
      label="Choose Template"
      required
    ></v-select>
  </template>
  
  <script lang="ts" setup>
  const { tournament }  = storeToRefs(useTournamentDialogStore())
  const templates = ['Default Template']

  </script>
  