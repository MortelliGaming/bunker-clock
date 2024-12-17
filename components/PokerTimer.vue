<template>
  <v-col class="d-flex flex-column align-center clock-container">
    <!-- Top Row: Running Time and Next Break -->
    <v-row no-gutters style="width: 100%;">
      <!-- Running Time -->
      <v-col class="time-box text-left d-flex align-center">
        <v-icon color="orange">mdi-av-timer</v-icon>
        <div class="pt-1 ml-2">{{ formatTime(totalPlayTime) }}</div>
      </v-col>
      <v-col></v-col>
      <!-- Next Break -->
      <v-col class="time-box justify-end d-flex align-center pr-3">
        <div class="pt-1 mr-2">{{ formatTime(nextBreakTime) }}</div>
        <v-icon color="orange">mdi-coffee-outline</v-icon>
      </v-col>
    </v-row>

    <!-- Main Timer -->
    <div class="main-timer">
      <span>{{ formatTime(mainTimer) }}</span>
    </div>

    <!-- Slider -->
    <v-slider
      :min="0"
      :max="roundDuration"
      :model-value.number="(roundDuration - mainTimer) || 0"
      :step="1"
      @update:model-value="(value: number) => {
        try {
          updateMainTimer(roundDuration - value);
        } catch {}
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
        <v-icon>{{ isRunning ? 'mdi-pause' : 'mdi-play' }}</v-icon>
      </v-btn>

      <v-btn icon @click="nextLevel">
        <v-icon>mdi-fast-forward</v-icon>
      </v-btn>
      <v-btn icon @click="toggleFullScreen">
        <v-icon>mdi-fullscreen</v-icon>
      </v-btn>
    </div>
  </v-col>
</template>

<script lang="ts" setup>
//  BlindsUpSpinenr
const {
  mainTimer,
  isRunning,
  totalPlayTime,
  nextBreakTime,
  roundDuration,
} = storeToRefs(useTimerStore())
const { forward, back, toggleTimer, formatTime, updateMainTimer } = useTimerStore()
const emit = defineEmits()

// Button actions
const prevLevel = () => {
  back();
};

const nextLevel = () => {
  forward();
};

const toggleFullScreen = () => {
  console.log("Toggle Full Screen");
};
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
