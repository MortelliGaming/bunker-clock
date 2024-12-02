// stores/tournamentStore.ts
import { defineStore } from 'pinia';
import type { Tournament } from './tournaments';

const defaultTournament = {
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
} as Tournament

export const useTournamentDialogStore = defineStore('tournament-dialog', () => {
  // State
  const tournament = ref<Tournament>(defaultTournament);

  function resetTournament(_tournament?: Tournament) {
    tournament.value = (_tournament || defaultTournament);
  }

  function createTournament() {
    if (tournament.value) {
      const tournamentsStore = useTournamentsStore();
      tournamentsStore.addTournament(tournament.value);
    }
  }


  return {
    tournament,
    resetTournament,
    createTournament,
  };
});
