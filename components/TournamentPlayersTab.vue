<template>
    <v-row class="fill-height">
      <v-col cols="12" sm="6">
        <player-settings />
      </v-col>
      <v-col cols="12" sm="6">
        <v-row>
            <v-col class="text-right">
                <v-btn @click="openNewPlayerDialog">Spieler registrieren</v-btn>
                <v-btn @click="shuffleSeats" class="ml-2">Plätze auslosen</v-btn>
            </v-col>
        </v-row>
        <v-spacer class="pt-2" />
        <v-table>
            <thead>
                <tr>
                    <th>Platz</th>
                    <th>Name</th>
                    <th>Start-Stack</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(player, i) in tournament?.players ?? []" :class="{'player-out': player.out > 0}">
                    <td>{{ player.seat ?? (i + ' (!)') }}</td>
                    <td>{{ player.name }} ({{ player.rebuys }}) {{ new Array(player.addons).fill('+').join('') }}</td>
                    <td>{{ tournament?.settings.startStack}}</td>
                    <td class="text-right">
                      <v-btn icon="mdi-dots-vertical">
                        <v-icon icon="mdi-dots-vertical" />
                        <popup-menu-player
                          :actions="menuActions"
                          @action-clicked="(action) => handleMenuAction(i, action)"
                        />
                      </v-btn>
                    </td>
                </tr>
            </tbody>
            
        </v-table>
      </v-col>
    </v-row>
    <new-player-dialog
      ref="newPlayerDialog"
      @save="addPlayer"
    ></new-player-dialog>
  </template>
  
  <script lang="ts" setup>
    import NewPlayerDialog from './NewPlayerDialog.vue';

    const router = ref(useRouter())
    const tournamentsStore = useTournamentsStore()
    const tournament = computed(() => {
        return tournamentsStore.tournaments.find(t => t.id == router.value.currentRoute.params.id)
    })


    const menuActions = [
      { id: 'elimination', label: 'Ausscheidung', icon: 'mdi-close-circle-outline' },
      { id: 'rebuy', label: 'Rebuy', icon: 'mdi-swap-horizontal' },
      { id: 'addon', label: 'Addon', icon: 'mdi-plus-circle-outline' },
      { id: 'unregister', label: 'Abmelden', icon: 'mdi-delete' },
    ];

    const newPlayerDialog = ref<InstanceType<typeof NewPlayerDialog>>()

    function shuffleSeats() {
      if(tournament.value && tournament.value.players.length > 0) {
        const shuffled = shuffleArray(generateRandomSeats(tournament.value?.players.length, tournament.value.settings.playerParameters.playersPerTable));
        for (let seat of shuffled) {
          tournament.value.players[shuffled.indexOf(seat)].seat = seat;
        }
        console.log(shuffled)

        tournamentsStore.updateTournament(tournament.value.id, {
          players: tournament.value.players,
        })
      }
    }
    
    function generateRandomSeats(numPlayers: number, seatsPerTable: number) {
      const numTables = Math.ceil(numPlayers / seatsPerTable); // Number of tables needed
      const players: string[] = []; // To store the final seat assignments
      const tables: string[] = []; // Available tables

      // Fill the players array with 'Player 1', 'Player 2', ..., 'Player n'
      for (let i = 1; i <= numPlayers; i++) {
        players.push(`Player ${i}`);
      }

      // Generate table identifiers (e.g., 1, 2, 3, ..., numTables)
      for (let table = 1; table <= numTables; table++) {
        tables.push(`${table}`);
      }

      // Now we will assign players to tables randomly
      const seatAssignments: string[] = [];
      
      // For each player, pick a random table, ensuring no table is picked twice until all tables have been used
      let availableTables = [...tables]; // Start with all tables available
      players.forEach((player, index) => {
        // Pick a random table from available ones
        const randomTableIndex = Math.floor(Math.random() * availableTables.length);
        const assignedTable = availableTables[randomTableIndex];
        
        // Remove the selected table from the available tables list
        availableTables = availableTables.filter(table => table !== assignedTable);

        // Determine the seat number on the selected table
        const seatNumber = Math.floor(index / numTables) + 1;

        // Assign the player to the table
        seatAssignments.push(`${assignedTable}-${seatNumber}`);
        
        // If all tables have been used, reset availableTables
        if (availableTables.length === 0) {
          availableTables = [...tables];
        }
      });

      // Return the seat assignments
      return seatAssignments;
    }

    // Fisher-Yates Shuffle algorithm to randomize the array
    function shuffleArray(array: any[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
      return array;
    }

    function handleMenuAction(playerIndex: number, action: { id: string; label: string; icon: string }) {
      console.log(`Received action from menu: ${action.id}`);
      switch(action.id) {
        case 'addon':
          if(tournament.value) {
            tournament.value.players[playerIndex].addons++;
            tournamentsStore.updateTournament(tournament.value.id, {
              players: tournament.value.players,
            })
          }
          break;
        case 'rebuy':
          if(tournament.value) {
            tournament.value.players[playerIndex].rebuys++;
            tournamentsStore.updateTournament(tournament.value.id, {
              players: tournament.value.players,
            })
          }
          break;
        case 'elimination':
          if(tournament.value) {
            tournament.value.players[playerIndex].out++;
            tournamentsStore.updateTournament(tournament.value.id, {
              players: tournament.value.players,
            })
          }
          break;
        case 'unregister':
          if(tournament.value) {
            tournament.value.players.splice(playerIndex,1);
            tournamentsStore.updateTournament(tournament.value.id, {
              players: tournament.value.players,
            })
          }
          break;
      }
    }

    function openNewPlayerDialog() {
      console.log(newPlayerDialog.value)
      newPlayerDialog.value?.open();
    }
    
    function addPlayer(playername: string) {
      console.log(playername)
      const playerExist = tournament.value?.players?.find(p => p.name === playername)
      if (tournament.value && !playerExist) {
        if(!tournament.value.players) {
          tournament.value.players = []
        }
        tournament.value.players.push({
          name: playername,
          seat: tournament.value.players.length.toString(),
          buyin: false,
          addons: 0,
          rebuys: 0,
          out: 0,
          knockouts: 0,
        })
        tournamentsStore.updateTournament(tournament.value.id, {
          players: tournament.value.players,
        })
      }
    }
  </script>
  
  <style scoped>
  .bg-bv-darkblue-700 {
    background-color: #1c3a57; /* Replace with your desired color */
  }
  
  .text-bv-darkblue-A300 {
    color: #6c8a99; /* Replace with your desired color */
  }
  
  .text-orange-500 {
    color: #fb8c00; /* Replace with your desired color */
  }
  
  .pad {
    padding: 20px;
  }
  .player-out {
    text-decoration: line-through;
    color: red;
  }
  </style>
  