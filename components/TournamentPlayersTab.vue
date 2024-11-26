<template>
    <v-row class="fill-height">
      <v-col cols="12" sm="6">
        1
      </v-col>
      <v-col cols="12" sm="6">
        <v-row>
            <v-col class="text-right">
                <v-btn>Spieler registrieren</v-btn>
                <v-btn class="ml-2">Plätze auslosen</v-btn>
            </v-col>
        </v-row>
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
                <tr v-for="(player, i) in tournament?.players ?? []">
                    <td>{{ player.seat ?? (i + ' (!)') }}</td>
                    <td>{{ player.name }}</td>
                    <td>{{ tournament?.settings.startStack}}</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Platz</td>
                    <td>Name</td>
                    <td>Stack</td>
                    <td></td>
                </tr>
            </tbody>
            
        </v-table>
        <v-row v-for="player in tournament?.players">
            {{ player }}
        </v-row>
      </v-col>
    </v-row>
  </template>
  
  <script lang="ts" setup>
    const router = ref(useRouter())
    const tournamentsStore = useTournamentsStore()
    const tournament = computed(() => {
        return tournamentsStore.tournaments.find(t => t.id == router.value.currentRoute.params.id)
    })
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
  </style>
  