<template>
    <v-card @click="() => emit('open')" class="pointy border-2 border-transparent hover:border-orange-500">
      <v-card-title class="pad">
        <div>
          <div class="headline">{{ title }}</div>
          <div class="subheading">{{  date }}</div>
          <div class="subheading pt-2">
            {{ expectedPlayers }} Erwartete Spieleranzahl
          </div>
        </div>
      </v-card-title>
      <v-card-text class="pb-0">
        <br />
        <br />
        <v-divider/>
      </v-card-text>
  
      <v-card-actions class="pt-1">
        <v-row no-gutters>
            <v-col class="d-flex align-center">
                <v-btn @click.stop="openTournament">
                    Öffnen
                </v-btn>
            </v-col>
            <v-col>
                <v-btn icon @click.stop="downloadTournament">
                    <v-icon>mdi-download</v-icon>
                </v-btn>
                <v-btn icon @click.stop="deleteTournament">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </template>
  
  <script lang="ts" setup>
  const emit = defineEmits(['open', 'delete', 'download'])

  const props = defineProps({
    title: String,
    date: String,
    expectedPlayers: Number,
  })

  const openTournament = () => {
    emit('open')
    // Handle open tournament logic
  };
  
  const downloadTournament = () => {
    // Handle register tournament logic
    emit('download')
  };
  
  const deleteTournament = () => {
    emit('delete')
    // Handle delete tournament logic
  };
  </script>
  
  <style scoped>
  .pointy {
    border-radius: 8px; /* Make the card corners rounded */
  }
  
  .pad {
    padding: 16px;
  }
  
  .top-grey {
    background-color: #f5f5f5; /* Light grey background for the actions */
  }
  
  .v-card-title .headline {
    font-size: 24px;
    font-weight: 500;
  }
  
  .v-card-title .subheading {
    font-size: 14px;
    color: #555;
  }
  
  .v-btn {
    margin-right: 8px;
  }
  </style>
  