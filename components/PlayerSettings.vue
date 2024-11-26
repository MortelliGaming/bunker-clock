<template>
    <v-form @submit.prevent="submitForm" ref="form">
      <v-card class="pa-4">
        <v-card-title>Spielereinstellungen</v-card-title>
        <v-card-text>
          <v-container>
            <!-- Max. Spieler -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.maxPlayers"
                  label="Max. Spieler"
                  type="number"
                  min="1"
                  max="1000"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
  
            <!-- Spieler pro Tisch -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.playersPerTable"
                  label="Spieler pro Tisch"
                  type="number"
                  min="1"
                  max="10"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
  
            <!-- Anzahl der Spieler am Finaltisch
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.playersAtFinalTable"
                  label="Anzahl der Spieler am Finaltisch"
                  type="number"
                  min="1"
                  max="10"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            -->
            <!-- Zusätzliche Sitze reservieren
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.playersAtFinalTable"
                  label="Zusätzliche Sitze reservieren"
                  type="number"
                  min="1"
                  max="1000"
                  required
                ></v-text-field>
              </v-col>
            </v-row>  -->
          </v-container>
        </v-card-text>
  
        <v-card-actions>
          <v-btn type="submit" color="primary" :disabled="!formIsValid">
            Speichern
          </v-btn>
          <v-btn type="reset" color="secondary" @click.prevent="resetForm">
            Zurücksetzen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref, computed } from 'vue';
  
  const router = ref(useRouter())
  const tournamentsStore = useTournamentsStore()
  const tournament = computed(() => {
    return tournamentsStore.tournaments.find(t => t.id == router.value.currentRoute.params.id)
  })
  // Reactive form data
  const formData = ref({
    maxPlayers: (tournament.value?.settings.playerParameters?.maxPlayers ?? 0),
    playersPerTable: (tournament.value?.settings.playerParameters?.playersPerTable ?? 0),
    // playersAtFinalTable: 9,
    // reserveExtraSeats: 0,
  });
  
  // Form reference
  const form = ref(null);
  
  // Computed property to check if form is valid
  const formIsValid = computed(() => {
    return (
      formData.value.maxPlayers > 0 &&
      formData.value.playersPerTable > 0 // &&
      // formData.playersAtFinalTable > 0 &&
      // formData.maxPlayers >= formData.playersPerTable
    );
  });
  
  // Submit handler
  function submitForm() {
    if (!formIsValid.value) {
      console.error('Form is invalid');
      return;
    }
    if(tournament.value) {
        if(!tournament.value.settings.playerParameters) {
            tournament.value.settings.playerParameters = {
                maxPlayers: 0,
                playersPerTable: 0,
            }
        }
        tournament.value.settings.playerParameters.maxPlayers = formData.value.maxPlayers;
        tournament.value.settings.playerParameters.playersPerTable = formData.value.playersPerTable;
        tournamentsStore.updateTournament(tournament.value.id, {
            settings: tournament.value.settings,
        })
    }
    console.log('Form submitted:', formData);
  }
  
  // Reset handler
  function resetForm() {
    if(tournament.value) {
        formData.value.maxPlayers = tournament.value.settings.playerParameters.maxPlayers
        formData.value.playersPerTable = tournament.value.settings.playerParameters.playersPerTable
    }
    // formData.playersAtFinalTable = 9;
    // formData.reserveExtraSeats = 0;
  }
  </script>
  
  <style scoped>
  /* Optional custom styling */
  .v-card {
    max-width: 500px;
    margin: 0 auto;
  }
  </style>
  