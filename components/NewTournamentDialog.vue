<template>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Create Tournament</span>
        </v-card-title>
  
        <v-divider></v-divider>
        <v-card-text style="overflow-y: scroll;">
          <v-stepper
            hide-actions
            v-model="step" :items="['Datum', 'Turnier', 'Stacks/Blinds']" vertical>
            <!-- Step 1 -->
            <template v-slot:item.1>
              <v-text-field
                v-model="tournamentSettings.name"
                label="Tournament Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="tournamentSettings.date"
                label="Tournament Date"
                type="date"
                required
              ></v-text-field>
              <v-text-field
                v-model="tournamentSettings.startTime"
                label="Start Time"
                type="time"
                required
              ></v-text-field>
              <v-select
                v-model="tournamentSettings.template"
                :items="templates"
                label="Choose Template"
                required
              ></v-select>
            </template>
  
            <!-- Step 2 -->
            <template v-slot:item.2>
              <v-text-field
                v-model.number="tournamentSettings.settings.expectedPlayers"
                label="Erwartete Spieleranzahl"
                type="number"
                required
              ></v-text-field>
              <v-text-field
                v-model.number="tournamentSettings.settings.duration"
                label="Gewünschte Dauer (Std)"
                type="number"
                required
              ></v-text-field>
              <v-switch
                v-model.boolean="tournamentSettings.settings.managePlayers"
                label="Spieler verwalten"
                required
              ></v-switch>
              <v-switch
                v-model.boolean="tournamentSettings.settings.trackKnockouts"
                label="Knockouts verfolgen"
                required
              ></v-switch>
              <v-switch
                v-model.boolean="tournamentSettings.settings.managePayouts"
                label="Preisausschüttung verwalten"
                required
              ></v-switch>
              <v-text-field
                v-model.number="tournamentSettings.settings.buyIn"
                label="Buy-in"
                type="number"
                required
              ></v-text-field>
            </template>
  
            <!-- Step 3 -->
            <template v-slot:item.3>
              <v-text-field
                v-model="chipset"
                label="Chipset (comma-separated values)"
                hint="Enter chip values as numbers, e.g., 25, 50, 100"
                required
              ></v-text-field>
              <v-text-field
                v-model.number="tournamentSettings.settings.smallBlind"
                label="Anfänglicher Small Blind"
                type="number"
                required
              ></v-text-field>
              <v-text-field
                v-model.number="tournamentSettings.settings.startStack"
                label="Startstack"
                type="number"
                required
              ></v-text-field>
              <v-select
                v-model="tournamentSettings.settings.tournamentType"
                :items="['Freezeout', 'Rebuy-Turnier', 'Re-Entry Tournier']"
                label="Turnierart"
                required
              ></v-select>
              <v-switch
                v-model.boolean="tournamentSettings.settings.antes"
                label="Antes"
                required
              ></v-switch>
              <v-text-field
                v-model.number="tournamentSettings.settings.rebuyChips"
                label="Rebuy-Chips"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model.number="tournamentSettings.settings.addonChips"
                label="Addon-Chips"
                type="number"
              ></v-text-field>
            </template>
  
            <!-- Actions -->
            <v-divider class="mb-2"></v-divider>
            <v-stepper-actions :disabled="(step <= 1 ? 'prev' : false)" @click:next="nextStep()" @click:prev="lastStep()">
                <template #prev="{ props }">
                    <v-btn
                        :disabled="step == 1"
                        @click="() => props.onClick()">Zurück</v-btn>
                </template>
                <template #next="{ props }">
                    <v-btn v-if="step < 3" :disabled="isStepInvalid" @click="() => props.onClick()">Next</v-btn>
                    <v-btn v-else :disabled="isStepInvalid" @click="() => saveTournament()">Erstellen</v-btn>
                </template>
            </v-stepper-actions>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue';
  
  const tournamentsStore = useTournamentsStore()

  const dialog = ref(false);
  const step = ref(1);
  
  const tournamentSettings = ref<Tournament>({
    id: '',
    name: '',
    date: '',
    startTime: '',
    template: '',
    chipset: [],
    players: [],
    settings: {
      levels: [],
      expectedPlayers: 0,
      playerParameters: {
        maxPlayers: 0,
        playersPerTable:  0,
      },
      duration: 0,
      managePlayers: false,
      trackKnockouts: false,
      managePayouts: false,
      buyIn: 0,
      smallBlind: 0,
      startStack: 0,
      tournamentType: 'Freezeout',
      antes: false,
      rebuyChips: 0,
      addonChips: 0,
    },
  });

  const templates = ['Template 1', 'Template 2', 'Template 3'];
  
  const chipset = ref('');
  
  const nextStep = () => {
    if (step.value < 3) step.value++;
  };
  
  const lastStep = () => {
    if (step.value > 1) step.value--;
  };

  function saveTournament() {
      tournamentSettings.value.chipset = chipset.value.split(',').map(Number)
      tournamentsStore.addTournament(tournamentSettings.value)
      closeDialog();
  }
  
  const closeDialog = () => {
    dialog.value = false;
    resetForm();
  };
  
  const show = () => {
    resetForm();
    dialog.value = true;
  };
  
  
  const isStepInvalid = computed(() => {
    switch (step.value) {
      case 1:
        return !tournamentSettings.value.name || !tournamentSettings.value.date || !tournamentSettings.value.startTime || !tournamentSettings.value.template;
      case 2:
        return !tournamentSettings.value.settings.expectedPlayers || !tournamentSettings.value.settings.duration || !tournamentSettings.value.settings.buyIn;
      case 3:
        return !chipset.value || !tournamentSettings.value.settings.smallBlind || !tournamentSettings.value.settings.startStack;
      default:
        return false;
    }
  });
  
  const resetForm = () => {
    tournamentSettings.value = {
      id: '',
      name: '',
      date: '',
      startTime: '',
      template: '',
      chipset: [],
      players: [],
      settings: {
        levels: [],
        expectedPlayers: 0,
        managePlayers: false,
        playerParameters: {
          maxPlayers: 0,
          playersPerTable:  0,
        },
        duration: 0,
        trackKnockouts: false,
        managePayouts: false,
        buyIn: 0,
        smallBlind: 0,
        startStack: 0,
        tournamentType: 'Freezeout',
        antes: false,
        rebuyChips: 0,
        addonChips: 0,
      },
    }
  };
  
  defineExpose({
    show,
  });
  </script>
  
  <style scoped>
  /* Custom styles can be added here */
  </style>
  