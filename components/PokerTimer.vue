<template>
  <v-col class="d-flex flex-column align-center clock-container">
    <!-- Top Row: Running Time and Next Break -->
    <v-row no-gutters style="width: 100%;">
      <!-- Running Time -->
      <v-col class="time-box text-left d-flex align-center">
        <v-icon color="orange">mdi-av-timer</v-icon>
        <div class="pt-1 ml-2">{{ formatTime(timerStore.totalPlayTime) }}</div>
      </v-col>
      <v-col></v-col>
      <!-- Next Break -->
      <v-col class="time-box justify-end d-flex align-center pr-3">
        <div class="pt-1 mr-2">{{ formatTime(timerStore.nextBreakTime) }}</div>
        <v-icon color="orange">mdi-coffee-outline</v-icon>
      </v-col>
    </v-row>

    <!-- Main Timer -->
    <div class="main-timer">
      <span>{{ formatTime(timerStore.mainTimer) }}</span>
    </div>

    <!-- Slider -->
    <v-slider
      :min="0"
      :max="timerStore.roundDuration"
      :model-value.number="timerStore.roundDuration - timerStore.mainTimer"
      :step="1"
      @update:model-value="(value) => {
        timerStore.updateMainTimer(timerStore.roundDuration - value);
      }"
      class="mt-4"
      color="orange"
      track-color="gray"
      thumb-color="white"
      width="70%"
    ></v-slider>

    <!-- Controls -->
    <div class="d-flex justify-center mt-4 controls">
      <v-btn icon @click="prevLevel">
        <v-icon>mdi-rewind</v-icon>
      </v-btn>

      <v-btn icon @click="toggleTimer">
        <v-icon>{{ timerStore.isRunning ? 'mdi-pause' : 'mdi-play' }}</v-icon>
      </v-btn>

      <v-btn icon @click="nextLevel">
        <v-icon>mdi-fast-forward</v-icon>
      </v-btn>
      <v-btn icon @click="toggleFullScreen">
        <v-icon>mdi-fullscreen</v-icon>
      </v-btn>
    </div>
  </v-col>
  <blinds-up-spinner v-if="timerStore.isRoundUp" :blindsText="currentLevel.isBreak ? 'Pause' : currentLevel.smallBlind + ' / ' + currentLevel.bigBlind" />
</template>

<script lang="ts" setup>
  
import alarmSoundFile from '@/assets/sounds/round-end.wav';
let alarmSound: HTMLAudioElement | null = null;
if (typeof window !== "undefined") {
  alarmSound = new Audio(alarmSoundFile);
}
//  BlindsUpSpinenr
const timerStore = useTimerStore();
const props = defineProps({
  currentLevel: {
    type: Object,
    required: true,
  }
})
const emit = defineEmits(['nextLevel', 'previousLevel'])

const isRoundUp = computed(() => timerStore.isRoundUp)
// Button actions
const prevLevel = () => {
  // timerStore.prevLevel();
  emit('previousLevel');
};

const nextLevel = () => {
  // timerStore.nextLevel();
  emit('nextLevel');
};

const toggleTimer = () => {
  timerStore.toggleTimer();
};

const toggleFullScreen = () => {
  console.log("Toggle Full Screen");
};

const playAlarm = () => {
  if (alarmSound) {
    alarmSound.play();
    setTimeout(() => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
    }, 2000);
  }
};

// Utility for time formatting
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

watch(isRoundUp, (newVal, oldVal) => {
  console.log('isRoundUp')
  console.log(isRoundUp)
  if(isRoundUp.value == true) {
    playAlarm();
  }
})
</script>

<style scoped>
.clock-container {
  padding: 16px;
}

.time-box {
  display: flex;
  align-items: center;
  font-size: 24px;
  color: #5a5a5a;
}

.time-box v-icon {
  margin-right: 8px;
}

.main-timer {
  font-size: 128px;
  font-weight: bold;
  color: #ff9800;
}

.controls v-btn {
  margin: 0 8px;
}
</style>
