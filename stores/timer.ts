// stores/timerStore.ts
import { defineStore } from 'pinia';
import type { Tournament, TournamentLevel } from './tournaments';
export const useTimerStore = defineStore('timer', () => {
  // State
  const roundDuration = ref(1800); // Default round time (30 minutes)
  const mainTimer = ref(1800); // Main timer countdown
  const isRunning = ref(false); // Timer state
  const totalPlayTime = ref(0); // Total play time
  
  // tournament settings
  const selectedTournament: Ref<Tournament|null> = ref(null);
  const currentLevelIndex = ref(0);
  const levels = computed(() => selectedTournament.value?.settings.levels ?? [])
  const currentLevel = computed(() => selectedTournament.value && (selectedTournament.value?.settings.levels.length ?? 0 > currentLevelIndex.value) ? selectedTournament.value.settings.levels[currentLevelIndex.value] : {
    smallBlind: 0,
    bigBlind: 0,
    isBreak: true,
    time: 5 * 60 * 60,
  } as TournamentLevel);
  const nextLevel = computed(() => (levels.value && levels.value.length > currentLevelIndex.value) && levels.value[currentLevelIndex.value + 1]);
  
  const nextBreakTime = computed(() => {
    if (!selectedTournament.value || !selectedTournament.value.settings.levels.length || currentLevel.value.isBreak) {
      return 0; // No tournament or levels defined
    }
  
    const levels = selectedTournament.value.settings.levels;
    let timeRemaining = 0;
    for (let i = currentLevelIndex.value + 1; i < levels.length; i++) {
      const level = levels[i];
      if (level.isBreak) {
        return timeRemaining + mainTimer.value; // Return time until the next break
      }
      timeRemaining += level.time * 60;
    }
    return timeRemaining + mainTimer.value; // Return total time if no break is found
  });
  
  let intervalId: number | null = null; // Holds the timer interval ID

  // Actions
  const toggleTimer = () => {
    isRunning.value = !isRunning.value;
    if (isRunning.value) {
      intervalId = window.setInterval(() => {
        if (mainTimer.value > 0) {
          mainTimer.value--;
          totalPlayTime.value++;
        } else {
          setTimeout(() => {
          }, 5000)
          forward()
          // playAlarm();
          // toggleTimer(); // Pause the timer when it reaches 0
        }
      }, 1000);
    } else {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  };

  const resetTimer = (roundTimeInMS: number) => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    roundDuration.value = roundTimeInMS;
    mainTimer.value = roundDuration.value;
    isRunning.value = false;
  };

  const back = () => {
    console.log('Previous Level');
    if(selectedTournament.value?.settings.levels && currentLevelIndex.value > 0) {
        currentLevelIndex.value--;
    }
    resetTimer((currentLevel.value?.time ?? 30) * 60);
    toggleTimer();
  };

  const forward = () => {
    console.log('Next Level');
    if(selectedTournament.value?.settings.levels && selectedTournament.value?.settings.levels.length > currentLevelIndex.value) {
        currentLevelIndex.value++;
    }
    resetTimer((currentLevel.value?.time ?? 30) * 60);
    toggleTimer();
    // Add logic to navigate to the next level and update timers
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  };

  const updateRoundDuration = (newDuration: number) => {
    roundDuration.value = newDuration;
    mainTimer.value = newDuration;
  };

  const updateMainTimer = (newDuration: number) => {
    mainTimer.value = newDuration;
  };
  

  // Cleanup
  const stopTimer = () => {
    if (intervalId !== null) {
      isRunning.value = false;
      clearInterval(intervalId);
      resetTimer(roundDuration.value);
    }
  };

  return {
    roundDuration,
    mainTimer,
    isRunning,
    selectedTournament,
    totalPlayTime,
    nextBreakTime,
    nextLevel,
    currentLevel,
    levels,
    toggleTimer,
    resetTimer,
    forward,
    back,
    formatTime,
    updateMainTimer,
    updateRoundDuration,
    stopTimer,
  };
});
