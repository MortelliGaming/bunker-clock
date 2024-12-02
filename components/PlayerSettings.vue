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
  import { ref, computed } from 'vue';
  
  const router = ref(useRouter())
  const { tournaments } = storeToRefs(useTournamentsStore())
  const { updateTournament } = useTournamentsStore()

  const tournament = computed(() => {
    return tournaments.value.find(t => t.id == router.value.currentRoute.params.id)
  })
  // Reactive form data
  const formData = ref({
    maxPlayers: (tournament.value?.settings.playerParameters?.maxPlayers ?? 0),
    playersPerTable: (tournament.value?.settings.playerParameters?.playersPerTable ?? 0),
  });
  
  // Form reference
  const form = ref(null);
  
  // Computed property to check if form is valid
  const formIsValid = computed(() => {
    return (
      formData.value.maxPlayers > 0 &&
      formData.value.playersPerTable > 0
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
        updateTournament(tournament.value.id, {
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
  }
  </script>
  
  <style scoped>
  /* Optional custom styling */
  .v-card {
    max-width: 500px;
    margin: 0 auto;
  }
  </style>
  