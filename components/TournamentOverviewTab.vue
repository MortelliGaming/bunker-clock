<template>
    <v-row style="font-family: 'LightStories';">
        <v-col class="tournament-box" cols="3">
            <v-img
                src="/icons/bunkerclock.png"
                alt="Club Logo"
                height="200px" />
            <div class="d-flex flex-column pt-3">
                <h2 class="text-center text-orange special-label">Spieler</h2>
                <h3 class="text-center special-label stack-number">
                    {{ remainingPlayers }} / {{ (tournament?.players?.length ?? 0)  }}
                </h3>
            </div>
            <div class="d-flex flex-column pt-3 pb-2">
                <h2 class="text-center text-orange special-label">∅ Stack</h2>
                <h3 class="text-center special-label stack-number">{{ `${averageStack}` }}</h3>
            </div>
        </v-col>
        <v-col class="tournament-box" cols="7">
            <poker-timer
                v-if="currentLevel"
            />
        </v-col>
        <v-col cols="2" class="tournament-box">
            <v-row class="fill-height" no-gutters>
                <v-col cols="12" class="d-flex flex-column justify-center align-center pa-0" style="border-bottom: 1px solid;">
                    <h3 class="text-orange">Current Blinds</h3> 
                    <div class="blind-number" v-if="currentLevel ? !currentLevel.isBreak : false">
                        {{ currentLevel?.smallBlind }} / {{ currentLevel?.bigBlind}}
                    </div>
                    <div class="blind-number" v-else>
                        {{ 'Pause' }}
                    </div>
                </v-col>
                <v-col cols="12" class="d-flex flex-column justify-center align-center">
                    <h3 class="text-orange">Next Blinds</h3>
                    <div class="blind-number" v-if="nextLevel ? !nextLevel.isBreak : false">
                        {{ nextLevel ? nextLevel.smallBlind : '' }} / {{ nextLevel ? nextLevel.bigBlind : '' }}
                    </div>
                    <div class="blind-number" v-else>
                        {{ 'Pause' }}
                    </div>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
    <v-row style="font-family: 'LightStories';">
        <v-col cols="8"  style="border: 1px solid;" class=" pb-5">
            <v-row>
                <v-col cols="12" class="text-center pb-0">Blinds</v-col>
            </v-row>
            <v-row>
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
        </v-col>
        <v-col cols="4"  style="border: 1px solid;" class="pb-5">
            <v-row>
                <v-col>Preise</v-col>
            </v-row>
            <v-row>
                <v-col class="py-0" cols="4">Pot</v-col>
                <v-col class="py-0" cols="8">{{ totalPot }}</v-col>
            </v-row>
            <v-row>
                <v-col class="py-0" cols="12">
                    <hr class="mb-2" />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="py-0" cols="4">1. Platz</v-col>
                <v-col class="py-0" cols="8">{{ (totalPot * 0.5).toFixed(2) }}</v-col>
            </v-row>
            <v-row>
                <v-col class="py-0" cols="4">2. Platz</v-col>
                <v-col class="py-0" cols="8">{{ (totalPot * 0.3).toFixed(2) }}</v-col>
            </v-row>
            <v-row>
                <v-col class="py-0" cols="4">3. Platz</v-col>
                <v-col class="py-0" cols="8">{{ (totalPot * 0.2).toFixed(2) }}</v-col>
            </v-row>
        </v-col>
    </v-row>
    <blinds-up-spinner v-if="showBlindsUpSpinner" :blindsText="currentLevel.isBreak ? 'Pause' : currentLevel.smallBlind + ' / ' + currentLevel.bigBlind" />
</template>
<script lang ="ts" setup>
import fiveMinuteBlindUp from '@/assets/sounds/blinds_up_5_min.mp3';
import fiveMinuteBreak from '@/assets/sounds/break_in_5_min.mp3';

import alarmSoundFile from '@/assets/sounds/round-end.mp3';

let alarmSound: HTMLAudioElement | null = null;
if (typeof window !== "undefined") {
  alarmSound = new Audio(alarmSoundFile);
}
const showBlindsUpSpinner = ref(false)
const playAlarm = () => {
  if (alarmSound) {
    alarmSound.play();
    setTimeout(() => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
    }, 2000);
  }
};

let fiveMinuteBreakAudio: HTMLAudioElement | null = null;
if (typeof window !== "undefined") {
  fiveMinuteBreakAudio = new Audio(fiveMinuteBreak);
}
let fiveMinuteBlindsUpAudio: HTMLAudioElement | null = null;
if (typeof window !== "undefined") {
  fiveMinuteBlindsUpAudio = new Audio(fiveMinuteBlindUp);
}

