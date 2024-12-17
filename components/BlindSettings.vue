<template>
    <v-form @submit.prevent="submitForm" ref="form">
      <v-card class="pa-4">
        <v-card-title>Turniereinstellungen</v-card-title>
        <v-card-text>
          <v-container>
            <!-- Chipset -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.chipset"
                  label="Chipset"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
  
            <!-- Turnierart -->
            <v-row>
              <v-col cols="12">
                <v-select
                    v-model="formData.tournamentType"
                    :items="['Freezeout', 'Rebuy-Turnier', 'Re-Entry Tournier']"
                    label="Turnierart"
                    required
                ></v-select>
              </v-col>
            </v-row>
  
            <!-- Anfänglicher Small Blind -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.smallBlind"
                  label="Anfänglicher Small Blind"
                  type="number"
                  min="1"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
  
            <!-- Startstack -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.startStack"
                  label="Startstack"
                  type="number"
                  min="1"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
  
            <!-- Rebuy-Chips -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.rebuyChips"
                  label="Rebuy-Chips"
                  type="number"
                  min="1"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
  
            <!-- Addon-Chips -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.addonChips"
                  label="Addon-Chips"
                  type="number"
                  min="1"
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
  import { reactive, ref, computed, watch } from 'vue';
  
  // Router and store setup
  const router = ref(useRouter());
  const { tournaments } = storeToRefs(useTournamentsStore())
  const { updateTournament } = useTournamentsStore()
  // Reactive tournament data
  const tournament = computed(() => {
    return tournaments.value.find(t => t.id === router.value.currentRoute.params.id) ?? null;
  });
  
  // Reactive form data setup
  const formData = reactive({
    duration: tournament.value?.settings?.duration ?? 1,
    chipset: tournament.value?.chipset?.join(',') ?? '',
    tournamentType: tournament.value?.settings?.tournamentType ?? 'Freezeout',
    smallBlind: tournament.value?.chipset?.[0] ?? 5,
    startStack: tournament.value?.settings?.startStack ?? 1000000,
    // levelTime: tournament.value?.settings?.levelTime ?? 155,
    rebuyChips: tournament.value?.settings?.rebuyChips ?? 0,
    addonChips: tournament.value?.settings?.addonChips ?? 0
  });
  
  // Computed property to check if form is valid
  const formIsValid = computed(() => {
    return formData.duration > 0 && formData.smallBlind > 0 && formData.startStack > 0;
  });
  
  // Submit handler
  function submitForm() {
    if (!formIsValid.value) {
      console.error('Form is invalid');
      return;
    }
    if (tournament.value) {
      tournament.value.chipset = formData.chipset.split(',').map(n => Number(n));
      tournament.value.settings.tournamentType = formData.tournamentType as any;
      tournament.value.settings.rebuyChips = formData.rebuyChips;
      tournament.value.settings.addonChips = formData.addonChips;
      tournament.value.settings.startStack = formData.startStack;
      tournament.value.settings.duration = formData.duration;
      updateTournament(tournament.value.id, tournament.value);
    }
  }
  
  // Reset handler
  function resetForm() {
    if (tournament.value) {
      formData.chipset = tournament.value.chipset?.join(',') ?? '';
      formData.startStack = tournament.value.settings?.startStack ?? 1000;
      formData.addonChips = tournament.value.settings?.addonChips ?? 0;
      formData.rebuyChips = tournament.value.settings?.rebuyChips ?? 0;
      formData.tournamentType = tournament.value.settings?.tournamentType ?? 'Freezeout';
      formData.duration = tournament.value.settings?.duration ?? 1;
    }
  }
  </script>
  
  
  
  <style scoped>
  .v-card {
    max-width: 500px;
    margin: 0 auto;
  }
  </style>
  