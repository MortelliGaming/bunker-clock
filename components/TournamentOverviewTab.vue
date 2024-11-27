<template>
    <v-row no-gutters style="font-family: 'LightStories';">
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
                :current-level="currentLevel"
                @next-level="forward"
                @previous-level="previous"
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
</template>
<script lang ="ts" setup>


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

const isRoundUp = computed(() => timerStore.isRoundUp)
const mainTimer = computed(() => timerStore.mainTimer)

const tournament = computed(() => {
    return tournamentsStore.tournaments.find(t => t.id == router.value.currentRoute.params.id)
})

const playersOut = computed(() => {
    return tournament.value?.players?.reduce((sum, item) => sum + item.out, 0);
})
const playersRebuys = computed(() => {
    return tournament.value?.players?.reduce((sum, item) => sum + item.rebuys, 0);
})
const playersAddons = computed(() => {
    return tournament.value?.players?.reduce((sum, item) => sum + item.addons, 0);
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

const currentLevelIndex = ref(0)
const levels = computed(() => tournament.value?.settings.levels)
const currentLevel = computed(() => levels.value && levels.value[currentLevelIndex.value]);
const nextLevel = computed(() => (levels.value && levels.value.length > currentLevelIndex.value) && levels.value[currentLevelIndex.value + 1]);

function forward() {
    if(levels.value && levels.value.length > currentLevelIndex.value) {
        currentLevelIndex.value++;
    }
    timerStore.resetTimer((currentLevel.value?.time ?? 30) * 60);
    timerStore.toggleTimer();
}

function previous() {
    if(levels.value && currentLevelIndex.value > 0) {
        currentLevelIndex.value--;
    }
    timerStore.resetTimer((currentLevel.value?.time ?? 30) * 60);
    timerStore.toggleTimer();
}

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