const router = ref(useRouter())
const tournamentsStore = useTournamentsStore()
const timerStore = useTimerStore()

const mainTimer = computed(() => timerStore.mainTimer)

const tournament = computed(() => {
    return tournamentsStore.tournaments.find(t => t.id == router.value.currentRoute.params.id)
})

const playersOut = computed(() => {
    return tournament.value?.players?.reduce((sum, item) => sum + item.out, 0) ?? 0;
})
const playersRebuys = computed(() => {
    return tournament.value?.players?.reduce((sum, item) => sum + item.rebuys, 0) ?? 0;
})
const playersAddons = computed(() => {
    return tournament.value?.players?.reduce((sum, item) => sum + item.addons, 0) ?? 0;
})
const totalPot = computed(() => {
    return (playersAddons.value + playersRebuys.value + (tournament.value?.players?.length ?? 0)) * (tournament.value?.settings.buyIn ?? 0);
})
const remainingPlayers = computed(() => {
    return (tournament.value?.players?.length ?? 0) - (playersOut.value || 0);
})
const totalChipsStartStacks = computed(() => {
    return ((tournament.value?.settings.startStack ?? 0) * (tournament.value?.players?.length ?? 0));
})
const totalChipsRebuys = computed(() => {
    return ((tournament.value?.settings.rebuyChips ?? 0) * (playersRebuys.value ?? 0));
})
const totalChipsAddons = computed(() => {
    return ((tournament.value?.settings.addonChips ?? 0) * (playersAddons.value ?? 0));
})
const totalChipsInGame = computed(() => {
    return totalChipsStartStacks.value + totalChipsAddons.value + totalChipsRebuys.value;
})
const averageStack = computed(() => {
    return (totalChipsInGame.value / (remainingPlayers.value > 0 ? remainingPlayers.value : 1)).toFixed(0);
})

const levels = computed(() => timerStore.levels)
const currentLevel = computed(() => timerStore.currentLevel)
const nextLevel = computed(() => timerStore.nextLevel)

const firstThird = computed(() => {
  const thirdLength = Math.ceil(levels.value.length / 3);  // Round up to ensure the first two columns get more if needed
  return levels.value.slice(0, thirdLength);
});

const secondThird = computed(() => {
  const thirdLength = Math.ceil(levels.value.length / 3);
  return levels.value.slice(firstThird.value.length, firstThird.value.length + thirdLength);
});

const thirdThird = computed(() => {
  // Last third should get the remaining levels
  return levels.value.slice(firstThird.value.length + secondThird.value.length);
});

/* 
watch(isRoundUp, (newVal, oldVal) => {
  console.log('isRoundUp')
  console.log(isRoundUp)
  if(isRoundUp.value == true) {
    if(levels.value && levels.value.length > currentLevelIndex.value) {
        currentLevelIndex.value++;
        timerStore.resetTimer((currentLevel.value?.time ?? 30) * 60);
        timerStore.toggleTimer();
    }
  }
})
*/


watch(mainTimer, () => {
  if(mainTimer.value == 5 * 60) {
    // 5 minutes warning
    if(nextLevel.value && nextLevel.value.isBreak) {
      // probably not a break anymore
      fiveMinuteBreakAudio?.play();
    } else {
      fiveMinuteBlindsUpAudio?.play();
    }
  }
  if(mainTimer.value == 0) {
    playAlarm();
    showBlindsUpSpinner.value = true;
    setTimeout(() => {
        showBlindsUpSpinner.value = false;
    }, 5000)
  }
})

onMounted(() => {
    tournamentsStore.loadTournamentsFromLocalStorage();
    timerStore.selectedTournament = tournamentsStore.tournaments.find(t => t.id === router.value.currentRoute.params.id) ?? null
})
</script>


<style lang="scss">

.special-label {
  font-family: 'LightStories';
}

.tournament-box {
  border: 1px solid #ddd;
}

.blind-number {
    font-size: 35px;
    font-weight: bold;
}

.stack-number {
    font-size: 35px;
    font-weight: bold;
}
</style>

<style scoped>
.flow-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Adjust column width */
  grid-auto-rows: minmax(100px, auto); /* Row height adjusts automatically */
  grid-auto-flow: column; /* Fill down first, then right */
  gap: 16px; /* Space between items */
  height: 100%; /* Fill remaining height */
}

.level-cell {
  font-size: small;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 8px;
  text-align: center;
}

.level-cell.is-break {
  font-style: italic;
  font-weight: bold;
}
</style>