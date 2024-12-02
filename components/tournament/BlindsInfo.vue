<template>
    <v-row style="font-family: 'LightStories';">
      <v-col cols="4" class="py-0">
        <div v-for="(level, index) in firstThird" :key="'first-' + index">
          <div v-if="!level.isBreak">
            <strong>Level: {{ levels.filter(l => !l.isBreak).indexOf(level) + 1 }}</strong>: {{ level.smallBlind }} / {{ level.bigBlind }}
          </div>
          <div v-else>
            <strong>Pause</strong>
          </div>
        </div>
      </v-col>
  
      <!-- Second Column (Second third of levels) -->
      <v-col cols="4" class="py-0">
        <div v-for="(level, index) in secondThird" :key="'second-' + index">
          <div v-if="!level.isBreak">
            <strong>Level: {{ levels.filter(l => !l.isBreak).indexOf(level) + 1 }}</strong>: {{ level.smallBlind }} / {{ level.bigBlind }}
          </div>
          <div v-else>
            <strong>Pause</strong>
          </div>
        </div>
      </v-col>
  
      <!-- Third Column (Last third of levels) -->
      <v-col cols="4" class="py-0">
        <div v-for="(level, index) in thirdThird" :key="'third-' + index">
          <div v-if="!level.isBreak">
            <strong>Level: {{ levels.filter(l => !l.isBreak).indexOf(level) + 1 }}</strong>: {{ level.smallBlind }} / {{ level.bigBlind }}
          </div>
          <div v-else>
            <strong>Pause</strong>
          </div>
        </div>
      </v-col>
    </v-row>
  </template>
  
  <script lang="ts" setup>
  import { computed } from 'vue';
  import { useTimerStore } from '@/stores/timer';
  
  const timerStore = useTimerStore();
  const levels = computed(() => timerStore.levels);
  
  const firstThird = computed(() => {
    const thirdLength = Math.ceil(levels.value.length / 3);
    return levels.value.slice(0, thirdLength);
  });
  
  const secondThird = computed(() => {
    const thirdLength = Math.ceil(levels.value.length / 3);
    return levels.value.slice(firstThird.value.length, firstThird.value.length + thirdLength);
  });
  
  const thirdThird = computed(() => {
    return levels.value.slice(firstThird.value.length + secondThird.value.length);
  });
  </script>
  
  <style scoped>
  .special-label {
    font-family: 'LightStories';
  }
  
  .blind-number {
    font-size: 35px;
    font-weight: bold;
  }
  </style>  