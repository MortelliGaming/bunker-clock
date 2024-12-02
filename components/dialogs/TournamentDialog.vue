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
              <tournament-dialog-step1
              />
            </template>
  
            <!-- Step 2 -->
            <template v-slot:item.2>
              <tournament-dialog-step2
              />
            </template>
  
            <!-- Step 3 -->
            <template v-slot:item.3>
              <tournament-dialog-step3
              />
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
                    <v-btn
                        v-if="step == 1"
                        @click="uploadTournament">Import</v-btn>
                    <v-btn v-if="step < 3" :disabled="isStepInvalid" @click="() => props.onClick()">Next</v-btn>
                    <v-btn v-else :disabled="isStepInvalid" @click="() => saveTournament()">Erstellen</v-btn>
                </template>
            </v-stepper-actions>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
    <input type="file" ref="fileInput" accept=".json" style="display: none" @change="handleFileUpload" />
  </template>
  
  <script lang="ts" setup>
  import TournamentDialogStep1 from './TournamentDialogStep1.vue';
  import TournamentDialogStep2 from './TournamentDialogStep2.vue';
  import TournamentDialogStep3 from './TournamentDialogStep3.vue';
  
  const { tournaments } = storeToRefs(useTournamentsStore())
  // Tournament To Create
  const { tournament }  = storeToRefs(useTournamentDialogStore())

  const { createTournament, resetTournament }  = useTournamentDialogStore()
  const { saveTournamentsToLocalStorage } = useTournamentsStore()

  const dialog = ref(false);
  const step = ref(1);

  const fileInput = ref<HTMLInputElement | null>(null); // Reference to the file input

  // Trigger the file selection dialog programmatically
  const uploadTournament = () => {
    if (fileInput.value) {
      fileInput.value.click(); // Trigger the file input dialog
    }
  };

  const nextStep = () => {
    if (step.value < 3) step.value++;
  };
  
  const lastStep = () => {
    if (step.value > 1) step.value--;
  };

  function saveTournament() {
      createTournament();
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
  
  const handleFileUpload = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      // Read the file as text
      const reader = new FileReader();
      reader.onload = () => {
        try {
          // Parse the JSON content of the file
          const jsonData = JSON.parse(reader.result as string);

          // Find the tournament to update (you can customize this)
          const tournamentIndex = (tournaments.value ?? []).findIndex(t => t.id === jsonData.id);
          if (tournamentIndex !== -1) {
            // Update the tournament data with the parsed JSON
            tournaments.value[tournamentIndex] = jsonData;
          } else {
            if(!tournaments.value) {
              tournaments.value = [];
            }
            tournaments.value.push(jsonData);
          }
          saveTournamentsToLocalStorage();
        } catch (error) {
          console.log(error)
          alert('Error parsing the file. Please make sure it is a valid JSON.');
        }
      };
      // Read the file as text
      reader.readAsText(file);
    } else {
      alert('No file selected!');
    }
    closeDialog();
  };
  
  const isStepInvalid = computed(() => {
    switch (step.value) {
      case 1:
        return !tournament.value.name || !tournament.value.date || !tournament.value.startTime || !tournament.value.template;
      case 2:
        return !tournament.value.settings.expectedPlayers || !tournament.value.settings.duration || !tournament.value.settings.buyIn;
      case 3:
        return !(tournament.value.chipset.length > 0) || !tournament.value.settings.smallBlind || !tournament.value.settings.startStack;
      default:
        return false;
    }
  });
  
  const resetForm = () => {
    resetTournament()
  };


  resetForm();

  defineExpose({
    show,
  });
  </script>
  