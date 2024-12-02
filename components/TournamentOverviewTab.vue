<template>
    <v-row style="font-family: 'LightStories';">
        <player-info
            :remainingPlayers="remainingPlayers"
            :totalPlayers="selectedTournament?.players?.length ?? 0"
            :averageStack="averageStack"
        />
        <v-col class="tournament-box" cols="7">
            <poker-timer
                v-if="currentLevel"
            />
        </v-col>
        <v-col cols="2" class="tournament-box">
            <levels-info
                :currentLevel="currentLevel"
                :nextLevel="nextLevel"
            />
        </v-col>
    </v-row>
    <v-row style="font-family: 'LightStories';">
        <v-col cols="8"  style="border: 1px solid;" class=" pb-5">
            <v-row>
                <v-col cols="12" class="text-center pb-0">Blinds</v-col>
            </v-row>
            <blinds-info />
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
import BlindsInfo from './tournament/BlindsInfo.vue';
import PlayerInfo from './tournament/PlayerInfo.vue';
import LevelsInfo from './tournament/LevelsInfo.vue';

import fiveMinuteBlindUp from '@/assets/sounds/blinds_up_5_min.mp3';
import fiveMinuteBreak from '@/assets/sounds/break_in_5_min.mp3';
import alarmSoundFile from '@/assets/sounds/round-end.mp3';

const showBlindsUpSpinner = ref(false)

let alarmSound: HTMLAudioElement | null = null;
if (typeof window !== "undefined") {
  alarmSound = new Audio(alarmSoundFile);
}
let fiveMinuteBreakAudio: HTMLAudioElement | null = null;
if (typeof window !== "undefined") {
  fiveMinuteBreakAudio = new Audio(fiveMinuteBreak);
}
let fiveMinuteBlindsUpAudio: HTMLAudioElement | null = null;
if (typeof window !== "undefined") {
  fiveMinuteBlindsUpAudio = new Audio(fiveMinuteBlindUp);
}
const router = ref(useRouter())
const {
    loadTournamentsFromLocalStorage,
} = useTournamentsStore()
const {
    tournaments
} = storeToRefs(useTournamentsStore())

const {
    forward,
} = useTimerStore()
const {
    mainTimer,
    selectedTournament,
    currentLevel,
    nextLevel,
} = storeToRefs(useTimerStore())

const playersOut = computed(() => {
    return selectedTournament.value?.players?.reduce((sum, item) => sum + item.out, 0) ?? 0;
})
const playersRebuys = computed(() => {
    return selectedTournament.value?.players?.reduce((sum, item) => sum + item.rebuys, 0) ?? 0;
})
const playersAddons = computed(() => {
    return selectedTournament.value?.players?.reduce((sum, item) => sum + item.addons, 0) ?? 0;
})
const totalPot = computed(() => {
    return (playersAddons.value + playersRebuys.value + (selectedTournament.value?.players?.length ?? 0)) * (selectedTournament.value?.settings.buyIn ?? 0);
})
const remainingPlayers = computed(() => {
    return (selectedTournament.value?.players?.length ?? 0) - (playersOut.value || 0);
})
const totalChipsStartStacks = computed(() => {
    return ((selectedTournament.value?.settings.startStack ?? 0) * (selectedTournament.value?.players?.length ?? 0));
})
const totalChipsRebuys = computed(() => {
    return ((selectedTournament.value?.settings.rebuyChips ?? 0) * (playersRebuys.value ?? 0));
})
const totalChipsAddons = computed(() => {
    return ((selectedTournament.value?.settings.addonChips ?? 0) * (playersAddons.value ?? 0));
})
const totalChipsInGame = computed(() => {
    return totalChipsStartStacks.value + totalChipsAddons.value + totalChipsRebuys.value;
})
const averageStack = computed(() => {
    return (totalChipsInGame.value / (remainingPlayers.value > 0 ? remainingPlayers.value : 1)).toFixed(0);
})

const playAlarm = () => {
  if (alarmSound) {
    alarmSound.play();
    setTimeout(() => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
    }, 2500);
  }
};

watch(mainTimer, () => {
  // Blind warnings
  if(mainTimer.value == 5 * 60) {
    // 5 minutes warning
    if(nextLevel.value && nextLevel.value.isBreak) {
      // probably not a break anymore
      fiveMinuteBreakAudio?.play();
    } else {
      fiveMinuteBlindsUpAudio?.play();
    }
  }
  // Level up Alarm
  if(mainTimer.value == 0) {
    forward();
    playAlarm();
    showBlindsUpSpinner.value = true;
    setTimeout(() => {
        showBlindsUpSpinner.value = false;
    }, 5000)
  }
})

onMounted(() => {
    loadTournamentsFromLocalStorage();
    selectedTournament.value = tournaments.value.find(t => t.id === router.value.currentRoute.params.id) ?? null
})
</script>


<style lang="scss">
.tournament-box {
  border: 1px solid #ddd;
}
</style>