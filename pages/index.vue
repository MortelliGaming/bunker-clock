<template>
    <!-- Club Lobby Section -->
    <v-container>
    <v-row>
        <v-col cols="12">
        <v-card>
            <v-row no-gutters>
                <v-col cols="3">
                    <v-img
                        src="/icons/bunkerclock.png"
                        alt="Club Logo"
                        height="200px" />
                </v-col>
                <v-col>
                    <div class="d-flex">
                        <v-card-title>Bunker Poker</v-card-title>
                        <v-btn @click="openSettings" icon>
                            <v-icon>mdi-cogs</v-icon>
                        </v-btn>
                        <v-btn @click="openMembers" icon>
                            <v-icon>mdi-account-group</v-icon>
                        </v-btn>
                    </div>
                    <v-spacer class="mt-3" />
                    <v-card-subtitle>BNPK</v-card-subtitle>
                    <v-spacer class="mt-5"/>
                    <v-btn color="accent" @click="createTournament">
                        <v-icon>mdi-plus</v-icon> Turnier
                    </v-btn>
                    <v-btn color="info" @click="createLeague">
                        <v-icon>mdi-plus</v-icon>  Liga
                    </v-btn>
                </v-col>
            </v-row>
            <v-row class="bg-blue-grey-lighten-1" no-gutters>
                <v-col>
                    <v-tabs>
                        <v-tab>
                            Turniere
                        </v-tab>
                        <v-tab>
                            Ligen
                        </v-tab>
                    </v-tabs>
                </v-col>
            </v-row>
        </v-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="6" xs="12">
            <tournament-card
                class="mt-3"
                v-for="tournament in tournaments"
                :key="tournament.id"
                :title="tournament.name"
                :date="tournament.date + ' ' + tournament.startTime"
                :expected-players="tournament.settings.expectedPlayers"
                @open="() => navigateToTournament(tournament.id)"
                @delete="() => deleteTournament(tournament.id)"
                @download="() => downloadTournament(tournament.id)"
                @duplicate="() => duplicateTournament(tournament.id)"
            />
        </v-col>
    </v-row>
    </v-container>
    <tournament-dialog ref="tournamentDialog"/>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue';
  import TournamentDialog from '~/components/dialogs/TournamentDialog.vue';
  
  const router = useRouter()
  const tournamentDialog = ref<InstanceType<typeof TournamentDialog>>();
  const {
    removeTournament,
    addTournament
  } = useTournamentsStore();
  const {
    tournaments
  } = storeToRefs(useTournamentsStore());

  const createTournament = () => {
    tournamentDialog.value?.show()
  };

  const duplicateTournament = (id: string) => {
    const toDuplicateTournament = Object.assign({}, tournaments.value.find(t => t.id == id))
    toDuplicateTournament.id = ''
    toDuplicateTournament.name += ' (Copy)'
    addTournament(toDuplicateTournament)
  };

  const deleteTournament = (id: string) => {
    removeTournament(id)
  };

  const downloadTournament = (id: string) => {
    const tournamentToDownload = tournaments.value.find(t => t.id == id)
    if(tournamentToDownload) {
      // Convert the tournament object to a JSON string
      const jsonString = JSON.stringify(tournamentToDownload, null, 2); // Pretty-print with 2 spaces
      
      // Create a Blob from the JSON string
      const blob = new Blob([jsonString], { type: 'application/json' });

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      
      // Set the file name
      link.download = `tournament_${id}.json`;
      
      // Append the link to the document body (needed for Firefox)
      document.body.appendChild(link);
      
      // Trigger the download by simulating a click
      link.click();
      
      // Clean up by removing the link element
      document.body.removeChild(link);
    }
  };

  const joinClub = () => {
    console.log('Join existing club');
  };
  
  const openSettings = () => {
    console.log('Open club settings');
  };
  
  const openMembers = () => {
    console.log('View members');
  };
  
  const createLeague = () => {
    console.log('Create new league');
  };

  function navigateToTournament(id: string) {
    router.push(`/tournament/${id}`)
  }
  </script>
  
  <style scoped>
  .tc-bv-orange {
    color: #f57c00;
  }
  </style>