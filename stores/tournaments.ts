// stores/tournamentStore.ts
import { defineStore } from 'pinia';

export interface Tournament {
  id: string;
  name: string;
  date: string;
  startTime: string;
  template: string;
  settings: TournamentSettings;
  chipset: number[];
  players: Player[];
}

export interface TournamentLevel {
  time: number;
  smallBlind: number;
  bigBlind: number;
  isBreak: boolean;
}

export interface Player {
  name: string;
  seat: string;
  buyin: boolean;
  addons: number;
  rebuys: number;
  out: number;
  knockouts: number;
}

export interface TournamentSettings {
  expectedPlayers: number;
  managePlayers: boolean;
  playerParameters: {
    maxPlayers: number;
    playersPerTable:  number;
  }
  duration: number;
  trackKnockouts: boolean;
  managePayouts: boolean;
  buyIn: number;
  smallBlind: number;
  startStack: number;
  tournamentType: 'Freezeout' | 'Rebuy-Turnier' | 'Re-Entry Tournier';
  antes: boolean;
  rebuyChips: number;
  addonChips: number;
  levels: TournamentLevel[]
}

export const useTournamentsStore = defineStore('tournament', () => {
  // State
  const tournaments = ref<Tournament[]>([]);

  // Actions
  const addTournament = (tournament: Tournament) => {
    console.log('store save')
    tournaments.value.push({ ...tournament, id: generateId() });
    saveTournamentsToLocalStorage();
  };

  const removeTournament = (id: string) => {
    tournaments.value = tournaments.value.filter(t => t.id !== id);
    saveTournamentsToLocalStorage();
  };

  const updateTournament = (id: string, updatedData: Partial<Tournament>) => {
    const index = tournaments.value.findIndex(t => t.id === id);
    if (index !== -1) {
      tournaments.value[index] = { ...tournaments.value[index], ...updatedData };
    }
    saveTournamentsToLocalStorage();
  };

  // Getters
  const getTournamentById = (id: string) => {
    return tournaments.value.find(t => t.id === id);
  };

  // Utility function to generate unique IDs (for simplicity)
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const saveTournamentsToLocalStorage = () => {
    localStorage.setItem('bunker_clock_tournaments', JSON.stringify(tournaments.value))
    try {
      saveTournaments(tournaments.value)
    } catch {}
  };

  const loadTournamentsFromLocalStorage = async () => {
    try {
      await loadTournaments()
      if(tournaments.value && tournaments.value.length > 0) {
        saveTournamentsToLocalStorage();
      }
      return;
    } catch {}
    const savedTournaments = localStorage.getItem('bunker_clock_tournaments');
    if(savedTournaments)  {
        tournaments.value = JSON.parse(savedTournaments);
    }
  };
  async function saveTournaments(tournamentData: Tournament[]) {
    try {
      const response = await $fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: tournamentData }),
      })  
      console.log('Tournament saved successfully:', response);
    } catch (error) {
      console.error('Error saving tournament:', error);
    }
  };
  
  // Function to load tournaments from the server
  async function loadTournaments() {
    try {
      const response = await $fetch('/api/tournaments');
      tournaments.value = (response as any).message as Tournament[]; // Update local state with loaded tournaments
      console.log('Tournaments loaded:', tournaments.value);
    } catch (error) {
      console.error('Error loading tournaments:', error);
    }
  };
  
  return {
    tournaments,
    addTournament,
    removeTournament,
    updateTournament,
    getTournamentById,
    saveTournamentsToLocalStorage,
    loadTournamentsFromLocalStorage,
  };
});
