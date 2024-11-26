<template>
    <!-- Club Lobby Section -->
    <v-container>
    <v-row>
        <v-col cols="12" md="4">
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
                v-for="tournament in tournamentsStore.tournaments"
                :key="tournament.id"
                :title="tournament.name"
                :date="tournament.date + ' ' + tournament.startTime"
                :expected-players="tournament.settings.expectedPlayers"
                @open="() => navigateToTournament(tournament.id)"
            />
        </v-col>
    </v-row>
    </v-container>
    <new-tournament-dialog ref="newTournmentDialog"/>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue';
  import type NewTournamentDialog from '~/components/NewTournamentDialog.vue';
  
  const router = useRouter()
  const newTournmentDialog = ref<InstanceType<typeof NewTournamentDialog>>();
  const tournamentsStore = useTournamentsStore()
  // Methods to handle button clicks
  const createClub = () => {
    console.log('Create new club');
  };

  const createTournament = () => {
    console.log('Create new tournament');
    console.log(newTournmentDialog.value);
    newTournmentDialog.value?.show()
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