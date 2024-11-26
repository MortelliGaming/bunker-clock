// stores/timerStore.ts
import { defineStore } from 'pinia';
export const useTimerStore = defineStore('timer', () => {
  // State
  const isRoundUp = ref(false);
  const roundDuration = ref(1800); // Default round time (30 minutes)
  const mainTimer = ref(1800); // Main timer countdown
  const isRunning = ref(false); // Timer state
  const totalPlayTime = ref(0); // Total play time
  const nextBreakTime = ref(3600); // Time until the next break (default 1 hour)
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
          isRoundUp.value = true;
          setTimeout(() => {
            isRoundUp.value = false;
          }, 5000)
          // playAlarm();
          toggleTimer(); // Pause the timer when it reaches 0
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

  const prevLevel = () => {
    console.log('Previous Level');
    // Add logic to navigate to the previous level and update timers
  };

  const nextLevel = () => {
    console.log('Next Level');
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
    isRoundUp,
    roundDuration,
    mainTimer,
    isRunning,
    totalPlayTime,
    nextBreakTime,
    toggleTimer,
    resetTimer,
    prevLevel,
    nextLevel,
    formatTime,
    updateMainTimer,
    updateRoundDuration,
    stopTimer,
  };
});
